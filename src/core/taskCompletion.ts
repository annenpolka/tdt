import { Result, ok, err } from 'neverthrow';

export interface TaskCompletionState {
  readonly completedTaskIds: Set<string>;
}

export type TaskCompletionError = 
  | { type: 'INVALID_TASK_ID'; message: string };

export const createTaskCompletionState = (): Result<TaskCompletionState, never> => {
  return ok({
    completedTaskIds: new Set<string>()
  });
};

export const toggleTaskCompletion = (
  state: TaskCompletionState,
  taskId: string
): Result<TaskCompletionState, TaskCompletionError> => {
  if (!taskId || taskId.trim() === '') {
    return err({
      type: 'INVALID_TASK_ID',
      message: 'タスクIDが無効です'
    });
  }

  const newCompletedTaskIds = new Set(state.completedTaskIds);
  
  if (newCompletedTaskIds.has(taskId)) {
    newCompletedTaskIds.delete(taskId);
  } else {
    newCompletedTaskIds.add(taskId);
  }

  return ok({
    completedTaskIds: newCompletedTaskIds
  });
};

export const isTaskCompleted = (state: TaskCompletionState, taskId: string): boolean => {
  return state.completedTaskIds.has(taskId);
};

export const getCompletedTaskIds = (state: TaskCompletionState): string[] => {
  return Array.from(state.completedTaskIds);
};