import type { Meta, StoryObj } from '@storybook/react';
import { PaletteSelector } from './ui/PaletteSelector';

const meta = {
  title: 'Widgets/PaletteSelector',
  component: PaletteSelector,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PaletteSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onPaletteChange: palette => console.log('Selected palette:', palette),
  },
};

export const WithSelectedScheme: Story = {
  args: {
    selectedScheme: {
      id: '1',
      name: 'Ocean Breeze',
      key: 'ocean-breeze',
      primaryColor: '#3B82F6',
      foreignColor: '#06B6D4',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      colorScheme: 'blue',
    },
    onPaletteChange: palette => console.log('Selected palette:', palette),
  },
};
