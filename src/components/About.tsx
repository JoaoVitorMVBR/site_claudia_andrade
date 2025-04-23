// components/About.tsx
import Image from 'next/image';

const About: React.FC = () => {
  return (
    <section className="relative w-full min-h-screen sm:min-h-[60vh] py-12 bg-[#FFFFFF]">
      {/* Imagem de fundo */}
      <div className="absolute inset-0">
        <Image
          src="/images/zara.jpg"
          alt="Sobre o Ateliê Sofia"
          fill
          className="object-cover object-center w-full h-full"
          quality={75}
          sizes="(max-width: 640px) 100vw, 60vw" // Ajuste responsivo
        />
        {/* Overlay para melhorar legibilidade do texto */}
        <div className="absolute inset-0 bg-[#641311]/40" />
      </div>

      {/* Conteúdo sobreposto */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-screen sm:min-h-[60vh] text-center">
        <h2 className="font-[Poppins-light] text-2xl sm:text-3xl md:text-4xl text-[#cc936b] mb-4 tracking-wide">
          Sobre Nós
        </h2>
        <p className="font-[Poppins-light] text-base sm:text-lg md:text-xl text-white max-w-2xl px-4">
          No Ateliê Sofia, criamos vestidos únicos com paixão e dedicação. Cada peça é feita sob medida para realçar a beleza e a personalidade de quem a veste. Nossa missão é transformar momentos especiais em memórias inesquecíveis.
        </p>
      </div>
    </section>
  );
};

export default About;