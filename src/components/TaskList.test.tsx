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
      },
      {
        id: '2',
        content: 'テストタスク2',
        projectId: 'project2',
        isCompleted: false,
        order: 2,
        priority: 2,
        assigneeId: null,
        assigner: null,
        commentCount: 0,
        createdAt: '2023-01-02T00:00:00Z',
        creatorId: 'user1',
        description: '',
        due: null,
        duration: null,
        labels: [],
        parentId: null,
        sectionId: null,
        sync_id: null,
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
        projectId: null,
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

    const { lastFrame } = render(<TaskList tasks={mockTasks} />);
    const output = lastFrame();
    
    expect(output).toContain('1. プロジェクトなしタスク');
    expect(output).not.toContain('[プロジェクト:');
  });
});