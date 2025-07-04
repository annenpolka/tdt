import { describe, it, expect } from 'vitest';
import { toggleTaskCompletion, isTaskCompleted, getCompletedTaskIds, createTaskCompletionState } from './taskCompletion';
import type { Task } from '@doist/todoist-api-typescript';

describe('taskCompletion', () => {
  const mockTask: Task = {
    id: '1',
    content: 'Test Task',
    projectId: 'project-1',
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
  };

  describe('createTaskCompletionState', () => {
    it('should create empty completion state', () => {
      const result = createTaskCompletionState();
      
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        const state = result.value;
        expect(getCompletedTaskIds(state)).toEqual([]);
      }
    });
  });

  describe('toggleTaskCompletion', () => {
    it('should mark task as completed when not completed', () => {
      const initialState = createTaskCompletionState();
      
      expect(initialState.isOk()).toBe(true);
      if (initialState.isOk()) {
        const result = toggleTaskCompletion(initialState.value, mockTask.id);
        
        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
          const newState = result.value;
          expect(isTaskCompleted(newState, mockTask.id)).toBe(true);
        }
      }
    });

    it('should mark task as not completed when completed', () => {
      const initialState = createTaskCompletionState();
      
      expect(initialState.isOk()).toBe(true);
      if (initialState.isOk()) {
        const firstToggle = toggleTaskCompletion(initialState.value, mockTask.id);
        
        expect(firstToggle.isOk()).toBe(true);
        if (firstToggle.isOk()) {
          const secondToggle = toggleTaskCompletion(firstToggle.value, mockTask.id);
          
          expect(secondToggle.isOk()).toBe(true);
          if (secondToggle.isOk()) {
            const finalState = secondToggle.value;
            expect(isTaskCompleted(finalState, mockTask.id)).toBe(false);
          }
        }
      }
    });

    it('should return error for invalid task id', () => {
      const initialState = createTaskCompletionState();
      
      expect(initialState.isOk()).toBe(true);
      if (initialState.isOk()) {
        const result = toggleTaskCompletion(initialState.value, '');
        
        expect(result.isErr()).toBe(true);
        if (result.isErr()) {
          expect(result.error.type).toBe('INVALID_TASK_ID');
        }
      }
    });
  });

  describe('isTaskCompleted', () => {
    it('should return false for non-completed task', () => {
      const initialState = createTaskCompletionState();
      
      expect(initialState.isOk()).toBe(true);
      if (initialState.isOk()) {
        const result = isTaskCompleted(initialState.value, mockTask.id);
        expect(result).toBe(false);
      }
    });

    it('should return true for completed task', () => {
      const initialState = createTaskCompletionState();
      
      expect(initialState.isOk()).toBe(true);
      if (initialState.isOk()) {
        const toggleResult = toggleTaskCompletion(initialState.value, mockTask.id);
        
        expect(toggleResult.isOk()).toBe(true);
        if (toggleResult.isOk()) {
          const result = isTaskCompleted(toggleResult.value, mockTask.id);
          expect(result).toBe(true);
        }
      }
    });
  });

  describe('getCompletedTaskIds', () => {
    it('should return empty array for no completed tasks', () => {
      const initialState = createTaskCompletionState();
      
      expect(initialState.isOk()).toBe(true);
      if (initialState.isOk()) {
        const result = getCompletedTaskIds(initialState.value);
        expect(result).toEqual([]);
      }
    });

    it('should return array of completed task ids', () => {
      const initialState = createTaskCompletionState();
      
      expect(initialState.isOk()).toBe(true);
      if (initialState.isOk()) {
        const firstToggle = toggleTaskCompletion(initialState.value, '1');
        expect(firstToggle.isOk()).toBe(true);
        
        if (firstToggle.isOk()) {
          const secondToggle = toggleTaskCompletion(firstToggle.value, '2');
          expect(secondToggle.isOk()).toBe(true);
          
          if (secondToggle.isOk()) {
            const result = getCompletedTaskIds(secondToggle.value);
            expect(result).toEqual(['1', '2']);
          }
        }
      }
    });
  });
});