import { ArrowRight } from 'lucide-react';
import { useI18n } from '../lib/i18n';
import ParallaxLayer from './ParallaxLayer';

interface PublicExposureSectionProps {
  onRequestPepAudit: () => void;
  onOpenRaptor: () => void;
}

export default function PublicExposureSection({
  onRequestPepAudit,
  onOpenRaptor,
}: PublicExposureSectionProps) {
  const { t } = useI18n();

  return (
    <section
      id="exposicion-publica"
      className="relative z-10 py-12 sm:py-16 lg:py-18 border-t border-white/[0.07]"
    >
      <div className="max-w-[1200px] xl:max-w-[1280px] mx-auto px-5 sm:px-8 w-full">
        <ParallaxLayer speed={0.016} maxOffset={6} desktopOnly className="relative">
          {/* Muted Cobalt Blue Spheres Behind Thick Cut-Glass Monolith */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-12 -left-8 w-80 h-80 rounded-full cobalt-backlight"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-12 right-6 w-96 h-72 rounded-full cobalt-backlight-soft"
          />

          <article className="relative z-10 glass-panel-featured text-[#E2E8F0] rounded-2xl overflow-hidden">
            {/* Band 1: Clean Symmetric Executive Header Split */}
            <div className="p-5 sm:p-8 lg:px-10 lg:py-9 flex flex-col lg:flex-row lg:items-end justify-between gap-5 sm:gap-6">
              <div className="max-w-[62ch]">
                <div className="text-xs font-medium text-[#E2E8F0] tracking-[0.02em]">
                  {t.pep.kicker}
                </div>

                <h2 className="mt-2.5 text-2xl sm:text-3xl font-medium tracking-tight text-[#F1F5F9] text-balance">
                  {t.pep.headline}
                </h2>

                <p className="mt-3 text-sm sm:text-base font-light text-[#94A3B8] leading-relaxed tracking-[0.01em]">
                  {t.pep.body}
                </p>
              </div>

              <div className="shrink-0">
                <button
                  type="button"
                  onClick={onRequestPepAudit}
                  className="w-full sm:w-auto min-h-11 py-3 px-5 rounded-xl btn-platinum text-sm font-medium active:scale-[0.99] transition-all inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E2E8F0]"
                >
                  <span>{t.pep.cta}</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
              </div>
            </div>

            {/* Band 2: 2x2 Cut-Glass Matrix with Equal Row Baselines */}
            <dl className="grid grid-cols-1 md:grid-cols-2 border-t border-white/[0.07]">
              {t.pep.pillars.map((pillar, index) => {
                const cellBorders = [
                  index > 0 ? 'border-t border-white/[0.07]' : '',
                  index === 1 ? 'md:border-t-0' : '',
                  index % 2 === 1 ? 'md:border-l md:border-white/[0.07]' : '',
                ]
                  .filter(Boolean)
                  .join(' ');

                return (
                  <div
                    key={pillar.num}
                    className={`p-5 sm:px-8 sm:py-6 lg:px-10 hover:bg-white/[0.018] transition-colors ${cellBorders}`}
                  >
                    <div className="flex items-baseline gap-3">
                      <span className="text-xs font-medium text-[#94A3B8] tabular-nums shrink-0">
                        {pillar.num}
                      </span>
                      <dt className="text-sm sm:text-base font-medium text-[#E2E8F0] tracking-[0.01em] text-balance">
                        {pillar.title}
                      </dt>
                    </div>
                    <dd className="mt-2 text-sm font-light text-[#94A3B8] leading-relaxed tracking-[0.01em]">
                      {pillar.desc}
                    </dd>
                  </div>
                );
              })}
            </dl>

            {/* Band 3: Discreet Single-Line NDA & OSINT Strip */}
            <div className="px-5 sm:px-8 lg:px-10 py-4 border-t border-white/[0.07] bg-[#0A0F1C]/45 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-light text-[#94A3B8] tracking-[0.01em]">
              <span>{t.pep.footnote}</span>

              <button
                type="button"
                onClick={onOpenRaptor}
                className="group min-h-9 inline-flex items-center gap-1.5 text-[#E2E8F0] hover:text-white font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 self-start sm:self-auto focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E2E8F0]"
              >
                <span className="underline decoration-[#94A3B8]/50 group-hover:decoration-[#E2E8F0] underline-offset-4 transition-colors">
                  {t.pep.raptorCta}
                </span>
                <ArrowRight className="w-3.5 h-3.5 icon-slate shrink-0" />
              </button>
            </div>
          </article>
        </ParallaxLayer>
      </div>
    </section>
  );
}
