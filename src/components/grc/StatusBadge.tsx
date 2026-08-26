import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { FilingStatus, LicenseStatus } from "@/lib/grc";

const STYLES: Record<string, string> = {
  valid: "bg-emerald-50 text-emerald-700 border-emerald-200",
  expiring: "bg-amber-50 text-amber-700 border-amber-200",
  expired: "bg-red-50 text-red-700 border-red-200",
  filed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  overdue: "bg-red-50 text-red-700 border-red-200",
};

const LABELS: Record<string, string> = {
  valid: "Valid",
  expiring: "Expiring soon",
  expired: "Expired",
  filed: "Filed",
  pending: "Pending",
  overdue: "Overdue",
};

export function StatusBadge({
  status,
}: {
  status: LicenseStatus | FilingStatus;
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium capitalize",
        STYLES[status] ?? "bg-muted text-muted-foreground border-border",
      )}
    >
      {LABELS[status] ?? status}
    </Badge>
  );
}
