import { Badge } from "@/components/ui/badge"
import { BELT_COLORS, BELT_NAMES } from "@/lib/mock-data"
import type { BeltType } from "@/lib/types"
import { cn } from "@/lib/utils"

interface BeltBadgeProps {
  belt: BeltType
  degree: number
  size?: "sm" | "md" | "lg"
  showDegree?: boolean
}

export function BeltBadge({ belt, degree, size = "md", showDegree = true }: BeltBadgeProps) {
  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5",
    lg: "text-base px-4 py-2",
  }

  const beltColor = BELT_COLORS[belt]
  const textColor = belt === "white" ? "text-gray-800" : "text-white"

  return (
    <Badge
      className={cn(sizeClasses[size], "font-semibold border-2", textColor)}
      style={{
        backgroundColor: beltColor,
        borderColor: belt === "white" ? "#e5e7eb" : beltColor,
      }}
    >
      {BELT_NAMES[belt]}
      {showDegree && <span className="ml-1 opacity-90">{degree}° Grau</span>}
    </Badge>
  )
}
