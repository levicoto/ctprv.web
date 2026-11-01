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

function renderCrisisHeadline(text: string) {
  const words = text.trim().split(/\s+/);
  if (words.length <= 3) {
    return <span className="text-[#E6FF00]">{text}</span>;
  }
  const lead = words.slice(0, -3).join(' ');
  const tail = words.slice(-3).join(' ');
  return (
    <>
      <span>{lead} </span>
      <span className="text-[#E6FF00]">{tail}</span>
    </>
  );
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
    <div className="relative min-h-screen architectural-canvas text-white flex flex-col overflow-x-clip">
      <AmbientParallaxBackdrop />

      {/* Symmetric Architectural Top Bar (3-Zone Contract) */}
      <header className="sticky top-0 z-40 header-glass">
        <div className="max-w-[1200px] xl:max-w-[1280px] mx-auto px-6 sm:px-8 py-3.5 w-full flex items-center justify-between md:grid md:grid-cols-[1fr_auto_1fr] gap-6 lg:gap-8">
          {/* Zone 1: Back Navigation */}
          <div className="flex items-center justify-self-start min-w-0">
            <button
              type="button"
              onClick={onBackToMain}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-white/65 hover:text-[#E6FF00] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E6FF00]"
            >
              <ArrowLeft className="w-4 h-4 shrink-0" />
              <span>{t.crisisPage.nav.backToMain}</span>
            </button>
          </div>

          {/* Zone 2: Mathematically Centered Primary Navigation */}
          <nav
            aria-label={t.nav.ariaMain}
            className="hidden md:flex items-center justify-self-center gap-7 lg:gap-8 text-sm font-medium text-white/65"
          >
            <a
              href="#crisis-resumen"
              onClick={(e) => handleAnchorClick(e, 'crisis-resumen')}
              className="hover:text-white hover:underline decoration-[#E6FF00] underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              {t.crisisPage.nav.overview}
            </a>
            <a
              href="#crisis-pasos"
              onClick={(e) => handleAnchorClick(e, 'crisis-pasos')}
              className="hover:text-white hover:underline decoration-[#E6FF00] underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              {t.crisisPage.nav.protocol}
            </a>
            <a
              href="#crisis-higiene"
              onClick={(e) => handleAnchorClick(e, 'crisis-higiene')}
              className="hover:text-white hover:underline decoration-[#E6FF00] underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              {t.crisisPage.nav.hygiene}
            </a>
            <a
              href="#evaluacion"
              onClick={(e) => handleAnchorClick(e, 'evaluacion')}
              className="hover:text-white hover:underline decoration-[#E6FF00] underline-offset-4 transition-colors whitespace-nowrap shrink-0"
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
              onClick={scrollToFormAndFocus}
              className="h-9 px-4 rounded-lg btn-electric text-xs sm:text-sm font-semibold transition-all inline-flex items-center justify-center whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E6FF00]"
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
                <div className="flex flex-wrap items-center gap-2.5 text-xs font-medium text-white/55">
                  <span className="text-[#E6FF00] font-semibold">{t.crisisPage.hero.kicker[0]}</span>
                  <span aria-hidden="true">·</span>
                  <span>{t.crisisPage.hero.kicker[1]}</span>
                </div>

                <h1 className="mt-4 text-[clamp(2.15rem,3.4vw,3.35rem)] font-semibold leading-[1.08] tracking-tight text-white text-balance">
                  {renderCrisisHeadline(t.crisisPage.hero.headline)}
                </h1>

                <p className="mt-4 text-base text-white/70 leading-relaxed tracking-[0.01em] max-w-[52ch]">
                  {t.crisisPage.hero.body}
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-3">
                  <button
                    type="button"
                    onClick={() => smoothScrollToSection('crisis-pasos')}
                    className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl btn-electric text-sm font-semibold active:scale-[0.99] transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E6FF00]"
                  >
                    <span>{t.crisisPage.hero.primaryCta}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <a
                    href={SIGNAL_DIRECT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-white/15 bg-white/[0.04] hover:border-[#E6FF00] hover:text-[#E6FF00] text-white text-sm font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E6FF00]"
                  >
                    <SignalMark className="w-4 h-4 text-[#E6FF00] shrink-0" />
                    <span>{t.crisisPage.hero.signalCta}</span>
                    <ArrowUpRight className="w-4 h-4 text-white/50 shrink-0" />
                  </a>
                </div>
              </div>

              {/* Right 3D Cryptographic Faraday Containment Chamber with Diffused Backlight */}
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
                  <CrisisContainment3D scenarioId={activeScenario.id} />
                </div>
              </ParallaxLayer>
            </div>
          </div>
        </section>

        {/* Scenario-Specific Reference Protocol + Verified Direct Portals */}
        <section id="crisis-pasos" className="py-12 sm:py-16 border-t border-white/10">
          <div className="max-w-[1200px] xl:max-w-[1280px] mx-auto px-6 sm:px-8 w-full">
            {/* Section Header + Scenario Selector */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div className="max-w-[56ch]">
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-white/55">
                  <span className="text-[#E6FF00] font-semibold">
                    {t.crisisPage.protocol.kicker[0]}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{t.crisisPage.protocol.kicker[1]}</span>
                </div>
                <h2 className="mt-2.5 text-2xl sm:text-3xl font-semibold tracking-tight text-white text-balance">
                  {t.crisisPage.protocol.title}
                </h2>
                <p className="mt-2 text-sm sm:text-base text-white/65 leading-relaxed tracking-[0.01em]">
                  {t.crisisPage.protocol.subtitle}
                </p>
              </div>

              <div
                role="tablist"
                aria-label={t.crisisPage.protocol.tabAria}
                className="grid grid-cols-1 sm:grid-cols-3 gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/12 lg:min-w-[480px]"
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
                      className={`py-2 px-3.5 rounded-lg text-xs transition-colors cursor-pointer whitespace-nowrap truncate focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E6FF00] ${
                        active
                          ? 'bg-[#E6FF00] text-[#060608] font-semibold shadow-sm'
                          : 'font-medium text-white/65 hover:text-white'
                      }`}
                    >
                      {scenario.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Unified 2x2 Cut-Glass Matrix Fed by Diffused Electric Yellow Backlight */}
            <div className="relative mt-7">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-8 left-12 w-72 h-72 rounded-full electric-backlight"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-8 right-12 w-80 h-64 rounded-full electric-backlight-soft"
              />

              <div className="relative z-10 glass-panel rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
                {activeScenario.steps.map((step, index) => {
                  const cellBorders = [
                    index > 0 ? 'border-t border-white/10' : '',
                    index === 1 ? 'md:border-t-0' : '',
                    index % 2 === 1 ? 'md:border-l md:border-white/10' : '',
                  ]
                    .filter(Boolean)
                    .join(' ');

                  return (
                    <article
                      key={`${activeScenario.id}-${step.num}`}
                      className={`p-6 sm:p-7 flex flex-col justify-between hover:bg-white/[0.025] transition-colors ${cellBorders}`}
                    >
                      <div>
                        <div className="flex items-baseline gap-2.5">
                          <span className="font-mono text-xs font-semibold text-[#E6FF00] tabular-nums shrink-0">
                            {step.num}
                          </span>
                          <h3 className="text-base sm:text-lg font-semibold tracking-tight text-white text-balance">
                            {step.title}
                          </h3>
                        </div>
                        <p className="mt-2 text-sm text-white/70 leading-relaxed tracking-[0.01em]">
                          {step.desc}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            {/* Verified Official Portals Strip (Zero Nested Cards, Hairline Architecture) */}
            <div className="mt-8">
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-white/55">
                <span className="text-white font-semibold">
                  {t.crisisPage.protocol.resourcesTitle}
                </span>
                <span aria-hidden="true">·</span>
                <span>{t.crisisPage.protocol.resourcesNote}</span>
              </div>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-y border-white/10 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
                {activeScenario.resources.map((res) => (
                  <a
                    key={res.url + res.name}
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group py-4 sm:px-5 first:sm:pl-0 last:sm:pr-0 flex items-start justify-between gap-3 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E6FF00]"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-white group-hover:text-[#E6FF00] group-hover:underline underline-offset-4 transition-colors">
                        {res.name}
                      </div>
                      <p className="mt-1 text-xs text-white/55 leading-relaxed">
                        {res.desc}
                      </p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-[#E6FF00] transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0 mt-0.5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Compact Cut-Glass Caution Monolith */}
            <div className="relative mt-7">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-y-4 right-8 w-72 rounded-full electric-backlight-soft"
              />

              <div className="relative z-10 glass-panel-electric text-white rounded-2xl p-5 sm:px-8 sm:py-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                <div className="max-w-[68ch]">
                  <div className="text-xs font-semibold text-[#E6FF00]">
                    {activeScenario.avoidLabel}
                  </div>
                  <p className="mt-1.5 text-sm text-white/80 leading-relaxed tracking-[0.01em]">
                    {activeScenario.avoidAction}
                  </p>
                </div>

                <div className="shrink-0 lg:pl-6 lg:border-l lg:border-white/10">
                  <div className="text-xs text-white/55">
                    {t.crisisPage.protocol.helpPrompt}
                  </div>
                  <button
                    type="button"
                    onClick={scrollToFormAndFocus}
                    className="mt-1 inline-flex items-center gap-2 text-sm font-semibold text-[#E6FF00] hover:text-white underline decoration-[#E6FF00]/50 hover:decoration-white underline-offset-4 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <span>{t.crisisPage.protocol.helpCta}</span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Essential Preventive Baseline: 4 Crisp Hairline Rows */}
        <section id="crisis-higiene" className="py-12 sm:py-16 border-t border-white/10">
          <div className="max-w-[1200px] xl:max-w-[1280px] mx-auto px-6 sm:px-8 w-full">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
              <div className="max-w-[56ch]">
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white text-balance">
                  {t.crisisPage.hygiene.headline}
                </h2>
                <p className="mt-2 text-sm sm:text-base text-white/65 leading-relaxed tracking-[0.01em]">
                  {t.crisisPage.hygiene.subtitle}
                </p>
              </div>

              <button
                type="button"
                onClick={scrollToFormAndFocus}
                className="self-start lg:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/18 bg-white/[0.04] text-white text-sm font-medium hover:border-[#E6FF00] hover:text-[#E6FF00] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>{t.crisisPage.hygiene.auditCta}</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
            </div>

            <div className="mt-7 border-t border-white/10 divide-y divide-white/10">
              {t.crisisPage.hygiene.items.map((item) => (
                <div
                  key={item.num}
                  className="py-4 sm:py-5 grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-8 items-baseline"
                >
                  <div className="md:col-span-5 flex items-baseline gap-3">
                    <span className="font-mono text-xs font-semibold text-[#E6FF00] tabular-nums shrink-0">
                      {item.num}
                    </span>
                    <h3 className="text-sm sm:text-base font-semibold tracking-tight text-white text-balance">
                      {item.title}
                    </h3>
                  </div>
                  <p className="md:col-span-7 text-sm text-white/65 leading-relaxed tracking-[0.01em]">
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
            <span className="text-[#E6FF00]">{t.footer.crisisLink}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">© {new Date().getFullYear()}</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-white/55">
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
