import { cpus } from 'os';
import { performance } from 'perf_hooks';

interface PerformanceMetrics {
  startTime: number;
  startCpuUsage: NodeJS.CpuUsage;
  startActiveWorkers?: number;
  startMaxWorkers?: number;
}

interface PerformanceResult {
  duration: number;
  cpuUsage: {
    user: number;
    system: number;
    total: number;
  };
  activeWorkers?: number;
  maxWorkers?: number;
  cpuCores: number;
}

/**
 * Утилита для мониторинга производительности генерации аватарок
 *
 * Измеряет:
 * - Время выполнения операции
 * - Использование CPU (user и system время)
 * - Количество активных workers (если применимо)
 * - Количество доступных CPU ядер
 */
export class PerformanceMonitor {
  private static startMetrics: Map<string, PerformanceMetrics> = new Map();

  /**
   * Начать мониторинг производительности
   *
   * @param operationId - Уникальный идентификатор операции
   * @param activeWorkers - Количество активных workers (опционально)
   * @param maxWorkers - Максимальное количество workers (опционально)
   * @returns Идентификатор операции
   */
  static start(operationId: string, activeWorkers?: number, maxWorkers?: number): string {
    const metrics: PerformanceMetrics = {
      startTime: performance.now(),
      startCpuUsage: process.cpuUsage(),
      startActiveWorkers: activeWorkers,
      startMaxWorkers: maxWorkers,
    };

    this.startMetrics.set(operationId, metrics);
    return operationId;
  }

  /**
   * Завершить мониторинг и получить результаты
   *
   * @param operationId - Идентификатор операции
   * @param currentActiveWorkers - Текущее количество активных workers (опционально)
   * @param maxWorkers - Максимальное количество workers (опционально)
   * @returns Результаты измерения производительности
   */
  static stop(
    operationId: string,
    currentActiveWorkers?: number,
    maxWorkers?: number,
  ): PerformanceResult | null {
    const startMetrics = this.startMetrics.get(operationId);
    if (!startMetrics) {
      return null;
    }

    const endTime = performance.now();
    const endCpuUsage = process.cpuUsage(startMetrics.startCpuUsage);

    const duration = endTime - startMetrics.startTime;
    const cpuUsage = {
      user: endCpuUsage.user / 1000,
      system: endCpuUsage.system / 1000,
      total: (endCpuUsage.user + endCpuUsage.system) / 1000,
    };

    const cpuCores = cpus().length;

    this.startMetrics.delete(operationId);

    return {
      duration,
      cpuUsage,
      activeWorkers: currentActiveWorkers ?? startMetrics.startActiveWorkers,
      maxWorkers: maxWorkers ?? startMetrics.startMaxWorkers,
      cpuCores,
    };
  }

  /**
   * Получить количество активных CPU ядер
   *
   * @returns Количество CPU ядер
   */
  static getCpuCores(): number {
    return cpus().length;
  }

  /**
   * Форматировать результаты для логирования
   *
   * @param result - Результаты измерения производительности
   * @returns Отформатированная строка для логирования
   */
  static formatMetrics(result: PerformanceResult): string {
    const parts: string[] = [];

    parts.push(`Duration: ${result.duration.toFixed(2)}ms`);
    parts.push(
      `CPU usage: ${result.cpuUsage.total.toFixed(2)}ms (user: ${result.cpuUsage.user.toFixed(2)}ms, system: ${result.cpuUsage.system.toFixed(2)}ms)`,
    );
    parts.push(`CPU cores: ${result.cpuCores}`);

    if (result.activeWorkers !== undefined && result.maxWorkers !== undefined) {
      parts.push(`Active workers: ${result.activeWorkers}/${result.maxWorkers}`);
    } else if (result.activeWorkers !== undefined) {
      parts.push(`Active workers: ${result.activeWorkers}`);
    }

    return parts.join(' | ');
  }
}
