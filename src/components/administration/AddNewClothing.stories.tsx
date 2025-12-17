import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Administration/AddNewClothing',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

export const Default = {
  render: () => <div>AddNewClothing component - requires Firebase setup</div>,
};
