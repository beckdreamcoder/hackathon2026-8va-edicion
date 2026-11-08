import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  href: string;
  title: string;
  description: string;
  icon: ReactNode;
  variant: "outline" | "solid";
};

export function ModuleCard({ href, title, description, icon, variant }: Props) {
  const solid = variant === "solid";
  return (
    <Link
      href={href}
      className={`flex min-h-28 items-center gap-4 rounded-[1.25rem] border-2 p-5 ${
        solid ? "border-(--color-brand) bg-(--color-brand) text-white" : "border-(--color-brand) bg-white text-(--color-ink)"
      }`}
    >
      <span className="shrink-0">{icon}</span>
      <span className="flex flex-col">
        <span className="font-sans text-2xl font-bold leading-tight">{title}</span>
        <span className={`mt-1 text-base ${solid ? "text-white/90" : "text-(--color-muted)"}`}>
          {description}
        </span>
      </span>
    </Link>
  );
}
