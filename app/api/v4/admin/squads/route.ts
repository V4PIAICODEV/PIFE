import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET: Lista todas as squads e conta quantos usuários tem em cada
export async function GET() {
  try {
    const squads = await prisma.squad.findMany({
      include: {
        _count: {
          select: { users: true },
        },
      },
      orderBy: { name: 'asc' }
    });
    return NextResponse.json(squads);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar squads" }, { status: 500 });
  }
}

// POST: Cria uma nova squad
export async function POST(req: Request) {
  try {
    const { name } = await req.json();
    
    if (!name) return NextResponse.json({ error: "Nome é obrigatório" }, { status: 400 });

    const newSquad = await prisma.squad.create({
      data: { name },
    });
    
    return NextResponse.json(newSquad);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao criar squad" }, { status: 500 });
  }
}

// PUT: Atualiza o nome da squad
export async function PUT(req: Request) {
  try {
    const { id, name } = await req.json();
    
    const updatedSquad = await prisma.squad.update({
      where: { id },
      data: { name },
    });
    
    return NextResponse.json(updatedSquad);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao atualizar" }, { status: 500 });
  }
}

// DELETE: Deleta a squad (e remove os usuários dela antes)
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID necessário" }, { status: 400 });

    // 1. Desvincula os usuários desta squad (para não dar erro de banco)
    await prisma.usuario.updateMany({
      where: { squadId: id },
      data: { squadId: null }
    });

    // 2. Deleta a squad
    await prisma.squad.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao excluir" }, { status: 500 });
  }
}