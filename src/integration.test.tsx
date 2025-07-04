import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from 'ink-testing-library';
import { TodoistApi } from '@doist/todoist-api-typescript';
import type { Task } from '@doist/todoist-api-typescript';

// Mock Todoist API
vi.mock('@doist/todoist-api-typescript');
const MockedTodoistApi = vi.mocked(TodoistApi);

// Import App component after mocking
const { App } = await import('./index.js');

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

describe('統合テスト', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.TODOIST_API_KEY = 'test-api-key';
    // テスト環境でデバッグモードを無効化
    process.env.DEBUG_MODE = 'false';
    process.env.NODE_ENV = 'test';
  });

  it('アプリ全体のフローをテストする - タスクリストからプレビューまで', async () => {
    const mockTasks = [
      createMockTask({
        id: '1',
        content: '第1のタスク',
        projectId: 'project1',
        priority: 3,
        description: '重要なタスクです'
      }),
      createMockTask({
        id: '2',
        content: '第2のタスク',
        projectId: 'project2',
        priority: 1,
        labels: ['ラベル1', 'ラベル2']
      })
    ];

    const mockGetTasks = vi.fn().mockResolvedValue({ 
      results: mockTasks, 
      nextCursor: null 
    });
    MockedTodoistApi.mockImplementation(() => ({
      getTasks: mockGetTasks,
    }) as any);

    const { lastFrame, rerender } = render(<App />);
    
    // 初期状態は読み込み中
    expect(lastFrame()).toContain('読み込み中...');
    
    // 非同期処理完了後
    await new Promise(resolve => setTimeout(resolve, 10));
    rerender(<App />);
    
    const finalOutput = lastFrame();
    
    // タスクリストが表示されている
    expect(finalOutput).toContain('📋 タスク一覧 (2件)');
    expect(finalOutput).toContain('第1のタスク [期限なし]');
    expect(finalOutput).toContain('第2のタスク [期限なし]');
    
    // プレビューエリアが表示されている（最初のタスクが自動選択される）
    expect(finalOutput).toContain('📝 タスク詳細');
    expect(finalOutput).toContain('タイトル: 第1のタスク');
    expect(finalOutput).toContain('優先度: 高 (P2)');
    expect(finalOutput).toContain('説明: 重要なタスクです');
    
    // APIが正しく呼ばれている
    expect(mockGetTasks).toHaveBeenCalledWith({ limit: 20 });
  });

  it('空のタスクリストの場合の統合テスト', async () => {
    const mockGetTasks = vi.fn().mockResolvedValue({ 
      results: [], 
      nextCursor: null 
    });
    MockedTodoistApi.mockImplementation(() => ({
      getTasks: mockGetTasks,
    }) as any);

    const { lastFrame, rerender } = render(<App />);
    
    // 非同期処理完了後
    await new Promise(resolve => setTimeout(resolve, 10));
    rerender(<App />);
    
    const finalOutput = lastFrame();
    
    // 空のタスクリストメッセージが表示されている
    expect(finalOutput).toContain('タスクが見つかりません');
    
    // プレビューエリアは表示されない
    expect(finalOutput).not.toContain('📝 タスク詳細');
  });

  it('APIエラー時の統合テスト', async () => {
    const mockGetTasks = vi.fn().mockRejectedValue(new Error('ネットワークエラー'));
    MockedTodoistApi.mockImplementation(() => ({
      getTasks: mockGetTasks,
    }) as any);

    const { lastFrame, rerender } = render(<App />);
    
    // 非同期処理完了後
    await new Promise(resolve => setTimeout(resolve, 10));
    rerender(<App />);
    
    const finalOutput = lastFrame();
    
    // エラーメッセージが表示されている
    expect(finalOutput).toContain('エラー: ネットワークエラー');
    
    // タスクリストもプレビューも表示されない
    expect(finalOutput).not.toContain('📋 タスク一覧');
    expect(finalOutput).not.toContain('📝 タスク詳細');
  });

  it('さまざまなタスクプロパティでの統合テスト', async () => {
    const mockTasks = [
      createMockTask({
        id: '1',
        content: 'フル機能タスク',
        projectId: 'main-project',
        priority: 4,
        description: '詳細説明付きタスク',
        due: {
          isRecurring: false,
          string: '今日',
          date: '2023-12-01'
        },
        labels: ['緊急', '重要'],
        addedAt: '2023-01-01T00:00:00Z'
      })
    ];

    const mockGetTasks = vi.fn().mockResolvedValue({ 
      results: mockTasks, 
      nextCursor: null 
    });
    MockedTodoistApi.mockImplementation(() => ({
      getTasks: mockGetTasks,
    }) as any);

    const { lastFrame, rerender } = render(<App />);
    
    await new Promise(resolve => setTimeout(resolve, 10));
    rerender(<App />);
    
    const finalOutput = lastFrame();
    
    // タスクリストとプレビューの両方で情報が正しく表示される
    expect(finalOutput).toContain('フル機能タスク [期限: 2023-12-01]');
    expect(finalOutput).toContain('タイトル: フル機能タスク');
    expect(finalOutput).toContain('説明: 詳細説明付きタスク');
    expect(finalOutput).toContain('優先度: 最高 (P1)');
    expect(finalOutput).toContain('期限: 今日');
    expect(finalOutput).toContain('ラベル: 緊急, 重要');
  });

  it('レイアウトが正しく構成されている', async () => {
    const mockTasks = [
      createMockTask({ id: '1', content: 'テストタスク' })
    ];

    const mockGetTasks = vi.fn().mockResolvedValue({ 
      results: mockTasks, 
      nextCursor: null 
    });
    MockedTodoistApi.mockImplementation(() => ({
      getTasks: mockGetTasks,
    }) as any);

    const { lastFrame, rerender } = render(<App />);
    
    await new Promise(resolve => setTimeout(resolve, 10));
    rerender(<App />);
    
    const finalOutput = lastFrame();
    
    // 縦方向レイアウトの確認
    // タスクリスト部分
    expect(finalOutput).toContain('📋 タスク一覧');
    expect(finalOutput).toContain('↑↓ で移動、Enter で選択');
    
    // プレビュー部分
    expect(finalOutput).toContain('📝 タスク詳細');
    
    // 両方のコンポーネントがレンダリングされている
    if (finalOutput) {
      const lines = finalOutput.split('\n');
      const taskListIndex = lines.findIndex(line => line.includes('📋 タスク一覧'));
      const previewIndex = lines.findIndex(line => line.includes('📝 タスク詳細'));
      
      // タスクリストが上部、プレビューが下部に配置されている
      expect(taskListIndex).toBeGreaterThan(-1);
      expect(previewIndex).toBeGreaterThan(-1);
      expect(taskListIndex).toBeLessThan(previewIndex);
    }
  });
});