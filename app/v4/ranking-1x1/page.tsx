"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MoreHorizontal, Star } from "lucide-react"
import { getRankingsFromStorage, initializeSampleData, type LeaderRanking } from "@/lib/meeting-tracking"
import { useIsMobile } from "@/hooks/use-mobile"

interface Leader {
  id: string
  name: string
  department: string
  avatar: string
  initials: string
  completed: number
  total: number
  percentage: number
  score: number
}

export default function RankingLideresPage() {
  const [selectedCompany, setSelectedCompany] = useState("V4 Company")
  const [selectedMonth, setSelectedMonth] = useState("09/2025")
  const [leaders, setLeaders] = useState<LeaderRanking[]>([])
  const isMobile = useIsMobile()

  useEffect(() => {
    initializeSampleData()
    const rankings = getRankingsFromStorage()

    if (rankings.length === 0) {
      const mockLeaders: LeaderRanking[] = [
        {
          id: "1",
          name: "Katia Pinheiro",
          department: "S.O.X",
          avatar: "/placeholder.svg?height=40&width=40",
          initials: "KP",
          completed: 7,
          total: 7,
          percentage: 100,
          score: 5.0,
        },
        {
          id: "2",
          name: "Gabriella Almeida",
          department: "Inside Sales",
          avatar: "/placeholder.svg?height=40&width=40",
          initials: "GA",
          completed: 5,
          total: 6,
          percentage: 83,
          score: 5.0,
        },
        {
          id: "3",
          name: "Kelvin Pinheiro",
          department: "BizMem",
          avatar: "/placeholder.svg?height=40&width=40",
          initials: "KP",
          completed: 4,
          total: 7,
          percentage: 57,
          score: 4.8,
        },
        {
          id: "4",
          name: "Felipe Fernandes",
          department: "TECH",
          avatar: "/placeholder.svg?height=40&width=40",
          initials: "FF",
          completed: 4,
          total: 4,
          percentage: 100,
          score: 4.4,
        },
        {
          id: "5",
          name: "Maria Iacono",
          department: "Joker",
          avatar: "/placeholder.svg?height=40&width=40",
          initials: "MI",
          completed: 6,
          total: 8,
          percentage: 75,
          score: 4.4,
        },
        {
          id: "6",
          name: "Rafael Dias",
          department: "Biz2bCom",
          avatar: "/placeholder.svg?height=40&width=40",
          initials: "RD",
          completed: 3,
          total: 5,
          percentage: 60,
          score: 3.5,
        },
        {
          id: "7",
          name: "Rodolfo Lavinas",
          department: "",
          avatar: "/placeholder.svg?height=40&width=40",
          initials: "RL",
          completed: 2,
          total: 4,
          percentage: 50,
          score: 3.1,
        },
      ]
      setLeaders(mockLeaders)
    } else {
      setLeaders(rankings)
    }

    const handleStorageChange = () => {
      const updatedRankings = getRankingsFromStorage()
      if (updatedRankings.length > 0) {
        setLeaders(updatedRankings)
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  // Calculate totals
  const totalCompleted = leaders.reduce((sum, leader) => sum + leader.completed, 0)
  const totalMeetings = leaders.reduce((sum, leader) => sum + leader.total, 0)
  const totalPercentage = totalMeetings > 0 ? Math.round((totalCompleted / totalMeetings) * 100) : 0
  const averageScore = leaders.length > 0 ? leaders.reduce((sum, leader) => sum + leader.score, 0) / leaders.length : 0

  const getProgressBarColor = (percentage: number) => {
    if (percentage === 100) return "bg-blue-500"
    if (percentage >= 75) return "bg-blue-400"
    if (percentage >= 50) return "bg-blue-300"
    return "bg-blue-200"
  }

  const getProgressBarWidth = (percentage: number) => {
    return `${Math.max(percentage, 5)}%` // Minimum 5% width for visibility
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8">
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Ranking de Líderes</h1>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">V</span>
              </div>
              <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                <SelectTrigger className="w-full sm:w-40 border-none bg-transparent text-sm md:text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="V4 Company">V4 Company</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
              <MoreHorizontal className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="flex-1 sm:flex-none text-xs md:text-sm bg-transparent">
                📅 {selectedMonth}
              </Button>
              <span className="text-gray-400 text-sm">→</span>
              <Button variant="outline" size="sm" className="flex-1 sm:flex-none text-xs md:text-sm bg-transparent">
                📅 {selectedMonth}
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Card className="w-full">
          <CardContent className="p-3 md:p-6">
            <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-gray-200">
              <div className="col-span-4 text-sm font-medium text-gray-600">Líder</div>
              <div className="col-span-4 text-sm font-medium text-gray-600">1-1s</div>
              <div className="col-span-4 text-sm font-medium text-gray-600 flex items-center gap-1">
                Score
                <Star className="h-3 w-3 text-yellow-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 py-3 md:py-4 border-b border-gray-100 bg-gray-50 -mx-3 md:-mx-6 px-3 md:px-6">
              <div className="md:col-span-4">
                <span className="font-medium text-gray-900 text-sm md:text-base">Total</span>
              </div>
              <div className="md:col-span-4">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-2 relative">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: getProgressBarWidth(totalPercentage) }}
                    />
                  </div>
                  <span className="text-xs md:text-sm text-blue-600 font-medium min-w-[60px] md:min-w-[70px]">
                    {totalCompleted}/{totalMeetings} {totalPercentage}%
                  </span>
                </div>
              </div>
              <div className="md:col-span-4">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="font-medium text-gray-900 text-sm md:text-base">{averageScore.toFixed(1)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              {leaders.map((leader) => (
                <div
                  key={leader.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 py-3 md:py-4 hover:bg-gray-50 -mx-3 md:-mx-6 px-3 md:px-6 rounded-lg"
                >
                  {/* Leader Info */}
                  <div className="md:col-span-4 flex items-center gap-3">
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarImage src={leader.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-red-100 text-red-600 text-xs md:text-sm font-medium">
                        {leader.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-sm md:text-base text-gray-900 truncate">{leader.name}</div>
                      {leader.department && (
                        <div className="text-xs md:text-sm text-gray-500 truncate">{leader.department}</div>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="md:col-span-4 flex items-center">
                    <div className="flex items-center gap-2 md:gap-3 w-full">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 relative">
                        <div
                          className={`${getProgressBarColor(leader.percentage)} h-2 rounded-full`}
                          style={{ width: getProgressBarWidth(leader.percentage) }}
                        />
                      </div>
                      <span className="text-xs md:text-sm text-blue-600 font-medium min-w-[60px] md:min-w-[70px] text-right">
                        {leader.completed}/{leader.total} {leader.percentage}%
                      </span>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="md:col-span-4 flex items-center">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-medium text-gray-900 text-sm md:text-base">{leader.score.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
