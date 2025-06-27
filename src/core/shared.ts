/**
 * Shared types and utilities for domain modeling
 */

declare const brand: unique symbol;

export type Brand<T, TBrand extends string> = T & {
  [brand]: TBrand;
};

// ID types
export type TaskId = Brand<string, "TaskId">;
export type ProjectId = Brand<string, "ProjectId">;
export type UserId = Brand<string, "UserId">;

// Value types
export type TaskContent = Brand<string, "TaskContent">;
export type ProjectName = Brand<string, "ProjectName">;

// Constructor functions
export const TaskId = (id: string): TaskId => id as TaskId;
export const ProjectId = (id: string): ProjectId => id as ProjectId;
export const UserId = (id: string): UserId => id as UserId;
export const TaskContent = (content: string): TaskContent => content as TaskContent;
export const ProjectName = (name: string): ProjectName => name as ProjectName;

// Type guards
export const isTaskId = (value: unknown): value is TaskId =>
  typeof value === "string" && value.length > 0;

export const isProjectId = (value: unknown): value is ProjectId =>
  typeof value === "string" && value.length > 0;

export const isTaskContent = (value: unknown): value is TaskContent =>
  typeof value === "string" && value.trim().length > 0;

export const isProjectName = (value: unknown): value is ProjectName =>
  typeof value === "string" && value.trim().length > 0;

if (import.meta.vitest) {
  const { test, expect } = import.meta.vitest;
  
  test("TaskId constructor creates branded type", () => {
    const id = TaskId("task-123");
    expect(id).toBe("task-123");
    expect(isTaskId(id)).toBe(true);
  });

  test("isTaskContent validates non-empty strings", () => {
    expect(isTaskContent(TaskContent("Buy milk"))).toBe(true);
    expect(isTaskContent("")).toBe(false);
    expect(isTaskContent("   ")).toBe(false);
    expect(isTaskContent(123)).toBe(false);
  });
}