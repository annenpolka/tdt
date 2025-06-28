import { describe, it, expect } from 'vitest';
import { render } from 'ink-testing-library';
import { TaskItem, createTaskItemLabel } from './TaskItem.js';
import type { Task } from '@doist/todoist-api-typescript';
import type { SortConfig } from '../core/sorting.js';

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
  it('sortConfigがない場合はタスク内容のみを表示する', () => {
    const task = createMockTask({
      content: 'サンプルタスク',
      projectId: 'my-project'
    });
    
    const { lastFrame } = render(<TaskItem task={task} />);
    const output = lastFrame();
    
    expect(output).toContain('サンプルタスク');
    expect(output).not.toContain('[プロジェクト:');
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
    
    expect(output).toContain('特殊文字テスト: @#$%^&*()');
    expect(output).not.toContain('[プロジェクト:');
  });
});

describe('createTaskItemLabel', () => {
  it('sortConfigがない場合、タスク内容のみのラベルを生成する', () => {
    const task = createMockTask({
      content: 'ラベルテスト',
      projectId: 'test-project'
    });
    
    const label = createTaskItemLabel(task);
    
    expect(label).toBe('ラベルテスト');
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
    
    expect(label).toBe('');
  });

  it('長いタスク内容でも正しく処理する', () => {
    const task = createMockTask({
      content: 'これは非常に長いタスクの内容です。詳細な説明や複雑な要件が含まれています。',
      projectId: '非常に長いプロジェクト名-詳細情報付き'
    });
    
    const label = createTaskItemLabel(task);
    
    expect(label).toBe('これは非常に長いタスクの内容です。詳細な説明や複雑な要件が含まれています。');
  });
});

