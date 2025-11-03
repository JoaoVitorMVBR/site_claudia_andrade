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