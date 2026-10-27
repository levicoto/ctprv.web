import { useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { Download, Loader2, Lock, LogOut, ShieldCheck, Trash2, X } from 'lucide-react';
import {
  ADMIN_DOMAIN,
  auth,
  db,
  EVALUATION_SCHEMA_LIMITS,
  googleProvider,
  handleFirestoreError,
  isAuthorizedAdminUser,
  OperationType,
} from '../lib/firebase';
import { useI18n } from '../lib/i18n';

export type EvaluationStatus = 'pendiente' | 'en_revision' | 'contactado' | 'cerrado';

interface StoredEvaluation {
  id: string;
  folio: string;
  nombreAlias: string;
  rolPrincipal: string;
  enlaceReferencia: string;
  modoOperacion: 'solo' | 'equipo';
  preocupacionReciente: string;
  tierSugerido: 'Tier 1: Argos' | 'Tier 2: Atlas' | 'Palantir Raptor';
  status: EvaluationStatus;
  adminNotes: string;
  createdAtMillis: number;
}

interface AdminInboxModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminInboxModal({ isOpen, onClose }: AdminInboxModalProps) {
  const { lang, t } = useI18n();
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [evaluations, setEvaluations] = useState<StoredEvaluation[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'todas' | EvaluationStatus>('todas');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [notesDraft, setNotesDraft] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const localeCode = lang === 'en' ? 'en-US' : lang === 'pt' ? 'pt-BR' : 'es-ES';

  const formatMillis = (millis: number) => {
    if (!millis) return t.admin.recentFallback;
    return new Date(millis).toLocaleString(localeCode, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  const isAuthorizedAdmin = isAuthorizedAdminUser(user);

  useEffect(() => {
    if (!isOpen || !authReady || !isAuthorizedAdmin) {
      setEvaluations([]);
      return;
    }

    setLoadingDocs(true);
    const q = query(
      collection(db, 'evaluations'),
      where('recipientOrg', '==', EVALUATION_SCHEMA_LIMITS.recipientOrg)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items: StoredEvaluation[] = snapshot.docs.map((docSnap) => {
          const d = docSnap.data();
          const createdTs = d.createdAt instanceof Timestamp ? d.createdAt : null;
          const millis = createdTs ? createdTs.toMillis() : 0;
          const rawFolio = String(d.folio ?? '').trim();
          const normalizedFolio = /^CTPV-/i.test(rawFolio)
            ? rawFolio
            : rawFolio.replace(/^[A-Z]{2}-(?=\d{2}-\d{4}$)/i, 'CTPV-');
          return {
            id: docSnap.id,
            folio: normalizedFolio,
            nombreAlias: String(d.nombreAlias ?? ''),
            rolPrincipal: String(d.rolPrincipal ?? ''),
            enlaceReferencia: String(d.enlaceReferencia ?? ''),
            modoOperacion: d.modoOperacion === 'equipo' ? 'equipo' : 'solo',
            preocupacionReciente: String(d.preocupacionReciente ?? ''),
            tierSugerido:
              d.tierSugerido === 'Tier 2: Atlas'
                ? 'Tier 2: Atlas'
                : d.tierSugerido === 'Palantir Raptor'
                  ? 'Palantir Raptor'
                  : 'Tier 1: Argos',
            status: (['pendiente', 'en_revision', 'contactado', 'cerrado'].includes(d.status)
              ? d.status
              : 'pendiente') as EvaluationStatus,
            adminNotes: String(d.adminNotes ?? ''),
            createdAtMillis: millis,
          };
        });

        items.sort((a, b) => b.createdAtMillis - a.createdAtMillis);
        setEvaluations(items);
        setLoadingDocs(false);
      },
      (err) => {
        setLoadingDocs(false);
        try {
          handleFirestoreError(err, OperationType.LIST, 'evaluations');
        } catch {
          setActionFeedback(t.admin.feedbackSyncError);
        }
      }
    );

    return () => unsubscribe();
  }, [isOpen, authReady, isAuthorizedAdmin, t.admin.feedbackSyncError]);

  const selectedEvaluation =
    evaluations.find((ev) => ev.id === selectedId) ?? evaluations[0] ?? null;

  useEffect(() => {
    if (selectedEvaluation) {
      setNotesDraft(selectedEvaluation.adminNotes);
      setConfirmDeleteId(null);
    }
  }, [selectedEvaluation?.id]);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      if (!msg.includes('popup-closed-by-user')) {
        setAuthError(t.admin.signInFailed);
      }
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setSelectedId(null);
  };

  const handleStatusChange = async (item: StoredEvaluation, nextStatus: EvaluationStatus) => {
    if (item.status === nextStatus) return;
    setActionFeedback(null);
    const path = `evaluations/${item.id}`;
    try {
      await updateDoc(doc(db, 'evaluations', item.id), {
        status: nextStatus,
        updatedAt: serverTimestamp(),
      });
      setActionFeedback(t.admin.feedbackStatusUpdated(t.admin.statusLabels[nextStatus]));
    } catch (err) {
      setActionFeedback(t.admin.feedbackStatusError);
      try {
        handleFirestoreError(err, OperationType.UPDATE, path);
      } catch {
        // Logged via structured handler
      }
    }
  };

  const handleSaveNotes = async (item: StoredEvaluation) => {
    if (item.status === 'cerrado') return;
    setSavingNotes(true);
    setActionFeedback(null);
    const cleanNotes = notesDraft.slice(0, EVALUATION_SCHEMA_LIMITS.adminNotesMax);
    const path = `evaluations/${item.id}`;
    try {
      await updateDoc(doc(db, 'evaluations', item.id), {
        adminNotes: cleanNotes,
        updatedAt: serverTimestamp(),
      });
      setActionFeedback(t.admin.feedbackNotesSaved);
    } catch (err) {
      setActionFeedback(t.admin.feedbackNotesError);
      try {
        handleFirestoreError(err, OperationType.UPDATE, path);
      } catch {
        // Logged via structured handler
      }
    } finally {
      setSavingNotes(false);
    }
  };

  const handleDelete = async (id: string) => {
    const path = `evaluations/${id}`;
    try {
      await deleteDoc(doc(db, 'evaluations', id));
      setConfirmDeleteId(null);
      if (selectedId === id) setSelectedId(null);
    } catch (err) {
      setActionFeedback(t.admin.feedbackDeleteError);
      try {
        handleFirestoreError(err, OperationType.DELETE, path);
      } catch {
        // Logged
      }
    }
  };

  const handleExportCsv = () => {
    if (evaluations.length === 0) return;
    const headers = [
      'Folio',
      'Date',
      'Name/Alias',
      'Role',
      'Reference',
      'Mode',
      'Tier',
      'Status',
      'Concern',
      'Admin Notes',
    ];
    const escapeCsv = (val: string) => `"${val.replace(/"/g, '""')}"`;
    const rows = evaluations.map((ev) =>
      [
        ev.folio,
        formatMillis(ev.createdAtMillis),
        ev.nombreAlias,
        ev.rolPrincipal,
        ev.enlaceReferencia,
        ev.modoOperacion === 'solo' ? t.admin.soloShort : t.admin.teamShort,
        ev.tierSugerido,
        t.admin.statusLabels[ev.status],
        ev.preocupacionReciente,
        ev.adminNotes,
      ]
        .map(escapeCsv)
        .join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CotoPrivado_Evaluations_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredEvaluations =
    statusFilter === 'todas'
      ? evaluations
      : evaluations.filter((ev) => ev.status === statusFilter);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t.admin.dialogAria}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
    >
      <div className="w-full max-w-5xl max-h-[90vh] bg-white rounded-2xl border border-zinc-200 shadow-2xl flex flex-col overflow-hidden">
        {/* Top Modal Header */}
        <div className="px-6 py-4 border-b border-zinc-200 flex items-center justify-between gap-4 bg-zinc-50/80">
          <div className="flex items-center gap-2.5 min-w-0">
            <ShieldCheck className="w-5 h-5 text-zinc-900 shrink-0" />
            <span className="font-display text-base font-semibold text-zinc-950 truncate">
              {t.admin.headerTitle}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {isAuthorizedAdmin && evaluations.length > 0 && (
              <button
                type="button"
                onClick={handleExportCsv}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-300 bg-white text-xs font-medium text-zinc-800 hover:bg-zinc-100 transition-colors whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t.admin.exportCsv}</span>
              </button>
            )}
            {user && (
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 text-xs font-medium text-zinc-600 hover:text-zinc-950 transition-colors whitespace-nowrap"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{t.admin.signOut}</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label={t.admin.closeAria}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-950 hover:bg-zinc-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {!authReady ? (
            <div className="py-20 flex flex-col items-center justify-center text-zinc-500">
              <Loader2 className="w-6 h-6 animate-spin mb-3 text-zinc-800" />
              <p className="text-sm">{t.admin.verifying}</p>
            </div>
          ) : !user ? (
            <div className="py-16 max-w-md mx-auto text-center">
              <div className="w-12 h-12 rounded-2xl bg-zinc-950 text-white flex items-center justify-center mx-auto mb-4">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-display text-xl font-semibold text-zinc-950">
                {t.admin.signInTitle}
              </h3>
              <p className="mt-2 text-sm text-zinc-600 leading-relaxed">{t.admin.signInDesc}</p>
              {authError && (
                <p className="mt-4 text-xs font-medium text-zinc-900 bg-zinc-100 border border-zinc-300 rounded-lg py-2 px-3">
                  {authError}
                </p>
              )}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="mt-6 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-zinc-950 text-white text-sm font-medium hover:bg-zinc-800 transition-colors whitespace-nowrap"
              >
                <span>{t.admin.signInBtn}</span>
              </button>
            </div>
          ) : !isAuthorizedAdmin ? (
            <div className="py-16 max-w-md mx-auto text-center">
              <h3 className="font-display text-lg font-semibold text-zinc-950">
                {t.admin.unauthorizedTitle}
              </h3>
              <p className="mt-2 text-sm text-zinc-600 leading-relaxed">
                {t.admin.unauthorizedPrefix} (<span className="text-xs font-medium">{user.email}</span>){' '}
                {t.admin.unauthorizedMiddle}{' '}
                <span className="text-xs font-semibold text-zinc-900">@{ADMIN_DOMAIN}</span>.
              </p>
              {authError && (
                <p className="mt-4 text-xs font-medium text-zinc-900 bg-zinc-100 border border-zinc-300 rounded-lg py-2 px-3">
                  {authError}
                </p>
              )}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="mt-6 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-950 text-white text-xs font-medium hover:bg-zinc-800 transition-colors whitespace-nowrap"
              >
                <span>{t.admin.switchAccountBtn}</span>
              </button>
            </div>
          ) : (
            <div>
              {/* Interactive Filter Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-zinc-200">
                <div className="flex flex-wrap items-center gap-1 p-1 rounded-xl bg-zinc-100">
                  {(
                    [
                      { id: 'todas', label: t.admin.tabs.all(evaluations.length) },
                      { id: 'pendiente', label: t.admin.tabs.pendiente },
                      { id: 'en_revision', label: t.admin.tabs.en_revision },
                      { id: 'contactado', label: t.admin.tabs.contactado },
                      { id: 'cerrado', label: t.admin.tabs.cerrado },
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setStatusFilter(tab.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 tabular-nums ${
                        statusFilter === tab.id
                          ? 'bg-white text-zinc-950 shadow-sm'
                          : 'text-zinc-600 hover:text-zinc-950'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {actionFeedback && <span className="text-xs text-zinc-600">{actionFeedback}</span>}
              </div>

              {loadingDocs ? (
                <div className="py-16 flex items-center justify-center text-zinc-500 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  {t.admin.loadingDocs}
                </div>
              ) : filteredEvaluations.length === 0 ? (
                <div className="py-16 text-center text-sm text-zinc-500">{t.admin.emptyDocs}</div>
              ) : (
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left List */}
                  <div className="lg:col-span-5 space-y-2 max-h-[52vh] overflow-y-auto pr-1">
                    {filteredEvaluations.map((ev) => {
                      const active = selectedEvaluation?.id === ev.id;
                      return (
                        <button
                          key={ev.id}
                          type="button"
                          onClick={() => setSelectedId(ev.id)}
                          className={`w-full text-left p-4 rounded-xl border transition-colors ${
                            active
                              ? 'bg-zinc-950 text-white border-zinc-950'
                              : 'bg-zinc-50/70 text-zinc-900 border-zinc-200 hover:bg-zinc-100'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 text-xs">
                            <span
                              className={`tabular-nums ${
                                active ? 'text-zinc-300' : 'text-zinc-500'
                              }`}
                            >
                              {ev.folio}
                            </span>
                            <span className={active ? 'text-zinc-300' : 'text-zinc-500'}>
                              {t.admin.statusLabels[ev.status]}
                            </span>
                          </div>
                          <div className="mt-1 text-sm font-semibold truncate">
                            {ev.nombreAlias}
                          </div>
                          <div
                            className={`mt-0.5 text-xs truncate ${
                              active ? 'text-zinc-400' : 'text-zinc-500'
                            }`}
                          >
                            {ev.rolPrincipal} · {ev.tierSugerido}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Right Selected Dossier */}
                  {selectedEvaluation && (
                    <div className="lg:col-span-7 rounded-2xl border border-zinc-200 p-6 space-y-6 bg-zinc-50/40">
                      <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-zinc-200">
                        <div>
                          <div className="text-xs text-zinc-500 tabular-nums">
                            {selectedEvaluation.folio} ·{' '}
                            {formatMillis(selectedEvaluation.createdAtMillis)}
                          </div>
                          <h4 className="mt-1 text-xl font-semibold text-zinc-950">
                            {selectedEvaluation.nombreAlias}
                          </h4>
                          <p className="text-sm text-zinc-600">{selectedEvaluation.rolPrincipal}</p>
                        </div>

                        {confirmDeleteId === selectedEvaluation.id ? (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleDelete(selectedEvaluation.id)}
                              className="px-3 py-1.5 rounded-lg bg-zinc-950 text-white text-xs font-medium whitespace-nowrap"
                            >
                              {t.admin.confirmDelete}
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-2.5 py-1.5 rounded-lg border border-zinc-300 text-xs text-zinc-600 whitespace-nowrap"
                            >
                              {t.admin.cancelDelete}
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(selectedEvaluation.id)}
                            aria-label={t.admin.deleteAria}
                            className="p-2 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-200/60 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div>
                          <dt className="text-xs text-zinc-500">{t.admin.modeAndTier}</dt>
                          <dd className="mt-1 font-medium text-zinc-900">
                            {selectedEvaluation.modoOperacion === 'solo'
                              ? t.admin.soloShort
                              : t.admin.teamShort}{' '}
                            · {selectedEvaluation.tierSugerido}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs text-zinc-500">{t.admin.refLink}</dt>
                          <dd className="mt-1 text-xs font-medium text-zinc-900 break-all">
                            {selectedEvaluation.enlaceReferencia}
                          </dd>
                        </div>
                        <div className="sm:col-span-2">
                          <dt className="text-xs text-zinc-500">{t.admin.reportedConcern}</dt>
                          <dd className="mt-1 text-zinc-800 whitespace-pre-wrap leading-relaxed">
                            {selectedEvaluation.preocupacionReciente || t.admin.noComments}
                          </dd>
                        </div>
                      </dl>

                      {/* Status Control */}
                      <div className="pt-4 border-t border-zinc-200">
                        <span className="block text-xs font-medium text-zinc-700 mb-2">
                          {t.admin.dossierStatus}
                        </span>
                        {selectedEvaluation.status === 'cerrado' ? (
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-xs text-zinc-600">{t.admin.closedLockedMsg}</span>
                            <button
                              type="button"
                              onClick={() =>
                                handleStatusChange(selectedEvaluation, 'en_revision')
                              }
                              className="px-3 py-1.5 rounded-lg border border-zinc-300 bg-white text-xs font-medium text-zinc-900 hover:bg-zinc-100 whitespace-nowrap"
                            >
                              {t.admin.reopenBtn}
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-1.5">
                            {(['pendiente', 'en_revision', 'contactado', 'cerrado'] as const).map(
                              (st) => (
                                <button
                                  key={st}
                                  type="button"
                                  onClick={() => handleStatusChange(selectedEvaluation, st)}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                                    selectedEvaluation.status === st
                                      ? 'bg-zinc-950 text-white'
                                      : 'bg-white border border-zinc-200 text-zinc-700 hover:border-zinc-400'
                                  }`}
                                >
                                  {t.admin.statusLabels[st]}
                                </button>
                              )
                            )}
                          </div>
                        )}
                      </div>

                      {/* Admin Notes */}
                      <div className="pt-4 border-t border-zinc-200">
                        <label
                          htmlFor="admin-notes-box"
                          className="block text-xs font-medium text-zinc-700"
                        >
                          {t.admin.internalNotesLabel}
                        </label>
                        <textarea
                          id="admin-notes-box"
                          rows={3}
                          disabled={selectedEvaluation.status === 'cerrado'}
                          maxLength={EVALUATION_SCHEMA_LIMITS.adminNotesMax}
                          value={notesDraft}
                          onChange={(e) => setNotesDraft(e.target.value)}
                          placeholder={t.admin.internalNotesPlaceholder}
                          className="mt-2 w-full rounded-xl bg-white px-3.5 py-2.5 text-sm text-zinc-950 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-950 disabled:bg-zinc-100 disabled:text-zinc-500"
                        />
                        {selectedEvaluation.status !== 'cerrado' && (
                          <div className="mt-2.5 flex justify-end">
                            <button
                              type="button"
                              disabled={savingNotes || notesDraft === selectedEvaluation.adminNotes}
                              onClick={() => handleSaveNotes(selectedEvaluation)}
                              className="px-4 py-2 rounded-lg bg-zinc-950 text-white text-xs font-medium hover:bg-zinc-800 disabled:opacity-40 transition-colors whitespace-nowrap"
                            >
                              {savingNotes ? t.admin.savingBtn : t.admin.saveNotesBtn}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
