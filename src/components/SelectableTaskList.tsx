import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import SelectInput from 'ink-select-input';
import type { Task } from '@doist/todoist-api-typescript';
import { createTaskItemLabel } from './TaskItem';
import { 
  applySorting, 
  createDefaultSortingState, 
  cycleSortCriteria,
  toggleSortDirection,
  type TaskSortingState
} from '../app/taskSorting';
import { getSortDisplayName, sortTasksWithCompletion } from '../core/sorting';
import type { TaskCompletionManager } from '../app/taskCompletion';

interface SelectableTaskListProps {
  tasks: Task[];
  onSelect: (task: Task) => void;
  onHighlight?: (task: Task) => void;
  onToggleCompletion?: (taskId: string) => void;
  completionManager?: TaskCompletionManager | null;
}

interface SelectItem {
  label: string;
  value: Task;
  key: string;
}

export const SelectableTaskList: React.FC<SelectableTaskListProps> = ({ 
  tasks, 
  onSelect, 
  onHighlight, 
  onToggleCompletion, 
  completionManager 
}) => {
  const [sortingState, setSortingState] = useState<TaskSortingState>(createDefaultSortingState());
  const [sortedTasks, setSortedTasks] = useState<Task[]>(tasks);
  const [currentHighlightedTask, setCurrentHighlightedTask] = useState<Task | null>(null);
  const [completionStateVersion, setCompletionStateVersion] = useState<number>(0);
  const [selectInputKey, setSelectInputKey] = useState<string>('select-input-0');

  useEffect(() => {
    const previousHighlightedTaskId = currentHighlightedTask?.id;
    
    if (completionManager) {
      const sortResult = sortTasksWithCompletion(tasks, sortingState.currentConfig, completionManager.getState());
      if (sortResult.isOk()) {
        setSortedTasks(sortResult.value);
        
        // 完了状態変更後にカーソル位置を調整
        if (previousHighlightedTaskId) {
          const newIndex = sortResult.value.findIndex(task => task.id === previousHighlightedTaskId);
          if (newIndex !== -1) {
            setSelectInputKey(`select-input-${Date.now()}-${newIndex}`);
          }
        }
      } else {
        setSortedTasks(tasks);
      }
    } else {
      const sortResult = applySorting(tasks, sortingState);
      if (sortResult.isOk()) {
        setSortedTasks(sortResult.value);
        
        // ソート変更後にカーソル位置を調整
        if (previousHighlightedTaskId) {
          const newIndex = sortResult.value.findIndex(task => task.id === previousHighlightedTaskId);
          if (newIndex !== -1) {
            setSelectInputKey(`select-input-${Date.now()}-${newIndex}`);
          }
        }
      } else {
        setSortedTasks(tasks);
      }
    }
  }, [tasks, sortingState, completionManager, completionStateVersion]);

  useInput((input, key) => {
    if (key.escape) return;
    
    if (input.toLowerCase() === 's') {
      if (key.shift) {
        setSortingState(prev => toggleSortDirection(prev));
      } else {
        setSortingState(prev => cycleSortCriteria(prev));
      }
    }
    
    if (input.toLowerCase() === 'c') {
      if (currentHighlightedTask && onToggleCompletion) {
        onToggleCompletion(currentHighlightedTask.id);
        setCompletionStateVersion(prev => prev + 1);
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
    label: createTaskItemLabel(task, sortingState.currentConfig, completionManager),
    value: task,
    key: task.id,
  }));

  const getShortcutHelp = (): string => {
    return 'S: ソート条件切り替え, Shift+S: 昇順/降順切り替え, C: 完了切り替え';
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
        key={selectInputKey}
        items={items}
        initialIndex={currentHighlightedTask ? 
          Math.max(0, sortedTasks.findIndex(task => task.id === currentHighlightedTask.id)) : 0}
        onSelect={(item) => onSelect(item.value)}
        onHighlight={(item) => {
          setCurrentHighlightedTask(item.value);
          onHighlight?.(item.value);
        }}
      />
    </Box>
  );
};