import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { DEFAULT_SETTINGS } from "@/lib/queries";
import type { Settings } from "@/lib/format";
export const Route=createFileRoute("/admin/settings")({component:SettingsPage});
const fields=["company_name","logo_url","phone","whatsapp","email","address","instagram","facebook","youtube","linkedin"] as const;
function SettingsPage(){const [s,setS]=useState<Settings>(DEFAULT_SETTINGS);const [saved,setSaved]=useState(false);useEffect(()=>{supabase.from("site_settings").select("*").eq("id",1).single().then(({data})=>{if(data)setS(data)})},[]);async function submit(e:React.FormEvent){e.preventDefault();const {error}=await supabase.from("site_settings").update(s).eq("id",1);if(!error){setSaved(true);setTimeout(()=>setSaved(false),2500)}}return <form onSubmit={submit} className="max-w-2xl"><p className="eyebrow">Website</p><h1 className="mt-1 text-3xl font-semibold">Settings</h1><div className="mt-7 grid gap-5 sm:grid-cols-2">{fields.map(f=><div key={f} className={f==="address"?"sm:col-span-2":""}><Label htmlFor={f}>{f.replaceAll("_"," ").replace(/\b\w/g,x=>x.toUpperCase())}</Label><Input id={f} className="mt-1.5" value={s[f]} onChange={e=>setS({...s,[f]:e.target.value})}/></div>)}</div><Button type="submit" variant="brass" size="lg" className="mt-7">{saved?"Saved":"Save Settings"}</Button></form>}