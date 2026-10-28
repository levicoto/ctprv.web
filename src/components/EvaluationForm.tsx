import { FormEvent, useEffect, useState } from 'react';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import {
  AlertCircle,
  ArrowUpRight,
  Check,
  ChevronDown,
  Copy,
  Download,
  Loader2,
  Lock,
  Mail,
  RotateCcw,
  ShieldAlert,
} from 'lucide-react';
import {
  db,
  EVALUATION_SCHEMA_LIMITS,
  handleFirestoreError,
  OperationType,
} from '../lib/firebase';
import { useI18n } from '../lib/i18n';
import ParallaxLayer from './ParallaxLayer';
import SignalMark, {
  buildGmailComposeUrl,
  buildMailtoComposeUrl,
  buildOutlookComposeUrl,
  CONTACT_EMAIL,
  copyToClipboard,
  SIGNAL_DIRECT_URL,
} from './SignalMark';
import type { ServiceTierId } from './TierKineticObject3D';

export type OperationMode = 'solo' | 'equipo';
export type AssignedServiceLabel = 'Tier 1: Argos' | 'Tier 2: Atlas' | 'Palantir Raptor';

interface EvaluationRecord {
  id: string;
  folio: string;
  submittedAtIso: string;
  nombreAlias: string;
  rolPrincipal: string;
  enlaceReferencia: string;
  modoOperacion: OperationMode;
  preocupacionReciente: string;
  tierSugerido: AssignedServiceLabel;
}

interface EvaluationFormProps {
  preferredMode?: OperationMode;
  onModeSyncTier?: (tier: ServiceTierId) => void;
  onOpenPrivacy?: () => void;
  serviceVariant?: 'tiers' | 'raptor';
}

const STORAGE_KEY_TIERS = 'coto_privado_evaluacion_ultima_v3';
const STORAGE_KEY_RAPTOR = 'coto_privado_evaluacion_raptor_v1';

function generateFolio(): string {
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `CTPV-26-${randomDigits}`;
}

