# 950TOOLS interoperability protocol v1

Status: Phase 1 implemented for FIND950 → EDIT950 focused export.

## Version 1 document transport

The durable request-document type is
`com.e45recordings.akai-tools.request`, with filename extension
`.akaitoolsrequest`. A request document is UTF-8 JSON and is limited to 65,536
bytes. It contains data only; no field is interpreted as a shell command.

These protocol-v1 wire identifiers, the `aim.*` and `true950.*` message values,
and `openInTRUE950AfterExport` remain unchanged for compatibility. They are
legacy transport tokens, not current product display names. User-facing names
are 950TOOLS, FIND950, EDIT950 and PLAY950.

Every request that expects an operation response includes:

- `response.path`: an absolute path to a sibling response file in the caller's
  private handoff directory;
- `response.expiresAt`: the RFC 3339 expiry time for the handoff.

The sender writes the request atomically, then asks macOS to open it with the
receiver. The receiver writes each `operation.response` atomically to the
declared response path. Reading and validating a terminal `completed`, `failed`
or `rejected` response is the terminal acknowledgement. The sender then removes
the private request directory. It also removes the directory after an
acknowledgement timeout or expiry. Version 1 request lifetimes are at most 24
hours; the Phase 1 FIND950 uses 30 minutes and waits at most 10 seconds
for the initial acknowledgement.

The response path must be a non-symlink sibling of the opened request, must not
already name a directory, and is bounded to 4,096 characters. For a rejected
document, a receiver may write a structured rejection only when a bounded probe
can recover a valid UUID and safe sibling transport. It never recovers a write
path from an oversized, non-JSON or unsafe document.

## Envelope

Every request and response contains:

- `protocol`: `com.e45recordings.akai-tools`;
- `protocolVersion`: integer `1`;
- `messageType`;
- `requestID`: UUID;
- `createdAt`: RFC 3339 UTC timestamp;
- `sender`: product identifier and semantic version.

Strings use the schema bounds. Paths are absolute and no longer than 4,096
characters; volume paths are absolute and no longer than 1,024 characters;
native filenames and internal names are no longer than 64 characters. Source
sizes are 1 through 34,359,738,368 bytes, native directory indexes are 1 through
65,535, observed dependency arrays contain at most 128 entries, and request
timestamps must be valid for the unexpired transport lifetime. Source hashes
are exactly 64 lowercase hexadecimal characters.

Unknown major protocol versions and fields outside the protocol-v1 schemas are
rejected with a bounded user-facing error. Required fields must never be
inferred from shell text or a display label.

## Load content in PLAY950

Message type: `true950.load-content.request`

Required selection fields:

- canonical source IMG path;
- source SHA-256;
- volume path;
- P9 native directory index;
- P9 filename;
- internal program name when known.

The request may contain a target PLAY950 instance ID. Without one, PLAY950 may
accept only when exactly one eligible editor is registered; otherwise it rejects
the request as ambiguous and returns the available instance descriptions.

Response progression:

- `accepted`: the target editor owns the request;
- `completed`: the IMG loaded and the exact program resolved;
- `failed`: loading or resolution failed and active content was unchanged;
- `rejected`: version, identity or target validation failed before loading.

PLAY950 marks its DAW host dirty only after successful adoption of the requested
content. Native work stays off the audio thread.

## Export program through EDIT950

Message type: `aim.export-program.request`

The request identifies the source program and supplies the dependencies observed
by FIND950 for presentation and stale-index detection. EDIT950 reopens the
source and independently resolves the authoritative dependency closure.

The initial request does not authorize an overwrite. EDIT950 presents destination,
density, collision and optional PLAY950-opening choices in its own UI.

A completed response contains:

- resulting image path and SHA-256;
- resolved P9 identity;
- resolved S9 identities;
- backup path when an existing IMG changed;
- verification summary;
- warnings, including any stale-index discrepancy.

For `operationType` `aim.export-program`, these values are carried in the typed
`result` object defined by `operation-response-v1.json`: `resultingImage`,
`resolvedVolumePath`, `program`, `dependencies`, optional `backupPath`,
`verification`, and `warnings`. The verification evidence includes source and
destination hashes, byte sizes, imported-file count, exact-directory and native
byte checks, backup verification, rollback state, and confirmation that the
source stayed unchanged. An `accepted` response never means that an IMG has
been exported.

## Open exact content in EDIT950

Message type: `aim.open-content.request`

This differs from opening an IMG document: it asks EDIT950 to open the source IMG,
navigate to the volume and select the exact native entry. It does not request a
mutation.

## Content changed

Message type: `aim.content-changed.event`

After a verified mutation EDIT950 emits the old and new source fingerprints plus the
identities of added, removed, renamed or modified entries. FIND950 may
perform an incremental rescan. PLAY950 may offer a reload, but never replaces
embedded active content without an explicit user action.

## PLAY950 instance discovery

An open PLAY950 editor advertises:

- transient instance UUID;
- plug-in version;
- host name;
- optional track/context label supplied by the host;
- current source label and program, if any;
- protocol versions accepted;
- last-active timestamp.

Instance registration is transient and contains no audio or native program data.
Stale registrations expire automatically.

## Security and validation

- Requests are data, never command strings.
- Paths must be absolute, standardized and bounded in length.
- Request documents and arrays have explicit size/count limits.
- SHA-256 values are lowercase 64-character hexadecimal strings.
- Source files are reopened read-only by FIND950 and PLAY950.
- EDIT950 validates source/destination inequality and mutation authority itself.
- Temporary request documents are removed after terminal acknowledgement or a
  bounded expiry interval.
- The caller derives the request UUID deterministically from the canonical
  source identity, requested native program identity, source fingerprint and
  creation timestamp. This makes retries reproducible without reusing an ID for
  a later, distinct handoff.
