import Link from "next/link";
import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#1e293b,#0b1120)]">
      <header className="border-b border-border/60 bg-background/70 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Project Pulse AI
          </Link>
          <nav className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/">Dashboard</Link>
            <Link href="/form">Update Form</Link>
            <Link href="/about">About</Link>
          </nav>
        </div>
      </header>
      <main className="container py-8">{children}</main>
    </div>
  );
}
