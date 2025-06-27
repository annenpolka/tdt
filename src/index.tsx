/**
 * tdt - Todoist CLI tool
 */
import React from 'react';
import { render, Text } from 'ink';
import { TodoistApi, Task } from '@doist/todoist-api-typescript';
import * as dotenv from 'dotenv';
import { TaskList } from './components/TaskList.js';

if (process.env.NODE_ENV === 'development') {
  dotenv.config();
}

export const App: React.FC = () => {
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchTasks = async () => {
      try {
        const api = new TodoistApi(process.env.TODOIST_API_KEY || 'testing');
        const response = await api.getTasks({ limit: 10 });
        setTasks(response.results || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'タスクの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) {
    return <Text>読み込み中...</Text>;
  }

  if (error) {
    return <Text>エラー: {error}</Text>;
  }

  return <TaskList tasks={tasks} />;
};

async function main() {
  render(<App />);
}

// Only run main if not in test environment
if (!import.meta.vitest) {
  main().catch(console.error);
}

export {};

if (import.meta.vitest) {
  const { test, expect } = import.meta.vitest;
  test("init", () => {
    expect(true).toBe(true);
  });
}
