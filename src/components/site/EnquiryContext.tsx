import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EnquiryForm } from "./EnquiryForm";

type Target = { id: string; name: string } | null;
const Ctx = createContext<{ open: (p?: Target) => void }>({ open: () => {} });

export function EnquiryProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [target, setTarget] = useState<Target>(null);
  const [key, setKey] = useState(0);
  const open = useCallback((p: Target = null) => {
    setTarget(p);
    setKey((k) => k + 1);
    setOpen(true);
  }, []);
  return (
    <Ctx.Provider value={{ open }}>
      {children}
      <Dialog open={isOpen} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">
              {target ? "Interested in this property?" : "Enquire Now"}
            </DialogTitle>
            <DialogDescription>
              {target ? <span className="font-medium text-foreground">{target.name}. </span> : null}
              Enter your details and our property expert will contact you.
            </DialogDescription>
          </DialogHeader>
          <EnquiryForm key={key} propertyId={target?.id} propertyName={target?.name} />
        </DialogContent>
      </Dialog>
    </Ctx.Provider>
  );
}

export const useEnquiry = () => useContext(Ctx);
