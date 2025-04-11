// components/About.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import About from './About';

const meta: Meta<typeof About> = {
  title: 'Components/About',
  component: About,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof About>;

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Seção Sobre Nós com imagem de fundo e texto sobreposto, ajustada para responsividade.',
      },
    },
    viewport: { // Permite testar diferentes tamanhos de tela
      defaultViewport: 'desktop',
    },
  },
};

export const Mobile: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Seção Sobre Nós em layout mobile, ocupando a tela inteira.',
      },
    },
    viewport: {
      defaultViewport: 'mobile1', // Simula um dispositivo móvel
    },
  },
};