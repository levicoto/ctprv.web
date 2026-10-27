# Coto Privado — Firestore Security Specification (Phase 0 TDD)

## 1. Data Invariants

1. **Global Default-Deny**: Every path outside `/evaluations/{evaluationId}` is strictly denied for both `read` and `write`.
2. **Confidential Dropbox Isolation (PII Protection)**: Prospective clients (including unauthenticated visitors using aliases) may `create` a single validated evaluation document in `/evaluations/{evaluationId}`, but **nobody** except verified Coto Privado corporate administrators (`levi@coto.lat`, `daniel@coto.lat`, or any verified `@coto.lat` account with `email_verified == true` and bounded email length `10..254`) can `get`, `list`, `update`, or `delete` any evaluation document.
3. **Strict Volumetric & Key Boundaries**: Every evaluation document must contain **exact** keys (`hasAll` and `hasOnly` of the 12 schema fields), string lengths strictly bounded to `firebase-blueprint.json` limits, and regex validation on document IDs (`^[a-zA-Z0-9_\-]+$`, max 128 chars) and `folio` (`^CTPV-[0-9]{2}-[0-9]{4}$`).
4. **Initial State Enforcement**: On `create`, `status` MUST equal `'pendiente'`, `adminNotes` MUST equal `''`, `recipientOrg` MUST equal `'coto_privado'`, and both `createdAt` and `updatedAt` MUST equal `request.time`.
5. **Action-Based Updates & Immortal Fields**: Only verified `@coto.lat` admins can `update` `/evaluations/{evaluationId}`, strictly wrapped in `isValidEvaluation(incoming())`, preserving immutable fields (`folio`, `nombreAlias`, `rolPrincipal`, `enlaceReferencia`, `modoOperacion`, `preocupacionReciente`, `tierSugerido`, `recipientOrg`, `createdAt`), enforcing `updatedAt == request.time`, and locking updates when `existing().status == 'cerrado'` except via an explicit `reopen` transition to `'en_revision'`.

## 2. The "Dirty Dozen" Payloads (All Must Return `PERMISSION_DENIED`)

1. **Ghost Field Injection (Shadow Create)**: Valid evaluation payload plus `"isAdmin": true`.
2. **Unverified Admin Email Spoof (`get` / `list`)**: Authenticated token with `email: "daniel@coto.lat"` and `email_verified: false` reading `/evaluations/eval_001`.
3. **Lookalike Domain Spoof (`list`)**: Verified user `daniel@notcoto.lat` or `daniel@coto.lat.attacker.com` querying `/evaluations`.
4. **Pre-Escalated Status on Create**: Creating `/evaluations/eval_002` with `status: "cerrado"` or non-empty `adminNotes: "approved"`.
5. **Forged Client Timestamp**: Creating `/evaluations/eval_003` with `createdAt` set to a past timestamp (`Timestamp.fromMillis(1700000000000)`) instead of `request.time`.
6. **Denial-of-Wallet Oversized String**: Creating `/evaluations/eval_004` with `preocupacionReciente` of 5,000 characters (`> 1500`).
7. **ID Poisoning Attack**: Creating `/evaluations/bad$id!with spaces` failing `isValidId()`.
8. **Invalid Folio Format**: Creating `/evaluations/eval_005` with `folio: "HACK-9999"`.
9. **Invalid Enum Injection**: Creating `/evaluations/eval_006` with `modoOperacion: "empresa_global"`.
10. **Admin Mutating Prospect Submission Content**: Verified `@coto.lat` admin attempting to modify immutable `nombreAlias` or `createdAt` during an `update`.
11. **Value Poisoning on Update**: Verified `@coto.lat` admin updating `adminNotes` with a number (`12345`) or string `> 1000` chars.
12. **Terminal State Mutation**: Verified `@coto.lat` admin attempting to edit `adminNotes` while `existing().status == 'cerrado'`.
