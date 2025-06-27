import React from 'react';
import { Text } from 'ink';
import type { Task } from '@doist/todoist-api-typescript';

interface TaskItemProps {
  task: Task;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  return (
    <Text>
      {task.content}
      {task.projectId && ` [プロジェクト: ${task.projectId}]`}
    </Text>
  );
};

export const createTaskItemLabel = (task: Task): string => {
  return `${task.content}${task.projectId ? ` [プロジェクト: ${task.projectId}]` : ''}`;
};