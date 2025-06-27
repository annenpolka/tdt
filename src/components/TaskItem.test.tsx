import { describe, it, expect } from 'vitest';
import { render } from 'ink-testing-library';
import { TaskItem, createTaskItemLabel } from './TaskItem.js';
import type { Task } from '@doist/todoist-api-typescript';

const createMockTask = (overrides: Partial<Task> = {}): Task => ({
  id: '1',
  content: 'テストタスク',
  projectId: 'project1',
  checked: false,
  childOrder: 1,
  dayOrder: 1,
  priority: 1,
  addedByUid: 'user1',
  assignedByUid: null,
  responsibleUid: null,
  noteCount: 0,
  addedAt: '2023-01-01T00:00:00Z',
  completedAt: null,
  updatedAt: '2023-01-01T00:00:00Z',
  userId: 'user1',
  isDeleted: false,
  isCollapsed: false,
  description: '',
  due: null,
  duration: null,
  deadline: null,
  labels: [],
  parentId: null,
  sectionId: null,
  url: 'https://todoist.com/task/1',
  ...overrides
});

describe('TaskItem', () => {
  it('プロジェクトIDがある場合、タスク内容とプロジェクト情報を表示する', () => {
    const task = createMockTask({
      content: 'サンプルタスク',
      projectId: 'my-project'
    });
    
    const { lastFrame } = render(<TaskItem task={task} />);
    const output = lastFrame();
    
    expect(output).toContain('サンプルタスク [プロジェクト: my-project]');
  });

  it('プロジェクトIDがない場合、タスク内容のみを表示する', () => {
    const task = createMockTask({
      content: 'プロジェクトなしタスク',
      projectId: ''
    });
    
    const { lastFrame } = render(<TaskItem task={task} />);
    const output = lastFrame();
    
    expect(output).toContain('プロジェクトなしタスク');
    expect(output).not.toContain('[プロジェクト:');
  });

  it('特殊文字を含むタスク内容を正しく表示する', () => {
    const task = createMockTask({
      content: '特殊文字テスト: @#$%^&*()',
      projectId: 'special-project'
    });
    
    const { lastFrame } = render(<TaskItem task={task} />);
    const output = lastFrame();
    
    expect(output).toContain('特殊文字テスト: @#$%^&*() [プロジェクト: special-project]');
  });
});

describe('createTaskItemLabel', () => {
  it('プロジェクトIDがある場合、適切なラベルを生成する', () => {
    const task = createMockTask({
      content: 'ラベルテスト',
      projectId: 'test-project'
    });
    
    const label = createTaskItemLabel(task);
    
    expect(label).toBe('ラベルテスト [プロジェクト: test-project]');
  });

  it('プロジェクトIDがない場合、タスク内容のみのラベルを生成する', () => {
    const task = createMockTask({
      content: 'シンプルタスク',
      projectId: ''
    });
    
    const label = createTaskItemLabel(task);
    
    expect(label).toBe('シンプルタスク');
  });

  it('プロジェクトIDがnullの場合、タスク内容のみのラベルを生成する', () => {
    const task = createMockTask({
      content: 'nullプロジェクトタスク',
      projectId: null as any
    });
    
    const label = createTaskItemLabel(task);
    
    expect(label).toBe('nullプロジェクトタスク');
  });

  it('空のタスク内容でも正しく処理する', () => {
    const task = createMockTask({
      content: '',
      projectId: 'empty-content-project'
    });
    
    const label = createTaskItemLabel(task);
    
    expect(label).toBe(' [プロジェクト: empty-content-project]');
  });

  it('長いタスク内容とプロジェクト名を正しく処理する', () => {
    const task = createMockTask({
      content: 'これは非常に長いタスクの内容です。詳細な説明や複雑な要件が含まれています。',
      projectId: '非常に長いプロジェクト名-詳細情報付き'
    });
    
    const label = createTaskItemLabel(task);
    
    expect(label).toBe('これは非常に長いタスクの内容です。詳細な説明や複雑な要件が含まれています。 [プロジェクト: 非常に長いプロジェクト名-詳細情報付き]');
  });
});