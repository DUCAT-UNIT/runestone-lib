# CHANGELOG

## [2.0.2] - 2026-02-16

### Changed
- Replaced Node `Buffer` usage with `@vbyte/buff` across runtime encode/decode paths and tests.
- Aligned TypeScript toolchain and config with `core-ts` conventions:
  - NodeNext/ESNext project config
  - strict ESM package mode (`"type": "module"`)
  - pinned TypeScript-related dev dependency versions
- Updated internal source imports to NodeNext-compatible `.js` specifiers.
- Updated test harness to ESM-compatible Tape import style.
- Refined monad typing to remove lint warnings and tighten `None` typing.

## [2.0.1] - 2026-02-16

### Changed
- Refactored package surface to core-ts style:
  - Root `index.ts` is now export-only.
  - Added `src/index.ts` export hub.
  - Split public API logic into `src/lib/*`.
  - Split public API types into `src/types/*`.
- Added core-style packaging scripts:
  - `scripts/build.sh`
  - `scripts/package.sh`
  - `scripts/release.sh`
- Migrated linting to Biome with a new `biome.json` config.
- Removed `.prettierrc` and standardized on Biome for lint workflow.

## [2.0.0] - 2026-02-16

### Breaking
- Removed indexer and RPC exports from package entrypoint:
  - `RunestoneIndexer`, `RuneUpdater`, and related indexer/storage types
  - `Network`
  - `BitcoinRpcClient` and RPC request/response types

### Changed
- Narrowed library scope to runestone encode/decode primitives used by DUCAT services.
- Updated README to document the minimal supported API.
- Migrated test runner from Jest to Tape with a lightweight compatibility harness.
- Removed `lodash` and `@types/lodash` from devDependencies by replacing test helpers with native JS.

### Kept
- `encodeRunestone`
- `tryDecodeRunestone`
- `isRunestone`
- Types: `RunestoneSpec`, `Cenotaph`, `Flaw`
