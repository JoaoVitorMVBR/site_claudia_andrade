import type { Meta, StoryObj } from '@storybook/react';
import Login from './Login';
import { useEffect } from 'react';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Componente wrapper para mockar router
const MockWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    (window as any).next = { router: { push: jest.fn() } };
  }, []);
  return <>{children}</>;
};

const meta: Meta<typeof Login> = {
  title: 'Components/Login',
  component: Login,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => (
      <MockWrapper>
        <Story />
      </MockWrapper>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Login>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Formulário de login com campos de usuário e senha.',
      },
    },
  },
  render: () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Login />
    </div>
  ),
};

export const WithError: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Formulário de login exibindo uma mensagem de erro.',
      },
    },
  },
  render: () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Login />
      <p className="text-red-500 text-sm text-center mt-4">
        Usuário ou senha incorretos.
      </p>
    </div>
  ),
};