describe('TaskItem with sortConfig', () => {
  const mockSortConfigs: Record<string, SortConfig> = {
    priority: { criteria: 'priority', direction: 'asc' },
    dueDate: { criteria: 'dueDate', direction: 'desc' },
    createdDate: { criteria: 'createdDate', direction: 'asc' },
    alphabetical: { criteria: 'alphabetical', direction: 'asc' },
    project: { criteria: 'project', direction: 'desc' }
  };

  it('優先度ソート時に優先度情報を表示する', () => {
    const task = createMockTask({
      content: '優先度テスト',
      priority: 2
    });
    
    const { lastFrame } = render(<TaskItem task={task} sortConfig={mockSortConfigs.priority} />);
    const output = lastFrame();
    
    expect(output).toContain('優先度テスト [優先度2]');
  });

  it('優先度ソート時に優先度がない場合「優先度なし」を表示する', () => {
    const task = createMockTask({
      content: '優先度なしテスト',
      priority: 0
    });
    
    const { lastFrame } = render(<TaskItem task={task} sortConfig={mockSortConfigs.priority} />);
    const output = lastFrame();
    
    expect(output).toContain('優先度なしテスト [優先度なし]');
  });

  it('期限ソート時に期限情報を表示する', () => {
    const task = createMockTask({
      content: '期限テスト',
      due: { date: '2024-12-31', isRecurring: false, lang: 'ja', string: '12月31日' }
    });
    
    const { lastFrame } = render(<TaskItem task={task} sortConfig={mockSortConfigs.dueDate} />);
    const output = lastFrame();
    
    expect(output).toContain('期限テスト [期限: 2024-12-31]');
  });

  it('期限ソート時に期限がない場合「期限なし」を表示する', () => {
    const task = createMockTask({
      content: '期限なしテスト',
      due: null
    });
    
    const { lastFrame } = render(<TaskItem task={task} sortConfig={mockSortConfigs.dueDate} />);
    const output = lastFrame();
    
    expect(output).toContain('期限なしテスト [期限なし]');
  });

  it('作成日ソート時に作成日情報を表示する', () => {
    const task = createMockTask({
      content: '作成日テスト',
      addedAt: '2024-06-15T10:30:00Z'
    });
    
    const { lastFrame } = render(<TaskItem task={task} sortConfig={mockSortConfigs.createdDate} />);
    const output = lastFrame();
    
    expect(output).toContain('作成日テスト [作成: 2024/6/15]');
  });

  it('作成日ソート時に作成日がない場合「作成日不明」を表示する', () => {
    const task = createMockTask({
      content: '作成日不明テスト',
      addedAt: ''
    });
    
    const { lastFrame } = render(<TaskItem task={task} sortConfig={mockSortConfigs.createdDate} />);
    const output = lastFrame();
    
    expect(output).toContain('作成日不明テスト [作成日不明]');
  });

  it('アルファベット順ソート時は基本表示のみ', () => {
    const task = createMockTask({
      content: 'アルファベット順テスト',
      projectId: 'test-project'
    });
    
    const { lastFrame } = render(<TaskItem task={task} sortConfig={mockSortConfigs.alphabetical} />);
    const output = lastFrame();
    
    expect(output).toContain('アルファベット順テスト');
    expect(output).not.toContain('[');
  });

  it('プロジェクトソート時にプロジェクト情報を表示する', () => {
    const task = createMockTask({
      content: 'プロジェクトテスト',
      projectId: 'my-project-123'
    });
    
    const { lastFrame } = render(<TaskItem task={task} sortConfig={mockSortConfigs.project} />);
    const output = lastFrame();
    
    expect(output).toContain('プロジェクトテスト [プロジェクト: my-project-123]');
  });

  it('プロジェクトソート時にプロジェクトがない場合「プロジェクトなし」を表示する', () => {
    const task = createMockTask({
      content: 'プロジェクトなしテスト',
      projectId: ''
    });
    
    const { lastFrame } = render(<TaskItem task={task} sortConfig={mockSortConfigs.project} />);
    const output = lastFrame();
    
    expect(output).toContain('プロジェクトなしテスト [プロジェクトなし]');
  });

  it('sortConfigがundefinedの場合は基本表示のみ', () => {
    const task = createMockTask({
      content: '基本表示テスト',
      projectId: 'test-project',
      priority: 3
    });
    
    const { lastFrame } = render(<TaskItem task={task} sortConfig={undefined} />);
    const output = lastFrame();
    
    expect(output).toContain('基本表示テスト');
    expect(output).not.toContain('[');
  });
});

