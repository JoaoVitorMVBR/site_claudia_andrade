// components/About.tsx
import Image from 'next/image';

const About: React.FC = () => {
  return (
    <section className="relative w-full min-h-screen sm:min-h-[60vh] py-12 bg-[#FFFFFF]">
      {/* Imagem de fundo */}
      <div className="absolute inset-0">
        <Image
          src="/images/claudia1.jpeg"
          alt=""
          fill
          className="object-cover object-[center_25%] w-full h-full"
          quality={75}
          sizes="(max-width: 640px) 100vw, 60vw" // Ajuste responsivo
        />
        {/* Overlay para melhorar legibilidade do texto */}
        <div className="absolute inset-0 bg-[#ffffff]/40" />
      </div>

      {/* Conteúdo sobreposto */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-screen sm:min-h-[60vh] text-center">
        <h2 className="font-[Poppins-light] text-2xl sm:text-3xl md:text-4xl text-[#000000] mb-4 tracking-wide">
          Sobre Nós
        </h2>
        <p className="font-[Poppins-light] text-base sm:text-lg md:text-xl text-white max-w-2xl px-4">
          Fundada em 2007, a Loja de Locação de Vestidos Cláudia Andrade nasceu da paixão de Cláudia Andrade pela moda e pela crença no poder de um vestido transformar a autoestima de uma mulher.

          Tudo começou de forma simples, em uma pequena sala comercial, onde Cláudia dedicava-se pessoalmente a cada detalhe, desde o atendimento até os ajustes. O atendimento personalizado e a qualidade dos vestidos impulsionaram o rápido crescimento, movido pelo boca a boca das clientes.

          Com o tempo, o espaço ficou pequeno. A loja evoluiu, transformando uma casa inteira em um verdadeiro ateliê de locação. Hoje, a Cláudia Andrade oferece uma experiência completa em um ambiente charmoso e acolhedor, da escolha do modelo aos ajustes finais.

          Mais do que uma loja, é um símbolo de evolução, dedicação e amor à moda, mantendo viva a essência do sonho que começou em 2007.
        </p>
      </div>
    </section>
  );
};

export default About;