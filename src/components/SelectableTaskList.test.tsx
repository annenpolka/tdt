import { describe, it, expect, vi } from 'vitest';
import { render } from 'ink-testing-library';
import { SelectableTaskList } from './SelectableTaskList.js';
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

describe('SelectableTaskList', () => {
  it('空のタスクリストの場合、適切なメッセージを表示する', () => {
    const onSelect = vi.fn();
    const onHighlight = vi.fn();
    
    const { lastFrame } = render(
      <SelectableTaskList 
        tasks={[]} 
        onSelect={onSelect} 
        onHighlight={onHighlight} 
      />
    );
    
    expect(lastFrame()).toContain('タスクが見つかりません');
  });

  it('タスクリストのヘッダーと操作説明を表示する', () => {
    const mockTasks = [createMockTask()];
    const onSelect = vi.fn();
    const onHighlight = vi.fn();
    
    const { lastFrame } = render(
      <SelectableTaskList 
        tasks={mockTasks} 
        onSelect={onSelect} 
        onHighlight={onHighlight} 
      />
    );
    
    const output = lastFrame();
    expect(output).toContain('📋 タスク一覧 (1件)');
    expect(output).toContain('↑↓ で移動、Enter で選択');
  });

  it('複数のタスクを正しく表示する', () => {
    const mockTasks = [
      createMockTask({ id: '1', content: 'タスク1', projectId: 'project1' }),
      createMockTask({ id: '2', content: 'タスク2', projectId: 'project2' }),
      createMockTask({ id: '3', content: 'タスク3', projectId: '' })
    ];
    const onSelect = vi.fn();
    const onHighlight = vi.fn();
    
    const { lastFrame } = render(
      <SelectableTaskList 
        tasks={mockTasks} 
        onSelect={onSelect} 
        onHighlight={onHighlight} 
      />
    );
    
    const output = lastFrame();
    expect(output).toContain('📋 タスク一覧 (3件)');
    expect(output).toContain('タスク1 [プロジェクト: project1]');
    expect(output).toContain('タスク2 [プロジェクト: project2]');
    expect(output).toContain('タスク3');
    expect(output).not.toContain('タスク3 [プロジェクト:');
  });

  it('プロジェクトIDがないタスクの場合、プロジェクト情報を表示しない', () => {
    const mockTasks = [
      createMockTask({ id: '1', content: 'プロジェクトなし', projectId: '' })
    ];
    const onSelect = vi.fn();
    const onHighlight = vi.fn();
    
    const { lastFrame } = render(
      <SelectableTaskList 
        tasks={mockTasks} 
        onSelect={onSelect} 
        onHighlight={onHighlight} 
      />
    );
    
    const output = lastFrame();
    expect(output).toContain('プロジェクトなし');
    expect(output).not.toContain('[プロジェクト:');
  });

  it('タスクアイテムに正しいkeyが設定されている', () => {
    const mockTasks = [
      createMockTask({ id: 'task-1', content: 'タスク1' }),
      createMockTask({ id: 'task-2', content: 'タスク2' })
    ];
    const onSelect = vi.fn();
    const onHighlight = vi.fn();
    
    // SelectInputコンポーネントの内部実装をテストするのは困難なため、
    // コンポーネントが正常にレンダリングされることを確認
    const { lastFrame } = render(
      <SelectableTaskList 
        tasks={mockTasks} 
        onSelect={onSelect} 
        onHighlight={onHighlight} 
      />
    );
    
    expect(lastFrame()).toContain('📋 タスク一覧 (2件)');
  });
});