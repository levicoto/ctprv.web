import { ArrowRight } from 'lucide-react';
import { useI18n } from '../lib/i18n';
import ParallaxLayer from './ParallaxLayer';

interface PublicExposureSectionProps {
  onRequestPepAudit: () => void;
  onOpenRaptor: () => void;
}

function renderPepHeadline(text: string) {
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

export default function PublicExposureSection({
  onRequestPepAudit,
  onOpenRaptor,
}: PublicExposureSectionProps) {
  const { t } = useI18n();

  return (
    <section
      id="exposicion-publica"
      className="relative z-10 py-12 sm:py-16 border-t border-white/10"
    >
      <div className="max-w-[1200px] xl:max-w-[1280px] mx-auto px-6 sm:px-8 w-full">
        <ParallaxLayer speed={0.016} maxOffset={6} desktopOnly className="relative">
          {/* Diffused Electric Yellow (#E6FF00) Backlight Spheres Feeding the Glass Monolith */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-12 -left-8 w-80 h-80 rounded-full electric-backlight"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-12 right-6 w-96 h-72 rounded-full electric-backlight-soft"
          />

          <article className="relative z-10 glass-panel-electric text-white rounded-2xl overflow-hidden">
            {/* Band 1: Clean Symmetric Header Split */}
            <div className="p-6 sm:p-8 lg:px-10 lg:py-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div className="max-w-[62ch]">
                <div className="text-xs font-medium text-white/60 flex flex-wrap items-center gap-2 tracking-[0.01em]">
                  <span className="text-[#E6FF00] font-semibold">{t.pep.kicker[0]}</span>
                  <span aria-hidden="true">·</span>
                  <span>{t.pep.kicker[1]}</span>
                </div>

                <h2 className="mt-2.5 text-2xl sm:text-3xl font-semibold tracking-tight text-white text-balance">
                  {renderPepHeadline(t.pep.headline)}
                </h2>

                <p className="mt-3 text-sm sm:text-base text-white/70 leading-relaxed tracking-[0.01em]">
                  {t.pep.body}
                </p>
              </div>

              <div className="shrink-0">
                <button
                  type="button"
                  onClick={onRequestPepAudit}
                  className="w-full sm:w-auto py-3 px-5 rounded-xl btn-electric text-sm font-semibold active:scale-[0.99] transition-all inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E6FF00]"
                >
                  <span>{t.pep.cta}</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
              </div>
            </div>

            {/* Band 2: Razor-Sharp 2x2 Cut-Glass Matrix (Transparent Cells So Backlight Refracts) */}
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
                    className={`p-6 sm:px-8 sm:py-6 lg:px-10 hover:bg-white/[0.02] transition-colors ${cellBorders}`}
                  >
                    <div className="flex items-baseline gap-2.5">
                      <span className="font-mono text-xs font-semibold text-[#E6FF00] tabular-nums shrink-0">
                        {pillar.num}
                      </span>
                      <dt className="text-sm sm:text-base font-semibold text-white tracking-[0.01em] text-balance">
                        {pillar.title}
                      </dt>
                    </div>
                    <dd className="mt-2 text-sm text-white/70 leading-relaxed tracking-[0.01em]">
                      {pillar.desc}
                    </dd>
                  </div>
                );
              })}
            </dl>

            {/* Band 3: Quiet Single-Line Institutional Footer */}
            <div className="px-6 sm:px-8 lg:px-10 py-4 border-t border-white/10 bg-black/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-white/55 tracking-[0.01em]">
              <span>{t.pep.footnote}</span>

              <button
                type="button"
                onClick={onOpenRaptor}
                className="inline-flex items-center gap-1.5 text-[#E6FF00] hover:text-white font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 self-start sm:self-auto focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E6FF00]"
              >
                <span className="underline decoration-[#E6FF00]/45 hover:decoration-white underline-offset-4 transition-colors">
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
