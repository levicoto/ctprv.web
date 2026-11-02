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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#060A14]/80 backdrop-blur-md"
    >
      <div className="relative w-full max-w-2xl">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-10 right-12 w-72 h-72 rounded-full cobalt-backlight-soft"
        />

        <div className="relative z-10 w-full max-h-[88vh] flex flex-col rounded-2xl glass-modal overflow-hidden text-[#E2E8F0]">
          {/* Modal Header */}
          <div className="px-6 sm:px-8 py-5 border-b border-white/[0.07] flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-[#E2E8F0]">
                <CotoLogoMark className="w-[18px] h-[18px] shrink-0" />
                <span>{t.privacy.kicker}</span>
              </div>
              <h2 className="mt-2 text-xl sm:text-2xl font-medium tracking-tight text-[#F1F5F9]">
                {t.privacy.title}
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label={t.privacy.closeAria}
              className="group w-9 h-9 rounded-lg border border-white/[0.10] bg-white/[0.02] hover:bg-white/[0.06] flex items-center justify-center transition-colors shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E2E8F0]"
            >
              <X className="w-4 h-4 icon-slate" />
            </button>
          </div>

          {/* Scrollable Clauses */}
          <div className="px-6 sm:px-8 py-6 overflow-y-auto space-y-6">
            <p className="text-sm sm:text-base font-light text-[#94A3B8] leading-relaxed tracking-[0.01em]">
              {t.privacy.intro}
            </p>

            <div className="divide-y divide-white/[0.07] border-t border-white/[0.07]">
              {t.privacy.clauses.map((clause) => (
                <div key={clause.num} className="py-5 first:pt-5 last:pb-1">
                  <div className="flex items-baseline gap-3">
                    <span className="text-xs font-medium text-[#94A3B8] tabular-nums shrink-0">
                      {clause.num}
                    </span>
                    <h3 className="text-sm sm:text-base font-medium text-[#E2E8F0] tracking-tight">
                      {clause.title}
                    </h3>
                  </div>
                  <p className="mt-2 text-sm font-light text-[#94A3B8] leading-relaxed tracking-[0.01em]">
                    {clause.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Modal Footer with Direct Encrypted Contact */}
          <div className="px-6 sm:px-8 py-4 border-t border-white/[0.07] bg-[#0A0F1C]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={SIGNAL_DIRECT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group h-9 px-3.5 rounded-lg border border-white/[0.10] bg-white/[0.02] hover:border-[#E2E8F0]/45 hover:text-[#E2E8F0] text-[#CBD5E1] text-xs font-medium inline-flex items-center gap-2 transition-colors whitespace-nowrap"
              >
                <SignalMark className="w-3.5 h-3.5 icon-slate shrink-0" />
                <span>{t.privacy.openSignalBtn}</span>
                <ArrowUpRight className="w-3.5 h-3.5 icon-slate shrink-0" />
              </a>

              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="group h-9 px-3.5 rounded-lg border border-white/[0.10] bg-white/[0.02] hover:border-[#E2E8F0]/45 text-[#94A3B8] hover:text-[#E2E8F0] text-xs font-medium inline-flex items-center gap-1.5 transition-colors whitespace-nowrap"
              >
                <Mail className="w-3.5 h-3.5 icon-slate shrink-0" />
                <span>{CONTACT_EMAIL}</span>
              </a>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="h-9 px-4 rounded-lg btn-platinum text-xs font-medium transition-all inline-flex items-center justify-center whitespace-nowrap cursor-pointer shrink-0"
            >
              {t.privacy.closeBtn}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
