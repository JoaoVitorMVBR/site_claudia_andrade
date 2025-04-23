'use client'

import Link from 'next/link'
import Image from 'next/image'

const BannerHero: React.FC = () => {
  return (
    <section className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Imagem de fundo */}
      <Image
        src="/images/zara.jpg" // Substitua pelo caminho real da sua imagem
        alt="Coleção de Vestidos"
        fill
        className="object-cover object-top"
        priority // Carrega imediatamente por ser Hero
        quality={85} // Equilíbrio entre qualidade e desempenho (padrão é 75)
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, 100vw" // Ajuda o navegador a escolher o tamanho certo
      />

      {/* Overlay para contraste */}
      <div className="absolute inset-0 bg-[#641311]/40" />

      {/* Conteúdo */}
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="font-moondance text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-[#cc936b] mb-4 tracking-wide">
          Vestidos Finos
        </h1>
        <Link
          href="/vestidos"
          className="inline-block bg-[#cc936b] text-[#641311] font-[Poppins-light] text-xs md:text-xs  py-3 px-6 rounded-md hover:bg-[#cc936b]/80 transition-colors duration-300"
        >
          Ver Coleção
        </Link>
      </div>
    </section>
  )
}

export default BannerHero
