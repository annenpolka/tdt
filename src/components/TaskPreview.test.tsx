import { describe, it, expect } from 'vitest';
import { render } from 'ink-testing-library';
import { TaskPreview } from './TaskPreview.js';
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

describe('TaskPreview', () => {
  it('基本的なタスク情報を表示する', () => {
    const task = createMockTask({
      content: '重要なタスク',
      priority: 2
    });
    
    const { lastFrame } = render(<TaskPreview task={task} />);
    const output = lastFrame();
    
    expect(output).toContain('📝 タスク詳細');
    expect(output).toContain('タイトル: 重要なタスク');
    expect(output).toContain('優先度: 中 (P3)');
  });

  it('優先度を正しく表示する', () => {
    const testCases = [
      { priority: 4, expected: '最高 (P1)' },
      { priority: 3, expected: '高 (P2)' },
      { priority: 2, expected: '中 (P3)' },
      { priority: 1, expected: '低 (P4)' }
    ];

    testCases.forEach(({ priority, expected }) => {
      const task = createMockTask({ priority });
      const { lastFrame } = render(<TaskPreview task={task} />);
      expect(lastFrame()).toContain(`優先度: ${expected}`);
    });
  });

  it('説明がある場合は説明を表示する', () => {
    const task = createMockTask({
      content: 'タスクタイトル',
      description: 'これは詳細な説明です'
    });
    
    const { lastFrame } = render(<TaskPreview task={task} />);
    const output = lastFrame();
    
    expect(output).toContain('説明: これは詳細な説明です');
  });

  it('説明がない場合は説明欄を表示しない', () => {
    const task = createMockTask({
      content: 'タスクタイトル',
      description: ''
    });
    
    const { lastFrame } = render(<TaskPreview task={task} />);
    const output = lastFrame();
    
    expect(output).not.toContain('説明:');
  });

  it('期限がある場合は期限を表示する', () => {
    const task = createMockTask({
      due: {
        isRecurring: false,
        string: '2023年12月31日',
        date: '2023-12-31'
      }
    });
    
    const { lastFrame } = render(<TaskPreview task={task} />);
    const output = lastFrame();
    
    expect(output).toContain('期限: 2023年12月31日');
  });

  it('期限がない場合は期限欄を表示しない', () => {
    const task = createMockTask({ due: null });
    
    const { lastFrame } = render(<TaskPreview task={task} />);
    const output = lastFrame();
    
    expect(output).not.toContain('期限:');
  });

  it('ラベルがある場合はラベルを表示する', () => {
    const task = createMockTask({
      labels: ['重要', '緊急', '仕事']
    });
    
    const { lastFrame } = render(<TaskPreview task={task} />);
    const output = lastFrame();
    
    expect(output).toContain('ラベル: 重要, 緊急, 仕事');
  });

  it('ラベルがない場合はラベル欄を表示しない', () => {
    const task = createMockTask({ labels: [] });
    
    const { lastFrame } = render(<TaskPreview task={task} />);
    const output = lastFrame();
    
    expect(output).not.toContain('ラベル:');
  });

  it('すべての情報が揃ったタスクを正しく表示する', () => {
    const task = createMockTask({
      content: '完全なタスク',
      description: '詳細説明',
      priority: 4,
      due: {
        isRecurring: false,
        string: '明日',
        date: '2023-12-01'
      },
      labels: ['重要', 'レビュー']
    });
    
    const { lastFrame } = render(<TaskPreview task={task} />);
    const output = lastFrame();
    
    expect(output).toContain('📝 タスク詳細');
    expect(output).toContain('タイトル: 完全なタスク');
    expect(output).toContain('説明: 詳細説明');
    expect(output).toContain('優先度: 最高 (P1)');
    expect(output).toContain('期限: 明日');
    expect(output).toContain('ラベル: 重要, レビュー');
  });
});