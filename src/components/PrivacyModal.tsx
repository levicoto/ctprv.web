import { useEffect } from 'react';
import { ArrowUpRight, Mail, X } from 'lucide-react';
import { useI18n } from '../lib/i18n';
import CotoLogoMark from './CotoLogoMark';
import SignalMark, { CONTACT_EMAIL, SIGNAL_DIRECT_URL } from './SignalMark';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
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
      aria-label={t.privacy.dialogAria}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-zinc-950/45 backdrop-blur-sm"
    >
      <div className="w-full max-w-2xl max-h-[88vh] flex flex-col rounded-2xl bg-white/95 backdrop-blur-xl border border-zinc-200/90 shadow-2xl shadow-zinc-950/15 overflow-hidden text-zinc-950">
        {/* Modal Header */}
        <div className="px-6 sm:px-8 py-5 border-b border-zinc-200/80 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
              <CotoLogoMark className="w-[18px] h-[18px] shrink-0" />
              <span className="text-zinc-800">{t.privacy.kicker[0]}</span>
              <span aria-hidden="true">·</span>
              <span>{t.privacy.kicker[1]}</span>
            </div>
            <h2 className="mt-2 text-xl sm:text-2xl font-semibold tracking-tight text-zinc-950">
              {t.privacy.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t.privacy.closeAria}
            className="w-9 h-9 rounded-lg border border-zinc-200/90 bg-white hover:bg-zinc-100 text-zinc-600 hover:text-zinc-950 flex items-center justify-center transition-colors shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Clauses */}
        <div className="px-6 sm:px-8 py-6 overflow-y-auto space-y-6">
          <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">{t.privacy.intro}</p>

          <div className="divide-y divide-zinc-200/80 border-t border-zinc-200/80">
            {t.privacy.clauses.map((clause) => (
              <div key={clause.num} className="py-5 first:pt-5 last:pb-1">
                <div className="flex items-baseline gap-2.5">
                  <span className="text-xs font-medium text-zinc-400 tabular-nums shrink-0">
                    {clause.num}
                  </span>
                  <h3 className="text-sm sm:text-base font-semibold text-zinc-950 tracking-tight">
                    {clause.title}
                  </h3>
                </div>
                <p className="mt-2 text-sm text-zinc-600 leading-relaxed">{clause.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer with Direct Encrypted Contact */}
        <div className="px-6 sm:px-8 py-4 border-t border-zinc-200/80 bg-zinc-50/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={SIGNAL_DIRECT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="h-9 px-3.5 rounded-lg border border-zinc-300 bg-white hover:border-zinc-950 text-zinc-900 text-xs font-medium inline-flex items-center gap-2 transition-colors whitespace-nowrap"
            >
              <SignalMark className="w-3.5 h-3.5 text-zinc-900 shrink-0" />
              <span>{t.privacy.openSignalBtn}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
            </a>

            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="h-9 px-3.5 rounded-lg border border-zinc-200 bg-white hover:border-zinc-400 text-zinc-700 hover:text-zinc-950 text-xs font-medium inline-flex items-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <Mail className="w-3.5 h-3.5 shrink-0" />
              <span>{CONTACT_EMAIL}</span>
            </a>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="h-9 px-4 rounded-lg bg-zinc-950 text-white text-xs font-medium hover:bg-zinc-800 transition-colors inline-flex items-center justify-center whitespace-nowrap cursor-pointer shrink-0"
          >
            {t.privacy.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );
}
