// Email templates for AIHireLaw notifications
// Used by both Edge Functions and server actions

export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://app.aihirelaw.com'

// Base email wrapper
export function emailWrapper(content: string, footerText?: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
      line-height: 1.6; 
      color: #1f2937;
      margin: 0;
      padding: 0;
      background: #f3f4f6;
    }
    .container { 
      max-width: 600px; 
      margin: 0 auto; 
      padding: 20px;
    }
    .card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .header { 
      background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
      color: white; 
      padding: 24px; 
    }
    .header h1 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
    }
    .content { 
      padding: 24px; 
    }
    .stat-box { 
      background: #f9fafb; 
      padding: 16px; 
      border-radius: 8px; 
      margin: 16px 0;
      border: 1px solid #e5e7eb;
    }
    .cta { 
      display: inline-block; 
      background: #1e40af; 
      color: white !important; 
      padding: 14px 28px; 
      text-decoration: none; 
      border-radius: 8px; 
      margin: 20px 0;
      font-weight: 500;
    }
    .cta:hover {
      background: #1e3a8a;
    }
    .footer { 
      color: #6b7280; 
      font-size: 13px; 
      padding: 24px;
      text-align: center;
    }
    .footer a {
      color: #6b7280;
    }
    .urgent-header {
      background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
    }
    .urgent-content {
      background: #fef2f2;
      border: 1px solid #fecaca;
    }
    .urgent-cta {
      background: #dc2626;
    }
    ul, ol { padding-left: 20px; }
    li { margin: 8px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      ${content}
    </div>
    <div class="footer">
      ${footerText || `<p>You're receiving this email from AIHireLaw.</p>`}
      <p><a href="${APP_URL}/settings/notifications">Manage email preferences</a> · <a href="${APP_URL}">Open AIHireLaw</a></p>
    </div>
  </div>
</body>
</html>`
}

// Quarterly audit reminder
export function auditReminderEmail(params: {
  name: string
  lastAudit: string
  riskScore: string | number
  quarter: number
}): { subject: string; html: string } {
  const content = `
    <div class="header">
      <h1>⚠️ Time for your Q${params.quarter} compliance audit</h1>
    </div>
    <div class="content">
      <p>Hi ${params.name},</p>
      
      <p>It's been 90 days since your last AI hiring compliance audit.</p>
      
      <p>Regular audits are required by NYC Local Law 144 and recommended under Colorado's AI Act. More importantly, they catch issues before they become violations.</p>
      
      <div class="stat-box">
        <strong>Your last audit:</strong> ${params.lastAudit}<br>
        <strong>Current risk score:</strong> ${params.riskScore}
      </div>
      
      <a href="${APP_URL}/audit" class="cta">Run your Q${params.quarter} audit now →</a>
      
      <p>Takes about 10 minutes. Your previous answers are pre-loaded.</p>
      
      <p>— The AIHireLaw Team</p>
      
      <p style="color: #6b7280; font-size: 14px;">P.S. Companies that audit quarterly catch 3x more compliance gaps before regulators do.</p>
    </div>`

  return {
    subject: `⚠️ Time for your Q${params.quarter} compliance audit`,
    html: emailWrapper(content, `<p>You're receiving this because you have audit reminders enabled.</p>`),
  }
}

// Training certification expiring
export function trainingExpiryEmail(params: {
  name: string
  courseName: string
  expiryDate: string
}): { subject: string; html: string } {
  const content = `
    <div class="header">
      <h1>📜 Your certification expires in 30 days</h1>
    </div>
    <div class="content">
      <p>Hi ${params.name},</p>
      
      <p>Your <strong>"${params.courseName}"</strong> certification expires on <strong>${params.expiryDate}</strong>.</p>
      
      <p>Most state regulations require annual compliance training for HR teams handling AI-assisted hiring. Letting your certification lapse could be a liability.</p>
      
      <div class="stat-box">
        <strong>Course:</strong> ${params.courseName}<br>
        <strong>Expires:</strong> ${params.expiryDate}
      </div>
      
      <p><strong>Quick refresh:</strong> The recertification module takes ~15 minutes and covers any law updates from the past year.</p>
      
      <a href="${APP_URL}/training" class="cta">Recertify now →</a>
      
      <p>Your certificate will be updated automatically upon completion.</p>
      
      <p>— The AIHireLaw Team</p>
    </div>`

  return {
    subject: `Your ${params.courseName} certification expires in 30 days`,
    html: emailWrapper(content, `<p>You're receiving this because you have training reminders enabled.</p>`),
  }
}

