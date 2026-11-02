import { useEffect, useState } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import CrisisContainment3D from './CrisisContainment3D';
import EvaluationForm from './EvaluationForm';
import CotoLogoMark from './CotoLogoMark';
import SignalMark, { SIGNAL_DIRECT_URL } from './SignalMark';
import SiteHeader, { type HeaderLinkItem } from './SiteHeader';
import ParallaxLayer, {
  AmbientParallaxBackdrop,
  smoothScrollToSection,
} from './ParallaxLayer';
import { type CrisisScenarioItem, useI18n } from '../lib/i18n';

interface CrisisPlaybookPageProps {
  onBackToMain: () => void;
  onOpenRaptor?: () => void;
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
  const { t } = useI18n();
  const [selectedScenarioId, setSelectedScenarioId] =
    useState<CrisisScenarioItem['id']>('hack');

  useEffect(() => {
    document.title = t.crisisMetaTitle;
  }, [t.crisisMetaTitle]);

  const scrollToFormAndFocus = () => {
    smoothScrollToSection('evaluacion');
    window.setTimeout(() => {
      document.getElementById('eval-nombre')?.focus({ preventScroll: true });
    }, 620);
  };

  const scenarios = t.crisisPage.protocol.scenarios;
  const activeScenario =
    scenarios.find((s) => s.id === selectedScenarioId) ?? scenarios[0];

  const navLinks: HeaderLinkItem[] = [
    {
      label: t.crisisPage.nav.overview,
      href: '#crisis-resumen',
      onSelect: () => smoothScrollToSection('crisis-resumen'),
    },
    {
      label: t.crisisPage.nav.protocol,
      href: '#crisis-pasos',
      onSelect: () => smoothScrollToSection('crisis-pasos'),
    },
    {
      label: t.crisisPage.nav.hygiene,
      href: '#crisis-higiene',
      onSelect: () => smoothScrollToSection('crisis-higiene'),
    },
    {
      label: t.crisisPage.nav.evaluation,
      href: '#evaluacion',
      onSelect: () => smoothScrollToSection('evaluacion'),
    },
  ];

  const mobileSecondaryLinks: HeaderLinkItem[] = [
    {
      label: t.crisisPage.nav.backToMain,
      href: '#inicio',
      onSelect: onBackToMain,
    },
    ...(onOpenRaptor
      ? [
          {
            label: t.nav.raptor,
            href: '#palantirr',
            onSelect: onOpenRaptor,
          },
        ]
      : []),
  ];

