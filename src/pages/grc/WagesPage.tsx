import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  AddRecordDialog,
  type FieldDef,
} from "@/components/grc/AddRecordDialog";
import { AppShell, PageHeader } from "@/components/grc/AppShell";
import { fmtDate, fmtINR } from "@/lib/grc";
import { Badge } from "@/components/ui/badge";
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

type WageUpdate = {
  _id: string;
  state: string;
  effectiveDate: string;
  category: string;
  monthlyWage: number;
  previousWage?: number;
};

const FIELDS: FieldDef<Record<string, unknown>>[] = [
  { name: "state", label: "State", required: true, placeholder: "e.g. Maharashtra" },
  {
    name: "category",
    label: "Worker category",
    required: true,
    placeholder: "e.g. Unskilled / Semi-skilled / Skilled",
  },
  { name: "monthlyWage", label: "New monthly wage (₹)", type: "number", required: true },
  { name: "previousWage", label: "Previous monthly wage (₹)", type: "number" },
  { name: "effectiveDate", label: "Effective date", type: "date", required: true },
  { name: "source", label: "Source", placeholder: "e.g. Labour Dept notification" },
];

export default function WagesPage() {
  const wageUpdates = useQuery(api.wageUpdates.list);
  const addWage = useMutation(api.wageUpdates.add);

  return (
    <AppShell>
      <PageHeader
        title="Minimum Wage Updates"
        description="State-wise revisions to minimum wages and the dates they take effect."
        action={
          <AddRecordDialog
            title="Add a minimum wage update"
            description="Log a revised wage rate so payroll stays aligned with the current notification."
            fields={FIELDS}
            submitLabel="Save update"
            onSubmit={(values) =>
              addWage(values as unknown as Parameters<typeof addWage>[0])
            }
          />
        }
      />

      <Card className="border-border/70 shadow-card">
        <CardContent className="pt-0">
          {wageUpdates === undefined ? (
            <div className="space-y-3 py-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 rounded-lg" />
              ))}
            </div>
          ) : wageUpdates.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No wage updates recorded yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>State</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Monthly wage</TableHead>
                  <TableHead>Change</TableHead>
                  <TableHead>Effective from</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(wageUpdates as WageUpdate[]).map((w) => {
                  const delta =
                    w.previousWage !== undefined
                      ? w.monthlyWage - w.previousWage
                      : undefined;
                  return (
                    <TableRow key={w._id}>
                      <TableCell className="font-medium">{w.state}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {w.category}
                      </TableCell>
                      <TableCell>{fmtINR(w.monthlyWage)}</TableCell>
                      <TableCell>
                        {delta === undefined ? (
                          <span className="text-muted-foreground">—</span>
                        ) : delta > 0 ? (
                          <Badge
                            variant="outline"
                            className="border-emerald-200 bg-emerald-50 font-medium text-emerald-700"
                          >
                            +{fmtINR(delta)}
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="border-red-200 bg-red-50 font-medium text-red-700"
                          >
                            {fmtINR(delta)}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {fmtDate(w.effectiveDate)}
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
        Newest revisions appear first. Cross-check the source notification
        before applying rates in payroll.
      </p>
    </AppShell>
  );
}
