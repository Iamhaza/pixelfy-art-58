import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { publishedPropertiesQuery } from "@/lib/queries";
import { PropertyListing, type ListingFilters } from "@/components/site/PropertyListing";

export const Route = createFileRoute("/properties")({
  validateSearch: (s: Record<string, unknown>): ListingFilters => ({
    city: typeof s.city === "string" ? s.city : undefined,
    budget: typeof s.budget === "string" ? s.budget : undefined,
    type: ["apartment","villa","home","plot"].includes(String(s.type)) ? s.type as ListingFilters["type"] : undefined,
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(publishedPropertiesQuery()),
  head: () => ({ meta: [
    { title: "Our Properties — Aranya Homes" },
    { name: "description", content: "Browse premium apartments, villas, independent homes and residential plots across India." },
    { property: "og:title", content: "Our Properties — Aranya Homes" },
    { property: "og:description", content: "Explore available properties with clear prices and direct expert assistance." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: PropertiesPage,
});
function PropertiesPage() {
  const initial = Route.useSearch();
  const [filters, setFilters] = useState<ListingFilters>(initial);
  return <PropertyListing title="Our Properties" intro="Explore our available homes and plots. Filter by property type, location or budget." filters={filters} onChange={setFilters} />;
}