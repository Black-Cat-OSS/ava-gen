import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Switch } from './Switch';

const meta: Meta<typeof Switch> = {
  title: 'Shared/UI/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Current state of the switch',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the switch is disabled',
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessibility label',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Simple circle and square icons for examples
const CircleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4">
    <circle cx="12" cy="12" r="8" stroke="currentColor" fill="none" strokeWidth="2" />
  </svg>
);

const SquareIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4">
    <rect x="6" y="6" width="12" height="12" stroke="currentColor" fill="none" strokeWidth="2" rx="2" />
  </svg>
);

const HeartIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4">
    <path stroke="currentColor" fill="none" strokeWidth="2" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const StarIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4">
    <polygon stroke="currentColor" fill="none" strokeWidth="2" points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
  </svg>
);

// Controlled component wrapper
const ControlledSwitch = (args: any) => {
  const [checked, setChecked] = useState(args.checked || false);
  
  return (
    <Switch
      {...args}
      checked={checked}
      onChange={setChecked}
    />
  );
};

export const Default: Story = {
  render: ControlledSwitch,
  args: {
    checked: false,
    disabled: false,
    ariaLabel: 'Toggle switch',
  },
};

export const WithIcons: Story = {
  render: ControlledSwitch,
  args: {
    checked: false,
    leftIcon: <CircleIcon />,
    rightIcon: <SquareIcon />,
    disabled: false,
    ariaLabel: 'Toggle between circle and square',
  },
};

export const WithCustomIcons: Story = {
  render: ControlledSwitch,
  args: {
    checked: false,
    leftIcon: <HeartIcon />,
    rightIcon: <StarIcon />,
    disabled: false,
    ariaLabel: 'Toggle between heart and star',
  },
};

export const Disabled: Story = {
  render: ControlledSwitch,
  args: {
    checked: false,
    leftIcon: <CircleIcon />,
    rightIcon: <SquareIcon />,
    disabled: true,
    ariaLabel: 'Disabled switch',
  },
};

export const DisabledChecked: Story = {
  render: ControlledSwitch,
  args: {
    checked: true,
    leftIcon: <CircleIcon />,
    rightIcon: <SquareIcon />,
    disabled: true,
    ariaLabel: 'Disabled checked switch',
  },
};

export const WithoutIcons: Story = {
  render: ControlledSwitch,
  args: {
    checked: false,
    disabled: false,
    ariaLabel: 'Switch without icons',
  },
};

export const WithoutIconsChecked: Story = {
  render: ControlledSwitch,
  args: {
    checked: true,
    disabled: false,
    ariaLabel: 'Checked switch without icons',
  },
};
