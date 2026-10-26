import { useI18n } from '../lib/i18n';
import ParallaxLayer from './ParallaxLayer';
import { PartnerLogo } from './PartnerLogos';

export default function TechnologyStack() {
  const { t } = useI18n();

  return (
    <section id="respaldo" className="relative z-10 py-20 sm:py-28 border-t border-zinc-200/80">
      <div className="max-w-[1200px] xl:max-w-[1280px] mx-auto px-6 sm:px-8 w-full">
        {/* Cohesive 6-Cell Architectural Grid: unified vertical glide keeps all horizontal & vertical lines 100% aligned */}
        <ParallaxLayer speed={0.02} maxOffset={10} desktopOnly>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {/* Cell 1: Dark Architectural Header Card */}
            <div className="h-full glass-panel-dark text-white rounded-2xl p-8 sm:p-9 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white text-balance">
                  {t.tech.headline}
                </h2>
                <p className="mt-4 text-sm sm:text-base text-zinc-300 leading-relaxed tracking-[0.01em]">
                  {t.tech.body}
                </p>
              </div>
            </div>

            {/* Cells 2–6: Monochrome Partner Cards */}
            {t.tech.partners.map((partner) => (
              <article
                key={partner.id}
                className="h-full glass-panel rounded-2xl p-8 sm:p-9 flex flex-col justify-between transition-transform duration-200 hover:-translate-y-0.5"
              >
                <div className="h-10 flex items-center">
                  <h3 className="sr-only">{partner.name}</h3>
                  <PartnerLogo id={partner.id} label={partner.name} />
                </div>

                <div className="mt-7 pt-5 border-t border-zinc-200/80">
                  <div className="text-sm font-semibold text-zinc-950">{partner.role}</div>
                  <p className="mt-1.5 text-sm text-zinc-600 leading-relaxed">{partner.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </ParallaxLayer>
      </div>
    </section>
  );
}
