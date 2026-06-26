# CLAUDE.md

`@ducat-unit/runestone` — a fork of the Magic Eden runestone library providing
Runes encoding/decoding for DUCAT's on-chain accounting of the UNIT and DUCAT
assets. It is consumed by `core-ts`.

This repository is a git submodule of the **ducat-infra** superproject (the
local DUCAT regtest stack). DUCAT is a Bitcoin-native protocol for
collateralized borrowing using vaults, guardians, and oracles.

## Working here

- Build, run, and test commands live in [README.md](README.md) and the
  `package.json` scripts.
- This package is published as `@ducat-unit/runestone` and consumed by other
  DUCAT TypeScript packages; rebuild `dist/` after editing. See the
  `ducat-infra` superproject's `AGENTS.md` and `dev/docs/RELEASE.md` for the
  monorepo build and release flow.

## Conventions

This is a fork — preserve upstream structure where practical. For DUCAT-local
additions follow the TypeScript house style: `snake_case` functions/variables,
`PascalCase` types, ESM, named exports. Keep changes scoped to this submodule
and commit them here before bumping the pointer in `ducat-infra`.
