// app/api/clothing/create/route.ts  (App Router) 
// OU pages/api/clothing/create.ts   (Pages Router)

import { NextRequest, NextResponse } from "next/server";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

// POST /api/clothing/create
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      name,
      type,
      color,
      sizes,
      frontImageUrl,
      backImageUrl,
    } = body;

    // Validação básica (você pode deixar mais rígida)
    if (!name || !type || !color || !sizes || sizes.length === 0 || !frontImageUrl) {
      return NextResponse.json(
        { error: "Todos os campos obrigatórios devem ser preenchidos." },
        { status: 400 }
      );
    }

    // Salva no Firestore
    const docRef = await addDoc(collection(db, "clothing"), {
      name: name.trim(),
      type,
      color: color.trim(),
      sizes: sizes.map((s: string) => s.trim()),
      frontImageUrl,
      backImageUrl: backImageUrl || null, // pode ser null se não tiver verso
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json(
      { success: true, id: docRef.id, message: "Vestido salvo com sucesso!" },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Erro ao salvar no Firestore:", error);

    // Erros do Firebase (ex: permissão negada)
    if (error.code) {
      return NextResponse.json(
        { error: "Erro de permissão no banco de dados. Verifique as regras do Firestore." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Erro interno do servidor. Tente novamente." },
      { status: 500 }
    );
  }
}

// Opcional: bloqueia outros métodos
export const dynamic = "force-dynamic";