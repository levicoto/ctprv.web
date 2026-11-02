/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { lazy, Suspense, useEffect, useState } from 'react';
import { ArrowRight, ShieldAlert } from 'lucide-react';
import VaultSculpture3D from './components/VaultSculpture3D';
import { type ServiceTierId } from './components/TierKineticObject3D';
import BoutiqueProfilesSection from './components/BoutiqueProfilesSection';
import SpecializedUnitsSection from './components/SpecializedUnitsSection';
import TechnologyStack from './components/TechnologyStack';
import PublicExposureSection from './components/PublicExposureSection';
import ProtectionMetricsSection from './components/ProtectionMetricsSection';
import EvaluationForm, { type OperationMode } from './components/EvaluationForm';
import PrivacyModal from './components/PrivacyModal';
import EmergencyModal from './components/EmergencyModal';
import CotoLogoMark from './components/CotoLogoMark';
import SiteHeader, { type HeaderLinkItem } from './components/SiteHeader';

const PalantirRaptorPage = lazy(() => import('./components/PalantirRaptorPage'));
const CrisisPlaybookPage = lazy(() => import('./components/CrisisPlaybookPage'));
const AdminInboxModal = lazy(() => import('./components/AdminInboxModal'));
import ParallaxLayer, {
  AmbientParallaxBackdrop,
  smoothScrollToSection,
} from './components/ParallaxLayer';
import { type BoutiqueAudienceItem, type MetricsScopeId, useI18n } from './lib/i18n';

type ActiveView = 'main' | 'raptor' | 'crisis';

