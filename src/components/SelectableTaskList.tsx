import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import SelectInput from 'ink-select-input';
import type { Task } from '@doist/todoist-api-typescript';
import { createTaskItemLabel } from './TaskItem.js';
import { 
  applySorting, 
  createDefaultSortingState, 
  cycleSortCriteria,
  toggleSortDirection,
  type TaskSortingState
} from '../app/taskSorting.js';
import { getSortDisplayName } from '../core/sorting.js';

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
  const [sortingState, setSortingState] = useState<TaskSortingState>(createDefaultSortingState());
  const [sortedTasks, setSortedTasks] = useState<Task[]>(tasks);

  useEffect(() => {
    const sortResult = applySorting(tasks, sortingState);
    if (sortResult.isOk()) {
      setSortedTasks(sortResult.value);
    } else {
      setSortedTasks(tasks);
    }
  }, [tasks, sortingState]);

  useInput((input, key) => {
    if (key.escape) return;
    
    if (input.toLowerCase() === 's') {
      if (key.shift) {
        setSortingState(prev => toggleSortDirection(prev));
      } else {
        setSortingState(prev => cycleSortCriteria(prev));
      }
    }
  });

  if (sortedTasks.length === 0) {
    return (
      <Box flexDirection="column" borderStyle="round" borderColor="yellow" padding={1} width="100%">
        <Text color="yellow">タスクが見つかりません</Text>
      </Box>
    );
  }

  const items: SelectItem[] = sortedTasks.map((task) => ({
    label: createTaskItemLabel(task, sortingState.currentConfig),
    value: task,
    key: task.id,
  }));

  const getShortcutHelp = (): string => {
    return 'S: ソート条件切り替え, Shift+S: 昇順/降順切り替え';
  };

  return (
    <Box flexDirection="column" borderStyle="round" borderColor="blue" padding={1} width="100%">
      <Text color="blue" bold>
        📋 タスク一覧 ({sortedTasks.length}件)
      </Text>
      <Text color="cyan">
        ソート: {getSortDisplayName(sortingState.currentConfig.criteria, sortingState.currentConfig.direction)}
      </Text>
      <Text color="gray" dimColor>
        {getShortcutHelp()}
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