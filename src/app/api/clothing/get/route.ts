import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  orderBy,
  startAfter,
  limit,
  getDocs,
  where,
} from 'firebase/firestore';
import { Product } from '@/types/products';

const PAGE_SIZE = 12;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const cursor = searchParams.get('cursor');
    const search = searchParams.get('search') || '';
    const size = searchParams.get('size') || '';
    const type = searchParams.get('type') || '';   // NOVO
    const color = searchParams.get('color') || ''; // NOVO

    const queryClauses: any[] = [
      orderBy('createdAt', 'desc'),
      limit(PAGE_SIZE + 1),
    ];

    // FILTRO POR NOME (case-insensitive, começa com)
    if (search) {
      queryClauses.unshift(
        where('name', '>=', search),
        where('name', '<=', search + '\uf8ff')
      );
    }

    // FILTRO POR TAMANHO
    if (size) {
      queryClauses.unshift(where('sizes', 'array-contains', size));
    }

    // FILTRO POR TIPO
    if (type) {
      queryClauses.unshift(where('type', '==', type));
    }

    // FILTRO POR COR
    if (color) {
      queryClauses.unshift(where('color', '==', color));
    }

    let q = query(collection(db, 'clothing'), ...queryClauses);

    // Paginação com cursor
    if (cursor) {
      const cursorQuery = query(
        collection(db, 'clothing'),
        where('__name__', '==', cursor),
        limit(1)
      );
      const cursorSnap = await getDocs(cursorQuery);
      if (!cursorSnap.empty) {
        q = query(q, startAfter(cursorSnap.docs[0]));
      } else {
        return NextResponse.json({ items: [], nextCursor: null });
      }
    }

    const snapshot = await getDocs(q);
    const docs = snapshot.docs;
    const hasMore = docs.length > PAGE_SIZE;
    const items = hasMore ? docs.slice(0, -1) : docs;
    const nextCursor = hasMore ? docs[docs.length - 1].id : null;

    const data: Product[] = items.map((doc) => {
      const d = doc.data();
      return {
        id: doc.id,
        name: d.name || '',
        type: d.type || '',
        color: d.color || '',
        sizes: Array.isArray(d.sizes) ? d.sizes : [],
        frontImageUrl: d.frontImageUrl || '',
        backImageUrl: d.backImageUrl || '',
        destaque: d.destaque ?? false,
        createdAt: d.createdAt?.toDate?.()?.toISOString() || '',
      };
    });

    return NextResponse.json({ items: data, nextCursor });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Erro interno', details: error.message },
      { status: 500 }
    );
  }
}