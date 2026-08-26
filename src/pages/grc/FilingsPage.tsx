import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import {
  AddRecordDialog,
  type FieldDef,
} from "@/components/grc/AddRecordDialog";
import { AppShell, PageHeader } from "@/components/grc/AppShell";
import { StatusBadge } from "@/components/grc/StatusBadge";
import { filingStatus, fmtDate, fmtINR, toISODate } from "@/lib/grc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle2, ChevronRight } from "lucide-react";
import { Link } from "react-router";
import { toast } from "sonner";

type Filing = Doc<"filings">;

const FIELDS: FieldDef<Record<string, unknown>>[] = [
  { name: "title", label: "Title", required: true, placeholder: "e.g. PF challan – August" },
  {
    name: "type",
    label: "Type",
    type: "select",
    required: true,
    options: [
      { value: "challan", label: "Challan" },
      { value: "return", label: "Return" },
      { value: "receipt", label: "Receipt" },
    ],
  },
  { name: "period", label: "Period", required: true, placeholder: "e.g. Aug 2026 or Q1 FY26" },
  { name: "dueDate", label: "Due date", type: "date", required: true },
  { name: "amount", label: "Amount (₹)", type: "number" },
  { name: "referenceNo", label: "Reference number" },
];

export default function FilingsPage() {
  const filings = useQuery(api.filings.list);
  const addFiling = useMutation(api.filings.add);
  const markFiled = useMutation(api.filings.markFiled);

  const handleMarkFiled = async (f: Filing) => {
    try {
      await markFiled({ id: f._id, filedDate: toISODate(new Date()) });
      toast.success(`"${f.title}" marked as filed.`);
    } catch {
      toast.error("Could not update the filing. Please try again.");
    }
  };

  return (
    <AppShell>
      <PageHeader
        title="Challans & Returns"
        description="Payment challans, receipts and statutory returns, ordered by due date."
        action={
          <AddRecordDialog
            title="Add a challan, return or receipt"
            description="Track what is due, when it is due and whether it has been filed."
            fields={FIELDS}
            submitLabel="Save record"
            onSubmit={(values) =>
              addFiling(values as unknown as Parameters<typeof addFiling>[0])
            }
          />
        }
      />

      <Card className="border-border/70 shadow-card">
        <CardContent className="pt-0">
          {filings === undefined ? (
            <div className="space-y-3 py-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 rounded-lg" />
              ))}
            </div>
          ) : filings.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No challans or returns recorded yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Due date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-24 text-right print:hidden">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(filings as Filing[]).map((f) => {
                  const status = filingStatus(f.dueDate, f.filedDate);
                  return (
                    <TableRow key={f._id} className="group">
                      <TableCell className="font-medium">
                        <Link
                          to={`/dashboard/filings/${f._id}`}
                          className="flex items-center gap-1 transition-colors hover:text-primary"
                        >
                          {f.title}
                          <ChevronRight className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                        </Link>
                      </TableCell>
                      <TableCell className="capitalize text-muted-foreground">
                        {f.type}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {f.period}
                      </TableCell>
                      <TableCell>{fmtINR(f.amount)}</TableCell>
                      <TableCell>{fmtDate(f.dueDate)}</TableCell>
                      <TableCell>
                        <StatusBadge status={status} />
                      </TableCell>
                      <TableCell className="text-right print:hidden">
                        {status !== "filed" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 gap-1.5 px-2 text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              void handleMarkFiled(f);
                            }}
                          >
                            <CheckCircle2 className="size-3.5 text-emerald-600" />
                            Mark filed
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <p className="mt-3 text-xs text-muted-foreground">
        Overdue items are highlighted in red. Open any record for its full
        details and payment reference.
      </p>
    </AppShell>
  );
}
