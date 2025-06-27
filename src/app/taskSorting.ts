import { Result, ok, err } from 'neverthrow';
import type { Task } from '@doist/todoist-api-typescript';
import { sortTasks, type SortConfig, type SortCriteria, type SortDirection, type SortError } from '../core/sorting.js';

export interface TaskSortingState {
  currentConfig: SortConfig;
}

export type TaskSortingError = SortError;

export const createDefaultSortingState = (): TaskSortingState => ({
  currentConfig: {
    criteria: 'dueDate',
    direction: 'asc'
  }
});

export const applySorting = (
  tasks: Task[], 
  state: TaskSortingState
): Result<Task[], TaskSortingError> => {
  const sortResult = sortTasks(tasks, state.currentConfig);
  
  if (sortResult.isErr()) {
    return err(sortResult.error);
  }

  return ok(sortResult.value);
};

export const updateSortConfig = (
  state: TaskSortingState,
  criteria: SortCriteria,
  direction: SortDirection
): TaskSortingState => ({
  ...state,
  currentConfig: { criteria, direction }
});

export const toggleSortDirection = (state: TaskSortingState): TaskSortingState => ({
  ...state,
  currentConfig: {
    ...state.currentConfig,
    direction: state.currentConfig.direction === 'asc' ? 'desc' : 'asc'
  }
});


export const getSortOptions = (): Array<{ value: SortCriteria; label: string }> => [
  { value: 'priority', label: '優先度' },
  { value: 'dueDate', label: '期限' },
  { value: 'createdDate', label: '作成日' },
  { value: 'alphabetical', label: 'アルファベット順' },
  { value: 'project', label: 'プロジェクト' }
];

export const getDirectionOptions = (): Array<{ value: SortDirection; label: string }> => [
  { value: 'asc', label: '昇順' },
  { value: 'desc', label: '降順' }
];

export const getNextSortCriteria = (current: SortCriteria): SortCriteria => {
  const criteria: SortCriteria[] = ['priority', 'dueDate', 'createdDate', 'alphabetical', 'project'];
  const currentIndex = criteria.indexOf(current);
  const nextIndex = (currentIndex + 1) % criteria.length;
  return criteria[nextIndex];
};

export const cycleSortCriteria = (state: TaskSortingState): TaskSortingState => {
  const nextCriteria = getNextSortCriteria(state.currentConfig.criteria);
  return {
    ...state,
    currentConfig: {
      ...state.currentConfig,
      criteria: nextCriteria
    }
  };
};