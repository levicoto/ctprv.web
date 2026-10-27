import { useEffect, useMemo, useRef, useState } from 'react';
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
import {
  ArrowLeft,
  ArrowUpDown,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  ExternalLink,
  Loader2,
  Lock,
  LogOut,
  Search,
  ShieldCheck,
  Trash2,
  X,
} from 'lucide-react';
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
type ServiceTier = 'Tier 1: Argos' | 'Tier 2: Atlas' | 'Palantir Raptor';

interface StoredEvaluation {
  id: string;
  folio: string;
  nombreAlias: string;
  rolPrincipal: string;
  enlaceReferencia: string;
  modoOperacion: 'solo' | 'equipo';
  preocupacionReciente: string;
  tierSugerido: ServiceTier;
  status: EvaluationStatus;
  adminNotes: string;
  createdAtMillis: number;
}

interface AdminInboxModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function getSafeExternalUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed || trimmed.startsWith('@') || /\s/.test(trimmed)) {
    return null;
  }
  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const parsed = new URL(candidate);
    if ((parsed.protocol === 'https:' || parsed.protocol === 'http:') && parsed.hostname.includes('.')) {
      return parsed.href;
    }
    return null;
  } catch {
    return null;
  }
}

function getStatusTextClass(status: EvaluationStatus): string {
  switch (status) {
    case 'pendiente':
      return 'text-amber-700';
    case 'en_revision':
      return 'text-zinc-900';
    case 'contactado':
      return 'text-emerald-700';
    case 'cerrado':
      return 'text-zinc-400';
  }
}