  return (
    <div className="relative min-h-screen architectural-canvas text-[#E2E8F0] flex flex-col overflow-x-clip">
      <AmbientParallaxBackdrop />

      <SiteHeader
        isSubpage
        backLabel={t.crisisPage.nav.backToMain}
        desktopLinks={navLinks}
        mobilePrimaryLinks={navLinks}
        mobileSecondaryLinks={mobileSecondaryLinks}
        ctaLabel={t.crisisPage.nav.cta}
        mobileCtaLabel={t.crisisPage.protocol.helpCta}
        onCtaClick={scrollToFormAndFocus}
        onBrandClick={onBackToMain}
        onEmergencyClick={onOpenEmergency}
      />

      <main id="crisis-resumen" className="relative z-10 flex-1">
        {/* Hero Section: Unified 6 / 6 Architectural Grid with 3D Faraday Chamber */}
        <section className="pt-9 pb-14 sm:pt-14 sm:pb-18">
          <div className="max-w-[1200px] xl:max-w-[1280px] mx-auto px-6 sm:px-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Proposition Column */}
              <div className="lg:col-span-6 flex flex-col justify-center lg:pr-4">
                <div className="text-xs font-medium text-[#E2E8F0] tracking-[0.02em]">
                  {t.crisisPage.hero.kicker}
                </div>

                <h1 className="mt-4 text-[clamp(2.1rem,3.3vw,3.2rem)] font-medium leading-[1.1] tracking-tight text-[#F1F5F9] text-balance">
                  {t.crisisPage.hero.headline}
                </h1>

                <p className="mt-4 text-base font-light text-[#94A3B8] leading-relaxed tracking-[0.01em] max-w-[52ch]">
                  {t.crisisPage.hero.body}
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3">
                  <button
                    type="button"
                    onClick={() => smoothScrollToSection('crisis-pasos')}
                    className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl btn-platinum text-sm font-medium active:scale-[0.99] transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E2E8F0]"
                  >
                    <span>{t.crisisPage.hero.primaryCta}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <a
                    href={SIGNAL_DIRECT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-white/[0.10] bg-white/[0.02] hover:border-[#E2E8F0]/45 text-[#CBD5E1] hover:text-[#E2E8F0] text-sm font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E2E8F0]"
                  >
                    <SignalMark className="w-4 h-4 icon-slate shrink-0" />
                    <span>{t.crisisPage.hero.signalCta}</span>
                    <ArrowUpRight className="w-4 h-4 icon-slate shrink-0" />
                  </a>
                </div>
              </div>

              {/* Right 3D Cryptographic Faraday Containment Chamber Preserved with Muted Cobalt Sphere */}
              <ParallaxLayer
                speed={0.022}
                maxOffset={8}
                desktopOnly
                className="relative lg:col-span-6 flex items-center w-full"
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-4 rounded-full cobalt-backlight-soft opacity-90"
                />
                <div className="relative z-10 w-full">
                  <CrisisContainment3D scenarioId={activeScenario.id} />
                </div>
              </ParallaxLayer>
            </div>
          </div>
        </section>

        {/* Scenario-Specific Containment Protocol + Verified Direct Consoles */}
        <section id="crisis-pasos" className="py-14 sm:py-18 border-t border-white/[0.07]">
          <div className="max-w-[1200px] xl:max-w-[1280px] mx-auto px-6 sm:px-8 w-full">
            {/* Section Header + Scenario Selector */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div className="max-w-[56ch]">
                <div className="text-xs font-medium text-[#E2E8F0] tracking-[0.02em]">
                  {t.crisisPage.protocol.kicker}
                </div>
                <h2 className="mt-2.5 text-2xl sm:text-3xl font-medium tracking-tight text-[#F1F5F9] text-balance">
                  {t.crisisPage.protocol.title}
                </h2>
                <p className="mt-2.5 text-sm sm:text-base font-light text-[#94A3B8] leading-relaxed tracking-[0.01em]">
                  {t.crisisPage.protocol.subtitle}
                </p>
              </div>

              <div
                role="tablist"
                aria-label={t.crisisPage.protocol.tabAria}
                className="grid grid-cols-1 sm:grid-cols-3 gap-1 p-1 rounded-xl bg-white/[0.02] border border-white/[0.09] lg:min-w-[490px]"
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
                      className={`min-h-10 py-2 px-3.5 rounded-lg text-xs transition-colors cursor-pointer whitespace-nowrap truncate focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E2E8F0] ${
                        active
                          ? 'bg-[#E2E8F0] text-[#0A0F1C] font-medium shadow-sm'
                          : 'font-normal text-[#94A3B8] hover:text-[#E2E8F0]'
                      }`}
                    >
                      {scenario.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Unified 2x2 Cut-Glass Matrix Fed by Muted Cobalt Spheres */}
            <div className="relative mt-8">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-8 left-12 w-72 h-72 rounded-full cobalt-backlight"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-8 right-12 w-80 h-64 rounded-full cobalt-backlight-soft"
              />

              <div className="relative z-10 glass-panel rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
                {activeScenario.steps.map((step, index) => {
                  const cellBorders = [
                    index > 0 ? 'border-t border-white/[0.07]' : '',
                    index === 1 ? 'md:border-t-0' : '',
                    index % 2 === 1 ? 'md:border-l md:border-white/[0.07]' : '',
                  ]
                    .filter(Boolean)
                    .join(' ');

                  return (
                    <article
                      key={`${activeScenario.id}-${step.num}`}
                      className={`p-6 sm:p-7 flex flex-col justify-between hover:bg-white/[0.018] transition-colors ${cellBorders}`}
                    >
                      <div>
                        <div className="flex items-baseline gap-3">
                          <span className="text-xs font-medium text-[#94A3B8] tabular-nums shrink-0">
                            {step.num}
                          </span>
                          <h3 className="text-base sm:text-lg font-medium tracking-tight text-[#E2E8F0] text-balance">
                            {step.title}
                          </h3>
                        </div>
                        <p className="mt-2 text-sm font-light text-[#94A3B8] leading-relaxed tracking-[0.01em]">
                          {step.desc}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            {/* Verified Official Portals Strip */}
            <div className="mt-8">
              <div className="flex flex-wrap items-center gap-2 text-xs font-normal text-[#94A3B8]">
                <span className="text-[#E2E8F0] font-medium">
                  {t.crisisPage.protocol.resourcesTitle}
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-light">{t.crisisPage.protocol.resourcesNote}</span>
              </div>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-y border-white/[0.07] divide-y sm:divide-y-0 sm:divide-x divide-white/[0.07]">
                {activeScenario.resources.map((res) => (
                  <a
                    key={res.url + res.name}
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group py-4 sm:px-5 first:sm:pl-0 last:sm:pr-0 flex items-start justify-between gap-3 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E2E8F0]"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-[#E2E8F0] group-hover:text-white group-hover:underline decoration-[#94A3B8]/50 underline-offset-4 transition-colors">
                        {res.name}
                      </div>
                      <p className="mt-1 text-xs font-light text-[#94A3B8] leading-relaxed">
                        {res.desc}
                      </p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 icon-slate transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0 mt-0.5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Compact Cut-Glass Golden Rule Monolith */}
            <div className="relative mt-8">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-y-4 right-8 w-72 rounded-full cobalt-backlight-soft"
              />

              <div className="relative z-10 glass-panel-featured text-[#E2E8F0] rounded-2xl p-5 sm:px-8 sm:py-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                <div className="max-w-[68ch]">
                  <div className="text-xs font-medium text-[#E2E8F0]">
                    {activeScenario.avoidLabel}
                  </div>
                  <p className="mt-1.5 text-sm font-light text-[#94A3B8] leading-relaxed tracking-[0.01em]">
                    {activeScenario.avoidAction}
                  </p>
                </div>

                <div className="shrink-0 lg:pl-6 lg:border-l lg:border-white/[0.07]">
                  <div className="text-xs font-light text-[#94A3B8]">
                    {t.crisisPage.protocol.helpPrompt}
                  </div>
                  <button
                    type="button"
                    onClick={scrollToFormAndFocus}
                    className="group mt-1 inline-flex items-center gap-2 text-sm font-medium text-[#E2E8F0] hover:text-white underline decoration-[#94A3B8]/50 group-hover:decoration-[#E2E8F0] underline-offset-4 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <span>{t.crisisPage.protocol.helpCta}</span>
                    <ArrowRight className="w-4 h-4 icon-slate shrink-0" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Personal Digital Sovereignty Habits: 4 Crisp Hairline Rows */}
        <section id="crisis-higiene" className="py-14 sm:py-18 border-t border-white/[0.07]">
          <div className="max-w-[1200px] xl:max-w-[1280px] mx-auto px-6 sm:px-8 w-full">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
              <div className="max-w-[56ch]">
                <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#F1F5F9] text-balance">
                  {t.crisisPage.hygiene.headline}
                </h2>
                <p className="mt-2.5 text-sm sm:text-base font-light text-[#94A3B8] leading-relaxed tracking-[0.01em]">
                  {t.crisisPage.hygiene.subtitle}
                </p>
              </div>

              <button
                type="button"
                onClick={scrollToFormAndFocus}
                className="group self-start lg:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/[0.10] bg-white/[0.02] text-[#CBD5E1] text-sm font-medium hover:border-[#E2E8F0]/45 hover:text-[#E2E8F0] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>{t.crisisPage.hygiene.auditCta}</span>
                <ArrowRight className="w-4 h-4 icon-slate shrink-0" />
              </button>
            </div>

            <div className="mt-8 border-t border-white/[0.07] divide-y divide-white/[0.07]">
              {t.crisisPage.hygiene.items.map((item) => (
                <div
                  key={item.num}
                  className="py-4 sm:py-5 grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-8 items-baseline"
                >
                  <div className="md:col-span-5 flex items-baseline gap-3">
                    <span className="text-xs font-medium text-[#94A3B8] tabular-nums shrink-0">
                      {item.num}
                    </span>
                    <h3 className="text-sm sm:text-base font-medium tracking-tight text-[#E2E8F0] text-balance">
                      {item.title}
                    </h3>
                  </div>
                  <p className="md:col-span-7 text-sm font-light text-[#94A3B8] leading-relaxed tracking-[0.01em]">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Clean Intake Form */}
        <EvaluationForm serviceVariant="crisis" onOpenPrivacy={onOpenPrivacy} />
      </main>

      {/* Boutique Abyssal Footer */}
      <footer className="relative z-10 border-t border-white/[0.07] bg-[#0A0F1C]/80 backdrop-blur-xl">
        <div className="max-w-[1200px] xl:max-w-[1280px] mx-auto px-6 sm:px-8 py-6 w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2.5 text-xs font-light text-[#94A3B8]">
            <button
              type="button"
              onClick={onBackToMain}
              className="inline-flex items-center gap-2 text-sm font-medium tracking-tight text-[#E2E8F0] hover:text-white transition-colors cursor-pointer"
            >
              <CotoLogoMark className="w-5 h-5 shrink-0" />
              <span>Coto Privado</span>
            </button>
            <span aria-hidden="true">·</span>
            <span className="text-[#CBD5E1] font-normal">{t.footer.crisisLink}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">© {new Date().getFullYear()}</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-normal text-[#94A3B8]">
            {onOpenRaptor && (
              <>
                <button
                  type="button"
                  onClick={onOpenRaptor}
                  className="hover:text-[#E2E8F0] transition-colors cursor-pointer whitespace-nowrap"
                >
                  {t.footer.raptorLink}
                </button>
                <span aria-hidden="true">·</span>
              </>
            )}
            <button
              type="button"
              onClick={onOpenEmergency}
              className="hover:text-[#E2E8F0] transition-colors cursor-pointer whitespace-nowrap"
            >
              {t.footer.contactTrigger}
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={onOpenPrivacy}
              className="hover:text-[#E2E8F0] transition-colors cursor-pointer whitespace-nowrap"
            >
              {t.footer.privacyLink}
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={onOpenAdmin}
              className="hover:text-[#E2E8F0] transition-colors cursor-pointer whitespace-nowrap"
            >
              {t.footer.privateAccess}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
