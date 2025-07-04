import { describe, it, expect } from 'vitest';
import { 
  createMockTask, 
  getMockDataset, 
  getAllDatasetNames, 
  mockDatasets,
  type MockDatasetName 
} from './taskDatasets';

describe('taskDatasets', () => {
  describe('createMockTask', () => {
    it('should create a task with default values', () => {
      const task = createMockTask();
      
      expect(task.id).toMatch(/^mock-/);
      expect(task.content).toBe('デフォルトタスク');
      expect(task.priority).toBe(1);
      expect(task.projectId).toBe('project-inbox');
      expect(task.labels).toEqual([]);
      expect(task.checked).toBe(false);
      expect(task.userId).toBe('mock-user');
    });

    it('should apply overrides', () => {
      const overrides = {
        content: 'カスタムタスク',
        priority: 3,
        projectId: 'custom-project',
        labels: ['test', 'custom'],
        checked: true,
      };
      
      const task = createMockTask(overrides);
      
      expect(task.content).toBe('カスタムタスク');
      expect(task.priority).toBe(3);
      expect(task.projectId).toBe('custom-project');
      expect(task.labels).toEqual(['test', 'custom']);
      expect(task.checked).toBe(true);
    });

    it('should generate unique IDs', () => {
      const task1 = createMockTask();
      const task2 = createMockTask();
      
      expect(task1.id).not.toBe(task2.id);
    });
  });

  describe('getMockDataset', () => {
    it('should return basic dataset by default for unknown name', () => {
      const dataset = getMockDataset('unknown' as MockDatasetName);
      
      expect(dataset).toEqual(mockDatasets.basic);
    });

    it('should return specific dataset when name exists', () => {
      const dataset = getMockDataset('empty');
      
      expect(dataset).toEqual([]);
    });

    it('should return large dataset with correct length', () => {
      const dataset = getMockDataset('large-dataset');
      
      expect(dataset).toHaveLength(100);
      expect(dataset[0].content).toBe('📋 大規模データセット タスク 1');
    });
  });

  describe('getAllDatasetNames', () => {
    it('should return all available dataset names', () => {
      const names = getAllDatasetNames();
      
      expect(names).toContain('basic');
      expect(names).toContain('priority-showcase');
      expect(names).toContain('due-date-variety');
      expect(names).toContain('large-dataset');
      expect(names).toContain('empty');
      expect(names).toContain('project-variety');
      expect(names).toContain('sorting-test');
      expect(names).toContain('error-conditions');
      expect(names).toHaveLength(8);
    });
  });

  describe('dataset contents', () => {
    it('basic dataset should have 5 tasks with varied properties', () => {
      const dataset = getMockDataset('basic');
      
      expect(dataset).toHaveLength(5);
      expect(dataset[0].content).toBe('📧 メールの確認');
      expect(dataset[0].priority).toBe(2);
      expect(dataset[0].labels).toContain('urgent');
      expect(dataset[0].due).toBeDefined();
    });

    it('priority-showcase should have tasks with all priority levels', () => {
      const dataset = getMockDataset('priority-showcase');
      
      const priorities = dataset.map(task => task.priority);
      expect(priorities).toContain(1);
      expect(priorities).toContain(2);
      expect(priorities).toContain(3);
      expect(priorities).toContain(4);
    });

    it('due-date-variety should have tasks with various due dates', () => {
      const dataset = getMockDataset('due-date-variety');
      
      const hasDueDates = dataset.some(task => task.due !== null);
      const hasNoDueDates = dataset.some(task => task.due === null);
      
      expect(hasDueDates).toBe(true);
      expect(hasNoDueDates).toBe(true);
    });

    it('empty dataset should be empty', () => {
      const dataset = getMockDataset('empty');
      
      expect(dataset).toEqual([]);
    });

    it('project-variety should have tasks from different projects', () => {
      const dataset = getMockDataset('project-variety');
      
      const projectIds = new Set(dataset.map(task => task.projectId));
      expect(projectIds.size).toBeGreaterThan(1);
      expect(projectIds.has('project-work')).toBe(true);
      expect(projectIds.has('project-personal')).toBe(true);
    });

    it('sorting-test should have tasks suitable for sorting tests', () => {
      const dataset = getMockDataset('sorting-test');
      
      expect(dataset).toHaveLength(4);
      
      const priorities = dataset.map(task => task.priority);
      expect(Math.max(...priorities)).toBe(4);
      expect(Math.min(...priorities)).toBe(1);
      
      const hasVariousDueDates = dataset.some(task => task.due !== null);
      const hasNoDueDate = dataset.some(task => task.due === null);
      expect(hasVariousDueDates).toBe(true);
      expect(hasNoDueDate).toBe(true);
    });

    it('error-conditions should have tasks for error testing', () => {
      const dataset = getMockDataset('error-conditions');
      
      expect(dataset).toHaveLength(2);
      expect(dataset[0].content).toContain('エラー');
      expect(dataset[1].content).toContain('警告');
    });

    it('large-dataset should have 100 tasks with varied properties', () => {
      const dataset = getMockDataset('large-dataset');
      
      expect(dataset).toHaveLength(100);
      
      const priorities = new Set(dataset.map(task => task.priority));
      expect(priorities.size).toBe(4);
      
      const projectIds = new Set(dataset.map(task => task.projectId));
      expect(projectIds.size).toBe(5);
      
      const withLabels = dataset.filter(task => task.labels.length > 0);
      expect(withLabels.length).toBeGreaterThan(0);
      
      const withDueDates = dataset.filter(task => task.due !== null);
      expect(withDueDates.length).toBeGreaterThan(0);
    });
  });
});

if (import.meta.vitest) {
  const { test, expect } = import.meta.vitest;
  test("taskDatasets module exports", () => {
    expect(typeof createMockTask).toBe('function');
    expect(typeof getMockDataset).toBe('function');
    expect(typeof getAllDatasetNames).toBe('function');
    expect(typeof mockDatasets).toBe('object');
  });
}