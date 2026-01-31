-- HireShield Email Notification System
-- Migration: 002_email_notifications.sql

-- ============================================
-- EMAIL PREFERENCES (per user)
-- ============================================
CREATE TABLE IF NOT EXISTS email_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  audit_reminders BOOLEAN DEFAULT true,
  training_reminders BOOLEAN DEFAULT true,
  law_alerts BOOLEAN DEFAULT true,
  weekly_digest BOOLEAN DEFAULT false,
  marketing BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_email_prefs_user ON email_preferences(user_id);

-- ============================================
-- EMAIL QUEUE (pending emails to send)
-- ============================================
CREATE TABLE IF NOT EXISTS email_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  email_type TEXT NOT NULL, -- 'audit_reminder', 'training_expiry', 'law_alert', 'weekly_digest', 'onboarding', 'inactivity'
  to_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  html_body TEXT NOT NULL,
  text_body TEXT,
  metadata JSONB DEFAULT '{}', -- Additional context for the email
  status TEXT DEFAULT 'pending', -- 'pending', 'sent', 'failed'
  attempts INTEGER DEFAULT 0,
  last_attempt_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_email_queue_status ON email_queue(status);
CREATE INDEX idx_email_queue_user ON email_queue(user_id);
CREATE INDEX idx_email_queue_created ON email_queue(created_at DESC);

-- ============================================
-- EMAIL LOGS (sent email history)
-- ============================================
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  email_type TEXT NOT NULL,
  to_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  resend_id TEXT, -- ID from Resend API
  status TEXT DEFAULT 'sent',
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_email_logs_user ON email_logs(user_id);
CREATE INDEX idx_email_logs_type ON email_logs(email_type);

-- ============================================
-- LAW UPDATES (for law alert emails)
-- ============================================
CREATE TABLE IF NOT EXISTS law_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  state_code TEXT NOT NULL,
  law_name TEXT NOT NULL,
  status TEXT NOT NULL, -- 'passed', 'signed', 'effective', 'amended'
  effective_date DATE,
  summary TEXT NOT NULL,
  action_items TEXT[],
  affected_document_types TEXT[], -- 'disclosure', 'consent', 'policy'
  notified_at TIMESTAMPTZ, -- When we sent alerts
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_law_updates_state ON law_updates(state_code);
CREATE INDEX idx_law_updates_notified ON law_updates(notified_at);

-- ============================================
-- ADD FIELDS TO EXISTING TABLES
-- ============================================

-- Add last_audit_at to organizations for reminder tracking
ALTER TABLE organizations 
ADD COLUMN IF NOT EXISTS last_audit_at TIMESTAMPTZ;

-- Add last_login_at to profiles for inactivity tracking
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ DEFAULT NOW();

-- Add expires_at to training_completions for cert expiry
ALTER TABLE training_completions 
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;

-- Update expires_at to 1 year from completion by default
UPDATE training_completions 
SET expires_at = completed_at + INTERVAL '1 year' 
WHERE completed_at IS NOT NULL AND expires_at IS NULL;

-- ============================================
-- RLS POLICIES
-- ============================================

ALTER TABLE email_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE law_updates ENABLE ROW LEVEL SECURITY;

-- Email preferences: Users manage their own
CREATE POLICY "Users can manage own email prefs" ON email_preferences FOR ALL 
  USING (user_id = auth.uid());

-- Email queue: Service role only
CREATE POLICY "Service role manages queue" ON email_queue FOR ALL 
  USING (auth.role() = 'service_role');

-- Email logs: Users can view their own, service role can insert
CREATE POLICY "Users can view own email logs" ON email_logs FOR SELECT 
  USING (user_id = auth.uid());
CREATE POLICY "Service role can insert logs" ON email_logs FOR INSERT 
  WITH CHECK (auth.role() = 'service_role');

-- Law updates: Everyone can read
CREATE POLICY "Anyone can view law updates" ON law_updates FOR SELECT 
  USING (true);
