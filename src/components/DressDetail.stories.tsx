// components/DressDetail.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import DressDetail from './DressDetail';

const meta: Meta<typeof DressDetail> = {
  title: 'Components/DressDetail',
  component: DressDetail,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof DressDetail>;

export const Default: Story = {
  args: {
    dress: {
      id: 'vestido-vitoria',
      nome: 'Vestido Vitória',
      preco: 'R$ 399,90',
      bordados: 'Renda com pérolas',
      comprimento: 'Longo',
      descricao: 'alguma coisa qualquer',
      cor: 'Vermelho',
      manga: 'Sem manga',
      marca: 'Ateliê Sofia',
      tamanho: 'M',
      codigoProduto: 'VIT-001',
      frontImage: '/images/dresses/vitoria-front.jpg',
      backImage: '/images/dresses/vitoria-back.jpg',
      slug: 'vestido-vitoria',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Exibição padrão do detalhe de um vestido com imagens e informações do Firestore.',
      },
    },
    viewport: {
      defaultViewport: 'desktop',
    },
  },
  render: ({ dress }) => (
    <section className="py-12 bg-[#FFFFFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-[Poppins-light] text-3xl md:text-4xl text-[#641311] text-center mb-8 tracking-wide">
          {dress.nome}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <div className="relative w-full sm:w-1/2 aspect-[3/4] group">
              <img
                src={dress.frontImage}
                alt={`${dress.nome} - Frente`}
                className="object-contain object-center rounded-lg border border-[#cc936b] w-full h-full"
              />
              <button
                className="absolute top-2 right-2 bg-[#641311] text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                aria-label="Ampliar imagem da frente"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
            <div className="relative w-full sm:w-1/2 aspect-[3/4] group">
              <img
                src={dress.backImage}
                alt={`${dress.nome} - Verso`}
                className="object-contain object-center rounded-lg border border-[#cc936b] w-full h-full"
              />
              <button
                className="absolute top-2 right-2 bg-[#641311] text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                aria-label="Ampliar imagem do verso"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center md:items-start text-center md:text-left">
            <p className="font-[Poppins-light] text-gray-700 text-base sm:text-lg mb-6">
              {dress.descricao}
            </p>
            <p className="font-[Poppins-light] text-2xl text-[#cc936b] mb-4">{dress.preco}</p>
            <div className="font-[Poppins-light] text-gray-700 text-base sm:text-lg mb-6 space-y-2">
              <p><strong>Bordados:</strong> {dress.bordados}</p>
              <p><strong>Comprimento:</strong> {dress.comprimento}</p>
              <p><strong>Cor:</strong> {dress.cor}</p>
              <p><strong>Manga:</strong> {dress.manga}</p>
              <p><strong>Marca:</strong> {dress.marca}</p>
              <p><strong>Tamanho:</strong> {dress.tamanho}</p>
              <p><strong>Código do Produto:</strong> {dress.codigoProduto}</p>
            </div>
            <button className="bg-[#641311] text-white py-2 px-6 rounded-md hover:bg-[#cc936b] transition-colors duration-300 font-[Poppins-light]">
              Alugar Agora
            </button>
          </div>
        </div>
      </div>
    </section>
  ),
};

// Outras stories (LongDescription, Mobile) podem ser adicionadas conforme necessário