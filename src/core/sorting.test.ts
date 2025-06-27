import { describe, it, expect } from 'vitest';
import { sortTasks, getSortDisplayName, type SortConfig } from './sorting.js';
import type { Task } from '@doist/todoist-api-typescript';

describe('sorting', () => {
  const mockTasks: Task[] = [
    {
      id: '1',
      content: 'Zebra Task',
      projectId: 'project-b',
      priority: 1,
      addedAt: '2023-01-01T00:00:00Z',
      due: { date: '2023-12-31', isRecurring: false, datetime: null, string: '', timezone: null },
      checked: false,
      childOrder: 1,
      dayOrder: 1,
      addedByUid: 'user1',
      assignedByUid: null,
      responsibleUid: null,
      noteCount: 0,
      completedAt: null,
      updatedAt: '2023-01-01T00:00:00Z',
      userId: 'user1',
      isDeleted: false,
      isCollapsed: false,
      description: '',
      duration: null,
      deadline: null,
      labels: [],
      parentId: null,
      sectionId: null,
      url: 'https://todoist.com/task/1'
    },
    {
      id: '2',
      content: 'Alpha Task',
      projectId: 'project-a',
      priority: 4,
      addedAt: '2023-01-02T00:00:00Z',
      due: { date: '2023-06-15', isRecurring: false, datetime: null, string: '', timezone: null },
      checked: false,
      childOrder: 2,
      dayOrder: 2,
      addedByUid: 'user1',
      assignedByUid: null,
      responsibleUid: null,
      noteCount: 0,
      completedAt: null,
      updatedAt: '2023-01-02T00:00:00Z',
      userId: 'user1',
      isDeleted: false,
      isCollapsed: false,
      description: '',
      duration: null,
      deadline: null,
      labels: [],
      parentId: null,
      sectionId: null,
      url: 'https://todoist.com/task/2'
    },
    {
      id: '3',
      content: 'Beta Task',
      projectId: 'project-c',
      priority: 2,
      addedAt: '2023-01-03T00:00:00Z',
      due: null,
      checked: false,
      childOrder: 3,
      dayOrder: 3,
      addedByUid: 'user1',
      assignedByUid: null,
      responsibleUid: null,
      noteCount: 0,
      completedAt: null,
      updatedAt: '2023-01-03T00:00:00Z',
      userId: 'user1',
      isDeleted: false,
      isCollapsed: false,
      description: '',
      duration: null,
      deadline: null,
      labels: [],
      parentId: null,
      sectionId: null,
      url: 'https://todoist.com/task/3'
    }
  ];

  describe('sortTasks', () => {
    it('should sort by priority ascending', () => {
      const config: SortConfig = { criteria: 'priority', direction: 'asc' };
      const result = sortTasks(mockTasks, config);
      
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        const sorted = result.value;
        expect(sorted[0].priority).toBe(1);
        expect(sorted[1].priority).toBe(2);
        expect(sorted[2].priority).toBe(4);
      }
    });

    it('should sort by priority descending', () => {
      const config: SortConfig = { criteria: 'priority', direction: 'desc' };
      const result = sortTasks(mockTasks, config);
      
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        const sorted = result.value;
        expect(sorted[0].priority).toBe(4);
        expect(sorted[1].priority).toBe(2);
        expect(sorted[2].priority).toBe(1);
      }
    });

    it('should sort by due date ascending', () => {
      const config: SortConfig = { criteria: 'dueDate', direction: 'asc' };
      const result = sortTasks(mockTasks, config);
      
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        const sorted = result.value;
        expect(sorted[0].due?.date).toBe('2023-06-15');
        expect(sorted[1].due?.date).toBe('2023-12-31');
        expect(sorted[2].due).toBeNull();
      }
    });

    it('should sort by created date ascending', () => {
      const config: SortConfig = { criteria: 'createdDate', direction: 'asc' };
      const result = sortTasks(mockTasks, config);
      
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        const sorted = result.value;
        expect(sorted[0].addedAt).toBe('2023-01-01T00:00:00Z');
        expect(sorted[1].addedAt).toBe('2023-01-02T00:00:00Z');
        expect(sorted[2].addedAt).toBe('2023-01-03T00:00:00Z');
      }
    });

    it('should sort alphabetically ascending', () => {
      const config: SortConfig = { criteria: 'alphabetical', direction: 'asc' };
      const result = sortTasks(mockTasks, config);
      
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        const sorted = result.value;
        expect(sorted[0].content).toBe('Alpha Task');
        expect(sorted[1].content).toBe('Beta Task');
        expect(sorted[2].content).toBe('Zebra Task');
      }
    });

    it('should sort by project ascending', () => {
      const config: SortConfig = { criteria: 'project', direction: 'asc' };
      const result = sortTasks(mockTasks, config);
      
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        const sorted = result.value;
        expect(sorted[0].projectId).toBe('project-a');
        expect(sorted[1].projectId).toBe('project-b');
        expect(sorted[2].projectId).toBe('project-c');
      }
    });

    it('should return error for empty task list', () => {
      const config: SortConfig = { criteria: 'priority', direction: 'asc' };
      const result = sortTasks([], config);
      
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.type).toBe('EMPTY_TASK_LIST');
      }
    });

    it('should return error for invalid criteria', () => {
      const config = { criteria: 'invalid' as any, direction: 'asc' as const };
      const result = sortTasks(mockTasks, config);
      
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.type).toBe('INVALID_CRITERIA');
      }
    });

    it('should return error for invalid direction', () => {
      const config = { criteria: 'priority' as const, direction: 'invalid' as any };
      const result = sortTasks(mockTasks, config);
      
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.type).toBe('INVALID_DIRECTION');
      }
    });
  });

  describe('getSortDisplayName', () => {
    it('should return correct display names', () => {
      expect(getSortDisplayName('priority', 'asc')).toBe('優先度 (昇順)');
      expect(getSortDisplayName('priority', 'desc')).toBe('優先度 (降順)');
      expect(getSortDisplayName('dueDate', 'asc')).toBe('期限 (昇順)');
      expect(getSortDisplayName('alphabetical', 'desc')).toBe('アルファベット順 (降順)');
      expect(getSortDisplayName('project', 'asc')).toBe('プロジェクト (昇順)');
    });
  });
});