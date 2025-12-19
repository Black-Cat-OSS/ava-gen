import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { Callout } from '../Callout';
import { Button } from '../Button';

/**
 * Component that throws an error for testing ErrorBoundary
 */
const ErrorComponent = ({ shouldThrow = false }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error('This is a test error for ErrorBoundary');
  }
  return <div>This component works fine!</div>;
};

const meta: Meta<typeof ErrorBoundary> = {
  title: 'UI/ErrorBoundary',
  component: ErrorBoundary,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    resetOnChange: {
      control: 'boolean',
      description: 'Whether to reset error state when children change',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ErrorBoundary>;

/**
 * Default ErrorBoundary with custom fallback
 */
export const Default: Story = {
  args: {
    children: <ErrorComponent shouldThrow={true} />,
    fallback: (
      <Callout type="error" title="Custom Error" subtitle="This is a custom error message">
        <p>Something went wrong with the component.</p>
      </Callout>
    ),
  },
};

/**
 * ErrorBoundary with default fallback UI
 */
export const DefaultFallback: Story = {
  args: {
    children: <ErrorComponent shouldThrow={true} />,
  },
};

/**
 * ErrorBoundary with working component (no error)
 */
export const NoError: Story = {
  args: {
    children: <ErrorComponent shouldThrow={false} />,
  },
};

/**
 * ErrorBoundary with resetOnChange functionality
 */
export const ResetOnChange: Story = {
  args: {
    children: <ErrorComponent shouldThrow={true} />,
    resetOnChange: true,
  },
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [key, setKey] = React.useState(0);
    
    return (
      <div className="space-y-4">
        <Button onClick={() => setKey(prev => prev + 1)}>
          Reset Error Boundary
        </Button>
        <ErrorBoundary {...args} key={key}>
          <ErrorComponent shouldThrow={true} />
        </ErrorBoundary>
      </div>
    );
  },
};

/**
 * ErrorBoundary with onError callback
 */
export const WithErrorCallback: Story = {
  args: {
    children: <ErrorComponent shouldThrow={true} />,
    onError: (error, errorInfo) => {
      // eslint-disable-next-line no-console
      console.log('Error caught:', error.message);
      // eslint-disable-next-line no-console
      console.log('Component stack:', errorInfo.componentStack);
    },
  },
};

/**
 * Nested ErrorBoundary example
 */
export const Nested: Story = {
  render: () => (
    <div className="space-y-4">
      <ErrorBoundary
        fallback={
          <Callout type="warning" title="Outer Error" subtitle="Error in outer component">
            <p>This is the outer error boundary.</p>
          </Callout>
        }
      >
        <div>
          <p>This is working content.</p>
          <ErrorBoundary
            fallback={
              <Callout type="error" title="Inner Error" subtitle="Error in inner component">
                <p>This is the inner error boundary.</p>
              </Callout>
            }
          >
            <ErrorComponent shouldThrow={true} />
          </ErrorBoundary>
        </div>
      </ErrorBoundary>
    </div>
  ),
};

