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
    const receiptFooter =
      lang === 'en'
        ? 'Coto Privado · Digital Identity & Patrimony Protection'
        : lang === 'pt'
          ? 'Coto Privado · Proteção de Identidade e Patrimônio Digital'
          : 'Coto Privado · Protección de Identidad y Patrimonio Digital';

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
      receiptFooter,
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
    const subject = `${c.mailSubjectPrefix} [${submittedRecord.folio}]: ${submittedRecord.nombreAlias}`;
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
    if (variant === 'solid') {
      return (
        <a
          href={SIGNAL_DIRECT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="h-9 px-3.5 rounded-lg btn-platinum text-xs font-medium inline-flex items-center gap-1.5 transition-all whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E2E8F0]"
        >
          <SignalMark className="w-3.5 h-3.5 shrink-0" />
          <span>{label}</span>
          <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
        </a>
      );
    }

    return (
      <a
        href={SIGNAL_DIRECT_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/[0.10] bg-white/[0.02] text-[#E2E8F0] text-sm font-medium hover:border-[#E2E8F0]/45 hover:bg-white/[0.04] transition-colors whitespace-nowrap shrink-0"
      >
        <SignalMark className="w-3.5 h-3.5 icon-slate shrink-0" />
        <span>{label}</span>
        <ArrowUpRight className="w-3.5 h-3.5 icon-slate shrink-0" />
      </a>
    );
  };

  return (
    <section id="evaluacion" className="relative z-10 py-14 sm:py-18 border-t border-white/[0.07]">
      <div className="max-w-[1200px] xl:max-w-[1280px] mx-auto px-6 sm:px-8 w-full">
        <ParallaxLayer speed={0.016} maxOffset={6} desktopOnly>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Context Column */}
            <div className="lg:col-span-5 lg:pr-2">
              <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#F1F5F9] text-balance">
                {isRaptor
                  ? t.form.raptorHeadline
                  : isCrisis
                    ? t.form.crisisHeadline
                    : isPep
                      ? t.form.pepHeadline
                      : t.form.headline}
              </h2>
              <p className="mt-3 text-sm sm:text-base font-light text-[#94A3B8] leading-relaxed tracking-[0.01em] max-w-[48ch]">
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
                    className="text-xs font-medium text-[#E2E8F0] hover:text-white underline decoration-[#94A3B8]/50 hover:decoration-[#E2E8F0] underline-offset-4 transition-colors cursor-pointer"
                  >
                    {t.form.pepSwitchToGeneral}
                  </button>
                </div>
              )}

              {/* Unlocked Direct Contact (Post-Folio) & Discreet Incident Disclosure */}
              <div
                className={`mt-6 glass-panel rounded-2xl ${
                  submittedRecord ? 'p-5 sm:p-6' : 'px-4 py-3.5'
                }`}
              >
                {submittedRecord ? (
                  <>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-normal text-[#94A3B8]">
                      <span className="text-[#E2E8F0] font-medium">
                        {t.form.signalCard.unlockedKicker(submittedRecord.folio)[0]}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums font-medium text-[#E2E8F0]">
                        {t.form.signalCard.unlockedKicker(submittedRecord.folio)[1]}
                      </span>
                    </div>

                    <h3 className="mt-2 text-base font-medium tracking-tight text-[#F1F5F9]">
                      {t.form.signalCard.unlockedTitle}
                    </h3>

                    <p className="mt-1.5 text-sm font-light text-[#94A3B8] leading-relaxed tracking-[0.01em]">
                      {t.form.signalCard.unlockedBody(submittedRecord.folio)}
                    </p>

                    {/* Unlocked Row 1: Direct Signal Encrypted Bridge */}
                    <div className="group mt-4 pt-4 border-t border-white/[0.07] flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg border border-white/[0.10] bg-white/[0.03] flex items-center justify-center shrink-0">
                          <SignalMark className="w-4 h-4 icon-slate" />
                        </div>
                        <div>
                          <div className="text-[11px] font-normal text-[#94A3B8] leading-none">
                            {t.form.signalCard.userLabel}
                          </div>
                          <div className="mt-1 text-xs font-medium text-[#E2E8F0]">
                            {t.form.signalCard.signalSubtitle}
                          </div>
                        </div>
                      </div>

                      {renderSignalLaunchLink(t.form.signalCard.openSignalBtn, 'solid')}
                    </div>

                    {/* Unlocked Row 2: Direct Email (help@coto.lat) with Native App + Webmail Launchers */}
                    <div className="mt-4 pt-4 border-t border-white/[0.07] space-y-3">
                      <div className="group flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg border border-white/[0.10] bg-white/[0.03] flex items-center justify-center shrink-0">
                            <Mail className="w-4 h-4 icon-slate" />
                          </div>
                          <div>
                            <div className="text-[11px] font-normal text-[#94A3B8] leading-none">
                              {t.form.signalCard.emailLabel}
                            </div>
                            <div className="mt-1 text-sm font-medium text-[#E2E8F0] tracking-tight select-all">
                              {CONTACT_EMAIL}
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleCopyEmail}
                          className="group/copy h-8 px-3 rounded-lg border border-white/[0.10] bg-white/[0.02] hover:border-[#E2E8F0]/45 hover:text-[#E2E8F0] text-[#CBD5E1] text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E2E8F0]"
                        >
                          {emailCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-[#E2E8F0] shrink-0" />
                              <span className="text-[#E2E8F0]">
                                {t.form.signalCard.copiedEmailBtn}
                              </span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-[#94A3B8] group-hover/copy:text-[#E2E8F0] transition-colors shrink-0" />
                              <span>{t.form.signalCard.copyEmailBtn}</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <a
                          href={mailtoHref}
                          className="h-8 px-3 rounded-lg btn-platinum text-xs font-medium inline-flex items-center gap-1.5 transition-all whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E2E8F0]"
                        >
                          <Mail className="w-3.5 h-3.5 shrink-0" />
                          <span>{t.form.signalCard.openMailAppBtn}</span>
                        </a>
                        <a
                          href={gmailHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group h-8 px-3 rounded-lg border border-white/[0.10] bg-white/[0.02] hover:border-[#E2E8F0]/45 hover:text-[#E2E8F0] text-[#CBD5E1] text-xs font-medium inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E2E8F0]"
                        >
                          <span>{t.form.signalCard.openGmailBtn}</span>
                          <ArrowUpRight className="w-3.5 h-3.5 icon-slate shrink-0" />
                        </a>
                        <a
                          href={outlookHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group h-8 px-3 rounded-lg border border-white/[0.10] bg-white/[0.02] hover:border-[#E2E8F0]/45 hover:text-[#E2E8F0] text-[#CBD5E1] text-xs font-medium inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E2E8F0]"
                        >
                          <span>{t.form.signalCard.openOutlookBtn}</span>
                          <ArrowUpRight className="w-3.5 h-3.5 icon-slate shrink-0" />
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
                      className="group w-full flex items-center justify-between gap-3 text-left text-xs font-medium text-[#CBD5E1] hover:text-[#E2E8F0] transition-colors cursor-pointer py-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E2E8F0]"
                    >
                      <span className="inline-flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 icon-slate shrink-0" />
                        <span>{t.form.signalCard.emergencyToggle}</span>
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 icon-slate shrink-0 transition-transform duration-200 ${
                          emergencyOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {emergencyOpen && (
                      <div className="mt-3.5 pt-3.5 border-t border-white/[0.07] space-y-3">
                        <p className="text-xs font-light text-[#94A3B8] leading-relaxed tracking-[0.01em]">
                          {t.form.signalCard.emergencyNotice}
                        </p>

                        <div className="group flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg border border-white/[0.10] bg-white/[0.03] flex items-center justify-center shrink-0">
                              <SignalMark className="w-4 h-4 icon-slate" />
                            </div>
                            <div>
                              <div className="text-[11px] font-normal text-[#94A3B8] leading-none">
                                {t.form.signalCard.emergencySignalLabel}
                              </div>
                              <div className="mt-1 text-xs font-medium text-[#E2E8F0]">
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

            {/* Right Cut-Glass Form / Confirmation Container Fed by Muted Cobalt Sphere */}
            <div className="relative lg:col-span-7 w-full">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-10 right-4 w-80 h-80 rounded-full cobalt-backlight"
              />

              {submittedRecord ? (
                <div className="relative z-10 glass-panel-featured rounded-2xl p-6 sm:p-8 text-[#E2E8F0]">
                  <div className="flex items-center justify-between gap-4 pb-5 border-b border-white/[0.07]">
                    <h3 className="text-xl sm:text-2xl font-medium text-[#F1F5F9]">
                      {t.form.confirmation.title}
                    </h3>
                    <div className="w-9 h-9 rounded-xl bg-[#E2E8F0] text-[#0A0F1C] flex items-center justify-center shrink-0">
                      <Check className="w-4 h-4 stroke-[2.25]" />
                    </div>
                  </div>

                  <dl className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                    <div>
                      <dt className="text-xs font-light text-[#94A3B8]">
                        {t.form.confirmation.folioLabel}
                      </dt>
                      <dd className="mt-1 font-medium text-[#E2E8F0] tabular-nums">
                        {submittedRecord.folio}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-light text-[#94A3B8]">
                        {t.form.confirmation.tierLabel}
                      </dt>
                      <dd className="mt-1 font-medium text-[#E2E8F0]">
                        {localizedTierLabel(submittedRecord.tierSugerido)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-light text-[#94A3B8]">
                        {t.form.confirmation.nameLabel}
                      </dt>
                      <dd className="mt-1 font-medium text-[#E2E8F0] break-words">
                        {submittedRecord.nombreAlias}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-light text-[#94A3B8]">
                        {t.form.confirmation.roleLabel}
                      </dt>
                      <dd className="mt-1 font-medium text-[#E2E8F0] break-words">
                        {submittedRecord.rolPrincipal}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-light text-[#94A3B8]">
                        {t.form.confirmation.refLabel}
                      </dt>
                      <dd className="mt-1 text-sm font-light text-[#CBD5E1] break-all">
                        {submittedRecord.enlaceReferencia}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-light text-[#94A3B8]">
                        {t.form.confirmation.modeLabel}
                      </dt>
                      <dd className="mt-1 font-light text-[#CBD5E1]">
                        {submittedRecord.modoOperacion === 'solo'
                          ? t.form.confirmation.modeSoloDesc
                          : t.form.confirmation.modeTeamDesc}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-6 pt-5 border-t border-white/[0.07] flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={handleDownloadDossier}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl btn-platinum text-sm font-medium transition-all whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>{t.form.confirmation.downloadBtn}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleResetNew}
                      className="group inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-[#94A3B8] text-sm font-medium hover:text-[#E2E8F0] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4 icon-slate" />
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
                      className="rounded-xl border border-[#E2E8F0]/35 bg-white/[0.03] px-4 py-3 text-xs font-light text-[#E2E8F0] flex items-start gap-2.5"
                    >
                      <AlertCircle className="w-4 h-4 text-[#94A3B8] shrink-0 mt-0.5" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  {/* Row 1: Side-by-Side Name / Alias + Role */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="eval-nombre"
                        className="block text-xs font-medium text-[#CBD5E1]"
                      >
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
                        className={`mt-1.5 w-full rounded-xl bg-[#0A0F1C]/55 px-3.5 py-2.5 text-sm font-light text-[#E2E8F0] placeholder:text-[#94A3B8]/50 border transition-colors focus:outline-none focus:border-[#E2E8F0]/60 focus:ring-1 focus:ring-[#E2E8F0]/35 ${
                          errors.nombreAlias
                            ? 'border-[#E2E8F0]/65'
                            : 'border-white/[0.10] hover:border-white/[0.18]'
                        }`}
                      />
                      {errors.nombreAlias && (
                        <p className="mt-1 text-xs font-normal text-[#E2E8F0]" role="alert">
                          {t.form.validation.errorPrefix}: {errors.nombreAlias}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="eval-rol"
                        className="block text-xs font-medium text-[#CBD5E1]"
                      >
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
                        className={`mt-1.5 w-full rounded-xl bg-[#0A0F1C]/55 px-3.5 py-2.5 text-sm font-light text-[#E2E8F0] placeholder:text-[#94A3B8]/50 border transition-colors focus:outline-none focus:border-[#E2E8F0]/60 focus:ring-1 focus:ring-[#E2E8F0]/35 ${
                          errors.rolPrincipal
                            ? 'border-[#E2E8F0]/65'
                            : 'border-white/[0.10] hover:border-white/[0.18]'
                        }`}
                      />
                      {errors.rolPrincipal && (
                        <p className="mt-1 text-xs font-normal text-[#E2E8F0]" role="alert">
                          {t.form.validation.errorPrefix}: {errors.rolPrincipal}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Row 2: Reference Link + Operating Structure */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
                    <div className="sm:col-span-7">
                      <label
                        htmlFor="eval-enlace"
                        className="block text-xs font-medium text-[#CBD5E1]"
                      >
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
                        className={`mt-1.5 w-full rounded-xl bg-[#0A0F1C]/55 px-3.5 py-2.5 text-sm font-light text-[#E2E8F0] placeholder:text-[#94A3B8]/50 border transition-colors focus:outline-none focus:border-[#E2E8F0]/60 focus:ring-1 focus:ring-[#E2E8F0]/35 ${
                          errors.enlaceReferencia
                            ? 'border-[#E2E8F0]/65'
                            : 'border-white/[0.10] hover:border-white/[0.18]'
                        }`}
                      />
                      {errors.enlaceReferencia && (
                        <p className="mt-1 text-xs font-normal text-[#E2E8F0]" role="alert">
                          {t.form.validation.errorPrefix}: {errors.enlaceReferencia}
                        </p>
                      )}
                    </div>

                    <div className="sm:col-span-5">
                      <span className="block text-xs font-medium text-[#CBD5E1]">
                        {t.form.fields.modeLabel}
                      </span>
                      <div
                        role="radiogroup"
                        aria-label={t.form.fields.modeAria}
                        className="mt-1.5 grid grid-cols-2 gap-1 p-1 rounded-xl bg-[#0A0F1C]/55 border border-white/[0.10]"
                      >
                        <button
                          type="button"
                          role="radio"
                          aria-checked={modoOperacion === 'solo'}
                          onClick={() => handleModeChange('solo')}
                          className={`py-2 px-2.5 rounded-lg text-xs transition-all whitespace-nowrap truncate cursor-pointer ${
                            modoOperacion === 'solo'
                              ? 'bg-[#E2E8F0] text-[#0A0F1C] font-medium shadow-sm'
                              : 'font-normal text-[#94A3B8] hover:text-[#E2E8F0]'
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
                              ? 'bg-[#E2E8F0] text-[#0A0F1C] font-medium shadow-sm'
                              : 'font-normal text-[#94A3B8] hover:text-[#E2E8F0]'
                          }`}
                        >
                          {t.form.fields.teamOption}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Row 3: Optional Executive Context */}
                  <div>
                    <div className="flex items-baseline justify-between gap-2">
                      <label
                        htmlFor="eval-preocupacion"
                        className="block text-xs font-medium text-[#CBD5E1]"
                      >
                        {t.form.fields.concernLabel}
                      </label>
                      <span className="text-xs font-light text-[#94A3B8]/80 shrink-0">
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
                      className="mt-1.5 w-full rounded-xl bg-[#0A0F1C]/55 px-3.5 py-2.5 text-sm font-light text-[#E2E8F0] placeholder:text-[#94A3B8]/50 border border-white/[0.10] hover:border-white/[0.18] transition-colors focus:outline-none focus:border-[#E2E8F0]/60 focus:ring-1 focus:ring-[#E2E8F0]/35 resize-y"
                    />
                    {errors.preocupacionReciente && (
                      <p className="mt-1 text-xs font-normal text-[#E2E8F0]" role="alert">
                        {t.form.validation.errorPrefix}: {errors.preocupacionReciente}
                      </p>
                    )}
                  </div>

                  {/* Primary Submit Action */}
                  <div className="pt-1">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 px-6 rounded-xl btn-platinum text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99] transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E2E8F0]"
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
                    className="group inline-flex items-center gap-1.5 text-xs font-normal text-[#94A3B8] hover:text-[#E2E8F0] underline decoration-[#94A3B8]/40 hover:decoration-[#E2E8F0] underline-offset-4 transition-colors cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5 icon-slate shrink-0" />
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
