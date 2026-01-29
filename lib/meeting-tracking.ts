export interface MeetingRecord {
  id: string
  leaderId: string
  leaderName: string
  employeeId: string
  employeeName: string
  scheduledDate: string
  completedDate?: string
  status: "scheduled" | "completed" | "cancelled"
  duration?: number
  score?: number
  notes?: string
}

export interface LeaderRanking {
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

const MEETINGS_STORAGE_KEY = "pdi_meetings_data"
const RANKINGS_STORAGE_KEY = "pdi_rankings_data"

export function getMeetingsFromStorage(): MeetingRecord[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(MEETINGS_STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

export function saveMeetingsToStorage(meetings: MeetingRecord[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(MEETINGS_STORAGE_KEY, JSON.stringify(meetings))
  updateRankingsFromMeetings(meetings)
}

export function completeMeeting(meetingId: string, score = 4.0, notes?: string): void {
  const meetings = getMeetingsFromStorage()
  const meetingIndex = meetings.findIndex((m) => m.id === meetingId)

  if (meetingIndex !== -1) {
    meetings[meetingIndex] = {
      ...meetings[meetingIndex],
      status: "completed",
      completedDate: new Date().toISOString(),
      score,
      notes,
    }
    saveMeetingsToStorage(meetings)
    console.log(`[v0] Meeting ${meetingId} marked as completed with score ${score}`)
  }
}

export function updateRankingsFromMeetings(meetings: MeetingRecord[]): void {
  const leaderStats = new Map<
    string,
    {
      name: string
      department: string
      completed: number
      total: number
      scores: number[]
    }
  >()

  meetings.forEach((meeting) => {
    const leaderId = meeting.leaderId
    if (!leaderStats.has(leaderId)) {
      leaderStats.set(leaderId, {
        name: meeting.leaderName,
        department: getDepartmentForLeader(meeting.leaderName),
        completed: 0,
        total: 0,
        scores: [],
      })
    }

    const stats = leaderStats.get(leaderId)!
    stats.total++

    if (meeting.status === "completed") {
      stats.completed++
      if (meeting.score) {
        stats.scores.push(meeting.score)
      }
    }
  })

  const rankings: LeaderRanking[] = Array.from(leaderStats.entries()).map(([id, stats]) => ({
    id,
    name: stats.name,
    department: stats.department,
    avatar: `/placeholder.svg?height=40&width=40`,
    initials: getInitials(stats.name),
    completed: stats.completed,
    total: stats.total,
    percentage: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0,
    score: stats.scores.length > 0 ? stats.scores.reduce((sum, score) => sum + score, 0) / stats.scores.length : 0,
  }))

  rankings.sort((a, b) => {
    if (a.percentage !== b.percentage) {
      return b.percentage - a.percentage
    }
    return b.score - a.score
  })

  if (typeof window !== "undefined") {
    localStorage.setItem(RANKINGS_STORAGE_KEY, JSON.stringify(rankings))
  }
}

function getDepartmentForLeader(leaderName: string): string {
  const departmentMap: Record<string, string> = {
    "Katia Pinheiro": "S.O.X",
    "Gabriella Almeida": "Inside Sales",
    "Kelvin Pinheiro": "BizMem",
    "Felipe Fernandes": "TECH",
    "Maria Iacono": "Joker",
    "Rafael Dias": "Biz2bCom",
    "Rodolfo Lavinas": "",
    "Marcus Vinícius Galissi Massaki": "Head",
    "Nathalia Fernandes": "CS",
    "Antônio Derick": "",
  }
  return departmentMap[leaderName] || ""
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase()
}

export function getRankingsFromStorage(): LeaderRanking[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(RANKINGS_STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

export function initializeSampleData(): void {
  const existingMeetings = getMeetingsFromStorage()
  if (existingMeetings.length === 0) {
    const sampleMeetings: MeetingRecord[] = [
      {
        id: "meeting-1",
        leaderId: "leader-1",
        leaderName: "Katia Pinheiro",
        employeeId: "emp-1",
        employeeName: "João Silva",
        scheduledDate: "2025-09-02",
        completedDate: "2025-09-02",
        status: "completed",
        score: 5.0,
      },
      {
        id: "meeting-2",
        leaderId: "leader-1",
        leaderName: "Katia Pinheiro",
        employeeId: "emp-2",
        employeeName: "Maria Santos",
        scheduledDate: "2025-09-03",
        status: "scheduled",
      },
      {
        id: "meeting-3",
        leaderId: "leader-2",
        leaderName: "Felipe Fernandes",
        employeeId: "emp-3",
        employeeName: "Pedro Costa",
        scheduledDate: "2025-09-04",
        completedDate: "2025-09-04",
        status: "completed",
        score: 4.4,
      },
    ]
    saveMeetingsToStorage(sampleMeetings)
  }
}
