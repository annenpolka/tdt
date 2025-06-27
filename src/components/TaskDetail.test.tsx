import { describe, it, expect, vi } from 'vitest';
import { render } from 'ink-testing-library';
import { TaskDetail } from './TaskDetail.js';
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

describe('TaskDetail', () => {
  it('基本的なタスク詳細を表示する', () => {
    const task = createMockTask({
      id: 'task123',
      content: '詳細表示テスト',
      projectId: 'project456'
    });
    const onBack = vi.fn();
    
    const { lastFrame } = render(<TaskDetail task={task} onBack={onBack} />);
    const output = lastFrame();
    
    expect(output).toContain('📝 タスク詳細');
    expect(output).toContain('qキーまたはESCキーで戻る');
    expect(output).toContain('タイトル: 詳細表示テスト');
    expect(output).toContain('ID: task123');
    expect(output).toContain('プロジェクトID: project456');
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
      const onBack = vi.fn();
      const { lastFrame } = render(<TaskDetail task={task} onBack={onBack} />);
      expect(lastFrame()).toContain(`優先度: ${expected}`);
    });
  });

  it('説明がある場合は説明を表示する', () => {
    const task = createMockTask({
      description: 'これは詳細な説明文です'
    });
    const onBack = vi.fn();
    
    const { lastFrame } = render(<TaskDetail task={task} onBack={onBack} />);
    const output = lastFrame();
    
    expect(output).toContain('説明: これは詳細な説明文です');
  });

  it('説明がない場合は説明欄を表示しない', () => {
    const task = createMockTask({ description: '' });
    const onBack = vi.fn();
    
    const { lastFrame } = render(<TaskDetail task={task} onBack={onBack} />);
    const output = lastFrame();
    
    expect(output).not.toContain('説明:');
  });

  it('プロジェクトIDがある場合は表示する', () => {
    const task = createMockTask({ projectId: 'myproject123' });
    const onBack = vi.fn();
    
    const { lastFrame } = render(<TaskDetail task={task} onBack={onBack} />);
    const output = lastFrame();
    
    expect(output).toContain('プロジェクトID: myproject123');
  });

  it('プロジェクトIDがない場合は表示しない', () => {
    const task = createMockTask({ projectId: '' });
    const onBack = vi.fn();
    
    const { lastFrame } = render(<TaskDetail task={task} onBack={onBack} />);
    const output = lastFrame();
    
    expect(output).not.toContain('プロジェクトID:');
  });

  it('期限がある場合は期限を表示する', () => {
    const task = createMockTask({
      due: {
        isRecurring: false,
        string: '来週の金曜日',
        date: '2023-12-08'
      }
    });
    const onBack = vi.fn();
    
    const { lastFrame } = render(<TaskDetail task={task} onBack={onBack} />);
    const output = lastFrame();
    
    expect(output).toContain('期限: 来週の金曜日');
  });

  it('期限がない場合は期限欄を表示しない', () => {
    const task = createMockTask({ due: null });
    const onBack = vi.fn();
    
    const { lastFrame } = render(<TaskDetail task={task} onBack={onBack} />);
    const output = lastFrame();
    
    expect(output).not.toContain('期限:');
  });

  it('ラベルがある場合はラベルを表示する', () => {
    const task = createMockTask({
      labels: ['重要', '緊急', '会議']
    });
    const onBack = vi.fn();
    
    const { lastFrame } = render(<TaskDetail task={task} onBack={onBack} />);
    const output = lastFrame();
    
    expect(output).toContain('ラベル: 重要, 緊急, 会議');
  });

  it('ラベルがない場合はラベル欄を表示しない', () => {
    const task = createMockTask({ labels: [] });
    const onBack = vi.fn();
    
    const { lastFrame } = render(<TaskDetail task={task} onBack={onBack} />);
    const output = lastFrame();
    
    expect(output).not.toContain('ラベル:');
  });

  it('作成日がある場合は日本語形式で表示する', () => {
    const task = createMockTask({
      addedAt: '2023-05-15T10:30:00Z'
    });
    const onBack = vi.fn();
    
    const { lastFrame } = render(<TaskDetail task={task} onBack={onBack} />);
    const output = lastFrame();
    
    expect(output).toContain('作成日: 2023/5/15');
  });

  it('作成日がない場合は作成日欄を表示しない', () => {
    const task = createMockTask({ addedAt: null });
    const onBack = vi.fn();
    
    const { lastFrame } = render(<TaskDetail task={task} onBack={onBack} />);
    const output = lastFrame();
    
    expect(output).not.toContain('作成日:');
  });

  it('すべての情報が揃ったタスクを正しく表示する', () => {
    const task = createMockTask({
      id: 'complete-task',
      content: '完全なタスク詳細',
      description: '詳細な説明文',
      projectId: 'main-project',
      priority: 4,
      due: {
        isRecurring: true,
        string: '毎週月曜日',
        date: '2023-12-04'
      },
      labels: ['重要', 'レビュー', '週次'],
      addedAt: '2023-01-01T00:00:00Z'
    });
    const onBack = vi.fn();
    
    const { lastFrame } = render(<TaskDetail task={task} onBack={onBack} />);
    const output = lastFrame();
    
    expect(output).toContain('📝 タスク詳細');
    expect(output).toContain('タイトル: 完全なタスク詳細');
    expect(output).toContain('説明: 詳細な説明文');
    expect(output).toContain('ID: complete-task');
    expect(output).toContain('プロジェクトID: main-project');
    expect(output).toContain('期限: 毎週月曜日');
    expect(output).toContain('優先度: 最高 (P1)');
    expect(output).toContain('ラベル: 重要, レビュー, 週次');
    expect(output).toContain('作成日: 2023/1/1');
  });
});