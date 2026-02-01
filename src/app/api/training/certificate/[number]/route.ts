import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { TRACK_LABELS, type TrainingTrack } from '@/lib/training-data'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ number: string }> }
) {
  try {
    const { number } = await params
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get certificate with assignment details
    const { data: certificate, error } = await supabase
      .from('training_certificates')
      .select(`
        certificate_number,
        issued_at,
        expires_at,
        training_assignments (
          user_name,
          track,
          org_id,
          organizations (
            name
          )
        )
      `)
      .eq('certificate_number', number)
      .single()

    if (error || !certificate) {
      return NextResponse.json({ error: 'Certificate not found' }, { status: 404 })
    }

    const assignment = certificate.training_assignments as any
    const track = assignment?.track as TrainingTrack

    return NextResponse.json({
      certificate: {
        certificate_number: certificate.certificate_number,
        issued_at: certificate.issued_at,
        expires_at: certificate.expires_at,
        employee_name: assignment?.user_name || 'Unknown',
        company_name: assignment?.organizations?.name || 'Unknown',
        track,
        track_title: TRACK_LABELS[track] || track
      }
    })
  } catch (error) {
    console.error('Certificate fetch error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to fetch certificate' 
    }, { status: 500 })
  }
}
