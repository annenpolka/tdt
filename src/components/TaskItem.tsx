import React from 'react';
import { Text } from 'ink';
import type { Task } from '@doist/todoist-api-typescript';
import type { SortConfig } from '../core/sorting';

interface TaskItemProps {
  task: Task;
  sortConfig?: SortConfig;
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

export const TaskItem: React.FC<TaskItemProps> = ({ task, sortConfig }) => {
  const displayText = getTaskDisplayInfo(task, sortConfig);
  
  return (
    <Text>
      {displayText}
    </Text>
  );
};

export const createTaskItemLabel = (task: Task, sortConfig?: SortConfig): string => {
  return getTaskDisplayInfo(task, sortConfig);
};