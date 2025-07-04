import { Task, TodoistApi } from '@doist/todoist-api-typescript';
import { ResultAsync, okAsync, errAsync } from 'neverthrow';

export type TaskServiceError = 
  | { type: 'API_ERROR'; message: string }
  | { type: 'NETWORK_ERROR'; message: string }
  | { type: 'AUTHENTICATION_ERROR'; message: string };

export interface TaskService {
  getTasks(): ResultAsync<Task[], TaskServiceError>;
  createTask(content: string): ResultAsync<Task, TaskServiceError>;
  completeTask(taskId: string): ResultAsync<Task, TaskServiceError>;
  deleteTask(taskId: string): ResultAsync<void, TaskServiceError>;
}

export class TodoistTaskService implements TaskService {
  private api: TodoistApi;

  constructor(apiKey: string) {
    this.api = new TodoistApi(apiKey);
  }

  getTasks(): ResultAsync<Task[], TaskServiceError> {
    return ResultAsync.fromPromise(
      this.api.getTasks({ limit: 20 }),
      (error) => this.handleApiError(error)
    ).map(response => response.results || []);
  }

  createTask(content: string): ResultAsync<Task, TaskServiceError> {
    return ResultAsync.fromPromise(
      this.api.addTask({ content }),
      (error) => this.handleApiError(error)
    );
  }

  completeTask(taskId: string): ResultAsync<Task, TaskServiceError> {
    return ResultAsync.fromPromise(
      this.api.closeTask(taskId).then(() => this.api.getTask(taskId)),
      (error) => this.handleApiError(error)
    );
  }

  deleteTask(taskId: string): ResultAsync<void, TaskServiceError> {
    return ResultAsync.fromPromise(
      this.api.deleteTask(taskId),
      (error) => this.handleApiError(error)
    ).map(() => undefined);
  }

  private handleApiError(error: unknown): TaskServiceError {
    if (error instanceof Error) {
      if (error.message.includes('401') || error.message.includes('authentication')) {
        return { type: 'AUTHENTICATION_ERROR', message: 'API認証に失敗しました' };
      }
      if (error.message.includes('network') || error.message.includes('ENOTFOUND')) {
        return { type: 'NETWORK_ERROR', message: 'ネットワークエラーが発生しました' };
      }
      return { type: 'API_ERROR', message: error.message };
    }
    return { type: 'API_ERROR', message: 'Unknown error occurred' };
  }
}

export class MockTaskService implements TaskService {
  private tasks: Task[] = [];

  constructor(initialTasks: Task[] = []) {
    this.tasks = [...initialTasks];
  }

  getTasks(): ResultAsync<Task[], TaskServiceError> {
    return ResultAsync.fromSafePromise(
      Promise.resolve([...this.tasks])
    );
  }

  createTask(content: string): ResultAsync<Task, TaskServiceError> {
    const newTask: Task = {
      id: `mock-${Date.now()}`,
      userId: 'mock-user',
      projectId: 'mock-project',
      sectionId: null,
      parentId: null,
      addedByUid: null,
      assignedByUid: null,
      responsibleUid: null,
      labels: [],
      deadline: null,
      duration: null,
      checked: false,
      isDeleted: false,
      addedAt: new Date().toISOString(),
      completedAt: null,
      updatedAt: null,
      due: null,
      priority: 1,
      childOrder: this.tasks.length + 1,
      content,
      description: '',
      noteCount: 0,
      dayOrder: this.tasks.length + 1,
      isCollapsed: false,
      url: '',
    };

    this.tasks.push(newTask);
    return okAsync(newTask);
  }

  completeTask(taskId: string): ResultAsync<Task, TaskServiceError> {
    const taskIndex = this.tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) {
      return errAsync({ type: 'API_ERROR' as const, message: 'タスクが見つかりません' });
    }

    const completedTask = {
      ...this.tasks[taskIndex],
      checked: true,
      completedAt: new Date().toISOString(),
    };

    this.tasks[taskIndex] = completedTask;
    return okAsync(completedTask);
  }

  deleteTask(taskId: string): ResultAsync<void, TaskServiceError> {
    const taskIndex = this.tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) {
      return errAsync({ type: 'API_ERROR' as const, message: 'タスクが見つかりません' });
    }

    this.tasks.splice(taskIndex, 1);
    return okAsync(undefined);
  }
}

export const createTaskService = (debugMode: boolean = false, mockTasks: Task[] = []): TaskService => {
  if (debugMode) {
    return new MockTaskService(mockTasks);
  }
  
  const apiKey = process.env.TODOIST_API_KEY;
  if (!apiKey) {
    throw new Error('TODOIST_API_KEY environment variable is required');
  }
  
  return new TodoistTaskService(apiKey);
};