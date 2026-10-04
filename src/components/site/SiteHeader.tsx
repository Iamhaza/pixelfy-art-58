import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Menu, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { settingsQuery, DEFAULT_SETTINGS } from "@/lib/queries";
import { useEnquiry } from "./EnquiryContext";
import { track } from "@/lib/analytics";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/properties", label: "Properties" },
  { to: "/apartments", label: "Apartments" },
  { to: "/villas", label: "Villas" },
  { to: "/plots", label: "Plots" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact" },
] as const;

export function Logo({ name, logo }: { name: string; logo?: string }) {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      {logo ? (
        <img src={logo} alt={name} className="h-9 w-auto" />
      ) : (
        <span className="grid size-9 place-items-center rounded-md bg-primary font-display text-lg text-brass">
          {name.charAt(0)}
        </span>
      )}
      <span className="font-display text-xl font-semibold tracking-tight">{name}</span>
    </Link>
  );
}

export function SiteHeader() {
  const { data: s = DEFAULT_SETTINGS } = useQuery(settingsQuery());
  const { open } = useEnquiry();
  const [menu, setMenu] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur">
      <div className="container-site flex h-16 items-center justify-between gap-4 md:h-20">
        <Logo name={s.company_name} logo={s.logo_url} />
        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a
            href={`tel:${s.phone}`}
            onClick={() => track("call_clicked", { from: "header" })}
            className="hidden items-center gap-2 text-sm font-semibold md:flex"
          >
            <Phone className="size-4 text-brass" /> {s.phone}
          </a>
          <Button variant="brass" className="hidden sm:inline-flex" onClick={() => open()}>
            Enquire Now
          </Button>
          <Sheet open={menu} onOpenChange={setMenu}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="size-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle className="font-display text-xl">{s.company_name}</SheetTitle>
              <nav className="mt-6 flex flex-col">
                {NAV.map((n) => (
                  <Link
                    key={n.to}
                    to={n.to}
                    onClick={() => setMenu(false)}
                    className="border-b border-border py-3.5 text-base font-medium"
                  >
                    {n.label}
                  </Link>
                ))}
                <Link to="/homes" onClick={() => setMenu(false)} className="border-b border-border py-3.5 text-base font-medium">
                  Homes
                </Link>
              </nav>
              <Button variant="brass" size="xl" className="mt-6 w-full" onClick={() => { setMenu(false); open(); }}>
                Enquire Now
              </Button>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
