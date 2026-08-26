import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import {
  AddRecordDialog,
  type FieldDef,
} from "@/components/grc/AddRecordDialog";
import { AppShell, PageHeader } from "@/components/grc/AppShell";
import { StatusBadge } from "@/components/grc/StatusBadge";
import { fmtDate, licenseStatus, toISODate } from "@/lib/grc";
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
import { ChevronRight } from "lucide-react";
import { Link } from "react-router";

type License = Doc<"licenses">;

const FIELDS: FieldDef<Record<string, unknown>>[] = [
  { name: "name", label: "Name", required: true, placeholder: "e.g. GST Registration" },
  { name: "licenseNumber", label: "Licence / registration number", required: true },
  {
    name: "category",
    label: "Category",
    type: "select",
    required: true,
    options: [
      { value: "licence", label: "Licence" },
      { value: "registration", label: "Registration" },
    ],
  },
  { name: "authority", label: "Issuing authority", required: true, placeholder: "e.g. Labour Department" },
  { name: "issueDate", label: "Issue date", type: "date" },
  { name: "renewalDate", label: "Renewal date", type: "date", required: true },
];

export default function LicensesPage() {
  const licenses = useQuery(api.licenses.list);
  const addLicense = useMutation(api.licenses.add);

  return (
    <AppShell>
      <PageHeader
        title="Licences & Registrations"
        description="Every licence and registration you hold, with renewal dates tracked automatically."
        action={
          <AddRecordDialog
            title="Add a licence or registration"
            description="Record the details and renewal date so it appears on your dashboard."
            fields={FIELDS}
            submitLabel="Save record"
            onSubmit={(values) =>
              addLicense(
                values as unknown as Parameters<typeof addLicense>[0],
              )
            }
          />
        }
      />

      <Card className="border-border/70 shadow-card">
        <CardContent className="pt-0">
          {licenses === undefined ? (
            <div className="space-y-3 py-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 rounded-lg" />
              ))}
            </div>
          ) : licenses.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No licences or registrations yet. Add your first one to start
              tracking renewals.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Number</TableHead>
                  <TableHead>Authority</TableHead>
                  <TableHead>Renewal date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-8" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {licenses.map((l: License) => (
                  <TableRow key={l._id} className="group">
                    <TableCell className="font-medium">
                      <Link
                        to={`/dashboard/licenses/${l._id}`}
                        className="flex items-center gap-1 transition-colors hover:text-primary"
                      >
                        {l.name}
                        <ChevronRight className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {l.licenseNumber}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {l.authority}
                    </TableCell>
                    <TableCell>{fmtDate(l.renewalDate)}</TableCell>
                    <TableCell>
                      <StatusBadge status={licenseStatus(l.renewalDate)} />
                    </TableCell>
                    <TableCell />
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <p className="mt-3 text-xs text-muted-foreground">
        Renewals within the next 90 days are flagged as expiring soon.
        Today is {toISODate(new Date())}.
      </p>
    </AppShell>
  );
}
