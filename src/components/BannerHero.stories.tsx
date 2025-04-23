import type { Meta, StoryObj } from '@storybook/react'
import BannerHero from './BannerHero'

const meta: Meta<typeof BannerHero> = {
  title: 'Components/BannerHero',
  component: BannerHero,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof BannerHero>

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
