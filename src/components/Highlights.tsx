'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, limit, onSnapshot } from 'firebase/firestore';

interface Dress {
  id: string;
  name: string;
  price?: string; // opcional (pode vir do banco ou fixo)
  frontImageUrl: string;
  slug: string;
  destaque: boolean;
}

const Highlights: React.FC = () => {
  const [dresses, setDresses] = useState<Dress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Busca apenas os 3 vestidos com destaque = true
    const q = query(
      collection(db, 'clothing'),
      where('destaque', '==', true),
      limit(3)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const firestoreData = doc.data();
        return {
          id: doc.id,
          name: firestoreData.name,
          price: firestoreData.price || 'Sob Consulta', // fallback
          frontImageUrl: firestoreData.frontImageUrl,
          slug: firestoreData.slug || doc.id, // usa slug ou ID
          destaque: firestoreData.destaque,
        } as Dress;
      });
      setDresses(data);
      setLoading(false);
    }, (error) => {
      console.error('Erro ao carregar destaques:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <section className="py-12 bg-[#FFFFFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-500">Carregando destaques...</p>
        </div>
      </section>
    );
  }

  if (dresses.length === 0) {
    return (
      <section className="py-12 bg-[#FFFFFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600">Nenhum vestido em destaque no momento.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-[#FFFFFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-[Poppins-light] text-3xl text-[#000000] text-center mb-8 tracking-wide">
          Destaques do Mês
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {dresses.map((dress) => (
            <Link
              key={dress.id}
              href={`/produtos/${dress.slug}`}
              className="group block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="relative w-full aspect-[3/4]">
                <Image
                  src={dress.frontImageUrl}
                  alt={dress.name}
                  fill
                  className="object-contain object-center"
                  quality={75}
                  unoptimized // ← necessário para URLs do Firebase
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="font-[Poppins-light] text-xl text-[#000000] mb-2 group-hover:text-[#000000] transition-colors duration-300">
                  {dress.name}
                </h3>
                <p className="font-[Poppins-light] text-lg text-[#000000]">
                  {dress.price}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Highlights;