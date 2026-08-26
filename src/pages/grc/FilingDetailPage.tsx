import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AppShell } from "@/components/grc/AppShell";
import { StatusBadge } from "@/components/grc/StatusBadge";
import { filingStatus, fmtDate, fmtINR, toISODate } from "@/lib/grc";
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
  CalendarClock,
  CheckCircle2,
  Hash,
  ReceiptText,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "sonner";

export default function FilingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const filing = useQuery(api.filings.get, id ? { id } : "skip");
  const markFiled = useMutation(api.filings.markFiled);
  const removeFiling = useMutation(api.filings.remove);
  const navigate = useNavigate();

  if (filing === undefined) {
    return (
      <AppShell>
        <Skeleton className="h-96 max-w-2xl rounded-xl" />
      </AppShell>
    );
  }

  if (filing === null) {
    return (
      <AppShell>
        <Card className="max-w-lg border-border/70 shadow-card">
          <CardContent className="pt-0 text-center">
            <p className="py-8 text-sm text-muted-foreground">
              This record no longer exists.
            </p>
            <Button asChild variant="outline">
              <Link to="/dashboard/filings">
                <ArrowLeft className="size-4" />
                Back to challans & returns
              </Link>
            </Button>
          </CardContent>
        </Card>
      </AppShell>
    );
  }

  const status = filingStatus(filing.dueDate, filing.filedDate);

  const handleMarkFiled = async () => {
    await markFiled({ id: filing._id, filedDate: toISODate(new Date()) });
    toast.success(`"${filing.title}" marked as filed.`);
  };

  const handleDelete = async () => {
    await removeFiling({ id: filing._id });
    toast.success(`"${filing.title}" was removed.`);
    void navigate("/dashboard/filings");
  };

  return (
    <AppShell>
      <Link
        to="/dashboard/filings"
        className="mb-5 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground print:hidden"
      >
        <ArrowLeft className="size-4" />
        All challans & returns
      </Link>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {filing.title}
          </h1>
          <p className="mt-1 text-sm capitalize text-muted-foreground">
            {filing.type} · {filing.period}
          </p>
        </div>
        <StatusBadge status={status} />
      </div>

      <Card className="max-w-2xl border-border/70 shadow-card">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Record details</CardTitle>
          <CardDescription>
            Payment and reference information for this item.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <dl className="grid gap-x-10 gap-y-4 sm:grid-cols-2">
            <Row icon={ReceiptText} label="Type" value={filing.type === "challan" ? "Challan" : filing.type === "return" ? "Return" : "Receipt"} />
            <Row icon={CalendarClock} label="Period" value={filing.period} />
            <Row icon={CalendarClock} label="Due date" value={fmtDate(filing.dueDate)} />
            <Row
              icon={CheckCircle2}
              label="Filed on"
              value={fmtDate(filing.filedDate)}
            />
          </dl>

          <Separator className="my-5" />

          <dl className="grid gap-x-10 gap-y-4 sm:grid-cols-2">
            <Row
              icon={Hash}
              label="Amount"
              value={fmtINR(filing.amount)}
            />
            <Row
              icon={Hash}
              label="Reference number"
              value={filing.referenceNo}
            />
          </dl>

          {status !== "filed" && (
            <>
              <Separator className="my-5" />
              <div
                className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4 ${
                  status === "overdue"
                    ? "border-red-200 bg-red-50"
                    : "border-amber-200 bg-amber-50"
                }`}
              >
                <p className="text-sm text-muted-foreground">
                  {status === "overdue"
                    ? `This ${filing.type} is past its due date of ${fmtDate(filing.dueDate)}.`
                    : `This ${filing.type} is due on ${fmtDate(filing.dueDate)}.`}
                </p>
                <Button size="sm" className="gap-1.5" onClick={() => void handleMarkFiled()}>
                  <CheckCircle2 className="size-4" />
                  Mark as filed today
                </Button>
              </div>
            </>
          )}

          {filing.notes && (
            <>
              <Separator className="my-5" />
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Notes
              </p>
              <p className="mt-1.5 whitespace-pre-line text-sm leading-6">
                {filing.notes}
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

function Row({
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
        <dt className="text-xs capitalize text-muted-foreground">{label}</dt>
        <dd className="text-sm font-medium break-words">{value || "—"}</dd>
      </div>
    </div>
  );
}
