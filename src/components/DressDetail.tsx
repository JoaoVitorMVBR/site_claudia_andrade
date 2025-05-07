// components/DressDetail.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FaSearchPlus, FaTimes } from 'react-icons/fa';

interface Dress {
  id: string;
  nome: string;
  preco: string;
  bordados: string;
  comprimento: string;
  descricao: string;
  cor: string;
  manga: string;
  marca: string;
  tamanho: string;
  codigoProduto: string;
  frontImage: string;
  backImage: string;
  slug: string;
}

const DressDetail: React.FC<{ dress: Dress }> = ({ dress }) => {
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const openZoom = (image: string) => {
    setZoomedImage(image);
  };

  const closeZoom = () => {
    setZoomedImage(null);
  };

  return (
    <section className="py-12 bg-[#FFFFFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-[Poppins-light] text-3xl md:text-4xl text-[#641311] text-center mb-8 tracking-wide">
          {dress.nome}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Imagens */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            {/* Frente */}
            <div className="relative w-full sm:w-1/2 aspect-[3/4] group">
              <Image
                src={dress.frontImage}
                alt={`${dress.nome} - Frente`}
                fill
                className="object-contain object-center rounded-lg "
                quality={75}
                // onError={(e) => {
                //   e.currentTarget.src = fallbackImage;
                // }}
              />
              <button
                onClick={() => openZoom(dress.frontImage)}
                className="absolute top-2 right-2 bg-[#641311] text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                aria-label="Ampliar imagem da frente"
              >
                <FaSearchPlus />
              </button>
            </div>
            {/* Verso */}
            <div className="relative w-full sm:w-1/2 aspect-[3/4] group">
              <Image
                src={dress.backImage}
                alt={`${dress.nome} - Verso`}
                fill
                className="object-contain object-center rounded-lg "
                quality={75}
              />
              <button
                onClick={() => openZoom(dress.backImage)}
                className="absolute top-2 right-2 bg-[#641311] text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                aria-label="Ampliar imagem do verso"
              >
                <FaSearchPlus />
              </button>
            </div>
          </div>

          {/* Detalhes */}
          <div className="flex flex-col justify-center items-center md:items-start text-center md:text-left">
            <p className="font-[Poppins-light] text-2xl text-[#cc936b] mb-4">
              {dress.preco}
            </p>
            <div className="font-[Poppins-light] text-gray-700 text-base sm:text-lg mb-6 space-y-2">
              <p><strong>Bordados:</strong> {dress.bordados}</p>
              <p><strong>Comprimento:</strong> {dress.comprimento}</p>
              <p><strong>Cor:</strong> {dress.cor}</p>
              <p><strong>Manga:</strong> {dress.manga}</p>
              <p><strong>Marca:</strong> {dress.marca}</p>
              <p><strong>Tamanho:</strong> {dress.tamanho}</p>
              <p><strong>Código do Produto:</strong> {dress.codigoProduto}</p>
            </div>
            <p className="font-[Poppins-light] text-gray-700 text-base sm:text-lg mb-6">
              {dress.descricao}
            </p>
            <button className="bg-[#641311] text-white py-2 px-6 rounded-md hover:bg-[#cc936b] transition-colors duration-300 font-[Poppins-light]">
              Alugar Agora
            </button>
          </div>
        </div>

        {/* Modal de Zoom */}
        {zoomedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <button
              onClick={closeZoom}
              className="absolute top-4 right-4 text-white text-2xl"
              aria-label="Fechar zoom"
            >
              <FaTimes />
            </button>
            <div className="relative w-[90vw] h-[90vh] max-w-4xl">
              <Image
                src={zoomedImage}
                alt="Imagem ampliada"
                fill
                className="object-contain"
                quality={100}
                // onError={(e) => {
                //   e.currentTarget.src = fallbackImage;
                // }}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default DressDetail;