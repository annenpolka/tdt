import { describe, it, expect } from 'vitest';
import { createTaskCompletionManager, type TaskCompletionManager } from './taskCompletion';

describe('taskCompletion (app layer)', () => {
  describe('createTaskCompletionManager', () => {
    it('should create task completion manager with initial state', () => {
      const result = createTaskCompletionManager();
      
      expect(result.isOk()).toBe(true);
      if (result.isOk()) {
        const manager = result.value;
        expect(manager.getCompletedTaskIds()).toEqual([]);
        expect(manager.isTaskCompleted('any-id')).toBe(false);
      }
    });

    it('should toggle task completion', () => {
      const managerResult = createTaskCompletionManager();
      
      expect(managerResult.isOk()).toBe(true);
      if (managerResult.isOk()) {
        const manager = managerResult.value;
        const toggleResult = manager.toggleTaskCompletion('task-1');
        
        expect(toggleResult.isOk()).toBe(true);
        if (toggleResult.isOk()) {
          expect(manager.isTaskCompleted('task-1')).toBe(true);
          expect(manager.getCompletedTaskIds()).toEqual(['task-1']);
        }
      }
    });

    it('should toggle task completion back to incomplete', () => {
      const managerResult = createTaskCompletionManager();
      
      expect(managerResult.isOk()).toBe(true);
      if (managerResult.isOk()) {
        const manager = managerResult.value;
        
        // Toggle to completed
        const firstToggle = manager.toggleTaskCompletion('task-1');
        expect(firstToggle.isOk()).toBe(true);
        expect(manager.isTaskCompleted('task-1')).toBe(true);
        
        // Toggle back to incomplete
        const secondToggle = manager.toggleTaskCompletion('task-1');
        expect(secondToggle.isOk()).toBe(true);
        expect(manager.isTaskCompleted('task-1')).toBe(false);
        expect(manager.getCompletedTaskIds()).toEqual([]);
      }
    });

    it('should handle multiple task completions', () => {
      const managerResult = createTaskCompletionManager();
      
      expect(managerResult.isOk()).toBe(true);
      if (managerResult.isOk()) {
        const manager = managerResult.value;
        
        const firstToggle = manager.toggleTaskCompletion('task-1');
        expect(firstToggle.isOk()).toBe(true);
        
        const secondToggle = manager.toggleTaskCompletion('task-2');
        expect(secondToggle.isOk()).toBe(true);
        
        expect(manager.isTaskCompleted('task-1')).toBe(true);
        expect(manager.isTaskCompleted('task-2')).toBe(true);
        expect(manager.getCompletedTaskIds()).toEqual(['task-1', 'task-2']);
      }
    });

    it('should return error for invalid task id', () => {
      const managerResult = createTaskCompletionManager();
      
      expect(managerResult.isOk()).toBe(true);
      if (managerResult.isOk()) {
        const manager = managerResult.value;
        const result = manager.toggleTaskCompletion('');
        
        expect(result.isErr()).toBe(true);
        if (result.isErr()) {
          expect(result.error.type).toBe('INVALID_TASK_ID');
        }
      }
    });
  });
});