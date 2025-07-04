import { Task } from '@doist/todoist-api-typescript';

export type MockDatasetName = 
  | 'basic'
  | 'priority-showcase'
  | 'due-date-variety'
  | 'large-dataset'
  | 'empty'
  | 'project-variety'
  | 'sorting-test'
  | 'error-conditions';

const baseTask: Omit<Task, 'id' | 'content' | 'priority' | 'due' | 'projectId' | 'labels'> = {
  userId: 'mock-user',
  sectionId: null,
  parentId: null,
  addedByUid: null,
  assignedByUid: null,
  responsibleUid: null,
  deadline: null,
  duration: null,
  checked: false,
  isDeleted: false,
  addedAt: new Date().toISOString(),
  completedAt: null,
  updatedAt: null,
  childOrder: 1,
  description: '',
  noteCount: 0,
  dayOrder: 1,
  isCollapsed: false,
  url: '',
};

export const createMockTask = (overrides: Partial<Task> = {}): Task => ({
  ...baseTask,
  id: `mock-${Math.random().toString(36).substring(2, 9)}`,
  content: 'デフォルトタスク',
  priority: 1,
  projectId: 'project-inbox',
  labels: [],
  due: null,
  ...overrides,
});

export const mockDatasets: Record<MockDatasetName, Task[]> = {
  // 基本的な小さなデータセット
  basic: [
    createMockTask({
      id: 'task-1',
      content: '📧 メールの確認',
      priority: 2,
      projectId: 'project-work',
      labels: ['urgent'],
      due: { date: new Date().toISOString().split('T')[0], isRecurring: false, datetime: null, string: 'today', timezone: null },
    }),
    createMockTask({
      id: 'task-2',
      content: '📝 レポートの作成',
      priority: 3,
      projectId: 'project-work',
      description: '四半期レポートの作成と提出',
      due: { date: new Date(Date.now() + 86400000).toISOString().split('T')[0], isRecurring: false, datetime: null, string: 'tomorrow', timezone: null },
    }),
    createMockTask({
      id: 'task-3',
      content: '🛒 食材の買い物',
      priority: 1,
      projectId: 'project-personal',
      labels: ['shopping'],
    }),
    createMockTask({
      id: 'task-4',
      content: '📚 TypeScript学習',
      priority: 2,
      projectId: 'project-learning',
      labels: ['programming', 'learning'],
      due: { date: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0], isRecurring: false, datetime: null, string: 'in 3 days', timezone: null },
    }),
    createMockTask({
      id: 'task-5',
      content: '🏃‍♂️ 朝のランニング',
      priority: 1,
      projectId: 'project-health',
      labels: ['exercise', 'routine'],
      due: { date: new Date().toISOString().split('T')[0], isRecurring: true, datetime: null, string: 'daily', timezone: null },
    }),
  ],

  // 優先度の表示テスト用
  'priority-showcase': [
    createMockTask({
      id: 'p4-task',
      content: '🔴 緊急: システム障害対応',
      priority: 4,
      projectId: 'project-work',
      labels: ['urgent', 'critical'],
      due: { date: new Date().toISOString().split('T')[0], isRecurring: false, datetime: null, string: 'today', timezone: null },
    }),
    createMockTask({
      id: 'p3-task',
      content: '🟡 重要: プロジェクトミーティング',
      priority: 3,
      projectId: 'project-work',
      labels: ['meeting'],
      due: { date: new Date(Date.now() + 86400000).toISOString().split('T')[0], isRecurring: false, datetime: null, string: 'tomorrow', timezone: null },
    }),
    createMockTask({
      id: 'p2-task',
      content: '🟢 普通: 週次レビュー',
      priority: 2,
      projectId: 'project-work',
    }),
    createMockTask({
      id: 'p1-task',
      content: '⚪ 低: 本を読む',
      priority: 1,
      projectId: 'project-personal',
      labels: ['reading'],
    }),
  ],

  // 期限日のバリエーション
  'due-date-variety': [
    createMockTask({
      id: 'overdue-task',
      content: '⏰ 期限切れタスク',
      priority: 3,
      due: { date: new Date(Date.now() - 86400000).toISOString().split('T')[0], isRecurring: false, datetime: null, string: 'yesterday', timezone: null },
    }),
    createMockTask({
      id: 'today-task',
      content: '📅 今日のタスク',
      priority: 2,
      due: { date: new Date().toISOString().split('T')[0], isRecurring: false, datetime: null, string: 'today', timezone: null },
    }),
    createMockTask({
      id: 'tomorrow-task',
      content: '📆 明日のタスク',
      priority: 2,
      due: { date: new Date(Date.now() + 86400000).toISOString().split('T')[0], isRecurring: false, datetime: null, string: 'tomorrow', timezone: null },
    }),
    createMockTask({
      id: 'week-task',
      content: '📊 来週のタスク',
      priority: 1,
      due: { date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0], isRecurring: false, datetime: null, string: 'next week', timezone: null },
    }),
    createMockTask({
      id: 'no-due-task',
      content: '🔄 期限なしタスク',
      priority: 1,
      due: null,
    }),
  ],

  // 大きなデータセット（パフォーマンステスト用）
  'large-dataset': Array.from({ length: 100 }, (_, i) => createMockTask({
    id: `large-task-${i + 1}`,
    content: `📋 大規模データセット タスク ${i + 1}`,
    priority: (i % 4) + 1,
    projectId: `project-${i % 5}`,
    labels: i % 3 === 0 ? ['test', 'large'] : [],
    due: i % 5 === 0 ? { 
      date: new Date(Date.now() + (i % 10) * 86400000).toISOString().split('T')[0], 
      isRecurring: false, 
      datetime: null, 
      string: `in ${i % 10} days`, 
      timezone: null 
    } : null,
  })),

  // 空のデータセット
  empty: [],

  // プロジェクトのバリエーション
  'project-variety': [
    createMockTask({
      id: 'work-1',
      content: '💼 会議資料の準備',
      projectId: 'project-work',
      labels: ['meeting', 'preparation'],
    }),
    createMockTask({
      id: 'work-2',
      content: '📊 売上分析',
      projectId: 'project-work',
      labels: ['analysis'],
    }),
    createMockTask({
      id: 'personal-1',
      content: '🏠 家の掃除',
      projectId: 'project-personal',
      labels: ['cleaning'],
    }),
    createMockTask({
      id: 'personal-2',
      content: '🎂 誕生日プレゼント購入',
      projectId: 'project-personal',
      labels: ['shopping', 'family'],
    }),
    createMockTask({
      id: 'learning-1',
      content: '📖 React の学習',
      projectId: 'project-learning',
      labels: ['programming', 'frontend'],
    }),
    createMockTask({
      id: 'learning-2',
      content: '🎓 オンラインコース受講',
      projectId: 'project-learning',
      labels: ['course', 'certification'],
    }),
    createMockTask({
      id: 'health-1',
      content: '🏋️‍♀️ ジムでトレーニング',
      projectId: 'project-health',
      labels: ['exercise', 'fitness'],
    }),
    createMockTask({
      id: 'health-2',
      content: '🥗 健康的な食事計画',
      projectId: 'project-health',
      labels: ['nutrition', 'planning'],
    }),
  ],

  // ソート機能のテスト用
  'sorting-test': [
    createMockTask({
      id: 'sort-1',
      content: 'AAA 最初のタスク',
      priority: 1,
      due: { date: new Date(Date.now() + 86400000).toISOString().split('T')[0], isRecurring: false, datetime: null, string: 'tomorrow', timezone: null },
      projectId: 'project-b',
    }),
    createMockTask({
      id: 'sort-2',
      content: 'ZZZ 最後のタスク',
      priority: 4,
      due: { date: new Date().toISOString().split('T')[0], isRecurring: false, datetime: null, string: 'today', timezone: null },
      projectId: 'project-a',
    }),
    createMockTask({
      id: 'sort-3',
      content: 'MMM 中間のタスク',
      priority: 2,
      due: { date: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0], isRecurring: false, datetime: null, string: 'day after tomorrow', timezone: null },
      projectId: 'project-c',
    }),
    createMockTask({
      id: 'sort-4',
      content: 'BBB 期限なしタスク',
      priority: 3,
      due: null,
      projectId: 'project-a',
    }),
  ],

  // エラー条件テスト用
  'error-conditions': [
    createMockTask({
      id: 'error-task-1',
      content: '🚨 エラーを発生させるタスク',
      priority: 4,
      labels: ['error-test'],
    }),
    createMockTask({
      id: 'error-task-2',
      content: '⚠️ 警告テスト用タスク',
      priority: 3,
      labels: ['warning-test'],
    }),
  ],
};

export const getMockDataset = (name: MockDatasetName): Task[] => {
  return mockDatasets[name] || mockDatasets.basic;
};

export const getAllDatasetNames = (): MockDatasetName[] => {
  return Object.keys(mockDatasets) as MockDatasetName[];
};