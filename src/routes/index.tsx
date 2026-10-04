import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, BadgeIndianRupee, Building2, Home, KeyRound, MapPin, ShieldCheck, Trees } from "lucide-react";
import { Button } from "@/components/ui/button";
import { publishedPropertiesQuery } from "@/lib/queries";
import { PropertyCard } from "@/components/site/PropertyCard";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { useEnquiry } from "@/components/site/EnquiryContext";

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(publishedPropertiesQuery()),
  head: () => ({ meta: [
    { title: "Udaya Ventures — Find Your New Home" },
    { name: "description", content: "Explore premium homes, apartments, villas and residential plots across India, direct from the developer." },
    { property: "og:title", content: "Udaya Ventures — Find Your New Home" },
    { property: "og:description", content: "Premium properties across India with clear pricing and expert assistance." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: HomePage,
});

const types = [
  { to: "/apartments", label: "Apartments", icon: Building2, image: "/images/apartment-1.jpg" },
  { to: "/villas", label: "Villas", icon: KeyRound, image: "/images/villa-1.jpg" },
  { to: "/homes", label: "Homes", icon: Home, image: "/images/home-1.jpg" },
  { to: "/plots", label: "Plots", icon: Trees, image: "/images/plot-1.jpg" },
] as const;

function HomePage() {
  const { data } = useSuspenseQuery(publishedPropertiesQuery());
  const featured = data.filter((p) => p.featured).slice(0, 8);
  const { open } = useEnquiry();
  return (
    <>
      <section className="relative min-h-[calc(100svh-4rem)] overflow-hidden md:min-h-[calc(100svh-5rem)]">
        <img src="/images/hero.jpg" alt="Premium Udaya Ventures apartment development" width={1920} height={1080} className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-hero-fade" />
        <div className="container-site relative flex min-h-[calc(100svh-4rem)] items-end pb-36 pt-24 md:min-h-[calc(100svh-5rem)] md:pb-40">
          <div className="max-w-3xl animate-rise text-overlay-foreground">
            <p className="eyebrow">Welcome to Udaya Ventures</p>
            <h1 className="mt-4 text-5xl font-semibold leading-[1.04] md:text-7xl">Find a Place You'll Love to Call Home</h1>
            <p className="mt-5 max-w-2xl text-lg text-overlay-foreground/85 md:text-xl">Explore premium homes, apartments, villas and plots across India.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="brass" size="xl"><Link to="/properties">Explore Properties <ArrowRight /></Link></Button>
              <Button variant="glass" size="xl" onClick={() => open()}>Enquire Now</Button>
            </div>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-overlay/65 backdrop-blur-md">
          <div className="container-site grid grid-cols-4">
            {types.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to} className="flex h-24 flex-col items-center justify-center gap-2 border-r border-overlay-foreground/15 text-sm font-semibold text-overlay-foreground transition-colors last:border-r-0 hover:bg-overlay-foreground/10 md:h-28 md:flex-row md:text-base">
                <Icon className="size-5 text-brass" /> {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-site py-16 md:py-24">
        <div className="flex items-end justify-between gap-6">
          <div><p className="eyebrow">Curated for you</p><h2 className="mt-2 text-4xl font-semibold md:text-5xl">Featured Properties</h2></div>
          <Button asChild variant="link" className="hidden md:inline-flex"><Link to="/properties">View all properties <ArrowRight /></Link></Button>
        </div>
        <div className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{featured.map((p) => <PropertyCard key={p.id} p={p} />)}</div>
      </section>

      <section className="bg-secondary py-16 md:py-24">
        <div className="container-site">
          <div className="text-center"><p className="eyebrow">Find your fit</p><h2 className="mt-2 text-4xl font-semibold">Explore by Property Type</h2></div>
          <div className="mt-9 grid grid-cols-2 gap-3 md:grid-cols-4">
            {types.map(({ to, label, image }) => (
              <Link key={to} to={to} className="group relative aspect-[3/4] overflow-hidden rounded-lg">
                <img src={image} alt={label} loading="lazy" className="size-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-card-fade" />
                <span className="absolute bottom-5 left-5 font-display text-2xl font-semibold text-overlay-foreground">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-site grid gap-12 py-16 md:grid-cols-2 md:items-center md:py-24">
        <div>
          <p className="eyebrow">Why Udaya Ventures</p><h2 className="mt-2 text-4xl font-semibold md:text-5xl">A simpler way to find your next home</h2>
          <p className="mt-5 text-muted-foreground">We sell our properties directly, so you get clear information, transparent pricing and one expert team from your first enquiry onward.</p>
          <Button asChild variant="outline" size="lg" className="mt-7"><Link to="/about">Our approach <ArrowRight /></Link></Button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[ [ShieldCheck,"Quality Properties","Homes selected and built with lasting quality in mind."], [MapPin,"Prime Locations","Well-connected neighbourhoods suited to everyday life."], [BadgeIndianRupee,"Transparent Pricing","Clear starting prices with no marketplace confusion."], [KeyRound,"Expert Assistance","A property expert supports you through every step."] ].map(([I,t,d]) => { const Icon=I as typeof ShieldCheck; return <div key={t as string} className="rounded-lg bg-card p-5 shadow-card"><Icon className="size-6 text-brass"/><h3 className="mt-4 text-lg font-semibold">{t as string}</h3><p className="mt-2 text-sm text-muted-foreground">{d as string}</p></div> })}
        </div>
      </section>

      <section className="bg-primary py-16 text-primary-foreground md:py-24">
        <div className="container-site grid gap-12 md:grid-cols-[1fr_24rem] md:items-center">
          <div><p className="eyebrow">Talk to our team</p><h2 className="mt-2 text-4xl font-semibold md:text-5xl">Your new home starts with a conversation.</h2><p className="mt-4 max-w-xl text-primary-foreground/70">Tell us how to reach you. Our property expert will help you explore the right options.</p></div>
          <EnquiryForm tone="dark" submitLabel="Request a Call Back" />
        </div>
      </section>
    </>
  );
}