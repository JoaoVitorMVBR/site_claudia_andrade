'use client'

import Link from 'next/link'
import Image from 'next/image'

const BannerHero: React.FC = () => {
  return (
    <section className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Imagem de fundo */}
      <Image
        src="/images/claudia-resize.jpg"
        alt="Coleção de Vestidos"
        fill
        className="object-cover object-center sm:object-[50%_30%] md:object-[50%_30%]" // mobile: centro | sm+: foco ajustado
        priority
        quality={85}
        sizes="100vw"
      />

      {/* Overlay para contraste */}
      <div className="absolute inset-0 bg-[#ffffff]/30" />
    </section>
  )
}

export default BannerHero