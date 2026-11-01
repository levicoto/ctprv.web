import { useEffect } from 'react';
import { ArrowRight, ArrowUpRight, Lock, X } from 'lucide-react';
import { useI18n } from '../lib/i18n';
import CotoLogoMark from './CotoLogoMark';
import SignalMark, { SIGNAL_DIRECT_URL } from './SignalMark';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToEvaluation: () => void;
  onOpenPrivacy: () => void;
  onOpenCrisisGuide?: () => void;
}

export default function EmergencyModal({
  isOpen,
  onClose,
  onGoToEvaluation,
  onOpenPrivacy,
  onOpenCrisisGuide,
}: EmergencyModalProps) {
  const { t } = useI18n();

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t.emergencyModal.dialogAria}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md"
    >
      <div className="relative w-full max-w-lg">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-10 left-1/4 w-64 h-64 rounded-full electric-backlight"
        />

        <div className="relative z-10 w-full flex flex-col rounded-2xl glass-modal overflow-hidden text-white">
          {/* Modal Header */}
          <div className="px-6 sm:px-7 py-5 border-b border-white/10 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-white/55">
                <CotoLogoMark className="w-[18px] h-[18px] shrink-0" />
                <span className="text-[#E6FF00] font-semibold">{t.emergencyModal.kicker[0]}</span>
                <span aria-hidden="true">·</span>
                <span>{t.emergencyModal.kicker[1]}</span>
              </div>
              <h2 className="mt-2 text-xl sm:text-2xl font-semibold tracking-tight text-white">
                {t.emergencyModal.title}
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label={t.emergencyModal.closeAria}
              className="w-9 h-9 rounded-lg border border-white/12 bg-white/[0.04] hover:bg-white/[0.08] text-white/65 hover:text-white flex items-center justify-center transition-colors shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E6FF00]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body & Encrypted Signal Channel */}
          <div className="px-6 sm:px-7 py-6 space-y-5">
            <p className="text-sm text-white/70 leading-relaxed tracking-[0.01em]">
              {t.emergencyModal.body}
            </p>

            <div className="rounded-xl border border-white/12 bg-white/[0.04] p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg border border-white/15 bg-white/[0.06] text-[#E6FF00] flex items-center justify-center shrink-0">
                  <SignalMark className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-medium text-white/50 leading-none">
                    {t.emergencyModal.signalLabel}
                  </div>
                  <div className="mt-1 text-xs sm:text-sm font-semibold text-white">
                    {t.emergencyModal.signalSubtitle}
                  </div>
                </div>
              </div>

              <a
                href={SIGNAL_DIRECT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 px-4 rounded-lg btn-electric text-xs font-semibold inline-flex items-center gap-2 transition-all whitespace-nowrap shrink-0"
              >
                <SignalMark className="w-3.5 h-3.5 shrink-0" />
                <span>{t.emergencyModal.openSignalBtn}</span>
                <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
              </a>
            </div>

            {onOpenCrisisGuide && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenCrisisGuide();
                }}
                className="w-full py-2.5 px-4 rounded-xl border border-white/12 bg-white/[0.03] hover:border-[#E6FF00] text-xs font-medium text-white/85 hover:text-[#E6FF00] flex items-center justify-between gap-3 transition-colors cursor-pointer"
              >
                <span>{t.emergencyModal.crisisGuideCta}</span>
                <ArrowRight className="w-3.5 h-3.5 text-white/50 shrink-0" />
              </button>
            )}
          </div>

          {/* Subtle Preventive Redirect & Privacy Commitment */}
          <div className="px-6 sm:px-7 py-4 border-t border-white/10 bg-black/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                onClose();
                onGoToEvaluation();
              }}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-white/75 hover:text-[#E6FF00] transition-colors cursor-pointer text-left"
            >
              <span>{t.emergencyModal.preventiveCta}</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenPrivacy();
              }}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-white/55 hover:text-white underline underline-offset-4 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Lock className="w-3.5 h-3.5 shrink-0" />
              <span>{t.emergencyModal.privacyLink}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
