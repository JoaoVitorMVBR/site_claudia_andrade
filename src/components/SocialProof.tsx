// components/SocialProof.tsx
'use client';

import Image from 'next/image';
import { FaStar } from 'react-icons/fa';

const SocialProof: React.FC = () => {
  const testimonials = [
    {
      name: 'Poliana Oliveira',
      text: 'Excelente serviço e grande seleção de opções, com preços para atender todas as ocasiões!',
      rating: 5,
      // image: '/images/imgWoman.jpeg',
    },
    {
      name: 'Natalia Santana',
      text: 'Várias opções de roupas, roupas bem conservadas. A saída impressiona com a qualidade dos itens. São pontuais com entregas e cuidadosas com o seu serviço.',
      rating: 5,
      // image: '/images/imgWoman.jpeg',
    },
    {
      name: 'Nayara Gonçalves',
      text: 'O melhor lugar de aluguel de vestidos da cidade. Excelente serviço, atmosfera agradável, e vestidos maravilhosos.',
      rating: 5,
      // image: '/images/imgWoman.jpeg',
    },
  ];

  return (
    <section className="py-12 bg-[#FFFFFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-[Poppins-light] text-3xl text-[#641311] text-center mb-8 tracking-wide">
          O que Nossas Clientes Dizem
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white border border-[#cc936b] rounded-lg p-6 shadow-md text-center flex flex-col items-center"
            >
              <div className="relative w-16 h-16 mb-4">
                {/* <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  fill
                  className="rounded-full object-cover"
                  quality={75}
                /> */}
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
                        ? 'text-[#000000]'
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