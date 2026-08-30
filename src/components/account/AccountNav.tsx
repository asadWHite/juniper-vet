"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Calendar, Heart, LogOut, PawPrint, Settings, LayoutGrid } from "lucide-react";

const ITEMS = [
  { href: "/account", label: "OVERVIEW", icon: LayoutGrid },
  { href: "/account/pets", label: "MY PETS", icon: PawPrint },
  { href: "/account/appointments", label: "APPOINTMENTS", icon: Calendar },
  { href: "/account/favorites", label: "SAVED DOCTORS", icon: Heart },
  { href: "/account/settings", label: "SETTINGS", icon: Settings },
];

export function AccountNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function logout() {
    setBusy(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <nav aria-label="Account" className="flex flex-col gap-1">
      {ITEMS.map((item) => {
        const on = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={on ? "page" : undefined}
            className={`flex items-center gap-3.5 border px-4 py-3.5 text-[11px] font-extrabold tracking-[0.16em] transition-all ${
              on ? "border-ink bg-ink text-cream" : "border-line hover:border-ink"
            }`}
          >
            <Icon size={15} strokeWidth={1.75} aria-hidden />
            {item.label}
          </Link>
        );
      })}
      <button
        type="button"
        onClick={logout}
        disabled={busy}
        className="mt-2 flex items-center gap-3.5 border border-line px-4 py-3.5 text-[11px] font-extrabold tracking-[0.16em] text-stone transition-all hover:border-alert hover:text-alert"
      >
        <LogOut size={15} strokeWidth={1.75} aria-hidden />
        {busy ? "SIGNING OUT…" : "SIGN OUT"}
      </button>
    </nav>
  );
}
