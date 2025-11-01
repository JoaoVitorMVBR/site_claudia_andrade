// components/DressDetail.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FaSearchPlus, FaTimes } from 'react-icons/fa';
import { Product } from '@/types/products';

// Número do WhatsApp (coloque no .env depois)
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '553888319214'; // Altere aqui ou use .env

const DressDetail: React.FC<{ dress: Product }> = ({ dress }) => {
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const openZoom = (image: string) => setZoomedImage(image);
  const closeZoom = () => setZoomedImage(null);

  // Função para abrir WhatsApp com mensagem personalizada
  const handleWhatsAppClick = () => {
    const message = `Gostaria de fazer um orçamento do ${dress.name}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="py-12 bg-[#FFFFFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-[Poppins-light] text-3xl md:text-4xl text-[#641311] text-center mb-8 tracking-wide">
          {dress.name}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Imagens */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            {/* Frente */}
            <div className="relative w-full sm:w-1/2 aspect-[3/4] group">
              <Image
                src={dress.frontImageUrl}
                alt={`${dress.name} - Frente`}
                fill
                className="object-contain object-center rounded-lg"
                quality={75}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <button
                onClick={() => openZoom(dress.frontImageUrl)}
                className="absolute top-2 right-2 bg-[#641311] text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                aria-label="Ampliar imagem da frente"
              >
                <FaSearchPlus />
              </button>
            </div>

            {/* Verso */}
            <div className="relative w-full sm:w-1/2 aspect-[3/4] group">
              <Image
                src={dress.backImageUrl}
                alt={`${dress.name} - Verso`}
                fill
                className="object-contain object-center rounded-lg"
                quality={75}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <button
                onClick={() => openZoom(dress.backImageUrl)}
                className="absolute top-2 right-2 bg-[#641311] text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                aria-label="Ampliar imagem do verso"
              >
                <FaSearchPlus />
              </button>
            </div>
          </div>

          {/* Detalhes */}
          <div className="flex flex-col justify-center items-center md:items-start text-center md:text-left space-y-4">
            {/* Informações do vestido */}
            <div className="space-y-2 text-lg">
              <p className="font-[Poppins-light] text-gray-700">
                <strong>Tipo:</strong> {dress.type}
              </p>
              <p className="font-[Poppins-light] text-gray-700">
                <strong>Cor:</strong> {dress.color}
              </p>
              <p className="font-[Poppins-light] text-gray-700">
                <strong>Tamanho:</strong> {dress.size}
              </p>
            </div>

            {/* Destaque */}
            {dress.destaque && (
              <span className="inline-block bg-[#cc936b] text-white px-4 py-1 rounded-full text-sm font-[Poppins-light]">
                Destaque
              </span>
            )}

            {/* Botão de ação com WhatsApp */}
            <button
              onClick={handleWhatsAppClick}
              className="bg-[#641311] text-white py-2 px-6 rounded-md hover:bg-[#cc936b] transition-colors duration-300 font-[Poppins-light] mt-4"
            >
              Fazer orçamento
            </button>
          </div>
        </div>

        {/* Modal de Zoom */}
        {zoomedImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={closeZoom}
          >
            <button
              onClick={closeZoom}
              className="absolute top-4 right-4 text-white text-3xl hover:text-[#cc936b] transition"
              aria-label="Fechar zoom"
            >
              <FaTimes />
            </button>
            <div className="relative w-full h-full max-w-4xl max-h-4xl">
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