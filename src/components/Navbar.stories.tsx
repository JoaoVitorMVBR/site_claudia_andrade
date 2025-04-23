import type { Meta, StoryObj } from '@storybook/react'
import Navbar from './Navbar'

const meta: Meta<typeof Navbar> = {
  title: 'Components/Navbar',
  component: Navbar,
  parameters: {
    layout: 'fullscreen', // Faz o componente ocupar toda a tela no Storybook
  },
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof Navbar>

export const Default: Story = {
  args: {},
}
