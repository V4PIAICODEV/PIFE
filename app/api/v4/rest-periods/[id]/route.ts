import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status, ...otherFields } = body

    const updateData: Record<string, unknown> = { ...otherFields }

    if (status) {
      // Convert status to enum format
      updateData.status = status.toUpperCase().replace("-", "_")
    }

    const restPeriod = await prisma.restPeriod.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          include: {
            squad: true,
          },
        },
      },
    })

    return NextResponse.json(restPeriod)
  } catch (error) {
    console.error("Error updating rest period:", error)
    return NextResponse.json({ error: "Failed to update rest period" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    await prisma.restPeriod.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting rest period:", error)
    return NextResponse.json({ error: "Failed to delete rest period" }, { status: 500 })
  }
}
