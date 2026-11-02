import { useEffect, useId, useRef, useState } from 'react';
import {
  area,
  curveLinearClosed,
  curveMonotoneX,
  easeCubicOut,
  leastIndex,
  line,
  lineRadial,
  pointer,
  scaleLinear,
  select,
} from 'd3';
import { ArrowRight } from 'lucide-react';
import {
  type MetricsMilestoneItem,
  type MetricsScopeId,
  type MetricsVectorItem,
  useI18n,
} from '../lib/i18n';
import ParallaxLayer from './ParallaxLayer';

interface ProtectionMetricsSectionProps {
  onRequestAudit: (scope: MetricsScopeId) => void;
}

const ISO_RATIOS = [0.28, 0.54, 0.78] as const;
const Y_TICKS = [0, 25, 50, 75, 100] as const;
const RADIAL_RINGS = [25, 50, 75, 100] as const;

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

interface LongitudinalChartProps {
  scopeId: MetricsScopeId;
  milestones: MetricsMilestoneItem[];
  selectedIdx: number;
  onSelectIdx: (index: number) => void;
  ariaLabel: string;
}

function LongitudinalSurfaceChart({
  scopeId,
  milestones,
  selectedIdx,
  onSelectIdx,
  ariaLabel,
}: LongitudinalChartProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const prevScopeRef = useRef<MetricsScopeId>(scopeId);
  const prevWidthRef = useRef<number>(680);
  const [width, setWidth] = useState<number>(680);
  const uid = useId().replace(/:/g, '');

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateSize = () => {
      const next = Math.max(300, Math.round(el.getBoundingClientRect().width));
      setWidth((prev) => (prev !== next ? next : prev));
    };

    updateSize();

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateSize);
      return () => window.removeEventListener('resize', updateSize);
    }

    const observer = new ResizeObserver(() => updateSize());
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl || milestones.length === 0) return;

    const isCompact = width < 480;
    const height = isCompact ? 236 : 272;
    const margin = {
      top: 22,
      right: isCompact ? 18 : 26,
      bottom: 32,
      left: isCompact ? 32 : 38,
    };

    const innerW = Math.max(120, width - margin.left - margin.right);
    const innerH = Math.max(100, height - margin.top - margin.bottom);

    const xScale = scaleLinear().domain([0, 90]).range([margin.left, margin.left + innerW]);
    const yScale = scaleLinear().domain([0, 105]).range([margin.top + innerH, margin.top]);

    const scopeChanged = prevScopeRef.current !== scopeId;
    const widthChanged = prevWidthRef.current !== width;
    prevScopeRef.current = scopeId;
    prevWidthRef.current = width;

    const duration = !prefersReducedMotion() && scopeChanged && !widthChanged ? 520 : 0;

    const svg = select(svgEl);
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    // Horizontal architectural gridlines
    const hGrid = svg
      .select<SVGGElement>('.grid-horizontal')
      .selectAll<SVGLineElement, number>('line')
      .data(Y_TICKS, (d) => d);

    hGrid
      .join('line')
      .attr('x1', margin.left)
      .attr('x2', margin.left + innerW)
      .attr('y1', (d) => yScale(d))
      .attr('y2', (d) => yScale(d))
      .attr('stroke', (d) =>
        d === 0 ? 'rgba(226, 232, 240, 0.14)' : 'rgba(226, 232, 240, 0.055)',
      )
      .attr('stroke-width', 1);

    // Vertical milestone hairlines
    const vGrid = svg
      .select<SVGGElement>('.grid-vertical')
      .selectAll<SVGLineElement, MetricsMilestoneItem>('line')
      .data(milestones, (d) => d.code);

    vGrid
      .join('line')
      .attr('x1', (d) => xScale(d.day))
      .attr('x2', (d) => xScale(d.day))
      .attr('y1', margin.top)
      .attr('y2', margin.top + innerH)
      .attr('stroke', 'rgba(226, 232, 240, 0.045)')
      .attr('stroke-width', 1);

    // Y-axis index labels (tabular Inter)
    const yLabels = svg
      .select<SVGGElement>('.axis-y-labels')
      .selectAll<SVGTextElement, number>('text')
      .data(Y_TICKS, (d) => d);

    yLabels
      .join('text')
      .attr('x', margin.left - 9)
      .attr('y', (d) => yScale(d))
      .attr('dy', '0.32em')
      .attr('text-anchor', 'end')
      .attr('fill', '#94A3B8')
      .attr('font-size', isCompact ? '10px' : '11px')
      .attr('font-weight', 400)
      .style('font-variant-numeric', 'tabular-nums')
      .text((d) => `${d}`);

    // X-axis milestone code labels
    const xLabels = svg
      .select<SVGGElement>('.axis-x-labels')
      .selectAll<SVGTextElement, MetricsMilestoneItem>('text')
      .data(milestones, (d) => d.code);

    xLabels
      .join('text')
      .attr('x', (d) => xScale(d.day))
      .attr('y', margin.top + innerH + 21)
      .attr('text-anchor', (_, i) =>
        i === 0 ? 'start' : i === milestones.length - 1 ? 'end' : 'middle',
      )
      .attr('fill', (_, i) => (i === selectedIdx ? '#E2E8F0' : '#94A3B8'))
      .attr('font-size', isCompact ? '10.5px' : '11px')
      .attr('font-weight', (_, i) => (i === selectedIdx ? 500 : 400))
      .style('font-variant-numeric', 'tabular-nums')
      .text((d) => d.code);

    // Unmitigated 100 reference line
    svg
      .select<SVGLineElement>('.unmitigated-line')
      .attr('x1', margin.left)
      .attr('x2', margin.left + innerW)
      .attr('y1', yScale(100))
      .attr('y2', yScale(100));

    // Abstract optical attenuation contours (interpolated field lines between 100 and exposure)
    const isoGen = (ratio: number) =>
      line<MetricsMilestoneItem>()
        .x((d) => xScale(d.day))
        .y((d) => yScale(100 - (100 - d.exposure) * ratio))
        .curve(curveMonotoneX);

    const isoPaths = svg
      .select<SVGGElement>('.iso-contours')
      .selectAll<SVGPathElement, number>('path')
      .data(ISO_RATIOS, (d) => d);

    const isoMerged = isoPaths
      .join('path')
      .attr('fill', 'none')
      .attr('stroke', 'rgba(148, 163, 184, 0.09)')
      .attr('stroke-width', 0.9);

    if (duration > 0) {
      isoMerged
        .transition()
        .duration(duration)
        .ease(easeCubicOut)
        .attr('d', (r) => isoGen(r)(milestones) ?? '');
    } else {
      isoMerged.attr('d', (r) => isoGen(r)(milestones) ?? '');
    }

    // Area & Curve generators
    const exposureAreaGen = area<MetricsMilestoneItem>()
      .x((d) => xScale(d.day))
      .y0(yScale(0))
      .y1((d) => yScale(d.exposure))
      .curve(curveMonotoneX);

    const exposureLineGen = line<MetricsMilestoneItem>()
      .x((d) => xScale(d.day))
      .y((d) => yScale(d.exposure))
      .curve(curveMonotoneX);

    const riskLineGen = line<MetricsMilestoneItem>()
      .x((d) => xScale(d.day))
      .y((d) => yScale(d.residualRisk))
      .curve(curveMonotoneX);

    const areaPath = svg.select<SVGPathElement>('.exposure-area');
    const exposurePath = svg.select<SVGPathElement>('.exposure-line');
    const exposureGlow = svg.select<SVGPathElement>('.exposure-glow');
    const riskPath = svg.select<SVGPathElement>('.risk-line');

    if (duration > 0) {
      areaPath
        .transition()
        .duration(duration)
        .ease(easeCubicOut)
        .attr('d', exposureAreaGen(milestones) ?? '');
      exposurePath
        .transition()
        .duration(duration)
        .ease(easeCubicOut)
        .attr('d', exposureLineGen(milestones) ?? '');
      exposureGlow
        .transition()
        .duration(duration)
        .ease(easeCubicOut)
        .attr('d', exposureLineGen(milestones) ?? '');
      riskPath
        .transition()
        .duration(duration)
        .ease(easeCubicOut)
        .attr('d', riskLineGen(milestones) ?? '');
    } else {
      areaPath.attr('d', exposureAreaGen(milestones) ?? '');
      exposurePath.attr('d', exposureLineGen(milestones) ?? '');
      exposureGlow.attr('d', exposureLineGen(milestones) ?? '');
      riskPath.attr('d', riskLineGen(milestones) ?? '');
    }

    // Active milestone reticle hairline
    const activeItem = milestones[selectedIdx] ?? milestones[milestones.length - 1];
    const activeX = xScale(activeItem.day);
    const activeY = yScale(activeItem.exposure);

    const reticle = svg.select<SVGLineElement>('.active-reticle');
    if (duration > 0) {
      reticle
        .transition()
        .duration(duration)
        .ease(easeCubicOut)
        .attr('x1', activeX)
        .attr('x2', activeX)
        .attr('y1', margin.top)
        .attr('y2', margin.top + innerH);
    } else {
      reticle
        .attr('x1', activeX)
        .attr('x2', activeX)
        .attr('y1', margin.top)
        .attr('y2', margin.top + innerH);
    }

    // Active outer halo ring
    const halo = svg.select<SVGCircleElement>('.active-halo');
    if (duration > 0) {
      halo
        .transition()
        .duration(duration)
        .ease(easeCubicOut)
        .attr('cx', activeX)
        .attr('cy', activeY);
    } else {
      halo.attr('cx', activeX).attr('cy', activeY);
    }

    // Precision nodes on exposure curve
    const nodes = svg
      .select<SVGGElement>('.milestone-nodes')
      .selectAll<SVGCircleElement, MetricsMilestoneItem>('circle')
      .data(milestones, (d) => d.code);

    const nodesJoined = nodes
      .join('circle')
      .attr('r', (_, i) => (i === selectedIdx ? 4.4 : 3.2))
      .attr('fill', (_, i) => (i === selectedIdx ? '#E2E8F0' : '#0A0F1C'))
      .attr('stroke', '#E2E8F0')
      .attr('stroke-width', (_, i) => (i === selectedIdx ? 2 : 1.4));

    if (duration > 0) {
      nodesJoined
        .transition()
        .duration(duration)
        .ease(easeCubicOut)
        .attr('cx', (d) => xScale(d.day))
        .attr('cy', (d) => yScale(d.exposure));
    } else {
      nodesJoined.attr('cx', (d) => xScale(d.day)).attr('cy', (d) => yScale(d.exposure));
    }

    // Secondary subtle nodes on critical risk curve
    const riskNodes = svg
      .select<SVGGElement>('.risk-nodes')
      .selectAll<SVGCircleElement, MetricsMilestoneItem>('circle')
      .data(milestones, (d) => d.code);

    const riskNodesJoined = riskNodes
      .join('circle')
      .attr('r', 2.1)
      .attr('fill', '#0A0F1C')
      .attr('stroke', '#94A3B8')
      .attr('stroke-width', 1.1);

    if (duration > 0) {
      riskNodesJoined
        .transition()
        .duration(duration)
        .ease(easeCubicOut)
        .attr('cx', (d) => xScale(d.day))
        .attr('cy', (d) => yScale(d.residualRisk));
    } else {
      riskNodesJoined
        .attr('cx', (d) => xScale(d.day))
        .attr('cy', (d) => yScale(d.residualRisk));
    }

    // Numeric callout above active node
    const badgeText = Number.isInteger(activeItem.exposure)
      ? `${activeItem.exposure}`
      : activeItem.exposure.toFixed(1);
    const labelAnchor =
      selectedIdx === 0 ? 'start' : selectedIdx === milestones.length - 1 ? 'end' : 'middle';
    const labelOffsetX = selectedIdx === 0 ? 6 : selectedIdx === milestones.length - 1 ? -6 : 0;

    const valueCallout = svg.select<SVGTextElement>('.active-value-label');
    valueCallout
      .attr('text-anchor', labelAnchor)
      .text(badgeText);

    if (duration > 0) {
      valueCallout
        .transition()
        .duration(duration)
        .ease(easeCubicOut)
        .attr('x', activeX + labelOffsetX)
        .attr('y', Math.max(margin.top + 11, activeY - 12));
    } else {
      valueCallout
        .attr('x', activeX + labelOffsetX)
        .attr('y', Math.max(margin.top + 11, activeY - 12));
    }

    // Pointer scrubbing overlay
    svg
      .select<SVGRectElement>('.pointer-overlay')
      .attr('x', margin.left - 8)
      .attr('y', margin.top)
      .attr('width', innerW + 16)
      .attr('height', innerH + 24)
      .on('pointermove', (event: PointerEvent) => {
        const [mx] = pointer(event, svgEl);
        const nearest = leastIndex(milestones, (m) => Math.abs(xScale(m.day) - mx));
        if (typeof nearest === 'number' && nearest !== selectedIdx) {
          onSelectIdx(nearest);
        }
      })
      .on('click', (event: MouseEvent) => {
        const [mx] = pointer(event, svgEl);
        const nearest = leastIndex(milestones, (m) => Math.abs(xScale(m.day) - mx));
        if (typeof nearest === 'number') {
          onSelectIdx(nearest);
        }
      });
  }, [milestones, onSelectIdx, scopeId, selectedIdx, width]);

  return (
    <div ref={containerRef} className="w-full select-none">
      <svg
        ref={svgRef}
        role="img"
        aria-label={ariaLabel}
        className="w-full h-auto block overflow-visible cursor-crosshair"
      >
        <defs>
          <linearGradient id={`area-grad-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E2E8F0" stopOpacity="0.16" />
            <stop offset="52%" stopColor="#3B63A8" stopOpacity="0.07" />
            <stop offset="100%" stopColor="#0A0F1C" stopOpacity="0" />
          </linearGradient>
          <filter id={`platinum-glow-${uid}`} x="-10%" y="-20%" width="120%" height="140%">
            <feGaussianBlur stdDeviation="3.2" result="blur" />
          </filter>
        </defs>

        <g className="grid-horizontal" />
        <g className="grid-vertical" />

        <line
          className="unmitigated-line"
          stroke="rgba(148, 163, 184, 0.28)"
          strokeWidth="1"
          strokeDasharray="3 5"
        />

        <g className="iso-contours" />

        <path className="exposure-area" fill={`url(#area-grad-${uid})`} />

        <path
          className="risk-line"
          fill="none"
          stroke="#94A3B8"
          strokeOpacity="0.62"
          strokeWidth="1.25"
          strokeDasharray="4 3"
        />

        <path
          className="exposure-glow"
          fill="none"
          stroke="#E2E8F0"
          strokeOpacity="0.22"
          strokeWidth="3.5"
          filter={`url(#platinum-glow-${uid})`}
        />

        <path
          className="exposure-line"
          fill="none"
          stroke="#E2E8F0"
          strokeWidth="1.85"
          strokeLinecap="round"
        />

        <line
          className="active-reticle"
          stroke="rgba(226, 232, 240, 0.32)"
          strokeWidth="1"
          strokeDasharray="2 3"
        />

        <g className="risk-nodes" />

        <circle
          className="active-halo"
          r="9.5"
          fill="rgba(226, 232, 240, 0.08)"
          stroke="rgba(226, 232, 240, 0.28)"
          strokeWidth="1"
        />

        <g className="milestone-nodes" />

        <text
          className="active-value-label"
          fill="#F1F5F9"
          fontSize="11.5px"
          fontWeight="500"
          style={{ fontVariantNumeric: 'tabular-nums' }}
        />

        <g className="axis-y-labels" />
        <g className="axis-x-labels" />

        <rect className="pointer-overlay" fill="transparent" />
      </svg>
    </div>
  );
}

interface RadialVectorChartProps {
  scopeId: MetricsScopeId;
  vectors: MetricsVectorItem[];
  selectedVectorIdx: number;
  onSelectVectorIdx: (index: number) => void;
  ariaLabel: string;
}

function RadialVectorChart({
  scopeId,
  vectors,
  selectedVectorIdx,
  onSelectVectorIdx,
  ariaLabel,
}: RadialVectorChartProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const prevScopeRef = useRef<MetricsScopeId>(scopeId);
  const uid = useId().replace(/:/g, '');

  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl || vectors.length === 0) return;

    const vw = 340;
    const vh = 264;
    const cx = vw / 2;
    const cy = 136;
    const maxR = 78;
    const count = vectors.length;
    const angleStep = (Math.PI * 2) / count;

    const rScale = scaleLinear().domain([0, 100]).range([0, maxR]);

    const scopeChanged = prevScopeRef.current !== scopeId;
    prevScopeRef.current = scopeId;
    const duration = !prefersReducedMotion() && scopeChanged ? 520 : 0;

    const svg = select(svgEl);

    // Concentric polygonal reference webs
    const ringGen = (ringVal: number) => {
      const r = rScale(ringVal);
      const pts = vectors.map((_, i) => {
        const angle = i * angleStep;
        return `${cx + r * Math.sin(angle)},${cy - r * Math.cos(angle)}`;
      });
      return `M${pts.join('L')}Z`;
    };

    svg
      .select<SVGGElement>('.radial-rings')
      .selectAll<SVGPathElement, number>('path')
      .data(RADIAL_RINGS, (d) => d)
      .join('path')
      .attr('d', (d) => ringGen(d))
      .attr('fill', 'none')
      .attr('stroke', (d) =>
        d === 100 ? 'rgba(226, 232, 240, 0.11)' : 'rgba(226, 232, 240, 0.055)',
      )
      .attr('stroke-width', 1);

    // Radial spokes
    svg
      .select<SVGGElement>('.radial-spokes')
      .selectAll<SVGLineElement, MetricsVectorItem>('line')
      .data(vectors, (_, i) => `${i}`)
      .join('line')
      .attr('x1', cx)
      .attr('y1', cy)
      .attr('x2', (_, i) => cx + maxR * Math.sin(i * angleStep))
      .attr('y2', (_, i) => cy - maxR * Math.cos(i * angleStep))
      .attr('stroke', (_, i) =>
        i === selectedVectorIdx ? 'rgba(226, 232, 240, 0.34)' : 'rgba(148, 163, 184, 0.13)',
      )
      .attr('stroke-width', 1);

    // Radial polygon generators (translated around cx, cy)
    const baselineRadial = lineRadial<MetricsVectorItem>()
      .angle((_, i) => i * angleStep)
      .radius((d) => rScale(d.baseline))
      .curve(curveLinearClosed);

    const mitigatedRadial = lineRadial<MetricsVectorItem>()
      .angle((_, i) => i * angleStep)
      .radius((d) => rScale(d.mitigated))
      .curve(curveLinearClosed);

    const basePoly = svg.select<SVGPathElement>('.poly-baseline');
    const mitPoly = svg.select<SVGPathElement>('.poly-mitigated');

    basePoly.attr('transform', `translate(${cx}, ${cy})`);
    mitPoly.attr('transform', `translate(${cx}, ${cy})`);

    if (duration > 0) {
      basePoly
        .transition()
        .duration(duration)
        .ease(easeCubicOut)
        .attr('d', baselineRadial(vectors) ?? '');
      mitPoly
        .transition()
        .duration(duration)
        .ease(easeCubicOut)
        .attr('d', mitigatedRadial(vectors) ?? '');
    } else {
      basePoly.attr('d', baselineRadial(vectors) ?? '');
      mitPoly.attr('d', mitigatedRadial(vectors) ?? '');
    }

    // Attenuation compression vectors (T+0 vertex -> T+90 vertex)
    const compVectors = svg
      .select<SVGGElement>('.compression-vectors')
      .selectAll<SVGLineElement, MetricsVectorItem>('line')
      .data(vectors, (_, i) => `${i}`);

    const compJoined = compVectors
      .join('line')
      .attr('stroke', (_, i) =>
        i === selectedVectorIdx ? '#E2E8F0' : 'rgba(226, 232, 240, 0.24)',
      )
      .attr('stroke-width', (_, i) => (i === selectedVectorIdx ? 1.5 : 1));

    if (duration > 0) {
      compJoined
        .transition()
        .duration(duration)
        .ease(easeCubicOut)
        .attr('x1', (d, i) => cx + rScale(d.baseline) * Math.sin(i * angleStep))
        .attr('y1', (d, i) => cy - rScale(d.baseline) * Math.cos(i * angleStep))
        .attr('x2', (d, i) => cx + rScale(d.mitigated) * Math.sin(i * angleStep))
        .attr('y2', (d, i) => cy - rScale(d.mitigated) * Math.cos(i * angleStep));
    } else {
      compJoined
        .attr('x1', (d, i) => cx + rScale(d.baseline) * Math.sin(i * angleStep))
        .attr('y1', (d, i) => cy - rScale(d.baseline) * Math.cos(i * angleStep))
        .attr('x2', (d, i) => cx + rScale(d.mitigated) * Math.sin(i * angleStep))
        .attr('y2', (d, i) => cy - rScale(d.mitigated) * Math.cos(i * angleStep));
    }

    // Baseline T+0 subtle nodes
    const baseDots = svg
      .select<SVGGElement>('.dots-baseline')
      .selectAll<SVGCircleElement, MetricsVectorItem>('circle')
      .data(vectors, (_, i) => `${i}`)
      .join('circle')
      .attr('r', (_, i) => (i === selectedVectorIdx ? 3.2 : 2.3))
      .attr('fill', '#0A0F1C')
      .attr('stroke', (_, i) => (i === selectedVectorIdx ? '#E2E8F0' : '#94A3B8'))
      .attr('stroke-width', 1.2);

    if (duration > 0) {
      baseDots
        .transition()
        .duration(duration)
        .ease(easeCubicOut)
        .attr('cx', (d, i) => cx + rScale(d.baseline) * Math.sin(i * angleStep))
        .attr('cy', (d, i) => cy - rScale(d.baseline) * Math.cos(i * angleStep));
    } else {
      baseDots
        .attr('cx', (d, i) => cx + rScale(d.baseline) * Math.sin(i * angleStep))
        .attr('cy', (d, i) => cy - rScale(d.baseline) * Math.cos(i * angleStep));
    }

    // Mitigated T+90 platinum nodes
    const mitDots = svg
      .select<SVGGElement>('.dots-mitigated')
      .selectAll<SVGCircleElement, MetricsVectorItem>('circle')
      .data(vectors, (_, i) => `${i}`)
      .join('circle')
      .attr('r', (_, i) => (i === selectedVectorIdx ? 3.6 : 2.6))
      .attr('fill', '#E2E8F0')
      .attr('stroke', '#0A0F1C')
      .attr('stroke-width', 1);

    if (duration > 0) {
      mitDots
        .transition()
        .duration(duration)
        .ease(easeCubicOut)
        .attr('cx', (d, i) => cx + rScale(d.mitigated) * Math.sin(i * angleStep))
        .attr('cy', (d, i) => cy - rScale(d.mitigated) * Math.cos(i * angleStep));
    } else {
      mitDots
        .attr('cx', (d, i) => cx + rScale(d.mitigated) * Math.sin(i * angleStep))
        .attr('cy', (d, i) => cy - rScale(d.mitigated) * Math.cos(i * angleStep));
    }

    // Exterior domain labels with interactive click/hover selection
    const labelRadius = maxR + 18;
    svg
      .select<SVGGElement>('.vector-labels')
      .selectAll<SVGTextElement, MetricsVectorItem>('text')
      .data(vectors, (_, i) => `${i}`)
      .join('text')
      .attr('x', (_, i) => cx + labelRadius * Math.sin(i * angleStep))
      .attr('y', (_, i) => cy - labelRadius * Math.cos(i * angleStep))
      .attr('dy', (_, i) => {
        const cos = Math.cos(i * angleStep);
        if (cos > 0.7) return '-0.15em';
        if (cos < -0.5) return '0.85em';
        return '0.32em';
      })
      .attr('text-anchor', (_, i) => {
        const sin = Math.sin(i * angleStep);
        if (Math.abs(sin) < 0.25) return 'middle';
        return sin > 0 ? 'start' : 'end';
      })
      .attr('fill', (_, i) => (i === selectedVectorIdx ? '#E2E8F0' : '#94A3B8'))
      .attr('font-size', '10.5px')
      .attr('font-weight', (_, i) => (i === selectedVectorIdx ? 500 : 400))
      .style('cursor', 'pointer')
      .text((d) => d.shortLabel)
      .on('pointerenter', (_, d) => {
        const idx = vectors.indexOf(d);
        if (idx >= 0) onSelectVectorIdx(idx);
      })
      .on('click', (_, d) => {
        const idx = vectors.indexOf(d);
        if (idx >= 0) onSelectVectorIdx(idx);
      });
  }, [onSelectVectorIdx, scopeId, selectedVectorIdx, vectors]);

  return (
    <div className="w-full select-none">
      <svg
        ref={svgRef}
        viewBox="0 0 340 264"
        role="img"
        aria-label={ariaLabel}
        className="w-full max-w-[360px] mx-auto h-auto block overflow-visible"
      >
        <defs>
          <radialGradient id={`radial-core-${uid}`} cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="#E2E8F0" stopOpacity="0.24" />
            <stop offset="70%" stopColor="#3B63A8" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#E2E8F0" stopOpacity="0.08" />
          </radialGradient>
        </defs>

        <g className="radial-rings" />
        <g className="radial-spokes" />

        <path
          className="poly-baseline"
          fill="rgba(148, 163, 184, 0.04)"
          stroke="rgba(148, 163, 184, 0.44)"
          strokeWidth="1.15"
          strokeDasharray="3 3"
        />

        <g className="compression-vectors" />

        <path
          className="poly-mitigated"
          fill={`url(#radial-core-${uid})`}
          stroke="#E2E8F0"
          strokeWidth="1.75"
          strokeLinejoin="round"
        />

        <g className="dots-baseline" />
        <g className="dots-mitigated" />
        <g className="vector-labels" />
      </svg>
    </div>
  );
}

