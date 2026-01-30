import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const restPeriods = await prisma.restPeriod.findMany({
      include: {
        user: {
          include: {
            squad: true,
          },
        },
      },
      orderBy: {
        startDate: "asc",
      },
    })

    // Transform data for frontend
    const transformedPeriods = restPeriods.map((period) => {
      const today = new Date()
      const startDate = new Date(period.startDate)
      const daysUntilStart = Math.ceil((startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

      return {
        id: period.id,
        employee: {
          name: period.user.nome,
          avatar: period.user.avatar || "",
          team: period.user.squad?.name || "",
          position: period.user.cargo || "",
        },
        startDate: new Date(period.startDate).toLocaleDateString("pt-BR"),
        endDate: new Date(period.endDate).toLocaleDateString("pt-BR"),
        restDays: period.restDays,
        soldDays: period.soldDays,
        acquisitivePeriod: `${new Date(period.acquisitivePeriodStart).toLocaleDateString("pt-BR", { month: "2-digit", year: "numeric" })} - ${new Date(period.acquisitivePeriodEnd).toLocaleDateString("pt-BR", { month: "2-digit", year: "numeric" })}`,
        remainingDays: period.remainingDays,
        daysUntilStart: daysUntilStart > 0 ? daysUntilStart : 0,
        contractType: period.contractType || "",
        status: period.status.toLowerCase().replace("_", "-") as
          | "solicitado"
          | "pendente"
          | "aprovado"
          | "em-descanso"
          | "vencido"
          | "rejeitado",
      }
    })

    return NextResponse.json(transformedPeriods)
  } catch (error) {
    console.error("Error fetching rest periods:", error)
    return NextResponse.json({ error: "Failed to fetch rest periods" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, startDate, endDate, restDays, soldDays, acquisitivePeriodStart, acquisitivePeriodEnd, remainingDays, contractType } = body

    const restPeriod = await prisma.restPeriod.create({
      data: {
        userId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        restDays,
        soldDays: soldDays || 0,
        acquisitivePeriodStart: new Date(acquisitivePeriodStart),
        acquisitivePeriodEnd: new Date(acquisitivePeriodEnd),
        remainingDays: remainingDays || 30,
        contractType,
        status: "SOLICITADO",
      },
      include: {
        user: {
          include: {
            squad: true,
          },
        },
      },
    })

    return NextResponse.json(restPeriod, { status: 201 })
  } catch (error) {
    console.error("Error creating rest period:", error)
    return NextResponse.json({ error: "Failed to create rest period" }, { status: 500 })
  }
}
