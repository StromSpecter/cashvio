import { NavLink, useNavigate } from "react-router";
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
  CircleDollarSign,
  CircleUser,
  Lock,
} from "lucide-react";
import { useAuth } from "../../lib/auth-context.js";
import alurkaskuLogo from "../../../public/alurkasku.svg";

const buildNavSections = (isPremium) => {
  const investments = {
    label: "Investments",
    items: [
      { to: "/dashboard/investments", label: "Investments", icon: BarChart3 },
      { to: "/dashboard/portfolio", label: "Portfolio", icon: PieChart },
    ],
  };

  if (!isPremium) {
    investments.items = investments.items.map((item) => ({
      ...item,
      locked: true,
    }));
  }

  return [
    {
      label: "Overview",
      items: [
        { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
        {
          to: "/dashboard/transactions",
          label: "Transactions",
          icon: ArrowDownToLine,
        },
        { to: "/dashboard/transfers", label: "Transfers", icon: ArrowLeftRight },
        { to: "/dashboard/cash", label: "Cash", icon: CircleDollarSign },
        { to: "/dashboard/wallets", label: "Wallets", icon: Wallet },
        { to: "/dashboard/cards", label: "Cards", icon: CreditCard },
      ],
    },
    investments,
    {
      label: "Analytics",
      items: [
        { to: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
        { to: "/dashboard/reports", label: "Reports", icon: PieChart },
      ],
    },
    {
      label: "Account",
      items: [
        { to: "/dashboard/profile", label: "Profile", icon: CircleUser },
        { to: "/dashboard/customers", label: "Customers", icon: Users },
        { to: "/dashboard/settings", label: "Settings", icon: Settings },
        { to: "/dashboard/help", label: "Help", icon: CircleHelp },
      ],
    },
  ];
};

export function DashboardSidebar() {
    const { logout, isPremium } = useAuth()
    const navigate = useNavigate()
  const navSections = buildNavSections(isPremium)
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b border-border px-6">
        <NavLink
          to="/dashboard"
          className="flex items-center gap-2 text-lg font-semibold tracking-tight"
        >
          <div className="w-5 h-5 flex items-center justify-center">
            <img src={alurkaskuLogo} alt="Alurkasku" className="w-full h-full" />
          </div>
          Alurkasku
        </NavLink>
      </div>

      <nav className="flex-1 space-y-4 overflow-y-auto p-4">
        {navSections.map((section) => (
          <div key={section.label} className="space-y-1">
            <div className="flex items-center justify-between px-3 py-1.5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {section.label}
              </p>
            </div>
            {section.items.map((item) =>
              item.locked ? (
                <button
                  key={item.to}
                  type="button"
                  onClick={() => navigate("/dashboard/settings")}
                  className="flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground opacity-60 transition-colors hover:bg-accent hover:opacity-100"
                  title="Upgrade ke Premium untuk mengakses"
                >
                  <item.icon className="size-4 shrink-0" />
                  {item.label}
                  <Lock className="ml-auto size-3.5 shrink-0" />
                </button>
              ) : (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end || item.to === "/dashboard"}
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
              )
            )}
          </div>
        ))}
      </nav>

      <div className="border-t border-border p-4">
        <button
          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          onClick={logout}
        >
          <LogOut className="size-4" />
          Log out
        </button>
      </div>
    </div>
  );
}