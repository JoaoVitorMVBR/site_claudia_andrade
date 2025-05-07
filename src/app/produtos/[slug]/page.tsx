import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import DressDetail from '@/components/DressDetail';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { notFound } from 'next/navigation';

// Definir tipo do vestido
interface Dress {
  id: string;
  nome: string;
  preco: string;
  bordados: string;
  comprimento: string;
  descricao: string;
  cor: string;
  manga: string;
  marca: string;
  tamanho: string;
  codigoProduto: string;
  frontImage: string;
  backImage: string;
  slug: string;
}

export default function DressDetailPage({ params }: { params: { slug: string } }) {
  const [dress, setDress] = useState<Dress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDress = async () => {
      try {
        const docRef = doc(db, 'vestidos', params.slug);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setDress({ id: docSnap.id, ...docSnap.data() } as Dress);
        } else {
          setDress(null);
        }
      } catch (error) {
        console.error('Erro ao buscar vestido:', error);
        setDress(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDress();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#FFFFFF]">
        <header>
          <Navbar />
        </header>
        <main className="flex-grow flex items-center justify-center">
          <p className="font-[Poppins-light] text-xl text-[#641311]">
            Carregando...
          </p>
        </main>
        <footer>
          <Footer />
        </footer>
      </div>
    );
  }

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
  