"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { dashboardSeed, type DashboardNavItem } from "@/demo/data/dashboard";
import { useDemoFlow } from "@/demo/DemoFlowProvider";

function BrandMark() {
  return (
    <span className="grid size-8 place-items-center rounded-[10px] bg-teal-700 text-surface" aria-hidden>
      <svg viewBox="0 0 24 24" className="size-5" fill="none">
        <path d="m5 15 4-4 3 3 7-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 6h3v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function NavIcon({ icon }: { icon: DashboardNavItem["icon"] }) {
  const paths = {
    home: <><path d="m3 10 9-7 9 7" /><path d="M5 9v11h14V9M9 20v-6h6v6" /></>,
    analysis: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4M8 12l2-2 2 2 3-4" /></>,
    history: <><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5M12 7v5l3 2" /></>,
    transaction: <><path d="M4 7h16M4 12h16M4 17h10" /><path d="m17 15 3 2-3 2" /></>,
    chart: <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></>,
    product: <><path d="m4 7 8-4 8 4-8 4-8-4Z" /><path d="m4 7 8 4 8-4v10l-8 4-8-4V7Z" /></>,
    education: <><path d="m3 6 9-3 9 3-9 3-9-3Z" /><path d="M6 8v6c3 2 9 2 12 0V8M21 6v7" /></>,
    report: <><path d="M6 3h9l4 4v14H6V3Z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></>,
  } satisfies Record<DashboardNavItem["icon"], React.ReactNode>;

  return <svg viewBox="0 0 24 24" className="size-[17px]" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>{paths[icon]}</svg>;
}

export function RoleSwitcher({ align = "left" }: { align?: "left" | "right" }) {
  const [open, setOpen] = useState(false);
  const { demoRole, cashierBusinessId, activateOwnerMode, activateCashierMode } = useDemoFlow();
  const cashierBusiness = dashboardSeed.businesses.find((business) => business.id === cashierBusinessId);

  return (
    <div className="relative">
      <button type="button" aria-expanded={open} onClick={() => setOpen((value) => !value)} className="flex w-full items-center gap-3 rounded-[10px] px-2 py-2 text-left hover:bg-surface-2">
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-teal-700 text-[11px] font-bold text-surface">{dashboardSeed.user.initials}</span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[12px] font-bold text-ink-900">{dashboardSeed.user.name} Pratama</span>
          <span className="block truncate text-[10.5px] text-ink-400">{demoRole === "owner" ? "Akun demo pemilik" : `Kasir · ${cashierBusiness?.name ?? "Satu usaha"}`}</span>
        </span>
        <span aria-hidden className="text-[10px] text-ink-400">⌃</span>
      </button>
      {open ? (
        <div className={cn("absolute z-50 w-[270px] rounded-[12px] border border-line bg-surface p-2", align === "right" ? "right-0 top-[calc(100%+8px)]" : "bottom-[calc(100%+8px)] left-0")}>
          <p className="px-2 py-1.5 text-[9.5px] font-bold uppercase tracking-[0.12em] text-ink-400">Ganti mode demo</p>
          <button type="button" onClick={() => { activateOwnerMode(); setOpen(false); }} className="flex w-full items-start gap-3 rounded-[8px] px-2 py-2.5 text-left hover:bg-surface-2">
            <span className="mt-0.5 text-teal-700" aria-hidden>{demoRole === "owner" ? "●" : "○"}</span>
            <span><span className="block text-[12px] font-bold text-ink-900">Pemilik</span><span className="mt-0.5 block text-[10.5px] leading-4 text-ink-400">Semua usaha, analisis, produk, analitik, dan laporan.</span></span>
          </button>
          {dashboardSeed.businesses.map((business) => {
            const selected = demoRole === "cashier" && cashierBusinessId === business.id;
            return <button key={business.id} type="button" onClick={() => { activateCashierMode(business.id); setOpen(false); }} className="flex w-full items-start gap-3 rounded-[8px] px-2 py-2.5 text-left hover:bg-surface-2"><span className="mt-0.5 text-teal-700" aria-hidden>{selected ? "●" : "○"}</span><span><span className="block text-[12px] font-bold text-ink-900">Kasir · {business.name}</span><span className="mt-0.5 block text-[10.5px] leading-4 text-ink-400">Hanya dashboard toko dan pencatatan transaksi.</span></span></button>;
          })}
          <p className="mx-2 mt-1 border-t border-line pt-2 text-[9.5px] leading-4 text-ink-400">Pergantian ini hanya simulasi tampilan. Otorisasi sebenarnya tetap harus ditegakkan backend.</p>
        </div>
      ) : null}
    </div>
  );
}

function cn(...values: Array<string | false>) {
  return values.filter(Boolean).join(" ");
}

function Sidebar() {
  const pathname = usePathname();
  const { demoRole } = useDemoFlow();
  const navigation = demoRole === "cashier"
    ? [
        { label: "Utama", items: [dashboardSeed.navigation[0].items[0]] },
        { label: "Operasional", items: [{ label: "Catat Transaksi", href: "/demo/transaksi/catat", icon: "transaction" as const }] },
      ]
    : dashboardSeed.navigation;

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[248px] flex-col border-r border-line bg-surface lg:flex">
      <div className="flex h-16 items-center gap-3 border-b border-line px-5">
        <BrandMark />
        <div><p className="text-[15px] font-bold tracking-tight text-ink-900">SimuMarket AI</p><p className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ink-400">Decision support</p></div>
      </div>
      <nav aria-label="Navigasi utama" className="flex-1 overflow-y-auto px-3 py-4">
        {navigation.map((group) => (
          <div key={group.label} className="mb-5">
            <p className="mb-1.5 px-2 text-[10px] font-bold uppercase tracking-[0.14em] text-ink-400">{group.label}</p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = pathname === item.href || (item.href !== "/demo/dashboard" && pathname.startsWith(`${item.href}/`));
                const badge = "badge" in item ? item.badge : undefined;
                return (
                  <Link key={item.label} href={item.href} aria-current={active ? "page" : undefined} className={`group flex h-9 items-center gap-3 rounded-[8px] px-2.5 text-[12.5px] font-semibold transition-colors ${active ? "bg-teal-50 text-teal-700" : "text-ink-500 hover:bg-surface-2 hover:text-ink-900"}`}>
                    <NavIcon icon={item.icon} /><span>{item.label}</span>
                    {badge ? <span className="ml-auto min-w-5 rounded-full bg-surface-2 px-1.5 py-0.5 text-center text-[10px] font-bold text-ink-400">{badge}</span> : null}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="border-t border-line p-3"><RoleSwitcher /></div>
    </aside>
  );
}

function MobileNav() {
  const pathname = usePathname();
  const { demoRole } = useDemoFlow();
  const items: DashboardNavItem[] = demoRole === "cashier"
    ? [dashboardSeed.navigation[0].items[0], { label: "Catat", href: "/demo/transaksi/catat", icon: "transaction" }]
    : [dashboardSeed.navigation[0].items[0], dashboardSeed.navigation[1].items[0], dashboardSeed.navigation[2].items[0], dashboardSeed.navigation[2].items[1]];
  return <nav aria-label="Navigasi seluler" className={cn("fixed inset-x-0 bottom-0 z-50 grid h-[68px] border-t border-line bg-surface/95 px-2 backdrop-blur lg:hidden", demoRole === "cashier" ? "grid-cols-2" : "grid-cols-4")}>{items.map((item) => { const active = pathname === item.href; return <Link key={item.label} href={item.href} aria-current={active ? "page" : undefined} className={`flex min-w-0 flex-col items-center justify-center gap-1 text-[10px] font-semibold ${active ? "text-teal-700" : "text-ink-400"}`}><NavIcon icon={item.icon} /><span className="truncate">{item.label === "Market Analysis" ? "Analisis" : item.label}</span></Link>; })}</nav>;
}

function Topbar() {
  const { demoRole } = useDemoFlow();
  return <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-surface/95 px-4 backdrop-blur sm:px-6 xl:px-8"><div className="flex items-center gap-2 lg:hidden"><BrandMark /><span className="hidden text-[14px] font-bold text-ink-900 sm:block">SimuMarket AI</span></div><label className="relative hidden max-w-[420px] flex-1 md:block"><span className="sr-only">Cari</span><svg viewBox="0 0 24 24" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-400" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg><input type="search" placeholder={demoRole === "cashier" ? "Cari produk..." : "Cari menu atau analisis..."} className="h-9 w-full rounded-[9px] border border-line bg-surface-2 pl-9 pr-3 text-[12px] text-ink-700 placeholder:text-ink-400" /></label><div className="ml-auto flex items-center gap-2"><span className="rounded-full border border-amber-600/30 bg-amber-50 px-2.5 py-1 text-[10px] font-bold tracking-[0.08em] text-amber-600">MODE DEMO</span><div className="w-[190px]"><RoleSwitcher align="right" /></div></div></header>;
}

export function WorkspaceShell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-canvas pb-[68px] lg:pb-0 lg:pl-[248px]"><Sidebar /><div className="min-w-0"><Topbar />{children}</div><MobileNav /></div>;
}
