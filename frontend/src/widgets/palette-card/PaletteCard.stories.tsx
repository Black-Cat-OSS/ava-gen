import type { Meta, StoryObj } from '@storybook/react';
import { PaletteCard } from './ui/PaletteCard';
import type { Pallete } from '@/entities';

const mockPalette: Pallete = {
  id: '1',
  name: 'Ocean Breeze',
  key: 'ocean-breeze',
  primaryColor: '#3B82F6',
  foreignColor: '#06B6D4',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  colorScheme: 'blue',
};

const meta = {
  title: 'Widgets/PaletteCard',
  component: PaletteCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PaletteCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MiniDefault: Story = {
  args: {
    palette: mockPalette,
    type: 'mini',
    isSelected: false,
    onClick: palette => console.log('Clicked:', palette),
  },
};

export const MiniSelected: Story = {
  args: {
    palette: mockPalette,
    type: 'mini',
    isSelected: true,
    onClick: palette => console.log('Clicked:', palette),
  },
};

export const DefaultCard: Story = {
  args: {
    palette: mockPalette,
    type: 'default',
  },
  parameters: {
    layout: 'padded',
  },
};

export const DefaultCardWithDifferentColors: Story = {
  args: {
    palette: {
      ...mockPalette,
      name: 'Sunset Vibes',
      key: 'sunset-vibes',
      primaryColor: '#F59E0B',
      foreignColor: '#EF4444',
    },
    type: 'default',
  },
  parameters: {
    layout: 'padded',
  },
};
