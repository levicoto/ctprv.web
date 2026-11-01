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
export type AssignedServiceLabel =
  | 'Tier 1: Argos'
  | 'Tier 2: Atlas'
  | 'Palantir Raptor'
  | 'Protocolo PEP';

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
  serviceVariant?: 'tiers' | 'raptor' | 'crisis' | 'pep';
  onClearPepVariant?: () => void;
}

const STORAGE_KEY_TIERS = 'coto_privado_evaluacion_ultima_v3';
const STORAGE_KEY_RAPTOR = 'coto_privado_evaluacion_raptor_v1';
const STORAGE_KEY_CRISIS = 'coto_privado_evaluacion_crisis_v1';
const STORAGE_KEY_PEP = 'coto_privado_evaluacion_pep_v1';

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
  onClearPepVariant,
}: EvaluationFormProps) {
  const { lang, t } = useI18n();
  const isRaptor = serviceVariant === 'raptor';
  const isCrisis = serviceVariant === 'crisis';
  const isPep = serviceVariant === 'pep';
  const storageKey = isRaptor
    ? STORAGE_KEY_RAPTOR
    : isCrisis
      ? STORAGE_KEY_CRISIS
      : isPep
        ? STORAGE_KEY_PEP
        : STORAGE_KEY_TIERS;

  const [nombreAlias, setNombreAlias] = useState('');
  const [rolPrincipal, setRolPrincipal] = useState('');
  const [enlaceReferencia, setEnlaceReferencia] = useState('');
  const [modoOperacion, setModoOperacion] = useState<OperationMode>(
    isCrisis || isPep ? 'equipo' : 'solo'
  );
  const [preocupacionReciente, setPreocupacionReciente] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [emailCopied, setEmailCopied] = useState(false);
  const [emergencyOpen, setEmergencyOpen] = useState(isCrisis);

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
      : isPep
        ? 'Protocolo PEP'
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
    if (tier === 'Protocolo PEP') return t.form.confirmation.tierDisplayPep;
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
        ? 'h-9 px-3.5 rounded-lg btn-electric text-xs font-semibold inline-flex items-center gap-1.5 transition-all whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E6FF00]'
        : 'inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/15 bg-white/[0.04] text-white text-sm font-medium hover:text-[#E6FF00] hover:border-[#E6FF00] transition-colors whitespace-nowrap shrink-0';

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
    <section id="evaluacion" className="relative z-10 py-12 sm:py-16 border-t border-white/10">
      <div className="max-w-[1200px] xl:max-w-[1280px] mx-auto px-6 sm:px-8 w-full">
        <ParallaxLayer speed={0.016} maxOffset={6} desktopOnly>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Context Column */}
            <div className="lg:col-span-5 lg:pr-2">
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white text-balance">
                {isRaptor
                  ? t.form.raptorHeadline
                  : isCrisis
                    ? t.form.crisisHeadline
                    : isPep
                      ? t.form.pepHeadline
                      : t.form.headline}
              </h2>
              <p className="mt-3 text-sm sm:text-base text-white/70 leading-relaxed tracking-[0.01em] max-w-[48ch]">
                {isRaptor
                  ? t.form.raptorBody
                  : isCrisis
                    ? t.form.crisisBody
                    : isPep
                      ? t.form.pepBody
                      : t.form.body}
              </p>

              {isPep && onClearPepVariant && !submittedRecord && (
                <div className="mt-2.5">
                  <button
                    type="button"
                    onClick={onClearPepVariant}
                    className="text-xs font-medium text-[#E6FF00] hover:text-white underline underline-offset-4 transition-colors cursor-pointer"
                  >
                    {t.form.pepSwitchToGeneral}
                  </button>
                </div>
              )}

              {/* Unlocked Direct Contact (Post-Folio) & Discreet Emergency Disclosure */}
              <div
                className={`mt-6 glass-panel rounded-2xl ${
                  submittedRecord ? 'p-5 sm:p-6' : 'px-4 py-3.5'
                }`}
              >
                {submittedRecord ? (
                  <>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-white/55">
                      <span className="text-white">
                        {t.form.signalCard.unlockedKicker(submittedRecord.folio)[0]}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-[#E6FF00]">
                        {t.form.signalCard.unlockedKicker(submittedRecord.folio)[1]}
                      </span>
                    </div>

                    <h3 className="mt-2 text-base font-semibold tracking-tight text-white">
                      {t.form.signalCard.unlockedTitle}
                    </h3>

                    <p className="mt-1.5 text-sm text-white/70 leading-relaxed tracking-[0.01em]">
                      {t.form.signalCard.unlockedBody(submittedRecord.folio)}
                    </p>

                    {/* Unlocked Row 1: Direct Signal Encrypted Bridge */}
                    <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg border border-white/15 bg-white/[0.06] text-[#E6FF00] flex items-center justify-center shrink-0">
                          <SignalMark className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-[11px] font-medium text-white/50 leading-none">
                            {t.form.signalCard.userLabel}
                          </div>
                          <div className="mt-1 text-xs font-medium text-white">
                            {t.form.signalCard.signalSubtitle}
                          </div>
                        </div>
                      </div>

                      {renderSignalLaunchLink(t.form.signalCard.openSignalBtn, 'solid')}
                    </div>

                    {/* Unlocked Row 2: Direct Email (help@coto.lat) with Native App + Webmail Launchers */}
                    <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg border border-white/15 bg-white/[0.05] text-white flex items-center justify-center shrink-0">
                            <Mail className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-[11px] font-medium text-white/50 leading-none">
                              {t.form.signalCard.emailLabel}
                            </div>
                            <div className="mt-1 font-mono text-sm font-semibold text-white tracking-tight select-all">
                              {CONTACT_EMAIL}
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleCopyEmail}
                          className="h-8 px-3 rounded-lg border border-white/15 bg-white/[0.04] hover:border-[#E6FF00] hover:text-[#E6FF00] text-white text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E6FF00]"
                        >
                          {emailCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-[#E6FF00] shrink-0" />
                              <span className="text-[#E6FF00]">
                                {t.form.signalCard.copiedEmailBtn}
                              </span>
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
                          className="h-8 px-3 rounded-lg btn-electric text-xs font-semibold inline-flex items-center gap-1.5 transition-all whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E6FF00]"
                        >
                          <Mail className="w-3.5 h-3.5 shrink-0" />
                          <span>{t.form.signalCard.openMailAppBtn}</span>
                        </a>
                        <a
                          href={gmailHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-8 px-3 rounded-lg border border-white/15 bg-white/[0.04] hover:border-[#E6FF00] hover:text-[#E6FF00] text-white text-xs font-medium inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E6FF00]"
                        >
                          <span>{t.form.signalCard.openGmailBtn}</span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-white/55 shrink-0" />
                        </a>
                        <a
                          href={outlookHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-8 px-3 rounded-lg border border-white/15 bg-white/[0.04] hover:border-[#E6FF00] hover:text-[#E6FF00] text-white text-xs font-medium inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E6FF00]"
                        >
                          <span>{t.form.signalCard.openOutlookBtn}</span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-white/55 shrink-0" />
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
                      className="w-full flex items-center justify-between gap-3 text-left text-xs font-medium text-white/75 hover:text-white transition-colors cursor-pointer py-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E6FF00]"
                    >
                      <span className="inline-flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-[#E6FF00] shrink-0" />
                        <span>{t.form.signalCard.emergencyToggle}</span>
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-white/50 shrink-0 transition-transform duration-200 ${
                          emergencyOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {emergencyOpen && (
                      <div className="mt-3.5 pt-3.5 border-t border-white/10 space-y-3">
                        <p className="text-xs text-white/65 leading-relaxed tracking-[0.01em]">
                          {t.form.signalCard.emergencyNotice}
                        </p>

                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg border border-white/15 bg-white/[0.06] text-[#E6FF00] flex items-center justify-center shrink-0">
                              <SignalMark className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-[11px] font-medium text-white/50 leading-none">
                                {t.form.signalCard.emergencySignalLabel}
                              </div>
                              <div className="mt-1 text-xs font-medium text-white">
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

            {/* Right Cut-Glass Form / Confirmation Container Fed by Electric Yellow Backlight */}
            <div className="relative lg:col-span-7 w-full">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-10 right-4 w-80 h-80 rounded-full electric-backlight"
              />

              {submittedRecord ? (
                <div className="relative z-10 glass-panel-electric rounded-2xl p-6 sm:p-8 text-white">
                  <div className="flex items-center justify-between gap-4 pb-5 border-b border-white/10">
                    <h3 className="text-xl sm:text-2xl font-semibold text-white">
                      {t.form.confirmation.title}
                    </h3>
                    <div className="w-9 h-9 rounded-xl bg-[#E6FF00] text-[#060608] flex items-center justify-center shrink-0">
                      <Check className="w-4 h-4 stroke-[2.5]" />
                    </div>
                  </div>

                  <dl className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                    <div>
                      <dt className="text-xs text-white/50">{t.form.confirmation.folioLabel}</dt>
                      <dd className="mt-1 font-mono font-semibold text-[#E6FF00] tabular-nums">
                        {submittedRecord.folio}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-white/50">{t.form.confirmation.tierLabel}</dt>
                      <dd className="mt-1 font-medium text-white">
                        {localizedTierLabel(submittedRecord.tierSugerido)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-white/50">{t.form.confirmation.nameLabel}</dt>
                      <dd className="mt-1 font-medium text-white break-words">
                        {submittedRecord.nombreAlias}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-white/50">{t.form.confirmation.roleLabel}</dt>
                      <dd className="mt-1 font-medium text-white break-words">
                        {submittedRecord.rolPrincipal}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-white/50">{t.form.confirmation.refLabel}</dt>
                      <dd className="mt-1 text-sm text-white/85 break-all">
                        {submittedRecord.enlaceReferencia}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-white/50">{t.form.confirmation.modeLabel}</dt>
                      <dd className="mt-1 text-white/85">
                        {submittedRecord.modoOperacion === 'solo'
                          ? t.form.confirmation.modeSoloDesc
                          : t.form.confirmation.modeTeamDesc}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={handleDownloadDossier}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl btn-electric text-sm font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>{t.form.confirmation.downloadBtn}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleResetNew}
                      className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-white/65 text-sm font-medium hover:text-[#E6FF00] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
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
                  className="relative z-10 glass-panel rounded-2xl p-6 sm:p-7 space-y-4"
                >
                  {submitError && (
                    <div
                      role="alert"
                      className="rounded-xl border border-[#E6FF00]/50 bg-[#E6FF00]/[0.08] px-4 py-3 text-xs text-white flex items-start gap-2.5"
                    >
                      <AlertCircle className="w-4 h-4 text-[#E6FF00] shrink-0 mt-0.5" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  {/* Row 1: Side-by-Side Name / Alias + Role */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="eval-nombre" className="block text-xs font-medium text-white/85">
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
                        className={`mt-1.5 w-full rounded-xl bg-white/[0.04] px-3.5 py-2.5 text-sm text-white placeholder:text-white/35 border transition-colors focus:outline-none focus:border-[#E6FF00] focus:ring-1 focus:ring-[#E6FF00] ${
                          errors.nombreAlias
                            ? 'border-[#E6FF00]'
                            : 'border-white/12 hover:border-white/25'
                        }`}
                      />
                      {errors.nombreAlias && (
                        <p className="mt-1 text-xs font-medium text-[#E6FF00]" role="alert">
                          {t.form.validation.errorPrefix}: {errors.nombreAlias}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="eval-rol" className="block text-xs font-medium text-white/85">
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
                        className={`mt-1.5 w-full rounded-xl bg-white/[0.04] px-3.5 py-2.5 text-sm text-white placeholder:text-white/35 border transition-colors focus:outline-none focus:border-[#E6FF00] focus:ring-1 focus:ring-[#E6FF00] ${
                          errors.rolPrincipal
                            ? 'border-[#E6FF00]'
                            : 'border-white/12 hover:border-white/25'
                        }`}
                      />
                      {errors.rolPrincipal && (
                        <p className="mt-1 text-xs font-medium text-[#E6FF00]" role="alert">
                          {t.form.validation.errorPrefix}: {errors.rolPrincipal}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Row 2: Reference Link + Operating Structure */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
                    <div className="sm:col-span-7">
                      <label htmlFor="eval-enlace" className="block text-xs font-medium text-white/85">
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
                        className={`mt-1.5 w-full rounded-xl bg-white/[0.04] px-3.5 py-2.5 text-sm text-white placeholder:text-white/35 border transition-colors focus:outline-none focus:border-[#E6FF00] focus:ring-1 focus:ring-[#E6FF00] ${
                          errors.enlaceReferencia
                            ? 'border-[#E6FF00]'
                            : 'border-white/12 hover:border-white/25'
                        }`}
                      />
                      {errors.enlaceReferencia && (
                        <p className="mt-1 text-xs font-medium text-[#E6FF00]" role="alert">
                          {t.form.validation.errorPrefix}: {errors.enlaceReferencia}
                        </p>
                      )}
                    </div>

                    <div className="sm:col-span-5">
                      <span className="block text-xs font-medium text-white/85">
                        {t.form.fields.modeLabel}
                      </span>
                      <div
                        role="radiogroup"
                        aria-label={t.form.fields.modeAria}
                        className="mt-1.5 grid grid-cols-2 gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/12"
                      >
                        <button
                          type="button"
                          role="radio"
                          aria-checked={modoOperacion === 'solo'}
                          onClick={() => handleModeChange('solo')}
                          className={`py-2 px-2.5 rounded-lg text-xs transition-all whitespace-nowrap truncate cursor-pointer ${
                            modoOperacion === 'solo'
                              ? 'bg-[#E6FF00] text-[#060608] font-semibold shadow-sm'
                              : 'font-medium text-white/65 hover:text-white'
                          }`}
                        >
                          {t.form.fields.soloOption}
                        </button>
                        <button
                          type="button"
                          role="radio"
                          aria-checked={modoOperacion === 'equipo'}
                          onClick={() => handleModeChange('equipo')}
                          className={`py-2 px-2.5 rounded-lg text-xs transition-all whitespace-nowrap truncate cursor-pointer ${
                            modoOperacion === 'equipo'
                              ? 'bg-[#E6FF00] text-[#060608] font-semibold shadow-sm'
                              : 'font-medium text-white/65 hover:text-white'
                          }`}
                        >
                          {t.form.fields.teamOption}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Row 3: Optional Context / Recent Concern */}
                  <div>
                    <div className="flex items-baseline justify-between gap-2">
                      <label
                        htmlFor="eval-preocupacion"
                        className="block text-xs font-medium text-white/85"
                      >
                        {t.form.fields.concernLabel}
                      </label>
                      <span className="text-xs text-white/40 shrink-0">
                        {t.form.fields.optionalTag}
                      </span>
                    </div>
                    <textarea
                      id="eval-preocupacion"
                      rows={2}
                      maxLength={EVALUATION_SCHEMA_LIMITS.preocupacionMax}
                      value={preocupacionReciente}
                      onChange={(e) => setPreocupacionReciente(e.target.value)}
                      placeholder={t.form.fields.concernPlaceholder}
                      className="mt-1.5 w-full rounded-xl bg-white/[0.04] px-3.5 py-2.5 text-sm text-white placeholder:text-white/35 border border-white/12 hover:border-white/25 transition-colors focus:outline-none focus:border-[#E6FF00] focus:ring-1 focus:ring-[#E6FF00] resize-y"
                    />
                    {errors.preocupacionReciente && (
                      <p className="mt-1 text-xs font-medium text-[#E6FF00]" role="alert">
                        {t.form.validation.errorPrefix}: {errors.preocupacionReciente}
                      </p>
                    )}
                  </div>

                  {/* Primary Submit Action */}
                  <div className="pt-1">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 px-6 rounded-xl btn-electric text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99] transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E6FF00]"
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
                            {isRaptor
                              ? t.form.fields.raptorSubmitIdle
                              : isCrisis
                                ? t.form.fields.crisisSubmitIdle
                                : isPep
                                  ? t.form.fields.pepSubmitIdle
                                  : t.form.fields.submitIdle}
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {onOpenPrivacy && (
                <div className="relative z-10 mt-3.5 flex items-center justify-center sm:justify-start px-1">
                  <button
                    type="button"
                    onClick={onOpenPrivacy}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-white/55 hover:text-[#E6FF00] underline underline-offset-4 transition-colors cursor-pointer"
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
