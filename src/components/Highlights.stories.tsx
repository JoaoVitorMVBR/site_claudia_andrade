// components/Highlights.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import Highlights from './Highlights';

// Configuração do Meta para o Storybook
const meta: Meta<typeof Highlights> = {
  title: 'Components/Highlights',
  component: Highlights,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered', // Centraliza para visualização clara
  },
};

export default meta;

type Story = StoryObj<typeof Highlights>;

// Story padrão
export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Exibição padrão da seção Destaques do Mês, com três vestidos mais visitados.',
      },
    },
    viewport: {
      defaultViewport: 'desktop',
    },
  },
};

export const Mobile: Story = {
  args: {},
  decorators: [
    (Story) => (
      <div className="max-w-[375px]">
        <Story />
      </div>
    ),
  ],
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}