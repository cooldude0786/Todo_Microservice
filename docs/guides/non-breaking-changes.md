# Non-Breaking Change Rules

Use this guide when extending existing features without conflicting with current data or API consumers.

## Core Rule

- Prefer additive changes over destructive changes.
- Existing behavior must keep working unless an intentional breaking change is approved.

## Data Model Rules

- Add new tables/models instead of repurposing unrelated existing ones.
- Add new nullable/optional columns for new relationships or attributes.
- Do not rename or remove existing columns in the same change where new behavior is introduced.
- Preserve existing records by ensuring new fields have safe defaults or `null` compatibility.

## API Contract Rules

- Keep existing endpoint paths and default response shapes stable.
- Add new behavior through:
  - new endpoints, or
  - optional request fields/query params
- Validate ownership and auth scope for any new relation fields.

## Frontend Integration Rules

- Keep current views/flows functional with old data.
- Add new UI paths as opt-in (new views, toggles, selectors) rather than replacing existing flows immediately.
- Handle missing new fields gracefully in UI rendering.

## Task Grouping Pattern (Current Use Case)

- Add `Group` as a new model.
- Add optional `groupId` relation on `Todo`.
- Keep `GET /api/todos` flat list behavior unchanged by default.
- Add grouped rendering as an additional UI mode, not a replacement of the existing list.

## Documentation Rule

- Update implemented-state docs in `docs/ssot/` after the feature is live.
- Keep this guide aligned with actual implementation practice.
