import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { Worker } from 'worker_threads';
import { cpus } from 'os';
import { WorkerMessage, WorkerResponse } from '../interfaces/worker-message.interface';
import * as path from 'path';

interface WorkerTask {
  taskId: string;
  resolve: (value: Buffer) => void;
  reject: (error: Error) => void;
  timeout: NodeJS.Timeout;
}

@Injectable()
export class WorkerPoolService implements OnModuleDestroy {
  private readonly logger = new Logger(WorkerPoolService.name);
  private readonly maxWorkers: number;
  private readonly workers: Map<string, Worker> = new Map();
  private readonly pendingTasks: Map<string, WorkerTask> = new Map();
  private readonly workerQueue: WorkerMessage[] = [];
  private activeWorkers = 0;
  private isShuttingDown = false;

  constructor() {
    const cpuCount = cpus().length;
    const defaultMaxWorkers = Math.max(1, Math.floor(cpuCount / 2));
    const maxWorkersEnv = process.env.AVATAR_WORKER_MAX_THREADS;
    this.maxWorkers = maxWorkersEnv ? Math.max(1, parseInt(maxWorkersEnv, 10)) : defaultMaxWorkers;
    this.logger.log(
      `Worker pool initialized with max ${this.maxWorkers} workers (CPU cores: ${cpuCount})`,
    );
  }

  async executeTask(message: WorkerMessage, workerPath: string, timeout = 30000): Promise<Buffer> {
    if (this.isShuttingDown) {
      throw new Error('Worker pool is shutting down');
    }

    return new Promise<Buffer>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        this.pendingTasks.delete(message.taskId);
        reject(new Error(`Worker task ${message.taskId} timed out after ${timeout}ms`));
      }, timeout);

      const task: WorkerTask = {
        taskId: message.taskId,
        resolve,
        reject,
        timeout: timeoutId,
      };

      this.pendingTasks.set(message.taskId, task);
      this.workerQueue.push(message);

      this.processQueue(workerPath);
    });
  }

  private async processQueue(workerPath: string): Promise<void> {
    if (this.workerQueue.length === 0 || this.activeWorkers >= this.maxWorkers) {
      return;
    }

    const message = this.workerQueue.shift();
    if (!message) {
      return;
    }

    const task = this.pendingTasks.get(message.taskId);
    if (!task) {
      return;
    }

    try {
      const worker = await this.getOrCreateWorker(message.type, workerPath);
      this.activeWorkers++;

      const messageHandler = (response: WorkerResponse) => {
        if (response.taskId === message.taskId) {
          worker.off('message', messageHandler);
          this.handleWorkerResponse(response, message.type);
          this.processQueue(workerPath);
        }
      };

      worker.on('message', messageHandler);

      worker.postMessage(message);
    } catch (error) {
      this.logger.error(`Failed to process task ${message.taskId}: ${error.message}`, error);
      clearTimeout(task.timeout);
      this.pendingTasks.delete(message.taskId);
      task.reject(error as Error);
      this.activeWorkers = Math.max(0, this.activeWorkers - 1);
      this.processQueue(workerPath);
    }
  }

  private async getOrCreateWorker(type: string, workerPath: string): Promise<Worker> {
    const workerKey = `${type}-${workerPath}`;

    if (this.workers.has(workerKey)) {
      return this.workers.get(workerKey)!;
    }

    const workerDir = path.join(__dirname, '..', 'workers');
    const fullWorkerPath = path.join(workerDir, workerPath);

    const worker = new Worker(fullWorkerPath);

    worker.on('error', error => {
      this.logger.error(`Worker ${workerKey} error: ${error.message}`, error);
    });

    worker.on('exit', code => {
      if (code !== 0) {
        this.logger.warn(`Worker ${workerKey} exited with code ${code}`);
      }
      this.workers.delete(workerKey);
    });

    this.workers.set(workerKey, worker);
    return worker;
  }

  private handleWorkerResponse(response: WorkerResponse, _workerType: string): void {
    const task = this.pendingTasks.get(response.taskId);
    if (!task) {
      this.logger.warn(`Received response for unknown task ${response.taskId}`);
      this.activeWorkers = Math.max(0, this.activeWorkers - 1);
      return;
    }

    clearTimeout(task.timeout);
    this.pendingTasks.delete(response.taskId);
    this.activeWorkers = Math.max(0, this.activeWorkers - 1);

    if (response.success && response.buffer) {
      if (Buffer.isBuffer(response.buffer)) {
        task.resolve(response.buffer);
      } else {
        task.resolve(Buffer.from(response.buffer as ArrayBuffer));
      }
    } else {
      task.reject(new Error(response.error || 'Unknown worker error'));
    }
  }

  private handleWorkerError(
    error: Error,
    taskId: string,
    _workerType: string,
    _workerPath: string,
  ): void {
    const task = this.pendingTasks.get(taskId);
    if (task) {
      clearTimeout(task.timeout);
      this.pendingTasks.delete(taskId);
      task.reject(error);
    }

    this.activeWorkers = Math.max(0, this.activeWorkers - 1);
    this.logger.error(`Worker error for task ${taskId}: ${error.message}`, error);
  }

  async onModuleDestroy(): Promise<void> {
    this.isShuttingDown = true;
    this.logger.log('Shutting down worker pool...');

    for (const [key, worker] of this.workers.entries()) {
      try {
        await worker.terminate();
        this.logger.log(`Worker ${key} terminated`);
      } catch (error) {
        this.logger.error(`Error terminating worker ${key}: ${error.message}`, error);
      }
    }

    this.workers.clear();
    this.pendingTasks.clear();
    this.workerQueue.length = 0;
  }
}
