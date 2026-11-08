import type { SVGProps } from "react";

const paths = {
  home: <path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />,
  pin: (
    <>
      <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c0-3.5 2.9-6 6.5-6s6.5 2.5 6.5 6" />
      <path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18.5 14.4c1.7.7 3 2.5 3 4.6" />
    </>
  ),
  heart: (
    <path d="M12 20s-7.5-4.6-7.5-10A4.2 4.2 0 0 1 12 7.5 4.2 4.2 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z" />
  ),
  hands: (
    <path d="M4 13l4-4 3 2 4-3 5 4-4 5-3-1-4 2-5-3zM12 8c-1.5-2-4-1.5-4 .5 0 2 4 4.5 4 4.5s4-2.5 4-4.5c0-2-2.5-2.5-4-.5z" />
  ),
  arrowLeft: <path d="M19 12H5M11 6l-6 6 6 6" />,
  chevron: <path d="M9 6l6 6-6 6" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-4-4" />
    </>
  ),
  wrench: <path d="M14.7 6.3a4 4 0 0 0 5 5L12 20l-3-3 8.7-8.7a4 4 0 0 0-3-2z" />,
  siren: (
    <>
      <path d="M7 18v-6a5 5 0 0 1 10 0v6M4 18h16M12 3v2" />
    </>
  ),
  bus: (
    <>
      <rect x="5" y="3" width="14" height="14" rx="2" />
      <path d="M5 11h14M8 21l-1-2M16 21l1-2" />
      <circle cx="8.5" cy="14" r="0.8" />
      <circle cx="15.5" cy="14" r="0.8" />
    </>
  ),
  news: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M7 8h10M7 12h10M7 16h6" />
    </>
  ),
} as const;

export type IconName = keyof typeof paths;

type Props = SVGProps<SVGSVGElement> & { name: IconName };

/** Íconos de línea propios (sin dependencias). Son decorativos: el texto va al lado. */
export function Icon({ name, className = "size-6", ...rest }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...rest}
    >
      {paths[name]}
    </svg>
  );
}
