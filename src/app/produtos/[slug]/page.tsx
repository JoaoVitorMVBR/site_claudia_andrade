// app/[slug]/page.tsx
import DressDetail from '@/components/DressDetail';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { notFound } from 'next/navigation';
import { Product } from '@/types/products';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.claudiandrade.com.br/';

/* ========== GERAR PÁGINAS ESTÁTICAS ========== */
export async function generateStaticParams() {
  try {
    const res = await fetch(`${BASE_URL}/api/clothing/get`);
    if (!res.ok) return [];

    const { items }: { items: Product[] } = await res.json();
    return items.map((item) => ({
      slug: item.id, // id do Firestore = slug da URL
    }));
  } catch (error) {
    console.error('Erro ao gerar static params:', error);
    return [];
  }
}

/* ========== PÁGINA DE DETALHE ========== */
export default async function DressDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const res = await fetch(`${BASE_URL}/api/clothing/getById/${slug}`, {
    next: { revalidate: 60 }, // ISR opcional
  });

  if (!res.ok) {
    notFound();
  }

  const dress: Product = await res.json();

  return (
    <div className="flex flex-col min-h-screen bg-[#FFFFFF]">
      <header>
        <Navbar />
      </header>
      <main className="flex-grow pt-20">
        <DressDetail dress={dress} />
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}