CREATE POLICY "Service role manages law updates" ON law_updates FOR ALL 
  USING (auth.role() = 'service_role');

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Create default email preferences on profile creation
CREATE OR REPLACE FUNCTION create_email_preferences()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO email_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_profile_created_email_prefs ON profiles;
CREATE TRIGGER on_profile_created_email_prefs
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION create_email_preferences();

-- Update last_login_at on auth
CREATE OR REPLACE FUNCTION update_last_login()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles 
  SET last_login_at = NOW(), updated_at = NOW()
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- EMAIL QUEUE HELPER FUNCTION
-- ============================================

-- Function to queue an email (called by triggers or Edge Functions)
CREATE OR REPLACE FUNCTION queue_email(
  p_user_id UUID,
  p_email_type TEXT,
  p_to_email TEXT,
  p_subject TEXT,
  p_html_body TEXT,
  p_text_body TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
  v_email_id UUID;
  v_prefs email_preferences;
BEGIN
  -- Check user preferences
  SELECT * INTO v_prefs FROM email_preferences WHERE user_id = p_user_id;
  
  -- Skip if user has disabled this email type
  IF v_prefs IS NOT NULL THEN
    IF p_email_type = 'audit_reminder' AND NOT v_prefs.audit_reminders THEN
      RETURN NULL;
    END IF;
    IF p_email_type = 'training_expiry' AND NOT v_prefs.training_reminders THEN
      RETURN NULL;
    END IF;
    IF p_email_type = 'law_alert' AND NOT v_prefs.law_alerts THEN
      RETURN NULL;
    END IF;
    IF p_email_type = 'weekly_digest' AND NOT v_prefs.weekly_digest THEN
      RETURN NULL;
    END IF;
  END IF;
  
  -- Insert into queue
  INSERT INTO email_queue (user_id, email_type, to_email, subject, html_body, text_body, metadata)
  VALUES (p_user_id, p_email_type, p_to_email, p_subject, p_html_body, p_text_body, p_metadata)
  RETURNING id INTO v_email_id;
  
  RETURN v_email_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- SCHEDULED JOBS (requires pg_cron extension)
-- ============================================

-- Note: Enable pg_cron in Supabase Dashboard > Database > Extensions

-- Check for quarterly audit reminders (daily at 9am UTC)
-- SELECT cron.schedule('audit-reminders', '0 9 * * *', $$
--   SELECT net.http_post(
--     'https://your-project.supabase.co/functions/v1/check-audit-reminders',
--     '{}',
--     '{"Content-Type": "application/json", "Authorization": "Bearer YOUR_SERVICE_KEY"}'
--   );
-- $$);

-- Check for training expiry (daily at 9am UTC)  
-- SELECT cron.schedule('training-expiry', '0 9 * * *', $$
--   SELECT net.http_post(
--     'https://your-project.supabase.co/functions/v1/check-training-expiry',
--     '{}',
--     '{"Content-Type": "application/json", "Authorization": "Bearer YOUR_SERVICE_KEY"}'
--   );
-- $$);

-- Process email queue (every 5 minutes)
-- SELECT cron.schedule('process-email-queue', '*/5 * * * *', $$
--   SELECT net.http_post(
--     'https://your-project.supabase.co/functions/v1/process-email-queue',
--     '{}',
--     '{"Content-Type": "application/json", "Authorization": "Bearer YOUR_SERVICE_KEY"}'
--   );
-- $$);

-- Weekly digest (Monday 8am UTC)
-- SELECT cron.schedule('weekly-digest', '0 8 * * 1', $$
--   SELECT net.http_post(
--     'https://your-project.supabase.co/functions/v1/send-weekly-digest',
--     '{}',
--     '{"Content-Type": "application/json", "Authorization": "Bearer YOUR_SERVICE_KEY"}'
--   );
-- $$);
