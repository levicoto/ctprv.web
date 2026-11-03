import { useEffect, useId, useRef, useState } from 'react';
import { area, curveMonotoneX, easeCubicOut, line, scaleLinear, select } from 'd3';
import { ArrowRight } from 'lucide-react';
import ParallaxLayer from './ParallaxLayer';
import { type MetricsPointItem, type MetricsScopeId, useI18n } from '../lib/i18n';

interface ProtectionMetricsSectionProps {
  onRequestAudit: (scope: MetricsScopeId) => void;
}

interface SimpleExposureCurveProps {
  scopeId: MetricsScopeId;
  points: [MetricsPointItem, MetricsPointItem, MetricsPointItem];
  ariaLabel: string;
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function SimpleExposureCurve({ scopeId, points, ariaLabel }: SimpleExposureCurveProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const prevScopeRef = useRef<MetricsScopeId>(scopeId);
  const uid = useId().replace(/:/g, '');

  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    const vw = 400;
    const vh = 172;
    const padLeft = 32;
    const padRight = 32;
    const padTop = 30;
    const padBottom = 34;
    const baseY = vh - padBottom;

    const xScale = scaleLinear()
      .domain([0, points.length - 1])
      .range([padLeft, vw - padRight]);

    const yScale = scaleLinear()
      .domain([0, 100])
      .range([baseY, padTop]);

    const scopeChanged = prevScopeRef.current !== scopeId;
    prevScopeRef.current = scopeId;
    const duration = !prefersReducedMotion() && scopeChanged ? 460 : 0;

    const curvePoints = [
      { x: xScale(0), y: yScale(points[0].exposure) },
      {
        x: (xScale(0) + xScale(1)) * 0.5,
        y: yScale(points[0].exposure * 0.42 + points[1].exposure * 0.58),
      },
      { x: xScale(1), y: yScale(points[1].exposure) },
      {
        x: (xScale(1) + xScale(2)) * 0.5,
        y: yScale(points[1].exposure * 0.36 + points[2].exposure * 0.64),
      },
      { x: xScale(2), y: yScale(points[2].exposure) },
    ];

    const areaGen = area<{ x: number; y: number }>()
      .x((d) => d.x)
      .y0(baseY)
      .y1((d) => d.y)
      .curve(curveMonotoneX);

    const lineGen = line<{ x: number; y: number }>()
      .x((d) => d.x)
      .y((d) => d.y)
      .curve(curveMonotoneX);

    const svg = select(svgEl);

    svg
      .select<SVGLineElement>('.curve-baseline')
      .attr('x1', padLeft)
      .attr('x2', vw - padRight)
      .attr('y1', baseY)
      .attr('y2', baseY);

    const stems = svg
      .select<SVGGElement>('.curve-stems')
      .selectAll<SVGLineElement, MetricsPointItem>('line')
      .data(points, (_, i) => `${i}`)
      .join('line')
      .attr('x1', (_, i) => xScale(i))
      .attr('x2', (_, i) => xScale(i))
      .attr('y1', baseY)
      .attr('stroke', 'rgba(148, 163, 184, 0.14)')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '2 3');

    const areaPath = svg.select<SVGPathElement>('.curve-area');
    const linePath = svg.select<SVGPathElement>('.curve-line');
    const endHalo = svg.select<SVGCircleElement>('.curve-end-halo');

    const dots = svg
      .select<SVGGElement>('.curve-dots')
      .selectAll<SVGCircleElement, MetricsPointItem>('circle')
      .data(points, (_, i) => `${i}`)
      .join('circle')
      .attr('cx', (_, i) => xScale(i))
      .attr('r', (_, i) => (i === 2 ? 4.5 : 3.5))
      .attr('fill', (_, i) => (i === 2 ? '#F1F5F9' : '#0A0F1C'))
      .attr('stroke', (_, i) => (i === 2 ? '#F1F5F9' : i === 1 ? '#CBD5E1' : '#94A3B8'))
      .attr('stroke-width', 1.5);

    const values = svg
      .select<SVGGElement>('.curve-values')
      .selectAll<SVGTextElement, MetricsPointItem>('text')
      .data(points, (_, i) => `${i}`)
      .join('text')
      .attr('x', (_, i) => xScale(i))
      .attr('text-anchor', 'middle')
      .attr('fill', (_, i) => (i === 2 ? '#F1F5F9' : i === 1 ? '#CBD5E1' : '#94A3B8'))
      .attr('font-size', (_, i) => (i === 2 ? '12.5px' : '11.5px'))
      .attr('font-weight', (_, i) => (i === 2 ? 600 : 400))
      .text((d) => `${d.exposure}%`);

