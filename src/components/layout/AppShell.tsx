"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useSession } from "@/features/auth/SessionProvider";
import { cn } from "@/lib/format";
import { workspaceMode, workspaceNavigation } from "@/lib/workspace-access";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { session, logout } = useSession();
  const [profileOpen, setProfileOpen] = useState(false);
  const pathname = usePathname();
  if (!session) return null;

  const mode = workspaceMode(session.memberships);
  const navigation = workspaceNavigation(session.memberships);

  return (
    <div className="min-h-screen bg-canvas md:grid md:grid-cols-[240px_1fr]">
      <aside className="hidden border-r border-line bg-surface px-4 py-5 md:flex md:flex-col">
        <Link href="/beranda" className="flex items-center gap-2.5 px-2 text-[16px] font-bold text-ink-900">
          <span className="grid h-8 w-8 place-items-center rounded-[8px] bg-teal-700 text-[11px] text-white" aria-hidden>SM</span>
          SimuMarket AI
        </Link>
        <nav className="mt-9 space-y-1" aria-label="Navigasi utama">
          {navigation.map((item) => (
            <NavItem key={item.href} {...item} active={pathname === item.href || (item.href !== "/beranda" && pathname.startsWith(`${item.href}/`))} />
          ))}
        </nav>
        <p className="mt-auto px-2 text-[11px] leading-relaxed text-ink-400">
          Hasil sistem bersifat pendukung keputusan, bukan jaminan keberhasilan usaha.
        </p>
      </aside>

      <div className="min-w-0 pb-20 md:pb-0">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-line bg-surface/95 px-5 backdrop-blur md:px-8">
          <p className="text-[13px] font-semibold text-ink-500">
            {mode === "owner" ? "Ruang kerja pemilik" : mode === "cashier" ? "Ruang kerja kasir" : "Siapkan ruang kerja"}
          </p>
          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen((open) => !open)}
              aria-expanded={profileOpen}
              className="flex items-center gap-3 rounded-[10px] border border-line bg-surface px-3 py-2 text-left hover:bg-surface-2"
            >
              <span className="grid h-7 w-7 place-items-center rounded-full bg-teal-50 text-[11px] font-bold text-teal-700" aria-hidden>
                {session.user.display_name.slice(0, 1).toUpperCase()}
              </span>
              <span className="hidden sm:block">
                <span className="block text-[12px] font-semibold text-ink-900">{session.user.display_name}</span>
                <span className="block text-[10px] text-ink-500">{mode === "owner" ? "Pemilik" : mode === "cashier" ? "Kasir" : "Akun baru"}</span>
              </span>
            </button>
            {profileOpen ? (
              <div className="absolute right-0 mt-2 w-64 rounded-[12px] border border-line bg-surface p-3">
                <p className="truncate text-[12px] text-ink-500">{session.user.email}</p>
                <p className="mt-2 text-[12px] leading-relaxed text-ink-700">
                  Hak akses mengikuti peran pada masing-masing usaha.
                </p>
                <Button className="mt-3 w-full" variant="secondary" onClick={() => void logout()}>
                  Keluar
                </Button>
              </div>
            ) : null}
          </div>
        </header>
        <main className="mx-auto w-full max-w-[1180px] px-5 py-7 md:px-8 md:py-9">{children}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-line bg-surface md:hidden" aria-label="Navigasi utama seluler">
        {navigation.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex min-h-16 flex-1 items-center justify-center px-2 text-center text-[11px] font-semibold",
              pathname === item.href ? "text-teal-700" : "text-ink-500",
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

function NavItem({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "block rounded-[9px] px-3 py-2.5 text-[13px] font-semibold transition-colors",
        active ? "bg-teal-50 text-teal-700" : "text-ink-500 hover:bg-surface-2 hover:text-ink-900",
      )}
    >
      {label}
    </Link>
  );
}
