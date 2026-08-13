# Phase 1 compatibility record

Accepted: 10 August 2026

This records the implemented Phase 1 vertical slice. It supplements rather than
rewrites the historical states in [BASELINE.md](BASELINE.md).

## Accepted application combination

| Component | Version/build | Commit | Role in this tranche |
| --- | --- | --- | --- |
| EDIT950 | 1.8.17 (34) | `ec154fe496a9a9f7872b83f28945abe399a06776` | Sole IMG writer and focused-export owner |
| FIND950 | 0.2.0 (2) | `d79581405a52fa5c0274872cfe58a5ed9f1f031e` | Read-only discovery and structured EDIT950 handoff |
| PLAY950 | unchanged from baseline | `64f118dfa4472fb89de400f107ada19c47444a1e` | Existing play/recall integration only; no Phase 1 changes |

- 950TOOLS protocol: v1, using the durable
  `com.e45recordings.akai-tools.request` UTI and `.akaitoolsrequest` extension.
- FIND950 locates EDIT950 using both the preferred
  `com.e45recordings.EDIT950` product identity and the installed legacy
  `com.local.AKAIImageManager` bundle identity.
- AKAI Util: 4.6.7. The accepted upstream archive SHA-256 is
  `b9b72f7af0a40ec8021bfe23c16bd2c1f17dc80308be5e1249d4d7dac94fdb49`.
  EDIT950's bundled helper is Universal arm64/x86_64; FIND950 is structurally
  read-only and launches its helper only with `-r`.

## Protocol-v1 clarification delivered with Phase 1

Focused export uses a bounded JSON request document, never a command file. The
request names a sibling absolute response path and bounded expiry. EDIT950 writes
accepted and terminal responses atomically; FIND950 waits at most ten
seconds for acknowledgement and cleans the request directory after a terminal
response, error, cancellation or expiry.

Requests are limited to 65,536 bytes and 128 observed dependencies. Protocol v1
now fixes its path, source-size, native-index, string, UUID, timestamp and
lowercase SHA-256 bounds. A completed `aim.export-program` response is required
to contain typed destination, resolved native identity, dependency, backup,
verification and warning evidence.

## Golden fixture evidence

- A private native IMG fixture was used for compatibility testing and is not
  distributed with the public repositories.
- The source SHA-256 was unchanged before and after every test.
- The test selected one P9 and its EDIT950-authoritative S9 dependency by native
  directory identity.
- The disposable destination contained exactly that P9/S9 pair, and native
  re-export bytes matched the staged source bytes.

The regression deliberately supplied a stale observed dependency. EDIT950 reported
the discrepancy, ignored it as write authority and used the current P9 closure.
A changed complete source fingerprint was rejected. Unsupported v2 and
malformed, oversized, ambiguous and path-invalid requests produced structured
rejections without changing an IMG.

Normalized P9/S9 collisions, source/destination symlink aliasing, insufficient
free bytes and insufficient directory entries were rejected during read-only
preflight with the destination hash unchanged. An injected failure after the
first import restored the existing destination byte-for-byte. A successful
existing-image export created a separately byte-verified backup with the same
pre-operation hash.

## Verification record

Platform: Apple silicon (`arm64`), macOS 26.5.2 (25F84), Apple Swift 6.3.3.

### 950TOOLS

- `npm install` — dependencies already current; audit reported zero
  vulnerabilities.
- `./scripts/validate-contracts.sh` — passed all seven schemas and three example
  messages.

### EDIT950

- `./Scripts/run-tests.sh` — 62 passed, 0 failed.
- `./Scripts/run-integration.sh` — passed the disposable formatted-IMG native
  import/export round trip.
- `./Scripts/run-interaction-regression.sh` — passed the full rendered S950
  interaction regression.
- `./Scripts/run-focused-export-regression.sh` — passed the production Library
  request-builder to production EDIT950 vertical slice and all Phase 1 failure
  scenarios described above.
- `./Scripts/build-release.sh` — produced a Universal arm64/x86_64 EDIT950 bundle;
  Info.plist, embedded helper architecture and strict deep code-sign checks
  passed.

### FIND950

- `swift test` — 9 passed, 0 failed, including deterministic production request
  construction, terminal acknowledgement/cleanup and central read-only AKAI
  Util enforcement.
- `./Scripts/install-browser-app.sh` — release build and installation passed.
- `/Applications/FIND950.app` — executable present and executable;
  Info.plist valid; identifier `com.e45recordings.FIND950`; version
  0.2.0; build 2; arm64 Mach-O; strict deep ad-hoc code signature valid; Spotlight
  metadata and LaunchServices both resolve the same identifier and executable.

## Remaining limitations

- PLAY950's typed, targetable acknowledgement protocol is Phase 2. Phase 1 did
  not change PLAY950; the optional post-export action uses the existing
  integration and is not claimed as a Phase 2 completion.
- Focused export currently requires an existing destination to expose exactly
  one S950 volume.
- Physical S950/Gotek media round-trip testing, Developer ID signing,
  notarization and clean-machine release acceptance remain later roadmap gates.
- EDIT950 retains its legacy installed bundle identifier for compatibility; durable
  identifier alignment remains a Phase 6 release task.
