import { MouseEvent, useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Copy,
  Globe,
  RotateCcw,
} from 'lucide-react';
import CrisisContainment3D from './CrisisContainment3D';
import EvaluationForm from './EvaluationForm';
import CotoLogoMark from './CotoLogoMark';
import SignalMark, { copyToClipboard, SIGNAL_DIRECT_URL } from './SignalMark';
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
  onOpenRaptor: () => void;
  onOpenAdmin: () => void;
  onOpenPrivacy: () => void;
  onOpenEmergency: () => void;
}

export default function CrisisPlaybookPage({
  onBackToMain,
  onOpenRaptor,
  onOpenAdmin,
  onOpenPrivacy,
  onOpenEmergency,
}: CrisisPlaybookPageProps) {
  const { lang, setLang, t } = useI18n();
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [selectedScenarioId, setSelectedScenarioId] =
    useState<CrisisScenarioItem['id']>('hack');
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [summaryCopied, setSummaryCopied] = useState(false);
  const [prefillConcern, setPrefillConcern] = useState<{ text: string; seq: number } | null>(
    null
  );
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

  const toggleStep = (stepNum: string) => {
    setCompletedSteps((prev) =>
      prev.includes(stepNum) ? prev.filter((id) => id !== stepNum) : [...prev, stepNum]
    );
  };

  const scrollToFormAndFocus = (prefillText?: string, focusConcern = false) => {
    if (typeof prefillText === 'string') {
      setPrefillConcern((prev) => ({
        text: prefillText,
        seq: (prev?.seq ?? 0) + 1,
      }));
    }
    smoothScrollToSection('evaluacion');
    window.setTimeout(() => {
      const targetId = focusConcern ? 'eval-preocupacion' : 'eval-nombre';
      const el = document.getElementById(targetId) as
        | HTMLInputElement
        | HTMLTextAreaElement
        | null;
      if (el) {
        el.focus({ preventScroll: true });
        if (focusConcern && typeof el.setSelectionRange === 'function') {
          const end = el.value.length;
          el.setSelectionRange(end, end);
        }
      }
    }, 620);
  };

  const currentLangItem = LANGUAGES.find((item) => item.code === lang) ?? LANGUAGES[0];
  const scenarios = t.crisisPage.triage.scenarios;
  const activeScenario =
    scenarios.find((s) => s.id === selectedScenarioId) ?? scenarios[0];
  const reputationScenario = scenarios.find((s) => s.id === 'reputation') ?? scenarios[0];

  const steps = t.crisisPage.first30.items;
  const totalSteps = steps.length;
  const doneCount = completedSteps.length;
  const containmentProgress = totalSteps > 0 ? doneCount / totalSteps : 0;

  const buildDiagnosticSummary = (): string => {
    const doneTags = steps
      .filter((step) => completedSteps.includes(step.num))
      .map((step) => step.shortTag);
    const pendingTags = steps
      .filter((step) => !completedSteps.includes(step.num))
      .map((step) => step.shortTag);

    const lines: string[] = [
      t.crisisPage.triage.summaryHeader(activeScenario.label, doneCount, totalSteps),
    ];
    if (doneTags.length > 0) {
      lines.push(`${t.crisisPage.triage.summaryDonePrefix}: ${doneTags.join(', ')}`);
    }
    if (pendingTags.length > 0) {
      lines.push(`${t.crisisPage.triage.summaryPendingPrefix}: ${pendingTags.join(', ')}`);
    }
    lines.push(t.crisisPage.triage.summaryContextPrompt);
    return lines.join('\n');
  };

  const handleCopySummary = async () => {
    const ok = await copyToClipboard(buildDiagnosticSummary());
    if (ok) {
      setSummaryCopied(true);
      window.setTimeout(() => setSummaryCopied(false), 2200);
    }
  };

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

          {/* Zone 2: Mathematically Centered Primary Navigation */}
          <nav
            aria-label={t.nav.ariaMain}
            className="hidden md:flex items-center justify-self-center gap-6 lg:gap-7 text-sm font-medium text-zinc-600"
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
              {t.crisisPage.nav.first30}
            </a>
            <a
              href="#crisis-reputacion"
              onClick={(e) => handleAnchorClick(e, 'crisis-reputacion')}
              className="hover:text-zinc-950 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              {t.crisisPage.nav.reputation}
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
              onClick={() => scrollToFormAndFocus()}
              className="h-9 px-4 rounded-lg bg-zinc-950 text-white text-xs sm:text-sm font-medium hover:bg-zinc-800 transition-colors inline-flex items-center justify-center whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
            >
              {t.crisisPage.nav.cta}
            </button>
          </div>
        </div>
      </header>

      <main id="crisis-resumen" className="relative z-10 flex-1">
        {/* Hero Section: Unified 6 / 6 Architectural Grid with Interactive 3D Faraday Chamber */}
        <section className="pt-12 pb-20 sm:pt-20 sm:pb-28">
          <div className="max-w-[1200px] xl:max-w-[1280px] mx-auto px-6 sm:px-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              {/* Left Proposition Column */}
              <div className="lg:col-span-6 flex flex-col justify-center lg:pr-4">
                <div className="flex flex-wrap items-center gap-2.5 text-xs font-medium text-zinc-500">
                  <span className="text-zinc-800">{t.crisisPage.hero.kicker[0]}</span>
                  <span aria-hidden="true">·</span>
                  <span>{t.crisisPage.hero.kicker[1]}</span>
                </div>

                <h1 className="mt-5 text-[clamp(2.25rem,3.6vw,3.5rem)] font-semibold leading-[1.08] tracking-tight text-zinc-950 text-balance">
                  {t.crisisPage.hero.headline}
                </h1>

                <p className="mt-5 text-base sm:text-lg text-zinc-600 leading-relaxed max-w-[52ch]">
                  {t.crisisPage.hero.body}
                </p>

                <div className="mt-9 flex flex-wrap items-center gap-x-4 gap-y-3">
                  <button
                    type="button"
                    onClick={() => smoothScrollToSection('crisis-pasos')}
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-zinc-950 text-white text-sm font-medium hover:bg-zinc-800 active:scale-[0.99] transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
                  >
                    <span>{t.crisisPage.hero.primaryCta}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <a
                    href={SIGNAL_DIRECT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl border border-zinc-300 bg-white/85 hover:border-zinc-950 text-zinc-900 text-sm font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
                  >
                    <SignalMark className="w-4 h-4 shrink-0" />
                    <span>{t.crisisPage.hero.signalCta}</span>
                    <ArrowUpRight className="w-4 h-4 text-zinc-500 shrink-0" />
                  </a>
                </div>
              </div>

              {/* Right Interactive 3D Cryptographic Faraday Containment Chamber */}
              <ParallaxLayer
                speed={0.026}
                maxOffset={10}
                desktopOnly
                className="lg:col-span-6 flex items-center w-full"
              >
                <CrisisContainment3D
                  scenarioId={activeScenario.id}
                  containmentProgress={containmentProgress}
                />
              </ParallaxLayer>
            </div>
          </div>
        </section>

        {/* Interactive Containment Workbench: Incident Triage + Live 30-Minute Checklist */}
        <section id="crisis-pasos" className="py-20 sm:py-28 border-t border-zinc-200/80">
          <div className="max-w-[1200px] xl:max-w-[1280px] mx-auto px-6 sm:px-8 w-full">
            {/* Workbench Header + Scenario Segmented Tabs */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div className="max-w-[56ch]">
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-zinc-500">
                  <span className="text-zinc-800">{t.crisisPage.triage.kicker[0]}</span>
                  <span aria-hidden="true">·</span>
                  <span>{t.crisisPage.triage.kicker[1]}</span>
                </div>
                <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-950 text-balance">
                  {t.crisisPage.triage.title}
                </h2>
              </div>

              <div
                role="tablist"
                aria-label={t.crisisPage.triage.tabAria}
                className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 p-1.5 rounded-xl bg-zinc-100/95 border border-zinc-200/90 lg:min-w-[490px]"
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
                      className={`py-2.5 px-3.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap truncate ${
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

            {/* High-Contrast Split: Light "Do This Now" vs. Obsidian "Critical Mistake to Avoid" */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-5 lg:gap-6 items-stretch">
              <div className="md:col-span-6 glass-panel rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-medium text-zinc-500 tabular-nums">
                    01 · {activeScenario.immediateLabel}
                  </div>
                  <p className="mt-3 text-base sm:text-lg font-medium text-zinc-950 leading-relaxed">
                    {activeScenario.immediateAction}
                  </p>
                </div>
              </div>

              <div className="md:col-span-6 glass-panel-dark text-white rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-medium text-zinc-400 tabular-nums">
                    02 · {activeScenario.avoidLabel}
                  </div>
                  <p className="mt-3 text-base sm:text-lg font-medium text-zinc-100 leading-relaxed tracking-[0.01em]">
                    {activeScenario.avoidAction}
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive 4-Step First-30-Minutes Containment Checklist */}
            <div className="mt-12 pt-10 border-t border-zinc-200/80">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-950">
                    {t.crisisPage.triage.checklistTitle}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-600">
                    {t.crisisPage.triage.checklistHint}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs font-medium text-zinc-600 tabular-nums">
                  <span className="text-zinc-950 font-semibold">
                    {t.crisisPage.triage.progressLabel(doneCount, totalSteps)}
                  </span>
                  {doneCount > 0 && (
                    <>
                      <span aria-hidden="true">·</span>
                      <button
                        type="button"
                        onClick={() => setCompletedSteps([])}
                        className="inline-flex items-center gap-1 text-zinc-500 hover:text-zinc-950 transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                        <span>{t.crisisPage.triage.resetBtn}</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Architectural Hairline Progress Bar */}
              <div
                aria-hidden="true"
                className="mt-4 h-1 w-full bg-zinc-200/90 overflow-hidden rounded-xs"
              >
                <div
                  className="h-full bg-zinc-950 transition-transform duration-200 origin-left"
                  style={{ transform: `scaleX(${containmentProgress})` }}
                />
              </div>

              {/* 2x2 Interactive Checkable Action Cards */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-5 items-stretch">
                {steps.map((step) => {
                  const checked = completedSteps.includes(step.num);
                  return (
                    <button
                      key={step.num}
                      type="button"
                      role="checkbox"
                      aria-checked={checked}
                      onClick={() => toggleStep(step.num)}
                      className={`md:col-span-6 text-left rounded-2xl p-6 sm:p-7 border transition-all duration-150 cursor-pointer flex items-start gap-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 ${
                        checked
                          ? 'bg-zinc-950 text-white border-zinc-950 shadow-md shadow-zinc-950/10'
                          : 'bg-white/85 hover:bg-white text-zinc-950 border-zinc-200/90 hover:border-zinc-400'
                      }`}
                    >
                      <span
                        className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                          checked
                            ? 'bg-white border-white text-zinc-950'
                            : 'border-zinc-300 bg-white'
                        }`}
                      >
                        {checked && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2 text-xs font-medium tabular-nums">
                          <span className={checked ? 'text-zinc-400' : 'text-zinc-400'}>
                            {step.num}
                          </span>
                        </span>
                        <span
                          className={`mt-1 block text-base sm:text-lg font-semibold tracking-tight text-balance ${
                            checked ? 'text-white' : 'text-zinc-950'
                          }`}
                        >
                          {step.title}
                        </span>
                        <span
                          className={`mt-1.5 block text-sm leading-relaxed ${
                            checked ? 'text-zinc-300' : 'text-zinc-600'
                          }`}
                        >
                          {step.desc}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Smart Diagnostic Handoff Bar */}
              <div className="mt-8 pt-6 border-t border-zinc-200/80 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => scrollToFormAndFocus(buildDiagnosticSummary(), false)}
                    className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-zinc-950 text-white text-xs sm:text-sm font-medium hover:bg-zinc-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>{t.crisisPage.triage.sendSummaryCta}</span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </button>

                  <button
                    type="button"
                    onClick={handleCopySummary}
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-zinc-300 bg-white/85 hover:border-zinc-950 text-zinc-900 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {summaryCopied ? (
                      <Check className="w-4 h-4 text-zinc-950 shrink-0" />
                    ) : (
                      <Copy className="w-4 h-4 text-zinc-600 shrink-0" />
                    )}
                    <span>
                      {summaryCopied
                        ? t.crisisPage.triage.copiedSummaryCta
                        : t.crisisPage.triage.copySummaryCta}
                    </span>
                  </button>
                </div>

                <a
                  href={SIGNAL_DIRECT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 py-2 text-xs sm:text-sm font-medium text-zinc-700 hover:text-zinc-950 underline decoration-zinc-300 hover:decoration-zinc-950 underline-offset-4 transition-colors whitespace-nowrap shrink-0"
                >
                  <SignalMark className="w-4 h-4 shrink-0" />
                  <span>{t.crisisPage.triage.urgentSignalCta}</span>
                  <ArrowUpRight className="w-4 h-4 shrink-0" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Reputation & Impersonation Crisis Monolith */}
        <section id="crisis-reputacion" className="py-16 sm:py-24 border-t border-zinc-200/80">
          <div className="max-w-[1200px] xl:max-w-[1280px] mx-auto px-6 sm:px-8 w-full">
            <ParallaxLayer speed={0.018} maxOffset={8} desktopOnly>
              <div className="glass-panel-dark text-white rounded-2xl p-8 sm:p-12 lg:p-14">
                <div className="max-w-[62ch]">
                  <div className="flex flex-wrap items-center gap-2.5 text-xs font-medium text-zinc-400">
                    <span className="text-zinc-200">{t.crisisPage.reputation.kicker[0]}</span>
                    <span aria-hidden="true">·</span>
                    <span>{t.crisisPage.reputation.kicker[1]}</span>
                  </div>

                  <h2 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-white text-balance">
                    {t.crisisPage.reputation.headline}
                  </h2>

                  <p className="mt-4 text-sm sm:text-base text-zinc-300 leading-relaxed tracking-[0.01em]">
                    {t.crisisPage.reputation.body}
                  </p>
                </div>

                <div className="mt-10 pt-10 border-t border-white/10 grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {t.crisisPage.reputation.items.map((item) => (
                    <div key={item.num}>
                      <div className="text-xs font-medium text-zinc-400 tabular-nums">
                        {item.num}
                      </div>
                      <h3 className="mt-2.5 text-base sm:text-lg font-semibold text-white tracking-[0.01em] text-balance">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm text-zinc-300 leading-relaxed tracking-[0.01em]">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-10 pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => scrollToFormAndFocus(reputationScenario.prefillText, false)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-white text-zinc-950 text-sm font-medium hover:bg-zinc-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>{t.crisisPage.reputation.primaryCta}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={onOpenRaptor}
                    className="inline-flex items-center gap-2 py-2 text-xs sm:text-sm font-medium text-zinc-300 hover:text-white underline decoration-zinc-600 hover:decoration-white underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>{t.crisisPage.reputation.raptorCta}</span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </button>
                </div>
              </div>
            </ParallaxLayer>
          </div>
        </section>

        {/* Essential Preventive Hardening Rules: Crisp Hairline Editorial Rows */}
        <section id="crisis-higiene" className="py-20 sm:py-28 border-t border-zinc-200/80">
          <div className="max-w-[1200px] xl:max-w-[1280px] mx-auto px-6 sm:px-8 w-full">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div className="max-w-[56ch]">
                <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-950 text-balance">
                  {t.crisisPage.hygiene.headline}
                </h2>
                <p className="mt-3 text-base text-zinc-600 leading-relaxed">
                  {t.crisisPage.hygiene.subtitle}
                </p>
              </div>

              <button
                type="button"
                onClick={() => scrollToFormAndFocus('')}
                className="self-start lg:self-auto inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-zinc-900 bg-white/80 text-zinc-950 text-sm font-medium hover:bg-zinc-950 hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>{t.crisisPage.hygiene.auditCta}</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
            </div>

            <div className="mt-10 border-t border-zinc-200/90 divide-y divide-zinc-200/90">
              {t.crisisPage.hygiene.items.map((item) => (
                <div
                  key={item.num}
                  className="py-6 sm:py-7 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-8 items-baseline"
                >
                  <div className="md:col-span-5 flex items-baseline gap-3.5">
                    <span className="text-xs font-medium text-zinc-400 tabular-nums shrink-0">
                      {item.num}
                    </span>
                    <h3 className="text-base sm:text-lg font-semibold tracking-tight text-zinc-950 text-balance">
                      {item.title}
                    </h3>
                  </div>
                  <p className="md:col-span-7 text-sm sm:text-base text-zinc-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Shared Evaluation Form configured for Crisis / Priority Intake */}
        <EvaluationForm
          serviceVariant="crisis"
          prefillConcern={prefillConcern}
          onOpenPrivacy={onOpenPrivacy}
        />
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
