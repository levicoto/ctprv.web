interface CotoLogoMarkProps {
  className?: string;
  variant?: 'dark' | 'light';
  padded?: boolean;
}

/**
 * Vector recreation of the Coto Privado shield-'C'-core emblem.
 * - `variant="dark"`: Ink stroke (#09090B) + cool silver core dot for light surfaces.
 * - `variant="light"`: Crisp white stroke (#FFFFFF) + cool silver core dot (#B8BEC4) for dark surfaces.
 */
export default function CotoLogoMark({
  className = 'w-5 h-5',
  variant = 'dark',
  padded = false,
}: CotoLogoMarkProps) {
  const strokeColor = variant === 'light' ? '#FFFFFF' : '#09090B';
  const dotColor = variant === 'light' ? '#B8BEC4' : '#8A9099';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={padded ? '0 0 100 100' : '15 11 70 78'}
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M 47.4 16.3 Q 50 15.2 52.6 16.3 L 75.9 26.1 Q 78.5 27.2 78.5 30.0 L 78.5 45.5 C 78.5 63.8 66.8 77.2 52.4 83.7 Q 50 84.8 47.6 83.7 C 33.2 77.2 21.5 63.8 21.5 45.5 L 21.5 30.0 Q 21.5 27.2 24.1 26.1 Z"
        stroke={strokeColor}
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 61.85 38.45 A 16.2 16.2 0 1 0 61.85 60.55"
        stroke={strokeColor}
        strokeWidth="6"
        strokeLinecap="round"
      />
      <circle cx="50" cy="49.5" r="4.35" fill={dotColor} />
    </svg>
  );
}
