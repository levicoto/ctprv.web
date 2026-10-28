import { MouseEvent, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, ChevronDown, Globe } from 'lucide-react';
import RaptorEye3D from './RaptorEye3D';
import EvaluationForm from './EvaluationForm';
import CotoLogoMark from './CotoLogoMark';
import ParallaxLayer, {
  AmbientParallaxBackdrop,
  smoothScrollToSection,
} from './ParallaxLayer';
import { type Language, useI18n } from '../lib/i18n';

const LANGUAGES: { code: Language; short: string; name: string }[] = [
  { code: 'es', short: 'ES', name: 'Español' },
  { code: 'en', short: 'EN', name: 'English' },
  { code: 'pt', short: 'PT', name: 'Português' },
];

interface PalantirRaptorPageProps {
  onBackToMain: () => void;
  onOpenAdmin: () => void;
  onOpenPrivacy: () => void;
}

export default function PalantirRaptorPage({
  onBackToMain,
  onOpenAdmin,
  onOpenPrivacy,
}: PalantirRaptorPageProps) {
  const { lang, setLang, t } = useI18n();
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    document.title = t.raptorMetaTitle;
  }, [t.raptorMetaTitle]);

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

  const handleAnchorClick = (e: MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    smoothScrollToSection(sectionId);
  };

  const handleScrollToForm = () => {
    smoothScrollToSection('evaluacion');
    window.setTimeout(() => {
      const firstInput = document.getElementById('eval-nombre');
      firstInput?.focus({ preventScroll: true });
    }, 620);
  };

  const currentLangItem = LANGUAGES.find((item) => item.code === lang) ?? LANGUAGES[0];

  return (
    <div className="relative min-h-screen architectural-canvas text-zinc-950 flex flex-col overflow-x-clip">
      <AmbientParallaxBackdrop />

      {/* Symmetric Architectural Top Bar */}
      <header className="sticky top-0 z-40 header-glass">
        <div className="max-w-[1200px] xl:max-w-[1280px] mx-auto px-6 sm:px-8 py-3.5 w-full flex items-center justify-between md:grid md:grid-cols-[1fr_auto_1fr] gap-6 lg:gap-8">
          {/* Zone 1: Compact Back Navigation */}
          <div className="flex items-center justify-self-start min-w-0">
            <button
              type="button"
              onClick={onBackToMain}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-600 hover:text-zinc-950 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-950"
            >
              <ArrowLeft className="w-4 h-4 shrink-0" />
              <span>{t.raptor.nav.backToMain}</span>
            </button>
          </div>

          {/* Zone 2: Mathematically Centered Primary Navigation */}
          <nav
            aria-label={t.nav.ariaMain}
            className="hidden md:flex items-center justify-self-center gap-7 lg:gap-8 text-sm font-medium text-zinc-600"
          >
            <a
              href="#raptor-resumen"
              onClick={(e) => handleAnchorClick(e, 'raptor-resumen')}
              className="hover:text-zinc-950 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              {t.raptor.nav.overview}
            </a>
            <a
              href="#raptor-capacidades"
              onClick={(e) => handleAnchorClick(e, 'raptor-capacidades')}
              className="hover:text-zinc-950 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              {t.raptor.nav.capabilities}
            </a>
            <a
              href="#raptor-dossier"
              onClick={(e) => handleAnchorClick(e, 'raptor-dossier')}
              className="hover:text-zinc-950 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              {t.raptor.nav.dossier}
            </a>
            <a
              href="#evaluacion"
              onClick={(e) => handleAnchorClick(e, 'evaluacion')}
              className="hover:text-zinc-950 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              {t.raptor.nav.evaluation}
            </a>
          </nav>

          {/* Zone 3: Globe Language Selector Dropdown + Primary Action */}
          <div className="flex items-center justify-end justify-self-end gap-2.5 sm:gap-3 shrink-0">
            <div ref={langMenuRef} className="relative">
              <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={langMenuOpen}
                aria-label={t.nav.langSelectorAria}
                onClick={() => setLangMenuOpen((prev) => !prev)}
                className="h-9 px-2.5 rounded-lg border border-zinc-200/90 bg-white/80 hover:bg-zinc-100 hover:border-zinc-300 text-zinc-900 text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
              >
                <Globe className="w-4 h-4 text-zinc-700 shrink-0" />
                <span>{currentLangItem.short}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-zinc-500 shrink-0 transition-transform duration-150 ${
                    langMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {langMenuOpen && (
                <div
                  role="listbox"
                  aria-label={t.nav.langSelectorAria}
                  className="absolute right-0 top-[calc(100%+0.5rem)] z-50 min-w-[164px] p-1.5 rounded-xl bg-white/95 backdrop-blur-xl border border-zinc-200/90 shadow-lg shadow-zinc-950/10"
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
                        className={`w-full px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between gap-3 transition-colors cursor-pointer whitespace-nowrap ${
                          active
                            ? 'bg-zinc-950 text-white'
                            : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950'
                        }`}
                      >
                        <span>{item.name}</span>
                        {active ? (
                          <Check className="w-3.5 h-3.5 shrink-0" />
                        ) : (
                          <span className="text-[11px] text-zinc-400">{item.short}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleScrollToForm}
              className="h-9 px-4 rounded-lg bg-zinc-950 text-white text-xs sm:text-sm font-medium hover:bg-zinc-800 transition-colors inline-flex items-center justify-center whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
            >
              {t.raptor.nav.cta}
            </button>
          </div>
        </div>
      </header>

      <main id="raptor-resumen" className="relative z-10 flex-1">
        {/* Hero Section: Unified 6 / 6 Architectural Grid with 3D Iridescent Glass Eye */}
        <section className="pt-12 pb-20 sm:pt-20 sm:pb-28">
          <div className="max-w-[1200px] xl:max-w-[1280px] mx-auto px-6 sm:px-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Proposition Column */}
              <div className="lg:col-span-6 flex flex-col justify-center lg:pr-4">
                <div className="flex flex-wrap items-center gap-2.5 text-xs font-medium text-zinc-500">
                  <span>{t.raptor.hero.kicker[0]}</span>
                  <span aria-hidden="true">·</span>
                  <span>{t.raptor.hero.kicker[1]}</span>
                </div>

                <h1 className="mt-5 text-[clamp(2.35rem,3.8vw,3.65rem)] font-semibold leading-[1.06] tracking-tight text-zinc-950 text-balance">
                  {t.raptor.hero.name}
                </h1>

                <p className="mt-2.5 text-lg sm:text-xl font-medium text-zinc-800 tracking-tight">
                  {t.raptor.hero.subtitle}
                </p>

                <p className="mt-5 text-base sm:text-lg text-zinc-600 leading-relaxed max-w-[54ch]">
                  {t.raptor.hero.body}
                </p>

                <div className="mt-9 flex items-center">
                  <button
                    type="button"
                    onClick={handleScrollToForm}
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-zinc-950 text-white text-sm font-medium hover:bg-zinc-800 active:scale-[0.99] transition-all whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
                  >
                    <span>{t.raptor.hero.primaryCta}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Right Interactive 3D Iridescent Optical Eye */}
              <ParallaxLayer
                speed={0.028}
                maxOffset={10}
                desktopOnly
                className="lg:col-span-6 flex items-center w-full"
              >
                <RaptorEye3D />
              </ParallaxLayer>
            </div>
          </div>
        </section>

        {/* Reconnaissance Vectors: Symmetric 2x2 Architectural Grid */}
        <section id="raptor-capacidades" className="py-20 sm:py-28 border-t border-zinc-200/80">
          <div className="max-w-[1200px] xl:max-w-[1280px] mx-auto px-6 sm:px-8 w-full">
            <div className="max-w-[56ch]">
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-950 text-balance">
                {t.raptor.capabilities.headline}
              </h2>
              <p className="mt-3 text-base text-zinc-600 leading-relaxed">
                {t.raptor.capabilities.subtitle}
              </p>
            </div>

            <ParallaxLayer speed={0.02} maxOffset={10} desktopOnly className="mt-12">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-stretch">
                {t.raptor.capabilities.items.map((item) => (
                  <article
                    key={item.num}
                    className="md:col-span-6 glass-panel rounded-2xl p-8 sm:p-10 flex flex-col justify-between transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    <div>
                      <div className="text-xs font-medium text-zinc-500 tabular-nums">
                        {item.num}
                      </div>
                      <h3 className="mt-3 text-xl sm:text-2xl font-semibold tracking-tight text-zinc-950 text-balance">
                        {item.title}
                      </h3>
                      <p className="mt-3.5 text-sm sm:text-base text-zinc-600 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </ParallaxLayer>
          </div>
        </section>

        {/* Confidential Deliverable: Dossier Táctico Full-Width Monolith */}
        <section id="raptor-dossier" className="py-16 sm:py-24 border-t border-zinc-200/80">
          <div className="max-w-[1200px] xl:max-w-[1280px] mx-auto px-6 sm:px-8 w-full">
            <ParallaxLayer speed={0.018} maxOffset={8} desktopOnly>
              <div className="glass-panel-dark text-white rounded-2xl p-8 sm:p-12 lg:p-14">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-8">
                    <div className="flex flex-wrap items-center gap-2.5 text-xs font-medium text-zinc-400">
                      <span className="text-zinc-200">{t.raptor.dossier.kicker[0]}</span>
                      <span aria-hidden="true">·</span>
                      <span>{t.raptor.dossier.kicker[1]}</span>
                    </div>

                    <h2 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-white text-balance">
                      {t.raptor.dossier.title}
                    </h2>

                    <p className="mt-4 text-sm sm:text-base text-zinc-300 leading-relaxed tracking-[0.01em] max-w-[64ch]">
                      {t.raptor.dossier.body}
                    </p>
                  </div>

                  <div className="lg:col-span-4 flex lg:justify-end">
                    <button
                      type="button"
                      onClick={handleScrollToForm}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-white text-zinc-950 text-sm font-medium hover:bg-zinc-200 transition-colors whitespace-nowrap shrink-0"
                    >
                      <span>{t.raptor.dossier.cta}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </ParallaxLayer>
          </div>
        </section>

        {/* Shared Evaluation Form configured for Palantir Raptor */}
        <EvaluationForm serviceVariant="raptor" onOpenPrivacy={onOpenPrivacy} />
      </main>

      {/* Minimalist Footer */}
      <footer className="relative z-10 border-t border-zinc-200/80 bg-white/70">
        <div className="max-w-[1200px] xl:max-w-[1280px] mx-auto px-6 sm:px-8 py-8 w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2.5 text-xs text-zinc-500">
            <button
              type="button"
              onClick={onBackToMain}
              className="inline-flex items-center gap-2 text-sm font-semibold tracking-tight text-zinc-950 hover:underline underline-offset-4 cursor-pointer"
            >
              <CotoLogoMark className="w-5 h-5 shrink-0" />
              <span>Coto Privado</span>
            </button>
            <span aria-hidden="true">·</span>
            <span>Palantir Raptor</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">© {new Date().getFullYear()}</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-zinc-500">
            <button
              type="button"
              onClick={() => smoothScrollToSection('evaluacion')}
              className="hover:text-zinc-950 transition-colors cursor-pointer whitespace-nowrap"
            >
              {t.footer.contactTrigger}
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={onOpenPrivacy}
              className="hover:text-zinc-950 transition-colors cursor-pointer whitespace-nowrap"
            >
              {t.footer.privacyLink}
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={onOpenAdmin}
              className="hover:text-zinc-950 transition-colors cursor-pointer whitespace-nowrap"
            >
              {t.footer.privateAccess}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
