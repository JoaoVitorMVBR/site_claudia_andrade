import DressDetail from '@/components/DressDetail';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { notFound } from 'next/navigation';

// Definir tipo do vestido
interface Dress {
  id: number;
  name: string;
  price: string;
  description: string;
  frontImage: string;
  backImage: string;
  slug: string;
}

// Array local de vestidos
const dresses: Dress[] = [
  {
	id: 1,
	name: 'Vestido Vitoria',
	price: 'R$ 399,90',
	description:
  	'Um vestido elegante com detalhes brilhantes, perfeito para ocasiões especiais. Confeccionado com tecidos de alta qualidade, garante conforto e sofisticação.',
	frontImage: '/images/vitoria.jpg',
	backImage: '/images/vitoria-verso.jpg',
	slug: 'vestido-vitoria',
  },
]

// Definir tipo dos props de forma flexível
type tParams = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return dresses.map((dress) => ({ slug: dress.slug }));
}

export default async function DressDetailPage({ params }: { params: tParams }) {
  // Resolver params, caso seja um Promise
  const { slug }: { slug: string } = await params;
  // Buscar o vestido pelo slug no array local
  const dress = dresses.find((d) => d.slug === slug);

  // console.log('params:', params, typeof params);
  // console.log('resolvedParams:', resolvedParams);

  if (!dress) {
    notFound(); // Aciona a página 404 do Next.js
  }

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
  