function readViewFromHash(): ActiveView {
  if (typeof window === 'undefined') return 'main';
  const raw = window.location.hash.replace(/^#/, '').trim().toLowerCase();
  if (raw === 'palantirr' || raw === 'palantir-raptor' || raw.startsWith('raptor-')) {
    return 'raptor';
  }
  if (raw === 'protocolo-crisis' || raw.startsWith('crisis-')) return 'crisis';
  return 'main';
}

export default function App() {
  const { t } = useI18n();
  const [activeView, setActiveView] = useState<ActiveView>(() => readViewFromHash());
  const [activeTier, setActiveTier] = useState<ServiceTierId>('atlas');
  const [preferredMode, setPreferredMode] = useState<OperationMode>('solo');
  const [mainFormVariant, setMainFormVariant] = useState<'tiers' | 'pep'>('tiers');
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);

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
    document.title =
      activeView === 'raptor'
        ? t.raptorMetaTitle
        : activeView === 'crisis'
          ? t.crisisMetaTitle
          : t.metaTitle;
  }, [activeView, t.metaTitle, t.raptorMetaTitle, t.crisisMetaTitle]);

  const handleOpenRaptorPage = () => {
    if (window.location.hash !== '#palantirr') {
      window.history.pushState(null, '', '#palantirr');
    }
    setActiveView('raptor');
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const handleOpenCrisisPage = () => {
    if (window.location.hash !== '#protocolo-crisis') {
      window.history.pushState(null, '', '#protocolo-crisis');
    }
    setActiveView('crisis');
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const handleBackToMain = () => {
    window.history.pushState(null, '', window.location.pathname + window.location.search);
    setActiveView('main');
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const focusEvaluationInput = () => {
    window.setTimeout(() => {
      const firstInput = document.getElementById('eval-nombre');
      firstInput?.focus({ preventScroll: true });
    }, 620);
  };

  const handleSelectTierForAudit = (tier: ServiceTierId) => {
    setMainFormVariant('tiers');
    setActiveTier(tier);
    setPreferredMode(tier === 'argos' ? 'solo' : 'equipo');
    smoothScrollToSection('evaluacion');
    focusEvaluationInput();
  };

  const handleSelectPepForAudit = () => {
    setMainFormVariant('pep');
    setActiveTier('atlas');
    setPreferredMode('equipo');
    smoothScrollToSection('evaluacion');
    focusEvaluationInput();
  };

  const handleSelectAudience = (audienceId: BoutiqueAudienceItem['id']) => {
    if (audienceId === 'pep') {
      smoothScrollToSection('exposicion-publica');
      return;
    }
    if (audienceId === 'creators') {
      handleSelectTierForAudit('atlas');
      return;
    }
    handleSelectTierForAudit('argos');
  };

  const handleSelectMetricsScopeForAudit = (scope: MetricsScopeId) => {
    if (scope === 'pep') {
      handleSelectPepForAudit();
      return;
    }
    if (scope === 'atlas') {
      handleSelectTierForAudit('atlas');
      return;
    }
    setMainFormVariant('tiers');
    smoothScrollToSection('evaluacion');
    focusEvaluationInput();
  };

  if (activeView === 'raptor') {
    return (
      <Suspense fallback={<div className="min-h-screen architectural-canvas" />}>
        <PalantirRaptorPage
          onBackToMain={handleBackToMain}
          onOpenCrisis={handleOpenCrisisPage}
          onOpenAdmin={() => setAdminModalOpen(true)}
          onOpenPrivacy={() => setPrivacyModalOpen(true)}
          onOpenEmergency={() => setEmergencyModalOpen(true)}
        />
        <PrivacyModal isOpen={privacyModalOpen} onClose={() => setPrivacyModalOpen(false)} />
        <EmergencyModal
          isOpen={emergencyModalOpen}
          onClose={() => setEmergencyModalOpen(false)}
          onGoToEvaluation={() => smoothScrollToSection('evaluacion')}
          onOpenPrivacy={() => setPrivacyModalOpen(true)}
          onOpenCrisisGuide={handleOpenCrisisPage}
        />
        {adminModalOpen && (
          <AdminInboxModal isOpen={adminModalOpen} onClose={() => setAdminModalOpen(false)} />
        )}
      </Suspense>
    );
  }

  if (activeView === 'crisis') {
    return (
      <Suspense fallback={<div className="min-h-screen architectural-canvas" />}>
        <CrisisPlaybookPage
          onBackToMain={handleBackToMain}
          onOpenRaptor={handleOpenRaptorPage}
          onOpenAdmin={() => setAdminModalOpen(true)}
          onOpenPrivacy={() => setPrivacyModalOpen(true)}
          onOpenEmergency={() => setEmergencyModalOpen(true)}
        />
        <PrivacyModal isOpen={privacyModalOpen} onClose={() => setPrivacyModalOpen(false)} />
        <EmergencyModal
          isOpen={emergencyModalOpen}
          onClose={() => setEmergencyModalOpen(false)}
          onGoToEvaluation={() => smoothScrollToSection('evaluacion')}
          onOpenPrivacy={() => setPrivacyModalOpen(true)}
        />
        {adminModalOpen && (
          <AdminInboxModal isOpen={adminModalOpen} onClose={() => setAdminModalOpen(false)} />
        )}
      </Suspense>
    );
  }

  const desktopHeaderLinks: HeaderLinkItem[] = [
    {
      label: t.nav.profiles,
      href: '#perfiles',
      onSelect: () => smoothScrollToSection('perfiles'),
    },
    {
      label: t.nav.services,
      href: '#servicios',
      onSelect: () => smoothScrollToSection('servicios'),
    },
    {
      label: t.nav.units,
      href: '#unidades',
      onSelect: () => smoothScrollToSection('unidades'),
    },
    {
      label: t.nav.pep,
      href: '#exposicion-publica',
      onSelect: () => smoothScrollToSection('exposicion-publica'),
    },
    {
      label: t.nav.metrics,
      href: '#metricas',
      onSelect: () => smoothScrollToSection('metricas'),
    },
  ];

  const mobilePrimaryLinks: HeaderLinkItem[] = [
    ...desktopHeaderLinks,
    {
      label: t.nav.backing,
      href: '#respaldo',
      onSelect: () => smoothScrollToSection('respaldo'),
    },
  ];

  const mobileSecondaryLinks: HeaderLinkItem[] = [
    {
      label: t.nav.raptor,
      href: '#palantirr',
      onSelect: handleOpenRaptorPage,
    },
    {
      label: t.nav.crisis,
      href: '#protocolo-crisis',
      onSelect: handleOpenCrisisPage,
    },
  ];

  return (
    <div className="relative min-h-screen architectural-canvas text-[#E2E8F0] flex flex-col overflow-x-clip">
      <AmbientParallaxBackdrop />

      <SiteHeader
        desktopLinks={desktopHeaderLinks}
        mobilePrimaryLinks={mobilePrimaryLinks}
        mobileSecondaryLinks={mobileSecondaryLinks}
        ctaLabel={t.nav.cta}
        mobileCtaLabel={t.nav.mobileCta}
        onCtaClick={() => smoothScrollToSection('evaluacion')}
        onBrandClick={() => smoothScrollToSection('inicio')}
        onEmergencyClick={() => setEmergencyModalOpen(true)}
      />

      <main id="inicio" className="relative z-10 flex-1">
        {/* Hero Section: Uncluttered Silent Authority Statement + 3D Vault Sculpture */}
        <section className="pt-8 pb-12 sm:pt-14 sm:pb-16 lg:pb-18">
          <div className="max-w-[1200px] xl:max-w-[1280px] mx-auto px-5 sm:px-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 sm:gap-8 xl:gap-10 items-center">
              {/* Left Proposition Column: Zero Top Labels, Pure Headline + Single-Impact Body */}
              <div className="lg:col-span-6 flex flex-col justify-center lg:pr-2">
                <h1 className="text-[clamp(2.1rem,3.65vw,3.55rem)] font-medium leading-[1.08] tracking-tight text-[#F1F5F9] text-balance">
                  {t.hero.headline}
                </h1>

                <p className="mt-4 text-base sm:text-[17px] font-light text-[#94A3B8] leading-relaxed tracking-[0.01em] max-w-[52ch]">
                  {t.hero.body}
                </p>

                <div className="mt-7 sm:mt-8 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-x-5 sm:gap-y-3">
                  <button
                    type="button"
                    onClick={() => smoothScrollToSection('evaluacion')}
                    className="inline-flex items-center justify-center gap-2.5 min-h-12 sm:min-h-11 px-5 py-3 rounded-xl btn-platinum text-sm font-medium active:scale-[0.99] transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E2E8F0]"
                  >
                    <span>{t.hero.primaryCta}</span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setEmergencyModalOpen(true)}
                    className="group inline-flex items-center justify-center sm:justify-start gap-2 min-h-10 py-2 text-sm font-normal text-[#94A3B8] hover:text-[#E2E8F0] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E2E8F0]"
                  >
                    <ShieldAlert className="w-4 h-4 icon-slate shrink-0" />
                    <span className="underline decoration-[#94A3B8]/40 group-hover:decoration-[#E2E8F0] underline-offset-4 transition-colors">
                      {t.hero.emergencyTrigger}
                    </span>
                  </button>
                </div>
              </div>

              {/* Right Interactive 3D Vault Sculpture Preserved with Muted Cobalt Backlight */}
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
                  <VaultSculpture3D />
                </div>
              </ParallaxLayer>
            </div>
          </div>
        </section>

        {/* Central Elevator Pitch + Profiles & Operating Principles */}
        <BoutiqueProfilesSection onSelectAudience={handleSelectAudience} />

        {/* Service Tiers (Argos & Atlas): Clean Executive Header + Synchronized Dual Cut-Glass Subgrid */}
        <section id="servicios" className="py-12 sm:py-16 lg:py-18 border-t border-white/[0.07]">
          <div className="max-w-[1200px] xl:max-w-[1280px] mx-auto px-5 sm:px-8 w-full">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
              <div className="max-w-[56ch]">
                <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#F1F5F9] text-balance">
                  {t.services.headline}
                </h2>
                <p className="mt-2.5 text-sm sm:text-base font-light text-[#94A3B8] leading-relaxed tracking-[0.01em]">
                  {t.services.subtitle}
                </p>
              </div>

              {/* Discreet Interactive Scope Switcher balancing the PC header row */}
              <div className="shrink-0 self-start lg:self-auto">
                <div
                  role="group"
                  aria-label={t.services.headline}
                  className="inline-flex items-center gap-1 p-1 rounded-xl bg-[#0A0F1C]/65 border border-white/[0.08]"
                >
                  <button
                    type="button"
                    aria-pressed={activeTier === 'argos'}
                    onClick={() => setActiveTier('argos')}
                    className={`min-h-9 px-3.5 py-1.5 rounded-lg text-xs transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E2E8F0] ${
                      activeTier === 'argos'
                        ? 'bg-[#E2E8F0] text-[#0A0F1C] font-medium'
                        : 'text-[#94A3B8] hover:text-[#E2E8F0] font-normal'
                    }`}
                  >
                    {t.services.argos.tierTag} · {t.services.argos.name}
                  </button>
                  <button
                    type="button"
                    aria-pressed={activeTier === 'atlas'}
                    onClick={() => setActiveTier('atlas')}
                    className={`min-h-9 px-3.5 py-1.5 rounded-lg text-xs transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E2E8F0] ${
                      activeTier === 'atlas'
                        ? 'bg-[#E2E8F0] text-[#0A0F1C] font-medium'
                        : 'text-[#94A3B8] hover:text-[#E2E8F0] font-normal'
                    }`}
                  >
                    {t.services.atlas.tierTag} · {t.services.atlas.name}
                  </button>
                </div>
              </div>
            </div>

            {/* Dual Cut-Glass Service Scope Cards:
                3-track CSS subgrid on PC aligns Header, Top Hairline, Bullets, and Bottom CTA Hairline */}
            <ParallaxLayer speed={0.016} maxOffset={6} desktopOnly className="relative mt-7 sm:mt-8">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-10 left-[8%] w-72 h-72 rounded-full cobalt-backlight-soft"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute top-1/4 right-[6%] w-80 h-80 rounded-full cobalt-backlight"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-8 left-1/3 w-96 h-48 rounded-full cobalt-backlight-soft"
              />

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-x-6 lg:gap-y-0 lg:grid-rows-[auto_1fr_auto]">
                {/* Nivel I: Argos (Gestión Personal) */}
                <article
                  onMouseEnter={() => setActiveTier('argos')}
                  onTouchStart={() => setActiveTier('argos')}
                  className={`w-full rounded-2xl p-5 sm:p-8 flex flex-col lg:grid lg:grid-rows-subgrid lg:row-span-3 lg:gap-y-0 transition-all duration-200 hover:-translate-y-0.5 ${
                    activeTier === 'argos' ? 'glass-panel-featured' : 'glass-panel'
                  }`}
                >
                  <div className="pb-5">
                    <div className="text-xs font-normal text-[#94A3B8] flex items-center gap-2 tracking-[0.02em]">
                      <span className="tabular-nums text-[#E2E8F0] font-medium">
                        {t.services.argos.tierTag}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{t.services.argos.scopeTag}</span>
                    </div>

                    <h3 className="mt-2 text-2xl font-medium tracking-tight text-[#F1F5F9]">
                      {t.services.argos.name}
                    </h3>

                    <p className="mt-2 text-sm font-light text-[#CBD5E1] leading-relaxed tracking-[0.01em] max-w-[50ch]">
                      {t.services.argos.scopeSummary}
                    </p>
                  </div>

                  <div className="py-5 border-t border-white/[0.07] flex-1">
                    <ul className="space-y-3">
                      {t.services.argos.bullets.map((bullet) => (
                        <li
                          key={bullet}
                          className="flex items-start gap-3 text-sm font-light text-[#94A3B8] leading-snug tracking-[0.01em]"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-[7px] w-1.5 h-1.5 rounded-full bg-[#94A3B8]/80 shrink-0"
                          />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-5 border-t border-white/[0.07] flex items-center">
                    <button
                      type="button"
                      onClick={() => handleSelectTierForAudit('argos')}
                      className={`group w-full min-h-11 py-2.5 px-5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E2E8F0] ${
                        activeTier === 'argos'
                          ? 'btn-platinum'
                          : 'border border-white/[0.12] bg-white/[0.02] text-[#E2E8F0] hover:border-[#E2E8F0]/45 hover:bg-white/[0.04]'
                      }`}
                    >
                      <span>{t.services.argos.cta}</span>
                      <ArrowRight
                        className={`w-4 h-4 shrink-0 ${activeTier === 'argos' ? '' : 'icon-slate'}`}
                      />
                    </button>
                  </div>
                </article>

                {/* Nivel II: Atlas (Delegación de Accesos) */}
                <article
                  onMouseEnter={() => setActiveTier('atlas')}
                  onTouchStart={() => setActiveTier('atlas')}
                  className={`w-full text-[#E2E8F0] rounded-2xl p-5 sm:p-8 flex flex-col lg:grid lg:grid-rows-subgrid lg:row-span-3 lg:gap-y-0 transition-all duration-200 hover:-translate-y-0.5 ${
                    activeTier === 'atlas' ? 'glass-panel-featured' : 'glass-panel'
                  }`}
                >
                  <div className="pb-5">
                    <div className="text-xs font-normal text-[#94A3B8] flex items-center gap-2 tracking-[0.02em]">
                      <span className="tabular-nums text-[#E2E8F0] font-medium">
                        {t.services.atlas.tierTag}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{t.services.atlas.scopeTag}</span>
                    </div>

                    <h3 className="mt-2 text-2xl font-medium tracking-tight text-[#F1F5F9]">
                      {t.services.atlas.name}
                    </h3>

                    <p className="mt-2 text-sm font-light text-[#CBD5E1] leading-relaxed tracking-[0.01em] max-w-[50ch]">
                      {t.services.atlas.scopeSummary}
                    </p>
                  </div>

                  <div className="py-5 border-t border-white/[0.07] flex-1">
                    <ul className="space-y-3">
                      {t.services.atlas.bullets.map((bullet) => (
                        <li
                          key={bullet}
                          className="flex items-start gap-3 text-sm font-light text-[#94A3B8] leading-snug tracking-[0.01em]"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-[7px] w-1.5 h-1.5 rounded-full bg-[#E2E8F0]/75 shrink-0"
                          />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-5 border-t border-white/[0.07] flex items-center">
                    <button
                      type="button"
                      onClick={() => handleSelectTierForAudit('atlas')}
                      className={`group w-full min-h-11 py-2.5 px-5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E2E8F0] ${
                        activeTier === 'atlas'
                          ? 'btn-platinum'
                          : 'border border-white/[0.12] bg-white/[0.02] text-[#E2E8F0] hover:border-[#E2E8F0]/45 hover:bg-white/[0.04]'
                      }`}
                    >
                      <span>{t.services.atlas.cta}</span>
                      <ArrowRight
                        className={`w-4 h-4 shrink-0 ${activeTier === 'atlas' ? '' : 'icon-slate'}`}
                      />
                    </button>
                  </div>
                </article>
              </div>
            </ParallaxLayer>
          </div>
        </section>

        {/* Dedicated Hierarchy Section: Palantirr (Passive OSINT) & Incident Protocol */}
        <SpecializedUnitsSection
          onOpenPalantirr={handleOpenRaptorPage}
          onOpenIncidentProtocol={handleOpenCrisisPage}
          onOpenEmergency={() => setEmergencyModalOpen(true)}
        />

        {/* Politically Exposed Persons (PEP) & Candidacies Personal Protection */}
        <PublicExposureSection
          onRequestPepAudit={handleSelectPepForAudit}
          onOpenRaptor={handleOpenRaptorPage}
        />

        {/* D3.js Public Exposure Reduction Metrics */}
        <ProtectionMetricsSection onRequestAudit={handleSelectMetricsScopeForAudit} />

        {/* Tailored Intelligence Infrastructure */}
        <TechnologyStack />

        {/* Assessment Intake */}
        <EvaluationForm
          preferredMode={preferredMode}
          onModeSyncTier={(tier) => setActiveTier(tier)}
          onOpenPrivacy={() => setPrivacyModalOpen(true)}
          serviceVariant={mainFormVariant}
          onClearPepVariant={() => setMainFormVariant('tiers')}
        />
      </main>

      {/* Abyssal Footer */}
      <footer className="relative z-10 border-t border-white/[0.07] bg-[#0A0F1C]/80 backdrop-blur-xl">
        <div className="max-w-[1200px] xl:max-w-[1280px] mx-auto px-5 sm:px-8 py-6 w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-xs font-light text-[#94A3B8]">
            <CotoLogoMark className="w-5 h-5 shrink-0" />
            <span className="text-sm font-medium tracking-tight text-[#E2E8F0]">Coto Privado</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">© {new Date().getFullYear()}</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-normal text-[#94A3B8]">
            <button
              type="button"
              onClick={handleOpenRaptorPage}
              className="hover:text-[#E2E8F0] transition-colors cursor-pointer whitespace-nowrap"
            >
              {t.footer.raptorLink}
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={handleOpenCrisisPage}
              className="hover:text-[#E2E8F0] transition-colors cursor-pointer whitespace-nowrap"
            >
              {t.footer.crisisLink}
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setEmergencyModalOpen(true)}
              className="hover:text-[#E2E8F0] transition-colors cursor-pointer whitespace-nowrap"
            >
              {t.footer.contactTrigger}
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setPrivacyModalOpen(true)}
              className="hover:text-[#E2E8F0] transition-colors cursor-pointer whitespace-nowrap"
            >
              {t.footer.privacyLink}
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setAdminModalOpen(true)}
              className="hover:text-[#E2E8F0] transition-colors cursor-pointer whitespace-nowrap"
            >
              {t.footer.privateAccess}
            </button>
          </div>
        </div>
      </footer>

      <PrivacyModal isOpen={privacyModalOpen} onClose={() => setPrivacyModalOpen(false)} />
      <EmergencyModal
        isOpen={emergencyModalOpen}
        onClose={() => setEmergencyModalOpen(false)}
        onGoToEvaluation={() => smoothScrollToSection('evaluacion')}
        onOpenPrivacy={() => setPrivacyModalOpen(true)}
        onOpenCrisisGuide={handleOpenCrisisPage}
      />
      {adminModalOpen && (
        <Suspense fallback={null}>
          <AdminInboxModal isOpen={adminModalOpen} onClose={() => setAdminModalOpen(false)} />
        </Suspense>
      )}
    </div>
  );
}
