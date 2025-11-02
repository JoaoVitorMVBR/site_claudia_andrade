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

    // Array de cláusulas da query (construímos dinamicamente)
    const queryClauses: any[] = [
      orderBy('createdAt', 'desc'), // Sempre ordena por createdAt (descendente)
      limit(PAGE_SIZE + 1)
    ];

    // Adiciona filtros se existirem
    if (type) queryClauses.unshift(where('type', '==', type)); // unshift para where vir ANTES de orderBy
    if (color) queryClauses.unshift(where('color', '==', color));
    if (size) queryClauses.unshift(where('sizes', 'array-contains', size));
    // Base query com todas as cláusulas
    let q = query(collection(db, 'clothing'), ...queryClauses);

    // Cursor para paginação (apenas se cursor existir)
    if (cursor) {
      // Query para encontrar o documento de cursor
      const cursorQuery = query(
        collection(db, 'clothing'),
        where('__name__', '==', cursor),
        limit(1)
      );
      const cursorSnap = await getDocs(cursorQuery);
      
      if (!cursorSnap.empty) {
        // Adiciona startAfter à query existente
        q = query(q, startAfter(cursorSnap.docs[0]));
      } else {
        // Se cursor inválido, retorna vazio
        return NextResponse.json({ items: [], nextCursor: null });
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
        sizes: d.size || '',
        frontImageUrl: d.frontImageUrl || '',
        backImageUrl: d.backImageUrl || '',
        destaque: d.destaque || false,
        createdAt: d.createdAt?.toDate?.()?.toISOString() || '',
      };
    });
    return NextResponse.json({ items: data, nextCursor });
  } catch (error: any) {
    console.error('API Error:', error);
    
    // Se for erro de índice, retorna mensagem amigável
    if (error.code === 'failed-precondition') {
      return NextResponse.json(
        { 
          error: 'Índice necessário. Crie o índice no link: ' + error.toString().match(/https:\/\/[^\s]+/)?.[0] 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error.message },
      { status: 500 }
    );
  }
}