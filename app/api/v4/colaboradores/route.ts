import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const users = await prisma.usuario.findMany({
      select: {
        id: true,
        name: true,
        nome: true,
        email: true,
        cargo: true,
        avatar: true,
        image: true,
        squad: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        nome: "asc",
      },
    })

    const transformedUsers = users.map((user) => ({
      id: user.id,
      name: user.nome || user.name || "",
      email: user.email,
      position: user.cargo || "",
      avatar: user.avatar || user.image || "",
      team: user.squad?.name || "",
      squadId: user.squad?.id || null,
    }))

    return NextResponse.json(transformedUsers)
  } catch (error) {
    console.error("Error fetching colaboradores:", error)
    return NextResponse.json({ error: "Failed to fetch colaboradores" }, { status: 500 })
  }
}
