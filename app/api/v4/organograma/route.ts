import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { hash } from "bcryptjs"; // Certifique-se de ter bcryptjs instalado

// --- GET: Busca e monta a árvore do Organograma ---
export async function GET() {
  try {
    const users = await prisma.usuario.findMany({
      select: {
        id: true,
        name: true,
        role: true,
        department: true,
        image: true,
        email: true,
        managerId: true,
      },
    });

    // Função recursiva para montar a árvore
    const buildTree = (managerId: string | null): any[] => {
      return users
        .filter((user) => user.managerId === managerId)
        .map((user) => {
          const children = buildTree(user.id);
          
          // Calculando membros diretos (incluindo ele mesmo)
          // Na sua lógica visual, 'members' são as pessoas daquele card
          const members = [user]; 
          
          // Contagem de time (ele + toda a descendência)
          const calculateTeamCount = (node: any): number => {
             let count = 1; // ele mesmo
             if (node.children) {
               node.children.forEach((child: any) => count += calculateTeamCount(child));
             }
             return count;
          };

          const node = {
            id: user.id,
            name: user.name,
            role: user.role || "Colaborador",
            department: user.department || "Geral",
            avatar: user.image,
            email: user.email,
            members: members,
            children: children.length > 0 ? children : undefined,
          };
          
          // Adiciona a contagem total recursiva
          (node as any).teamCount = calculateTeamCount({ ...node, children });
          
          return node;
        });
    };

    // Pega os "Chefões" (quem não tem managerId ou managerId é nulo)
    // Se você tiver um CEO específico, ajuste a lógica aqui.
    const rootNodes = buildTree(null);

    // Se tiver mais de uma raiz, pegamos a primeira ou retornamos array
    const tree = rootNodes.length > 0 ? rootNodes[0] : null;

    return NextResponse.json(tree);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar organograma" }, { status: 500 });
  }
}

// --- POST: Cria uma nova posição (Novo Usuário) ---
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, role, department, email, parentId, avatar } = body;

    // Senha padrão para novos usuários criados pelo organograma
    const hashedPassword = await hash("123456", 10);

    const newUser = await prisma.usuario.create({
      data: {
        name,
        email: email || `${name.toLowerCase().replace(/\s/g, '.')}@v4company.com`, // Gera email fake se não vier
        role,
        department,
        image: avatar,
        password: hashedPassword,
        managerId: parentId || null,
        level: "PLAYER" // Padrão
      }
    });

    return NextResponse.json(newUser);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao criar posição" }, { status: 500 });
  }
}

// --- PUT: Atualiza uma posição ---
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, role, department, avatar } = body;

    const updatedUser = await prisma.usuario.update({
      where: { id },
      data: {
        name,
        role,
        department,
        image: avatar
      }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao atualizar" }, { status: 500 });
  }
}

// --- DELETE: Exclui e reatribui subordinados ---
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID necessário" }, { status: 400 });

    const userToDelete = await prisma.usuario.findUnique({ where: { id } });

    if (!userToDelete) return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });

    // 1. Reatribuir subordinados para o chefe do usuário deletado
    await prisma.usuario.updateMany({
      where: { managerId: id },
      data: { managerId: userToDelete.managerId }
    });

    // 2. Deletar o usuário
    await prisma.usuario.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao excluir" }, { status: 500 });
  }
}