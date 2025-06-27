import React from 'react';
import { Box, Text } from 'ink';
import type { Task } from '@doist/todoist-api-typescript';

interface TaskPreviewProps {
  task: Task;
}

export const TaskPreview: React.FC<TaskPreviewProps> = ({ task }) => {
  return (
    <Box flexDirection="column" padding={1} borderStyle="round" borderColor="cyan">
      <Text color="cyan" bold>
        📝 タスク詳細
      </Text>
      <Text />
      <Box flexDirection="row">
        <Text color="green" bold>タイトル: </Text>
        <Text>{task.content}</Text>
      </Box>
      
      {task.description && (
        <Box flexDirection="row" marginTop={1}>
          <Text color="green" bold>説明: </Text>
          <Text>{task.description}</Text>
        </Box>
      )}
      
      <Box flexDirection="row" marginTop={1}>
        <Text color="green" bold>優先度: </Text>
        <Text color={task.priority === 4 ? 'red' : task.priority === 3 ? 'yellow' : 'white'}>
          {task.priority === 4 ? '最高 (P1)' : 
           task.priority === 3 ? '高 (P2)' : 
           task.priority === 2 ? '中 (P3)' : '低 (P4)'}
        </Text>
      </Box>
      
      {task.due && (
        <Box flexDirection="row" marginTop={1}>
          <Text color="green" bold>期限: </Text>
          <Text color="red">{task.due.string}</Text>
        </Box>
      )}
      
      {task.labels && task.labels.length > 0 && (
        <Box flexDirection="row" marginTop={1}>
          <Text color="green" bold>ラベル: </Text>
          <Text color="magenta">{task.labels.join(', ')}</Text>
        </Box>
      )}
    </Box>
  );
};