"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format, differenceInDays } from "date-fns"
import { ptBR } from "date-fns/locale"
// ADICIONADO: Info incluído no import para evitar o ReferenceError
import { Search, Filter, CalendarIcon, Check, X, Info, Loader2 } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function PeriodoDescansoPage() {
  const router = useRouter()
  const { data: restPeriods = [], mutate, isLoading } = useSWR("/api/v4/rest-periods", fetcher)
  const { data: colaboradores = [] } = useSWR("/api/v4/colaboradores", fetcher)
  
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTeam, setSelectedTeam] = useState("todos")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Período de Descanso</h1>
        <Button variant="outline" onClick={() => router.push("/v4")}>
          Voltar ao Dashboard
        </Button>
      </div>

      {/* Info Box Corrigido */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p>
              Período de descanso alinhado previamente com a gestão.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg border p-8 text-center text-muted-foreground">
        <p>As funcionalidades desta página estão sendo migradas para o novo sistema PIFE.</p>
      </div>
    </div>
  )
}
