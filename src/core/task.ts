/**
 * Task domain model and business logic
 */
import { TaskId, ProjectId, TaskContent } from "./shared";

export type TaskPriority = 1 | 2 | 3 | 4;

export type TaskStatus =
  | { type: "active" }
  | { type: "completed"; completedAt: Date }
  | { type: "cancelled"; reason: string; cancelledAt: Date };

export type Task = {
  id: TaskId;
  content: TaskContent;
  projectId?: ProjectId;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
};

// Pure domain functions

export function isTaskCompleted(task: Task): boolean {
  return task.status.type === "completed";
}

export function isTaskActive(task: Task): boolean {
  return task.status.type === "active";
}

export function canCompleteTask(task: Task): boolean {
  return task.status.type === "active";
}

export function canCancelTask(task: Task): boolean {
  return task.status.type === "active";
}

export function completeTask(task: Task, now: Date): Task {
  if (!canCompleteTask(task)) {
    throw new Error(`Cannot complete task in status: ${task.status.type}`);
  }
  
  return {
    ...task,
    status: {
      type: "completed",
      completedAt: now
    },
    updatedAt: now
  };
}

export function cancelTask(task: Task, reason: string, now: Date): Task {
  if (!canCancelTask(task)) {
    throw new Error(`Cannot cancel task in status: ${task.status.type}`);
  }
  
  return {
    ...task,
    status: {
      type: "cancelled",
      reason,
      cancelledAt: now
    },
    updatedAt: now
  };
}

export function updateTaskContent(task: Task, newContent: TaskContent, now: Date): Task {
  return {
    ...task,
    content: newContent,
    updatedAt: now
  };
}

export function updateTaskPriority(task: Task, newPriority: TaskPriority, now: Date): Task {
  return {
    ...task,
    priority: newPriority,
    updatedAt: now
  };
}

export function createTask(
  id: TaskId,
  content: TaskContent,
  priority: TaskPriority = 1,
  projectId?: ProjectId,
  now: Date = new Date()
): Task {
  return {
    id,
    content,
    projectId,
    priority,
    status: { type: "active" },
    createdAt: now,
    updatedAt: now
  };
}

if (import.meta.vitest) {
  const { test, expect } = import.meta.vitest;
  
  test("createTask creates active task with defaults", () => {
    const now = new Date();
    const task = createTask(
      TaskId("task-1"),
      TaskContent("Buy milk"),
      1,
      undefined,
      now
    );
    
    expect(task.id).toBe(TaskId("task-1"));
    expect(task.content).toBe(TaskContent("Buy milk"));
    expect(task.priority).toBe(1);
    expect(task.status.type).toBe("active");
    expect(task.createdAt).toBe(now);
  });

  test("completeTask changes status to completed", () => {
    const now = new Date();
    const task = createTask(TaskId("task-1"), TaskContent("Buy milk"), 1, undefined, now);
    const completedTask = completeTask(task, now);
    
    expect(completedTask.status.type).toBe("completed");
    expect(isTaskCompleted(completedTask)).toBe(true);
    expect(completedTask.updatedAt).toBe(now);
  });

  test("completeTask throws for already completed task", () => {
    const now = new Date();
    const task = createTask(TaskId("task-1"), TaskContent("Buy milk"), 1, undefined, now);
    const completedTask = completeTask(task, now);
    
    expect(() => completeTask(completedTask, now)).toThrow();
  });

  test("cancelTask changes status to cancelled", () => {
    const now = new Date();
    const task = createTask(TaskId("task-1"), TaskContent("Buy milk"), 1, undefined, now);
    const cancelledTask = cancelTask(task, "Not needed anymore", now);
    
    expect(cancelledTask.status.type).toBe("cancelled");
    if (cancelledTask.status.type === "cancelled") {
      expect(cancelledTask.status.reason).toBe("Not needed anymore");
    }
  });

  test("canCompleteTask returns true for active tasks", () => {
    const task = createTask(TaskId("task-1"), TaskContent("Buy milk"));
    expect(canCompleteTask(task)).toBe(true);
  });

  test("canCompleteTask returns false for completed tasks", () => {
    const now = new Date();
    const task = createTask(TaskId("task-1"), TaskContent("Buy milk"), 1, undefined, now);
    const completedTask = completeTask(task, now);
    expect(canCompleteTask(completedTask)).toBe(false);
  });
}