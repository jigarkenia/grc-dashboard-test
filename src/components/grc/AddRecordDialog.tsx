import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";

export interface FieldDef<T> {
  name: keyof T & string;
  label: string;
  type?: "text" | "date" | "number" | "select";
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
}

/**
 * Generic add-record dialog driven by a field definition list.
 * Values are collected as strings; number fields are parsed before submit.
 */
export function AddRecordDialog<T extends Record<string, unknown>>({
  title,
  description,
  fields,
  submitLabel = "Add record",
  onSubmit,
  trigger,
}: {
  title: string;
  description: string;
  fields: FieldDef<T>[];
  submitLabel?: string;
  onSubmit: (values: T) => Promise<unknown>;
  trigger?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const initial: Record<string, string> = {};
  for (const f of fields) initial[f.name] = "";
  const [values, setValues] = useState<Record<string, string>>(initial);
  const [error, setError] = useState<string | null>(null);

  const setValue = (name: string, v: string) =>
    setValues((prev) => ({ ...prev, [name]: v }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    for (const f of fields) {
      if (f.required && !values[f.name]?.trim()) {
        setError(`Please fill in "${f.label}".`);
        return;
      }
    }

    const payload: Record<string, unknown> = {};
    for (const f of fields) {
      const raw = values[f.name]?.trim();
      if (!raw && f.type !== "number") continue;
      if (f.type === "number") {
        if (!raw) continue;
        const num = Number(raw);
        if (Number.isNaN(num)) {
          setError(`"${f.label}" must be a number.`);
          return;
        }
        payload[f.name] = num;
      } else if (raw) {
        payload[f.name] = raw;
      }
    }

    setSaving(true);
    try {
      await onSubmit(payload as T);
      setValues(initial);
      setOpen(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button className="gap-2 shadow-card">
            <Plus className="size-4" />
            Add
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid max-h-[55vh] gap-4 overflow-y-auto pr-1 sm:grid-cols-2">
            {fields.map((f) => (
              <div
                key={f.name}
                className={cn("grid gap-1.5", f.type === "select" ? "" : "")}
              >
                <Label htmlFor={f.name}>
                  {f.label}
                  {f.required ? " *" : ""}
                </Label>
                {f.type === "select" ? (
                  <select
                    id={f.name}
                    value={values[f.name]}
                    onChange={(e) => setValue(f.name, e.target.value)}
                    required={f.required}
                    className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30"
                  >
                    <option value="" disabled>
                      Select…
                    </option>
                    {f.options?.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <Input
                    id={f.name}
                    type={f.type ?? "text"}
                    placeholder={f.placeholder}
                    value={values[f.name]}
                    step={f.type === "number" ? "any" : undefined}
                    onChange={(e) => setValue(f.name, e.target.value)}
                    required={f.required}
                  />
                )}
              </div>
            ))}
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
