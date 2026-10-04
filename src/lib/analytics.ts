// Analytics-ready event bus. No vendor IDs are hard-coded: plug GTM / GA4 / Meta
// Pixel in later by reading window.dataLayer or listening to "app:analytics".
export type AnalyticsEvent =
  | "property_viewed"
  | "enquiry_started"
  | "enquiry_submitted"
  | "call_clicked"
  | "whatsapp_clicked";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function track(event: AnalyticsEvent, props: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const payload = { event, ...props, ts: Date.now() };
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
  window.dispatchEvent(new CustomEvent("app:analytics", { detail: payload }));
}
