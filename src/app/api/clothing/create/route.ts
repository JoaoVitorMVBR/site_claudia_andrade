// app/api/clothing/create/route.ts  (App Router) 
// OU pages/api/clothing/create.ts   (Pages Router)

import { NextRequest, NextResponse } from "next/server";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

// GET → verifica se já existe vestido com esse nome (exatamente o que você precisa)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");

  if (!name?.trim()) {
    return NextResponse.json({ error: "Nome é obrigatório" }, { status: 400 });
  }

  const normalizedName = name.trim();

  try {
    // Busca direta no Firestore (case-sensitive primeiro)
    const q = query(
      collection(db, "clothing"),
      where("name", "==", normalizedName)
    );
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      return NextResponse.json({ exists: true });
    }

    // Caso não encontre, faz busca case-insensitive (manual)
    const allDocs = await getDocs(collection(db, "clothing"));
    const existsIgnoreCase = allDocs.docs.some(
      doc => doc.data().name?.toString().toLowerCase() === normalizedName.toLowerCase()
    );

    return NextResponse.json({ exists: existsIgnoreCase });
  } catch (error) {
    console.error("Erro na verificação de nome:", error);
    return NextResponse.json({ error: "Erro ao verificar nome" }, { status: 500 });
  }
}

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