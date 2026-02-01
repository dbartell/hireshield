-- Migration: Training Platform
-- Enables team training assignments with track-based courses and certifications

-- ============================================
-- TRAINING ASSIGNMENTS
-- ============================================
CREATE TABLE IF NOT EXISTS training_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  user_name TEXT NOT NULL,
  track TEXT NOT NULL CHECK (track IN ('recruiter', 'manager', 'admin', 'executive')),
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  assigned_by UUID REFERENCES auth.users(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  completed_at TIMESTAMPTZ,
  certificate_id UUID,
  magic_token TEXT UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  token_expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '30 days',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_training_assignments_org ON training_assignments(org_id);
CREATE INDEX idx_training_assignments_email ON training_assignments(user_email);
CREATE INDEX idx_training_assignments_token ON training_assignments(magic_token);
CREATE INDEX idx_training_assignments_status ON training_assignments(status);

-- ============================================
-- TRAINING PROGRESS (per section)
-- ============================================
CREATE TABLE IF NOT EXISTS training_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assignment_id UUID REFERENCES training_assignments(id) ON DELETE CASCADE,
  section_number INTEGER NOT NULL,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  video_watched_seconds INTEGER DEFAULT 0,
  video_total_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(assignment_id, section_number)
);

CREATE INDEX idx_training_progress_assignment ON training_progress(assignment_id);

-- ============================================
-- QUIZ ATTEMPTS
-- ============================================
CREATE TABLE IF NOT EXISTS training_quiz_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assignment_id UUID REFERENCES training_assignments(id) ON DELETE CASCADE,
  section_number INTEGER NOT NULL,
  answers JSONB NOT NULL DEFAULT '{}',
  score INTEGER NOT NULL DEFAULT 0,
  passed BOOLEAN NOT NULL DEFAULT false,
  attempted_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_training_quiz_assignment ON training_quiz_attempts(assignment_id);
CREATE INDEX idx_training_quiz_section ON training_quiz_attempts(assignment_id, section_number);

-- ============================================
-- TRAINING CERTIFICATES
-- ============================================
CREATE TABLE IF NOT EXISTS training_certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assignment_id UUID UNIQUE REFERENCES training_assignments(id) ON DELETE CASCADE,
  certificate_number TEXT UNIQUE NOT NULL,
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_training_certs_assignment ON training_certificates(assignment_id);
CREATE INDEX idx_training_certs_number ON training_certificates(certificate_number);
CREATE INDEX idx_training_certs_expires ON training_certificates(expires_at);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE training_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_certificates ENABLE ROW LEVEL SECURITY;

-- Training assignments: Org members can view their org's assignments
CREATE POLICY "Org members can view training assignments" ON training_assignments
  FOR SELECT USING (
    org_id IN (
      SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
    )
    OR magic_token IS NOT NULL -- Allow viewing by token for trainees
  );

-- Training assignments: Admins/Owners can create assignments
CREATE POLICY "Admins can create training assignments" ON training_assignments
  FOR INSERT WITH CHECK (
    org_id IN (
      SELECT organization_id FROM organization_members 
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- Training assignments: Admins/Owners can update assignments
CREATE POLICY "Admins can update training assignments" ON training_assignments
  FOR UPDATE USING (
    org_id IN (
      SELECT organization_id FROM organization_members 
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
    OR magic_token IS NOT NULL -- Trainees can update their own progress
  );

-- Training assignments: Admins/Owners can delete assignments
CREATE POLICY "Admins can delete training assignments" ON training_assignments
  FOR DELETE USING (
    org_id IN (
      SELECT organization_id FROM organization_members 
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- Training progress: Anyone with assignment access can view/modify
CREATE POLICY "Can view training progress" ON training_progress
  FOR SELECT USING (
    assignment_id IN (
      SELECT id FROM training_assignments 
      WHERE org_id IN (
        SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
      )
      OR magic_token IS NOT NULL
    )
  );

CREATE POLICY "Can create training progress" ON training_progress
  FOR INSERT WITH CHECK (
    assignment_id IN (SELECT id FROM training_assignments)
  );

CREATE POLICY "Can update training progress" ON training_progress
  FOR UPDATE USING (
    assignment_id IN (SELECT id FROM training_assignments)
  );

-- Quiz attempts: Similar access pattern
CREATE POLICY "Can view quiz attempts" ON training_quiz_attempts
  FOR SELECT USING (
    assignment_id IN (
      SELECT id FROM training_assignments 
      WHERE org_id IN (
        SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
      )
      OR magic_token IS NOT NULL
    )
  );

CREATE POLICY "Can create quiz attempts" ON training_quiz_attempts
  FOR INSERT WITH CHECK (
    assignment_id IN (SELECT id FROM training_assignments)
  );

-- Certificates: Viewable by org and publicly by certificate number
CREATE POLICY "Can view certificates" ON training_certificates
  FOR SELECT USING (
    assignment_id IN (
      SELECT id FROM training_assignments 
      WHERE org_id IN (
        SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
      )
    )
    OR certificate_number IS NOT NULL -- Public verification
  );

CREATE POLICY "Service can create certificates" ON training_certificates
  FOR INSERT WITH CHECK (true);

-- ============================================
-- HELPER FUNCTION: Generate certificate number
-- ============================================
CREATE OR REPLACE FUNCTION generate_certificate_number(track TEXT)
RETURNS TEXT AS $$
DECLARE
  prefix TEXT;
  year_part TEXT;
  random_part TEXT;
BEGIN
  -- Prefix based on track
  prefix := CASE track
    WHEN 'recruiter' THEN 'REC'
    WHEN 'manager' THEN 'MGR'
    WHEN 'admin' THEN 'ADM'
    WHEN 'executive' THEN 'EXC'
    ELSE 'TRN'
  END;
  
  year_part := EXTRACT(YEAR FROM NOW())::TEXT;
  random_part := LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  
  RETURN prefix || '-' || year_part || '-' || random_part;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- HELPER FUNCTION: Update assignment status
-- ============================================
CREATE OR REPLACE FUNCTION update_training_assignment_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if all sections are complete
  IF NEW.completed_at IS NOT NULL AND OLD.completed_at IS NULL THEN
    -- A section was just completed, check if track is done
    -- This will be handled by the application logic
    NULL;
  END IF;
  
  -- Update parent assignment status to in_progress if this is first progress
  UPDATE training_assignments
  SET status = 'in_progress', updated_at = NOW()
  WHERE id = NEW.assignment_id 
    AND status = 'pending';
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_training_progress_update ON training_progress;
CREATE TRIGGER on_training_progress_update
  AFTER INSERT OR UPDATE ON training_progress
  FOR EACH ROW EXECUTE FUNCTION update_training_assignment_status();

-- ============================================
-- CERTIFICATE EXPIRY NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS training_cert_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  certificate_id UUID REFERENCES training_certificates(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL CHECK (notification_type IN ('day_30', 'day_7', 'day_0')),
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  email_to TEXT,
  email_message_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(certificate_id, notification_type)
);

CREATE INDEX idx_cert_notifications_cert ON training_cert_notifications(certificate_id);
