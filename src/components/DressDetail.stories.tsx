// components/DressDetail.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import DressDetail from './DressDetail';

// Configuração do Meta para o Storybook
const meta: Meta<typeof DressDetail> = {
  title: 'Components/DressDetail',
  component: DressDetail,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen', // Usa tela cheia para simular página
  },
};

export default meta;

type Story = StoryObj<typeof DressDetail>;

// Story padrão
export const Default: Story = {
  args: {
    dress: {
      id: 1,
      name: 'Vestido Estrela',
      price: 'R$ 399,90',
      description:
        'Um vestido elegante com detalhes brilhantes, perfeito para ocasiões especiais. Confeccionado com tecidos de alta qualidade, garante conforto e sofisticação.',
      frontImage: 'https://via.placeholder.com/300x400.png?text=Estrela+Frente',
      backImage: 'https://via.placeholder.com/300x400.png?text=Estrela+Verso',
      slug: 'vestido-estrela',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Exibição padrão do detalhe de um vestido com imagens de frente e verso e funcionalidade de zoom.',
      },
    },
    viewport: {
      defaultViewport: 'desktop',
    },
  },
};

// Story com descrição longa
export const LongDescription: Story = {
  args: {
    dress: {
      id: 2,
      name: 'Vestido Lua',
      price: 'R$ 499,90',
      description:
        'O Vestido Lua é a escolha ideal para quem busca sofisticação e exclusividade. Com detalhes artesanais e um caimento impecável, este modelo combina elegância e conforto. Perfeito para eventos noturnos, ele destaca a silhueta com delicadeza e charme. Feito com tecidos premium, garante uma experiência única para ocasiões especiais.',
      frontImage: 'https://via.placeholder.com/300x400.png?text=Lua+Frente',
      backImage: 'https://via.placeholder.com/300x400.png?text=Lua+Verso',
      slug: 'vestido-lua',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Variação com uma descrição mais longa, para testar o layout com textos extensos.',
      },
    },
  },
};

// Story em mobile
export const Mobile: Story = {
  args: {
    dress: {
      id: 3,
      name: 'Vestido Sol',
      price: 'R$ 349,90',
      description:
        'Um vestido vibrante e leve, ideal para eventos diurnos. Combina simplicidade com elegância.',
      frontImage: 'https://via.placeholder.com/300x400.png?text=Sol+Frente',
      backImage: 'https://via.placeholder.com/300x400.png?text=Sol+Verso',
      slug: 'vestido-sol',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Exibição do componente em layout mobile, com imagens e texto ajustados.',
      },
    },
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};