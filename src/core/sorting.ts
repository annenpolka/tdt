import { Result, ok, err } from 'neverthrow';
import type { Task } from '@doist/todoist-api-typescript';

export type SortCriteria = 
  | 'priority'
  | 'dueDate'
  | 'createdDate'
  | 'alphabetical'
  | 'project';

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  criteria: SortCriteria;
  direction: SortDirection;
}

export type SortError = 
  | { type: 'INVALID_CRITERIA'; message: string }
  | { type: 'INVALID_DIRECTION'; message: string }
  | { type: 'EMPTY_TASK_LIST'; message: string };

const sortByPriority = (tasks: Task[], direction: SortDirection): Task[] => {
  return [...tasks].sort((a, b) => {
    const priorityA = a.priority || 0;
    const priorityB = b.priority || 0;
    return direction === 'asc' ? priorityA - priorityB : priorityB - priorityA;
  });
};

const sortByDueDate = (tasks: Task[], direction: SortDirection): Task[] => {
  return [...tasks].sort((a, b) => {
    const dueDateA = a.due?.date ? new Date(a.due.date).getTime() : Infinity;
    const dueDateB = b.due?.date ? new Date(b.due.date).getTime() : Infinity;
    return direction === 'asc' ? dueDateA - dueDateB : dueDateB - dueDateA;
  });
};

const sortByCreatedDate = (tasks: Task[], direction: SortDirection): Task[] => {
  return [...tasks].sort((a, b) => {
    const createdA = a.addedAt ? new Date(a.addedAt).getTime() : 0;
    const createdB = b.addedAt ? new Date(b.addedAt).getTime() : 0;
    return direction === 'asc' ? createdA - createdB : createdB - createdA;
  });
};

const sortByAlphabetical = (tasks: Task[], direction: SortDirection): Task[] => {
  return [...tasks].sort((a, b) => {
    const contentA = a.content.toLowerCase();
    const contentB = b.content.toLowerCase();
    return direction === 'asc' 
      ? contentA.localeCompare(contentB)
      : contentB.localeCompare(contentA);
  });
};

const sortByProject = (tasks: Task[], direction: SortDirection): Task[] => {
  return [...tasks].sort((a, b) => {
    const projectA = a.projectId || '';
    const projectB = b.projectId || '';
    return direction === 'asc'
      ? projectA.localeCompare(projectB)
      : projectB.localeCompare(projectA);
  });
};

export const sortTasks = (tasks: Task[], config: SortConfig): Result<Task[], SortError> => {
  if (tasks.length === 0) {
    return err({ type: 'EMPTY_TASK_LIST', message: 'タスクリストが空です' });
  }

  const validCriteria: SortCriteria[] = ['priority', 'dueDate', 'createdDate', 'alphabetical', 'project'];
  if (!validCriteria.includes(config.criteria)) {
    return err({ 
      type: 'INVALID_CRITERIA', 
      message: `無効なソート条件です: ${config.criteria}` 
    });
  }

  const validDirections: SortDirection[] = ['asc', 'desc'];
  if (!validDirections.includes(config.direction)) {
    return err({ 
      type: 'INVALID_DIRECTION', 
      message: `無効なソート方向です: ${config.direction}` 
    });
  }

  try {
    let sortedTasks: Task[];
    
    switch (config.criteria) {
      case 'priority':
        sortedTasks = sortByPriority(tasks, config.direction);
        break;
      case 'dueDate':
        sortedTasks = sortByDueDate(tasks, config.direction);
        break;
      case 'createdDate':
        sortedTasks = sortByCreatedDate(tasks, config.direction);
        break;
      case 'alphabetical':
        sortedTasks = sortByAlphabetical(tasks, config.direction);
        break;
      case 'project':
        sortedTasks = sortByProject(tasks, config.direction);
        break;
      default:
        return err({ 
          type: 'INVALID_CRITERIA', 
          message: `サポートされていないソート条件です: ${config.criteria}` 
        });
    }

    return ok(sortedTasks);
  } catch (error) {
    return err({ 
      type: 'INVALID_CRITERIA', 
      message: `ソート中にエラーが発生しました: ${error instanceof Error ? error.message : 'Unknown error'}` 
    });
  }
};

export const getSortDisplayName = (criteria: SortCriteria, direction: SortDirection): string => {
  const criteriaNames: Record<SortCriteria, string> = {
    priority: '優先度',
    dueDate: '期限',
    createdDate: '作成日',
    alphabetical: 'アルファベット順',
    project: 'プロジェクト'
  };

  const directionNames: Record<SortDirection, string> = {
    asc: '昇順',
    desc: '降順'
  };

  return `${criteriaNames[criteria]} (${directionNames[direction]})`;
};