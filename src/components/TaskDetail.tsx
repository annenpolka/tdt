import React from 'react';
import { Box, Text } from 'ink';
import type { Task } from '@doist/todoist-api-typescript';

interface TaskDetailProps {
  task: Task;
  onBack: () => void;
}

export const TaskDetail: React.FC<TaskDetailProps> = ({ task, onBack }) => {
  React.useEffect(() => {
    const handleInput = (input: string) => {
      if (input === 'q' || input === '\u001b') { // 'q' or ESC key
        onBack();
      }
    };

    process.stdin.on('data', handleInput);
    return () => {
      process.stdin.off('data', handleInput);
    };
  }, [onBack]);

  return (
    <Box flexDirection="column">
      <Text color="blue" bold>
        📝 タスク詳細
      </Text>
      <Text color="gray">
        qキーまたはESCキーで戻る
      </Text>
      <Text />
      <Box flexDirection="column" padding={1} borderStyle="round" borderColor="cyan">
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
          <Text color="green" bold>ID: </Text>
          <Text>{task.id}</Text>
        </Box>
        
        {task.projectId && (
          <Box flexDirection="row" marginTop={1}>
            <Text color="green" bold>プロジェクトID: </Text>
            <Text>{task.projectId}</Text>
          </Box>
        )}
        
        {task.due && (
          <Box flexDirection="row" marginTop={1}>
            <Text color="green" bold>期限: </Text>
            <Text color="red">{task.due.string}</Text>
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
        
        {task.labels && task.labels.length > 0 && (
          <Box flexDirection="row" marginTop={1}>
            <Text color="green" bold>ラベル: </Text>
            <Text color="magenta">{task.labels.join(', ')}</Text>
          </Box>
        )}
        
        {task.addedAt && (
          <Box flexDirection="row" marginTop={1}>
            <Text color="green" bold>作成日: </Text>
            <Text>{new Date(task.addedAt).toLocaleDateString('ja-JP')}</Text>
          </Box>
        )}
      </Box>
    </Box>
  );
};