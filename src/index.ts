import { TodoistApi } from '@doist/todoist-api-typescript';
import * as dotenv from 'dotenv';

if (process.env.NODE_ENV === 'development') {
  dotenv.config();
}

const api = new TodoistApi(process.env.TODOIST_API_KEY || 'testing');

// Get all tasks
const tasks = await api.getTasks();

console.log('Tasks:', tasks);
