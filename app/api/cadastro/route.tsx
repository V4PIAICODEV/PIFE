import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // 1. Ler dados
    const contentType = req.headers.get("content-type") || "";
    let body: any = {};
    
    try {
      if (contentType.includes("multipart/form-data")) {
        const formData = await req.formData();
        body = Object.fromEntries(formData);
      } else {
        body = await req.json();
      }
    } catch (e) {
      // Ignora erro de parse
    }

    console.log(">>> DADOS RECEBIDOS:", body);

    const { name, email, password } = body;

    // 2. Validação simples
    if (!email || !password) {
      return NextResponse.json({ error: "Email e senha obrigatórios" }, { status: 400 });
    }

    const hashedPassword = await hash(String(password), 10);

    // 3. VERIFICA SE JÁ EXISTE
    const existingUser = await prisma.usuario.findUnique({
      where: { email: String(email) },
    });

    if (existingUser) {
      console.log(">>> USUÁRIO JÁ EXISTIA. ATUALIZANDO SENHA...");
      // SE JÁ EXISTE, SÓ ATUALIZA A SENHA E O SQUAD (TENTA ARRUMAR)
      const updatedUser = await prisma.usuario.update({
        where: { email: String(email) },
        data: {
          password: hashedPassword,
          // Tenta limpar o squadId se ele estiver bugado
          squadId: null 
        }
      });
      
      const { password: _, ...userNoPass } = updatedUser;
      return NextResponse.json(userNoPass);
    }

    // 4. SE NÃO EXISTE, CRIA DO ZERO (IGNORANDO SQUAD 8)
    console.log(">>> CRIANDO NOVO USUÁRIO...");
    const newUser = await prisma.usuario.create({
      data: {
        name: String(name),
        email: String(email),
        password: hashedPassword,
        level: "ADMIN", // Já cria como Admin pra você não ter dor de cabeça
        role: "Diretor",
        squadId: null, // Força null pra não dar erro de chave estrangeira
      },
    });

    const { password: __, ...newUserNoPass } = newUser;
    return NextResponse.json(newUserNoPass);

  } catch (error: any) {
    console.error(">>> ERRO REAL:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}