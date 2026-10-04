import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Bath, BedDouble, Building2, CalendarClock, Check, ChevronLeft, MapPin, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { MobileBar } from "@/components/site/MobileBar";
import { formatPrice, mainImage, TYPE_LABEL } from "@/lib/format";
import { propertyBySlugQuery } from "@/lib/queries";
import { track } from "@/lib/analytics";

export const Route = createFileRoute("/property/$slug")({
  loader: async ({ context, params }) => {
    const p = await context.queryClient.ensureQueryData(propertyBySlugQuery(params.slug));
    if (!p) throw notFound();
    return p;
  },
  head: ({ loaderData }) => ({ meta: [
    { title: loaderData ? `${loaderData.seo_title || loaderData.name} — Aranya Homes` : "Property Not Found — Aranya Homes" },
    { name:"description",content:loaderData?.seo_description || loaderData?.description || "Property details from Aranya Homes." },
    { property:"og:title",content:loaderData?.name || "Aranya Homes Property" },
    { property:"og:description",content:loaderData?.seo_description || loaderData?.description || "Explore this property." },
    { property:"og:type",content:"website" }, { name:"twitter:card",content:"summary_large_image" },
  ]}),
  component: PropertyPage,
  notFoundComponent: () => <div className="container-site py-24 text-center"><h1 className="text-4xl">Property not found</h1><Button asChild className="mt-6"><Link to="/properties">View all properties</Link></Button></div>,
});

function PropertyPage() {
  const p = Route.useLoaderData();
  const { data } = useSuspenseQuery(propertyBySlugQuery(p.slug));
  const property = data ?? p;
  const images = property.images?.length ? property.images : [mainImage(property)];
  const [active, setActive] = useState(0);
  useEffect(() => { track("property_viewed", { propertyId: property.id, propertyName: property.name }); }, [property.id, property.name]);
  const facts = [
    [BedDouble, property.configuration, "Configuration"],
    [Maximize2, property.type === "plot" ? property.plot_area : property.area, "Area"],
    [Bath, property.bathrooms ? `${property.bathrooms} bathrooms` : property.facing, property.bathrooms ? "Bathrooms" : "Facing"],
    [CalendarClock, property.possession, "Possession"],
  ].filter(([,v])=>v);
  return <>
    <section className="container-site py-6 md:py-10">
      <Link to="/properties" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ChevronLeft className="size-4"/> All properties</Link>
      <div className="mt-5 grid gap-3 md:grid-cols-[2fr_1fr]">
        <button onClick={()=>setActive(0)} className="overflow-hidden rounded-lg md:row-span-2"><img src={images[0]} alt={property.name} className="aspect-[16/10] size-full object-cover md:aspect-auto"/></button>
        {images.slice(1,3).map((img,i)=><button key={img} onClick={()=>setActive(i+1)} className="hidden overflow-hidden rounded-lg md:block"><img src={img} alt={`${property.name} ${i+2}`} className="aspect-[16/9] size-full object-cover"/></button>)}
      </div>
      {images.length > 1 && <div className="mt-3 flex gap-2 overflow-x-auto pb-2">{images.map((img,i)=><button key={`${img}-${i}`} onClick={()=>setActive(i)} className={`h-16 w-24 shrink-0 overflow-hidden rounded border-2 ${active===i?"border-brass":"border-transparent"}`}><img src={img} alt="" className="size-full object-cover"/></button>)}</div>}
    </section>
    <section className="container-site grid gap-12 pb-16 lg:grid-cols-[1fr_25rem]">
      <div>
        <div className="flex flex-wrap gap-2">{property.new_launch&&<span className="rounded-full bg-brass px-3 py-1 text-xs font-bold text-brass-foreground">New Launch</span>}<span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold">{TYPE_LABEL[property.type]}</span></div>
        <h1 className="mt-4 text-4xl font-semibold md:text-5xl">{property.name}</h1>
        <p className="mt-2 flex items-center gap-1.5 text-muted-foreground"><MapPin className="size-4 text-brass"/> {[property.location,property.city].filter(Boolean).join(", ")}</p>
        <div className="mt-6 border-y border-border py-5"><p className="text-sm text-muted-foreground">Starting price</p><p className="font-display text-3xl font-semibold text-primary">{formatPrice(property.price_from)} <span className="font-sans text-sm font-normal text-muted-foreground">onwards</span></p></div>
        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">{facts.map(([I,v,l])=>{const Icon=I as typeof Building2;return <div key={l as string} className="rounded-lg bg-secondary p-4"><Icon className="size-5 text-brass"/><p className="mt-3 font-semibold">{v as string}</p><p className="text-xs text-muted-foreground">{l as string}</p></div>})}</div>
        <div className="mt-10"><h2 className="text-3xl font-semibold">About this property</h2><p className="mt-4 leading-7 text-muted-foreground">{property.description}</p></div>
        {property.highlights.length>0&&<div className="mt-10"><h2 className="text-3xl font-semibold">Highlights</h2><div className="mt-5 grid gap-3 sm:grid-cols-2">{property.highlights.map(x=><p key={x} className="flex gap-2"><Check className="mt-0.5 size-5 shrink-0 text-success"/>{x}</p>)}</div></div>}
        {property.amenities.length>0&&<div className="mt-10"><h2 className="text-3xl font-semibold">Amenities</h2><div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">{property.amenities.map(x=><div key={x} className="rounded-lg border border-border p-4 text-sm font-medium">{x}</div>)}</div></div>}
        <div className="mt-10"><h2 className="text-3xl font-semibold">Project details</h2><dl className="mt-5 divide-y divide-border border-y border-border">{[["Status",property.project_status],["Possession",property.possession],["Developer",property.developer],["RERA Number",property.rera],["Address",property.address]].filter(([,v])=>v).map(([k,v])=><div key={k} className="grid grid-cols-3 py-3 text-sm"><dt className="text-muted-foreground">{k}</dt><dd className="col-span-2 font-medium">{v}</dd></div>)}</dl></div>
      </div>
      <aside className="h-fit rounded-xl bg-primary p-6 text-primary-foreground shadow-lift lg:sticky lg:top-28"><h2 className="text-2xl font-semibold">Interested in this property?</h2><p className="mb-5 mt-2 text-sm text-primary-foreground/70">Enter your details and our property expert will contact you.</p><EnquiryForm propertyId={property.id} propertyName={property.name} tone="dark"/></aside>
    </section>
    <MobileBar property={{id:property.id,name:property.name}} />
  </>
}