export default function ProtectionMetricsSection({
  onRequestAudit,
}: ProtectionMetricsSectionProps) {
  const { t } = useI18n();
  const [activeScopeId, setActiveScopeId] = useState<MetricsScopeId>('consolidated');
  const [selectedMilestoneIdx, setSelectedMilestoneIdx] = useState<number>(4);
  const [selectedVectorIdx, setSelectedVectorIdx] = useState<number>(0);

  const activeScope =
    t.metrics.scopes.find((s) => s.id === activeScopeId) ?? t.metrics.scopes[0];
  const activeMilestone =
    activeScope.milestones[selectedMilestoneIdx] ??
    activeScope.milestones[activeScope.milestones.length - 1];
  const activeVector = activeScope.vectors[selectedVectorIdx] ?? activeScope.vectors[0];

  const netCompressionPct = (100 - activeMilestone.exposure).toFixed(1);
  const vectorAttenuationPct = Math.round(
    ((activeVector.baseline - activeVector.mitigated) / activeVector.baseline) * 100,
  );

  return (
    <section
      id="metricas"
      className="relative z-10 py-12 sm:py-16 lg:py-18 border-t border-white/[0.07]"
    >
      <div className="max-w-[1200px] xl:max-w-[1280px] mx-auto px-5 sm:px-8 w-full">
        <ParallaxLayer speed={0.016} maxOffset={6} desktopOnly className="relative">
          {/* Muted Cobalt Spheres Behind Thick Cut-Glass Surface */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-10 left-[12%] w-80 h-80 rounded-full cobalt-backlight"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-10 right-[10%] w-96 h-72 rounded-full cobalt-backlight-soft"
          />

          <article className="relative z-10 glass-panel-featured text-[#E2E8F0] rounded-2xl overflow-hidden">
            {/* Band 1: Single Clear Headline + Interactive Scope Tabs */}
            <div className="p-5 sm:p-8 lg:px-10 lg:py-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-5">
              <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#F1F5F9] text-balance max-w-[42ch]">
                {t.metrics.headline}
              </h2>

              {/* Segmented Functional Controls: Scroll-safe single row on mobile, inline on desktop */}
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

            {/* Band 2: Dual D3.js Visualization Grid (8 / 4 Split):
                Explicit desktop row tracks (lg:row-start-1 & lg:row-start-2) ensure the horizontal hairline
                between charts and bottom readouts forms a single continuous line across all 12 columns */}
            <div className="grid grid-cols-1 lg:grid-cols-12 border-t border-white/[0.07]">
              {/* Left 8 Cols, Row 1: Longitudinal Footprint Attenuation Curve */}
              <div className="lg:col-span-8 lg:col-start-1 lg:row-start-1 p-5 sm:px-8 sm:pt-7 sm:pb-5 lg:px-10 flex flex-col justify-between">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h3 className="text-sm sm:text-base font-medium text-[#F1F5F9] tracking-[0.01em]">
                    {t.metrics.longitudinalTitle}
                  </h3>

                  {/* Clean Unboxed Legend */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] font-normal text-[#94A3B8] shrink-0">
                    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                      <span
                        aria-hidden="true"
                        className="w-3.5 h-[2px] bg-[#E2E8F0] inline-block"
                      />
                      <span className="text-[#E2E8F0]">{t.metrics.legendFootprint}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                      <span
                        aria-hidden="true"
                        className="w-3.5 h-0 border-t border-dashed border-[#94A3B8] inline-block"
                      />
                      <span>{t.metrics.legendRisk}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                      <span
                        aria-hidden="true"
                        className="w-3.5 h-0 border-t border-dotted border-[#94A3B8]/60 inline-block"
                      />
                      <span>{t.metrics.legendBaseline}</span>
                    </span>
                  </div>
                </div>

                {/* Interactive D3 Longitudinal Chart */}
                <div className="mt-5">
                  <LongitudinalSurfaceChart
                    scopeId={activeScope.id}
                    milestones={activeScope.milestones}
                    selectedIdx={selectedMilestoneIdx}
                    onSelectIdx={setSelectedMilestoneIdx}
                    ariaLabel={t.metrics.chartAria}
                  />
                </div>
              </div>

              {/* Left 8 Cols, Row 2: Interactive Milestone Selector + Precision Readout */}
              <div className="lg:col-span-8 lg:col-start-1 lg:row-start-2 px-5 py-4 sm:px-8 sm:py-5 lg:px-10 border-t border-white/[0.07] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {activeScope.milestones.map((m, idx) => {
                      const active = idx === selectedMilestoneIdx;
                      return (
                        <button
                          key={m.code}
                          type="button"
                          onClick={() => setSelectedMilestoneIdx(idx)}
                          className={`min-h-8 px-2.5 py-1 rounded-md text-xs tabular-nums transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E2E8F0] ${
                            active
                              ? 'bg-white/[0.09] text-[#F1F5F9] font-medium'
                              : 'text-[#94A3B8] hover:text-[#E2E8F0] hover:bg-white/[0.03] font-normal'
                          }`}
                        >
                          {m.code}
                        </button>
                      );
                    })}
                  </div>

                  <p className="mt-2 text-xs font-light text-[#94A3B8] leading-relaxed tracking-[0.01em]">
                    <span className="font-medium text-[#E2E8F0]">{activeMilestone.phase}</span>
                    <span aria-hidden="true"> · </span>
                    <span>{activeMilestone.protocolNote}</span>
                  </p>
                </div>

                <div className="flex items-center gap-5 shrink-0 sm:pl-4 sm:border-l sm:border-white/[0.07]">
                  <div>
                    <div className="text-[11px] font-normal text-[#94A3B8] whitespace-nowrap">
                      {t.metrics.footprintReadoutLabel}
                    </div>
                    <div className="mt-0.5 text-lg font-medium text-[#F1F5F9] tabular-nums whitespace-nowrap">
                      {Number.isInteger(activeMilestone.exposure)
                        ? activeMilestone.exposure
                        : activeMilestone.exposure.toFixed(1)}
                      <span className="text-xs font-light text-[#94A3B8]"> / 100</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] font-normal text-[#94A3B8] whitespace-nowrap">
                      {t.metrics.mitigationDeltaLabel}
                    </div>
                    <div className="mt-0.5 text-lg font-medium text-[#E2E8F0] tabular-nums whitespace-nowrap">
                      {activeMilestone.day === 0 ? '0.0%' : `-${netCompressionPct}%`}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right 4 Cols, Row 1: Companion D3 Radial Mitigation Cartography */}
              <div className="lg:col-span-4 lg:col-start-9 lg:row-start-1 border-t lg:border-t-0 lg:border-l border-white/[0.07] p-5 sm:px-8 sm:pt-7 sm:pb-5 flex flex-col justify-between bg-[#0A0F1C]/25">
                <div>
                  <h3 className="text-sm sm:text-base font-medium text-[#F1F5F9] tracking-[0.01em]">
                    {t.metrics.radialTitle}
                  </h3>

                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-normal text-[#94A3B8]">
                    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                      <span
                        aria-hidden="true"
                        className="w-3 h-0 border-t border-dashed border-[#94A3B8] inline-block"
                      />
                      <span>{t.metrics.radialLegendBefore}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                      <span
                        aria-hidden="true"
                        className="w-3 h-[2px] bg-[#E2E8F0] inline-block"
                      />
                      <span className="text-[#E2E8F0]">{t.metrics.radialLegendAfter}</span>
                    </span>
                  </div>
                </div>

                <div className="mt-3">
                  <RadialVectorChart
                    scopeId={activeScope.id}
                    vectors={activeScope.vectors}
                    selectedVectorIdx={selectedVectorIdx}
                    onSelectVectorIdx={setSelectedVectorIdx}
                    ariaLabel={t.metrics.radialAria}
                  />
                </div>
              </div>

              {/* Right 4 Cols, Row 2: Selected Vector Detail Readout aligned with Left Readout */}
              <div className="lg:col-span-4 lg:col-start-9 lg:row-start-2 lg:border-l border-t border-white/[0.07] px-5 py-4 sm:px-8 sm:py-5 bg-[#0A0F1C]/25 flex flex-col justify-center">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-xs font-medium text-[#E2E8F0] truncate">
                    {activeVector.label}
                  </span>
                  <span className="text-xs font-medium text-[#F1F5F9] tabular-nums whitespace-nowrap shrink-0">
                    -{vectorAttenuationPct}%
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between gap-2 text-[11px] font-light text-[#94A3B8] tabular-nums">
                  <span>
                    T+0: <strong className="font-normal text-[#CBD5E1]">{activeVector.baseline}</strong>
                    <span aria-hidden="true"> → </span>
                    T+90: <strong className="font-medium text-[#E2E8F0]">{activeVector.mitigated}</strong>
                  </span>

                  <div className="inline-flex items-center gap-0.5">
                    {activeScope.vectors.map((vec, idx) => {
                      const active = idx === selectedVectorIdx;
                      return (
                        <button
                          key={vec.shortLabel}
                          type="button"
                          aria-label={vec.label}
                          onClick={() => setSelectedVectorIdx(idx)}
                          className={`min-w-7 h-7 px-1.5 rounded-md text-[11px] tabular-nums transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E2E8F0] ${
                            active
                              ? 'bg-white/[0.10] text-[#E2E8F0] font-medium'
                              : 'text-[#94A3B8] hover:text-[#E2E8F0] hover:bg-white/[0.04] font-normal'
                          }`}
                        >
                          0{idx + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Band 3: 4 Quantitative Institutional Benchmarks (Exact Cell Hairlines for 1x4, 2x2, and 4x1) */}
            <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-white/[0.07]">
              {activeScope.kpis.map((kpi, idx) => {
                const kpiBorders = [
                  idx > 0 ? 'border-t border-white/[0.07]' : '',
                  idx === 1 ? 'sm:border-t-0' : '',
                  idx >= 1 ? 'lg:border-t-0 lg:border-l lg:border-white/[0.07]' : '',
                  idx % 2 === 1 ? 'sm:border-l sm:border-white/[0.07]' : '',
                ]
                  .filter(Boolean)
                  .join(' ');

                return (
                  <div
                    key={kpi.label}
                    className={`p-5 sm:px-7 sm:py-6 hover:bg-white/[0.018] transition-colors ${kpiBorders}`}
                  >
                    <dd className="text-2xl sm:text-[26px] font-medium tracking-tight text-[#F1F5F9] tabular-nums">
                      {kpi.value}
                    </dd>
                    <dt className="mt-1.5 text-xs font-light text-[#94A3B8] leading-relaxed tracking-[0.01em]">
                      {kpi.label}
                    </dt>
                  </div>
                );
              })}
            </dl>

            {/* Band 4: Discreet Methodological Footnote & Intake Action */}
            <div className="px-5 sm:px-8 lg:px-10 py-4 border-t border-white/[0.07] bg-[#0A0F1C]/45 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-light text-[#94A3B8] tracking-[0.01em]">
              <span>{t.metrics.footnote}</span>

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
