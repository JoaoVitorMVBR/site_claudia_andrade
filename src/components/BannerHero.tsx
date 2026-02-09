'use client'
import Image from 'next/image'  // pode remover se não usar mais em outro lugar

const BannerHero: React.FC = () => {
  return (
    <section
      className="
        relative w-full
        h-[75vh] sm:h-[80vh] md:h-[85vh] lg:h-[90vh]
        max-h-[900px]
        flex items-center justify-center
        overflow-hidden
      "
    >
      {/* Vídeo de fundo - agora sempre visível (desktop + mobile) */}
      <video
        className="
          absolute inset-0
          w-full h-full
          object-cover
          object-center
        "
        autoPlay
        loop
        muted
        playsInline          // Essencial para iOS/Safari permitir inline + autoplay
        preload="metadata"   // ou "auto" se quiser carregar mais rápido (mas usa mais dados)
        // poster="/images/claudia-resize.jpg"  // Imagem que aparece enquanto carrega ou se falhar
      >
        <source src="/videos/hero-hero.mp4" type="video/mp4" />
        {/* Fallback opcional para navegadores antigos */}
        Seu navegador não suporta vídeo.
      </video>

      {/* Overlay para contraste - continua igual */}
      <div className="absolute inset-0" />
    </section>
  )
}

export default BannerHero