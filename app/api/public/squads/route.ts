import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const squads = await prisma.squad.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' }
    });
    return NextResponse.json(squads);
  } catch (error) {
    return NextResponse.json([], { status: 500 });
  }
}