export default function AdminInboxModal({ isOpen, onClose }: AdminInboxModalProps) {
  const { lang, t } = useI18n();
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [evaluations, setEvaluations] = useState<StoredEvaluation[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);

  const [statusFilter, setStatusFilter] = useState<'todas' | EvaluationStatus>('todas');
  const [serviceFilter, setServiceFilter] = useState<'todas' | ServiceTier>('todas');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);

  const [notesDraft, setNotesDraft] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<'folio' | 'ref' | null>(null);

  const dossierScrollRef = useRef<HTMLDivElement | null>(null);

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

  const formatShortMillis = (millis: number) => {
    if (!millis) return t.admin.recentFallback;
    return new Date(millis).toLocaleString(localeCode, {
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

  useEffect(() => {
    if (!isOpen) {
      setMobileDetailOpen(false);
      setConfirmDeleteId(null);
      setActionFeedback(null);
    }
  }, [isOpen]);

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

  const baseFiltered = useMemo(() => {
    const needle = searchQuery.trim().toLowerCase();
    return evaluations.filter((ev) => {
      if (serviceFilter !== 'todas' && ev.tierSugerido !== serviceFilter) {
        return false;
      }
      if (!needle) return true;
      const haystack = [
        ev.folio,
        ev.nombreAlias,
        ev.rolPrincipal,
        ev.enlaceReferencia,
        ev.preocupacionReciente,
        ev.adminNotes,
        ev.tierSugerido,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [evaluations, serviceFilter, searchQuery]);

  const statusCounts = useMemo(() => {
    const counts = {
      all: baseFiltered.length,
      pendiente: 0,
      en_revision: 0,
      contactado: 0,
      cerrado: 0,
    };
    for (const ev of baseFiltered) {
      counts[ev.status] += 1;
    }
    return counts;
  }, [baseFiltered]);

  const filteredEvaluations = useMemo(() => {
    const byStatus =
      statusFilter === 'todas'
        ? baseFiltered
        : baseFiltered.filter((ev) => ev.status === statusFilter);

    const sorted = [...byStatus];
    sorted.sort((a, b) =>
      sortOrder === 'newest'
        ? b.createdAtMillis - a.createdAtMillis
        : a.createdAtMillis - b.createdAtMillis
    );
    return sorted;
  }, [baseFiltered, statusFilter, sortOrder]);

  const selectedIndex = useMemo(() => {
    if (filteredEvaluations.length === 0) return -1;
    const idx = filteredEvaluations.findIndex((ev) => ev.id === selectedId);
    return idx >= 0 ? idx : 0;
  }, [filteredEvaluations, selectedId]);

  const selectedEvaluation = selectedIndex >= 0 ? filteredEvaluations[selectedIndex] : null;

  useEffect(() => {
    if (selectedEvaluation) {
      setNotesDraft(selectedEvaluation.adminNotes);
      setConfirmDeleteId(null);
      setCopiedField(null);
    }
  }, [selectedEvaluation?.id]);

  if (!isOpen) return null;

  const hasActiveFilters =
    statusFilter !== 'todas' || serviceFilter !== 'todas' || searchQuery.trim().length > 0;

  const resetFilters = () => {
    setStatusFilter('todas');
    setServiceFilter('todas');
    setSearchQuery('');
    setMobileDetailOpen(false);
  };

  const handleSelectEvaluation = (id: string) => {
    setSelectedId(id);
    setMobileDetailOpen(true);
    setActionFeedback(null);
    dossierScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrev = () => {
    if (selectedIndex > 0) {
      handleSelectEvaluation(filteredEvaluations[selectedIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (selectedIndex >= 0 && selectedIndex < filteredEvaluations.length - 1) {
      handleSelectEvaluation(filteredEvaluations[selectedIndex + 1].id);
    }
  };

  const handleCopy = async (value: string, field: 'folio' | 'ref') => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      window.setTimeout(() => {
        setCopiedField((prev) => (prev === field ? null : prev));
      }, 1800);
    } catch {
      // Ignore clipboard permission errors
    }
  };

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
    setMobileDetailOpen(false);
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
    const neighborId =
      filteredEvaluations[selectedIndex + 1]?.id ??
      filteredEvaluations[selectedIndex - 1]?.id ??
      null;
    try {
      await deleteDoc(doc(db, 'evaluations', id));
      setConfirmDeleteId(null);
      setSelectedId(neighborId);
      if (!neighborId) {
        setMobileDetailOpen(false);
      }
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
    const source = filteredEvaluations.length > 0 ? filteredEvaluations : evaluations;
    if (source.length === 0) return;
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
    const rows = source.map((ev) =>
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

  const safeRefUrl = selectedEvaluation
    ? getSafeExternalUrl(selectedEvaluation.enlaceReferencia)
    : null;
  const notesDirty =
    selectedEvaluation !== null && notesDraft !== selectedEvaluation.adminNotes;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t.admin.dialogAria}
      className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5"
    >
      <div
        className={`w-full max-w-6xl bg-white rounded-2xl border border-zinc-200 shadow-2xl flex flex-col overflow-hidden ${
          authReady && user && isAuthorizedAdmin ? 'h-[90vh] max-h-[860px]' : 'max-h-[90vh]'
        }`}
      >
        {/* Top Modal Header */}
        <div className="px-5 sm:px-6 py-3.5 border-b border-zinc-200 flex items-center justify-between gap-4 bg-zinc-50/80 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <ShieldCheck className="w-5 h-5 text-zinc-900 shrink-0" />
            <div className="min-w-0">
              <span className="font-display text-sm sm:text-base font-semibold text-zinc-950 truncate block">
                {t.admin.headerTitle}
              </span>
              {user && isAuthorizedAdmin && user.email && (
                <span className="text-xs text-zinc-500 truncate hidden sm:block">
                  {user.email}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {isAuthorizedAdmin && evaluations.length > 0 && (
              <button
                type="button"
                onClick={handleExportCsv}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-300 bg-white text-xs font-medium text-zinc-800 hover:bg-zinc-100 transition-colors whitespace-nowrap shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">{t.admin.exportCsv}</span>
              </button>
            )}
            {user && (
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 bg-white text-xs font-medium text-zinc-600 hover:text-zinc-950 transition-colors whitespace-nowrap shrink-0"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{t.admin.signOut}</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label={t.admin.closeAria}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-950 hover:bg-zinc-200/60 transition-colors shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        {!authReady ? (
          <div className="py-20 px-6 flex flex-col items-center justify-center text-zinc-500">
            <Loader2 className="w-6 h-6 animate-spin mb-3 text-zinc-800" />
            <p className="text-sm">{t.admin.verifying}</p>
          </div>
        ) : !user ? (
          <div className="py-16 px-6 max-w-md mx-auto text-center">
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
          <div className="py-16 px-6 max-w-md mx-auto text-center">
            <h3 className="font-display text-lg font-semibold text-zinc-950">
              {t.admin.unauthorizedTitle}
            </h3>
            <p className="mt-2 text-sm text-zinc-600 leading-relaxed">
              {t.admin.unauthorizedPrefix} (
              <span className="text-xs font-medium">{user.email}</span>){' '}
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
          <div className="flex-1 min-h-0 flex flex-col">
            {/* Workspace Filter & Search Bar */}
            <div className="px-5 sm:px-6 py-3.5 border-b border-zinc-200 bg-white space-y-3 shrink-0">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-1 p-1 rounded-xl bg-zinc-100 overflow-x-auto max-w-full">
                  {(
                    [
                      { id: 'todas', label: t.admin.tabs.all(statusCounts.all) },
                      { id: 'pendiente', label: t.admin.tabs.pendiente(statusCounts.pendiente) },
                      {
                        id: 'en_revision',
                        label: t.admin.tabs.en_revision(statusCounts.en_revision),
                      },
                      {
                        id: 'contactado',
                        label: t.admin.tabs.contactado(statusCounts.contactado),
                      },
                      { id: 'cerrado', label: t.admin.tabs.cerrado(statusCounts.cerrado) },
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        setStatusFilter(tab.id);
                        setMobileDetailOpen(false);
                      }}
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

                {actionFeedback && (
                  <span className="text-xs font-medium text-zinc-700">{actionFeedback}</span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <div className="relative flex-1 min-w-0">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setMobileDetailOpen(false);
                    }}
                    placeholder={t.admin.searchPlaceholder}
                    className="w-full pl-9 pr-8 py-1.5 rounded-lg border border-zinc-200 bg-zinc-50/70 text-xs sm:text-sm text-zinc-950 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-950"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      aria-label={t.admin.clearSearchAria}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-900"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <select
                    aria-label={t.admin.serviceFilterAria}
                    value={serviceFilter}
                    onChange={(e) => {
                      setServiceFilter(e.target.value as 'todas' | ServiceTier);
                      setMobileDetailOpen(false);
                    }}
                    className="flex-1 sm:flex-initial px-3 py-1.5 rounded-lg border border-zinc-200 bg-white text-xs font-medium text-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-950"
                  >
                    <option value="todas">{t.admin.serviceAll}</option>
                    <option value="Tier 1: Argos">Tier 1: Argos</option>
                    <option value="Tier 2: Atlas">Tier 2: Atlas</option>
                    <option value="Palantir Raptor">Palantir Raptor</option>
                  </select>

                  <button
                    type="button"
                    onClick={() =>
                      setSortOrder((prev) => (prev === 'newest' ? 'oldest' : 'newest'))
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 bg-white text-xs font-medium text-zinc-700 hover:text-zinc-950 hover:bg-zinc-50 transition-colors whitespace-nowrap shrink-0"
                  >
                    <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500" />
                    <span>
                      {sortOrder === 'newest' ? t.admin.sortNewest : t.admin.sortOldest}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Main Split Workspace */}
            {loadingDocs ? (
              <div className="flex-1 flex items-center justify-center text-zinc-500 text-sm">
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                {t.admin.loadingDocs}
              </div>
            ) : evaluations.length === 0 ? (
              <div className="flex-1 flex items-center justify-center px-6 text-center text-sm text-zinc-500">
                {t.admin.emptyDocs}
              </div>
            ) : filteredEvaluations.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-3">
                <p className="text-sm text-zinc-600">{t.admin.emptyFiltered}</p>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="px-3.5 py-1.5 rounded-lg border border-zinc-300 bg-white text-xs font-medium text-zinc-900 hover:bg-zinc-100 transition-colors whitespace-nowrap"
                  >
                    {t.admin.clearFiltersBtn}
                  </button>
                )}
              </div>
            ) : (
              <div className="flex-1 min-h-0 flex flex-col lg:flex-row">
                {/* Left Request Queue */}
                <div
                  className={`lg:w-[390px] xl:w-[430px] shrink-0 lg:border-r border-zinc-200 flex-col min-h-0 bg-white ${
                    mobileDetailOpen ? 'hidden lg:flex' : 'flex flex-1 lg:flex-initial'
                  }`}
                >
                  <div className="px-5 py-2.5 bg-zinc-50/70 border-b border-zinc-200 flex items-center justify-between gap-2 text-xs shrink-0">
                    <span className="font-medium text-zinc-700 tabular-nums">
                      {t.admin.queueCount(filteredEvaluations.length, evaluations.length)}
                    </span>
                    <span className="text-zinc-500 truncate">{t.admin.selectPrompt}</span>
                  </div>

                  <div className="flex-1 overflow-y-auto divide-y divide-zinc-200">
                    {filteredEvaluations.map((ev, index) => {
                      const active = selectedEvaluation?.id === ev.id;
                      const previewText =
                        ev.preocupacionReciente.trim() ||
                        (ev.adminNotes.trim() ? t.admin.hasNotesTag : '');
                      return (
                        <button
                          key={ev.id}
                          type="button"
                          onClick={() => handleSelectEvaluation(ev.id)}
                          className={`group w-full text-left px-5 py-3.5 transition-colors ${
                            active
                              ? 'bg-white lg:bg-zinc-100/90 hover:bg-zinc-100'
                              : 'bg-white hover:bg-zinc-50/90'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 text-xs tabular-nums">
                            <span
                              className={`font-mono ${
                                active ? 'font-semibold text-zinc-900' : 'text-zinc-500'
                              }`}
                            >
                              #{String(index + 1).padStart(2, '0')} · {ev.folio}
                            </span>
                            <span className="text-zinc-400">
                              {formatShortMillis(ev.createdAtMillis)}
                            </span>
                          </div>

                          <div className="mt-1.5 flex items-center justify-between gap-3">
                            <span className="text-sm font-semibold text-zinc-950 truncate">
                              {ev.nombreAlias}
                            </span>
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-zinc-500 group-hover:text-zinc-950 shrink-0">
                              <span className="lg:hidden">{t.admin.openDossier}</span>
                              <ChevronRight
                                className={`w-4 h-4 transition-transform ${
                                  active
                                    ? 'lg:text-zinc-950 lg:translate-x-0.5'
                                    : 'text-zinc-400 group-hover:translate-x-0.5'
                                }`}
                              />
                            </span>
                          </div>

                          <div className="mt-1 flex items-center justify-between gap-2 text-xs">
                            <span className="text-zinc-600 truncate">
                              {ev.rolPrincipal} · {ev.tierSugerido}
                            </span>
                            <span
                              className={`font-medium shrink-0 ${getStatusTextClass(ev.status)}`}
                            >
                              {t.admin.statusLabels[ev.status]}
                            </span>
                          </div>

                          {previewText && (
                            <p className="mt-1.5 text-xs text-zinc-400 truncate">{previewText}</p>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Right Selected Dossier */}
                {selectedEvaluation && (
                  <div
                    className={`flex-1 min-w-0 flex-col min-h-0 bg-white ${
                      mobileDetailOpen ? 'flex' : 'hidden lg:flex'
                    }`}
                  >
                    {/* Sticky Dossier Stepper Bar */}
                    <div className="px-5 sm:px-7 py-2.5 bg-zinc-50/70 border-b border-zinc-200 flex items-center justify-between gap-3 shrink-0">
                      <div className="flex items-center gap-3 min-w-0">
                        <button
                          type="button"
                          onClick={() => setMobileDetailOpen(false)}
                          className="lg:hidden inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-zinc-300 bg-white text-xs font-medium text-zinc-900 hover:bg-zinc-100 transition-colors whitespace-nowrap shrink-0"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                          <span>{t.admin.backToList(filteredEvaluations.length)}</span>
                        </button>

                        <span className="text-xs font-medium text-zinc-600 tabular-nums truncate">
                          {t.admin.dossierPosition(selectedIndex + 1, filteredEvaluations.length)}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          disabled={selectedIndex <= 0}
                          onClick={handlePrev}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-zinc-200 bg-white text-xs font-medium text-zinc-800 hover:bg-zinc-100 disabled:opacity-35 disabled:pointer-events-none transition-colors whitespace-nowrap shrink-0"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">{t.admin.prevRequest}</span>
                        </button>
                        <button
                          type="button"
                          disabled={selectedIndex >= filteredEvaluations.length - 1}
                          onClick={handleNext}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-zinc-200 bg-white text-xs font-medium text-zinc-800 hover:bg-zinc-100 disabled:opacity-35 disabled:pointer-events-none transition-colors whitespace-nowrap shrink-0"
                        >
                          <span className="hidden sm:inline">{t.admin.nextRequest}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Scrollable Dossier Content */}
                    <div
                      ref={dossierScrollRef}
                      className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6"
                    >
                      {/* Applicant Header */}
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 tabular-nums">
                            <span className="font-mono font-semibold text-zinc-800">
                              {selectedEvaluation.folio}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopy(selectedEvaluation.folio, 'folio')}
                              className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-950 transition-colors whitespace-nowrap"
                            >
                              {copiedField === 'folio' ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-700" />
                                  <span className="text-emerald-700">{t.admin.copiedBtn}</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>{t.admin.copyBtn}</span>
                                </>
                              )}
                            </button>
                            <span>·</span>
                            <span>{formatMillis(selectedEvaluation.createdAtMillis)}</span>
                          </div>

                          <h4 className="mt-1.5 font-display text-2xl font-semibold text-zinc-950 break-words">
                            {selectedEvaluation.nombreAlias}
                          </h4>
                          <p className="mt-0.5 text-sm text-zinc-600">
                            {selectedEvaluation.rolPrincipal}
                          </p>
                        </div>

                        {confirmDeleteId === selectedEvaluation.id ? (
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleDelete(selectedEvaluation.id)}
                              className="px-3 py-1.5 rounded-lg bg-zinc-950 text-white text-xs font-medium hover:bg-zinc-800 transition-colors whitespace-nowrap"
                            >
                              {t.admin.confirmDelete}
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-2.5 py-1.5 rounded-lg border border-zinc-300 text-xs text-zinc-600 hover:text-zinc-950 transition-colors whitespace-nowrap"
                            >
                              {t.admin.cancelDelete}
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(selectedEvaluation.id)}
                            aria-label={t.admin.deleteAria}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-zinc-200 text-xs font-medium text-zinc-500 hover:text-zinc-950 hover:border-zinc-300 transition-colors whitespace-nowrap shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>{t.admin.deleteBtn}</span>
                          </button>
                        )}
                      </div>

                      {/* Workflow Status Bar */}
                      <div className="py-4 border-y border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <span className="text-xs font-medium text-zinc-700">
                          {t.admin.dossierStatus}
                        </span>
                        {selectedEvaluation.status === 'cerrado' ? (
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="text-xs text-zinc-500">
                              {t.admin.closedLockedMsg}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                handleStatusChange(selectedEvaluation, 'en_revision')
                              }
                              className="px-3 py-1.5 rounded-lg border border-zinc-300 bg-white text-xs font-medium text-zinc-900 hover:bg-zinc-100 transition-colors whitespace-nowrap shrink-0"
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
                                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
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

                      {/* Structured Request Metadata */}
                      <dl className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-sm">
                        <div>
                          <dt className="text-xs text-zinc-500">{t.admin.serviceLabel}</dt>
                          <dd className="mt-1 font-medium text-zinc-950">
                            {selectedEvaluation.tierSugerido}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs text-zinc-500">{t.admin.modeLabel}</dt>
                          <dd className="mt-1 font-medium text-zinc-950">
                            {selectedEvaluation.modoOperacion === 'solo'
                              ? t.admin.soloShort
                              : t.admin.teamShort}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs text-zinc-500">{t.admin.dateLabel}</dt>
                          <dd className="mt-1 font-medium text-zinc-950 tabular-nums">
                            {formatMillis(selectedEvaluation.createdAtMillis)}
                          </dd>
                        </div>
                      </dl>

                      {/* Reference Link / Handle */}
                      <div className="pt-5 border-t border-zinc-200">
                        <div className="text-xs text-zinc-500">{t.admin.refLink}</div>
                        <div className="mt-1.5 flex flex-wrap items-center justify-between gap-3">
                          <span className="font-mono text-sm font-medium text-zinc-950 break-all">
                            {selectedEvaluation.enlaceReferencia}
                          </span>
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() =>
                                handleCopy(selectedEvaluation.enlaceReferencia, 'ref')
                              }
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-zinc-200 bg-white text-xs font-medium text-zinc-700 hover:text-zinc-950 hover:bg-zinc-50 transition-colors whitespace-nowrap"
                            >
                              {copiedField === 'ref' ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                                  <span className="text-emerald-700">{t.admin.copiedBtn}</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>{t.admin.copyBtn}</span>
                                </>
                              )}
                            </button>
                            {safeRefUrl && (
                              <a
                                href={safeRefUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-zinc-200 bg-white text-xs font-medium text-zinc-800 hover:bg-zinc-100 transition-colors whitespace-nowrap"
                              >
                                <span>{t.admin.openLinkBtn}</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Reported Concern */}
                      <div className="pt-5 border-t border-zinc-200">
                        <div className="text-xs text-zinc-500">{t.admin.reportedConcern}</div>
                        <p
                          className={`mt-2 text-sm whitespace-pre-wrap leading-relaxed ${
                            selectedEvaluation.preocupacionReciente
                              ? 'text-zinc-900'
                              : 'text-zinc-400'
                          }`}
                        >
                          {selectedEvaluation.preocupacionReciente || t.admin.noComments}
                        </p>
                      </div>

                      {/* Internal Follow-up Notes */}
                      <div className="pt-5 border-t border-zinc-200">
                        <div className="flex items-center justify-between gap-2">
                          <label
                            htmlFor="admin-notes-box"
                            className="block text-xs font-medium text-zinc-700"
                          >
                            {t.admin.internalNotesLabel}
                          </label>
                          <div className="flex items-center gap-2 text-xs tabular-nums">
                            {notesDirty && (
                              <span className="text-amber-700 font-medium">
                                {t.admin.unsavedNotes}
                              </span>
                            )}
                            <span className="text-zinc-400">
                              {notesDraft.length}/{EVALUATION_SCHEMA_LIMITS.adminNotesMax}
                            </span>
                          </div>
                        </div>
                        <textarea
                          id="admin-notes-box"
                          rows={4}
                          disabled={selectedEvaluation.status === 'cerrado'}
                          maxLength={EVALUATION_SCHEMA_LIMITS.adminNotesMax}
                          value={notesDraft}
                          onChange={(e) => setNotesDraft(e.target.value)}
                          placeholder={t.admin.internalNotesPlaceholder}
                          className="mt-2 w-full rounded-xl bg-zinc-50/60 px-3.5 py-2.5 text-sm text-zinc-950 border border-zinc-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-950 disabled:bg-zinc-100 disabled:text-zinc-500"
                        />
                        {selectedEvaluation.status !== 'cerrado' && (
                          <div className="mt-3 flex justify-end">
                            <button
                              type="button"
                              disabled={savingNotes || !notesDirty}
                              onClick={() => handleSaveNotes(selectedEvaluation)}
                              className="px-4 py-2 rounded-lg bg-zinc-950 text-white text-xs font-medium hover:bg-zinc-800 disabled:opacity-40 transition-colors whitespace-nowrap"
                            >
                              {savingNotes ? t.admin.savingBtn : t.admin.saveNotesBtn}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
