import { describe, it, expect, beforeEach } from 'vitest';
import { TodoistTaskService, MockTaskService, createTaskService } from './taskService';
import { getMockDataset } from './mockData/taskDatasets';

describe('MockTaskService', () => {
  let mockService: MockTaskService;

  beforeEach(() => {
    const mockTasks = getMockDataset('basic');
    mockService = new MockTaskService(mockTasks);
  });

  describe('getTasks', () => {
    it('should return all tasks', async () => {
      const result = await mockService.getTasks();
      
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value).toHaveLength(5);
        expect(result.value[0].content).toBe('📧 メールの確認');
      }
    });
  });

  describe('createTask', () => {
    it('should create a new task', async () => {
      const content = 'テスト用の新しいタスク';
      const result = await mockService.createTask(content);
      
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value.content).toBe(content);
        expect(result.value.id).toMatch(/^mock-/);
        expect(result.value.checked).toBe(false);
      }
    });

    it('should add task to the internal list', async () => {
      const content = 'テスト用の新しいタスク';
      await mockService.createTask(content);
      
      const tasksResult = await mockService.getTasks();
      expect(tasksResult.isOk()).toBe(true);
      if (tasksResult.isOk()) {
        expect(tasksResult.value).toHaveLength(6);
        expect(tasksResult.value[5].content).toBe(content);
      }
    });
  });

  describe('completeTask', () => {
    it('should mark task as completed', async () => {
      const tasksResult = await mockService.getTasks();
      expect(tasksResult.isOk()).toBe(true);
      if (!tasksResult.isOk()) return;

      const firstTask = tasksResult.value[0];
      const result = await mockService.completeTask(firstTask.id);
      
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value.checked).toBe(true);
        expect(result.value.completedAt).toBeDefined();
      }
    });

    it('should return error for non-existent task', async () => {
      const result = await mockService.completeTask('non-existent-id');
      
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.type).toBe('API_ERROR');
        expect(result.error.message).toBe('タスクが見つかりません');
      }
    });
  });

  describe('deleteTask', () => {
    it('should delete task', async () => {
      const tasksResult = await mockService.getTasks();
      expect(tasksResult.isOk()).toBe(true);
      if (!tasksResult.isOk()) return;

      const firstTask = tasksResult.value[0];
      const result = await mockService.deleteTask(firstTask.id);
      
      expect(result.isOk()).toBe(true);
      
      const updatedTasksResult = await mockService.getTasks();
      expect(updatedTasksResult.isOk()).toBe(true);
      if (updatedTasksResult.isOk()) {
        expect(updatedTasksResult.value).toHaveLength(4);
        expect(updatedTasksResult.value.find(t => t.id === firstTask.id)).toBeUndefined();
      }
    });

    it('should return error for non-existent task', async () => {
      const result = await mockService.deleteTask('non-existent-id');
      
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.type).toBe('API_ERROR');
        expect(result.error.message).toBe('タスクが見つかりません');
      }
    });
  });
});

describe('createTaskService', () => {
  it('should create MockTaskService when debugMode is true', () => {
    const mockTasks = getMockDataset('basic');
    const service = createTaskService(true, mockTasks);
    
    expect(service).toBeInstanceOf(MockTaskService);
  });

  it('should create TodoistTaskService when debugMode is false', () => {
    process.env.TODOIST_API_KEY = 'test-key';
    const service = createTaskService(false);
    
    expect(service).toBeInstanceOf(TodoistTaskService);
  });

  it('should throw error when API key is missing and debugMode is false', () => {
    delete process.env.TODOIST_API_KEY;
    
    expect(() => createTaskService(false)).toThrow('TODOIST_API_KEY environment variable is required');
  });
});

if (import.meta.vitest) {
  const { test, expect } = import.meta.vitest;
  test("taskService module exports", () => {
    expect(typeof createTaskService).toBe('function');
    expect(typeof MockTaskService).toBe('function');
    expect(typeof TodoistTaskService).toBe('function');
  });
}