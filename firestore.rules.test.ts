/**
 * Phase 0 / Phase 5 Security Rules Verification Specification
 * Validates all "Dirty Dozen" adversarial payloads against Coto Privado's Zero-Trust invariants.
 */

export interface DirtyDozenCase {
  id: number;
  name: string;
  operation: 'create' | 'get' | 'list' | 'update' | 'delete';
  path: string;
  auth: { uid: string; email?: string; email_verified?: boolean } | null;
  payload?: Record<string, unknown>;
  expectedOutcome: 'PERMISSION_DENIED';
}

const VALID_BASE_PAYLOAD = {
  folio: 'CP-26-4821',
  nombreAlias: 'Martín V.',
  rolPrincipal: 'Fundador Tecnológico',
  enlaceReferencia: 'https://coto.lat',
  modoOperacion: 'equipo',
  preocupacionReciente: 'Delegación de accesos críticos a agencia externa.',
  tierSugerido: 'Tier 2: Atlas',
  status: 'pendiente',
  adminNotes: '',
  recipientOrg: 'coto_privado',
  createdAt: 'REQUEST_TIME',
  updatedAt: 'REQUEST_TIME',
};

export const DIRTY_DOZEN_PAYLOADS: DirtyDozenCase[] = [
  {
    id: 1,
    name: 'Shadow Create with Ghost Field (isAdmin: true)',
    operation: 'create',
    path: '/evaluations/eval_valid_001',
    auth: null,
    payload: { ...VALID_BASE_PAYLOAD, isAdmin: true },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 2,
    name: 'Email Spoofing Attack (levi@coto.lat with email_verified: false)',
    operation: 'get',
    path: '/evaluations/eval_valid_001',
    auth: { uid: 'spoof_uid', email: 'levi@coto.lat', email_verified: false },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 3,
    name: 'Unauthorized Authenticated List Query',
    operation: 'list',
    path: '/evaluations',
    auth: { uid: 'other_uid', email: 'intruder@example.com', email_verified: true },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 4,
    name: 'Pre-Escalated Status on Create',
    operation: 'create',
    path: '/evaluations/eval_valid_002',
    auth: null,
    payload: { ...VALID_BASE_PAYLOAD, status: 'cerrado' },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 5,
    name: 'Forged Past Timestamp on Create',
    operation: 'create',
    path: '/evaluations/eval_valid_003',
    auth: null,
    payload: { ...VALID_BASE_PAYLOAD, createdAt: '2020-01-01T00:00:00Z' },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 6,
    name: 'Denial-of-Wallet Oversized String (> 1500 chars)',
    operation: 'create',
    path: '/evaluations/eval_valid_004',
    auth: null,
    payload: { ...VALID_BASE_PAYLOAD, preocupacionReciente: 'A'.repeat(2000) },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 7,
    name: 'ID Poisoning with Illegal Characters',
    operation: 'create',
    path: '/evaluations/bad$id!spaces',
    auth: null,
    payload: VALID_BASE_PAYLOAD,
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 8,
    name: 'Invalid Folio Pattern Injection',
    operation: 'create',
    path: '/evaluations/eval_valid_005',
    auth: null,
    payload: { ...VALID_BASE_PAYLOAD, folio: 'INVALID-99' },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 9,
    name: 'Invalid Operation Mode Enum',
    operation: 'create',
    path: '/evaluations/eval_valid_006',
    auth: null,
    payload: { ...VALID_BASE_PAYLOAD, modoOperacion: 'corporativo_masivo' },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 10,
    name: 'Immutable Prospect Field Mutation During Admin Update',
    operation: 'update',
    path: '/evaluations/eval_valid_001',
    auth: { uid: 'admin_uid', email: 'levi@coto.lat', email_verified: true },
    payload: { ...VALID_BASE_PAYLOAD, nombreAlias: 'Alterado' },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 11,
    name: 'Value Poisoning on Admin Notes (Non-String Type)',
    operation: 'update',
    path: '/evaluations/eval_valid_001',
    auth: { uid: 'admin_uid', email: 'levi@coto.lat', email_verified: true },
    payload: { ...VALID_BASE_PAYLOAD, adminNotes: 999999 },
    expectedOutcome: 'PERMISSION_DENIED',
  },
  {
    id: 12,
    name: 'Terminal State Locked Notes Edit When Status Is Cerrado',
    operation: 'update',
    path: '/evaluations/eval_closed_001',
    auth: { uid: 'admin_uid', email: 'levi@coto.lat', email_verified: true },
    payload: { ...VALID_BASE_PAYLOAD, status: 'cerrado', adminNotes: 'Intento post-cierre' },
    expectedOutcome: 'PERMISSION_DENIED',
  },
];
