import type { Meta, StoryObj } from '@storybook/react'
import Footer from './Footer'

const meta: Meta<typeof Footer> = {
  title: 'Components/Footer',
  component: Footer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof Footer>

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
