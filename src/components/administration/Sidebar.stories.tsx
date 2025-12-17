import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Administration/Sidebar',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

export const Default = {
  render: () => <div>Sidebar component - requires Next.js router</div>,
};
