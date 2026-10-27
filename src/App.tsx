/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MouseEvent, useEffect, useRef, useState } from 'react';
import { ArrowRight, Check, ChevronDown, Globe } from 'lucide-react';
import VaultSculpture3D from './components/VaultSculpture3D';
import TierKineticObject3D, { type ServiceTierId } from './components/TierKineticObject3D';
import TechnologyStack from './components/TechnologyStack';
import EvaluationForm, { type OperationMode } from './components/EvaluationForm';
import AdminInboxModal from './components/AdminInboxModal';
import PalantirRaptorPage from './components/PalantirRaptorPage';
import CotoLogoMark from './components/CotoLogoMark';
import ParallaxLayer, {
  AmbientParallaxBackdrop,
  smoothScrollToSection,
} from './components/ParallaxLayer';
import { type Language, useI18n } from './lib/i18n';

const LANGUAGES: { code: Language; short: string; name: string }[] = [
  { code: 'es', short: 'ES', name: 'Español' },
  { code: 'en', short: 'EN', name: 'English' },
  { code: 'pt', short: 'PT', name: 'Português' },
];

type ActiveView = 'main' | 'raptor';

function readViewFromHash(): ActiveView {
  if (typeof window === 'undefined') return 'main';
  const raw = window.location.hash.replace(/^#/, '').trim().toLowerCase();
  return raw === 'palantir-raptor' || raw.startsWith('raptor-') ? 'raptor' : 'main';
}

export default function App() {
  const { lang, setLang, t } = useI18n();
  const [activeView, setActiveView] = useState<ActiveView>(() => readViewFromHash());
  const [activeTier, setActiveTier] = useState<ServiceTierId>('atlas');
  const [preferredMode, setPreferredMode] = useState<OperationMode>('solo');
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const syncRoute = () => {
      const nextView = readViewFromHash();
      setActiveView((prev) => {
        if (prev !== nextView) {
          window.scrollTo({ top: 0, behavior: 'auto' });
        }
        return nextView;
      });
    };

    window.addEventListener('hashchange', syncRoute);
    window.addEventListener('popstate', syncRoute);
    return () => {
      window.removeEventListener('hashchange', syncRoute);
      window.removeEventListener('popstate', syncRoute);
    };
  }, []);

  useEffect(() => {
    document.title = activeView === 'raptor' ? t.raptorMetaTitle : t.metaTitle;
  }, [activeView, t.metaTitle, t.raptorMetaTitle]);

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

  const handleOpenRaptorPage = () => {
    setLangMenuOpen(false);
    if (window.location.hash !== '#palantir-raptor') {
      window.history.pushState(null, '', '#palantir-raptor');
    }
    setActiveView('raptor');
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const handleBackToMain = () => {
    setLangMenuOpen(false);
    window.history.pushState(null, '', window.location.pathname + window.location.search);
    setActiveView('main');
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const handleAnchorClick = (e: MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    smoothScrollToSection(sectionId);
  };

  const handleSelectTierForAudit = (tier: ServiceTierId) => {
    setActiveTier(tier);
    setPreferredMode(tier === 'argos' ? 'solo' : 'equipo');
    smoothScrollToSection('evaluacion');
    window.setTimeout(() => {
      const firstInput = document.getElementById('eval-nombre');
      firstInput?.focus({ preventScroll: true });
    }, 620);
  };

  if (activeView === 'raptor') {
    return (
      <>
        <PalantirRaptorPage
          onBackToMain={handleBackToMain}
          onOpenAdmin={() => setAdminModalOpen(true)}
        />
        <AdminInboxModal isOpen={adminModalOpen} onClose={() => setAdminModalOpen(false)} />
      </>
    );
  }

  const currentLangItem = LANGUAGES.find((item) => item.code === lang) ?? LANGUAGES[0];

  return (
    <div className="relative min-h-screen architectural-canvas text-zinc-950 flex flex-col overflow-x-clip">
      <AmbientParallaxBackdrop />

      {/* Symmetric Architectural Top Bar */}
      <header className="sticky top-0 z-40 glass-panel border-x-0 border-t-0">
        <div className="max-w-[1200px] xl:max-w-[1280px] mx-auto px-6 sm:px-8 py-3.5 w-full flex items-center justify-between md:grid md:grid-cols-[1fr_auto_1fr] gap-4">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center justify-self-start">
            <a
              href="#inicio"
              onClick={(e) => handleAnchorClick(e, 'inicio')}
              className="inline-flex items-center gap-2.5 text-lg font-semibold tracking-tight text-zinc-950 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-950"
            >
              <CotoLogoMark className="w-[21px] h-[21px] shrink-0" />
              <span>Coto Privado</span>
            </a>
          </div>

          {/* Zone 2: Mathematically Centered Primary Navigation */}
          <nav
            aria-label={t.nav.ariaMain}
            className="hidden md:flex items-center justify-self-center gap-7 lg:gap-8 text-sm font-medium text-zinc-600"
          >
            <a
              href="#inicio"
              onClick={(e) => handleAnchorClick(e, 'inicio')}
              className="hover:text-zinc-950 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              {t.nav.overview}
            </a>
            <a
              href="#servicios"
              onClick={(e) => handleAnchorClick(e, 'servicios')}
              className="hover:text-zinc-950 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              {t.nav.services}
            </a>
            <a
              href="#respaldo"
              onClick={(e) => handleAnchorClick(e, 'respaldo')}
              className="hover:text-zinc-950 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              {t.nav.backing}
            </a>
            <a
              href="#evaluacion"
              onClick={(e) => handleAnchorClick(e, 'evaluacion')}
              className="hover:text-zinc-950 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              {t.nav.evaluation}
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
              onClick={() => smoothScrollToSection('evaluacion')}
              className="h-9 px-4 rounded-lg bg-zinc-950 text-white text-xs sm:text-sm font-medium hover:bg-zinc-800 transition-colors inline-flex items-center justify-center whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
            >
              {t.nav.cta}
            </button>
          </div>
        </div>
      </header>

      <main id="inicio" className="relative z-10 flex-1">
        {/* Hero Section: Unified 6 / 6 Architectural Grid */}
        <section className="pt-12 pb-20 sm:pt-20 sm:pb-28">
          <div className="max-w-[1200px] xl:max-w-[1280px] mx-auto px-6 sm:px-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Proposition Column */}
              <div className="lg:col-span-6 flex flex-col justify-center lg:pr-4">
                <div className="flex items-center gap-2.5 text-xs font-medium text-zinc-500">
                  <span>{t.hero.kicker[0]}</span>
                  <span aria-hidden="true">·</span>
                  <span>{t.hero.kicker[1]}</span>
                  <span aria-hidden="true">·</span>
                  <span>{t.hero.kicker[2]}</span>
                </div>

                <h1 className="mt-5 text-[clamp(2.25rem,3.6vw,3.5rem)] font-semibold leading-[1.08] tracking-tight text-zinc-950 text-balance">
                  {t.hero.headline}
                </h1>

                <p className="mt-6 text-base sm:text-lg text-zinc-600 leading-relaxed max-w-[52ch]">
                  {t.hero.body}
                </p>

                <div className="mt-9 flex items-center">
                  <button
                    type="button"
                    onClick={() => smoothScrollToSection('evaluacion')}
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-zinc-950 text-white text-sm font-medium hover:bg-zinc-800 active:scale-[0.99] transition-all whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
                  >
                    <span>{t.hero.primaryCta}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Right Interactive 3D Iridescent Padlock Sculpture */}
              <ParallaxLayer
                speed={0.028}
                maxOffset={10}
                desktopOnly
                className="lg:col-span-6 flex items-center w-full"
              >
                <VaultSculpture3D />
              </ParallaxLayer>
            </div>
          </div>
        </section>

        {/* Services Section: Unified 6 / 6 Grid so 3D Shield & Atlas Share Exact Vertical Axis */}
        <section id="servicios" className="py-20 sm:py-28 border-t border-zinc-200/80">
          <div className="max-w-[1200px] xl:max-w-[1280px] mx-auto px-6 sm:px-8 w-full">
            {/* Top Row: Left Headline (6 cols) + Right 3D Shield (6 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 lg:pr-4">
                <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-950 text-balance">
                  {t.services.headline}
                </h2>
                <p className="mt-3 text-base text-zinc-600 leading-relaxed max-w-[48ch]">
                  {t.services.subtitle}
                </p>
              </div>

              <ParallaxLayer speed={0.025} maxOffset={10} desktopOnly className="lg:col-span-6 w-full">
                <TierKineticObject3D activeTier={activeTier} />
              </ParallaxLayer>
            </div>

            {/* Dual Monochrome Glassmorphic Service Cards: Cohesive Row for 100% Baseline Alignment */}
            <ParallaxLayer speed={0.02} maxOffset={10} desktopOnly className="mt-10 lg:mt-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
                {/* Tier 1: Argos */}
                <div className="lg:col-span-6 flex">
                  <article
                    onMouseEnter={() => setActiveTier('argos')}
                    onTouchStart={() => setActiveTier('argos')}
                    className="w-full h-full glass-panel rounded-2xl p-8 sm:p-10 flex flex-col justify-between transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    <div>
                      <div className="lg:min-h-[8.5rem] flex flex-col justify-start">
                        <div className="text-xs font-medium text-zinc-500 flex items-center gap-2">
                          <span className="tabular-nums text-zinc-700">
                            {t.services.argos.tierTag}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{t.services.argos.subtitleTag}</span>
                        </div>

                        <h3 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-950">
                          {t.services.argos.name}
                        </h3>

                        <p className="mt-3 text-sm text-zinc-600 leading-relaxed">
                          {t.services.argos.audience}
                        </p>
                      </div>

                      <div className="my-7 border-t border-zinc-200/80" />

                      <dl className="space-y-6">
                        {t.services.argos.items.map((item) => (
                          <div key={item.title}>
                            <dt className="text-sm font-semibold text-zinc-950">{item.title}</dt>
                            <dd className="mt-1.5 text-sm text-zinc-600 leading-relaxed">
                              {item.desc}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>

                    <div className="mt-10 pt-6 border-t border-zinc-200/80">
                      <button
                        type="button"
                        onClick={() => handleSelectTierForAudit('argos')}
                        className="w-full py-3 px-5 rounded-xl border border-zinc-900 bg-white/80 text-zinc-950 text-sm font-medium hover:bg-zinc-950 hover:text-white transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
                      >
                        <span>{t.services.argos.cta}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </article>
                </div>

                {/* Tier 2: Atlas */}
                <div className="lg:col-span-6 flex">
                  <article
                    onMouseEnter={() => setActiveTier('atlas')}
                    onTouchStart={() => setActiveTier('atlas')}
                    className="w-full h-full glass-panel-dark text-white rounded-2xl p-8 sm:p-10 flex flex-col justify-between transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    <div>
                      <div className="lg:min-h-[8.5rem] flex flex-col justify-start">
                        <div className="text-xs font-medium text-zinc-400 flex items-center gap-2">
                          <span className="tabular-nums text-zinc-200">
                            {t.services.atlas.tierTag}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{t.services.atlas.subtitleTag}</span>
                        </div>

                        <h3 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight text-white">
                          {t.services.atlas.name}
                        </h3>

                        <p className="mt-3 text-sm text-zinc-300 leading-relaxed tracking-[0.01em]">
                          {t.services.atlas.audience}
                        </p>
                      </div>

                      <div className="my-7 border-t border-white/10" />

                      <dl className="space-y-6">
                        {t.services.atlas.items.map((item) => (
                          <div key={item.title}>
                            <dt className="text-sm font-semibold text-white tracking-[0.01em]">
                              {item.title}
                            </dt>
                            <dd className="mt-1.5 text-sm text-zinc-300 leading-relaxed tracking-[0.01em]">
                              {item.desc}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>

                    <div className="mt-10 pt-6 border-t border-white/10">
                      <button
                        type="button"
                        onClick={() => handleSelectTierForAudit('atlas')}
                        className="w-full py-3 px-5 rounded-xl bg-white text-zinc-950 text-sm font-medium hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
                      >
                        <span>{t.services.atlas.cta}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </article>
                </div>
              </div>

              {/* Off-Tier Editorial Horizontal Strip: Palantir Raptor (OSINT) */}
              <div className="mt-6 lg:mt-8 glass-panel rounded-2xl p-6 sm:px-10 sm:py-7 flex flex-col lg:flex-row lg:items-center justify-between gap-6 transition-transform duration-200 hover:-translate-y-0.5">
                <div className="max-w-[64ch]">
                  <div className="text-xs font-medium text-zinc-500 flex flex-wrap items-center gap-2">
                    <span className="text-zinc-800">{t.services.raptorCallout.kicker[0]}</span>
                    <span aria-hidden="true">·</span>
                    <span>{t.services.raptorCallout.kicker[1]}</span>
                  </div>
                  <p className="mt-2 text-base sm:text-lg font-medium text-zinc-950 leading-snug text-balance">
                    {t.services.raptorCallout.hook}
                  </p>
                </div>

                <div className="flex items-center shrink-0">
                  <button
                    type="button"
                    onClick={handleOpenRaptorPage}
                    className="w-full sm:w-auto py-3 px-5 rounded-xl border border-zinc-900 bg-zinc-950 text-white text-sm font-medium hover:bg-zinc-800 transition-colors inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
                  >
                    <span>{t.services.raptorCallout.cta}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </ParallaxLayer>
          </div>
        </section>

        {/* Technology & Industry Backing */}
        <TechnologyStack />

        {/* Private Evaluation Form */}
        <EvaluationForm
          preferredMode={preferredMode}
          onModeSyncTier={(tier) => setActiveTier(tier)}
        />
      </main>

      {/* Minimalist Footer */}
      <footer className="relative z-10 border-t border-zinc-200/80 bg-white/70">
        <div className="max-w-[1200px] xl:max-w-[1280px] mx-auto px-6 sm:px-8 py-8 w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-xs text-zinc-500">
            <CotoLogoMark className="w-[18px] h-[18px] shrink-0" />
            <span className="text-sm font-semibold tracking-tight text-zinc-950">Coto Privado</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">© {new Date().getFullYear()}</span>
          </div>

          <div className="flex items-center text-xs text-zinc-500">
            <button
              type="button"
              onClick={() => setAdminModalOpen(true)}
              className="hover:text-zinc-950 transition-colors cursor-pointer whitespace-nowrap"
            >
              {t.footer.privateAccess}
            </button>
          </div>
        </div>
      </footer>

      <AdminInboxModal isOpen={adminModalOpen} onClose={() => setAdminModalOpen(false)} />
    </div>
  );
}
