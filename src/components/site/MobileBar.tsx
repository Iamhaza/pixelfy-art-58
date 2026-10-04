import { useQuery } from "@tanstack/react-query";
import { MessageCircle, Phone, Send } from "lucide-react";
import { settingsQuery, DEFAULT_SETTINGS } from "@/lib/queries";
import { track } from "@/lib/analytics";
import { useEnquiry } from "./EnquiryContext";

export function MobileBar({ property }: { property?: { id: string; name: string } }) {
  const { data: s = DEFAULT_SETTINGS } = useQuery(settingsQuery());
  const { open } = useEnquiry();
  const wa = s.whatsapp.replace(/\D/g, "");
  const text = encodeURIComponent(property ? `Hi, I'm interested in ${property.name}.` : "Hi, I'm interested in your properties.");
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-border bg-card shadow-lift lg:hidden">
      <a href={`tel:${s.phone}`} onClick={() => track("call_clicked", { from: "mobile_bar" })} className="flex h-16 flex-col items-center justify-center gap-1 text-xs font-semibold">
        <Phone className="size-5 text-primary" /> Call
      </a>
      <a href={`https://wa.me/${wa}?text=${text}`} target="_blank" rel="noreferrer" onClick={() => track("whatsapp_clicked", { from: "mobile_bar" })} className="flex h-16 flex-col items-center justify-center gap-1 border-x border-border text-xs font-semibold">
        <MessageCircle className="size-5 text-success" /> WhatsApp
      </a>
      <button onClick={() => open(property ?? null)} className="flex h-16 flex-col items-center justify-center gap-1 bg-brass text-xs font-bold text-brass-foreground">
        <Send className="size-5" /> Enquire
      </button>
    </div>
  );
}
