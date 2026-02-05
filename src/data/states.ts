import { StateRequirement } from "@/types"

export const stateRequirements: StateRequirement[] = [
  {
    code: "IL",
    name: "Illinois",
    law: "HB 3773 - AI Employment Decision Act",
    effective: "January 1, 2026",
    requirements: [
      "Notify employees when AI is used in employment decisions",
      "Prohibit AI-driven discrimination based on protected classes",
      "Cannot use zip code as proxy for protected characteristics",
      "Must disclose AI system name, purpose, and data collected"
    ],
    penalties: "Civil rights violation under Illinois Human Rights Act. Employees can file charges with Human Rights Commission or pursue civil complaints."
  },
  {
    code: "CO",
    name: "Colorado",
    law: "Colorado AI Act (SB24-205)",
    effective: "February 1, 2026",
    requirements: [
      "Use reasonable care to protect consumers from algorithmic discrimination",
      "Implement risk management programs (NIST AI RMF recommended)",
      "Complete impact assessments annually or within 90 days of substantial modification",
      "Provide consumer notifications before consequential decisions",
      "Give statement of reasons for adverse decisions",
      "Allow opportunity to correct incorrect personal data",
      "Provide opportunity to appeal with human review"
    ],
    penalties: "Up to $20,000 per violation. Enforced by Colorado Attorney General as unfair or deceptive trade practice."
  },
  {
    code: "CA",
    name: "California",
    law: "CCPA ADMT Regulations",
    effective: "January 1, 2026 (partial), January 1, 2027 (full)",
    requirements: [
      "Provide pre-use notice explaining ADMT purpose and opt-out rights",
      "Allow consumers to opt out of ADMT for significant decisions",
      "Conduct risk assessments for ADMT in employment contexts",
      "Human reviewers must be able to interpret and override ADMT decisions",
      "Applies to any tech that 'replaces or substantially replaces human decision-making'"
    ],
    penalties: "$2,500 per unintentional violation, $7,500 per intentional violation. Each affected consumer counts as separate violation."
  },
  {
    code: "NYC",
    name: "New York City",
    law: "Local Law 144",
    effective: "Active (July 5, 2023)",
    requirements: [
      "Annual bias audit by independent auditor",
      "Publish audit results on company website",
      "Notify candidates 10 business days before use",
      "Allow candidates to request alternative selection process",
      "Applies to automated employment decision tools (AEDT)"
    ],
    penalties: "$500 for first violation, $500-$1,500 per subsequent violation per day."
  }
]

export const allStates = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "DC", name: "Washington D.C." },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NYC", name: "New York City" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
]

export const regulatedStates = ["IL", "CO", "CA", "NYC"]
