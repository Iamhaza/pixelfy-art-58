import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Property, Settings } from "./format";

export const publishedPropertiesQuery = () =>
  queryOptions({
    queryKey: ["properties", "published"],
    queryFn: async (): Promise<Property[]> => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("published", true)
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

export const propertyBySlugQuery = (slug: string) =>
  queryOptions({
    queryKey: ["property", slug],
    queryFn: async (): Promise<Property | null> => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

export const DEFAULT_SETTINGS: Settings = {
  id: 1,
  company_name: "Udaya Ventures",
  logo_url: "",
  phone: "+918897901994",
  whatsapp: "918897901994",
  email: "sival2766@gmail.com",
  address: "Chennai, Tamil Nadu",
  instagram: "",
  facebook: "",
  youtube: "",
  linkedin: "",
};

export const settingsQuery = () =>
  queryOptions({
    queryKey: ["settings"],
    queryFn: async (): Promise<Settings> => {
      const { data } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
      return data ?? DEFAULT_SETTINGS;
    },
    staleTime: 60_000,
  });
