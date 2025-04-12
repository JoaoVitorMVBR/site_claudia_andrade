// components/Highlights.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';

const Highlights: React.FC = () => {
  const dresses = [
    {
      id: 1,
      name: 'Vestido Estrela',
      price: 'R$ 399,90',
      image: '/images/vestido1.jpg',
      slug: 'vestido-estrela',
    },
    {
      id: 2,
      name: 'Vestido Lua',
      price: 'R$ 499,90',
      image: '/images/vestido2.jpg',
      slug: 'vestido-lua',
    },
    {
      id: 3,
      name: 'Vestido Sol',
      price: 'R$ 349,90',
      image: '/images/vestido3.jpg',
      slug: 'vestido-sol',
    },
  ];

  return (
    <section className="py-12 bg-[#FFFFFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-[Poppins-light] text-3xl text-[#641311] text-center mb-8 tracking-wide">
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
                  src={dress.image}
                  alt={dress.name}
                  fill
                  className="object-contain object-center"
                  quality={75}
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="font-[Poppins-light] text-xl text-[#641311] mb-2 group-hover:text-[#cc936b] transition-colors duration-300">
                  {dress.name}
                </h3>
                <p className="font-[Poppins-light] text-lg text-[#cc936b]">
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