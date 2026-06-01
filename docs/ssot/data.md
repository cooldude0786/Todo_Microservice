# Data Fundamentals

From `packages/shared/prisma/schema.prisma`:

- `User` model with unique `email`, `password`, optional `name`, timestamps.
- `Todo` model with `title`, optional `description`, `completed`, optional `priority`, optional `dueDate`, `aiGenerated`, timestamps.
- `Todo.userId` references `User.id` with cascade delete.
