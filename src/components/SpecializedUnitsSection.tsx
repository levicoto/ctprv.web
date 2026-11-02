import { ArrowRight, ShieldAlert } from 'lucide-react';
import { useI18n } from '../lib/i18n';
import ParallaxLayer from './ParallaxLayer';

interface SpecializedUnitsSectionProps {
  onOpenPalantirr: () => void;
  onOpenIncidentProtocol: () => void;
  onOpenEmergency: () => void;
}

export default function SpecializedUnitsSection({
  onOpenPalantirr,
  onOpenIncidentProtocol,
  onOpenEmergency,
}: SpecializedUnitsSectionProps) {
  const { t } = useI18n();

  return (
    <section
      id="unidades"
      className="relative z-10 py-12 sm:py-16 lg:py-18 border-t border-white/[0.07]"
    >
      <div className="max-w-[1200px] xl:max-w-[1280px] mx-auto px-5 sm:px-8 w-full">
        {/* Clean Executive Section Header */}
        <div className="max-w-[58ch]">
          <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#F1F5F9] text-balance">
            {t.units.headline}
          </h2>
          <p className="mt-2.5 text-sm sm:text-base font-light text-[#94A3B8] leading-relaxed tracking-[0.01em]">
            {t.units.subtitle}
          </p>
        </div>

        {/* Dedicated 2-Column Subgrid Hierarchy:
            Aligns Header, Internal Hairline, Bullets, and Bottom CTA Hairline pixel-for-pixel on PC */}
        <ParallaxLayer speed={0.016} maxOffset={6} desktopOnly className="relative mt-7 sm:mt-8">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-10 left-[8%] w-80 h-80 rounded-full cobalt-backlight"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-10 right-[8%] w-80 h-72 rounded-full cobalt-backlight-soft"
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-x-6 lg:gap-y-0 lg:grid-rows-[auto_1fr_auto]">
            {/* Unit 01: Palantirr (Passive OSINT On-Demand Intelligence) */}
            <article className="w-full glass-panel-featured text-[#E2E8F0] rounded-2xl p-5 sm:p-8 flex flex-col lg:grid lg:grid-rows-subgrid lg:row-span-3 lg:gap-y-0 transition-transform duration-200 hover:-translate-y-0.5">
              {/* Zone 1: Synchronized Header + Summary */}
              <div className="pb-5">
                <div className="text-xs font-normal text-[#94A3B8] flex items-center gap-2 tracking-[0.02em]">
                  <span className="tabular-nums text-[#E2E8F0] font-medium">
                    {t.units.palantirr.num}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{t.units.palantirr.tag}</span>
                </div>

                <h3 className="mt-2 text-2xl sm:text-[26px] font-medium tracking-tight text-[#F1F5F9]">
                  {t.units.palantirr.name}
                </h3>

                <p className="mt-2 text-sm font-light text-[#CBD5E1] leading-relaxed tracking-[0.01em] max-w-[50ch]">
                  {t.units.palantirr.summary}
                </p>
              </div>

              {/* Zone 2: Synchronized Top Hairline + Bullet List */}
              <div className="py-5 border-t border-white/[0.07] flex-1">
                <ul className="space-y-3">
                  {t.units.palantirr.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex items-start gap-3 text-sm font-light text-[#94A3B8] leading-snug tracking-[0.01em]"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-[7px] w-1.5 h-1.5 rounded-full bg-[#E2E8F0]/75 shrink-0"
                      />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Zone 3: Synchronized Bottom Hairline + Action */}
              <div className="pt-5 border-t border-white/[0.07] flex items-center">
                <button
                  type="button"
                  onClick={onOpenPalantirr}
                  className="w-full min-h-11 py-2.5 px-5 rounded-xl btn-platinum text-sm font-medium transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E2E8F0]"
                >
                  <span>{t.units.palantirr.cta}</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
              </div>
            </article>

            {/* Unit 02: Protocolo de Incidentes (Critical Response) */}
            <article className="w-full glass-panel text-[#E2E8F0] rounded-2xl p-5 sm:p-8 flex flex-col lg:grid lg:grid-rows-subgrid lg:row-span-3 lg:gap-y-0 transition-transform duration-200 hover:-translate-y-0.5">
              {/* Zone 1: Synchronized Header + Summary */}
              <div className="pb-5">
                <div className="text-xs font-normal text-[#94A3B8] flex items-center gap-2 tracking-[0.02em]">
                  <span className="tabular-nums text-[#E2E8F0] font-medium">
                    {t.units.incidentProtocol.num}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{t.units.incidentProtocol.tag}</span>
                </div>

                <h3 className="mt-2 text-2xl sm:text-[26px] font-medium tracking-tight text-[#F1F5F9]">
                  {t.units.incidentProtocol.name}
                </h3>

                <p className="mt-2 text-sm font-light text-[#CBD5E1] leading-relaxed tracking-[0.01em] max-w-[50ch]">
                  {t.units.incidentProtocol.summary}
                </p>
              </div>

              {/* Zone 2: Synchronized Top Hairline + Bullet List */}
              <div className="py-5 border-t border-white/[0.07] flex-1">
                <ul className="space-y-3">
                  {t.units.incidentProtocol.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex items-start gap-3 text-sm font-light text-[#94A3B8] leading-snug tracking-[0.01em]"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-[7px] w-1.5 h-1.5 rounded-full bg-[#94A3B8]/80 shrink-0"
                      />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Zone 3: Synchronized Bottom Hairline + Action */}
              <div className="pt-5 border-t border-white/[0.07] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={onOpenIncidentProtocol}
                  className="group flex-1 min-h-11 py-2.5 px-5 rounded-xl border border-white/[0.12] bg-white/[0.02] text-[#E2E8F0] text-sm font-medium hover:border-[#E2E8F0]/45 hover:bg-white/[0.04] transition-colors flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E2E8F0]"
                >
                  <span>{t.units.incidentProtocol.cta}</span>
                  <ArrowRight className="w-4 h-4 icon-slate shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={onOpenEmergency}
                  className="group min-h-10 sm:min-h-11 px-2.5 text-xs font-normal text-[#94A3B8] hover:text-[#E2E8F0] inline-flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E2E8F0]"
                >
                  <ShieldAlert className="w-3.5 h-3.5 icon-slate shrink-0" />
                  <span className="underline decoration-[#94A3B8]/40 group-hover:decoration-[#E2E8F0] underline-offset-4">
                    {t.units.incidentProtocol.emergencyLink}
                  </span>
                </button>
              </div>
            </article>
          </div>
        </ParallaxLayer>
      </div>
    </section>
  );
}
