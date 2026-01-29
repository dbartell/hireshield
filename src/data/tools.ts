import { AITool } from "@/types"

export const aiHiringTools: AITool[] = [
  {
    id: "linkedin-recruiter",
    name: "LinkedIn Recruiter",
    category: "Sourcing & Screening",
    description: "AI-powered candidate recommendations, search ranking, and InMail suggestions",
    commonUses: ["Candidate sourcing", "Profile ranking", "Outreach optimization"]
  },
  {
    id: "indeed",
    name: "Indeed",
    category: "Job Board & Screening",
    description: "AI matching algorithms, resume screening, and candidate ranking",
    commonUses: ["Job matching", "Resume screening", "Candidate ranking"]
  },
  {
    id: "hirevue",
    name: "HireVue",
    category: "Video Interviewing",
    description: "AI-powered video interview analysis, game-based assessments",
    commonUses: ["Video interview scoring", "Behavioral analysis", "Skills assessment"]
  },
  {
    id: "pymetrics",
    name: "Pymetrics",
    category: "Assessment",
    description: "Neuroscience-based games to assess cognitive and emotional traits",
    commonUses: ["Soft skills assessment", "Role fit prediction", "Bias reduction"]
  },
  {
    id: "eightfold",
    name: "Eightfold AI",
    category: "Talent Intelligence",
    description: "AI platform for talent acquisition, management, and internal mobility",
    commonUses: ["Candidate matching", "Career pathing", "Skills inference"]
  },
  {
    id: "greenhouse",
    name: "Greenhouse",
    category: "ATS",
    description: "Applicant tracking with AI-powered features for candidate scoring",
    commonUses: ["Application tracking", "Interview scheduling", "Candidate scoring"]
  },
  {
    id: "lever",
    name: "Lever",
    category: "ATS",
    description: "ATS and CRM with AI nurture campaigns and candidate recommendations",
    commonUses: ["Pipeline management", "Candidate nurturing", "Analytics"]
  },
  {
    id: "workday",
    name: "Workday Recruiting",
    category: "Enterprise HCM",
    description: "Enterprise recruiting with machine learning for candidate matching",
    commonUses: ["Enterprise recruiting", "Internal mobility", "Workforce planning"]
  },
  {
    id: "bamboohr",
    name: "BambooHR",
    category: "HRIS",
    description: "HR software with applicant tracking features",
    commonUses: ["Small business HR", "Applicant tracking", "Onboarding"]
  },
  {
    id: "ziprecruiter",
    name: "ZipRecruiter",
    category: "Job Board",
    description: "AI matching technology to connect employers with candidates",
    commonUses: ["Job distribution", "Candidate matching", "Application management"]
  },
  {
    id: "textio",
    name: "Textio",
    category: "Job Description",
    description: "AI-powered writing platform for inclusive job descriptions",
    commonUses: ["Job description optimization", "Bias detection", "Language analysis"]
  },
  {
    id: "paradox-olivia",
    name: "Paradox (Olivia)",
    category: "Conversational AI",
    description: "AI assistant for candidate screening, scheduling, and FAQs",
    commonUses: ["Chatbot screening", "Interview scheduling", "Candidate engagement"]
  },
  {
    id: "checkr",
    name: "Checkr",
    category: "Background Check",
    description: "AI-powered background checks with adjudication assistance",
    commonUses: ["Background screening", "Compliance checks", "Risk assessment"]
  },
  {
    id: "spark-hire",
    name: "Spark Hire",
    category: "Video Interviewing",
    description: "Video interviewing platform with AI-assisted features",
    commonUses: ["One-way video interviews", "Live interviews", "Candidate evaluation"]
  },
  {
    id: "criteria",
    name: "Criteria Corp",
    category: "Assessment",
    description: "Pre-employment testing with AI scoring",
    commonUses: ["Aptitude testing", "Personality assessment", "Skills testing"]
  },
  {
    id: "other",
    name: "Other AI Tool",
    category: "Other",
    description: "Other AI-powered hiring tool not listed",
    commonUses: []
  }
]

export const toolCategories = [
  "Sourcing & Screening",
  "Job Board & Screening",
  "Video Interviewing",
  "Assessment",
  "Talent Intelligence",
  "ATS",
  "Enterprise HCM",
  "HRIS",
  "Job Board",
  "Job Description",
  "Conversational AI",
  "Background Check",
  "Other"
]

export const usageTypes = [
  { id: "screening", label: "Resume/Application Screening", description: "AI reviews resumes to filter or rank candidates" },
  { id: "ranking", label: "Candidate Ranking/Scoring", description: "AI ranks or scores candidates for consideration" },
  { id: "matching", label: "Job Matching", description: "AI matches candidates to open positions" },
  { id: "interview-analysis", label: "Interview Analysis", description: "AI analyzes video/audio interviews" },
  { id: "assessment-scoring", label: "Assessment Scoring", description: "AI scores skills or personality tests" },
  { id: "chatbot-screening", label: "Chatbot Screening", description: "AI chatbot asks screening questions" },
  { id: "scheduling", label: "Interview Scheduling", description: "AI handles interview scheduling" },
  { id: "job-description", label: "Job Description Writing", description: "AI helps write or optimize job posts" },
  { id: "background-check", label: "Background Check Review", description: "AI assists in reviewing background checks" },
  { id: "compensation", label: "Compensation Decisions", description: "AI informs salary or offer decisions" },
  { id: "promotion", label: "Promotion Decisions", description: "AI influences internal promotion decisions" },
  { id: "termination", label: "Termination Decisions", description: "AI factors into termination decisions" }
]