describe('createTaskItemLabel with sortConfig', () => {
  const mockSortConfigs: Record<string, SortConfig> = {
    priority: { criteria: 'priority', direction: 'asc' },
    dueDate: { criteria: 'dueDate', direction: 'desc' },
    createdDate: { criteria: 'createdDate', direction: 'asc' },
    alphabetical: { criteria: 'alphabetical', direction: 'asc' },
    project: { criteria: 'project', direction: 'desc' }
  };

  it('優先度ソート設定で適切なラベルを生成する', () => {
    const task = createMockTask({
      content: '優先度ラベルテスト',
      priority: 4
    });
    
    const label = createTaskItemLabel(task, mockSortConfigs.priority);
    
    expect(label).toBe('優先度ラベルテスト [優先度4]');
  });

  it('期限ソート設定で適切なラベルを生成する', () => {
    const task = createMockTask({
      content: '期限ラベルテスト',
      due: { date: '2024-01-15', isRecurring: false, lang: 'ja', string: '1月15日' }
    });
    
    const label = createTaskItemLabel(task, mockSortConfigs.dueDate);
    
    expect(label).toBe('期限ラベルテスト [期限: 2024-01-15]');
  });

  it('作成日ソート設定で適切なラベルを生成する', () => {
    const task = createMockTask({
      content: '作成日ラベルテスト',
      addedAt: '2023-12-25T00:00:00Z'
    });
    
    const label = createTaskItemLabel(task, mockSortConfigs.createdDate);
    
    expect(label).toBe('作成日ラベルテスト [作成: 2023/12/25]');
  });

  it('アルファベット順ソート設定では基本ラベルのみ生成する', () => {
    const task = createMockTask({
      content: 'アルファベット順ラベルテスト',
      projectId: 'some-project',
      priority: 2
    });
    
    const label = createTaskItemLabel(task, mockSortConfigs.alphabetical);
    
    expect(label).toBe('アルファベット順ラベルテスト');
  });

  it('プロジェクトソート設定で適切なラベルを生成する', () => {
    const task = createMockTask({
      content: 'プロジェクトラベルテスト',
      projectId: 'project-xyz'
    });
    
    const label = createTaskItemLabel(task, mockSortConfigs.project);
    
    expect(label).toBe('プロジェクトラベルテスト [プロジェクト: project-xyz]');
  });

  it('sortConfigがundefinedの場合は基本ラベルのみ生成する', () => {
    const task = createMockTask({
      content: '基本ラベルテスト',
      projectId: 'test-project',
      priority: 1
    });
    
    const label = createTaskItemLabel(task, undefined);
    
    expect(label).toBe('基本ラベルテスト');
  });

  it('複数の情報を持つタスクでも正しくソート条件に応じたラベルを生成する', () => {
    const task = createMockTask({
      content: '複合情報テスト',
      projectId: 'multi-info-project',
      priority: 3,
      due: { date: '2024-03-20', isRecurring: false, lang: 'ja', string: '3月20日' },
      addedAt: '2024-01-10T08:00:00Z'
    });
    
    // 優先度ソートの場合
    expect(createTaskItemLabel(task, mockSortConfigs.priority))
      .toBe('複合情報テスト [優先度3]');
    
    // 期限ソートの場合
    expect(createTaskItemLabel(task, mockSortConfigs.dueDate))
      .toBe('複合情報テスト [期限: 2024-03-20]');
    
    // 作成日ソートの場合
    expect(createTaskItemLabel(task, mockSortConfigs.createdDate))
      .toBe('複合情報テスト [作成: 2024/1/10]');
    
    // プロジェクトソートの場合
    expect(createTaskItemLabel(task, mockSortConfigs.project))
      .toBe('複合情報テスト [プロジェクト: multi-info-project]');
    
    // アルファベット順ソートの場合
    expect(createTaskItemLabel(task, mockSortConfigs.alphabetical))
      .toBe('複合情報テスト');
  });
});

