import { Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice, mainImage, specLine, TYPE_LABEL, type Property } from "@/lib/format";
import { useEnquiry } from "./EnquiryContext";

export function PropertyCard({ p }: { p: Property }) {
  const { open } = useEnquiry();
  const isPlot = p.type === "plot";
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl bg-card shadow-card transition-shadow hover:shadow-lift">
      <Link to="/property/$slug" params={{ slug: p.slug }} className="relative block aspect-[4/3] overflow-hidden">
        <img src={mainImage(p)} alt={p.name} loading="lazy" className="size-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-card-fade" />
        <div className="absolute left-3 top-3 flex gap-2">
          {p.new_launch && <span className="rounded-full bg-brass px-3 py-1 text-xs font-bold text-brass-foreground">New Launch</span>}
          {p.featured && !p.new_launch && <span className="rounded-full bg-overlay/70 px-3 py-1 text-xs font-semibold text-overlay-foreground backdrop-blur">Featured</span>}
        </div>
        <span className="absolute bottom-3 left-3 rounded bg-overlay/60 px-2 py-0.5 text-xs font-medium text-overlay-foreground backdrop-blur">
          {TYPE_LABEL[p.type]}
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl font-semibold leading-snug">
          <Link to="/property/$slug" params={{ slug: p.slug }}>{p.name}</Link>
        </h3>
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-4 text-brass" /> {[p.location, p.city].filter(Boolean).join(", ")}
        </p>
        <p className="mt-3 text-sm font-medium">{specLine(p)}{isPlot && p.road_width ? ` · ${p.road_width} road` : ""}</p>
        <div className="mt-auto pt-4">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Starting from</p>
          <p className="font-display text-2xl font-semibold text-primary">{formatPrice(p.price_from)} <span className="font-sans text-sm font-normal text-muted-foreground">onwards</span></p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button asChild variant="outline" size="lg" className="px-3">
              <Link to="/property/$slug" params={{ slug: p.slug }}>{isPlot ? "View Plot" : "View Details"}</Link>
            </Button>
            <Button variant="default" size="lg" className="px-3" onClick={() => open({ id: p.id, name: p.name })}>
              Enquire Now
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
