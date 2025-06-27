# Todoist API TypeScript Client: API Reference

This document provides a comprehensive reference for the Todoist API TypeScript client library.

## Installation

```bash
npm install @doist/todoist-api-typescript
```

## Getting Started

First, you need to obtain an API token from the [Todoist App Management](https://todoist.com/app_console) console.

Then, you can instantiate the `TodoistApi` client:

```typescript
import { TodoistApi } from '@doist/todoist-api-typescript'

const api = new TodoistApi('YOUR_API_TOKEN')
```

---

## `TodoistApi` Class

The main entry point for interacting with the Todoist API.

### Constructor

**`new TodoistApi(authToken: string, baseUrl?: string)`**

-   `authToken`: Your Todoist API token.
-   `baseUrl` (optional): A custom base URL for the Todoist API.

---

## Tasks

### `getTask`

Retrieves a single active (non-completed) task by its ID.

-   **`getTask(id: string): Promise<Task>`**
    -   **Parameters:**
        -   `id` (string): The ID of the task.
    -   **Returns:** `Promise<Task>` - The requested task object.

### `getTasks`

Retrieves a list of active tasks.

-   **`getTasks(args?: GetTasksArgs): Promise<GetTasksResponse>`**
    -   **Parameters:**
        -   `args` (GetTasksArgs, optional):
            -   `projectId?: string`
            -   `sectionId?: string`
            -   `label?: string`
            -   `filter?: string`
            -   `lang?: string`
            -   `ids?: string[]`
            -   `limit?: number`
            -   `page?: number`
    -   **Returns:** `Promise<GetTasksResponse>` - An object containing an array of tasks and a `nextCursor` string.

### `getTasksByFilter`

Retrieves tasks filtered by a filter string.

-   **`getTasksByFilter(args: GetTasksByFilterArgs): Promise<GetTasksResponse>`**
    -   **Parameters:**
        -   `args` (GetTasksByFilterArgs):
            -   `query: string`
            -   `lang?: string`
            -   `cursor?: string | null`
            -   `limit?: number`
    -   **Returns:** `Promise<GetTasksResponse>` - An object containing an array of tasks and a `nextCursor` string.

### `addTask`

Creates a new task.

-   **`addTask(args: AddTaskArgs, requestId?: string): Promise<Task>`**
    -   **Parameters:**
        -   `args` (AddTaskArgs):
            -   `content: string`
            -   `description?: string`
            -   `projectId?: string`
            -   `sectionId?: string`
            -   `parentId?: string`
            -   `order?: number`
            -   `labels?: string[]`
            -   `priority?: number`
            -   `assigneeId?: string`
            -   `dueString?: string`
            -   `dueLang?: string`
            -   `dueDate?: string`
            -   `dueDatetime?: string`
            -   `duration?: number`
            -   `durationUnit?: 'minute' | 'day'`
        -   `requestId` (string, optional): A unique ID for the request.
    -   **Returns:** `Promise<Task>` - The newly created task object.

### `quickAddTask`

Quickly adds a task using natural language processing.

-   **`quickAddTask(args: QuickAddTaskArgs): Promise<Task>`**
    -   **Parameters:**
        -   `args` (QuickAddTaskArgs):
            -   `text: string`
            -   `note?: string`
            -   `reminder?: string`
            -   `autoReminder?: boolean`
    -   **Returns:** `Promise<Task>` - The newly created task object.

### `updateTask`

Updates an existing task.

-   **`updateTask(id: string, args: UpdateTaskArgs, requestId?: string): Promise<Task>`**
    -   **Parameters:**
        -   `id` (string): The ID of the task to update.
        -   `args` (UpdateTaskArgs):
            -   `content?: string`
            -   `description?: string`
            -   `labels?: string[]`
            -   `priority?: number`
            -   `dueString?: string`
            -   `dueLang?: string | null`
            -   `assigneeId?: string | null`
            -   `dueDate?: string`
            -   `dueDatetime?: string`
            -   `duration?: number`
            -   `durationUnit?: 'minute' | 'day'`
        -   `requestId` (string, optional): A unique ID for the request.
    -   **Returns:** `Promise<Task>` - The updated task object.

### `moveTasks`

Moves existing tasks to a different parent, section, or project.

-   **`moveTasks(ids: string[], args: MoveTaskArgs, requestId?: string): Promise<Task[]>`**
    -   **Parameters:**
        -   `ids` (string[]): An array of task IDs to move.
        -   `args` (MoveTaskArgs): Requires exactly one of `projectId`, `sectionId`, or `parentId`.
        -   `requestId` (string, optional): A unique ID for the request.
    -   **Returns:** `Promise<Task[]>` - An array of the updated task objects.

### `closeTask`

Closes (completes) a task.

-   **`closeTask(id: string, requestId?: string): Promise<boolean>`**
    -   **Parameters:**
        -   `id` (string): The ID of the task to close.
        -   `requestId` (string, optional): A unique ID for the request.
    -   **Returns:** `Promise<boolean>` - `true` if successful.

### `reopenTask`

Reopens a completed task.

-   **`reopenTask(id: string, requestId?: string): Promise<boolean>`**
    -   **Parameters:**
        -   `id` (string): The ID of the task to reopen.
        -   `requestId` (string, optional): A unique ID for the request.
    -   **Returns:** `Promise<boolean>` - `true` if successful.

### `deleteTask`

Deletes a task.

-   **`deleteTask(id: string, requestId?: string): Promise<boolean>`**
    -   **Parameters:**
        -   `id` (string): The ID of the task to delete.
        -   `requestId` (string, optional): A unique ID for the request.
    -   **Returns:** `Promise<boolean>` - `true` if successful.

---

## Projects

### `getProject`

Retrieves a single project by its ID.

-   **`getProject(id: string): Promise<PersonalProject | WorkspaceProject>`**
    -   **Parameters:**
        -   `id` (string): The ID of the project.
    -   **Returns:** `Promise<PersonalProject | WorkspaceProject>` - The requested project object.

### `getProjects`

Retrieves all projects.

-   **`getProjects(args: GetProjectsArgs = {}): Promise<GetProjectsResponse>`**
    -   **Parameters:**
        -   `args` (GetProjectsArgs, optional):
            -   `cursor?: string | null`
            -   `limit?: number`
    -   **Returns:** `Promise<GetProjectsResponse>` - An object containing an array of projects and a `nextCursor` string.

### `addProject`

Creates a new project.

-   **`addProject(args: AddProjectArgs, requestId?: string): Promise<PersonalProject | WorkspaceProject>`**
    -   **Parameters:**
        -   `args` (AddProjectArgs):
            -   `name: string`
            -   `parentId?: string`
            -   `color?: string | number`
            -   `isFavorite?: boolean`
            -   `viewStyle?: 'list' | 'board' | 'calendar'`
        -   `requestId` (string, optional): A unique ID for the request.
    -   **Returns:** `Promise<PersonalProject | WorkspaceProject>` - The newly created project object.

### `updateProject`

Updates an existing project.

-   **`updateProject(id: string, args: UpdateProjectArgs, requestId?: string): Promise<PersonalProject | WorkspaceProject>`**
    -   **Parameters:**
        -   `id` (string): The ID of the project to update.
        -   `args` (UpdateProjectArgs):
            -   `name?: string`
            -   `color?: string`
            -   `isFavorite?: boolean`
            -   `viewStyle?: 'list' | 'board' | 'calendar'`
        -   `requestId` (string, optional): A unique ID for the request.
    -   **Returns:** `Promise<PersonalProject | WorkspaceProject>` - The updated project object.

### `deleteProject`

Deletes a project.

-   **`deleteProject(id: string, requestId?: string): Promise<boolean>`**
    -   **Parameters:**
        -   `id` (string): The ID of the project to delete.
        -   `requestId` (string, optional): A unique ID for the request.
    -   **Returns:** `Promise<boolean>` - `true` if successful.

### `getProjectCollaborators`

Retrieves all collaborators for a shared project.

-   **`getProjectCollaborators(projectId: string, args: GetProjectCollaboratorsArgs = {}): Promise<GetProjectCollaboratorsResponse>`**
    -   **Parameters:**
        -   `projectId` (string): The ID of the project.
        -   `args` (GetProjectCollaboratorsArgs, optional):
            -   `cursor?: string | null`
            -   `limit?: number`
    -   **Returns:** `Promise<GetProjectCollaboratorsResponse>` - An object containing an array of users and a `nextCursor` string.

---

## Sections

### `getSection`

Retrieves a single section by its ID.

-   **`getSection(id: string): Promise<Section>`**
    -   **Parameters:**
        -   `id` (string): The ID of the section.
    -   **Returns:** `Promise<Section>` - The requested section object.

### `getSections`

Retrieves all sections.

-   **`getSections(args: GetSectionsArgs): Promise<GetSectionsResponse>`**
    -   **Parameters:**
        -   `args` (GetSectionsArgs):
            -   `projectId: string | null`
            -   `cursor?: string | null`
            -   `limit?: number`
    -   **Returns:** `Promise<GetSectionsResponse>` - An object containing an array of sections and a `nextCursor` string.

### `addSection`

Creates a new section.

-   **`addSection(args: AddSectionArgs, requestId?: string): Promise<Section>`**
    -   **Parameters:**
        -   `args` (AddSectionArgs):
            -   `name: string`
            -   `projectId: string`
            -   `order?: number | null`
        -   `requestId` (string, optional): A unique ID for the request.
    -   **Returns:** `Promise<Section>` - The newly created section object.

### `updateSection`

Updates an existing section.

-   **`updateSection(id: string, args: UpdateSectionArgs, requestId?: string): Promise<Section>`**
    -   **Parameters:**
        -   `id` (string): The ID of the section to update.
        -   `args` (UpdateSectionArgs):
            -   `name: string`
        -   `requestId` (string, optional): A unique ID for the request.
    -   **Returns:** `Promise<Section>` - The updated section object.

### `deleteSection`

Deletes a section.

-   **`deleteSection(id: string, requestId?: string): Promise<boolean>`**
    -   **Parameters:**
        -   `id` (string): The ID of the section to delete.
        -   `requestId` (string, optional): A unique ID for the request.
    -   **Returns:** `Promise<boolean>` - `true` if successful.

---

## Labels

### `getLabel`

Retrieves a single label by its ID.

-   **`getLabel(id: string): Promise<Label>`**
    -   **Parameters:**
        -   `id` (string): The ID of the label.
    -   **Returns:** `Promise<Label>` - The requested label object.

### `getLabels`

Retrieves all labels.

-   **`getLabels(args: GetLabelsArgs = {}): Promise<GetLabelsResponse>`**
    -   **Parameters:**
        -   `args` (GetLabelsArgs, optional):
            -   `cursor?: string | null`
            -   `limit?: number`
    -   **Returns:** `Promise<GetLabelsResponse>` - An object containing an array of labels and a `nextCursor` string.

### `addLabel`

Creates a new label.

-   **`addLabel(args: AddLabelArgs, requestId?: string): Promise<Label>`**
    -   **Parameters:**
        -   `args` (AddLabelArgs):
            -   `name: string`
            -   `order?: number | null`
            -   `color?: string | number`
            -   `isFavorite?: boolean`
        -   `requestId` (string, optional): A unique ID for the request.
    -   **Returns:** `Promise<Label>` - The newly created label object.

### `updateLabel`

Updates an existing label.

-   **`updateLabel(id: string, args: UpdateLabelArgs, requestId?: string): Promise<Label>`**
    -   **Parameters:**
        -   `id` (string): The ID of the label to update.
        -   `args` (UpdateLabelArgs):
            -   `name?: string`
            -   `order?: number | null`
            -   `color?: string`
            -   `isFavorite?: boolean`
        -   `requestId` (string, optional): A unique ID for the request.
    -   **Returns:** `Promise<Label>` - The updated label object.

### `deleteLabel`

Deletes a label.

-   **`deleteLabel(id: string, requestId?: string): Promise<boolean>`**
    -   **Parameters:**
        -   `id` (string): The ID of the label to delete.
        -   `requestId` (string, optional): A unique ID for the request.
    -   **Returns:** `Promise<boolean>` - `true` if successful.

### `getSharedLabels`

Retrieves a list of shared labels.

-   **`getSharedLabels(args?: GetSharedLabelsArgs): Promise<GetSharedLabelsResponse>`**
    -   **Parameters:**
        -   `args` (GetSharedLabelsArgs, optional):
            -   `omitPersonal?: boolean`
            -   `cursor?: string | null`
            -   `limit?: number`
    -   **Returns:** `Promise<GetSharedLabelsResponse>` - An object containing an array of label names and a `nextCursor` string.

### `renameSharedLabel`

Renames a shared label.

-   **`renameSharedLabel(args: RenameSharedLabelArgs): Promise<boolean>`**
    -   **Parameters:**
        -   `args` (RenameSharedLabelArgs):
            -   `name: string`
            -   `newName: string`
    -   **Returns:** `Promise<boolean>` - `true` if successful.

### `removeSharedLabel`

Removes a shared label.

-   **`removeSharedLabel(args: RemoveSharedLabelArgs): Promise<boolean>`**
    -   **Parameters:**
        -   `args` (RemoveSharedLabelArgs):
            -   `name: string`
    -   **Returns:** `Promise<boolean>` - `true` if successful.

---

## Comments

### `getComment`

Retrieves a single comment by its ID.

-   **`getComment(id: string): Promise<Comment>`**
    -   **Parameters:**
        -   `id` (string): The ID of the comment.
    -   **Returns:** `Promise<Comment>` - The requested comment object.

### `getComments`

Retrieves all comments for a task or project.

-   **`getComments(args: GetTaskCommentsArgs | GetProjectCommentsArgs): Promise<GetCommentsResponse>`**
    -   **Parameters:**
        -   `args` (GetTaskCommentsArgs | GetProjectCommentsArgs):
            -   Requires either `taskId: string` or `projectId: string`.
            -   `cursor?: string | null`
            -   `limit?: number`
    -   **Returns:** `Promise<GetCommentsResponse>` - An object containing an array of comments and a `nextCursor` string.

### `addComment`

Adds a new comment to a task or project.

-   **`addComment(args: AddCommentArgs, requestId?: string): Promise<Comment>`**
    -   **Parameters:**
        -   `args` (AddCommentArgs):
            -   `content: string`
            -   Requires either `taskId?: string` or `projectId?: string`.
            -   `attachment?: object`
        -   `requestId` (string, optional): A unique ID for the request.
    -   **Returns:** `Promise<Comment>` - The newly created comment object.

### `updateComment`

Updates an existing comment.

-   **`updateComment(id: string, args: UpdateCommentArgs, requestId?: string): Promise<Comment>`**
    -   **Parameters:**
        -   `id` (string): The ID of the comment to update.
        -   `args` (UpdateCommentArgs):
            -   `content: string`
        -   `requestId` (string, optional): A unique ID for the request.
    -   **Returns:** `Promise<Comment>` - The updated comment object.

### `deleteComment`

Deletes a comment.

-   **`deleteComment(id: string, requestId?: string): Promise<boolean>`**
    -   **Parameters:**
        -   `id` (string): The ID of the comment to delete.
        -   `requestId` (string, optional): A unique ID for the request.
    -   **Returns:** `Promise<boolean>` - `true` if successful.

---

## Authentication (OAuth2)

Functions for implementing the Todoist OAuth2 authorization flow.

### `getAuthStateParameter`

Generates a random `state` parameter to prevent CSRF attacks.

-   **`getAuthStateParameter(): string`**
    -   **Returns:** `string` - A random UUID v4 string.

### `getAuthorizationUrl`

Generates the authorization URL to redirect users to.

-   **`getAuthorizationUrl(clientId: string, permissions: Permission[], state: string, baseUrl?: string): string`**
    -   **Parameters:**
        -   `clientId` (string): Your application's client ID.
        -   `permissions` (Permission[]): An array of `Permission` strings (e.g., `'task:add'`, `'data:read_write'`).
        -   `state` (string): The value returned from `getAuthStateParameter()`.
        -   `baseUrl` (string, optional): A custom base URL for the authorization server.
    -   **Returns:** `string` - The full authorization URL.

### `getAuthToken`

Exchanges an authorization `code` for an access token.

-   **`getAuthToken(args: AuthTokenRequestArgs, baseUrl?: string): Promise<AuthTokenResponse>`**
    -   **Parameters:**
        -   `args` (AuthTokenRequestArgs):
            -   `clientId: string`
            -   `clientSecret: string`
            -   `code: string`
        -   `baseUrl` (string, optional): A custom base URL.
    -   **Returns:** `Promise<AuthTokenResponse>` - An object containing the `accessToken` and `tokenType`.

### `revokeAuthToken`

Revokes an access token.

-   **`revokeAuthToken(args: RevokeAuthTokenRequestArgs, baseUrl?: string): Promise<boolean>`**
    -   **Parameters:**
        -   `args` (RevokeAuthTokenRequestArgs):
            -   `clientId: string`
            -   `clientSecret: string`
            -   `accessToken: string`
        -   `baseUrl` (string, optional): A custom base URL.
    -   **Returns:** `Promise<boolean>` - `true` if successful.
---

## Entity Type Definitions

This section provides detailed information about the structure of the main entity types returned by the API.

### Task

A `Task` object represents a task in Todoist.

```typescript
interface Task {
    id: string;
    userId: string;
    projectId: string;
    sectionId: string | null;
    parentId: string | null;
    addedByUid: string | null;
    assignedByUid: string | null;
    responsibleUid: string | null;
    labels: string[];
    deadline: Deadline | null;
    duration: Duration | null;
    checked: boolean;
    isDeleted: boolean;
    addedAt: string | null;
    completedAt: string | null;
    updatedAt: string | null;
    due: DueDate | null;
    priority: number;
    childOrder: number;
    content: string;
    description: string;
    noteCount: number;
    dayOrder: number;
    isCollapsed: boolean;
    url: string;
}
```

### Project

A `Project` can be either a `PersonalProject` or a `WorkspaceProject`.

#### PersonalProject

```typescript
interface PersonalProject {
    id: string;
    canAssignTasks: boolean;
    childOrder: number;
    color: string;
    createdAt: string | null;
    isArchived: boolean;
    isDeleted: boolean;
    isFavorite: boolean;
    isFrozen: boolean;
    name: string;
    updatedAt: string | null;
    viewStyle: string;
    defaultOrder: number;
    description: string;
    isCollapsed: boolean;
    isShared: boolean;
    parentId: string | null;
    inboxProject: boolean;
    url: string;
}
```

#### WorkspaceProject

```typescript
interface WorkspaceProject {
    id: string;
    canAssignTasks: boolean;
    childOrder: number;
    color: string;
    createdAt: string | null;
    isArchived: boolean;
    isDeleted: boolean;
    isFavorite: boolean;
    isFrozen: boolean;
    name: string;
    updatedAt: string | null;
    viewStyle: string;
    defaultOrder: number;
    description: string;
    isCollapsed: boolean;
    isShared: boolean;
    collaboratorRoleDefault: string;
    folderId: string | null;
    isInviteOnly: boolean | null;
    isLinkSharingEnabled: boolean;
    role: string | null;
    status: string;
    workspaceId: string;
    url: string;
}
```

### Section

A `Section` object represents a section in a Todoist project.

```typescript
interface Section {
    id: string;
    userId: string;
    projectId: string;
    addedAt: string;
    updatedAt: string;
    archivedAt: string | null;
    name: string;
    sectionOrder: number;
    isArchived: boolean;
    isDeleted: boolean;
    isCollapsed: boolean;
}
```

### Label

A `Label` object represents a label in Todoist.

```typescript
interface Label {
    id: string;
    order: number | null;
    name: string;
    color: string;
    isFavorite: boolean;
}
```

### Comment

A `Comment` object represents a comment on a task or project.

```typescript
interface Comment {
    id: string;
    projectId?: string;
    content: string;
    postedAt: string;
    fileAttachment: Attachment | null;
    postedUid: string;
    uidsToNotify: string[] | null;
    reactions: Record<string, string[]> | null;
    isDeleted: boolean;
    taskId?: string;
}
```

### User

A `User` object represents a user in Todoist.

```typescript
interface User {
    id: string;
    name: string;
    email: string;
}
```

### DueDate

A `DueDate` object represents a due date for a task.

```typescript
interface DueDate {
    isRecurring: boolean;
    string: string;
    date: string;
    datetime?: string | null;
    timezone?: string | null;
    lang?: string | null;
}
```

### Duration

A `Duration` object represents a duration for a task.

```typescript
interface Duration {
    amount: number;
    unit: 'minute' | 'day';
}
```

