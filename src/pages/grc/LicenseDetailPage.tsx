import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { AppShell } from "@/components/grc/AppShell";
import { StatusBadge } from "@/components/grc/StatusBadge";
import { fmtDate, licenseStatus } from "@/lib/grc";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Building2,
  CalendarClock,
  Hash,
  Tag,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "sonner";

export default function LicenseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const license = useQuery(
    api.licenses.get,
    id ? { id: id as unknown as Id<"licenses"> } : "skip",
  );
  const removeLicense = useMutation(api.licenses.remove);
  const navigate = useNavigate();

  if (license === undefined) {
    return (
      <AppShell>
        <Skeleton className="h-96 max-w-2xl rounded-xl" />
      </AppShell>
    );
  }

  if (license === null) {
    return (
      <AppShell>
        <Card className="max-w-lg border-border/70 shadow-card">
          <CardContent className="pt-0 text-center">
            <p className="py-8 text-sm text-muted-foreground">
              This record no longer exists.
            </p>
            <Button asChild variant="outline">
              <Link to="/dashboard/licenses">
                <ArrowLeft className="size-4" />
                Back to licences
              </Link>
            </Button>
          </CardContent>
        </Card>
      </AppShell>
    );
  }

  const status = licenseStatus(license.renewalDate);

  const handleDelete = async () => {
    await removeLicense({ id: license._id });
    toast.success(`"${license.name}" was removed.`);
    void navigate("/dashboard/licenses");
  };

  return (
    <AppShell>
      <Link
        to="/dashboard/licenses"
        className="mb-5 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground print:hidden"
      >
        <ArrowLeft className="size-4" />
        All licences & registrations
      </Link>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {license.name}
          </h1>
          <p className="mt-1 text-sm capitalize text-muted-foreground">
            {license.category}
          </p>
        </div>
        <StatusBadge status={status} />
      </div>

      <Card className="max-w-2xl border-border/70 shadow-card">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Record details</CardTitle>
          <CardDescription>
            Renewal is tracked automatically from the date below.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <dl className="grid gap-x-10 gap-y-4 sm:grid-cols-2">
            <DetailRow
              icon={Hash}
              label="Licence number"
              value={license.licenseNumber}
            />
            <DetailRow
              icon={Building2}
              label="Issuing authority"
              value={license.authority}
            />
            <DetailRow
              icon={Tag}
              label="Category"
              value={license.category === "licence" ? "Licence" : "Registration"}
            />
            <DetailRow
              icon={CalendarClock}
              label="Issue date"
              value={fmtDate(license.issueDate)}
            />
          </dl>

          <Separator className="my-5" />

          <div
            className={`rounded-xl border p-4 ${
              status === "expired"
                ? "border-red-200 bg-red-50"
                : status === "expiring"
                  ? "border-amber-200 bg-amber-50"
                  : "border-emerald-200 bg-emerald-50"
            }`}
          >
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Next renewal
            </p>
            <p className="mt-1 text-xl font-semibold tracking-tight">
              {fmtDate(license.renewalDate)}
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {status === "expired"
                ? "This licence has expired and must be renewed immediately."
                : status === "expiring"
                  ? "Renewal is due within the next 90 days."
                  : "Renewal is not due for more than 90 days."}
            </p>
          </div>

          {license.notes && (
            <>
              <Separator className="my-5" />
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Notes
              </p>
              <p className="mt-1.5 whitespace-pre-line text-sm leading-6">
                {license.notes}
              </p>
            </>
          )}
        </CardContent>
      </Card>

      <div className="mt-6 print:hidden">
        <Button variant="destructive" size="sm" onClick={() => void handleDelete()}>
          Delete record
        </Button>
      </div>
    </AppShell>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Hash;
  label: string;
  value?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
        <Icon className="size-4" />
      </div>
      <div className="min-w-0">
        <dt className="text-xs text-muted-foreground">{label}</dt>
        <dd className="text-sm font-medium break-words">{value || "—"}</dd>
      </div>
    </div>
  );
}
