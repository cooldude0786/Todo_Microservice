# Domain SSOT

Current implemented domain signals in code:

- Todo priority values used in API validation: `low`, `medium`, `high`.
- Todo title validation in API controller:
  - required
  - non-empty string
  - max length 255
- Todo description validation:
  - optional string
  - max length 1000
- Todo ownership rule:
  - todo operations are scoped to authenticated `userId`.
- Group domain signals:
  - group `name` is required, trimmed, max length 100.
  - group names are unique per user.
  - group operations are scoped to authenticated `userId`.
- Todo-to-group rule:
  - `groupId` is optional on todos (`null` means ungrouped).
  - if `groupId` is provided on create/update, it must belong to the same authenticated user.
