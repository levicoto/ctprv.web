import { MouseEvent, useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Globe,
} from 'lucide-react';
import CrisisContainment3D from './CrisisContainment3D';
import EvaluationForm from './EvaluationForm';
import CotoLogoMark from './CotoLogoMark';
import SignalMark, { SIGNAL_DIRECT_URL } from './SignalMark';
import ParallaxLayer, {
  AmbientParallaxBackdrop,
  smoothScrollToSection,
} from './ParallaxLayer';
import { type CrisisScenarioItem, type Language, useI18n } from '../lib/i18n';

const LANGUAGES: { code: Language; short: string; name: string }[] = [
  { code: 'es', short: 'ES', name: 'Español' },
  { code: 'en', short: 'EN', name: 'English' },
  { code: 'pt', short: 'PT', name: 'Português' },
];

interface CrisisPlaybookPageProps {
  onBackToMain: () => void;
  onOpenRaptor?: () => void;
  onOpenAdmin: () => void;
  onOpenPrivacy: () => void;
  onOpenEmergency: () => void;
}

export default function CrisisPlaybookPage({
  onBackToMain,
  onOpenAdmin,
  onOpenPrivacy,
  onOpenEmergency,
}: CrisisPlaybookPageProps) {
  const { lang, setLang, t } = useI18n();
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [selectedScenarioId, setSelectedScenarioId] =
    useState<CrisisScenarioItem['id']>('hack');
  const langMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    document.title = t.crisisMetaTitle;
  }, [t.crisisMetaTitle]);

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

  const scrollToFormAndFocus = () => {
    smoothScrollToSection('evaluacion');
    window.setTimeout(() => {
      document.getElementById('eval-nombre')?.focus({ preventScroll: true });
    }, 620);
  };

  const currentLangItem = LANGUAGES.find((item) => item.code === lang) ?? LANGUAGES[0];
  const scenarios = t.crisisPage.protocol.scenarios;
  const activeScenario =
    scenarios.find((s) => s.id === selectedScenarioId) ?? scenarios[0];

  return (
    <div className="relative min-h-screen architectural-canvas text-zinc-950 flex flex-col overflow-x-clip">
      <AmbientParallaxBackdrop />

      {/* Symmetric Architectural Top Bar (3-Zone Contract) */}
      <header className="sticky top-0 z-40 header-glass">
        <div className="max-w-[1200px] xl:max-w-[1280px] mx-auto px-6 sm:px-8 py-3.5 w-full flex items-center justify-between md:grid md:grid-cols-[1fr_auto_1fr] gap-6 lg:gap-8">
          {/* Zone 1: Back Navigation */}
          <div className="flex items-center justify-self-start min-w-0">
            <button
              type="button"
              onClick={onBackToMain}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-600 hover:text-zinc-950 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-950"
            >
              <ArrowLeft className="w-4 h-4 shrink-0" />
              <span>{t.crisisPage.nav.backToMain}</span>
            </button>
          </div>

          {/* Zone 2: Mathematically Centered Primary Navigation (4 concise links) */}
          <nav
            aria-label={t.nav.ariaMain}
            className="hidden md:flex items-center justify-self-center gap-7 lg:gap-8 text-sm font-medium text-zinc-600"
          >
            <a
              href="#crisis-resumen"
              onClick={(e) => handleAnchorClick(e, 'crisis-resumen')}
              className="hover:text-zinc-950 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              {t.crisisPage.nav.overview}
            </a>
            <a
              href="#crisis-pasos"
              onClick={(e) => handleAnchorClick(e, 'crisis-pasos')}
              className="hover:text-zinc-950 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              {t.crisisPage.nav.protocol}
            </a>
            <a
              href="#crisis-higiene"
              onClick={(e) => handleAnchorClick(e, 'crisis-higiene')}
              className="hover:text-zinc-950 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              {t.crisisPage.nav.hygiene}
            </a>
            <a
              href="#evaluacion"
              onClick={(e) => handleAnchorClick(e, 'evaluacion')}
              className="hover:text-zinc-950 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              {t.crisisPage.nav.evaluation}
            </a>
          </nav>

          {/* Zone 3: Language Selector + Primary Action */}
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
              onClick={scrollToFormAndFocus}
              className="h-9 px-4 rounded-lg bg-zinc-950 text-white text-xs sm:text-sm font-medium hover:bg-zinc-800 transition-colors inline-flex items-center justify-center whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
            >
              {t.crisisPage.nav.cta}
            </button>
          </div>
        </div>
      </header>

      <main id="crisis-resumen" className="relative z-10 flex-1">
        {/* Hero Section: Unified 6 / 6 Architectural Grid with 3D Faraday Chamber */}
        <section className="pt-8 pb-12 sm:pt-12 sm:pb-16">
          <div className="max-w-[1200px] xl:max-w-[1280px] mx-auto px-6 sm:px-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Proposition Column */}
              <div className="lg:col-span-6 flex flex-col justify-center lg:pr-4">
                <div className="flex flex-wrap items-center gap-2.5 text-xs font-medium text-zinc-500">
                  <span className="text-zinc-800">{t.crisisPage.hero.kicker[0]}</span>
                  <span aria-hidden="true">·</span>
                  <span>{t.crisisPage.hero.kicker[1]}</span>
                </div>

                <h1 className="mt-4 text-[clamp(2.15rem,3.4vw,3.35rem)] font-semibold leading-[1.08] tracking-tight text-zinc-950 text-balance">
                  {t.crisisPage.hero.headline}
                </h1>

                <p className="mt-4 text-base text-zinc-600 leading-relaxed max-w-[52ch]">
                  {t.crisisPage.hero.body}
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-3">
                  <button
                    type="button"
                    onClick={() => smoothScrollToSection('crisis-pasos')}
                    className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-zinc-950 text-white text-sm font-medium hover:bg-zinc-800 active:scale-[0.99] transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
                  >
                    <span>{t.crisisPage.hero.primaryCta}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <a
                    href={SIGNAL_DIRECT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-zinc-300 bg-white/85 hover:border-zinc-950 text-zinc-900 text-sm font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
                  >
                    <SignalMark className="w-4 h-4 shrink-0" />
                    <span>{t.crisisPage.hero.signalCta}</span>
                    <ArrowUpRight className="w-4 h-4 text-zinc-500 shrink-0" />
                  </a>
                </div>
              </div>

              {/* Right 3D Cryptographic Faraday Containment Chamber */}
              <ParallaxLayer
                speed={0.022}
                maxOffset={8}
                desktopOnly
                className="lg:col-span-6 flex items-center w-full"
              >
                <CrisisContainment3D scenarioId={activeScenario.id} />
              </ParallaxLayer>
            </div>
          </div>
        </section>

        {/* Scenario-Specific Reference Protocol + Verified Direct Portals */}
        <section id="crisis-pasos" className="py-12 sm:py-16 border-t border-zinc-200/80">
          <div className="max-w-[1200px] xl:max-w-[1280px] mx-auto px-6 sm:px-8 w-full">
            {/* Section Header + Scenario Selector */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div className="max-w-[56ch]">
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-zinc-500">
                  <span className="text-zinc-800">{t.crisisPage.protocol.kicker[0]}</span>
                  <span aria-hidden="true">·</span>
                  <span>{t.crisisPage.protocol.kicker[1]}</span>
                </div>
                <h2 className="mt-2.5 text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-950 text-balance">
                  {t.crisisPage.protocol.title}
                </h2>
                <p className="mt-2 text-sm sm:text-base text-zinc-600 leading-relaxed">
                  {t.crisisPage.protocol.subtitle}
                </p>
              </div>

              <div
                role="tablist"
                aria-label={t.crisisPage.protocol.tabAria}
                className="grid grid-cols-1 sm:grid-cols-3 gap-1 p-1 rounded-xl bg-zinc-100/95 border border-zinc-200/90 lg:min-w-[480px]"
              >
                {scenarios.map((scenario) => {
                  const active = scenario.id === activeScenario.id;
                  return (
                    <button
                      key={scenario.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setSelectedScenarioId(scenario.id)}
                      className={`py-2 px-3.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap truncate focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 ${
                        active
                          ? 'bg-zinc-950 text-white shadow-sm'
                          : 'text-zinc-600 hover:text-zinc-950'
                      }`}
                    >
                      {scenario.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Unified 2x2 Architectural Hairline Matrix (Specific to Selected Scenario) */}
            <div className="mt-7 rounded-2xl border border-zinc-200/90 overflow-hidden bg-zinc-200/80 grid grid-cols-1 md:grid-cols-2 gap-px shadow-sm shadow-zinc-950/[0.03]">
              {activeScenario.steps.map((step) => (
                <article
                  key={`${activeScenario.id}-${step.num}`}
                  className="bg-white/95 p-6 sm:p-7 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-baseline gap-2.5">
                      <span className="text-xs font-medium text-zinc-400 tabular-nums shrink-0">
                        {step.num}
                      </span>
                      <h3 className="text-base sm:text-lg font-semibold tracking-tight text-zinc-950 text-balance">
                        {step.title}
                      </h3>
                    </div>
                    <p className="mt-2 text-sm text-zinc-600 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            {/* Verified Official Portals Strip (Zero Nested Cards, Hairline Architecture) */}
            <div className="mt-8">
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-zinc-500">
                <span className="text-zinc-900 font-semibold">
                  {t.crisisPage.protocol.resourcesTitle}
                </span>
                <span aria-hidden="true">·</span>
                <span>{t.crisisPage.protocol.resourcesNote}</span>
              </div>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-y border-zinc-200/90 divide-y sm:divide-y-0 sm:divide-x divide-zinc-200/90">
                {activeScenario.resources.map((res) => (
                  <a
                    key={res.url + res.name}
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group py-4 sm:px-5 first:sm:pl-0 last:sm:pr-0 flex items-start justify-between gap-3 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-zinc-950 group-hover:underline underline-offset-4">
                        {res.name}
                      </div>
                      <p className="mt-1 text-xs text-zinc-500 leading-relaxed">
                        {res.desc}
                      </p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-950 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0 mt-0.5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Compact Obsidian Caution Note */}
            <div className="mt-7 glass-panel-dark text-white rounded-2xl p-5 sm:px-8 sm:py-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              <div className="max-w-[68ch]">
                <div className="text-xs font-medium text-zinc-400">
                  {activeScenario.avoidLabel}
                </div>
                <p className="mt-1.5 text-sm text-zinc-200 leading-relaxed tracking-[0.01em]">
                  {activeScenario.avoidAction}
                </p>
              </div>

              <div className="shrink-0 lg:pl-6 lg:border-l lg:border-white/10">
                <div className="text-xs text-zinc-400">
                  {t.crisisPage.protocol.helpPrompt}
                </div>
                <button
                  type="button"
                  onClick={scrollToFormAndFocus}
                  className="mt-1 inline-flex items-center gap-2 text-sm font-medium text-white hover:text-zinc-200 underline decoration-zinc-500 hover:decoration-white underline-offset-4 transition-colors whitespace-nowrap cursor-pointer"
                >
                  <span>{t.crisisPage.protocol.helpCta}</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Essential Preventive Baseline: 4 Crisp Hairline Rows */}
        <section id="crisis-higiene" className="py-12 sm:py-16 border-t border-zinc-200/80">
          <div className="max-w-[1200px] xl:max-w-[1280px] mx-auto px-6 sm:px-8 w-full">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
              <div className="max-w-[56ch]">
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-950 text-balance">
                  {t.crisisPage.hygiene.headline}
                </h2>
                <p className="mt-2 text-sm sm:text-base text-zinc-600 leading-relaxed">
                  {t.crisisPage.hygiene.subtitle}
                </p>
              </div>

              <button
                type="button"
                onClick={scrollToFormAndFocus}
                className="self-start lg:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-900 bg-white/80 text-zinc-950 text-sm font-medium hover:bg-zinc-950 hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>{t.crisisPage.hygiene.auditCta}</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
            </div>

            <div className="mt-7 border-t border-zinc-200/90 divide-y divide-zinc-200/90">
              {t.crisisPage.hygiene.items.map((item) => (
                <div
                  key={item.num}
                  className="py-4 sm:py-5 grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-8 items-baseline"
                >
                  <div className="md:col-span-5 flex items-baseline gap-3">
                    <span className="text-xs font-medium text-zinc-400 tabular-nums shrink-0">
                      {item.num}
                    </span>
                    <h3 className="text-sm sm:text-base font-semibold tracking-tight text-zinc-950 text-balance">
                      {item.title}
                    </h3>
                  </div>
                  <p className="md:col-span-7 text-sm text-zinc-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Clean Contact / Intake Form */}
        <EvaluationForm serviceVariant="crisis" onOpenPrivacy={onOpenPrivacy} />
      </main>

      {/* Minimalist Footer */}
      <footer className="relative z-10 border-t border-zinc-200/80 bg-white/70">
        <div className="max-w-[1200px] xl:max-w-[1280px] mx-auto px-6 sm:px-8 py-6 w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
            <span>{t.footer.crisisLink}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">© {new Date().getFullYear()}</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-zinc-500">
            <button
              type="button"
              onClick={onOpenEmergency}
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
