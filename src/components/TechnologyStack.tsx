import { useI18n } from '../lib/i18n';
import ParallaxLayer from './ParallaxLayer';
import { PartnerLogo } from './PartnerLogos';

export default function TechnologyStack() {
  const { t } = useI18n();

  return (
    <section id="respaldo" className="relative z-10 py-12 sm:py-16 border-t border-white/10">
      <div className="max-w-[1200px] xl:max-w-[1280px] mx-auto px-6 sm:px-8 w-full">
        {/* Clean Section Header */}
        <div className="max-w-[60ch]">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white text-balance">
            {t.tech.headline}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-white/65 leading-relaxed tracking-[0.01em]">
            {t.tech.body}
          </p>
        </div>

        {/* Unified 5-Column Cut-Glass Partner Strip Fed by Diffused Electric Yellow Backlight */}
        <ParallaxLayer speed={0.016} maxOffset={6} desktopOnly className="relative mt-6 sm:mt-7">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-y-6 left-1/4 right-1/4 rounded-full electric-backlight-soft"
          />

          <div className="relative z-10 glass-panel rounded-2xl overflow-hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
            {t.tech.partners.map((partner, index) => {
              const isLastOdd = index === t.tech.partners.length - 1;
              const borderClasses = [
                index > 0 ? 'border-t border-white/10' : '',
                index === 1 ? 'sm:border-t-0' : '',
                index >= 1 ? 'lg:border-t-0 lg:border-l lg:border-white/10' : '',
                index % 2 === 1 && !isLastOdd ? 'sm:border-l sm:border-white/10' : '',
              ]
                .filter(Boolean)
                .join(' ');

              return (
                <article
                  key={partner.id}
                  className={`p-5 sm:p-6 flex flex-col justify-between gap-5 hover:bg-white/[0.025] transition-colors ${borderClasses} ${
                    isLastOdd ? 'sm:col-span-2 lg:col-span-1' : ''
                  }`}
                >
                  <div className="h-8 flex items-center">
                    <h3 className="sr-only">{partner.name}</h3>
                    <PartnerLogo id={partner.id} label={partner.name} />
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-white tracking-[0.01em]">
                      {partner.role}
                    </div>
                    <p className="mt-1 text-xs text-white/60 leading-relaxed tracking-[0.01em]">
                      {partner.desc}
                    </p>
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
