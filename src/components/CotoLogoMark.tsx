interface CotoLogoMarkProps {
  className?: string;
  variant?: 'dark' | 'light';
  mark?: 'dot' | 'asterisk';
  padded?: boolean;
}

/**
 * Precision-engineered 24x24 geometric vector emblem for Coto Privado.
 * Built with G1-continuous circular corner fillets (`A`), pixel-aligned vertical walls
 * (`x = 4`, `x = 20`), and balanced 2px optical clearances so strokes never cusp or blur
 * at small navbar, modal, or favicon scales.
 */
export default function CotoLogoMark({
  className = 'w-6 h-6',
  variant = 'dark',
  mark = 'dot',
  padded = false,
}: CotoLogoMarkProps) {
  const strokeColor = variant === 'light' ? '#FFFFFF' : '#09090B';
  const centerColor = variant === 'light' ? '#D4D4D8' : '#09090B';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={padded ? '-3 -3 30 30' : '0 0 24 24'}
      fill="none"
      shapeRendering="geometricPrecision"
      aria-hidden="true"
      className={className}
    >
      {/* G1-continuous geometric shield: start/close on pixel-aligned vertical wall (20, 9) */}
      <path
        d="M 20 9 L 20 11.2 C 20 16.4 16.8708 19.5646 12.6708 21.6646 A 1.5 1.5 0 0 1 11.3292 21.6646 C 7.1292 19.5646 4 16.4 4 11.2 L 4 6.8652 A 1.4 1.4 0 0 1 4.7739 5.613 L 11.2845 2.3578 A 1.6 1.6 0 0 1 12.7155 2.3578 L 19.2261 5.613 A 1.4 1.4 0 0 1 20 6.8652 Z"
        stroke={strokeColor}
        strokeWidth="1.9"
        strokeLinejoin="round"
      />

      {/* Balanced 'C' arc centered optically at (12, 11.75) */}
      <path
        d="M 14.91 8.94 A 4.05 4.05 0 1 0 14.91 14.56"
        stroke={strokeColor}
        strokeWidth="1.9"
        strokeLinecap="round"
      />

      {/* Central core: solid precision point (default) or 6-spoke cryptographic asterisk */}
      {mark === 'asterisk' ? (
        <g stroke={centerColor} strokeWidth="1.3" strokeLinecap="round">
          <path d="M 12 10.15 L 12 13.35" />
          <path d="M 10.61 10.95 L 13.39 12.55" />
          <path d="M 10.61 12.55 L 13.39 10.95" />
        </g>
      ) : (
        <circle cx="12" cy="11.75" r="1.25" fill={centerColor} />
      )}
    </svg>
  );
}
