import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BeltBadge } from "@/components/belt-badge"
import { BELT_NAMES, mockSteps } from "@/lib/mock-data"
import type { BeltType, User } from "@/lib/types"
import { getBeltProgress, getNextBelt } from "@/lib/utils"
import { CheckCircle, Circle, Lock } from "lucide-react"

interface BeltProgressionProps {
  user: User
  className?: string
}

export function BeltProgression({ user, className }: BeltProgressionProps) {
  const beltOrder: BeltType[] = ["white", "blue", "purple", "brown", "black"]
  const currentBeltIndex = beltOrder.indexOf(user.belt)
  const beltProgress = getBeltProgress(user)
  const nextBelt = getNextBelt(user.belt)

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Progressão de Faixas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Belt Status */}
        <div className="text-center space-y-2">
          <BeltBadge belt={user.belt} degree={user.degree} size="lg" />
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Progresso atual</span>
              <span>{user.degree}/4 graus</span>
            </div>
            <Progress value={beltProgress} className="h-2" />
          </div>
          {nextBelt && <p className="text-sm text-muted-foreground">Próxima faixa: {BELT_NAMES[nextBelt]}</p>}
        </div>

        {/* Belt Timeline */}
        <div className="space-y-4">
          <h4 className="font-semibold text-sm">Trilha Completa</h4>
          <div className="space-y-3">
            {beltOrder.map((belt, index) => {
              const isCompleted = index < currentBeltIndex
              const isCurrent = index === currentBeltIndex
              const isLocked = index > currentBeltIndex
              const step = mockSteps.find((s) => s.belt === belt)

              return (
                <div key={belt} className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {isCompleted && <CheckCircle className="h-5 w-5 text-green-500" />}
                    {isCurrent && <Circle className="h-5 w-5 text-primary" />}
                    {isLocked && <Lock className="h-5 w-5 text-muted-foreground" />}
                  </div>

                  <div className="flex-1 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BeltBadge belt={belt} degree={1} size="sm" showDegree={false} />
                      <span className={`text-sm ${isLocked ? "text-muted-foreground" : ""}`}>
                        {step?.name || BELT_NAMES[belt]}
                      </span>
                    </div>

                    {isCurrent && (
                      <Badge variant="secondary" className="text-xs">
                        Atual
                      </Badge>
                    )}
                    {isCompleted && (
                      <Badge variant="outline" className="text-xs text-green-600">
                        Completo
                      </Badge>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Requirements for Next Level */}
        {nextBelt && (
          <div className="p-4 rounded-lg bg-muted/50 space-y-2">
            <h4 className="font-semibold text-sm">Para avançar para {BELT_NAMES[nextBelt]}:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Completar 100% da trilha atual</li>
              <li>• Obter todas as certificações obrigatórias</li>
              <li>• Passar na prova prática</li>
              <li>• Manter NPS interno ≥ 8/10</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
