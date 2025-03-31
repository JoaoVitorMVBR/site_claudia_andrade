import type { Meta, StoryObj } from '@storybook/react'
import ProductGrid from './ProductGrid'

const meta: Meta<typeof ProductGrid> = {
  title: 'Components/ProductGrid',
  component: ProductGrid,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof ProductGrid>

export const Default: Story = {
  args: {},
}

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
