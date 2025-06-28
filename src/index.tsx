/**
 * tdt - Todoist CLI tool
 */
import { Task, TodoistApi } from '@doist/todoist-api-typescript';
import * as dotenv from 'dotenv';
import { Box, render, Text } from 'ink';
import React from 'react';
import { SelectableTaskList } from './components/SelectableTaskList.js';
import { TaskDetail } from './components/TaskDetail.js';
import { TaskPreview } from './components/TaskPreview.js';

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
        const api = new TodoistApi(process.env.TODOIST_API_KEY || 'testing');
        const response = await api.getTasks({ limit: 100 });
        setTasks(response.results || []);
        // 初期状態で最初のタスクをハイライト
        if (response.results && response.results.length > 0) {
          setHighlightedTask(response.results[0]);
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

  return (
    <Box flexDirection="column" width="100%">
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
