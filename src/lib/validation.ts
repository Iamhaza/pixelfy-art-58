export const MOBILE_ERROR = "Please enter a valid Indian mobile number.";
export const NAME_ERROR = "Please enter your name (at least 2 letters).";

/** Returns +91XXXXXXXXXX or null when invalid. */
export function normalizeIndianMobile(raw: string): string | null {
  const s = String(raw ?? "").replace(/[\s\-().]/g, "");
  let digits: string | null = null;
  if (/^\+91\d{10}$/.test(s)) digits = s.slice(3);
  else if (/^91\d{10}$/.test(s)) digits = s.slice(2);
  else if (/^\d{10}$/.test(s)) digits = s;
  if (!digits) return null;
  if (!/^[6-9]/.test(digits)) return null;
  if (/^(\d)\1{9}$/.test(digits)) return null;
  return `+91${digits}`;
}

export function validateName(raw: string): string | null {
  const n = String(raw ?? "").trim().replace(/\s+/g, " ");
  if (n.length < 2 || n.length > 80) return null;
  if (/^[\d\s]+$/.test(n)) return null;
  if (!/\p{L}/u.test(n)) return null;
  return n;
}
