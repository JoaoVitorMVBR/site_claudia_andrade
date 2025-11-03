// app/api/clothing/detail/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Product } from '@/types/products';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: 'ID do produto é obrigatório' },
        { status: 400 }
      );
    }

    const docRef = doc(db, 'clothing', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      );
    }

    const data = docSnap.data();

    const product: Product = {
      id: docSnap.id,
      name: data.name || '',
      type: data.type || '',
      color: data.color || '',
      sizes: (() => {
        const raw = data.sizes ?? data.size;
        if (Array.isArray(raw)) return raw;
        if (typeof raw === 'string' && raw.trim()) {
          try {
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [raw];
          } catch {
            return raw.split(',').map(s => s.trim()).filter(Boolean);
          }
        }
        return [];
      })(),
      frontImageUrl: data.frontImageUrl || '',
      backImageUrl: data.backImageUrl || '',
      destaque: data.destaque ?? false,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || '',
    };

    return NextResponse.json(product);
  } catch (error: any) {
    console.error('API detail/[id] Error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error.message },
      { status: 500 }
    );
  }
}