function generateDocumentId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `eval_${crypto.randomUUID().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  }
  return `eval_${Date.now()}_${Math.floor(100000 + Math.random() * 900000)}`;
}

export default function EvaluationForm({
  preferredMode,
  onModeSyncTier,
  onOpenPrivacy,
  serviceVariant = 'tiers',
}: EvaluationFormProps) {
  const { lang, t } = useI18n();
  const isRaptor = serviceVariant === 'raptor';
  const storageKey = isRaptor ? STORAGE_KEY_RAPTOR : STORAGE_KEY_TIERS;

  const [nombreAlias, setNombreAlias] = useState('');
  const [rolPrincipal, setRolPrincipal] = useState('');
  const [enlaceReferencia, setEnlaceReferencia] = useState('');
  const [modoOperacion, setModoOperacion] = useState<OperationMode>('solo');
  const [preocupacionReciente, setPreocupacionReciente] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [emailCopied, setEmailCopied] = useState(false);
  const [emergencyOpen, setEmergencyOpen] = useState(false);

  const handleCopyEmail = async () => {
    const ok = await copyToClipboard(CONTACT_EMAIL);
    if (ok) {
      setEmailCopied(true);
      window.setTimeout(() => setEmailCopied(false), 2000);
    }
  };

  const [submittedRecord, setSubmittedRecord] = useState<EvaluationRecord | null>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? (JSON.parse(saved) as EvaluationRecord) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      setSubmittedRecord(saved ? (JSON.parse(saved) as EvaluationRecord) : null);
    } catch {
      setSubmittedRecord(null);
    }
  }, [storageKey]);

  useEffect(() => {
    if (preferredMode) {
      setModoOperacion(preferredMode);
    }
  }, [preferredMode]);

  const handleModeChange = (mode: OperationMode) => {
    setModoOperacion(mode);
    if (onModeSyncTier) {
      onModeSyncTier(mode === 'solo' ? 'argos' : 'atlas');
    }
  };

  const localeCode = lang === 'en' ? 'en-US' : lang === 'pt' ? 'pt-BR' : 'es-ES';

  const formatRecordDate = (iso: string) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString(localeCode, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
  };

  const validate = (): boolean => {
    const nextErrors: Record<string, string> = {};
    const cleanName = nombreAlias.trim();
    const cleanRole = rolPrincipal.trim();
    const cleanRef = enlaceReferencia.trim();
    const cleanConcern = preocupacionReciente.trim();

    if (
      cleanName.length < EVALUATION_SCHEMA_LIMITS.nombreAliasMin ||
      cleanName.length > EVALUATION_SCHEMA_LIMITS.nombreAliasMax
    ) {
      nextErrors.nombreAlias = t.form.validation.nameLength(
        EVALUATION_SCHEMA_LIMITS.nombreAliasMin,
        EVALUATION_SCHEMA_LIMITS.nombreAliasMax
      );
    }

    if (
      cleanRole.length < EVALUATION_SCHEMA_LIMITS.rolPrincipalMin ||
      cleanRole.length > EVALUATION_SCHEMA_LIMITS.rolPrincipalMax
    ) {
      nextErrors.rolPrincipal = t.form.validation.roleLength(
        EVALUATION_SCHEMA_LIMITS.rolPrincipalMin,
        EVALUATION_SCHEMA_LIMITS.rolPrincipalMax
      );
    }

    if (
      cleanRef.length < EVALUATION_SCHEMA_LIMITS.enlaceReferenciaMin ||
      cleanRef.length > EVALUATION_SCHEMA_LIMITS.enlaceReferenciaMax
    ) {
      nextErrors.enlaceReferencia = t.form.validation.refEmpty;
    } else if (!/^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$|^@[\w._-]{2,}$/i.test(cleanRef)) {
      nextErrors.enlaceReferencia = t.form.validation.refInvalid;
    }

    if (cleanConcern.length > EVALUATION_SCHEMA_LIMITS.preocupacionMax) {
      nextErrors.preocupacionReciente = t.form.validation.concernMax(
        EVALUATION_SCHEMA_LIMITS.preocupacionMax
      );
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!validate() || isSubmitting) return;

    const docId = generateDocumentId();
    const folio = generateFolio();
    const cleanName = nombreAlias.trim().slice(0, EVALUATION_SCHEMA_LIMITS.nombreAliasMax);
    const cleanRole = rolPrincipal.trim().slice(0, EVALUATION_SCHEMA_LIMITS.rolPrincipalMax);
    const cleanRef = enlaceReferencia.trim().slice(0, EVALUATION_SCHEMA_LIMITS.enlaceReferenciaMax);
    const cleanConcern = preocupacionReciente
      .trim()
      .slice(0, EVALUATION_SCHEMA_LIMITS.preocupacionMax);

    // Canonical tierSugerido & modoOperacion values strictly adhering to firestore.rules
    const tierSugerido: AssignedServiceLabel = isRaptor
      ? 'Palantir Raptor'
      : modoOperacion === 'solo'
        ? 'Tier 1: Argos'
        : 'Tier 2: Atlas';

    if (
      !EVALUATION_SCHEMA_LIMITS.idPattern.test(docId) ||
      !EVALUATION_SCHEMA_LIMITS.folioPattern.test(folio)
    ) {
      setSubmitError(t.form.validation.idGenFailed);
      return;
    }

    setIsSubmitting(true);
    const path = `evaluations/${docId}`;

    try {
      await setDoc(doc(db, 'evaluations', docId), {
        folio,
        nombreAlias: cleanName,
        rolPrincipal: cleanRole,
        enlaceReferencia: cleanRef,
        modoOperacion,
        preocupacionReciente: cleanConcern,
        tierSugerido,
        status: 'pendiente',
        adminNotes: '',
        recipientOrg: EVALUATION_SCHEMA_LIMITS.recipientOrg,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      const record: EvaluationRecord = {
        id: docId,
        folio,
        submittedAtIso: new Date().toISOString(),
        nombreAlias: cleanName,
        rolPrincipal: cleanRole,
        enlaceReferencia: cleanRef,
        modoOperacion,
        preocupacionReciente: cleanConcern,
        tierSugerido,
      };

      try {
        localStorage.setItem(storageKey, JSON.stringify(record));
      } catch {
        // Ignore private browsing localStorage restrictions
      }

      setEmergencyOpen(false);
      setSubmittedRecord(record);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('Quota exceeded')) {
        setSubmitError(t.form.validation.quotaExceeded);
      } else {
        setSubmitError(t.form.validation.genericSubmitError);
      }
      try {
        handleFirestoreError(err, OperationType.CREATE, path);
      } catch {
        // Structured JSON error logged for diagnostic visibility while preserving graceful UI
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const localizedTierLabel = (tier: AssignedServiceLabel) => {
    if (tier === 'Palantir Raptor') return t.form.confirmation.tierDisplayRaptor;
    return tier === 'Tier 1: Argos'
      ? t.form.confirmation.tierDisplayArgos
      : t.form.confirmation.tierDisplayAtlas;
  };

  const handleDownloadDossier = () => {
    if (!submittedRecord) return;
    const c = t.form.confirmation;
    const content = [
      c.receiptHeader,
      '--------------------------------------------------',
      `${c.receiptFolio}: ${submittedRecord.folio}`,
      `${c.receiptDate}: ${formatRecordDate(submittedRecord.submittedAtIso)}`,
      `${c.receiptName}: ${submittedRecord.nombreAlias}`,
      `${c.receiptRole}: ${submittedRecord.rolPrincipal}`,
      `${c.receiptRef}: ${submittedRecord.enlaceReferencia}`,
      `${c.receiptMode}: ${
        submittedRecord.modoOperacion === 'solo' ? c.receiptModeSolo : c.receiptModeTeam
      }`,
      `${c.receiptTier}: ${localizedTierLabel(submittedRecord.tierSugerido)}`,
      `${c.receiptNotes}: ${submittedRecord.preocupacionReciente || c.receiptNoNotes}`,
      '--------------------------------------------------',
      'Confidential · Safe, Trust, Cybersecurity',
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CotoPrivado_${submittedRecord.folio}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getEmailComposePayload = () => {
    if (!submittedRecord) {
      return { to: CONTACT_EMAIL };
    }
    const c = t.form.confirmation;
    const subject = `${c.mailSubjectPrefix} [${submittedRecord.folio}] — ${submittedRecord.nombreAlias}`;
    const body = [
      `${c.receiptFolio}: ${submittedRecord.folio}`,
      `${c.receiptName}: ${submittedRecord.nombreAlias}`,
      `${c.receiptRole}: ${submittedRecord.rolPrincipal}`,
      `${c.receiptRef}: ${submittedRecord.enlaceReferencia}`,
      `${c.receiptMode}: ${
        submittedRecord.modoOperacion === 'solo' ? c.receiptModeSolo : c.receiptModeTeam
      } (${localizedTierLabel(submittedRecord.tierSugerido)})`,
      submittedRecord.preocupacionReciente
        ? `${c.receiptNotes}: ${submittedRecord.preocupacionReciente}`
        : '',
    ]
      .filter(Boolean)
      .join('\n');

    return { to: CONTACT_EMAIL, subject, body };
  };

  const emailPayload = getEmailComposePayload();
  const mailtoHref = buildMailtoComposeUrl(emailPayload);
  const gmailHref = buildGmailComposeUrl(emailPayload);
  const outlookHref = buildOutlookComposeUrl(emailPayload);

  const handleResetNew = () => {
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // Ignore
    }
    setSubmittedRecord(null);
    setEmergencyOpen(false);
    setNombreAlias('');
    setRolPrincipal('');
    setEnlaceReferencia('');
    setPreocupacionReciente('');
    setErrors({});
    setSubmitError(null);
  };

  const renderSignalLaunchLink = (label: string, variant: 'solid' | 'outline' = 'solid') => {
    const baseClasses =
      variant === 'solid'
        ? 'h-9 px-3.5 rounded-lg bg-zinc-950 text-white hover:bg-zinc-800 text-xs font-medium inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950'
        : 'inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-300 bg-white/90 text-zinc-800 text-sm font-medium hover:text-zinc-950 hover:border-zinc-950 transition-colors whitespace-nowrap shrink-0';

    return (
      <a
        href={SIGNAL_DIRECT_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={baseClasses}
      >
        <SignalMark className="w-3.5 h-3.5 shrink-0" />
        <span>{label}</span>
        <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
      </a>
    );
  };

  return (
    <section id="evaluacion" className="relative z-10 py-20 sm:py-28 border-t border-zinc-200/80">
      <div className="max-w-[1200px] xl:max-w-[1280px] mx-auto px-6 sm:px-8 w-full">
        <ParallaxLayer speed={0.018} maxOffset={8} desktopOnly>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Context Column */}
            <div className="lg:col-span-6 lg:pr-6">
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-950 text-balance">
                {isRaptor ? t.form.raptorHeadline : t.form.headline}
              </h2>
              <p className="mt-4 text-base text-zinc-600 leading-relaxed max-w-[52ch]">
                {isRaptor ? t.form.raptorBody : t.form.body}
              </p>

              {/* Unlocked Direct Contact (Post-Folio) & Discreet Emergency Protocol Card */}
              <div
                className={`mt-8 glass-panel rounded-2xl max-w-[52ch] ${
                  submittedRecord ? 'p-6 sm:p-7' : 'px-5 py-4'
                }`}
              >
                {submittedRecord ? (
                  <>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-zinc-500">
                      <span className="text-zinc-900">
                        {t.form.signalCard.unlockedKicker(submittedRecord.folio)[0]}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-zinc-700">
                        {t.form.signalCard.unlockedKicker(submittedRecord.folio)[1]}
                      </span>
                    </div>

                    <h3 className="mt-2.5 text-base sm:text-lg font-semibold tracking-tight text-zinc-950">
                      {t.form.signalCard.unlockedTitle}
                    </h3>

                    <p className="mt-2 text-sm text-zinc-600 leading-relaxed">
                      {t.form.signalCard.unlockedBody(submittedRecord.folio)}
                    </p>

                    {/* Unlocked Row 1: Direct Signal Encrypted Bridge */}
                    <div className="mt-5 pt-4 border-t border-zinc-200/80 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-zinc-950 text-white flex items-center justify-center shrink-0">
                          <SignalMark className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-[11px] font-medium text-zinc-500 leading-none">
                            {t.form.signalCard.userLabel}
                          </div>
                          <div className="mt-1 text-xs font-medium text-zinc-900">
                            {t.form.signalCard.signalSubtitle}
                          </div>
                        </div>
                      </div>

                      {renderSignalLaunchLink(t.form.signalCard.openSignalBtn, 'solid')}
                    </div>

                    {/* Unlocked Row 2: Direct Email (help@coto.lat) with Native App + Webmail Launchers */}
                    <div className="mt-4 pt-4 border-t border-zinc-200/80 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg border border-zinc-200 bg-white text-zinc-900 flex items-center justify-center shrink-0">
                            <Mail className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-[11px] font-medium text-zinc-500 leading-none">
                              {t.form.signalCard.emailLabel}
                            </div>
                            <div className="mt-1 font-mono text-sm font-semibold text-zinc-950 tracking-tight select-all">
                              {CONTACT_EMAIL}
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleCopyEmail}
                          className="h-8 px-3 rounded-lg border border-zinc-300 bg-white/90 hover:border-zinc-950 text-zinc-900 text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
                        >
                          {emailCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5 shrink-0" />
                              <span>{t.form.signalCard.copiedEmailBtn}</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 shrink-0" />
                              <span>{t.form.signalCard.copyEmailBtn}</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <a
                          href={mailtoHref}
                          className="h-9 px-3.5 rounded-lg bg-zinc-950 text-white hover:bg-zinc-800 text-xs font-medium inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
                        >
                          <Mail className="w-3.5 h-3.5 shrink-0" />
                          <span>{t.form.signalCard.openMailAppBtn}</span>
                        </a>
                        <a
                          href={gmailHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-9 px-3 rounded-lg border border-zinc-300 bg-white/90 hover:border-zinc-950 text-zinc-900 text-xs font-medium inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
                        >
                          <span>{t.form.signalCard.openGmailBtn}</span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                        </a>
                        <a
                          href={outlookHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-9 px-3 rounded-lg border border-zinc-300 bg-white/90 hover:border-zinc-950 text-zinc-900 text-xs font-medium inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
                        >
                          <span>{t.form.signalCard.openOutlookBtn}</span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                        </a>
                      </div>
                    </div>
                  </>
                ) : (
                  <div>
                    <button
                      type="button"
                      aria-expanded={emergencyOpen}
                      onClick={() => setEmergencyOpen((prev) => !prev)}
                      className="w-full flex items-center justify-between gap-3 text-left text-xs font-medium text-zinc-700 hover:text-zinc-950 transition-colors cursor-pointer py-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
                    >
                      <span className="inline-flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-zinc-700 shrink-0" />
                        <span>{t.form.signalCard.emergencyToggle}</span>
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-zinc-500 shrink-0 transition-transform duration-200 ${
                          emergencyOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {emergencyOpen && (
                      <div className="mt-4 pt-4 border-t border-zinc-200/80 space-y-3.5">
                        <p className="text-xs text-zinc-600 leading-relaxed">
                          {t.form.signalCard.emergencyNotice}
                        </p>

                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-zinc-950 text-white flex items-center justify-center shrink-0">
                              <SignalMark className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-[11px] font-medium text-zinc-500 leading-none">
                                {t.form.signalCard.emergencySignalLabel}
                              </div>
                              <div className="mt-1 text-xs font-medium text-zinc-900">
                                {t.form.signalCard.emergencySignalSubtitle}
                              </div>
                            </div>
                          </div>

                          {renderSignalLaunchLink(t.form.signalCard.openSignalBtn, 'solid')}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Glassmorphic Form / Confirmation Container */}
            <div className="lg:col-span-6 w-full">
              {submittedRecord ? (
                <div className="glass-panel rounded-2xl p-8 sm:p-10">
                  <div className="flex items-center justify-between gap-4 pb-6 border-b border-zinc-200/80">
                    <h3 className="text-2xl font-semibold text-zinc-950">
                      {t.form.confirmation.title}
                    </h3>
                    <div className="w-10 h-10 rounded-xl bg-zinc-950 text-white flex items-center justify-center shrink-0">
                      <Check className="w-5 h-5" />
                    </div>
                  </div>

                  <dl className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 text-sm">
                    <div>
                      <dt className="text-xs text-zinc-500">{t.form.confirmation.folioLabel}</dt>
                      <dd className="mt-1 font-medium text-zinc-950 tabular-nums">
                        {submittedRecord.folio}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-zinc-500">{t.form.confirmation.tierLabel}</dt>
                      <dd className="mt-1 font-medium text-zinc-950">
                        {localizedTierLabel(submittedRecord.tierSugerido)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-zinc-500">{t.form.confirmation.nameLabel}</dt>
                      <dd className="mt-1 font-medium text-zinc-900 break-words">
                        {submittedRecord.nombreAlias}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-zinc-500">{t.form.confirmation.roleLabel}</dt>
                      <dd className="mt-1 font-medium text-zinc-900 break-words">
                        {submittedRecord.rolPrincipal}
                      </dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-xs text-zinc-500">{t.form.confirmation.refLabel}</dt>
                      <dd className="mt-1 text-sm text-zinc-800 break-all">
                        {submittedRecord.enlaceReferencia}
                      </dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-xs text-zinc-500">{t.form.confirmation.modeLabel}</dt>
                      <dd className="mt-1 text-zinc-800">
                        {submittedRecord.modoOperacion === 'solo'
                          ? t.form.confirmation.modeSoloDesc
                          : t.form.confirmation.modeTeamDesc}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-8 pt-6 border-t border-zinc-200/80 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <button
                        type="button"
                        onClick={handleDownloadDossier}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-950 text-white text-sm font-medium hover:bg-zinc-800 transition-colors whitespace-nowrap shrink-0"
                      >
                        <Download className="w-4 h-4" />
                        <span>{t.form.confirmation.downloadBtn}</span>
                      </button>

                      <a
                        href={mailtoHref}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-300 bg-white/90 text-zinc-800 text-sm font-medium hover:text-zinc-950 hover:border-zinc-400 transition-colors whitespace-nowrap shrink-0"
                      >
                        <Mail className="w-4 h-4" />
                        <span>{t.form.confirmation.emailBtn}</span>
                      </a>

                      <a
                        href={gmailHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-zinc-300 bg-white/90 text-zinc-800 text-sm font-medium hover:text-zinc-950 hover:border-zinc-400 transition-colors whitespace-nowrap shrink-0"
                      >
                        <span>{t.form.confirmation.gmailBtn}</span>
                        <ArrowUpRight className="w-4 h-4 text-zinc-500 shrink-0" />
                      </a>

                      {renderSignalLaunchLink(t.form.confirmation.openSignalBtn, 'outline')}
                    </div>

                    <button
                      type="button"
                      onClick={handleResetNew}
                      className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-zinc-600 text-sm font-medium hover:text-zinc-950 transition-colors whitespace-nowrap shrink-0"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>{t.form.confirmation.resetBtn}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="glass-panel rounded-2xl p-8 sm:p-10 space-y-6"
                >
                  {submitError && (
                    <div
                      role="alert"
                      className="rounded-xl border border-zinc-900 bg-zinc-100 px-4 py-3 text-xs text-zinc-900 flex items-start gap-2.5"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  {/* Field 1: Nombre / Alias */}
                  <div>
                    <label htmlFor="eval-nombre" className="block text-sm font-medium text-zinc-900">
                      {t.form.fields.nameLabel}
                    </label>
                    <input
                      id="eval-nombre"
                      type="text"
                      maxLength={EVALUATION_SCHEMA_LIMITS.nombreAliasMax}
                      value={nombreAlias}
                      onChange={(e) => {
                        setNombreAlias(e.target.value);
                        if (errors.nombreAlias)
                          setErrors((prev) => ({ ...prev, nombreAlias: '' }));
                      }}
                      placeholder={t.form.fields.namePlaceholder}
                      className={`mt-2 w-full rounded-xl bg-white/90 px-4 py-3 text-sm text-zinc-950 placeholder:text-zinc-400 border transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-950 ${
                        errors.nombreAlias
                          ? 'border-zinc-900'
                          : 'border-zinc-200 hover:border-zinc-300'
                      }`}
                    />
                    {errors.nombreAlias && (
                      <p className="mt-1.5 text-xs font-medium text-zinc-900" role="alert">
                        {t.form.validation.errorPrefix}: {errors.nombreAlias}
                      </p>
                    )}
                  </div>

                  {/* Field 2: Rol principal */}
                  <div>
                    <label htmlFor="eval-rol" className="block text-sm font-medium text-zinc-900">
                      {t.form.fields.roleLabel}
                    </label>
                    <input
                      id="eval-rol"
                      type="text"
                      maxLength={EVALUATION_SCHEMA_LIMITS.rolPrincipalMax}
                      value={rolPrincipal}
                      onChange={(e) => {
                        setRolPrincipal(e.target.value);
                        if (errors.rolPrincipal)
                          setErrors((prev) => ({ ...prev, rolPrincipal: '' }));
                      }}
                      placeholder={t.form.fields.rolePlaceholder}
                      className={`mt-2 w-full rounded-xl bg-white/90 px-4 py-3 text-sm text-zinc-950 placeholder:text-zinc-400 border transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-950 ${
                        errors.rolPrincipal
                          ? 'border-zinc-900'
                          : 'border-zinc-200 hover:border-zinc-300'
                      }`}
                    />
                    {errors.rolPrincipal && (
                      <p className="mt-1.5 text-xs font-medium text-zinc-900" role="alert">
                        {t.form.validation.errorPrefix}: {errors.rolPrincipal}
                      </p>
                    )}
                  </div>

                  {/* Field 3: Enlace de referencia */}
                  <div>
                    <label htmlFor="eval-enlace" className="block text-sm font-medium text-zinc-900">
                      {t.form.fields.refLabel}
                    </label>
                    <input
                      id="eval-enlace"
                      type="text"
                      maxLength={EVALUATION_SCHEMA_LIMITS.enlaceReferenciaMax}
                      value={enlaceReferencia}
                      onChange={(e) => {
                        setEnlaceReferencia(e.target.value);
                        if (errors.enlaceReferencia)
                          setErrors((prev) => ({ ...prev, enlaceReferencia: '' }));
                      }}
                      placeholder={t.form.fields.refPlaceholder}
                      className={`mt-2 w-full rounded-xl bg-white/90 px-4 py-3 text-sm text-zinc-950 placeholder:text-zinc-400 border transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-950 ${
                        errors.enlaceReferencia
                          ? 'border-zinc-900'
                          : 'border-zinc-200 hover:border-zinc-300'
                      }`}
                    />
                    {errors.enlaceReferencia && (
                      <p className="mt-1.5 text-xs font-medium text-zinc-900" role="alert">
                        {t.form.validation.errorPrefix}: {errors.enlaceReferencia}
                      </p>
                    )}
                  </div>

                  {/* Field 4: Solo / Equipo */}
                  <div>
                    <span className="block text-sm font-medium text-zinc-900">
                      {t.form.fields.modeLabel}
                    </span>
                    <div
                      role="radiogroup"
                      aria-label={t.form.fields.modeAria}
                      className="mt-2 grid grid-cols-2 gap-2 p-1.5 rounded-xl bg-zinc-100/90 border border-zinc-200/80"
                    >
                      <button
                        type="button"
                        role="radio"
                        aria-checked={modoOperacion === 'solo'}
                        onClick={() => handleModeChange('solo')}
                        className={`py-2.5 px-4 rounded-lg text-sm font-medium transition-all whitespace-nowrap shrink-0 ${
                          modoOperacion === 'solo'
                            ? 'bg-zinc-950 text-white shadow-sm'
                            : 'text-zinc-600 hover:text-zinc-950'
                        }`}
                      >
                        {t.form.fields.soloOption}
                      </button>
                      <button
                        type="button"
                        role="radio"
                        aria-checked={modoOperacion === 'equipo'}
                        onClick={() => handleModeChange('equipo')}
                        className={`py-2.5 px-4 rounded-lg text-sm font-medium transition-all whitespace-nowrap shrink-0 ${
                          modoOperacion === 'equipo'
                            ? 'bg-zinc-950 text-white shadow-sm'
                            : 'text-zinc-600 hover:text-zinc-950'
                        }`}
                      >
                        {t.form.fields.teamOption}
                      </button>
                    </div>
                  </div>

                  {/* Field 5: Preocupación de seguridad o incidente reciente */}
                  <div>
                    <div className="flex items-baseline justify-between gap-2">
                      <label
                        htmlFor="eval-preocupacion"
                        className="block text-sm font-medium text-zinc-900"
                      >
                        {t.form.fields.concernLabel}
                      </label>
                      <span className="text-xs text-zinc-400 shrink-0">
                        {t.form.fields.optionalTag}
                      </span>
                    </div>
                    <textarea
                      id="eval-preocupacion"
                      rows={3}
                      maxLength={EVALUATION_SCHEMA_LIMITS.preocupacionMax}
                      value={preocupacionReciente}
                      onChange={(e) => setPreocupacionReciente(e.target.value)}
                      placeholder={t.form.fields.concernPlaceholder}
                      className="mt-2 w-full rounded-xl bg-white/90 px-4 py-3 text-sm text-zinc-950 placeholder:text-zinc-400 border border-zinc-200 hover:border-zinc-300 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-950 resize-y"
                    />
                    {errors.preocupacionReciente && (
                      <p className="mt-1.5 text-xs font-medium text-zinc-900" role="alert">
                        {t.form.validation.errorPrefix}: {errors.preocupacionReciente}
                      </p>
                    )}
                  </div>

                  {/* Primary Submit Action */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-6 rounded-xl bg-zinc-950 text-white text-sm font-medium hover:bg-zinc-800 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99] transition-all flex items-center justify-center gap-2 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>{t.form.fields.submitLoading}</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          <span>
                            {isRaptor ? t.form.fields.raptorSubmitIdle : t.form.fields.submitIdle}
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {onOpenPrivacy && (
                <div className="mt-4 flex items-center justify-center sm:justify-start px-1">
                  <button
                    type="button"
                    onClick={onOpenPrivacy}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-950 underline underline-offset-4 transition-colors cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5 shrink-0" />
                    <span>{t.form.signalCard.privacyTrigger}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </ParallaxLayer>
      </div>
    </section>
  );
}
