# Data Fundamentals

From `packages/shared/prisma/schema.prisma`:

- `User` model with unique `email`, `password`, optional `name`, timestamps.
- `Todo` model with `title`, optional `description`, `completed`, optional `priority`, optional `dueDate`, `aiGenerated`, optional `groupId`, timestamps.
- `Todo.userId` references `User.id` with cascade delete.
- `Group` model with `name`, `userId`, timestamps.
- `Group.userId` references `User.id` with cascade delete.
- `Todo.groupId` references `Group.id` with `onDelete: SetNull`.
- Unique group name per user is enforced with `@@unique([userId, name])`.
