// components/FAQSection.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import FAQSection from './Faq';

// Configuração do Meta para o Storybook
const meta: Meta<typeof FAQSection> = {
  title: 'Components/FAQSection',
  component: FAQSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen', // Centraliza o componente
  },
};

export default meta;

type Story = StoryObj<typeof FAQSection>;

// Story padrão
export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Seção de FAQ com perguntas e respostas expansíveis.',
      },
    },
  },
};