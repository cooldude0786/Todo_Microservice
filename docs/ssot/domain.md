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
