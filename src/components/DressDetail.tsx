'use client';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import {
  FaSearchPlus,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaWhatsapp,
} from 'react-icons/fa';
import { Product } from '@/types/products';

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '553888319214';

const DressDetail: React.FC<{ dress: Product }> = ({ dress }) => {
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<'front' | 'back'>('front');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const imageRef = useRef<HTMLDivElement>(null);

  const openZoom = (image: string) => setZoomedImage(image);
  const closeZoom = () => setZoomedImage(null);

  const switchImage = (direction: 'left' | 'right') => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentImage(prev => (prev === 'front' ? 'back' : 'front'));
    setTimeout(() => setIsTransitioning(false), 300);
  };

  // Toque no mobile para zoom
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) switchImage('right');
    if (isRightSwipe) switchImage('left');
  };

  // Compartilhar via WhatsApp com imagem
  const handleWhatsAppShare = async () => {
    const message = `Olá, gostaria de fazer um orçamento do vestido *${dress.name}*.\n\nTipo: ${dress.type}\nCor: ${dress.color}\nTamanhos: ${dress.sizes.join(', ')}`;

    try {
      // Tenta usar Web Share API com imagem
      const response = await fetch(currentImageUrl);
      const blob = await response.blob();
      const file = new File([blob], `vestido-${currentImage}.jpg`, { type: blob.type });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: dress.name,
          text: message,
          files: [file],
        });
      } else {
        // Fallback: apenas texto
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (err) {
      // Fallback final
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const currentImageUrl = currentImage === 'front' ? dress.frontImageUrl : dress.backImageUrl;
  const currentAlt = currentImage === 'front' ? 'Frente' : 'Verso';

  return (
    <section className="py-12 bg-[#FFFFFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-[Poppins-light] text-4xl md:text-5xl text-[#641311] text-center mb-10 tracking-wide">
          {dress.name}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* IMAGEM PRINCIPAL COM CARROSSEL */}
          <div className="relative">
            <div
              ref={imageRef}
              className="relative w-full aspect-[3/4] bg-gray-50 rounded-lg overflow-hidden shadow-xl cursor-zoom-in"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onClick={() => openZoom(currentImageUrl)}
            >
              <div
                className={`absolute inset-0 transition-opacity duration-300 ${
                  isTransitioning ? 'opacity-0' : 'opacity-100'
                }`}
              >
                <Image
                  src={currentImageUrl}
                  alt={`${dress.name} - ${currentAlt}`}
                  fill
                  className="object-contain object-center"
                  quality={90}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>

              {/* Botão Zoom (desktop) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openZoom(currentImageUrl);
                }}
                className="absolute top-4 right-4 bg-[#641311] text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md hover:bg-[#cc936b] hidden sm:block"
                aria-label="Ampliar imagem"
              >
                <FaSearchPlus className="w-5 h-5" />
              </button>

              {/* Flechas de navegação */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  switchImage('left');
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 text-[#641311] p-3 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-200 z-10"
                aria-label="Imagem anterior"
              >
                <FaChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  switchImage('right');
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 text-[#641311] p-3 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-200 z-10"
                aria-label="Próxima imagem"
              >
                <FaChevronRight className="w-5 h-5" />
              </button>

              {/* Indicador de imagem */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 px-3 py-1 rounded-full">
                <div
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentImage === 'front' ? 'bg-white scale-125' : 'bg-gray-400'
                  }`}
                />
                <div
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentImage === 'back' ? 'bg-white scale-125' : 'bg-gray-400'
                  }`}
                />
              </div>
            </div>

            {/* MINIATURAS */}
            <div className="flex gap-3 mt-4 justify-center">
              <button
                onClick={() => setCurrentImage('front')}
                className={`relative w-20 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                  currentImage === 'front'
                    ? 'border-[#641311] shadow-md scale-105'
                    : 'border-gray-300 hover:border-[#cc936b]'
                }`}
              >
                <Image
                  src={dress.frontImageUrl}
                  alt="Frente"
                  fill
                  className="object-cover"
                />
              </button>
              <button
                onClick={() => setCurrentImage('back')}
                className={`relative w-20 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                  currentImage === 'back'
                    ? 'border-[#641311] shadow-md scale-105'
                    : 'border-gray-300 hover:border-[#cc936b]'
                }`}
              >
                <Image
                  src={dress.backImageUrl}
                  alt="Verso"
                  fill
                  className="object-cover"
                />
              </button>
            </div>
          </div>

          {/* DETALHES */}
          <div className="flex flex-col justify-center space-y-6 text-center lg:text-left">
            <div className="space-y-4">
              <p className="font-[Poppins-light] text-2xl text-gray-800">
                <strong className="text-[#641311]">Tipo:</strong> {dress.type}
              </p>
              <p className="font-[Poppins-light] text-2xl text-gray-800">
                <strong className="text-[#641311]">Cor:</strong> {dress.color}
              </p>

              <div>
                <p className="font-[Poppins-light] text-2xl text-[#641311] mb-3">
                  <strong>Tamanhos disponíveis:</strong>
                </p>
                <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                  {Array.isArray(dress.sizes) && dress.sizes.length > 0 ? (
                    dress.sizes.map((size, index) => (
                      <span
                        key={index}
                        className="inline-block bg-[#641311] text-white text-lg px-5 py-2 rounded-full font-[Poppins-light] shadow-sm"
                      >
                        {size}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-lg italic">
                      Nenhum tamanho cadastrado
                    </span>
                  )}
                </div>
              </div>
            </div>

            {dress.destaque && (
              <span className="inline-block bg-[#cc936b] text-white px-6 py-2 rounded-full text-lg font-[Poppins-light] shadow-md">
                Destaque
              </span>
            )}

            <button
              onClick={handleWhatsAppShare}
              className="bg-[#641311] text-white py-4 px-8 rounded-lg hover:bg-[#cc936b] transition-all duration-300 font-[Poppins-light] text-xl shadow-lg hover:shadow-xl transform hover:scale-105 mt-6 flex items-center justify-center gap-3"
            >
              <FaWhatsapp className="w-6 h-6" />
              Fazer orçamento
            </button>
          </div>
        </div>

        {/* MODAL DE ZOOM */}
        {zoomedImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
            onClick={closeZoom}
          >
            <button
              onClick={closeZoom}
              className="absolute top-6 right-6 text-white text-4xl hover:text-[#cc936b] transition z-10"
              aria-label="Fechar zoom"
            >
              <FaTimes />
            </button>
            <div className="relative w-full h-full max-w-5xl max-h-5xl">
              <Image
                src={zoomedImage}
                alt="Imagem ampliada"
                fill
                className="object-contain"
                quality={100}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default DressDetail;