import { useI18n } from '../lib/i18n';
import ParallaxLayer from './ParallaxLayer';
import { PartnerLogo } from './PartnerLogos';

const COLUMN_SPEEDS = [-0.032, 0.018, 0.042];

export default function TechnologyStack() {
  const { t } = useI18n();

  return (
    <section id="respaldo" className="relative z-10 py-24 sm:py-28 border-t border-zinc-200/80">
      <div className="max-w-[1160px] mx-auto px-6">
        {/* Balanced 6-Cell Symmetrical Grid: 1 Anchor Card + 5 Brand Cards (1x6 mobile, 2x3 tablet/split, 3x2 desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {/* Cell 1: Dark Architectural Header Card */}
          <ParallaxLayer speed={COLUMN_SPEEDS[0]} maxOffset={16} desktopOnly className="h-full">
            <div className="h-full glass-panel-dark text-white rounded-2xl p-8 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white text-balance">
                  {t.tech.headline}
                </h2>
                <p className="mt-4 text-sm sm:text-base text-zinc-300 leading-relaxed tracking-[0.01em]">
                  {t.tech.body}
                </p>
              </div>
            </div>
          </ParallaxLayer>

          {/* Cells 2–6: Monochrome Partner Cards */}
          {t.tech.partners.map((partner, idx) => {
            const cellIndex = idx + 1;
            const speed = COLUMN_SPEEDS[cellIndex % 3];
            return (
              <ParallaxLayer
                key={partner.id}
                speed={speed}
                maxOffset={16}
                desktopOnly
                className="h-full"
              >
                <article className="h-full glass-panel rounded-2xl p-8 flex flex-col justify-between transition-transform duration-200 hover:-translate-y-0.5">
                  <div className="h-10 flex items-center">
                    <h3 className="sr-only">{partner.name}</h3>
                    <PartnerLogo id={partner.id} label={partner.name} />
                  </div>

                  <div className="mt-6 pt-5 border-t border-zinc-200/80">
                    <div className="text-sm font-semibold text-zinc-950">{partner.role}</div>
                    <p className="mt-1.5 text-sm text-zinc-600 leading-relaxed">{partner.desc}</p>
                  </div>
                </article>
              </ParallaxLayer>
            );
          })}
        </div>
      </div>
    </section>
  );
}
