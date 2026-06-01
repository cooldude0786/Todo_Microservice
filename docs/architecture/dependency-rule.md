# Dependency Rule

Allowed direction:

- `UI -> Client -> Contract -> Domain`
- `API Controller -> Service -> Domain + Data`

Disallowed:

- Sideways feature-to-feature direct coupling.
- UI importing DB/data layer.
- Controllers redefining domain invariants.
