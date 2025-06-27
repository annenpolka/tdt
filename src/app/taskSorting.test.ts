import { describe, it, expect } from 'vitest';
import {
  createDefaultSortingState,
  applySorting,
  updateSortConfig,
  toggleSortDirection,
  getSortOptions,
  getDirectionOptions,
  getNextSortCriteria,
  cycleSortCriteria
} from './taskSorting.js';
import type { Task } from '@doist/todoist-api-typescript';

describe('taskSorting', () => {
  const mockTasks: Task[] = [
    {
      id: '1',
      content: 'Test Task 1',
      projectId: 'project1',
      priority: 1,
      addedAt: '2023-01-01T00:00:00Z',
      due: null,
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
      content: 'Test Task 2',
      projectId: 'project2',
      priority: 2,
      addedAt: '2023-01-02T00:00:00Z',
      due: null,
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
    }
  ];

  describe('createDefaultSortingState', () => {
    it('should create default sorting state', () => {
      const state = createDefaultSortingState();
      expect(state.currentConfig.criteria).toBe('dueDate');
      expect(state.currentConfig.direction).toBe('asc');
    });
  });

  describe('applySorting', () => {
    it('should always apply sorting', () => {
      const state = createDefaultSortingState();
      const result = applySorting(mockTasks, state);
      
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value.length).toBe(2);
        // Tasks without due date should be last when sorting by due date asc
        expect(result.value[0].due).toBeNull();
        expect(result.value[1].due).toBeNull();
      }
    });

    it('should apply priority sorting when configured', () => {
      const state = {
        currentConfig: { criteria: 'priority' as const, direction: 'asc' as const }
      };
      const result = applySorting(mockTasks, state);
      
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        expect(result.value[0].priority).toBe(1);
        expect(result.value[1].priority).toBe(2);
      }
    });
  });

  describe('updateSortConfig', () => {
    it('should update sort config', () => {
      const initialState = createDefaultSortingState();
      const updatedState = updateSortConfig(initialState, 'priority', 'desc');
      
      expect(updatedState.currentConfig.criteria).toBe('priority');
      expect(updatedState.currentConfig.direction).toBe('desc');
    });
  });

  describe('toggleSortDirection', () => {
    it('should toggle direction from asc to desc', () => {
      const state = {
        currentConfig: { criteria: 'priority' as const, direction: 'asc' as const }
      };
      const updatedState = toggleSortDirection(state);
      
      expect(updatedState.currentConfig.direction).toBe('desc');
    });

    it('should toggle direction from desc to asc', () => {
      const state = {
        currentConfig: { criteria: 'priority' as const, direction: 'desc' as const }
      };
      const updatedState = toggleSortDirection(state);
      
      expect(updatedState.currentConfig.direction).toBe('asc');
    });
  });

  describe('getSortOptions', () => {
    it('should return all sort options', () => {
      const options = getSortOptions();
      expect(options).toHaveLength(5);
      expect(options[0]).toEqual({ value: 'priority', label: '優先度' });
      expect(options[1]).toEqual({ value: 'dueDate', label: '期限' });
      expect(options[2]).toEqual({ value: 'createdDate', label: '作成日' });
      expect(options[3]).toEqual({ value: 'alphabetical', label: 'アルファベット順' });
      expect(options[4]).toEqual({ value: 'project', label: 'プロジェクト' });
    });
  });

  describe('getDirectionOptions', () => {
    it('should return direction options', () => {
      const options = getDirectionOptions();
      expect(options).toHaveLength(2);
      expect(options[0]).toEqual({ value: 'asc', label: '昇順' });
      expect(options[1]).toEqual({ value: 'desc', label: '降順' });
    });
  });

  describe('getNextSortCriteria', () => {
    it('should cycle through all criteria', () => {
      expect(getNextSortCriteria('priority')).toBe('dueDate');
      expect(getNextSortCriteria('dueDate')).toBe('createdDate');
      expect(getNextSortCriteria('createdDate')).toBe('alphabetical');
      expect(getNextSortCriteria('alphabetical')).toBe('project');
      expect(getNextSortCriteria('project')).toBe('priority');
    });
  });

  describe('cycleSortCriteria', () => {
    it('should cycle to next criteria', () => {
      const state = {
        currentConfig: { criteria: 'priority' as const, direction: 'asc' as const }
      };
      const newState = cycleSortCriteria(state);
      
      expect(newState.currentConfig.criteria).toBe('dueDate');
      expect(newState.currentConfig.direction).toBe('asc');
    });

    it('should preserve direction when cycling criteria', () => {
      const state = {
        currentConfig: { criteria: 'alphabetical' as const, direction: 'desc' as const }
      };
      const newState = cycleSortCriteria(state);
      
      expect(newState.currentConfig.criteria).toBe('project');
      expect(newState.currentConfig.direction).toBe('desc');
    });
  });
});