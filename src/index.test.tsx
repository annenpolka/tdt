import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from 'ink-testing-library';
import React from 'react';
import { TodoistApi } from '@doist/todoist-api-typescript';

// Mock Todoist API
vi.mock('@doist/todoist-api-typescript');
const MockedTodoistApi = vi.mocked(TodoistApi);

// Import App component after mocking
const { App } = await import('./index.js');

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.TODOIST_API_KEY = 'test-api-key';
  });

  it('読み込み中の状態を表示する', () => {
    const mockGetTasks = vi.fn().mockImplementation(() => new Promise(() => {})); // Never resolves
    MockedTodoistApi.mockImplementation(() => ({
      getTasks: mockGetTasks,
    }) as any);

    const { lastFrame } = render(<App />);
    
    expect(lastFrame()).toContain('読み込み中...');
  });

  it('タスクを正常に取得して表示する', async () => {
    const mockTasks = [
      {
        id: '1',
        content: 'テストタスク',
        projectId: 'project1',
        isCompleted: false,
        order: 1,
        priority: 1,
        assigneeId: null,
        assigner: null,
        commentCount: 0,
        createdAt: '2023-01-01T00:00:00Z',
        creatorId: 'user1',
        description: '',
        due: null,
        duration: null,
        labels: [],
        parentId: null,
        sectionId: null,
        sync_id: null,
        url: 'https://todoist.com/task/1'
      }
    ];

    const mockGetTasks = vi.fn().mockResolvedValue(mockTasks);
    MockedTodoistApi.mockImplementation(() => ({
      getTasks: mockGetTasks,
    }) as any);

    const { lastFrame, rerender } = render(<App />);
    
    // Wait for async operation to complete
    await new Promise(resolve => setTimeout(resolve, 10));
    rerender(<App />);
    
    expect(lastFrame()).toContain('📋 タスク一覧 (1件)');
    expect(lastFrame()).toContain('1. テストタスク');
    expect(mockGetTasks).toHaveBeenCalledWith({ limit: 10 });
  });

  it('エラーが発生した場合にエラーメッセージを表示する', async () => {
    const mockGetTasks = vi.fn().mockRejectedValue(new Error('API接続エラー'));
    MockedTodoistApi.mockImplementation(() => ({
      getTasks: mockGetTasks,
    }) as any);

    const { lastFrame, rerender } = render(<App />);
    
    // Wait for async operation to complete
    await new Promise(resolve => setTimeout(resolve, 10));
    rerender(<App />);
    
    expect(lastFrame()).toContain('エラー: API接続エラー');
  });

  it('不明なエラーの場合にデフォルトメッセージを表示する', async () => {
    const mockGetTasks = vi.fn().mockRejectedValue('unknown error');
    MockedTodoistApi.mockImplementation(() => ({
      getTasks: mockGetTasks,
    }) as any);

    const { lastFrame, rerender } = render(<App />);
    
    // Wait for async operation to complete
    await new Promise(resolve => setTimeout(resolve, 10));
    rerender(<App />);
    
    expect(lastFrame()).toContain('エラー: タスクの取得に失敗しました');
  });
});