describe('getTaskDisplayInfo function', () => {
  const mockSortConfigs: Record<string, SortConfig> = {
    priority: { criteria: 'priority', direction: 'asc' },
    dueDate: { criteria: 'dueDate', direction: 'desc' },
    createdDate: { criteria: 'createdDate', direction: 'asc' },
    alphabetical: { criteria: 'alphabetical', direction: 'asc' },
    project: { criteria: 'project', direction: 'desc' }
  };

  it('sortConfigがない場合は基本コンテンツのみ返す', () => {
    const task = createMockTask({
      content: '基本テスト',
      priority: 3,
      projectId: 'test-project'
    });
    
    const result = createTaskItemLabel(task, undefined);
    
    expect(result).toBe('基本テスト');
  });

  it('優先度ソート設定で正しい表示情報を生成する', () => {
    const taskWithPriority = createMockTask({
      content: '優先度テスト',
      priority: 2
    });
    
    const result = createTaskItemLabel(taskWithPriority, mockSortConfigs.priority);
    
    expect(result).toBe('優先度テスト [優先度2]');
  });

  it('優先度が0の場合は「優先度なし」と表示する', () => {
    const taskNoPriority = createMockTask({
      content: '優先度なしテスト',
      priority: 0
    });
    
    const result = createTaskItemLabel(taskNoPriority, mockSortConfigs.priority);
    
    expect(result).toBe('優先度なしテスト [優先度なし]');
  });

  it('期限ソート設定で正しい表示情報を生成する', () => {
    const taskWithDue = createMockTask({
      content: '期限テスト',
      due: { date: '2024-08-15', isRecurring: false, lang: 'ja', string: '8月15日' }
    });
    
    const result = createTaskItemLabel(taskWithDue, mockSortConfigs.dueDate);
    
    expect(result).toBe('期限テスト [期限: 2024-08-15]');
  });

  it('期限がない場合は「期限なし」と表示する', () => {
    const taskNoDue = createMockTask({
      content: '期限なしテスト',
      due: null
    });
    
    const result = createTaskItemLabel(taskNoDue, mockSortConfigs.dueDate);
    
    expect(result).toBe('期限なしテスト [期限なし]');
  });

  it('作成日ソート設定で正しい表示情報を生成する', () => {
    const taskWithCreated = createMockTask({
      content: '作成日テスト',
      addedAt: '2024-02-29T12:00:00Z'
    });
    
    const result = createTaskItemLabel(taskWithCreated, mockSortConfigs.createdDate);
    
    expect(result).toBe('作成日テスト [作成: 2024/2/29]');
  });

  it('作成日がない場合は「作成日不明」と表示する', () => {
    const taskNoCreated = createMockTask({
      content: '作成日不明テスト',
      addedAt: ''
    });
    
    const result = createTaskItemLabel(taskNoCreated, mockSortConfigs.createdDate);
    
    expect(result).toBe('作成日不明テスト [作成日不明]');
  });

  it('アルファベット順ソート設定では基本コンテンツのみ返す', () => {
    const task = createMockTask({
      content: 'アルファベット順テスト',
      priority: 4,
      projectId: 'some-project',
      due: { date: '2024-12-25', isRecurring: false, lang: 'ja', string: '12月25日' }
    });
    
    const result = createTaskItemLabel(task, mockSortConfigs.alphabetical);
    
    expect(result).toBe('アルファベット順テスト');
  });

  it('プロジェクトソート設定で正しい表示情報を生成する', () => {
    const taskWithProject = createMockTask({
      content: 'プロジェクトテスト',
      projectId: 'my-special-project'
    });
    
    const result = createTaskItemLabel(taskWithProject, mockSortConfigs.project);
    
    expect(result).toBe('プロジェクトテスト [プロジェクト: my-special-project]');
  });

  it('プロジェクトIDがない場合は「プロジェクトなし」と表示する', () => {
    const taskNoProject = createMockTask({
      content: 'プロジェクトなしテスト',
      projectId: ''
    });
    
    const result = createTaskItemLabel(taskNoProject, mockSortConfigs.project);
    
    expect(result).toBe('プロジェクトなしテスト [プロジェクトなし]');
  });

  it('不正なソート条件の場合は基本コンテンツのみ返す', () => {
    const task = createMockTask({
      content: '不正ソート条件テスト',
      priority: 2
    });
    
    const invalidSortConfig: SortConfig = {
      criteria: 'invalid' as any,
      direction: 'asc'
    };
    
    const result = createTaskItemLabel(task, invalidSortConfig);
    
    expect(result).toBe('不正ソート条件テスト');
  });

  it('空のコンテンツでも正しく処理する', () => {
    const emptyTask = createMockTask({
      content: '',
      priority: 1
    });
    
    const result = createTaskItemLabel(emptyTask, mockSortConfigs.priority);
    
    expect(result).toBe(' [優先度1]');
  });

  it('特殊文字を含むコンテンツでも正しく処理する', () => {
    const specialTask = createMockTask({
      content: '特殊文字テスト: @#$%^&*()[]{}|\\`~',
      due: { date: '2024-11-11', isRecurring: false, lang: 'ja', string: '11月11日' }
    });
    
    const result = createTaskItemLabel(specialTask, mockSortConfigs.dueDate);
    
    expect(result).toBe('特殊文字テスト: @#$%^&*()[]{}|\\`~ [期限: 2024-11-11]');
  });
});