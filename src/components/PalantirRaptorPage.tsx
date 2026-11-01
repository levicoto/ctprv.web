import { MouseEvent, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, ChevronDown, Globe, ShieldAlert } from 'lucide-react';
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
  onOpenCrisis: () => void;
  onOpenAdmin: () => void;
  onOpenPrivacy: () => void;
  onOpenEmergency: () => void;
}

function renderRaptorTitle(text: string) {
  const words = text.trim().split(/\s+/);
  if (words.length <= 1) {
    return <span className="text-[#E6FF00]">{text}</span>;
  }
  const lead = words.slice(0, -1).join(' ');
  const last = words[words.length - 1];
  return (
    <>
      <span>{lead} </span>
      <span className="text-[#E6FF00]">{last}</span>
    </>
  );
}

export default function PalantirRaptorPage({
  onBackToMain,
  onOpenCrisis,
  onOpenAdmin,
  onOpenPrivacy,
  onOpenEmergency,
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
    <div className="relative min-h-screen architectural-canvas text-white flex flex-col overflow-x-clip">
      <AmbientParallaxBackdrop />

      {/* Symmetric Architectural Top Bar */}
      <header className="sticky top-0 z-40 header-glass">
        <div className="max-w-[1200px] xl:max-w-[1280px] mx-auto px-6 sm:px-8 py-3.5 w-full flex items-center justify-between md:grid md:grid-cols-[1fr_auto_1fr] gap-6 lg:gap-8">
          {/* Zone 1: Compact Back Navigation */}
          <div className="flex items-center justify-self-start min-w-0">
            <button
              type="button"
              onClick={onBackToMain}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-white/65 hover:text-[#E6FF00] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E6FF00]"
            >
              <ArrowLeft className="w-4 h-4 shrink-0" />
              <span>{t.raptor.nav.backToMain}</span>
            </button>
          </div>

          {/* Zone 2: Mathematically Centered Primary Navigation */}
          <nav
            aria-label={t.nav.ariaMain}
            className="hidden md:flex items-center justify-self-center gap-7 lg:gap-8 text-sm font-medium text-white/65"
          >
            <a
              href="#raptor-resumen"
              onClick={(e) => handleAnchorClick(e, 'raptor-resumen')}
              className="hover:text-white hover:underline decoration-[#E6FF00] underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              {t.raptor.nav.overview}
            </a>
            <a
              href="#raptor-capacidades"
              onClick={(e) => handleAnchorClick(e, 'raptor-capacidades')}
              className="hover:text-white hover:underline decoration-[#E6FF00] underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              {t.raptor.nav.capabilities}
            </a>
            <a
              href="#raptor-dossier"
              onClick={(e) => handleAnchorClick(e, 'raptor-dossier')}
              className="hover:text-white hover:underline decoration-[#E6FF00] underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              {t.raptor.nav.dossier}
            </a>
            <a
              href="#evaluacion"
              onClick={(e) => handleAnchorClick(e, 'evaluacion')}
              className="hover:text-white hover:underline decoration-[#E6FF00] underline-offset-4 transition-colors whitespace-nowrap shrink-0"
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
                className="h-9 px-2.5 rounded-lg border border-white/12 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/25 text-white text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E6FF00]"
              >
                <Globe className="w-4 h-4 text-white/80 shrink-0" />
                <span>{currentLangItem.short}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-white/55 shrink-0 transition-transform duration-150 ${
                    langMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {langMenuOpen && (
                <div
                  role="listbox"
                  aria-label={t.nav.langSelectorAria}
                  className="absolute right-0 top-[calc(100%+0.5rem)] z-50 min-w-[164px] p-1.5 rounded-xl glass-modal"
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
                            ? 'bg-[#E6FF00] text-[#060608] font-semibold'
                            : 'text-white/75 hover:bg-white/[0.06] hover:text-white'
                        }`}
                      >
                        <span>{item.name}</span>
                        {active ? (
                          <Check className="w-3.5 h-3.5 shrink-0" />
                        ) : (
                          <span className="text-[11px] text-white/40">{item.short}</span>
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
              className="h-9 px-4 rounded-lg btn-electric text-xs sm:text-sm font-semibold transition-all inline-flex items-center justify-center whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E6FF00]"
            >
              {t.raptor.nav.cta}
            </button>
          </div>
        </div>
      </header>

      <main id="raptor-resumen" className="relative z-10 flex-1">
        {/* Hero Section: Unified 6 / 6 Architectural Grid with 3D Iridescent Optical Beacon */}
        <section className="pt-8 pb-12 sm:pt-12 sm:pb-16">
          <div className="max-w-[1200px] xl:max-w-[1280px] mx-auto px-6 sm:px-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Proposition Column */}
              <div className="lg:col-span-6 flex flex-col justify-center lg:pr-4">
                <div className="flex flex-wrap items-center gap-2.5 text-xs font-medium text-white/55">
                  <span className="text-[#E6FF00] font-semibold">{t.raptor.hero.kicker[0]}</span>
                  <span aria-hidden="true">·</span>
                  <span>{t.raptor.hero.kicker[1]}</span>
                </div>

                <h1 className="mt-4 text-[clamp(2.2rem,3.5vw,3.4rem)] font-semibold leading-[1.06] tracking-tight text-white text-balance">
                  {renderRaptorTitle(t.raptor.hero.name)}
                </h1>

                <p className="mt-2 text-lg font-medium text-white/90 tracking-tight">
                  {t.raptor.hero.subtitle}
                </p>

                <p className="mt-4 text-base text-white/70 leading-relaxed tracking-[0.01em] max-w-[54ch]">
                  {t.raptor.hero.body}
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
                  <button
                    type="button"
                    onClick={handleScrollToForm}
                    className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl btn-electric text-sm font-semibold active:scale-[0.99] transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E6FF00]"
                  >
                    <span>{t.raptor.hero.primaryCta}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={onOpenEmergency}
                    className="inline-flex items-center gap-2 py-2 text-sm font-medium text-white/75 hover:text-[#E6FF00] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E6FF00]"
                  >
                    <ShieldAlert className="w-4 h-4 text-[#E6FF00] shrink-0" />
                    <span className="underline decoration-white/25 hover:decoration-[#E6FF00] underline-offset-4 transition-colors">
                      {t.hero.emergencyTrigger}
                    </span>
                  </button>
                </div>
              </div>

              {/* Right Interactive 3D Iridescent Optical Beacon with Diffused Backlight */}
              <ParallaxLayer
                speed={0.022}
                maxOffset={8}
                desktopOnly
                className="relative lg:col-span-6 flex items-center w-full"
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-4 rounded-full electric-backlight-soft opacity-80"
                />
                <div className="relative z-10 w-full">
                  <RaptorEye3D />
                </div>
              </ParallaxLayer>
            </div>
          </div>
        </section>

        {/* Reconnaissance Vectors: Unified 2x2 Cut-Glass Matrix Fed by Electric Yellow Backlight */}
        <section id="raptor-capacidades" className="py-12 sm:py-16 border-t border-white/10">
          <div className="max-w-[1200px] xl:max-w-[1280px] mx-auto px-6 sm:px-8 w-full">
            <div className="max-w-[56ch]">
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white text-balance">
                {t.raptor.capabilities.headline}
              </h2>
              <p className="mt-2 text-sm sm:text-base text-white/65 leading-relaxed tracking-[0.01em]">
                {t.raptor.capabilities.subtitle}
              </p>
            </div>

            <ParallaxLayer speed={0.016} maxOffset={6} desktopOnly className="relative mt-7">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-8 left-12 w-72 h-72 rounded-full electric-backlight"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-8 right-12 w-80 h-64 rounded-full electric-backlight-soft"
              />

              <div className="relative z-10 glass-panel rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
                {t.raptor.capabilities.items.map((item, index) => {
                  const cellBorders = [
                    index > 0 ? 'border-t border-white/10' : '',
                    index === 1 ? 'md:border-t-0' : '',
                    index % 2 === 1 ? 'md:border-l md:border-white/10' : '',
                  ]
                    .filter(Boolean)
                    .join(' ');

                  return (
                    <article
                      key={item.num}
                      className={`p-6 sm:p-7 flex flex-col justify-between hover:bg-white/[0.025] transition-colors ${cellBorders}`}
                    >
                      <div>
                        <div className="flex items-baseline gap-2.5">
                          <span className="font-mono text-xs font-semibold text-[#E6FF00] tabular-nums shrink-0">
                            {item.num}
                          </span>
                          <h3 className="text-base sm:text-lg font-semibold tracking-tight text-white text-balance">
                            {item.title}
                          </h3>
                        </div>
                        <p className="mt-2 text-sm text-white/70 leading-relaxed tracking-[0.01em]">
                          {item.desc}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </ParallaxLayer>
          </div>
        </section>

        {/* Confidential Deliverable: Dossier Táctico Full-Width Glass Monolith */}
        <section id="raptor-dossier" className="py-12 sm:py-16 border-t border-white/10">
          <div className="max-w-[1200px] xl:max-w-[1280px] mx-auto px-6 sm:px-8 w-full">
            <ParallaxLayer speed={0.016} maxOffset={6} desktopOnly className="relative">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-y-6 right-10 w-80 rounded-full electric-backlight"
              />

              <div className="relative z-10 glass-panel-electric text-white rounded-2xl p-6 sm:p-8 lg:px-10 lg:py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
                  <div className="lg:col-span-8">
                    <div className="flex flex-wrap items-center gap-2.5 text-xs font-medium text-white/60">
                      <span className="text-[#E6FF00] font-semibold">{t.raptor.dossier.kicker[0]}</span>
                      <span aria-hidden="true">·</span>
                      <span>{t.raptor.dossier.kicker[1]}</span>
                    </div>

                    <h2 className="mt-2.5 text-2xl sm:text-3xl font-semibold tracking-tight text-white text-balance">
                      {t.raptor.dossier.title}
                    </h2>

                    <p className="mt-3 text-sm sm:text-base text-white/70 leading-relaxed tracking-[0.01em] max-w-[64ch]">
                      {t.raptor.dossier.body}
                    </p>
                  </div>

                  <div className="lg:col-span-4 flex lg:justify-end">
                    <button
                      type="button"
                      onClick={handleScrollToForm}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl btn-electric text-sm font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer"
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

      {/* Minimalist Frosted Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-black/45 backdrop-blur-md">
        <div className="max-w-[1200px] xl:max-w-[1280px] mx-auto px-6 sm:px-8 py-6 w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2.5 text-xs text-white/50">
            <button
              type="button"
              onClick={onBackToMain}
              className="inline-flex items-center gap-2 text-sm font-semibold tracking-tight text-white hover:text-[#E6FF00] transition-colors cursor-pointer"
            >
              <CotoLogoMark className="w-5 h-5 shrink-0" />
              <span>Coto Privado</span>
            </button>
            <span aria-hidden="true">·</span>
            <span className="text-[#E6FF00]">Palantir Raptor</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">© {new Date().getFullYear()}</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-white/55">
            <button
              type="button"
              onClick={onOpenCrisis}
              className="hover:text-[#E6FF00] transition-colors cursor-pointer whitespace-nowrap"
            >
              {t.footer.crisisLink}
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={onOpenEmergency}
              className="hover:text-[#E6FF00] transition-colors cursor-pointer whitespace-nowrap"
            >
              {t.footer.contactTrigger}
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={onOpenPrivacy}
              className="hover:text-white transition-colors cursor-pointer whitespace-nowrap"
            >
              {t.footer.privacyLink}
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={onOpenAdmin}
              className="hover:text-white transition-colors cursor-pointer whitespace-nowrap"
            >
              {t.footer.privateAccess}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
