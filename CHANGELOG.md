# CHANGELOG

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
