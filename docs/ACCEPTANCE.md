# Cross-project acceptance criteria

## Safety invariants

- FIND950 and PLAY950 leave every source IMG byte-for-byte unchanged.
- EDIT950 is the only product that creates or mutates IMG files.
- EDIT950 makes and verifies a complete backup before changing an existing IMG.
- Failed EDIT950 mutation restores the destination when rollback is available.
- A stale FIND950 index cannot cause EDIT950 to omit a dependency.
- A PLAY950 load failure leaves the currently playing content unchanged.
- PLAY950 recall succeeds with the source IMG unavailable.

## Protocol v1 scenarios

1. A known program is selected by full native identity and loaded into the only
   open PLAY950 instance.
2. Two PLAY950 editors are open; the chosen instance alone accepts the request.
3. No editor is open; the sender reports that fact instead of claiming success.
4. An unsupported protocol version is rejected clearly.
5. A display-name collision is resolved by native identity or rejected.
6. A source fingerprint changes between scan and export; EDIT950 rejects the stale
   request without mutation. If the complete fingerprint still matches but
   observed metadata or dependencies differ, EDIT950 re-resolves the current native
   closure and presents the discrepancy.
7. A focused export to a new IMG contains exactly the P9 and dependency closure.
8. Export to an existing IMG creates a complete backup and rejects collisions.
9. EDIT950 opens the exact requested volume and program rather than merely the IMG.
10. After a verified edit, FIND950 refreshes the affected IMG and
    PLAY950 offers an explicit reload.

## Hardware/media scenarios

- Low- and high-density images load on the supported physical/emulated target.
- Prepared media is read back and matches the produced IMG where supported.
- Captured media retains an untouched original plus SHA-256 provenance.
- A hardware round trip retains native P9/S9 identities and dependencies.

## Release gate

Record, for every accepted ecosystem combination:

- FIND950 version/build;
- EDIT950 version/build;
- PLAY950 version and VST3 component identity;
- protocol versions;
- AKAI Util version and source hash;
- macOS and DAW versions;
- fixture hashes;
- automated and physical-S950 acceptance results.
