import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import {
  daysUntil,
  filingStatus,
  fmtDate,
  licenseStatus,
} from "@/lib/grc";
import { AppShell } from "@/components/grc/AppShell";
import { StatusBadge } from "@/components/grc/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import {
  ArrowRight,
  AlertTriangle,
  CalendarClock,
  FileCheck2,
  ReceiptText,
} from "lucide-react";
import { Link } from "react-router";

export default function Dashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const licenses = useQuery(api.licenses.list);
  const filings = useQuery(api.filings.list);
  const wageUpdates = useQuery(api.wageUpdates.list);

  if (authLoading || licenses === undefined || filings === undefined) {
    return (
      <AppShell>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      </AppShell>
    );
  }

  const licenseStatuses = licenses.map((l) => ({
    ...l,
    status: licenseStatus(l.renewalDate),
  }));
  const filingRows = filings.map((f) => ({
    ...f,
    status: filingStatus(f.dueDate, f.filedDate),
  }));

  const expired = licenseStatuses.filter((l) => l.status === "expired");
  const expiring = licenseStatuses.filter((l) => l.status === "expiring");
  const overdue = filingRows.filter((f) => f.status === "overdue");
  const pending = filingRows.filter((f) => f.status === "pending");

  const attention = [
    ...expired.map((l) => ({ kind: "license" as const, item: l, days: daysUntil(l.renewalDate) })),
    ...overdue.map((f) => ({ kind: "filing" as const, item: f, days: daysUntil(f.dueDate) })),
    ...expiring.map((l) => ({ kind: "license" as const, item: l, days: daysUntil(l.renewalDate) })),
    ...pending.map((f) => ({ kind: "filing" as const, item: f, days: daysUntil(f.dueDate) })),
  ]
    .sort((a, b) => a.days - b.days)
    .slice(0, 6);

  const stats = [
    {
      label: "Licences & registrations",
      value: licenses.length,
      sub: `${expiring.length + expired.length} need renewal`,
      icon: FileCheck2,
      to: "/dashboard/licenses",
      tone: "text-primary bg-primary/10",
    },
    {
      label: "Expired",
      value: expired.length,
      sub: "Renew immediately",
      icon: AlertTriangle,
      to: "/dashboard/report",
      tone:
        expired.length > 0
          ? "text-red-600 bg-red-50"
          : "text-emerald-600 bg-emerald-50",
    },
    {
      label: "Open challans & returns",
      value: overdue.length + pending.length,
      sub: `${overdue.length} overdue · ${pending.length} pending`,
      icon: ReceiptText,
      to: "/dashboard/filings",
      tone: "text-primary bg-primary/10",
    },
    {
      label: "Wage updates tracked",
      value: wageUpdates?.length ?? 0,
      sub: "Latest rates by state",
      icon: CalendarClock,
      to: "/dashboard/wages",
      tone: "text-primary bg-primary/10",
    },
  ];

  return (
    <AppShell>
      <div className="mb-8">
        <p className="text-sm font-medium text-muted-foreground">
          Client dashboard
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
          Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your compliance position at a glance.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} to={s.to}>
            <Card className="h-full border-border/70 shadow-card transition-shadow hover:shadow-card-lg">
              <CardContent className="pt-0">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {s.label}
                    </p>
                    <p className="mt-2 text-3xl font-semibold tracking-tight">
                      {s.value}
                    </p>
                  </div>
                  <div
                    className={`flex size-9 items-center justify-center rounded-lg ${s.tone}`}
                  >
                    <s.icon className="size-4" />
                  </div>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{s.sub}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Needs attention */}
      <Card className="mt-8 border-border/70 shadow-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-base font-semibold">
              Needs your attention
            </CardTitle>
            <CardDescription>
              Expired and overdue items first, then upcoming renewals and due dates.
            </CardDescription>
          </div>
          <Button asChild variant="outline" size="sm" className="gap-1.5 print:hidden">
            <Link to="/dashboard/report">
              Full report
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {attention.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Everything is on track — no expired licences or pending filings.
            </p>
          ) : (
            <ul className="divide-y divide-border/70">
              {attention.map(({ kind, item }) => (
                <li key={`${kind}-${item._id}`}>
                  <Link
                    to={
                      kind === "license"
                        ? `/dashboard/licenses/${item._id}`
                        : `/dashboard/filings/${item._id}`
                    }
                    className="-mx-3 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg px-3 py-3 transition-colors hover:bg-secondary/60"
                  >
                    {kind === "license" ? (
                      <>
                        <FileCheck2 className="size-4 shrink-0 text-muted-foreground" />
                        <span className="min-w-0 flex-1 truncate text-sm font-medium">
                          {(item as Doc<"licenses">).name}
                        </span>
                        <span className="hidden text-xs text-muted-foreground sm:block">
                          Renewal · {fmtDate((item as Doc<"licenses">).renewalDate)}
                        </span>
                        <StatusBadge status={licenseStatus((item as Doc<"licenses">).renewalDate)} />
                      </>
                    ) : (
                      <>
                        <ReceiptText className="size-4 shrink-0 text-muted-foreground" />
                        <span className="min-w-0 flex-1 truncate text-sm font-medium">
                          {(item as Doc<"filings">).title}
                        </span>
                        <span className="hidden text-xs capitalize text-muted-foreground sm:block">
                          {(item as Doc<"filings">).type} ·{" "}
                          {(item as Doc<"filings">).period}
                        </span>
                        <StatusBadge
                          status={filingStatus(
                            (item as Doc<"filings">).dueDate,
                            (item as Doc<"filings">).filedDate,
                          )}
                        />
                      </>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </AppShell>
  );
}