    svg
      .select<SVGGElement>('.curve-labels')
      .selectAll<SVGTextElement, MetricsPointItem>('text')
      .data(points, (_, i) => `${i}`)
      .join('text')
      .attr('x', (_, i) => xScale(i))
      .attr('y', baseY + 22)
      .attr('text-anchor', 'middle')
      .attr('fill', (_, i) => (i === 2 ? '#E2E8F0' : '#94A3B8'))
      .attr('font-size', '11.5px')
      .attr('font-weight', (_, i) => (i === 2 ? 500 : 400))
      .text((d) => d.label);

    endHalo.attr('cx', xScale(2));

    if (duration > 0) {
      areaPath
        .transition()
        .duration(duration)
        .ease(easeCubicOut)
        .attr('d', areaGen(curvePoints) ?? '');
      linePath
        .transition()
        .duration(duration)
        .ease(easeCubicOut)
        .attr('d', lineGen(curvePoints) ?? '');
      stems
        .transition()
        .duration(duration)
        .ease(easeCubicOut)
        .attr('y2', (d) => yScale(d.exposure));
      dots
        .transition()
        .duration(duration)
        .ease(easeCubicOut)
        .attr('cy', (d) => yScale(d.exposure));
      values
        .transition()
        .duration(duration)
        .ease(easeCubicOut)
        .attr('y', (d) => yScale(d.exposure) - 11);
      endHalo
        .transition()
        .duration(duration)
        .ease(easeCubicOut)
        .attr('cy', yScale(points[2].exposure));
    } else {
      areaPath.attr('d', areaGen(curvePoints) ?? '');
      linePath.attr('d', lineGen(curvePoints) ?? '');
      stems.attr('y2', (d) => yScale(d.exposure));
      dots.attr('cy', (d) => yScale(d.exposure));
      values.attr('y', (d) => yScale(d.exposure) - 11);
      endHalo.attr('cy', yScale(points[2].exposure));
    }
  }, [points, scopeId]);

  return (
    <div className="w-full select-none">
      <svg
        ref={svgRef}
        viewBox="0 0 400 172"
        role="img"
        aria-label={ariaLabel}
        className="w-full h-auto block overflow-visible"
      >
        <defs>
          <linearGradient id={`exposure-fill-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E2E8F0" stopOpacity="0.16" />
            <stop offset="55%" stopColor="#3B63A8" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#0A0F1C" stopOpacity="0" />
          </linearGradient>
        </defs>

        <line
          className="curve-baseline"
          stroke="rgba(226, 232, 240, 0.10)"
          strokeWidth="1"
        />

        <path className="curve-area" fill={`url(#exposure-fill-${uid})`} />

        <g className="curve-stems" />

        <path
          className="curve-line"
          fill="none"
          stroke="#E2E8F0"
          strokeWidth="1.75"
          strokeLinecap="round"
        />

        <circle
          className="curve-end-halo"
          r="10"
          fill="rgba(226, 232, 240, 0.10)"
        />

        <g className="curve-dots" />
        <g className="curve-values tabular-nums" />
        <g className="curve-labels" />
      </svg>
    </div>
  );
}

export default function ProtectionMetricsSection({
  onRequestAudit,
}: ProtectionMetricsSectionProps) {
  const { t } = useI18n();
  const [activeScopeId, setActiveScopeId] = useState<MetricsScopeId>('consolidated');

  const activeScope =
    t.metrics.scopes.find((s) => s.id === activeScopeId) ?? t.metrics.scopes[0];

  return (
    <section
      id="metricas"
      className="relative z-10 py-12 sm:py-16 lg:py-18 border-t border-white/[0.07]"
    >
      <div className="max-w-[1200px] xl:max-w-[1280px] mx-auto px-5 sm:px-8 w-full">
        <ParallaxLayer speed={0.016} maxOffset={6} desktopOnly className="relative">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-10 left-[12%] w-80 h-80 rounded-full cobalt-backlight"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-10 right-[10%] w-96 h-72 rounded-full cobalt-backlight-soft"
          />

          <article className="relative z-10 glass-panel-featured text-[#E2E8F0] rounded-2xl overflow-hidden">
            {/* Header: Clean Headline + Interactive Profile Selector */}
            <div className="p-6 sm:p-8 lg:px-10 lg:py-7 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#F1F5F9] text-balance">
                {t.metrics.headline}
              </h2>

              <div className="w-full sm:w-auto shrink-0 self-start lg:self-auto overflow-x-auto">
                <div
                  role="tablist"
                  aria-label={t.metrics.scopeSelectorAria}
                  className="flex sm:inline-flex items-center gap-1 p-1 rounded-xl bg-[#0A0F1C]/65 border border-white/[0.08] min-w-max sm:min-w-0"
                >
                  {t.metrics.scopes.map((scope) => {
                    const isActive = scope.id === activeScope.id;
                    return (
                      <button
                        key={scope.id}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => setActiveScopeId(scope.id)}
                        className={`flex-1 sm:flex-initial min-h-9 px-3 sm:px-3.5 py-2 rounded-lg text-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E2E8F0] ${
                          isActive
                            ? 'bg-[#E2E8F0] text-[#0A0F1C] font-medium'
                            : 'text-[#94A3B8] hover:text-[#E2E8F0] font-normal'
                        }`}
                      >
                        {scope.tabLabel}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Single-Glance Split: Left 5 Cols (Headline Outcome + 3-Point Curve) | Right 7 Cols (4 Before/After Bars) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 border-t border-white/[0.07]">
              {/* Left: Instant Impact Number + Minimalist D3 Descent Curve */}
              <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-4xl sm:text-5xl font-light tracking-tight text-[#F1F5F9] tabular-nums">
                    {activeScope.headlineStat}
                  </span>
                  <span className="text-sm font-light text-[#94A3B8]">
                    {activeScope.headlineLabel}
                  </span>
                </div>

                <div className="mt-6">
                  <SimpleExposureCurve
                    scopeId={activeScope.id}
                    points={activeScope.points}
                    ariaLabel={t.metrics.chartAria}
                  />
                </div>
              </div>

              {/* Right: 4 Plain-Language Before -> Day 90 Reduction Bars */}
              <div className="lg:col-span-7 border-t lg:border-t-0 lg:border-l border-white/[0.07] p-6 sm:p-8 lg:p-10 bg-[#0A0F1C]/20 flex flex-col justify-between">
                <div className="flex items-center justify-between gap-4 text-xs font-normal text-[#94A3B8]">
                  <span>{t.metrics.barsHeaderLeft}</span>
                  <span className="tabular-nums">{t.metrics.barsHeaderRight}</span>
                </div>

                <div className="mt-5 space-y-5">
                  {activeScope.bars.map((bar, idx) => (
                    <div key={bar.label}>
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="text-sm font-normal text-[#E2E8F0]">
                          {bar.label}
                        </span>
                        <span className="text-xs tabular-nums whitespace-nowrap shrink-0">
                          <span className="text-[#64748B]">{bar.before}%</span>
                          <span className="text-[#64748B] mx-1.5" aria-hidden="true">
                            →
                          </span>
                          <strong className="font-medium text-[#F1F5F9]">{bar.after}%</strong>
                        </span>
                      </div>

                      <svg
                        viewBox="0 0 100 6"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                        className="mt-2 h-1.5 w-full rounded-full bg-white/[0.04] block overflow-hidden"
                      >
                        <defs>
                          <linearGradient id={`bar-grad-${idx}`} x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#3B63A8" />
                            <stop offset="60%" stopColor="#CBD5E1" />
                            <stop offset="100%" stopColor="#F1F5F9" />
                          </linearGradient>
                        </defs>
                        <rect
                          x={0}
                          y={0}
                          width={bar.before}
                          height={6}
                          fill="rgba(255, 255, 255, 0.09)"
                          className="transition-all duration-500 ease-out"
                        />
                        <line
                          x1={bar.before}
                          x2={bar.before}
                          y1={0}
                          y2={6}
                          stroke="rgba(255, 255, 255, 0.28)"
                          strokeWidth={0.4}
                          className="transition-all duration-500 ease-out"
                        />
                        <rect
                          x={0}
                          y={0}
                          width={bar.after}
                          height={6}
                          rx={1.5}
                          fill={`url(#bar-grad-${idx})`}
                          className="transition-all duration-500 ease-out"
                        />
                      </svg>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Calm Bottom Strip: Concise Proof + Direct Action */}
            <div className="px-6 sm:px-8 lg:px-10 py-4 border-t border-white/[0.07] bg-[#0A0F1C]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-light text-[#94A3B8]">
              <span>{activeScope.summaryNote}</span>

              <button
                type="button"
                onClick={() => onRequestAudit(activeScope.id)}
                className="group min-h-9 inline-flex items-center gap-1.5 text-[#E2E8F0] hover:text-white font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 self-start sm:self-auto focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E2E8F0]"
              >
                <span className="underline decoration-[#94A3B8]/50 group-hover:decoration-[#E2E8F0] underline-offset-4 transition-colors">
                  {t.metrics.cta}
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
