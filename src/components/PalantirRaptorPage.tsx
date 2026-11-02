import { useEffect } from 'react';
import { ArrowRight, ShieldAlert } from 'lucide-react';
import RaptorEye3D from './RaptorEye3D';
import EvaluationForm from './EvaluationForm';
import CotoLogoMark from './CotoLogoMark';
import SiteHeader, { type HeaderLinkItem } from './SiteHeader';
import ParallaxLayer, {
  AmbientParallaxBackdrop,
  smoothScrollToSection,
} from './ParallaxLayer';
import { useI18n } from '../lib/i18n';

interface PalantirRaptorPageProps {
  onBackToMain: () => void;
  onOpenCrisis: () => void;
  onOpenAdmin: () => void;
  onOpenPrivacy: () => void;
  onOpenEmergency: () => void;
}

export default function PalantirRaptorPage({
  onBackToMain,
  onOpenCrisis,
  onOpenAdmin,
  onOpenPrivacy,
  onOpenEmergency,
}: PalantirRaptorPageProps) {
  const { t } = useI18n();

  useEffect(() => {
    document.title = t.raptorMetaTitle;
  }, [t.raptorMetaTitle]);

  const handleScrollToForm = () => {
    smoothScrollToSection('evaluacion');
    window.setTimeout(() => {
      const firstInput = document.getElementById('eval-nombre');
      firstInput?.focus({ preventScroll: true });
    }, 620);
  };

  const navLinks: HeaderLinkItem[] = [
    {
      label: t.raptor.nav.overview,
      href: '#raptor-resumen',
      onSelect: () => smoothScrollToSection('raptor-resumen'),
    },
    {
      label: t.raptor.nav.capabilities,
      href: '#raptor-capacidades',
      onSelect: () => smoothScrollToSection('raptor-capacidades'),
    },
    {
      label: t.raptor.nav.dossier,
      href: '#raptor-dossier',
      onSelect: () => smoothScrollToSection('raptor-dossier'),
    },
    {
      label: t.raptor.nav.evaluation,
      href: '#evaluacion',
      onSelect: () => smoothScrollToSection('evaluacion'),
    },
  ];

  const mobileSecondaryLinks: HeaderLinkItem[] = [
    {
      label: t.raptor.nav.backToMain,
      href: '#inicio',
      onSelect: onBackToMain,
    },
    {
      label: t.nav.crisis,
      href: '#protocolo-crisis',
      onSelect: onOpenCrisis,
    },
  ];

  return (
    <div className="relative min-h-screen architectural-canvas text-[#E2E8F0] flex flex-col overflow-x-clip">
      <AmbientParallaxBackdrop />

      <SiteHeader
        isSubpage
        backLabel={t.raptor.nav.backToMain}
        desktopLinks={navLinks}
        mobilePrimaryLinks={navLinks}
        mobileSecondaryLinks={mobileSecondaryLinks}
        ctaLabel={t.raptor.nav.cta}
        mobileCtaLabel={t.raptor.hero.primaryCta}
        onCtaClick={handleScrollToForm}
        onBrandClick={onBackToMain}
        onEmergencyClick={onOpenEmergency}
      />

      <main id="raptor-resumen" className="relative z-10 flex-1">
        {/* Hero Section: Unified 6 / 6 Architectural Grid with 3D Optical Beacon */}
        <section className="pt-9 pb-14 sm:pt-14 sm:pb-18">
          <div className="max-w-[1200px] xl:max-w-[1280px] mx-auto px-6 sm:px-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Proposition Column */}
              <div className="lg:col-span-6 flex flex-col justify-center lg:pr-4">
                <div className="text-xs font-medium text-[#E2E8F0] tracking-[0.02em]">
                  {t.raptor.hero.kicker}
                </div>

                <h1 className="mt-4 text-[clamp(2.2rem,3.5vw,3.35rem)] font-medium leading-[1.08] tracking-tight text-[#F1F5F9] text-balance">
                  {t.raptor.hero.name}
                </h1>

                <p className="mt-2.5 text-lg font-normal text-[#CBD5E1] tracking-tight">
                  {t.raptor.hero.subtitle}
                </p>

                <p className="mt-4 text-base font-light text-[#94A3B8] leading-relaxed tracking-[0.01em] max-w-[54ch]">
                  {t.raptor.hero.body}
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
                  <button
                    type="button"
                    onClick={handleScrollToForm}
                    className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl btn-platinum text-sm font-medium active:scale-[0.99] transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E2E8F0]"
                  >
                    <span>{t.raptor.hero.primaryCta}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={onOpenEmergency}
                    className="group inline-flex items-center gap-2 py-2.5 text-sm font-normal text-[#94A3B8] hover:text-[#E2E8F0] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E2E8F0]"
                  >
                    <ShieldAlert className="w-4 h-4 icon-slate shrink-0" />
                    <span className="underline decoration-[#94A3B8]/40 group-hover:decoration-[#E2E8F0] underline-offset-4 transition-colors">
                      {t.hero.emergencyTrigger}
                    </span>
                  </button>
                </div>
              </div>

              {/* Right Interactive 3D Optical Beacon Preserved with Muted Cobalt Backlight */}
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
                  <RaptorEye3D />
                </div>
              </ParallaxLayer>
            </div>
          </div>
        </section>

        {/* Analytical Dimensions: Unified 2x2 Cut-Glass Matrix Fed by Muted Cobalt Spheres */}
        <section id="raptor-capacidades" className="py-14 sm:py-18 border-t border-white/[0.07]">
          <div className="max-w-[1200px] xl:max-w-[1280px] mx-auto px-6 sm:px-8 w-full">
            <div className="max-w-[56ch]">
              <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#F1F5F9] text-balance">
                {t.raptor.capabilities.headline}
              </h2>
              <p className="mt-2.5 text-sm sm:text-base font-light text-[#94A3B8] leading-relaxed tracking-[0.01em]">
                {t.raptor.capabilities.subtitle}
              </p>
            </div>

            <ParallaxLayer speed={0.016} maxOffset={6} desktopOnly className="relative mt-8">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-8 left-12 w-72 h-72 rounded-full cobalt-backlight"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-8 right-12 w-80 h-64 rounded-full cobalt-backlight-soft"
              />

              <div className="relative z-10 glass-panel rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
                {t.raptor.capabilities.items.map((item, index) => {
                  const cellBorders = [
                    index > 0 ? 'border-t border-white/[0.07]' : '',
                    index === 1 ? 'md:border-t-0' : '',
                    index % 2 === 1 ? 'md:border-l md:border-white/[0.07]' : '',
                  ]
                    .filter(Boolean)
                    .join(' ');

                  return (
                    <article
                      key={item.num}
                      className={`p-6 sm:p-7 flex flex-col justify-between hover:bg-white/[0.018] transition-colors ${cellBorders}`}
                    >
                      <div>
                        <div className="flex items-baseline gap-3">
                          <span className="text-xs font-medium text-[#94A3B8] tabular-nums shrink-0">
                            {item.num}
                          </span>
                          <h3 className="text-base sm:text-lg font-medium tracking-tight text-[#E2E8F0] text-balance">
                            {item.title}
                          </h3>
                        </div>
                        <p className="mt-2 text-sm font-light text-[#94A3B8] leading-relaxed tracking-[0.01em]">
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

        {/* Confidential Deliverable: Private Dossier Full-Width Cut-Glass Monolith */}
        <section id="raptor-dossier" className="py-14 sm:py-18 border-t border-white/[0.07]">
          <div className="max-w-[1200px] xl:max-w-[1280px] mx-auto px-6 sm:px-8 w-full">
            <ParallaxLayer speed={0.016} maxOffset={6} desktopOnly className="relative">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-y-6 right-10 w-80 rounded-full cobalt-backlight"
              />

              <div className="relative z-10 glass-panel-featured text-[#E2E8F0] rounded-2xl p-6 sm:p-8 lg:px-10 lg:py-9">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
                  <div className="lg:col-span-8">
                    <div className="text-xs font-medium text-[#E2E8F0] tracking-[0.02em]">
                      {t.raptor.dossier.kicker}
                    </div>

                    <h2 className="mt-2.5 text-2xl sm:text-3xl font-medium tracking-tight text-[#F1F5F9] text-balance">
                      {t.raptor.dossier.title}
                    </h2>

                    <p className="mt-3 text-sm sm:text-base font-light text-[#94A3B8] leading-relaxed tracking-[0.01em] max-w-[64ch]">
                      {t.raptor.dossier.body}
                    </p>
                  </div>

                  <div className="lg:col-span-4 flex lg:justify-end">
                    <button
                      type="button"
                      onClick={handleScrollToForm}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl btn-platinum text-sm font-medium transition-all whitespace-nowrap shrink-0 cursor-pointer"
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
            <span className="text-[#CBD5E1] font-normal">{t.raptor.hero.name}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">© {new Date().getFullYear()}</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-normal text-[#94A3B8]">
            <button
              type="button"
              onClick={onOpenCrisis}
              className="hover:text-[#E2E8F0] transition-colors cursor-pointer whitespace-nowrap"
            >
              {t.footer.crisisLink}
            </button>
            <span aria-hidden="true">·</span>
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
