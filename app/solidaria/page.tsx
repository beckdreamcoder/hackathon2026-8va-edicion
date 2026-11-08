import { SectionHeader } from "@/components/section-header";

export default function Pagina() {
  return (
    <div className="flex flex-col gap-4">
      <SectionHeader title="Red solidaria" backHref="/" />
      <p className="text-(--color-muted)">En construcción · Fase 1.</p>
    </div>
  );
}
