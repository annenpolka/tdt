import React from 'react';
import { Text } from 'ink';
import type { Task } from '@doist/todoist-api-typescript';
import type { SortConfig } from '../core/sorting';
import type { TaskCompletionManager } from '../app/taskCompletion';

interface TaskItemProps {
  task: Task;
  sortConfig?: SortConfig;
  completionManager?: TaskCompletionManager | null;
}

const getTaskDisplayInfo = (task: Task, sortConfig?: SortConfig): string => {
  const baseContent = task.content;
  
  if (!sortConfig) {
    return baseContent;
  }

  switch (sortConfig.criteria) {
    case 'priority':
      const priorityText = task.priority ? `優先度${task.priority}` : '優先度なし';
      return `${baseContent} [${priorityText}]`;
    
    case 'dueDate':
      const dueDateText = task.due?.date ? `期限: ${task.due.date}` : '期限なし';
      return `${baseContent} [${dueDateText}]`;
    
    case 'createdDate':
      const createdText = task.addedAt ? `作成: ${new Date(task.addedAt).toLocaleDateString('ja-JP')}` : '作成日不明';
      return `${baseContent} [${createdText}]`;
    
    case 'alphabetical':
      return baseContent;
    
    case 'project':
      const projectText = task.projectId ? `プロジェクト: ${task.projectId}` : 'プロジェクトなし';
      return `${baseContent} [${projectText}]`;
    
    default:
      return baseContent;
  }
};

export const TaskItem: React.FC<TaskItemProps> = ({ task, sortConfig, completionManager }) => {
  const displayText = getTaskDisplayInfo(task, sortConfig);
  const isCompleted = completionManager?.isTaskCompleted(task.id) ?? false;
  
  return (
    <Text color={isCompleted ? 'gray' : 'white'} dimColor={isCompleted}>
      {isCompleted ? '✓ ' : ''}{displayText}
    </Text>
  );
};

export const createTaskItemLabel = (task: Task, sortConfig?: SortConfig, completionManager?: TaskCompletionManager | null): string => {
  const baseText = getTaskDisplayInfo(task, sortConfig);
  const isCompleted = completionManager?.isTaskCompleted(task.id) ?? false;
  return isCompleted ? `✓ ${baseText}` : baseText;
};