"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Receipt,
  PieChart,
  Settings,
  Users,
  TrendingUp,
} from "lucide-react";

interface SidebarProps {
  userRole?: "admin" | "user";
}

export default function Sidebar({ userRole = "user" }: SidebarProps) {
  const pathname = usePathname();

  const userNavItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/expenses", label: "Expenses", icon: Receipt },
    { href: "/analytics", label: "Analytics", icon: PieChart },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  const adminNavItems = [
    { href: "/dashboard/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/admin/users", label: "Users", icon: Users },
    { href: "/dashboard/admin/analytics", label: "Analytics", icon: TrendingUp },
    { href: "/dashboard/admin/settings", label: "Settings", icon: Settings },
  ];

  const navItems = userRole === "admin" ? adminNavItems : userNavItems;

  return (
    <aside className="w-64 border-r border-border/40 bg-card/30 backdrop-blur min-h-screen sticky top-16 overflow-y-auto">
      <div className="p-6 space-y-1">
        <div className="mb-6">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            {userRole === "admin" ? "Admin Panel" : "Navigation"}
          </h2>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-primary/20 to-accent/20 text-primary border-l-2 border-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {userRole === "admin" && (
          <div className="mt-8 pt-8 border-t border-border/40">
            <div className="px-3 py-2 rounded-lg bg-primary/10 border border-primary/20">
              <p className="text-xs font-medium text-primary">Admin Access</p>
              <p className="text-xs text-muted-foreground mt-1">
                Full system control
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
