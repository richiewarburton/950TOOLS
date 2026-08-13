# 950TOOLS ecosystem architecture

Status: accepted direction; Phase 1 focused export implemented.

## User workflow

```text
Archived IMG files
       |
       v
FIND950 ---- inspect/edit/export ----> EDIT950
       |                                                  |
       +--------------- play -----------------------------+
                          |
                          v
                       PLAY950
                          |
                          v
                 source-independent DAW recall
```

The primary acceptance journey is:

1. Find a program in FIND950.
2. Open the exact program in EDIT950 or send it to a chosen PLAY950 instance.
3. Edit or export through EDIT950 with verified native-media mutation.
4. Reload the result transactionally in PLAY950.
5. Save and restore the DAW project without requiring the source IMG.
6. Prepare a verified image for physical S950 or floppy-emulator media.

## Ownership boundaries

### FIND950 owns

- library folders, indexing and search;
- tags, ratings, collections and saved searches;
- read-only dependency discovery;
- read-only sample audition;
- selection of EDIT950 and PLAY950 workflow actions;
- presentation of acknowledgements returned by the receiving product.

It must not format, create, replace or otherwise mutate an IMG.

### EDIT950 owns

- IMG creation, formatting and all mutations;
- capacity, collision and dependency validation;
- complete backup, rollback and post-write verification;
- P9/S9 creation and editing;
- focused program export;
- portable native-program package creation;
- hardware-media preparation and read-back verification.

EDIT950 re-resolves source content immediately before every mutation. Information
supplied by FIND950 is a requested selection, never write authority.

### PLAY950 owns

- read-only IMG and native P9/S9 loading;
- supported S950 playback behaviour and output routing;
- live plug-in instance discovery and load acknowledgements;
- transactional content replacement away from the audio thread;
- embedding all required content in VST3 state for DAW recall.

PLAY950 never edits source media. Embedded state remains authoritative if the
source moves, changes or disappears.

## Shared contract ownership

950TOOLS owns:

- protocol envelopes and JSON Schemas;
- stable content identity rules;
- notification and application identifiers;
- compatibility and deprecation policy;
- cross-project fixtures and acceptance scenarios;
- the ecosystem release compatibility matrix.

Native S9/P9 parser implementations may remain independent. They must produce
compatible observable results for the same golden fixtures.

## Content identity

Interop messages distinguish three kinds of identity:

1. **Location:** canonical file URL/path used to access content now.
2. **Fast fingerprint:** byte size plus modification time, used to notice likely
   changes during routine scans.
3. **Durable fingerprint:** SHA-256 of the complete IMG or package, calculated
   when content crosses an application boundary or needs durable provenance.

A native item identity contains:

- durable source fingerprint;
- volume path;
- entry kind (`program` or `sample`);
- native directory index;
- normalized native filename;
- internal native name when available.

Receivers use the strongest available fields and reject ambiguity. A display
name alone is never an authoritative identity.

## Transport

Version 1 uses the registered `.akaitoolsrequest` structured document through a
macOS open-document event. Large native content is never placed in a distributed
notification. The response is an atomically replaced JSON document at the
bounded sibling path declared by the sender.

Every operation has a UUID request ID and a response lifecycle:

```text
requested -> accepted -> completed
                    \-> failed
          \-> rejected
```

Requests are written atomically to a caller-owned temporary or Application
Support location and are bounded in size. The receiver validates the schema,
version and paths before acknowledging acceptance.

## Application identities

New ecosystem identifiers should use the durable `com.e45recordings` namespace.
Existing identifiers remain recognized during migration:

| Product | Preferred identifier | Legacy identifier |
| --- | --- | --- |
| FIND950 | `com.e45recordings.FIND950` | `com.e45recordings.S950LibraryManager`, `com.e45recordings.S950LibraryBrowser` |
| EDIT950 | `com.e45recordings.EDIT950` | `com.local.AKAIImageManager` |
| PLAY950 | `com.e45recordings.play950` | bundle `com.e45recordings.true950`; existing VST3 component UIDs remain stable |

The published PLAY950 VST3 component identifiers are release-stable and must
not be changed, because DAW projects use them to locate the plug-in.

## Dependency policy

Each product may bundle the helper it needs for independent installation. All
bundles must pin the same accepted AKAI Util source version and publish its
version and source hash in diagnostics. No product may execute another installed
product's private bundled helper as a runtime dependency.
