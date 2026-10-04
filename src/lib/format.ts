import type { Database } from "@/integrations/supabase/types";

export type Property = Database["public"]["Tables"]["properties"]["Row"];
export type PropertyType = Database["public"]["Enums"]["property_type"];
export type Lead = Database["public"]["Tables"]["leads"]["Row"];
export type Settings = Database["public"]["Tables"]["site_settings"]["Row"];

export const TYPE_LABEL: Record<PropertyType, string> = {
  apartment: "Apartment",
  villa: "Villa",
  home: "Independent Home",
  plot: "Residential Plot",
};
export const TYPE_PLURAL: Record<PropertyType, string> = {
  apartment: "Apartments",
  villa: "Villas",
  home: "Homes",
  plot: "Plots",
};

export const CITIES = ["Chennai", "Bengaluru", "Hyderabad", "Coimbatore", "Pune"];

export const BUDGETS = [
  { id: "under-50l", label: "Under ₹50 L", min: 0, max: 5_000_000 },
  { id: "50l-1cr", label: "₹50 L – ₹1 Cr", min: 5_000_000, max: 10_000_000 },
  { id: "1cr-2cr", label: "₹1 Cr – ₹2 Cr", min: 10_000_000, max: 20_000_000 },
  { id: "above-2cr", label: "Above ₹2 Cr", min: 20_000_000, max: Infinity },
] as const;

export function formatPrice(n: number | string | null | undefined): string {
  const v = Number(n ?? 0);
  if (!v) return "Price on request";
  if (v >= 10_000_000) return `₹${trim(v / 10_000_000)} Cr`;
  if (v >= 100_000) return `₹${trim(v / 100_000)} L`;
  return `₹${v.toLocaleString("en-IN")}`;
}
function trim(x: number) {
  return x.toFixed(2).replace(/\.?0+$/, "");
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function specLine(p: Property): string {
  if (p.type === "plot") return [p.plot_area, p.facing && `${p.facing} facing`].filter(Boolean).join(" · ");
  return [p.configuration, p.area].filter(Boolean).join(" · ");
}

export const FALLBACK_IMG = "/images/hero.jpg";
export const mainImage = (p: Property) => p.images?.[0] || FALLBACK_IMG;
