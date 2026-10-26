import { ReactNode, useEffect, useRef } from 'react';

interface LayerEntry {
  el: HTMLDivElement;
  speed: number;
  maxOffset: number;
  desktopOnly: boolean;
  currentY: number;
  targetY: number;
}

const activeLayers = new Set<LayerEntry>();
let rafId = 0;
let listenersBound = false;
let reducedMotion = false;
let lastTime = 0;

function updateTargets() {
  if (reducedMotion || typeof window === 'undefined') {
    activeLayers.forEach((entry) => {
      entry.targetY = 0;
    });
    return;
  }

  const vh = window.innerHeight || 1;
  const vw = window.innerWidth || 1;
  const viewportCenter = vh * 0.5;
  const isMobile = vw < 768;
  const isTablet = vw >= 768 && vw < 1024;

  activeLayers.forEach((entry) => {
    if (isMobile && entry.desktopOnly) {
      entry.targetY = 0;
      return;
    }

    const scale = isMobile ? 0.3 : isTablet ? 0.65 : 1.0;
    const rect = entry.el.getBoundingClientRect();
    // Recover untransformed layout center to avoid feedback loops
    const naturalTop = rect.top - entry.currentY;
    const naturalBottom = rect.bottom - entry.currentY;

    // Skip offscreen elements with generous margin
    if (naturalBottom < -vh * 0.6 || naturalTop > vh * 1.6) {
      return;
    }

    const naturalCenter = naturalTop + rect.height * 0.5;
    const distanceFromCenter = viewportCenter - naturalCenter;
    const raw = distanceFromCenter * entry.speed * scale;
    const limit = entry.maxOffset * scale;
    entry.targetY = Math.max(-limit, Math.min(limit, raw));
  });
}

function stepLoop(now: number) {
  const dt = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 1 / 60;
  lastTime = now;

  // Frame-rate independent smooth exponential damping
  const alpha = 1 - Math.exp(-9.5 * dt);
  let stillMoving = false;

  activeLayers.forEach((entry) => {
    const diff = entry.targetY - entry.currentY;
    if (Math.abs(diff) > 0.04) {
      entry.currentY += diff * alpha;
      stillMoving = true;
    } else {
      entry.currentY = entry.targetY;
    }

    if (Math.abs(entry.currentY) < 0.02) {
      entry.el.style.transform = 'translate3d(0, 0px, 0)';
    } else {
      entry.el.style.transform = `translate3d(0, ${entry.currentY.toFixed(2)}px, 0)`;
    }
  });

  if (stillMoving) {
    rafId = window.requestAnimationFrame(stepLoop);
  } else {
    rafId = 0;
    lastTime = 0;
  }
}

function scheduleUpdate() {
  updateTargets();
  if (!rafId && activeLayers.size > 0 && !reducedMotion) {
    lastTime = 0;
    rafId = window.requestAnimationFrame(stepLoop);
  } else if (reducedMotion) {
    activeLayers.forEach((entry) => {
      entry.currentY = 0;
      entry.targetY = 0;
      entry.el.style.transform = 'none';
    });
  }
}

function ensureGlobalListeners() {
  if (listenersBound || typeof window === 'undefined') return;
  listenersBound = true;

  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  reducedMotion = mq.matches;
  mq.addEventListener('change', (e) => {
    reducedMotion = e.matches;
    scheduleUpdate();
  });

  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate, { passive: true });
}

interface ParallaxLayerProps {
  children: ReactNode;
  /**
   * Relative parallax velocity factor.
   * Positive values gently trail scroll; negative values gently lead scroll.
   * Converges to 0px offset when the element is centered in the viewport.
   */
  speed?: number;
  /** Maximum vertical offset in pixels so layout boundaries never collide */
  maxOffset?: number;
  /** Disable parallax offset on narrow single-column mobile screens */
  desktopOnly?: boolean;
  className?: string;
}

export default function ParallaxLayer({
  children,
  speed = 0.06,
  maxOffset = 22,
  desktopOnly = false,
  className = '',
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    ensureGlobalListeners();

    const entry: LayerEntry = {
      el,
      speed,
      maxOffset,
      desktopOnly,
      currentY: 0,
      targetY: 0,
    };

    activeLayers.add(entry);
    scheduleUpdate();

    return () => {
      activeLayers.delete(entry);
      el.style.transform = '';
      if (activeLayers.size === 0 && rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
        lastTime = 0;
      }
    };
  }, [speed, maxOffset, desktopOnly]);

  return (
    <div ref={ref} className={`parallax-gpu ${className}`.trim()}>
      {children}
    </div>
  );
}

/**
 * Subtle GPU-composited monochrome ambient light-field backdrop that glides
 * softly behind frosted glass panels on scroll.
 */
export function AmbientParallaxBackdrop() {
  const glowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = glowRef.current;
    if (!el || typeof window === 'undefined') return;

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;

    let frame = 0;
    let current = 0;
    let target = 0;

    const tick = () => {
      const diff = target - current;
      if (Math.abs(diff) > 0.1) {
        current += diff * 0.12;
        el.style.transform = `translate3d(0, ${current.toFixed(2)}px, 0)`;
        frame = window.requestAnimationFrame(tick);
      } else {
        current = target;
        el.style.transform = `translate3d(0, ${current.toFixed(2)}px, 0)`;
        frame = 0;
      }
    };

    const onScroll = () => {
      if (mq.matches) return;
      target = -window.scrollY * 0.065;
      if (!frame) {
        frame = window.requestAnimationFrame(tick);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
    >
      <div ref={glowRef} className="parallax-gpu absolute -inset-y-48 inset-x-0 ambient-light-field" />
    </div>
  );
}

let activeScrollAnim = 0;

/**
 * Smooth programmatic quintic ease-out scroll with sticky top-bar compensation.
 */
export function smoothScrollToSection(sectionId: string) {
  if (typeof window === 'undefined') return;
  const el = document.getElementById(sectionId);
  if (!el) return;

  if (activeScrollAnim) {
    window.cancelAnimationFrame(activeScrollAnim);
    activeScrollAnim = 0;
  }

  const headerOffset = sectionId === 'inicio' ? 0 : 56;
  const startY = window.scrollY;
  const rawTarget =
    sectionId === 'inicio' ? 0 : el.getBoundingClientRect().top + window.scrollY - headerOffset;
  const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  const targetY = Math.max(0, Math.min(maxScroll, rawTarget));
  const distance = targetY - startY;

  if (Math.abs(distance) < 2) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.scrollTo(0, targetY);
    return;
  }

  const duration = Math.min(760, Math.max(460, Math.abs(distance) * 0.35));
  const startTime = performance.now();

  const step = (now: number) => {
    const progress = Math.min(1, (now - startTime) / duration);
    // Quintic ease-out for effortless, weighty deceleration
    const eased = 1 - Math.pow(1 - progress, 5);
    window.scrollTo(0, startY + distance * eased);

    if (progress < 1) {
      activeScrollAnim = window.requestAnimationFrame(step);
    } else {
      activeScrollAnim = 0;
    }
  };

  activeScrollAnim = window.requestAnimationFrame(step);
}
