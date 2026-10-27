import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDocFromServer, getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const ADMIN_EMAIL = 'levi@coto.lat';
export const ADMIN_DOMAIN = 'coto.lat';
export const AUTHORIZED_ADMIN_EMAILS = ['levi@coto.lat', 'daniel@coto.lat'] as const;

export function isAuthorizedAdminUser(
  user: { email?: string | null; emailVerified?: boolean } | null
): boolean {
  if (!user || user.emailVerified !== true || typeof user.email !== 'string') {
    return false;
  }
  const normalized = user.email.trim().toLowerCase();
  if (normalized.length < 10 || normalized.length > 254) {
    return false;
  }
  return (
    (AUTHORIZED_ADMIN_EMAILS as readonly string[]).includes(normalized) ||
    /^[a-z0-9._%+-]+@coto\.lat$/.test(normalized)
  );
}

// Verbatim schema constraints synced with firebase-blueprint.json & firestore.rules
export const EVALUATION_SCHEMA_LIMITS = {
  folioMin: 12,
  folioMax: 16,
  folioPattern: /^CTPV-[0-9]{2}-[0-9]{4}$/,
  idPattern: /^[a-zA-Z0-9_-]+$/,
  nombreAliasMin: 2,
  nombreAliasMax: 120,
  rolPrincipalMin: 2,
  rolPrincipalMax: 120,
  enlaceReferenciaMin: 2,
  enlaceReferenciaMax: 300,
  preocupacionMax: 1500,
  adminNotesMax: 1000,
  recipientOrg: 'coto_privado' as const,
};

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}

void testConnection();
