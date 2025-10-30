// app/api/clothing/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { 
  collection, 
  query, 
  orderBy, 
  startAfter, 
  limit, 
  getDocs, 
  where 
} from 'firebase/firestore';
import { Product } from '@/types/products';

const PAGE_SIZE = 12;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get('cursor');
    const type = searchParams.get('type') || '';
    const color = searchParams.get('color') || '';
    const size = searchParams.get('size') || '';

    // Base query
    let q = query(
      collection(db, 'clothing'),
      orderBy('createdAt', 'desc'),
      limit(PAGE_SIZE + 1)
    );

    // Filtros
    if (type || color || size) {
      const filters: any[] = [];
      if (type) filters.push(where('type', '==', type));
      if (color) filters.push(where('color', '==', color));
      if (size) filters.push(where('size', '==', size));

      q = query(
        collection(db, 'clothing'),
        ...filters,
        orderBy('createdAt', 'desc'),
        limit(PAGE_SIZE + 1)
      );
    }

    // Cursor (paginação)
    if (cursor) {
      const cursorQuery = query(
        collection(db, 'clothing'),
        where('__name__', '==', cursor),
        limit(1)
      );
      const cursorSnap = await getDocs(cursorQuery);
      if (!cursorSnap.empty) {
        q = query(q, startAfter(cursorSnap.docs[0]));
      }
    }

    const snapshot = await getDocs(q);
    const docs = snapshot.docs;

    const hasMore = docs.length > PAGE_SIZE;
    const items = hasMore ? docs.slice(0, -1) : docs;
    const nextCursor = hasMore ? docs[docs.length - 1].id : null;

    const data: Product[] = items.map(doc => {
      const d = doc.data();
      return {
        id: doc.id,
        name: d.name || '',
        type: d.type || '',
        color: d.color || '',
        size: d.size || '',
        frontImageUrl: d.frontImageUrl || '',
        backImageUrl: d.backImageUrl || '',
        destaque: d.destaque || false,
        createdAt: d.createdAt?.toDate?.()?.toISOString() || '',
      };
    });

    return NextResponse.json({ items: data, nextCursor });
  } catch (error: any) {
    console.error('API Error:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor', details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}