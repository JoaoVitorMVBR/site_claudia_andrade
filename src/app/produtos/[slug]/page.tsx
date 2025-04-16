// app/produtos/[slug]/page.tsx
import DressDetail from '@/components/DressDetail';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function DressDetailPage({ params }: { params: { slug: string } }) {
  // Dados fictícios com imagens locais
  const dresses = [
    {
      id: 1,
      name: 'Vestido vitoria',
      price: 'R$ 399,90',
      description:
        'Um vestido elegante com detalhes brilhantes, perfeito para ocasiões especiais. Confeccionado com tecidos de alta qualidade, garante conforto e sofisticação.',
      frontImage: '/images/vitoria.jpg',
      backImage: '/images/vitoria-verso.jpg',
      slug: 'vestido-vitoria',
    },
  ];

  const dress = dresses.find((d) => d.slug === params.slug);

  if (!dress) {
    return (
      <div className="flex flex-col min-h-screen bg-[#FFFFFF]">
        <header>
          <Navbar />
        </header>
        <main className="flex-grow flex items-center justify-center">
          <p className="font-[Poppins-light] text-xl text-[#641311]">
            Ops, Vestido não encontrado 
          </p>
        </main>
        <footer>
          <Footer />
        </footer>
      </div>
    );
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