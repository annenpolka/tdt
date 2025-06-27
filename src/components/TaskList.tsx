import React from 'react';
import { Box, Text } from 'ink';
import type { Task } from '@doist/todoist-api-typescript';

interface TaskListProps {
  tasks: Task[];
}

export const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  if (tasks.length === 0) {
    return (
      <Box flexDirection="column">
        <Text color="yellow">タスクが見つかりません</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      <Text color="blue" bold>
        📋 タスク一覧 ({tasks.length}件)
      </Text>
      <Text />
      {tasks.map((task, index) => (
        <Box key={task.id} flexDirection="row">
          <Text color="gray">{index + 1}. </Text>
          <Text>{task.content}</Text>
          {task.projectId && (
            <Text color="cyan"> [プロジェクト: {task.projectId}]</Text>
          )}
        </Box>
      ))}
    </Box>
  );
};