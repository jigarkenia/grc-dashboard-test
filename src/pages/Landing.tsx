import { motion } from "framer-motion";
import {
  ArrowRight,
  FileCheck2,
  ReceiptText,
  ScrollText,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const FEATURES = [
  {
    icon: FileCheck2,
    title: "Licenses & registrations",
    body: "Every licence and registration in one register, with renewal dates tracked so nothing lapses unnoticed.",
  },
  {
    icon: TrendingUp,
    title: "Minimum wage changes",
    body: "State-wise revisions to minimum wages with effective dates, so payroll always reflects the current rates.",
  },
  {
    icon: ReceiptText,
    title: "Challans & returns",
    body: "Payment challans, receipts and statutory returns organised by due date — filed or pending at a glance.",
  },
  {
    icon: ScrollText,
    title: "Compliance report",
    body: "A consolidated report of your compliance standing, ready to review or share whenever it is needed.",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
};

export default function Landing() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background text-foreground"
    >
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur print:hidden">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-card">
              <ShieldCheck className="size-5" />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold tracking-tight">
                CAS Compliance
              </p>
              <p className="text-xs text-muted-foreground">by ComplianceAge</p>
            </div>
          </div>
          <Button asChild variant="outline" size="sm" className="gap-2">
            <a href="/auth?returnTo=%2Fdashboard">Client sign in</a>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-40 mx-auto h-96 max-w-3xl rounded-full bg-primary/10 blur-3xl"
        />
        <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center px-6 pb-20 pt-24 text-center sm:pt-32">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-card"
          >
            <span className="size-1.5 rounded-full bg-primary" />
            Private compliance workspace for ComplianceAge clients
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.5 }}
            className="max-w-3xl text-balance text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl"
          >
            Your compliance position,{" "}
            <span className="text-primary">at a glance</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.26, duration: 0.5 }}
            className="mt-6 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg"
          >
            CAS Compliance gives every client a private dashboard for their
            licences, registrations, renewal dates, minimum wage changes,
            payment challans and statutory returns — reviewed in minutes, not
            days.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.34, duration: 0.5 }}
            className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
          >
            <Button asChild size="lg" className="h-12 gap-2 px-7 shadow-card-lg">
              <a href="/auth?returnTo=%2Fdashboard">
                Open your dashboard
                <ArrowRight className="size-4" />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 bg-card px-7"
            >
              <a href="https://complianceage.com" target="_blank" rel="noreferrer">
                Visit ComplianceAge
              </a>
            </Button>
          </motion.div>

          {/* Dashboard preview */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42, duration: 0.6 }}
            className="mt-16 w-full max-w-4xl rounded-2xl border border-border/80 bg-card p-5 shadow-card-lg sm:p-8"
          >
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: "Active licences", value: "24", tone: "text-emerald-600" },
                { label: "Renewals due in 90 days", value: "3", tone: "text-amber-600" },
                { label: "Returns filed this quarter", value: "11 / 12", tone: "text-primary" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-border/70 bg-background p-5 text-left"
                >
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {s.label}
                  </p>
                  <p className={`mt-2 text-3xl font-semibold tracking-tight ${s.tone}`}>
                    {s.value}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-xl border border-border/70 bg-background p-5 text-left">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Next renewal</p>
                <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                  Expiring soon
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Shops & Establishment Registration · renews 14 Sep 2026
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border/70 bg-card/50 py-24">
        <div className="mx-auto w-full max-w-6xl px-6">
          <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              What you can track
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Everything statutory, in one quiet place
            </h2>
            <p className="mt-4 text-muted-foreground">
              Version one covers the records that matter most to your business.
              Each item lives on your dashboard with its own detail page — no
              spreadsheets, no email threads.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="rounded-xl border border-border/80 bg-card p-6 shadow-card transition-shadow hover:shadow-card-lg"
              >
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <f.icon className="size-5" />
                </div>
                <h3 className="mt-4 font-semibold tracking-tight">{f.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {f.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="mx-auto w-full max-w-6xl px-6">
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-border/80 bg-card p-10 text-center shadow-card-lg sm:p-14"
          >
            <h2 className="mx-auto max-w-xl text-balance text-3xl font-semibold tracking-tight">
              Ready to review your compliance?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-muted-foreground">
              Sign in with the email your ComplianceAge engagement is registered
              under and your dashboard will be waiting.
            </p>
            <Button asChild size="lg" className="mt-8 h-12 gap-2 px-7 shadow-card">
              <a href="/auth?returnTo=%2Fdashboard">
                Sign in to CAS Compliance
                <ArrowRight className="size-4" />
              </a>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/70 py-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <ShieldCheck className="size-4" />
            </div>
            <span className="text-sm font-semibold tracking-tight">
              CAS Compliance
            </span>
          </div>
          <div className="flex items-center gap-5 text-sm text-muted-foreground">
            <a
              href="https://complianceage.com"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-foreground"
            >
              complianceage.com
            </a>
            <a
              href="https://updates.complianceage.com/"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-foreground"
            >
              Regulatory updates
            </a>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}
