import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/ui';
import { Callout } from '@/shared/ui/components/Callout';
import type { EmojiServiceHealthCheckProps } from '../types';

interface HealthCheckResponse {
  available: boolean;
  lastChecked: string;
  responseTime?: number;
  error?: string;
}

/**
 * Component for checking emoji service health before rendering emoji form
 *
 * Periodically checks healthcheck endpoint to verify Twemoji CDN availability.
 * Shows warning callout when service is unavailable.
 *
 * @param props - Component props
 * @returns JSX element
 */
export const EmojiServiceHealthCheck: React.FC<EmojiServiceHealthCheckProps> = ({
  children,
  fallback,
}) => {
  const { t } = useTranslation();
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkHealth = async () => {
    try {
      setIsChecking(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || ''}/api/v1/emoji/health`,
      );
      const health: HealthCheckResponse = await response.json();

      const twemojiAvailable = health.available ?? false;
      setIsHealthy(twemojiAvailable);
      setLastChecked(new Date());

      if (!twemojiAvailable) {
        console.warn('Twemoji CDN is not available - emoji avatar generation may fail');
      }
    } catch (error) {
      console.error('Failed to check emoji service health:', error);
      setIsHealthy(false);
      setLastChecked(new Date());
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkHealth();

    // Check every 30 seconds
    const interval = setInterval(checkHealth, 30000);

    return () => clearInterval(interval);
  }, []);

  const defaultFallback = (
    <Callout
      type="warning"
      title={t('features.avatarGenerator.healthCheck.unavailable')}
      subtitle={t('features.avatarGenerator.healthCheck.unavailableDescription')}
    >
      <div className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={checkHealth} disabled={isChecking} variant="outline" size="sm">
            {isChecking
              ? t('features.avatarGenerator.healthCheck.checking')
              : t('features.avatarGenerator.healthCheck.retry')}
          </Button>
        </div>

        {lastChecked && (
          <p className="text-sm text-muted-foreground">
            {t('features.avatarGenerator.healthCheck.lastChecked')}:{' '}
            {lastChecked.toLocaleTimeString()}
          </p>
        )}
      </div>
    </Callout>
  );

  if (isHealthy === null) {
    // Still checking
    return (
      <div className="p-6 border border-border bg-muted/50 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          <span className="text-sm text-muted-foreground">
            {t('features.avatarGenerator.healthCheck.checking')}
          </span>
        </div>
      </div>
    );
  }

  if (!isHealthy) {
    return fallback || defaultFallback;
  }

  return <>{children}</>;
};
