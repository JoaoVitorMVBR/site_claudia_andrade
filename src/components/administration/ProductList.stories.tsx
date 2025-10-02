import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import Sidebar from './Sidebar'; // Adjust path as needed
import ProductList from './ProductList';

const meta: Meta<typeof ProductList> = {
  title: 'Components/ProductList',
  component: ProductList,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof ProductList>;

export const Default: Story = {
  args: {},
};