import { differenceInCalendarDays, format, parseISO } from "date-fns";

export type LicenseStatus = "valid" | "expiring" | "expired";
export type FilingStatus = "pending" | "overdue" | "filed";

/** Days ahead that count as "expiring soon" */
export const EXPIRING_WINDOW_DAYS = 90;

export function daysUntil(dateStr: string): number {
  return differenceInCalendarDays(parseISO(dateStr), new Date());
}

export function licenseStatus(renewalDate: string): LicenseStatus {
  const d = daysUntil(renewalDate);
  if (d < 0) return "expired";
  if (d <= EXPIRING_WINDOW_DAYS) return "expiring";
  return "valid";
}

export function filingStatus(dueDate: string, filedDate?: string): FilingStatus {
  if (filedDate) return "filed";
  return daysUntil(dueDate) < 0 ? "overdue" : "pending";
}

export function fmtDate(dateStr?: string): string {
  if (!dateStr) return "—";
  try {
    return format(parseISO(dateStr), "dd MMM yyyy");
  } catch {
    return dateStr;
  }
}

export function fmtINR(amount?: number): string {
  if (amount === undefined || amount === null) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** yyyy-mm-dd for date inputs */
export function toISODate(d: Date): string {
  return format(d, "yyyy-MM-dd");
}
