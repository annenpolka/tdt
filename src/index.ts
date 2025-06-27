/**
 * tdt - Todoist CLI tool
 */
import { TodoistApi } from '@doist/todoist-api-typescript';
import * as dotenv from 'dotenv';

if (process.env.NODE_ENV === 'development') {
  dotenv.config();
}

async function main() {
  const api = new TodoistApi(process.env.TODOIST_API_KEY || 'testing');
  
  // Get all tasks
  const tasks = await api.getTasks({ limit: 10 });
  
  console.log('Tasks:', tasks);
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
