import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { AppShell, PageHeader } from "@/components/grc/AppShell";
import { StatusBadge } from "@/components/grc/StatusBadge";
import {
  filingStatus,
  fmtDate,
  fmtINR,
  licenseStatus,
} from "@/lib/grc";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Printer } from "lucide-react";
import { Link } from "react-router";

export default function ReportPage() {
  const licenses = useQuery(api.licenses.list);
  const filings = useQuery(api.filings.list);

  if (licenses === undefined || filings === undefined) {
    return (
      <AppShell>
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </AppShell>
    );
  }

  const licenseRows = licenses.map((l: Doc<"licenses">) => ({
    ...l,
    status: licenseStatus(l.renewalDate),
  }));
  const filingRows = filings.map((f: Doc<"filings">) => ({
    ...f,
    status: filingStatus(f.dueDate, f.filedDate),
  }));

  const expired = licenseRows.filter((l) => l.status === "expired");
  const expiring = licenseRows.filter((l) => l.status === "expiring");
  const valid = licenseRows.filter((l) => l.status === "valid");
  const overdue = filingRows.filter((f) => f.status === "overdue");
  const pending = filingRows.filter((f) => f.status === "pending");
  const filed = filingRows.filter((f) => f.status === "filed");

  const totalItems =
    licenseRows.length +
    overdue.length +
    pending.length +
    filed.length;
  const clearItems = valid.length + filed.length;
  const complianceScore =
    totalItems === 0
      ? null
      : Math.round((clearItems / totalItems) * 100);

  const generatedOn = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <AppShell>
      <PageHeader
        title="Compliance Report"
        description={`A consolidated view of your compliance standing · generated ${generatedOn}`}
        action={
          <Button
            variant="outline"
            className="gap-2 print:hidden"
            onClick={() => window.print()}
          >
            <Printer className="size-4" />
            Print report
          </Button>
        }
      />

      {/* Summary */}
      <Card className="border-border/70 shadow-card">
        <CardContent className="flex flex-wrap items-center gap-x-10 gap-y-6 pt-0">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Compliance score
            </p>
            {complianceScore === null ? (
              <p className="mt-1 text-sm text-muted-foreground">
                Add records to generate a score.
              </p>
            ) : (
              <p className="mt-1 text-4xl font-semibold tracking-tight">
                {complianceScore}
                <span className="text-xl text-muted-foreground">%</span>
              </p>
            )}
          </div>
          <div className="h-12 w-px bg-border" />
          <dl className="grid flex-1 grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-3">
            {[
              { label: "Valid licences", value: valid.length },
              { label: "Expiring soon", value: expiring.length },
              { label: "Expired", value: expired.length },
              { label: "Returns filed", value: filed.length },
              { label: "Pending filings", value: pending.length },
              { label: "Overdue", value: overdue.length },
            ].map((s) => (
              <div key={s.label}>
                <dt className="text-xs text-muted-foreground">{s.label}</dt>
                <dd className="text-lg font-semibold tracking-tight">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Renewals */}
        <Card className="border-border/70 shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              Licence & registration renewals
            </CardTitle>
            <CardDescription>
              Expired and expiring items, most urgent first.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {[...expired, ...expiring].length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                All licences are valid for more than 90 days.
              </p>
            ) : (
              <ul className="divide-y divide-border/70">
                {[...expired, ...expiring]
                  .sort((a, b) => a.renewalDate.localeCompare(b.renewalDate))
                  .map((l) => (
                    <li key={l._id}>
                      <Link
                        to={`/dashboard/licenses/${l._id}`}
                        className="-mx-2 flex items-center justify-between gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-secondary/60"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{l.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {l.authority} · renews {fmtDate(l.renewalDate)}
                          </p>
                        </div>
                        <StatusBadge status={l.status} />
                      </Link>
                    </li>
                  ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Filings */}
        <Card className="border-border/70 shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              Open challans & returns
            </CardTitle>
            <CardDescription>
              Unfiled items ordered by due date.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {overdue.length + pending.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Nothing outstanding — all filings are up to date.
              </p>
            ) : (
              <ul className="divide-y divide-border/70">
                {[...overdue, ...pending]
                  .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
                  .map((f) => (
                    <li key={f._id}>
                      <Link
                        to={`/dashboard/filings/${f._id}`}
                        className="-mx-2 flex items-center justify-between gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-secondary/60"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {f.title}
                            <span className="ml-2 text-xs capitalize text-muted-foreground">
                              {f.type}
                            </span>
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {f.period} · due {fmtDate(f.dueDate)} ·{" "}
                            {fmtINR(f.amount)}
                          </p>
                        </div>
                        <StatusBadge status={f.status} />
                      </Link>
                    </li>
                  ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <p className="mt-6 text-xs text-muted-foreground print:hidden">
        This report is generated from the records in your workspace. Verify
        critical dates against official notices before acting on them.
      </p>
    </AppShell>
  );
}