// Law update alert (urgent)
export function lawAlertEmail(params: {
  name: string
  stateCode: string
  lawName: string
  status: string
  effectiveDate: string
  summary: string
  actionItems: string[]
}): { subject: string; html: string } {
  const statusVerbs: Record<string, string> = {
    'passed': 'passed',
    'signed': 'signed into law',
    'effective': 'went into effect for',
    'amended': 'amended',
  }

  const actionItemsList = params.actionItems
    .map((item, i) => `<li>${item}</li>`)
    .join('')

  const content = `
    <div class="header urgent-header">
      <h1>🚨 Action Required: ${params.stateCode} AI hiring law ${params.status}</h1>
    </div>
    <div class="content">
      <p>Hi ${params.name},</p>
      
      <p><strong>${params.stateCode}</strong> just ${statusVerbs[params.status] || params.status} new AI hiring regulations.</p>
      
      <div class="stat-box">
        <h3 style="margin-top:0; margin-bottom:8px;">What changed:</h3>
        <p style="margin:0;">${params.summary}</p>
      </div>
      
      <div class="stat-box">
        <strong>Effective date:</strong> ${params.effectiveDate}
      </div>
      
      ${actionItemsList ? `
      <div class="stat-box">
        <h3 style="margin-top:0; margin-bottom:8px;">What you need to do:</h3>
        <ol style="margin:0;">${actionItemsList}</ol>
      </div>
      ` : ''}
      
      <a href="${APP_URL}/audit?state=${params.stateCode}" class="cta urgent-cta">Update your compliance →</a>
      
      <p>We've updated AIHireLaw's document templates and audit tools to reflect these changes.</p>
      
      <p>— The AIHireLaw Team</p>
    </div>`

  return {
    subject: `🚨 Action Required: ${params.stateCode} AI hiring law ${params.status}`,
    html: emailWrapper(content, `<p>This alert was sent because you indicated you hire in ${params.stateCode}.</p>`),
  }
}

// Welcome / onboarding email
export function welcomeEmail(params: {
  name: string
}): { subject: string; html: string } {
  const content = `
    <div class="header">
      <h1>Welcome to AIHireLaw 🛡️</h1>
    </div>
    <div class="content">
      <p>Hi ${params.name},</p>
      
      <p>Thanks for signing up. Let's make sure you're protected.</p>
      
      <h3>Your 3-step quick start:</h3>
      
      <div class="stat-box">
        <strong>1. Run your first audit</strong> (5 min)<br>
        Find out where you stand right now.<br>
        <a href="${APP_URL}/audit">→ Start audit</a>
      </div>
      
      <div class="stat-box">
        <strong>2. Generate your first disclosure</strong> (2 min)<br>
        Get a compliant candidate notice for your state.<br>
        <a href="${APP_URL}/documents">→ Create disclosure</a>
      </div>
      
      <div class="stat-box">
        <strong>3. Start tracking consents</strong> (ongoing)<br>
        Build your audit defense from day one.<br>
        <a href="${APP_URL}/consent">→ Track consents</a>
      </div>
      
      <p>Most users complete all three in under 15 minutes.</p>
      
      <a href="${APP_URL}/audit" class="cta">Get started →</a>
      
      <p>— The AIHireLaw Team</p>
    </div>`

  return {
    subject: `Welcome to AIHireLaw — let's get you compliant`,
    html: emailWrapper(content),
  }
}

// Zero consents warning
export function zeroConsentsEmail(params: {
  name: string
  daysActive: number
}): { subject: string; html: string } {
  const content = `
    <div class="header">
      <h1>You're flying blind on consent tracking</h1>
    </div>
    <div class="content">
      <p>Hi ${params.name},</p>
      
      <p>You've been using AIHireLaw for <strong>${params.daysActive} days</strong> but haven't tracked any candidate consents yet.</p>
      
      <h3>Why this matters:</h3>
      <ul>
        <li>Illinois and Maryland require consent before AI video analysis</li>
        <li>NYC requires proof of candidate notification</li>
        <li>No records = no defense during an audit</li>
      </ul>
      
      <h3>Get started in 2 minutes:</h3>
      <ol>
        <li>Upload your existing consent records (CSV import)</li>
        <li>Or add your first consent manually</li>
        <li>Or integrate with your ATS for automatic tracking</li>
      </ol>
      
      <a href="${APP_URL}/consent" class="cta">Start tracking →</a>
      
      <p>— The AIHireLaw Team</p>
      
      <p style="color: #6b7280; font-size: 14px;">P.S. The average audit request gives you 30 days to produce records. Start now, not then.</p>
    </div>`

  return {
    subject: `You're flying blind on AI consent tracking`,
    html: emailWrapper(content),
  }
}

// Inactivity nudge
export function inactivityEmail(params: {
  name: string
  pendingItems?: string[]
  lawChanges?: string[]
}): { subject: string; html: string } {
  const pendingSection = params.pendingItems?.length ? `
    <div class="stat-box">
      <h3 style="margin-top:0; margin-bottom:8px;">Items needing attention:</h3>
      <ul style="margin:0;">
        ${params.pendingItems.map(item => `<li>${item}</li>`).join('')}
      </ul>
    </div>
  ` : ''

  const lawSection = params.lawChanges?.length ? `
    <div class="stat-box">
      <h3 style="margin-top:0; margin-bottom:8px;">Recent law changes:</h3>
      <ul style="margin:0;">
        ${params.lawChanges.map(item => `<li>${item}</li>`).join('')}
      </ul>
    </div>
  ` : ''

  const content = `
    <div class="header">
      <h1>Quick check-in from AIHireLaw</h1>
    </div>
    <div class="content">
      <p>Hi ${params.name},</p>
      
      <p>Haven't seen you in a couple weeks. Just a quick reminder:</p>
      
      ${pendingSection}
      ${lawSection}
      
      <p>Compliance doesn't pause when you're busy. A 5-minute check-in can prevent expensive surprises.</p>
      
      <a href="${APP_URL}/dashboard" class="cta">Check your dashboard →</a>
      
      <p>— The AIHireLaw Team</p>
    </div>`

  return {
    subject: `Quick check-in from AIHireLaw`,
    html: emailWrapper(content),
  }
}
