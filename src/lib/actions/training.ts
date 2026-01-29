"use server"

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface Course {
  id: string
  title: string
  description: string
  duration: string
  modules: number
  prerequisite?: string
  content: {
    title: string
    type: 'video' | 'text' | 'quiz'
    duration: string
    content?: string
  }[]
}

const courses: Course[] = [
  {
    id: "ai-hiring-101",
    title: "AI in Hiring 101",
    description: "Understanding what counts as AI in your hiring process",
    duration: "15 min",
    modules: 3,
    content: [
      { title: "What is AI in Hiring?", type: "text", duration: "5 min", content: "AI in hiring refers to any automated or algorithmic system that processes candidate information to make or assist with employment decisions. This includes resume screening tools, chatbots, video interview analysis, skills assessments, and predictive hiring tools." },
      { title: "Common AI Hiring Tools", type: "text", duration: "5 min", content: "Common AI tools include: ATS systems with automated screening, video interview platforms with sentiment analysis, skills assessment platforms, chatbots for candidate screening, and predictive analytics tools." },
      { title: "Module Quiz", type: "quiz", duration: "5 min" }
    ]
  },
  {
    id: "state-requirements",
    title: "State Law Requirements",
    description: "State-by-state breakdown of compliance requirements",
    duration: "25 min",
    modules: 4,
    content: [
      { title: "Illinois Requirements", type: "text", duration: "5 min", content: "Illinois HB 3773 requires employers to notify candidates about AI use in hiring, provide information about how AI is used, and offer alternatives upon request." },
      { title: "Colorado Requirements", type: "text", duration: "8 min", content: "Colorado's AI Act requires impact assessments, risk management, and disclosure to candidates when AI is used in high-risk employment decisions." },
      { title: "NYC Requirements", type: "text", duration: "7 min", content: "NYC Local Law 144 requires annual bias audits for AEDTs, public disclosure of audit results, and candidate notification." },
      { title: "Module Quiz", type: "quiz", duration: "5 min" }
    ]
  },
  {
    id: "disclosure-writing",
    title: "Writing Effective Disclosures",
    description: "Best practices for candidate and employee notifications",
    duration: "20 min",
    modules: 3,
    content: [
      { title: "Disclosure Requirements", type: "text", duration: "7 min", content: "Effective disclosures must be clear, conspicuous, and provided before AI processing occurs. They should explain what AI is used, how it affects decisions, and what rights candidates/employees have." },
      { title: "Language and Accessibility", type: "text", duration: "8 min", content: "Disclosures should be written in plain language, avoid jargon, and be accessible to all readers. Consider providing translations for diverse workforces." },
      { title: "Module Quiz", type: "quiz", duration: "5 min" }
    ]
  },
  {
    id: "bias-prevention",
    title: "Preventing Algorithmic Bias",
    description: "How to identify and mitigate bias in AI hiring tools",
    duration: "30 min",
    modules: 5,
    prerequisite: "state-requirements",
    content: [
      { title: "Understanding Algorithmic Bias", type: "text", duration: "6 min" },
      { title: "Sources of Bias in Hiring AI", type: "text", duration: "6 min" },
      { title: "Testing for Bias", type: "text", duration: "6 min" },
      { title: "Mitigation Strategies", type: "text", duration: "7 min" },
      { title: "Module Quiz", type: "quiz", duration: "5 min" }
    ]
  },
  {
    id: "audit-preparation",
    title: "Preparing for Compliance Audits",
    description: "Documentation and processes for regulatory review",
    duration: "20 min",
    modules: 3,
    prerequisite: "disclosure-writing",
    content: [
      { title: "Documentation Requirements", type: "text", duration: "7 min" },
      { title: "Building an Audit Trail", type: "text", duration: "8 min" },
      { title: "Module Quiz", type: "quiz", duration: "5 min" }
    ]
  }
]

export async function getTrainingData() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { courses: [], completions: [] }
  }

  const { data: completions } = await supabase
    .from('training_completions')
    .select('*')
    .eq('user_id', user.id)

  return { 
    courses, 
    completions: completions || [] 
  }
}

export async function markCourseComplete(courseId: string, score: number = 100) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Check if already completed
  const { data: existing } = await supabase
    .from('training_completions')
    .select('id')
    .eq('user_id', user.id)
    .eq('course_id', courseId)
    .single()

  if (existing) {
    return { error: 'Already completed' }
  }

  const { data, error } = await supabase
    .from('training_completions')
    .insert({
      user_id: user.id,
      course_id: courseId,
      score,
      certificate_url: null,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/training')
  revalidatePath('/dashboard')

  return { completion: data }
}

export async function getCourseContent(courseId: string) {
  const course = courses.find(c => c.id === courseId)
  return course || null
}
