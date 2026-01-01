"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { ArrowLeft, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const isLanding = pathname === "/";
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="flex h-16 items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-lg opacity-75 group-hover:opacity-100 blur transition duration-300"></div>
            <div className="relative bg-background px-3 py-1.5 rounded-lg border border-primary/20">
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                ExpenseWise
              </span>
            </div>
          </div>
        </Link>

        {isLanding && (
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="#about"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              About
            </Link>
          </nav>
        )}

        <div className="flex items-center space-x-2">
          {isLanding ? (
            <>
              <Link href="/login">
                <Button variant="ghost" className="sm:inline-flex">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
                  Get Started
                </Button>
              </Link>
            </>
          ) : isAuthPage ? (
            <Link href="/">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          ) : isAuthenticated ? (
            <>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50">
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">{user?.name}</span>
              </div>
              <Button variant="outline" className="gap-2" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}
