/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MouseEvent, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import VaultSculpture3D from './components/VaultSculpture3D';
import TierKineticObject3D, { type ServiceTierId } from './components/TierKineticObject3D';
import TechnologyStack from './components/TechnologyStack';
import EvaluationForm, { type OperationMode } from './components/EvaluationForm';
import AdminInboxModal from './components/AdminInboxModal';
import ParallaxLayer, {
  AmbientParallaxBackdrop,
  smoothScrollToSection,
} from './components/ParallaxLayer';
import { type Language, useI18n } from './lib/i18n';

const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'es', label: 'ES' },
  { code: 'en', label: 'EN' },
  { code: 'pt', label: 'PT' },
];

export default function App() {
  const { lang, setLang, t } = useI18n();
  const [activeTier, setActiveTier] = useState<ServiceTierId>('atlas');
  const [preferredMode, setPreferredMode] = useState<OperationMode>('solo');
  const [adminModalOpen, setAdminModalOpen] = useState(false);

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

  return (
    <div className="relative min-h-screen architectural-canvas text-zinc-950 flex flex-col overflow-x-clip">
      <AmbientParallaxBackdrop />

      {/* Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-40 glass-panel border-x-0 border-t-0">
        <div className="max-w-[1160px] mx-auto px-6 py-3.5 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#inicio"
            onClick={(e) => handleAnchorClick(e, 'inicio')}
            className="text-lg font-semibold tracking-tight text-zinc-950 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-950"
          >
            Coto Privado
          </a>

          {/* Zone 2: 4 concise single-line text navigation links */}
          <nav
            aria-label={t.nav.ariaMain}
            className="hidden md:flex items-center gap-7 text-sm font-medium text-zinc-600"
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

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => smoothScrollToSection('evaluacion')}
              className="px-4 py-2 rounded-lg bg-zinc-950 text-white text-xs sm:text-sm font-medium hover:bg-zinc-800 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
            >
              {t.nav.cta}
            </button>
          </div>
        </div>
      </header>

      <main id="inicio" className="relative z-10 flex-1">
        {/* Hero Section */}
        <section className="pt-12 pb-20 sm:pt-20 sm:pb-28">
          <div className="max-w-[1160px] mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
              {/* Left Proposition Column */}
              <ParallaxLayer
                speed={-0.035}
                maxOffset={16}
                desktopOnly
                className="lg:col-span-6 flex flex-col justify-center"
              >
                {/* Kicker + Interactive ES / EN / PT Language Switcher */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5 text-xs font-medium text-zinc-500">
                    <span>{t.hero.kicker[0]}</span>
                    <span aria-hidden="true">·</span>
                    <span>{t.hero.kicker[1]}</span>
                    <span aria-hidden="true">·</span>
                    <span>{t.hero.kicker[2]}</span>
                  </div>

                  {/* Interactive Language Segmented Control (ES / EN / PT) */}
                  <div
                    role="group"
                    aria-label="Language selector"
                    className="inline-flex items-center gap-1 p-1 rounded-lg bg-zinc-200/70 border border-zinc-300/60"
                  >
                    {LANGUAGES.map((item) => {
                      const active = lang === item.code;
                      return (
                        <button
                          key={item.code}
                          type="button"
                          onClick={() => setLang(item.code)}
                          className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                            active
                              ? 'bg-zinc-950 text-white shadow-sm'
                              : 'text-zinc-600 hover:text-zinc-950'
                          }`}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <h1 className="mt-5 text-[clamp(2.25rem,4vw,3.65rem)] font-semibold leading-[1.08] tracking-tight text-zinc-950 text-balance">
                  {t.hero.headline}
                </h1>

                <p className="mt-6 text-base sm:text-lg text-zinc-600 leading-relaxed max-w-[54ch]">
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
              </ParallaxLayer>

              {/* Right Interactive 3D Iridescent Padlock Sculpture */}
              <ParallaxLayer
                speed={0.075}
                maxOffset={26}
                className="lg:col-span-6 flex items-center"
              >
                <VaultSculpture3D />
              </ParallaxLayer>
            </div>
          </div>
        </section>

        {/* Services Section: Tier 1 (Argos) & Tier 2 (Atlas) */}
        <section id="servicios" className="py-24 sm:py-28 border-t border-zinc-200/80">
          <div className="max-w-[1160px] mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <ParallaxLayer speed={-0.028} maxOffset={14} desktopOnly className="lg:col-span-7">
                <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-950 text-balance">
                  {t.services.headline}
                </h2>
                <p className="mt-3 text-base text-zinc-600 leading-relaxed max-w-[50ch]">
                  {t.services.subtitle}
                </p>
              </ParallaxLayer>

              <ParallaxLayer speed={0.07} maxOffset={22} className="lg:col-span-5">
                <TierKineticObject3D activeTier={activeTier} />
              </ParallaxLayer>
            </div>

            {/* Dual Monochrome Glassmorphic Service Cards */}
            <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Tier 1: Argos */}
              <ParallaxLayer
                speed={-0.025}
                maxOffset={16}
                desktopOnly
                className="lg:col-span-6 h-full"
              >
                <article
                  onMouseEnter={() => setActiveTier('argos')}
                  className="h-full glass-panel rounded-2xl p-8 sm:p-10 flex flex-col justify-between transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <div>
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
              </ParallaxLayer>

              {/* Tier 2: Atlas */}
              <ParallaxLayer
                speed={0.04}
                maxOffset={18}
                desktopOnly
                className="lg:col-span-6 h-full"
              >
                <article
                  onMouseEnter={() => setActiveTier('atlas')}
                  className="h-full glass-panel-dark text-white rounded-2xl p-8 sm:p-10 flex flex-col justify-between transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <div>
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
              </ParallaxLayer>
            </div>
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
        <div className="max-w-[1160px] mx-auto px-6 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs text-zinc-500">
            <span className="text-sm font-semibold tracking-tight text-zinc-950">Coto Privado</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">© {new Date().getFullYear()}</span>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-xs text-zinc-500">
            <button
              type="button"
              onClick={() => setAdminModalOpen(true)}
              className="hover:text-zinc-950 transition-colors cursor-pointer whitespace-nowrap"
            >
              {t.footer.privateAccess}
            </button>

            {/* Footer Language Switcher */}
            <div className="inline-flex items-center gap-1 p-0.5 rounded-lg bg-zinc-100 border border-zinc-200">
              {LANGUAGES.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => setLang(item.code)}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors whitespace-nowrap ${
                    lang === item.code
                      ? 'bg-zinc-950 text-white'
                      : 'text-zinc-500 hover:text-zinc-950'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <AdminInboxModal isOpen={adminModalOpen} onClose={() => setAdminModalOpen(false)} />
    </div>
  );
}
