// components/WhyRentDress.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import WhyRentDress from './WhyRent';

// Configuração do Meta para o Storybook
const meta: Meta<typeof WhyRentDress> = {
  title: 'Components/WhyRentDress',
  component: WhyRentDress,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered', // Centraliza para visualização clara
  },
};

export default meta;

type Story = StoryObj<typeof WhyRentDress>;

export const Default: Story = {
    args: {},
    parameters: {
      docs: {
        description: {
          story: 'Exibição padrão da seção Por que Alugar um Vestido, com quatro razões destacadas.',
        },
      },
      viewport: {
        defaultViewport: 'desktop',
      },
    },
  };