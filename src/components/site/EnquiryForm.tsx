import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitLead } from "@/lib/leads.functions";
import { MOBILE_ERROR, NAME_ERROR, normalizeIndianMobile, validateName } from "@/lib/validation";
import { track } from "@/lib/analytics";

export const SUCCESS_MSG = "Thank you! Our property expert will contact you shortly.";

export function EnquiryForm({
  propertyId,
  propertyName,
  submitLabel = "Get Details",
  tone = "light",
}: {
  propertyId?: string | null;
  propertyName?: string;
  submitLabel?: string;
  tone?: "light" | "dark";
}) {
  const send = useServerFn(submitLead);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [errors, setErrors] = useState<{ name?: string; mobile?: string; form?: string }>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [started, setStarted] = useState(false);

  const onStart = () => {
    if (started) return;
    setStarted(true);
    track("enquiry_started", { propertyId, propertyName });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: typeof errors = {};
    if (!validateName(name)) errs.name = NAME_ERROR;
    if (!normalizeIndianMobile(mobile)) errs.mobile = MOBILE_ERROR;
    setErrors(errs);
    if (errs.name || errs.mobile) return;
    setLoading(true);
    try {
      const res = await send({ data: { name, mobile, propertyId: propertyId ?? null } });
      if (res.ok) {
        setDone(true);
        track("enquiry_submitted", { propertyId, propertyName });
      } else setErrors({ form: res.error });
    } catch {
      setErrors({ form: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const labelCls = tone === "dark" ? "text-overlay-foreground/80" : "text-muted-foreground";

  if (done) {
    return (
      <div className="flex items-start gap-3 rounded-lg border border-success/30 bg-success/10 p-5" role="status">
        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" />
        <p className={tone === "dark" ? "text-overlay-foreground" : "text-foreground"}>{SUCCESS_MSG}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor={`n-${propertyId ?? "g"}`} className={labelCls}>Name</Label>
        <Input
          id={`n-${propertyId ?? "g"}`}
          value={name}
          onFocus={onStart}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your full name"
          autoComplete="name"
          className="h-12 bg-card text-base text-card-foreground"
          aria-invalid={!!errors.name}
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`m-${propertyId ?? "g"}`} className={labelCls}>Mobile Number</Label>
        <div className="flex">
          <span className="inline-flex h-12 items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground">+91</span>
          <Input
            id={`m-${propertyId ?? "g"}`}
            value={mobile}
            onFocus={onStart}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="98765 43210"
            inputMode="tel"
            autoComplete="tel-national"
            className="h-12 rounded-l-none bg-card text-base text-card-foreground"
            aria-invalid={!!errors.mobile}
          />
        </div>
        {errors.mobile && <p className="text-sm text-destructive">{errors.mobile}</p>}
      </div>
      {errors.form && <p className="text-sm text-destructive">{errors.form}</p>}
      <Button type="submit" variant="brass" size="xl" className="w-full" disabled={loading}>
        {loading && <Loader2 className="animate-spin" />}
        {submitLabel}
      </Button>
      <p className={`text-xs ${labelCls}`}>We respect your privacy. No spam, ever.</p>
    </form>
  );
}
