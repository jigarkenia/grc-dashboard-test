import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  FileCheck2,
  LayoutDashboard,
  LogOut,
  ReceiptText,
  ScrollText,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import type { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, end: true },
  {
    to: "/dashboard/licenses",
    label: "Licenses & Registrations",
    icon: FileCheck2,
    end: false,
  },
  {
    to: "/dashboard/wages",
    label: "Wage Updates",
    icon: TrendingUp,
    end: false,
  },
  {
    to: "/dashboard/filings",
    label: "Challans & Returns",
    icon: ReceiptText,
    end: false,
  },
  {
    to: "/dashboard/report",
    label: "Compliance Report",
    icon: ScrollText,
    end: false,
  },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar lg:flex print:hidden">
        <div className="flex items-center gap-2.5 px-5 pt-6 pb-4">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-card">
            <ShieldCheck className="size-5" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-tight">ComplianceAge</p>
            <p className="text-xs text-muted-foreground">GRC Workspace</p>
          </div>
        </div>

        <nav className="mt-3 flex flex-1 flex-col gap-1 px-3">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-sidebar-accent-foreground hover:bg-sidebar-accent",
                )
              }
            >
              <Icon className="size-4 shrink-0" />
              <span className="truncate">{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-sidebar-border p-4">
          <div className="mb-3 flex items-center gap-3 px-1">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold uppercase text-secondary-foreground">
              {(user?.name || user?.email || "U").charAt(0)}
            </div>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-xs font-medium">
                {user?.name || "Team member"}
              </p>
              <p className="truncate text-[11px] text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2"
            onClick={handleSignOut}
          >
            <LogOut className="size-3.5" />
            Sign out
          </Button>
        </div>
      </aside>

      {/* Top bar (mobile) */}
      <div className="fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b bg-background/95 px-4 py-3 backdrop-blur lg:hidden print:hidden">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ShieldCheck className="size-4" />
          </div>
          <span className="text-sm font-semibold tracking-tight">
            ComplianceAge
          </span>
        </div>
        <Button variant="ghost" size="sm" onClick={handleSignOut}>
          <LogOut className="size-4" />
        </Button>
      </div>

      {/* Mobile nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex items-stretch justify-around border-t bg-background/95 backdrop-blur lg:hidden print:hidden">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-0.5 px-1 py-2 text-[10px] font-medium",
                isActive ? "text-primary" : "text-muted-foreground",
              )
            }
          >
            <Icon className="size-4" />
            <span className="max-w-16 truncate">{label.split(" ")[0]}</span>
          </NavLink>
        ))}
      </nav>

      {/* Content */}
      <main className="min-w-0 flex-1 px-4 pb-24 pt-16 sm:px-6 lg:pb-12 lg:pl-72 lg:pr-8 lg:pt-10">
        {children}
      </main>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
