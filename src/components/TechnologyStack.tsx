import { useI18n } from '../lib/i18n';
import ParallaxLayer from './ParallaxLayer';
import { PartnerLogo } from './PartnerLogos';

export default function TechnologyStack() {
  const { t } = useI18n();

  return (
    <section
      id="respaldo"
      className="relative z-10 py-12 sm:py-16 lg:py-18 border-t border-white/[0.07]"
    >
      <div className="max-w-[1200px] xl:max-w-[1280px] mx-auto px-5 sm:px-8 w-full">
        {/* Clean Institutional Header */}
        <div className="max-w-[60ch]">
          <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#F1F5F9] text-balance">
            {t.tech.headline}
          </h2>
          <p className="mt-2.5 text-sm sm:text-base font-light text-[#94A3B8] leading-relaxed tracking-[0.01em]">
            {t.tech.body}
          </p>
        </div>

        {/* Unified 5-Column Cut-Glass Partner Strip:
            Aligned top logo row + aligned horizontal hairline so all 5 role titles start on the exact same baseline on PC */}
        <ParallaxLayer speed={0.016} maxOffset={6} desktopOnly className="relative mt-7 sm:mt-8">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-y-8 left-1/4 right-1/4 rounded-full cobalt-backlight-soft"
          />

          <div className="relative z-10 glass-panel rounded-2xl overflow-hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
            {t.tech.partners.map((partner, index) => {
              const isLastOdd = index === t.tech.partners.length - 1;
              const borderClasses = [
                index > 0 ? 'border-t border-white/[0.06]' : '',
                index === 1 ? 'sm:border-t-0' : '',
                index >= 1 ? 'lg:border-t-0 lg:border-l lg:border-white/[0.06]' : '',
                index % 2 === 1 && !isLastOdd ? 'sm:border-l sm:border-white/[0.06]' : '',
              ]
                .filter(Boolean)
                .join(' ');

              return (
                <article
                  key={partner.id}
                  className={`group p-5 sm:p-6 flex flex-col hover:bg-white/[0.02] transition-colors ${borderClasses} ${
                    isLastOdd ? 'sm:col-span-2 lg:col-span-1' : ''
                  }`}
                >
                  <div className="h-11 pb-3.5 border-b border-white/[0.06] flex items-center">
                    <h3 className="sr-only">{partner.name}</h3>
                    <PartnerLogo id={partner.id} label={partner.name} />
                  </div>

                  <div className="pt-4">
                    <div className="text-xs font-medium text-[#E2E8F0] tracking-[0.01em]">
                      {partner.role}
                    </div>
                    <p className="mt-1.5 text-xs font-light text-[#94A3B8] leading-relaxed tracking-[0.01em]">
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
