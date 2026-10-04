import { createClient } from "@supabase/supabase-js";
import { createFileRoute } from "@tanstack/react-router";
import type { Database } from "@/integrations/supabase/types";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin;
        const client = createClient<Database>(
          process.env["SUPABASE_URL"]!,
          process.env["SUPABASE_PUBLISHABLE_KEY"]!,
          { auth: { persistSession: false, autoRefreshToken: false } },
        );
        const { data } = await client.from("properties").select("slug,city,updated_at").eq("published", true);
        const staticPaths = ["", "/properties", "/apartments", "/villas", "/homes", "/plots", "/about", "/contact"];
        const dynamicPaths = (data ?? []).flatMap((property) => [
          `/property/${property.slug}`,
          `/properties/${property.city.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
        ]);
        const paths = [...new Set([...staticPaths, ...dynamicPaths])];
        const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((path) => `\n  <url><loc>${origin}${path || "/"}</loc></url>`).join("")}\n</urlset>`;
        return new Response(body, { headers: { "content-type": "application/xml; charset=utf-8", "cache-control": "public, max-age=3600" } });
      },
    },
  },
});