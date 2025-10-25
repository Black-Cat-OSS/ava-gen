import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ErrorBoundary } from '@/shared/ui';
import type { EmojiServiceHealthCheckProps } from '../types';

interface HealthCheckResponse {
  database: number;
  status: 'healthy' | 'unhealthy';
  services: {
    twemoji: {
      available: boolean;
      lastChecked: string;
    };
  };
}

/**
 * Component for checking emoji service health before rendering emoji form
 * 
 * Periodically checks healthcheck endpoint to verify Twemoji CDN availability.
 * Shows error boundary when service is unavailable.
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
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/health`);
      const health: HealthCheckResponse = await response.json();
      
      const twemojiAvailable = health.services?.twemoji?.available ?? false;
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
    <div className="p-6 border border-destructive/20 bg-destructive/5 rounded-lg">
      <div className="flex items-center gap-3 mb-4">
        <div className="text-destructive text-xl">⚠️</div>
        <div>
          <h3 className="font-semibold text-destructive">
            {t('features.avatarGenerator.healthCheck.unavailable')}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t('features.avatarGenerator.healthCheck.unavailableDescription')}
          </p>
        </div>
      </div>
      
      <div className="space-y-2">
        <Button
          onClick={checkHealth}
          disabled={isChecking}
          variant="outline"
          size="sm"
        >
          {isChecking 
            ? t('features.avatarGenerator.healthCheck.checking') 
            : t('features.avatarGenerator.healthCheck.retry')
          }
        </Button>
        
        {lastChecked && (
          <p className="text-xs text-muted-foreground">
            {t('features.avatarGenerator.healthCheck.lastChecked')}: {lastChecked.toLocaleTimeString()}
          </p>
        )}
      </div>
    </div>
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
    return (
      <ErrorBoundary fallback={fallback || defaultFallback}>
        {fallback || defaultFallback}
      </ErrorBoundary>
    );
  }

  return <>{children}</>;
};
