"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertTriangle, X, Clock, FileText, Shield, Bell } from "lucide-react"

interface UrgencyAlert {
  id: string
  type: 'law_effective' | 'missing_disclosure' | 'no_consents' | 'audit_overdue' | 'training_expired'
  severity: 'critical' | 'warning' | 'info'
  title: string
  description: string
  cta: string
  href: string
}

interface UrgencyAlertsProps {
  alerts: UrgencyAlert[]
}

// Alert data generator based on user state
export function generateAlerts(data: {
  hiringStates: string[]
  documentsCount: number
  consentCount: number
  lastAuditDate: string | null
  trainingExpired: boolean
}): UrgencyAlert[] {
  const alerts: UrgencyAlert[] = []
  const now = new Date()

  // Check for Illinois HB 3773 (effective Jan 1, 2026)
  if (data.hiringStates.includes('IL')) {
    const ilEffective = new Date('2026-01-01')
    if (now >= ilEffective && data.documentsCount === 0) {
      alerts.push({
        id: 'il-disclosure',
        type: 'law_effective',
        severity: 'critical',
        title: '🚨 Illinois HB 3773 is NOW in effect',
        description: `You have 0 disclosures on file. Illinois requires AI hiring disclosures as of January 1, 2026.`,
        cta: 'Generate Illinois Disclosure',
        href: '/documents?state=IL'
      })
    }
  }

  // Check for Colorado AI Act (effective Feb 1, 2026)
  if (data.hiringStates.includes('CO')) {
    const coEffective = new Date('2026-02-01')
    const coWarning = new Date('2026-01-01')
    if (now >= coWarning && now < coEffective) {
      alerts.push({
        id: 'co-upcoming',
        type: 'law_effective',
        severity: 'warning',
        title: '⚠️ Colorado AI Act takes effect Feb 1',
        description: 'You have 30 days to prepare. Impact assessments and disclosures required.',
        cta: 'Prepare for Colorado',
        href: '/audit?state=CO'
      })
    } else if (now >= coEffective && data.documentsCount === 0) {
      alerts.push({
        id: 'co-disclosure',
        type: 'law_effective',
        severity: 'critical',
        title: '🚨 Colorado AI Act is NOW in effect',
        description: 'You need impact assessments and candidate disclosures immediately.',
        cta: 'Generate Colorado Documents',
        href: '/documents?state=CO'
      })
    }
  }

  // Check for NYC Local Law 144
  if (data.hiringStates.includes('NYC') || data.hiringStates.includes('NY')) {
    if (data.documentsCount === 0) {
      alerts.push({
        id: 'nyc-aedt',
        type: 'missing_disclosure',
        severity: 'critical',
        title: '🚨 NYC Local Law 144 requires bias audits',
        description: 'You need an annual bias audit and public disclosure for AI hiring tools.',
        cta: 'View NYC Requirements',
        href: '/audit?state=NYC'
      })
    }
  }

  // No consent records
  if (data.consentCount === 0) {
    alerts.push({
      id: 'no-consents',
      type: 'no_consents',
      severity: 'warning',
      title: '⚠️ No consent records tracked',
      description: 'You have no proof of candidate notification. This is required for audit defense.',
      cta: 'Start Tracking Consents',
      href: '/consent'
    })
  }

  // Audit overdue (90+ days)
  if (data.lastAuditDate) {
    const lastAudit = new Date(data.lastAuditDate)
    const daysSince = Math.floor((now.getTime() - lastAudit.getTime()) / (1000 * 60 * 60 * 24))
    if (daysSince >= 90) {
      alerts.push({
        id: 'audit-overdue',
        type: 'audit_overdue',
        severity: 'warning',
        title: `⚠️ Compliance audit overdue`,
        description: `It's been ${daysSince} days since your last audit. Quarterly audits are recommended.`,
        cta: 'Run Audit Now',
        href: '/audit'
      })
    }
  } else {
    alerts.push({
      id: 'no-audit',
      type: 'audit_overdue',
      severity: 'warning',
      title: '⚠️ No compliance audit completed',
      description: 'Run your first audit to understand your risk exposure.',
      cta: 'Start Your First Audit',
      href: '/audit'
    })
  }

  // Training expired
  if (data.trainingExpired) {
    alerts.push({
      id: 'training-expired',
      type: 'training_expired',
      severity: 'info',
      title: '📜 Training certification expiring',
      description: 'One or more team certifications need renewal.',
      cta: 'View Training',
      href: '/training'
    })
  }

  // Sort by severity
  const severityOrder = { critical: 0, warning: 1, info: 2 }
  return alerts.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])
}

export function UrgencyAlerts({ alerts }: UrgencyAlertsProps) {
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set())

  const visibleAlerts = alerts.filter(a => !dismissedIds.has(a.id))

  if (visibleAlerts.length === 0) return null

  const handleDismiss = (id: string) => {
    setDismissedIds(prev => new Set([...prev, id]))
  }

  const severityStyles = {
    critical: {
      container: 'bg-red-50 border-red-200',
      icon: 'text-red-600',
      title: 'text-red-800',
      text: 'text-red-700',
      button: 'bg-red-600 hover:bg-red-700 text-white'
    },
    warning: {
      container: 'bg-amber-50 border-amber-200',
      icon: 'text-amber-600',
      title: 'text-amber-800',
      text: 'text-amber-700',
      button: 'bg-amber-600 hover:bg-amber-700 text-white'
    },
    info: {
      container: 'bg-blue-50 border-blue-200',
      icon: 'text-blue-600',
      title: 'text-blue-800',
      text: 'text-blue-700',
      button: 'bg-blue-600 hover:bg-blue-700 text-white'
    }
  }

  return (
    <div className="space-y-3 mb-6">
      {visibleAlerts.map(alert => {
        const styles = severityStyles[alert.severity]
        return (
          <div
            key={alert.id}
            className={`relative p-4 rounded-lg border ${styles.container}`}
          >
            <button
              onClick={() => handleDismiss(alert.id)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-3 pr-8">
              <AlertTriangle className={`w-5 h-5 ${styles.icon} flex-shrink-0 mt-0.5`} />
              <div className="flex-1">
                <h4 className={`font-semibold ${styles.title}`}>{alert.title}</h4>
                <p className={`text-sm ${styles.text} mt-1`}>{alert.description}</p>
                <Link href={alert.href}>
                  <Button size="sm" className={`mt-3 ${styles.button}`}>
                    {alert.cta}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
