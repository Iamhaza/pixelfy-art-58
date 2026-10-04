import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { MOBILE_ERROR, NAME_ERROR, normalizeIndianMobile, validateName } from "./validation";

const schema = z.object({
  name: z.string().max(200),
  mobile: z.string().max(30),
  propertyId: z.string().uuid().nullable().optional(),
});

export const submitLead = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => schema.parse(d))
  .handler(async ({ data }) => {
    const name = validateName(data.name);
    if (!name) return { ok: false as const, error: NAME_ERROR };
    const mobile = normalizeIndianMobile(data.mobile);
    if (!mobile) return { ok: false as const, error: MOBILE_ERROR };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    let property: { id: string; name: string; type: string; location: string; city: string } | null = null;
    if (data.propertyId) {
      const { data: p } = await supabaseAdmin
        .from("properties")
        .select("id,name,type,location,city")
        .eq("id", data.propertyId)
        .eq("published", true)
        .maybeSingle();
      property = p;
    }

    const { error } = await supabaseAdmin.from("leads").insert({
      name,
      mobile,
      property_id: property?.id ?? null,
      property_name: property?.name ?? "General enquiry",
      property_type: property?.type ?? "",
      location: property ? [property.location, property.city].filter(Boolean).join(", ") : "",
    });
    if (error) {
      console.error("lead insert failed", error);
      return { ok: false as const, error: "Something went wrong. Please try again." };
    }
    return { ok: true as const };
  });
