import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import AddNewClothing from './AddNewClothing';

const meta: Meta<typeof AddNewClothing> = {
  title: 'Components/AddNewClothing',
  component: AddNewClothing,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof AddNewClothing>;

export const Default: Story = {
  args: {},
};