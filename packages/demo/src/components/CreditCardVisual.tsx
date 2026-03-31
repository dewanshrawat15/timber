import type { CSSProperties } from 'react';

export interface CreditCardVisualProps {
  number: string;
  name: string;
  expiry: string;
  cvv: string;
  flipped: boolean;
  brand: string;
  /** CSS linear-gradient string e.g. "linear-gradient(135deg, #1a1f71, #0d1240)" */
  gradient: string;
  brandLabel: string;
  className?: string;
  style?: CSSProperties;
}

function ChipIcon() {
  return (
    <svg width="44" height="34" viewBox="0 0 44 34" fill="none">
      <rect width="44" height="34" rx="5" fill="#D4A843" />
      <rect x="1" y="1" width="42" height="32" rx="4" fill="url(#chipGrad)" />
      {/* Horizontal lines */}
      <line x1="0" y1="11" x2="44" y2="11" stroke="#B8902C" strokeWidth="0.8" />
      <line x1="0" y1="23" x2="44" y2="23" stroke="#B8902C" strokeWidth="0.8" />
      {/* Vertical lines */}
      <line x1="14" y1="0" x2="14" y2="34" stroke="#B8902C" strokeWidth="0.8" />
      <line x1="30" y1="0" x2="30" y2="34" stroke="#B8902C" strokeWidth="0.8" />
      {/* Center contact pad */}
      <rect x="14" y="11" width="16" height="12" rx="1" fill="#C99A2E" />
      <rect x="17" y="14" width="10" height="6" rx="0.5" fill="#B8902C" />
      <defs>
        <linearGradient id="chipGrad" x1="0" y1="0" x2="44" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E8BF60" />
          <stop offset="50%" stopColor="#C99A2E" />
          <stop offset="100%" stopColor="#A67C20" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function ContactlessIcon() {
  return (
    <svg width="22" height="26" viewBox="0 0 22 26" fill="none">
      <path d="M11 13 Q11 7 16 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.5" />
      <path d="M11 13 Q11 5 19 0" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.35" />
      <path d="M11 13 Q11 9 14 7" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.7" />
      <circle cx="11" cy="14" r="2" fill="white" opacity="0.9" />
    </svg>
  );
}

/** Faint diagonal line pattern overlay as an inline SVG background */
function cardPattern() {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60'><line x1='0' y1='60' x2='60' y2='0' stroke='white' stroke-width='0.4' stroke-opacity='0.06'/><line x1='-30' y1='60' x2='30' y2='0' stroke='white' stroke-width='0.4' stroke-opacity='0.06'/><line x1='30' y1='60' x2='90' y2='0' stroke='white' stroke-width='0.4' stroke-opacity='0.06'/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

export function CreditCardVisual({
  number,
  name,
  expiry,
  cvv,
  flipped,
  gradient,
  brandLabel,
  className,
  style,
}: CreditCardVisualProps) {
  const cardStyle: CSSProperties = {
    background: gradient,
    backgroundImage: `${cardPattern()}, ${gradient}`,
    backgroundSize: '60px 60px, 100% 100%',
    backfaceVisibility: 'hidden',
  };

  return (
    <div
      className={className ?? ''}
      style={{ perspective: '1200px', ...style }}
    >
      <div
        className="relative w-full transition-transform duration-700 ease-in-out"
        style={{
          aspectRatio: '1.586',
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* ── FRONT ── */}
        <div
          className="absolute inset-0 rounded-2xl text-white select-none overflow-hidden"
          style={{
            ...cardStyle,
            boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 8px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
          }}
        >
          {/* Subtle radial glow top-right */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 60%)',
            }}
          />

          <div className="relative h-full flex flex-col justify-between p-5 sm:p-6">
            {/* Row 1: bank placeholder + contactless */}
            <div className="flex items-start justify-between">
              <div className="text-xs font-semibold tracking-[0.2em] text-white/40 uppercase">
                Timber Bank
              </div>
              <ContactlessIcon />
            </div>

            {/* Row 2: chip */}
            <div className="mt-2">
              <ChipIcon />
            </div>

            {/* Row 3: card number */}
            <div
              className="tracking-[0.22em] text-white font-medium"
              style={{ fontFamily: 'monospace', fontSize: 'clamp(14px, 3.5vw, 20px)', letterSpacing: '0.22em', textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}
            >
              {number || '•••• •••• •••• ••••'}
            </div>

            {/* Row 4: name / expiry / brand */}
            <div className="flex items-end justify-between gap-2">
              <div className="flex gap-6 min-w-0">
                <div className="min-w-0">
                  <div className="text-[9px] uppercase tracking-[0.15em] text-white/40 mb-0.5">Card Holder</div>
                  <div className="text-xs font-semibold tracking-wide truncate text-white/90" style={{ maxWidth: '140px' }}>
                    {name || 'FULL NAME'}
                  </div>
                </div>
                <div className="shrink-0">
                  <div className="text-[9px] uppercase tracking-[0.15em] text-white/40 mb-0.5">Valid Thru</div>
                  <div className="text-xs font-semibold tracking-wide text-white/90">
                    {expiry || 'MM/YY'}
                  </div>
                </div>
              </div>

              {/* Brand */}
              {brandLabel && (
                <BrandMark brand={brandLabel} />
              )}
            </div>
          </div>
        </div>

        {/* ── BACK ── */}
        <div
          className="absolute inset-0 rounded-2xl text-white select-none overflow-hidden"
          style={{
            ...cardStyle,
            transform: 'rotateY(180deg)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 8px 20px rgba(0,0,0,0.3)',
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 20% 80%, rgba(255,255,255,0.06) 0%, transparent 60%)',
            }}
          />

          {/* Magnetic stripe */}
          <div className="w-full mt-7 h-11 bg-black/80" />

          {/* Signature panel + CVV */}
          <div className="mx-5 mt-4 flex items-center gap-3">
            {/* Signature strip */}
            <div
              className="flex-1 h-9 rounded flex items-center px-2 overflow-hidden"
              style={{ background: 'repeating-linear-gradient(0deg, #e5e7eb 0px, #e5e7eb 3px, #f3f4f6 3px, #f3f4f6 6px)' }}
            >
              <span className="text-gray-400 italic text-xs tracking-widest select-none">
                Authorized Signature
              </span>
            </div>
            {/* CVV box */}
            <div className="shrink-0 bg-white rounded px-3 py-2 text-center min-w-[52px]">
              <div className="text-[8px] text-gray-400 uppercase tracking-widest leading-none mb-1">CVV</div>
              <div className="text-gray-900 font-bold font-mono text-sm leading-none">
                {cvv || '•••'}
              </div>
            </div>
          </div>

          {/* Bottom brand */}
          {brandLabel && (
            <div className="absolute bottom-4 right-5">
              <BrandMark brand={brandLabel} />
            </div>
          )}

          {/* Security notice */}
          <div className="absolute bottom-4 left-5 text-[8px] text-white/25 leading-tight max-w-[180px]">
            This card is property of Timber Bank. If found, please return.
          </div>
        </div>
      </div>
    </div>
  );
}

function BrandMark({ brand }: { brand: string }) {
  if (brand === 'MASTERCARD') {
    return (
      <div className="flex items-center shrink-0">
        <div className="w-7 h-7 rounded-full bg-red-500 opacity-90" style={{ marginRight: '-10px' }} />
        <div className="w-7 h-7 rounded-full bg-amber-400 opacity-90" />
      </div>
    );
  }
  if (brand === 'VISA') {
    return (
      <span className="text-white font-black italic tracking-tight shrink-0" style={{ fontSize: '18px', fontFamily: 'serif', textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
        VISA
      </span>
    );
  }
  if (brand === 'AMEX') {
    return (
      <span className="text-white/80 font-bold tracking-widest shrink-0 text-xs border border-white/30 px-1.5 py-0.5 rounded">
        AMEX
      </span>
    );
  }
  if (brand === 'DISCOVER') {
    return (
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="text-white font-bold tracking-wide text-xs">DISCOVER</span>
        <div className="w-5 h-5 rounded-full bg-orange-400" />
      </div>
    );
  }
  return null;
}
