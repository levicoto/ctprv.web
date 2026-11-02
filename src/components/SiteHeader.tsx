import { MouseEvent, useEffect, useId, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Globe,
  Menu,
  ShieldAlert,
  X,
} from 'lucide-react';
import { type Language, useI18n } from '../lib/i18n';
import CotoLogoMark from './CotoLogoMark';

const LANGUAGES: { code: Language; short: string; name: string }[] = [
  { code: 'es', short: 'ES', name: 'Español' },
  { code: 'en', short: 'EN', name: 'English' },
  { code: 'pt', short: 'PT', name: 'Português' },
];

export interface HeaderLinkItem {
  label: string;
  href: string;
  onSelect: () => void;
}

interface SiteHeaderProps {
  desktopLinks: HeaderLinkItem[];
  mobilePrimaryLinks: HeaderLinkItem[];
  mobileSecondaryLinks?: HeaderLinkItem[];
  ctaLabel: string;
  mobileCtaLabel?: string;
  onCtaClick: () => void;
  onBrandClick: () => void;
  isSubpage?: boolean;
  backLabel?: string;
  onEmergencyClick?: () => void;
}

export default function SiteHeader({
  desktopLinks,
  mobilePrimaryLinks,
  mobileSecondaryLinks = [],
  ctaLabel,
  mobileCtaLabel,
  onCtaClick,
  onBrandClick,
  isSubpage = false,
  backLabel,
  onEmergencyClick,
}: SiteHeaderProps) {
  const { lang, setLang, t } = useI18n();
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement | null>(null);
  const drawerId = useId();

  useEffect(() => {
    if (!langMenuOpen) return;

    const handlePointerDown = (e: PointerEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLangMenuOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [langMenuOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [mobileMenuOpen]);

  const currentLangItem = LANGUAGES.find((item) => item.code === lang) ?? LANGUAGES[0];

  const handleLinkClick = (e: MouseEvent<HTMLAnchorElement>, action: () => void) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    setLangMenuOpen(false);
    action();
  };

  return (
    <>
      <header className="sticky top-0 z-40 header-glass">
        <div className="max-w-[1200px] xl:max-w-[1280px] mx-auto px-5 sm:px-8 h-15 lg:h-16 w-full flex items-center justify-between gap-6">
          {/* Zone 1: Brand Lockup (or Subpage Back + Brand) */}
          <div className="flex items-center gap-3 min-w-0 shrink-0">
            {isSubpage ? (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onBrandClick();
                }}
                className="group inline-flex items-center gap-2 text-sm font-medium tracking-tight text-[#F1F5F9] hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E2E8F0]"
              >
                <ArrowLeft className="w-4 h-4 icon-slate shrink-0" />
                <CotoLogoMark className="w-5 h-5 shrink-0" />
                <span>Coto Privado</span>
                {backLabel && (
                  <span className="hidden sm:inline text-xs font-light text-[#94A3B8] group-hover:text-[#CBD5E1]">
                    · {backLabel}
                  </span>
                )}
              </button>
            ) : (
              <a
                href="#inicio"
                onClick={(e) => handleLinkClick(e, onBrandClick)}
                className="inline-flex items-center gap-2.5 text-base sm:text-lg font-medium tracking-tight text-[#F1F5F9] hover:text-white transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E2E8F0]"
              >
                <CotoLogoMark className="w-6 h-6 shrink-0" />
                <span>Coto Privado</span>
              </a>
            )}
          </div>

          {/* Zone 2: Uncluttered Desktop Navigation (lg+ only, 4 concise links) */}
          <nav
            aria-label={t.nav.ariaMain}
            className="hidden lg:flex items-center gap-7 xl:gap-8 text-sm font-normal text-[#94A3B8]"
          >
            {desktopLinks.map((link) => (
              <a
                key={link.href + link.label}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.onSelect)}
                className="hover:text-[#E2E8F0] hover:underline decoration-[#E2E8F0]/60 underline-offset-4 transition-colors whitespace-nowrap shrink-0"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Zone 3: Desktop Controls (lg+) & Mobile Menu Trigger (<lg) */}
          <div className="flex items-center justify-end gap-2.5 shrink-0">
            {/* Desktop Language Dropdown + Primary Platinum CTA */}
            <div className="hidden lg:flex items-center gap-2.5">
              <div ref={langMenuRef} className="relative">
                <button
                  type="button"
                  aria-haspopup="listbox"
                  aria-expanded={langMenuOpen}
                  aria-label={t.nav.langSelectorAria}
                  onClick={() => setLangMenuOpen((prev) => !prev)}
                  className="group h-9 px-2.5 rounded-lg border border-white/[0.10] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.20] text-[#E2E8F0] text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E2E8F0]"
                >
                  <Globe className="w-3.5 h-3.5 icon-slate shrink-0" />
                  <span>{currentLangItem.short}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 icon-slate shrink-0 transition-transform duration-150 ${
                      langMenuOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {langMenuOpen && (
                  <div
                    role="listbox"
                    aria-label={t.nav.langSelectorAria}
                    className="absolute right-0 top-[calc(100%+0.5rem)] z-50 min-w-[160px] p-1.5 rounded-xl glass-modal"
                  >
                    {LANGUAGES.map((item) => {
                      const active = lang === item.code;
                      return (
                        <button
                          key={item.code}
                          type="button"
                          role="option"
                          aria-selected={active}
                          onClick={() => {
                            setLang(item.code);
                            setLangMenuOpen(false);
                          }}
                          className={`w-full px-3 py-2 rounded-lg text-xs flex items-center justify-between gap-3 transition-colors cursor-pointer whitespace-nowrap ${
                            active
                              ? 'bg-[#E2E8F0] text-[#0A0F1C] font-medium'
                              : 'font-normal text-[#CBD5E1] hover:bg-white/[0.05] hover:text-[#E2E8F0]'
                          }`}
                        >
                          <span>{item.name}</span>
                          {active ? (
                            <Check className="w-3.5 h-3.5 shrink-0" />
                          ) : (
                            <span className="text-[11px] text-[#94A3B8]">{item.short}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  setLangMenuOpen(false);
                  onCtaClick();
                }}
                className="h-9 px-4 rounded-lg btn-platinum text-xs xl:text-sm font-medium transition-all inline-flex items-center justify-center whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E2E8F0]"
              >
                {ctaLabel}
              </button>
            </div>

            {/* Mobile & Tablet Accessible Menu Toggle (<1024px, >= 44px touch target) */}
            <button
              type="button"
              aria-expanded={mobileMenuOpen}
              aria-controls={drawerId}
              aria-label={mobileMenuOpen ? t.nav.menuCloseAria : t.nav.menuOpenAria}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="lg:hidden group min-h-11 px-3.5 rounded-xl border border-white/[0.11] bg-white/[0.025] hover:bg-white/[0.06] hover:border-white/[0.22] text-[#E2E8F0] text-xs font-medium inline-flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E2E8F0]"
            >
              <span>{mobileMenuOpen ? t.nav.menuClose : t.nav.menuOpen}</span>
              {mobileMenuOpen ? (
                <X className="w-4 h-4 icon-slate shrink-0" />
              ) : (
                <Menu className="w-4 h-4 icon-slate shrink-0" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile & Tablet Cut-Glass Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 top-15 z-30 lg:hidden bg-[#060A14]/78 backdrop-blur-sm flex flex-col"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setMobileMenuOpen(false);
            }
          }}
        >
          <div
            id={drawerId}
            role="dialog"
            aria-modal="true"
            aria-label={t.nav.ariaMain}
            className="mx-4 sm:mx-8 mt-2.5 rounded-2xl glass-modal overflow-y-auto max-h-[calc(100dvh-5.25rem)] p-5 sm:p-6 text-[#E2E8F0]"
          >
            {/* Primary Section Links */}
            <nav aria-label={t.nav.ariaMain} className="divide-y divide-white/[0.07]">
              {mobilePrimaryLinks.map((link) => (
                <a
                  key={link.href + link.label}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.onSelect)}
                  className="group min-h-12 py-3 flex items-center justify-between gap-4 text-base font-normal text-[#E2E8F0] hover:text-white transition-colors"
                >
                  <span>{link.label}</span>
                  <ArrowRight className="w-4 h-4 icon-slate shrink-0 transition-transform duration-150 group-hover:translate-x-0.5" />
                </a>
              ))}
            </nav>

            {/* Specialized Units / Secondary Subpage Links */}
            {mobileSecondaryLinks.length > 0 && (
              <div className="mt-4 pt-4 border-t border-white/[0.07]">
                <div className="text-[11px] font-normal text-[#94A3B8] tracking-[0.02em]">
                  {t.nav.mobileUnitsLabel}
                </div>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {mobileSecondaryLinks.map((link) => (
                    <a
                      key={link.href + link.label}
                      href={link.href}
                      onClick={(e) => handleLinkClick(e, link.onSelect)}
                      className="group min-h-11 px-3.5 py-2.5 rounded-xl border border-white/[0.09] bg-white/[0.02] hover:border-[#E2E8F0]/40 hover:bg-white/[0.04] text-xs font-medium text-[#CBD5E1] hover:text-[#E2E8F0] flex items-center justify-between gap-2 transition-colors"
                    >
                      <span className="truncate">{link.label}</span>
                      <ArrowRight className="w-3.5 h-3.5 icon-slate shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Segmented Language Switcher */}
            <div className="mt-4 pt-4 border-t border-white/[0.07]">
              <div className="text-[11px] font-normal text-[#94A3B8] tracking-[0.02em]">
                {t.nav.mobileLangLabel}
              </div>
              <div
                role="group"
                aria-label={t.nav.langSelectorAria}
                className="mt-2 grid grid-cols-3 gap-1 p-1 rounded-xl bg-[#0A0F1C]/65 border border-white/[0.09]"
              >
                {LANGUAGES.map((item) => {
                  const active = lang === item.code;
                  return (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => setLang(item.code)}
                      className={`min-h-10 px-2.5 rounded-lg text-xs transition-colors cursor-pointer whitespace-nowrap ${
                        active
                          ? 'bg-[#E2E8F0] text-[#0A0F1C] font-medium'
                          : 'font-normal text-[#94A3B8] hover:text-[#E2E8F0]'
                      }`}
                    >
                      {item.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Primary Mobile CTA + Optional Emergency Desk Trigger */}
            <div className="mt-5 pt-4 border-t border-white/[0.07] space-y-3">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onCtaClick();
                }}
                className="w-full min-h-12 px-5 py-3 rounded-xl btn-platinum text-sm font-medium transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
              >
                <span>{mobileCtaLabel ?? ctaLabel}</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>

              {onEmergencyClick && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onEmergencyClick();
                  }}
                  className="group w-full min-h-10 py-2 text-xs font-normal text-[#94A3B8] hover:text-[#E2E8F0] flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <ShieldAlert className="w-4 h-4 icon-slate shrink-0" />
                  <span className="underline decoration-[#94A3B8]/40 group-hover:decoration-[#E2E8F0] underline-offset-4">
                    {t.hero.emergencyTrigger}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
