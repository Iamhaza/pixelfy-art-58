import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Mail, MapPin, Phone } from "lucide-react";
import { settingsQuery, DEFAULT_SETTINGS } from "@/lib/queries";

export function SiteFooter() {
  const { data: s = DEFAULT_SETTINGS } = useQuery(settingsQuery());
  const socials = [
    ["Instagram", s.instagram],
    ["Facebook", s.facebook],
    ["YouTube", s.youtube],
    ["LinkedIn", s.linkedin],
  ].filter(([, u]) => u);
  return (
    <footer className="bg-primary pb-24 text-primary-foreground lg:pb-0">
      <div className="container-site grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-2xl">{s.company_name}</p>
          <p className="mt-3 max-w-sm text-sm text-primary-foreground/70">
            Homes, apartments, villas and residential plots — sold directly, with clear pricing and expert guidance.
          </p>
          {socials.length > 0 && (
            <div className="mt-5 flex gap-4 text-sm">
              {socials.map(([l, u]) => (
                <a key={l} href={u} target="_blank" rel="noreferrer" className="text-brass hover:underline">{l}</a>
              ))}
            </div>
          )}
        </div>
        <div>
          <p className="eyebrow">Explore</p>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/80">
            <li><Link to="/properties">All Properties</Link></li>
            <li><Link to="/apartments">Apartments</Link></li>
            <li><Link to="/villas">Villas</Link></li>
            <li><Link to="/homes">Homes</Link></li>
            <li><Link to="/plots">Plots</Link></li>
            <li><Link to="/about">About Us</Link></li>
          </ul>
        </div>
        <div>
          <p className="eyebrow">Contact</p>
          <ul className="mt-4 space-y-3 text-sm text-primary-foreground/80">
            <li className="flex gap-2"><Phone className="size-4 text-brass" /><a href={`tel:${s.phone}`}>{s.phone}</a></li>
            <li className="flex gap-2"><Mail className="size-4 text-brass" /><a href={`mailto:${s.email}`}>{s.email}</a></li>
            <li className="flex gap-2"><MapPin className="size-4 shrink-0 text-brass" />{s.address}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10">
        <div className="container-site py-5 text-xs text-primary-foreground/60">
          © {new Date().getFullYear()} {s.company_name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
