interface SignalMarkProps {
  className?: string;
}

export const SIGNAL_USERNAME = 'coto.33';
export const CONTACT_EMAIL = 'help@coto.lat';

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fallback below for restricted iframe contexts
  }

  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.style.pointerEvents = 'none';
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

export default function SignalMark({ className = 'w-4 h-4' }: SignalMarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      {/* Outer dashed encryption ring evoking Signal's signature mark */}
      <path
        d="M12 2.25a9.75 9.75 0 0 1 8.64 14.28l.84 3.21a.75.75 0 0 1-.91.91l-3.21-.84A9.75 9.75 0 1 1 12 2.25Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeDasharray="2.4 2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Solid inner speech bubble */}
      <path
        d="M12 5a7 7 0 0 0-6.12 10.38l-.56 2.15 2.15-.56A7 7 0 1 0 12 5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
