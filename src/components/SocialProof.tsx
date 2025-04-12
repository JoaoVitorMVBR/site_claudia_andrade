// components/SocialProof.tsx
'use client';

import Image from 'next/image';
import { FaStar } from 'react-icons/fa';

const SocialProof: React.FC = () => {
  const testimonials = [
    {
      name: 'Ana Silva',
      text: 'Alugar meu vestido no Ateliê Sofia foi uma experiência incrível! O atendimento foi impecável, e o vestido era simplesmente perfeito.',
      rating: 5,
      image: 'https://via.placeholder.com/80.png?text=Ana',
    },
    {
      name: 'Mariana Costa',
      text: 'Os vestidos são de altíssima qualidade, e o processo de aluguel é super prático. Me senti uma verdadeira princesa no meu evento!',
      rating: 5,
      image: 'https://via.placeholder.com/80.png?text=Mariana',
    },
    {
      name: 'Beatriz Lima',
      text: 'Amei a exclusividade das peças e a atenção aos detalhes. Recomendo o Ateliê Sofia para qualquer ocasião especial!',
      rating: 4,
      image: 'https://via.placeholder.com/80.png?text=Beatriz',
    },
  ];

  return (
    <section className="py-12 bg-[#FFFFFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-[Poppins-light] text-3xl md:text-4xl text-[#641311] text-center mb-8 tracking-wide">
          O que Nossas Clientes Dizem
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white border border-[#cc936b] rounded-lg p-6 shadow-md text-center flex flex-col items-center"
            >
              <div className="relative w-16 h-16 mb-4">
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  fill
                  className="rounded-full object-cover"
                  quality={75}
                />
              </div>
              <h3 className="font-[Poppins-light] text-xl text-[#641311] mb-2">
                {testimonial.name}
              </h3>
              <div className="flex mb-2">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <FaStar
                    key={starIndex}
                    className={
                      starIndex < testimonial.rating
                        ? 'text-[#cc936b]'
                        : 'text-gray-300'
                    }
                  />
                ))}
              </div>
              <p className="font-[Poppins-light] text-gray-700 text-sm sm:text-base">
                "{testimonial.text}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;