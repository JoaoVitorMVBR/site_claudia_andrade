import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import Sidebar from './Sidebar'; // Adjust path as needed

const meta: Meta<typeof Sidebar> = {
  title: 'Components/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {
  args: {},
};