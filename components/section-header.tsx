import Link from "next/link";
import { Icon } from "@/components/icons";

export function SectionHeader({ title, backHref }: { title: string; backHref?: string }) {
  return (
    <header className="flex items-center gap-3">
      {backHref && (
        <Link
          href={backHref}
          aria-label="Volver"
          className="flex size-12 items-center justify-center rounded-full border border-(--color-line) bg-white"
        >
          <Icon name="arrowLeft" className="size-5" />
        </Link>
      )}
      <h1 className="text-2xl font-bold">{title}</h1>
    </header>
  );
}
