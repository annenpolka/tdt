import { Result, ok, err } from 'neverthrow';
import { 
  createTaskCompletionState, 
  toggleTaskCompletion, 
  isTaskCompleted, 
  getCompletedTaskIds,
  type TaskCompletionState, 
  type TaskCompletionError 
} from '../core/taskCompletion';

export interface TaskCompletionManager {
  toggleTaskCompletion(taskId: string): Result<void, TaskCompletionError>;
  isTaskCompleted(taskId: string): boolean;
  getCompletedTaskIds(): string[];
  getState(): TaskCompletionState;
}

export const createTaskCompletionManager = (): Result<TaskCompletionManager, never> => {
  const initialStateResult = createTaskCompletionState();
  
  if (initialStateResult.isErr()) {
    // This should never happen as createTaskCompletionState returns Result<T, never>
    throw new Error('Failed to create initial task completion state');
  }

  let currentState = initialStateResult.value;

  return ok({
    toggleTaskCompletion: (taskId: string): Result<void, TaskCompletionError> => {
      const result = toggleTaskCompletion(currentState, taskId);
      if (result.isOk()) {
        currentState = result.value;
        return ok(undefined);
      }
      return err(result.error);
    },

    isTaskCompleted: (taskId: string): boolean => {
      return isTaskCompleted(currentState, taskId);
    },

    getCompletedTaskIds: (): string[] => {
      return getCompletedTaskIds(currentState);
    },

    getState: (): TaskCompletionState => {
      return currentState;
    }
  });
};