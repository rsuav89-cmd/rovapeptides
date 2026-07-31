import type { CatalogProductFamily } from "@/lib/catalog";
import { FamilyCard } from "@/components/catalog/FamilyCard";

export function FamilyGrid({ families }: { families: CatalogProductFamily[] }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {families.map((f) => (
        <FamilyCard key={f.id} family={f} />
      ))}
    </div>
  );
}
