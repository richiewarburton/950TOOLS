# 950TOOLS delivery roadmap

## Phase 0 — contract baseline

- [x] Record product ownership and the single IMG-writer rule.
- [x] Draft protocol v1 and machine-readable request schemas.
- [x] Define content identity and acknowledgement lifecycle.
- [x] Review protocol field names against all three implementations.
- [x] Add response, open-content, instance-discovery and content-changed schemas.
- [x] Add a schema-validation command and example messages.

Exit: all three repositories can implement protocol v1 without inventing local
field names or weakening an ownership boundary.

## Phase 1 — EDIT950 export authority

### EDIT950

- [x] Receive and validate `aim.export-program.request`.
- [x] Navigate to the requested source content.
- [x] Re-resolve P9/S9 dependencies from the current source.
- [x] Implement verified focused export to new and existing IMG destinations.
- [x] Return structured success/failure and stale-index results.

### FIND950

- [x] Replace `S950ProgramTransfer` mutation with request construction.
- [x] Keep read-only dependency discovery for preview and cross-checking.
- [x] Display EDIT950 acknowledgement and completion results.
- [x] Add compatibility errors when EDIT950 is missing or too old.

Exit met 10 August 2026: the FIND950 process always starts AKAI Util
read-only and centrally rejects every command outside its read-only allowlist.
See the [Phase 1 compatibility record](PHASE1-COMPATIBILITY.md).

## Phase 2 — dependable PLAY950 targeting

### PLAY950

- Advertise transient live editor instances.
- Validate versioned load requests.
- Resolve programs by native identity, not display name alone.
- Return accepted/completed/failed/rejected acknowledgements.
- Preserve transactional load and source-independent VST3 state behaviour.

### FIND950 and EDIT950

- Discover and select a PLAY950 target.
- Stop claiming success before an acknowledgement arrives.
- Present actionable no-instance, ambiguity and load-failure states.

Exit: two open PLAY950 instances can be targeted deterministically.

## Phase 3 — edit/reindex/reload loop

- EDIT950 opens directly at a requested volume and native entry.
- EDIT950 emits a verified content-changed event after mutation.
- FIND950 incrementally rescans the affected IMG.
- PLAY950 compares source fingerprints and offers deliberate transactional reload.
- Tags survive ordinary moves/renames through migrated stable identities.

Exit: an EDIT950 edit becomes visible elsewhere without restarting or guessing which
content changed.

## Phase 4 — portable native program package

- Specify `.s950program` structure and manifest schema.
- EDIT950 authors and validates packages.
- FIND950 indexes and tags packages.
- PLAY950 loads and embeds packages.
- Preserve native P9/S9 bytes, provenance and checksums as authority.

Exit: a program can be shared or archived independently of its floppy IMG while
remaining native and source-independent.

## Phase 5 — media and hardware workflow

- EDIT950 prepares verified 800 KB and 1.6 MB images.
- Add Gotek/HxC/removable-media destination profiles.
- Add guarded copy and read-back verification.
- Add capture workflow that preserves and fingerprints untouched source images.
- Evaluate physical-floppy adapters separately before authorizing raw writes.

Exit: software content can make a verified round trip through supported hardware
media and a physical S950.

## Phase 6 — unified release

- Align product naming, durable bundle identifiers and visual terminology.
- Publish a compatibility matrix for the three product versions.
- Run cross-project golden fixtures and end-to-end acceptance.
- Provide an ecosystem installer or clearly ordered installers.
- Complete signing, notarization and clean-machine validation.
