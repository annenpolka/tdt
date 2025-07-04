/**
 * tdt - Todoist CLI tool
 */
import { Task } from '@doist/todoist-api-typescript';
import * as dotenv from 'dotenv';
import { Box, render, Text } from 'ink';
import React from 'react';
import { SelectableTaskList } from './components/SelectableTaskList';
import { TaskDetail } from './components/TaskDetail';
import { TaskPreview } from './components/TaskPreview';
import { createTaskService } from './infra/taskService';
import { getDebugConfig, isDebugMode, shouldShowDebugInfo } from './infra/config';
import { getMockDataset } from './infra/mockData/taskDatasets';

if (process.env.NODE_ENV === 'development') {
  dotenv.config();
}

export const App: React.FC = () => {
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);
  const [highlightedTask, setHighlightedTask] = React.useState<Task | null>(null);

  React.useEffect(() => {
    const fetchTasks = async () => {
      try {
        const debugConfig = getDebugConfig();
        const mockTasks = debugConfig.enabled ? getMockDataset(debugConfig.dataset) : [];
        const taskService = createTaskService(debugConfig.enabled, mockTasks);
        
        const result = await taskService.getTasks();
        
        if (result.isOk()) {
          const taskList = result.value;
          setTasks(taskList);
          // 初期状態で最初のタスクをハイライト
          if (taskList.length > 0) {
            setHighlightedTask(taskList[0]);
          }
        } else {
          setError(result.error.message);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'タスクの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleTaskSelect = (task: Task) => {
    setSelectedTask(task);
  };

  const handleTaskHighlight = (task: Task) => {
    setHighlightedTask(task);
  };

  const handleBackToList = () => {
    setSelectedTask(null);
  };

  if (loading) {
    return <Text>読み込み中...</Text>;
  }

  if (error) {
    return <Text>エラー: {error}</Text>;
  }

  if (selectedTask) {
    return <TaskDetail task={selectedTask} onBack={handleBackToList} />;
  }

  const debugConfig = getDebugConfig();

  return (
    <Box flexDirection="column" width="100%">
      {debugConfig.enabled && shouldShowDebugInfo() && (
        <Box marginBottom={1} borderStyle="single" borderColor="yellow" padding={1}>
          <Text color="yellow">
            🐛 DEBUG MODE: dataset={debugConfig.dataset} | tasks={tasks.length}
          </Text>
        </Box>
      )}
      <Box marginBottom={1}>
        <SelectableTaskList
          tasks={tasks}
          onSelect={handleTaskSelect}
          onHighlight={handleTaskHighlight}
        />
      </Box>
      <Box>
        {highlightedTask && <TaskPreview task={highlightedTask} />}
      </Box>
    </Box>
  );
};

async function main() {
  render(<App />);
}

// Only run main if not in test environment
if (!import.meta.vitest) {
  main().catch(() => {
    process.exit(1);
  });
}

export { };

if (import.meta.vitest) {
  const { test, expect } = import.meta.vitest;
  test("init", () => {
    expect(true).toBe(true);
  });
}
