import { useMemo } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { publishedPropertiesQuery } from "@/lib/queries";
import { BUDGETS, CITIES, TYPE_PLURAL, type PropertyType } from "@/lib/format";
import { PropertyCard } from "./PropertyCard";

export type ListingFilters = { type?: PropertyType; city?: string; budget?: string };
const withFilter = (filters: ListingFilters, key: keyof ListingFilters, value: string) => {
  const next = { ...filters };
  if (value) next[key] = value as PropertyType;
  else delete next[key];
  return next;
};

const sel =
  "h-11 rounded-md border border-input bg-card px-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring";

export function PropertyListing({
  title,
  intro,
  filters,
  onChange,
  lockType,
}: {
  title: string;
  intro?: string;
  filters: ListingFilters;
  onChange?: (f: ListingFilters) => void;
  lockType?: boolean;
}) {
  const { data } = useSuspenseQuery(publishedPropertiesQuery());
  const list = useMemo(() => {
    const b = BUDGETS.find((x) => x.id === filters.budget);
    return data.filter(
      (p) =>
        (!filters.type || p.type === filters.type) &&
        (!filters.city || p.city.toLowerCase() === filters.city.toLowerCase()) &&
        (!b || (Number(p.price_from) >= b.min && Number(p.price_from) < b.max)),
    );
  }, [data, filters]);

  return (
    <section className="container-site py-12 md:py-16">
      <p className="eyebrow">Direct from the developer</p>
      <h1 className="mt-2 text-4xl font-semibold md:text-5xl">{title}</h1>
      {intro && <p className="mt-3 max-w-2xl text-muted-foreground">{intro}</p>}

      {onChange && (
        <div className="mt-8 grid grid-cols-1 gap-3 rounded-xl bg-secondary p-4 sm:grid-cols-3">
          {!lockType && (
            <select aria-label="Property type" className={sel} value={filters.type ?? ""} onChange={(e) => onChange(withFilter(filters, "type", e.target.value))}>
              <option value="">All types</option>
              {(Object.keys(TYPE_PLURAL) as PropertyType[]).map((t) => (
                <option key={t} value={t}>{TYPE_PLURAL[t]}</option>
              ))}
            </select>
          )}
          <select aria-label="Location" className={sel} value={filters.city ?? ""} onChange={(e) => onChange(withFilter(filters, "city", e.target.value))}>
            <option value="">All locations</option>
            {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select aria-label="Budget" className={sel} value={filters.budget ?? ""} onChange={(e) => onChange(withFilter(filters, "budget", e.target.value))}>
            <option value="">Any budget</option>
            {BUDGETS.map((b) => <option key={b.id} value={b.id}>{b.label}</option>)}
          </select>
        </div>
      )}

      <p className="mt-6 text-sm text-muted-foreground">{list.length} {list.length === 1 ? "property" : "properties"} available</p>
      {list.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
          No properties match these filters right now. Try a different location or budget.
        </div>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => <PropertyCard key={p.id} p={p} />)}
        </div>
      )}
    </section>
  );
}
