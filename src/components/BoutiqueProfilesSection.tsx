import { Fragment } from 'react';
import { ArrowRight } from 'lucide-react';
import { type BoutiqueAudienceItem, useI18n } from '../lib/i18n';
import ParallaxLayer from './ParallaxLayer';

interface BoutiqueProfilesSectionProps {
  onSelectAudience: (audienceId: BoutiqueAudienceItem['id']) => void;
}

const AUDIENCE_ROW_PLACEMENT = [
  'lg:row-start-2',
  'lg:row-start-3',
  'lg:row-start-4',
] as const;

export default function BoutiqueProfilesSection({
  onSelectAudience,
}: BoutiqueProfilesSectionProps) {
  const { t } = useI18n();

  return (
    <section
      id="perfiles"
      className="relative z-10 py-12 sm:py-16 lg:py-18 border-t border-white/[0.07]"
    >
      <div className="max-w-[1200px] xl:max-w-[1280px] mx-auto px-5 sm:px-8 w-full">
        {/* Central Elevator Pitch: Uncluttered Silent Authority Statement */}
        <div className="max-w-[68ch]">
          <h2 className="text-xl sm:text-2xl lg:text-[29px] font-light leading-[1.32] tracking-tight text-[#94A3B8] text-balance">
            <span>{t.profiles.pitchLead} </span>
            <span className="font-medium text-[#F1F5F9]">{t.profiles.pitchAnchor}</span>
          </h2>
        </div>

        {/* Unified 12-Column Architectural Grid:
            - Mobile (<lg): Sequential reading order (All 3 Profiles -> All 3 Operating Principles)
            - Desktop (lg+): Synchronized 4-row grid so every horizontal hairline aligns 100% across both columns */}
        <ParallaxLayer speed={0.016} maxOffset={6} desktopOnly className="relative mt-7 sm:mt-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-10 left-[8%] w-80 h-80 rounded-full cobalt-backlight"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-10 right-[10%] w-96 h-72 rounded-full cobalt-backlight-soft"
          />

          <div className="relative z-10 glass-panel-featured rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
            {/* Left Group Header: Para quién actuamos */}
            <div className="lg:col-span-7 lg:col-start-1 lg:row-start-1 px-5 sm:px-8 py-4 border-b border-white/[0.07] flex items-center text-xs font-medium text-[#E2E8F0] tracking-[0.02em]">
              {t.profiles.audiencesLabel}
            </div>

            {/* Left Group Rows (01, 02, 03) */}
            {t.profiles.audiences.map((item, idx) => {
              const isLast = idx === t.profiles.audiences.length - 1;
              const rowClass = AUDIENCE_ROW_PLACEMENT[idx] ?? '';
              return (
                <article
                  key={item.id}
                  className={`lg:col-span-7 lg:col-start-1 ${rowClass} p-5 sm:px-8 sm:py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.018] transition-colors ${
                    isLast ? 'border-b lg:border-b-0 border-white/[0.07]' : 'border-b border-white/[0.07]'
                  }`}
                >
                  <div className="max-w-[48ch]">
                    <div className="flex items-baseline gap-3">
                      <span className="text-xs font-medium text-[#94A3B8] tabular-nums shrink-0">
                        {item.num}
                      </span>
                      <h3 className="text-base sm:text-lg font-medium tracking-tight text-[#F1F5F9]">
                        {item.title}
                      </h3>
                    </div>
                    <p className="mt-1.5 text-sm font-light text-[#94A3B8] leading-relaxed tracking-[0.01em]">
                      {item.desc}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectAudience(item.id)}
                    className="group w-full sm:w-auto min-h-11 sm:min-h-10 px-4 py-2 rounded-xl sm:rounded-lg border border-white/[0.10] bg-white/[0.02] hover:border-[#E2E8F0]/45 hover:bg-white/[0.04] text-xs font-medium text-[#E2E8F0] inline-flex items-center justify-between sm:justify-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E2E8F0]"
                  >
                    <span>{item.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5 icon-slate shrink-0 transition-transform duration-150 group-hover:translate-x-0.5" />
                  </button>
                </article>
              );
            })}

            {/* Right Group Header: Principios Operativos */}
            <div className="lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:border-l border-b border-white/[0.07] bg-[#0A0F1C]/35 px-5 sm:px-8 py-4 flex items-center text-xs font-medium text-[#CBD5E1] tracking-[0.02em]">
              {t.profiles.pillarsLabel}
            </div>

            {/* Right Group Rows (01, 02, 03) synchronized row-for-row with Left Group on PC */}
            {t.profiles.pillars.map((pillar, idx) => {
              const isLast = idx === t.profiles.pillars.length - 1;
              const rowClass = AUDIENCE_ROW_PLACEMENT[idx] ?? '';
              return (
                <Fragment key={pillar.num}>
                  <div
                    className={`lg:col-span-5 lg:col-start-8 ${rowClass} lg:border-l bg-[#0A0F1C]/30 p-5 sm:px-8 sm:py-6 flex flex-col justify-center ${
                      isLast ? '' : 'border-b border-white/[0.07]'
                    }`}
                  >
                    <div className="flex items-baseline gap-2.5">
                      <span className="text-xs font-medium text-[#94A3B8] tabular-nums shrink-0">
                        {pillar.num}
                      </span>
                      <h3 className="text-sm sm:text-base font-medium text-[#E2E8F0] tracking-tight">
                        {pillar.title}
                      </h3>
                    </div>
                    <p className="mt-1.5 text-sm font-light text-[#94A3B8] leading-relaxed tracking-[0.01em]">
                      {pillar.desc}
                    </p>
                  </div>
                </Fragment>
              );
            })}
          </div>
        </ParallaxLayer>
      </div>
    </section>
  );
}
