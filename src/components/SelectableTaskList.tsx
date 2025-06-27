import React from 'react';
import { Box, Text } from 'ink';
import SelectInput from 'ink-select-input';
import type { Task } from '@doist/todoist-api-typescript';
import { createTaskItemLabel } from './TaskItem.js';

interface SelectableTaskListProps {
  tasks: Task[];
  onSelect: (task: Task) => void;
  onHighlight?: (task: Task) => void;
}

interface SelectItem {
  label: string;
  value: Task;
  key: string;
}

export const SelectableTaskList: React.FC<SelectableTaskListProps> = ({ tasks, onSelect, onHighlight }) => {
  if (tasks.length === 0) {
    return (
      <Box flexDirection="column" borderStyle="round" borderColor="yellow" padding={1} width="100%">
        <Text color="yellow">タスクが見つかりません</Text>
      </Box>
    );
  }

  const items: SelectItem[] = tasks.map((task) => ({
    label: createTaskItemLabel(task),
    value: task,
    key: task.id,
  }));

  return (
    <Box flexDirection="column" borderStyle="round" borderColor="blue" padding={1} width="100%">
      <Text color="blue" bold>
        📋 タスク一覧 ({tasks.length}件)
      </Text>
      <Text color="gray">
        ↑↓ で移動、Enter で選択
      </Text>
      <Text />
      <SelectInput
        items={items}
        onSelect={(item) => onSelect(item.value)}
        onHighlight={(item) => onHighlight?.(item.value)}
      />
    </Box>
  );
};