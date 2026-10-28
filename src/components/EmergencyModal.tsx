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
}

export default function EmergencyModal({
  isOpen,
  onClose,
  onGoToEvaluation,
  onOpenPrivacy,
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-zinc-950/45 backdrop-blur-sm"
    >
      <div className="w-full max-w-lg flex flex-col rounded-2xl bg-white/95 backdrop-blur-xl border border-zinc-200/90 shadow-2xl shadow-zinc-950/15 overflow-hidden text-zinc-950">
        {/* Modal Header */}
        <div className="px-6 sm:px-7 py-5 border-b border-zinc-200/80 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
              <CotoLogoMark className="w-[18px] h-[18px] shrink-0" />
              <span className="text-zinc-800">{t.emergencyModal.kicker[0]}</span>
              <span aria-hidden="true">·</span>
              <span>{t.emergencyModal.kicker[1]}</span>
            </div>
            <h2 className="mt-2 text-xl sm:text-2xl font-semibold tracking-tight text-zinc-950">
              {t.emergencyModal.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t.emergencyModal.closeAria}
            className="w-9 h-9 rounded-lg border border-zinc-200/90 bg-white hover:bg-zinc-100 text-zinc-600 hover:text-zinc-950 flex items-center justify-center transition-colors shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body & Encrypted Signal Channel */}
        <div className="px-6 sm:px-7 py-6 space-y-5">
          <p className="text-sm text-zinc-600 leading-relaxed">{t.emergencyModal.body}</p>

          <div className="rounded-xl border border-zinc-200/90 bg-zinc-50/80 p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-zinc-950 text-white flex items-center justify-center shrink-0">
                <SignalMark className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] font-medium text-zinc-500 leading-none">
                  {t.emergencyModal.signalLabel}
                </div>
                <div className="mt-1 text-xs sm:text-sm font-semibold text-zinc-950">
                  {t.emergencyModal.signalSubtitle}
                </div>
              </div>
            </div>

            <a
              href={SIGNAL_DIRECT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="h-9 px-4 rounded-lg bg-zinc-950 text-white hover:bg-zinc-800 text-xs font-medium inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
            >
              <SignalMark className="w-3.5 h-3.5 shrink-0" />
              <span>{t.emergencyModal.openSignalBtn}</span>
              <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
            </a>
          </div>
        </div>

        {/* Subtle Preventive Redirect & Privacy Commitment */}
        <div className="px-6 sm:px-7 py-4 border-t border-zinc-200/80 bg-zinc-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              onClose();
              onGoToEvaluation();
            }}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-700 hover:text-zinc-950 transition-colors cursor-pointer text-left"
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
            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-950 underline underline-offset-4 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Lock className="w-3.5 h-3.5 shrink-0" />
            <span>{t.emergencyModal.privacyLink}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
