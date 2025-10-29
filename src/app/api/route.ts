// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'

const PAGE_SIZE = 6

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const cursor = searchParams.get('cursor')
    ? parseInt(searchParams.get('cursor')!)
    : undefined

  try {
    const products = await db.product.findMany({
      where: { published: true },
      select: {
        id: true,
        name: true,
        price: true,
        image: true,
        slug: true,
      },
      orderBy: { id: 'desc' },
      take: PAGE_SIZE + 1, // +1 para verificar se há mais
      ...(cursor && { skip: 1, cursor: { id: cursor } }),
    })

    const hasMore = products.length > PAGE_SIZE
    const items = hasMore ? products.slice(0, -1) : products
    const nextCursor = hasMore ? products[products.length - 1].id : null

    const formatted = items.map(p => ({
      ...p,
      price: `R$ ${parseFloat(p.price).toFixed(2).replace('.', ',')}`,
    }))

    return NextResponse.json({ items: formatted, nextCursor })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar produtos' }, { status: 500 })
  }
}