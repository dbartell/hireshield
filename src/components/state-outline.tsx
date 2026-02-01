"use client"

// SVG path data for US state outlines (simplified for sidebar use)
// Paths are normalized to fit in a viewBox of "0 0 100 100"

const statePaths: Record<string, string> = {
  AL: "M60 10 L80 10 L85 80 L70 90 L55 90 L45 80 L40 10 Z",
  AK: "M10 60 L30 40 L50 35 L70 45 L80 60 L70 75 L50 85 L25 80 Z",
  AZ: "M20 15 L75 15 L85 85 L15 85 L15 40 Z",
  AR: "M15 20 L85 15 L85 85 L15 85 Z",
  CA: "M25 5 L40 10 L50 30 L55 50 L45 70 L35 85 L15 80 L10 50 L15 20 Z",
  CO: "M15 20 L85 20 L85 80 L15 80 Z",
  CT: "M15 25 L85 20 L90 75 L10 80 Z",
  DE: "M30 15 L70 20 L65 85 L35 80 Z",
  FL: "M30 10 L70 10 L75 35 L85 55 L75 85 L55 95 L40 85 L35 55 L25 35 Z",
  GA: "M25 10 L75 10 L85 65 L70 90 L40 90 L20 65 Z",
  HI: "M20 45 L35 35 L55 40 L75 50 L80 60 L65 70 L40 65 L20 55 Z",
  ID: "M30 10 L60 10 L75 35 L70 60 L55 85 L30 90 L25 50 Z",
  IL: "M35 10 L65 10 L70 35 L60 60 L70 85 L50 95 L35 85 L30 50 Z",
  IN: "M30 15 L70 15 L70 85 L30 85 Z",
  IA: "M10 25 L90 20 L90 80 L10 85 Z",
  KS: "M10 25 L90 25 L90 75 L10 75 Z",
  KY: "M5 30 L95 25 L90 70 L10 75 Z",
  LA: "M15 15 L70 15 L75 50 L85 75 L55 85 L40 90 L25 75 L15 50 Z",
  ME: "M45 10 L75 15 L80 60 L60 85 L35 80 L30 45 Z",
  MD: "M5 30 L95 25 L90 70 L50 80 L10 70 Z",
  MA: "M10 30 L90 25 L95 60 L5 65 Z",
  MI: "M25 20 L50 10 L75 20 L70 55 L60 75 L45 90 L35 75 L25 55 Z M55 5 L80 15 L75 35 L50 25 Z",
  MN: "M25 10 L75 10 L80 45 L70 85 L30 85 L20 45 Z",
  MS: "M35 10 L65 10 L65 85 L50 95 L35 85 Z",
  MO: "M15 15 L85 15 L90 50 L75 85 L25 85 L10 50 Z",
  MT: "M10 25 L90 20 L90 75 L10 80 Z",
  NE: "M10 30 L90 25 L85 75 L15 80 Z",
  NV: "M30 10 L70 20 L65 90 L20 80 L15 30 Z",
  NH: "M35 10 L65 15 L60 90 L40 85 Z",
  NJ: "M35 10 L65 15 L55 85 L35 90 L40 50 Z",
  NM: "M15 15 L85 15 L85 85 L15 85 Z",
  NY: "M10 25 L75 10 L90 40 L80 55 L85 70 L50 85 L15 75 Z",
  NC: "M5 25 L95 20 L85 80 L10 85 Z",
  ND: "M15 25 L85 25 L85 75 L15 75 Z",
  OH: "M25 15 L75 20 L70 85 L30 80 Z",
  OK: "M10 35 L50 30 L55 15 L65 15 L70 30 L90 35 L90 75 L10 80 Z",
  OR: "M15 20 L85 25 L80 75 L20 80 Z",
  PA: "M10 25 L90 20 L90 75 L10 80 Z",
  RI: "M25 20 L75 20 L75 80 L25 80 Z",
  SC: "M20 15 L85 25 L75 85 L15 70 Z",
  SD: "M15 25 L85 25 L85 75 L15 75 Z",
  TN: "M5 30 L95 25 L95 70 L5 75 Z",
  TX: "M25 10 L65 10 L80 35 L90 65 L75 90 L40 95 L15 75 L20 40 Z",
  UT: "M20 15 L55 15 L55 40 L80 40 L80 85 L20 85 Z",
  VT: "M35 10 L65 15 L60 90 L40 85 Z",
  VA: "M10 30 L90 20 L85 55 L55 75 L15 65 Z",
  WA: "M15 25 L85 20 L80 75 L20 80 Z",
  WV: "M30 15 L70 20 L65 50 L80 70 L60 85 L35 80 L25 55 Z",
  WI: "M25 15 L70 10 L75 50 L65 75 L45 90 L30 75 L25 45 Z",
  WY: "M15 20 L85 20 L85 80 L15 80 Z",
  DC: "M25 25 L75 25 L75 75 L25 75 Z",
  NYC: "M30 15 L70 20 L75 55 L65 80 L40 85 L25 55 Z",
}

// State names lookup
const stateNames: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", FL: "Florida", GA: "Georgia",
  HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa",
  KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
  MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi", MO: "Missouri",
  MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey",
  NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota", OH: "Ohio",
  OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina",
  SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont",
  VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
  DC: "Washington D.C.", NYC: "New York City",
}

interface StateOutlineProps {
  stateCode: string
  size?: number
  highlighted?: boolean
  className?: string
  showLabel?: boolean
}

export function StateOutline({ 
  stateCode, 
  size = 24, 
  highlighted = false,
  className = "",
  showLabel = false
}: StateOutlineProps) {
  const path = statePaths[stateCode.toUpperCase()]
  const name = stateNames[stateCode.toUpperCase()] || stateCode
  
  if (!path) {
    // Fallback for unknown states
    return (
      <div 
        className={`flex items-center justify-center bg-gray-200 rounded ${className}`}
        style={{ width: size, height: size }}
      >
        <span className="text-xs text-gray-500">{stateCode}</span>
      </div>
    )
  }

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
        aria-label={name}
      >
        <path
          d={path}
          fill={highlighted ? "#3b82f6" : "#9ca3af"}
          stroke={highlighted ? "#1d4ed8" : "#6b7280"}
          strokeWidth="2"
          className="transition-colors duration-200"
        />
      </svg>
      {showLabel && (
        <span className="text-sm">{name}</span>
      )}
    </div>
  )
}

// Export state data for other components
export { stateNames, statePaths }
export function getStateName(code: string): string {
  return stateNames[code.toUpperCase()] || code
}
