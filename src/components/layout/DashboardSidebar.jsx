import { NavLink } from "react-router";
import { cn } from "../../lib/utils.js";
import {
  LayoutDashboard,
  Wallet,
  ArrowDownToLine,
  ArrowLeftRight,
  CreditCard,
  PieChart,
  BarChart3,
  Users,
  Settings,
  CircleHelp,
  LogOut,
} from "lucide-react";

const navSections = [
  {
    label: "Overview",
    items: [
      { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      {
        to: "/dashboard/transactions",
        label: "Transactions",
        icon: ArrowDownToLine,
      },
      { to: "/dashboard/transfers", label: "Transfers", icon: ArrowLeftRight },
      { to: "/dashboard/wallets", label: "Wallets", icon: Wallet },
      { to: "/dashboard/cards", label: "Cards", icon: CreditCard },
    ],
  },
  {
    label: "Analytics",
    items: [
      { to: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
      { to: "/dashboard/reports", label: "Reports", icon: PieChart },
      {
        to: "/dashboard/budget",
        label: "Budgeting",
        icon: PieChart,
      },
    ],
  },
  {
    label: "Account",
    items: [
      { to: "/dashboard/customers", label: "Customers", icon: Users },
      { to: "/dashboard/settings", label: "Settings", icon: Settings },
      { to: "/dashboard/help", label: "Help", icon: CircleHelp },
    ],
  },
];

export function DashboardSidebar() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b border-border px-6">
        <NavLink
          to="/dashboard"
          className="flex items-center gap-2 text-lg font-semibold tracking-tight"
        >
          <Wallet className="size-5" />
          Cashvio
        </NavLink>
      </div>

      <nav className="flex-1 space-y-4 overflow-y-auto p-4">
        {navSections.map((section) => (
          <div key={section.label} className="space-y-1">
            <p className="px-3 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {section.label}
            </p>
            {section.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/dashboard"}
                className={({ isActive }) =>
                  cn(
                    "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground font-medium"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  )
                }
              >
                <item.icon className="size-4 shrink-0" />
                {item.label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="border-t border-border p-4">
        <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
          <LogOut className="size-4" />
          Log out
        </button>
      </div>
    </div>
  );
}
