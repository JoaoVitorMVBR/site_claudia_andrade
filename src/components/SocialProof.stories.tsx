// components/SocialProof.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import SocialProof from './SocialProof';

// Configuração do Meta para o Storybook
const meta: Meta<typeof SocialProof> = {
  title: 'Components/SocialProof',
  component: SocialProof,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered', // Centraliza para visualização clara
  },
};

export default meta;

type Story = StoryObj<typeof SocialProof>;

// Story padrão
export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Exibição padrão da seção Prova Social, com três depoimentos de clientes.',
      },
    },
    viewport: {
      defaultViewport: 'desktop',
    },
  },
};

// Story com um único depoimento
export const SingleTestimonial: Story = {
  render: () => {
    // Componente wrapper para simular um único depoimento
    const SingleTestimonialWrapper: React.FC = () => {
      const testimonials = [
        {
          name: 'Ana Silva',
          text: 'Alugar meu vestido no Ateliê Sofia foi uma experiência incrível! O atendimento foi impecável, e o vestido era simplesmente perfeito.',
          rating: 5,
          image: 'https://via.placeholder.com/80.png?text=Ana',
        },
      ];

      return (
        <section className="py-12 bg-[#FFFFFF]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-[Poppins-light] text-3xl md:text-4xl text-[#641311] text-center mb-8 tracking-wide">
              O que Nossas Clientes Dizem
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white border border-[#cc936b] rounded-lg p-6 shadow-md text-center flex flex-col items-center"
                >
                  <div className="relative w-16 h-16 mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="rounded-full object-cover w-full h-full"
                    />
                  </div>
                  <h3 className="font-[Poppins-light] text-xl text-[#641311] mb-2">
                    {testimonial.name}
                  </h3>
                  <div className="flex mb-2">
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <svg
                        key={starIndex}
                        className={
                          starIndex < testimonial.rating
                            ? 'text-[#cc936b] w-5 h-5'
                            : 'text-gray-300 w-5 h-5'
                        }
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
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
    return <SingleTestimonialWrapper />;
  },
  parameters: {
    docs: {
      description: {
        story: 'Variação com apenas um depoimento, para testar o layout com menos itens.',
      },
    },
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

// Story com texto mais longo
export const LongText: Story = {
  render: () => {
    // Componente wrapper para simular textos mais longos
    const LongTextWrapper: React.FC = () => {
      const testimonials = [
        {
          name: 'Ana Silva',
          text: 'Minha experiência no Ateliê Sofia foi simplesmente inesquecível. Desde o primeiro contato, o time foi extremamente atencioso, me ajudando a escolher o vestido perfeito para o meu evento. A qualidade da peça era excepcional, e recebi inúmeros elogios durante a noite. Recomendo de olhos fechados!',
          rating: 5,
          image: 'https://via.placeholder.com/80.png?text=Ana',
        },
        {
          name: 'Mariana Costa',
          text: 'Eu estava um pouco insegura sobre alugar um vestido, mas o Ateliê Sofia tornou tudo tão fácil e agradável! O processo foi super tranquilo, o vestido chegou em perfeitas condições e o caimento era impecável. Me senti confiante e linda, e já estou planejando alugar novamente para o próximo evento.',
          rating: 5,
          image: 'https://via.placeholder.com/80.png?text=Mariana',
        },
        {
          name: 'Beatriz Lima',
          text: 'O que mais me impressionou no Ateliê Sofia foi a exclusividade dos vestidos. Escolhi uma peça que parecia feita sob medida para mim, e o atendimento foi tão personalizado que me senti muito especial. A devolução foi prática, e toda a experiência superou minhas expectativas. Voltarei com certeza!',
          rating: 4,
          image: 'https://via.placeholder.com/80.png?text=Beatriz',
        },
      ];

      return (
        <section className="py-12 bg-[#FFFFFF]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-[Poppins-light] text-3xl md:text-4xl text-[#641311] text-center mb-8 tracking-wide">
              O que Nossas Clientes Dizem
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white border border-[#cc936b] rounded-lg p-6 shadow-md text-center flex flex-col items-center"
                >
                  <div className="relative w-16 h-16 mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="rounded-full object-cover w-full h-full"
                    />
                  </div>
                  <h3 className="font-[Poppins-light] text-xl text-[#641311] mb-2">
                    {testimonial.name}
                  </h3>
                  <div className="flex mb-2">
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <svg
                        key={starIndex}
                        className={
                          starIndex < testimonial.rating
                            ? 'text-[#cc936b] w-5 h-5'
                            : 'text-gray-300 w-5 h-5'
                        }
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
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
    return <LongTextWrapper />;
  },
  parameters: {
    docs: {
      description: {
        story: 'Variação com depoimentos mais longos, para testar o comportamento com textos extensos.',
      },
    },
  },
};