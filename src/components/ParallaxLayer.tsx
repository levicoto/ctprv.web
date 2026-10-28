import { ReactNode } from 'react';

interface ParallaxLayerProps {
  children: ReactNode;
  speed?: number;
  maxOffset?: number;
  desktopOnly?: boolean;
  className?: string;
}

/**
 * Lightweight zero-reflow architectural wrapper.
 * Avoids scroll-coupled getBoundingClientRect() layout thrashing and subpixel
 * compositor layer re-rasterization on WebGL canvases and multi-card grids.
 */
export default function ParallaxLayer({
  children,
  className = '',
}: ParallaxLayerProps) {
  return <div className={className}>{children}</div>;
}

/**
 * Static zero-cost ambient monochrome light-field backdrop.
 */
export function AmbientParallaxBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none ambient-light-field"
    />
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
    window.scrollTo({ top: targetY, behavior: 'auto' });
    return;
  }

  const duration = Math.min(680, Math.max(400, Math.abs(distance) * 0.3));
  const startTime = performance.now();

  const step = (now: number) => {
    const progress = Math.min(1, (now - startTime) / duration);
    const eased = 1 - Math.pow(1 - progress, 5);
    window.scrollTo({ top: startY + distance * eased, behavior: 'auto' });

    if (progress < 1) {
      activeScrollAnim = window.requestAnimationFrame(step);
    } else {
      activeScrollAnim = 0;
    }
  };

  activeScrollAnim = window.requestAnimationFrame(step);
}
