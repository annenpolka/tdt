import { describe, it, expect } from 'vitest';
import { render } from 'ink-testing-library';
import { TaskList } from './TaskList.js';
import type { Task } from '@doist/todoist-api-typescript';

describe('TaskList', () => {
  it('空のタスクリストを表示する', () => {
    const { lastFrame } = render(<TaskList tasks={[]} />);
    
    expect(lastFrame()).toContain('タスクが見つかりません');
  });

  it('タスクリストを正しく表示する', () => {
    const mockTasks: Task[] = [
      {
        id: '1',
        content: 'テストタスク1',
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
        url: 'https://todoist.com/task/1'
      },
      {
        id: '2',
        content: 'テストタスク2',
        projectId: 'project2',
        checked: false,
        childOrder: 2,
        dayOrder: 2,
        priority: 2,
        addedByUid: 'user1',
        assignedByUid: null,
        responsibleUid: null,
        noteCount: 0,
        addedAt: '2023-01-02T00:00:00Z',
        completedAt: null,
        updatedAt: '2023-01-02T00:00:00Z',
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
        url: 'https://todoist.com/task/2'
      }
    ];

    const { lastFrame } = render(<TaskList tasks={mockTasks} />);
    const output = lastFrame();
    
    expect(output).toContain('📋 タスク一覧 (2件)');
    expect(output).toContain('1. テストタスク1');
    expect(output).toContain('2. テストタスク2');
    expect(output).toContain('[プロジェクト: project1]');
    expect(output).toContain('[プロジェクト: project2]');
  });

  it('プロジェクトIDがないタスクを正しく表示する', () => {
    const mockTasks: Task[] = [
      {
        id: '1',
        content: 'プロジェクトなしタスク',
        projectId: '',
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
        url: 'https://todoist.com/task/1'
      }
    ];

    const { lastFrame } = render(<TaskList tasks={mockTasks} />);
    const output = lastFrame();
    
    expect(output).toContain('1. プロジェクトなしタスク');
    expect(output).not.toContain('[プロジェクト:');
  });
});