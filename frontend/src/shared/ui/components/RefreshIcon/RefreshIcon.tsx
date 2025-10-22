import styles from './RefreshIcon.module.css';

interface RefreshIconProps {
  className?: string;
  isRefreshing?: boolean;
}

export const RefreshIcon = ({ className = '', isRefreshing = false }: RefreshIconProps) => {
  return (
    <svg
      className={`w-4 h-4 ${isRefreshing ? styles.refreshSpinning : ''} ${className}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  );
};
