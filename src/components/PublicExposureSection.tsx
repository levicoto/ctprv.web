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
      className="relative z-10 py-12 sm:py-16 border-t border-zinc-200/80"
    >
      <div className="max-w-[1200px] xl:max-w-[1280px] mx-auto px-6 sm:px-8 w-full">
        <ParallaxLayer speed={0.016} maxOffset={6} desktopOnly>
          <article className="glass-panel-dark text-white rounded-2xl overflow-hidden">
            {/* Band 1: Clean Symmetric Header Split */}
            <div className="p-6 sm:p-8 lg:px-10 lg:py-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div className="max-w-[62ch]">
                <div className="text-xs font-medium text-zinc-400 flex flex-wrap items-center gap-2 tracking-[0.01em]">
                  <span className="text-zinc-200">{t.pep.kicker[0]}</span>
                  <span aria-hidden="true">·</span>
                  <span>{t.pep.kicker[1]}</span>
                </div>

                <h2 className="mt-2.5 text-2xl sm:text-3xl font-semibold tracking-tight text-white text-balance">
                  {t.pep.headline}
                </h2>

                <p className="mt-3 text-sm sm:text-base text-zinc-300 leading-relaxed tracking-[0.01em]">
                  {t.pep.body}
                </p>
              </div>

              <div className="shrink-0">
                <button
                  type="button"
                  onClick={onRequestPepAudit}
                  className="w-full sm:w-auto py-3 px-5 rounded-xl bg-white text-zinc-950 text-sm font-medium hover:bg-zinc-200 active:scale-[0.99] transition-all inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <span>{t.pep.cta}</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
              </div>
            </div>

            {/* Band 2: Razor-Sharp 2x2 Hairline Matrix (Zero Floating Clutter) */}
            <dl className="grid grid-cols-1 md:grid-cols-2 border-t border-white/10">
              {t.pep.pillars.map((pillar, index) => {
                const cellBorders = [
                  index > 0 ? 'border-t border-white/10' : '',
                  index === 1 ? 'md:border-t-0' : '',
                  index % 2 === 1 ? 'md:border-l md:border-white/10' : '',
                ]
                  .filter(Boolean)
                  .join(' ');

                return (
                  <div
                    key={pillar.num}
                    className={`p-6 sm:px-8 sm:py-6 lg:px-10 ${cellBorders}`}
                  >
                    <div className="flex items-baseline gap-2.5">
                      <span className="font-mono text-xs font-medium text-zinc-400 tabular-nums shrink-0">
                        {pillar.num}
                      </span>
                      <dt className="text-sm sm:text-base font-semibold text-white tracking-[0.01em] text-balance">
                        {pillar.title}
                      </dt>
                    </div>
                    <dd className="mt-2 text-sm text-zinc-300 leading-relaxed tracking-[0.01em]">
                      {pillar.desc}
                    </dd>
                  </div>
                );
              })}
            </dl>

            {/* Band 3: Quiet Single-Line Institutional Footer */}
            <div className="px-6 sm:px-8 lg:px-10 py-4 border-t border-white/10 bg-white/[0.02] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-400 tracking-[0.01em]">
              <span>{t.pep.footnote}</span>

              <button
                type="button"
                onClick={onOpenRaptor}
                className="inline-flex items-center gap-1.5 text-zinc-200 hover:text-white font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 self-start sm:self-auto focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                <span className="underline decoration-white/30 hover:decoration-white underline-offset-4 transition-colors">
                  {t.pep.raptorCta}
                </span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </button>
            </div>
          </article>
        </ParallaxLayer>
      </div>
    </section>
  );
}
