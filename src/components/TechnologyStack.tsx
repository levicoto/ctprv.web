import { useI18n } from '../lib/i18n';
import ParallaxLayer from './ParallaxLayer';
import { PartnerLogo } from './PartnerLogos';

export default function TechnologyStack() {
  const { t } = useI18n();

  return (
    <section id="respaldo" className="relative z-10 py-12 sm:py-16 border-t border-zinc-200/80">
      <div className="max-w-[1200px] xl:max-w-[1280px] mx-auto px-6 sm:px-8 w-full">
        {/* Clean Section Header */}
        <div className="max-w-[60ch]">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-950 text-balance">
            {t.tech.headline}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-zinc-600 leading-relaxed">
            {t.tech.body}
          </p>
        </div>

        {/* Unified 5-Column Architectural Partner Strip (Replaces 6 Bulky Lopsided Cards) */}
        <ParallaxLayer speed={0.016} maxOffset={6} desktopOnly className="mt-6 sm:mt-7">
          <div className="rounded-2xl border border-zinc-200/90 overflow-hidden bg-zinc-200/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px shadow-sm shadow-zinc-950/[0.03]">
            {t.tech.partners.map((partner, index) => {
              const isLastOdd = index === t.tech.partners.length - 1;
              return (
                <article
                  key={partner.id}
                  className={`bg-white/95 p-5 sm:p-6 flex flex-col justify-between gap-5 ${
                    isLastOdd ? 'sm:col-span-2 lg:col-span-1' : ''
                  }`}
                >
                  <div className="h-8 flex items-center">
                    <h3 className="sr-only">{partner.name}</h3>
                    <PartnerLogo id={partner.id} label={partner.name} />
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-zinc-950">{partner.role}</div>
                    <p className="mt-1 text-xs text-zinc-600 leading-relaxed">{partner.desc}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </ParallaxLayer>
      </div>
    </section>
  );
}
