export function BrandMark({ className = "h-12 w-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path
        d="M6 30 L32 8 L58 30"
        fill="none"
        stroke="#c8102e"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <g fill="#c8102e">
        <circle cx="20" cy="36" r="5" />
        <rect x="14" y="43" width="12" height="11" rx="5" />
        <circle cx="32" cy="34" r="5" />
        <rect x="26" y="41" width="12" height="13" rx="5" />
        <circle cx="44" cy="36" r="5" />
        <rect x="38" y="43" width="12" height="11" rx="5" />
      </g>
    </svg>
  );
}

export function Wordmark() {
  return (
    <div className="flex flex-col items-start">
      <p className="font-sans text-2xl font-extrabold leading-none">
        Barrio<span className="text-(--color-brand)">Conecta</span>
      </p>
      <p className="text-sm text-(--color-muted)">Un Perú más cercano</p>
    </div>
  );
}
