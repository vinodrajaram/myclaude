"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Phone,
  Layers,
  CheckSquare,
  Settings,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/",        label: "Home",    icon: Home },
  { href: "/calls",   label: "Calls",   icon: Phone },
  { href: "/hive",    label: "Hive",    icon: Layers },
  { href: "/actions", label: "Actions", icon: CheckSquare },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="w-[200px] flex-shrink-0 flex flex-col h-full"
      style={{ background: "var(--surface)", borderRight: "1px solid var(--border)" }}
    >
      {/* Logo */}
      <div
        className="h-[52px] flex items-center gap-2 px-4 flex-shrink-0"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <span
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ background: "var(--accent)" }}
        />
        <span className="font-semibold text-[15px]" style={{ color: "var(--text-1)" }}>
          Beehive
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-2">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-4 py-2 text-[13px] cursor-pointer"
              style={{
                color: active ? "var(--text-1)" : "var(--text-2)",
                background: active ? "var(--accent-dim)" : "transparent",
                borderLeft: `2px solid ${active ? "var(--accent)" : "transparent"}`,
                fontWeight: active ? 500 : 400,
                textDecoration: "none",
              }}
            >
              <Icon size={16} strokeWidth={1.75} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ borderTop: "1px solid var(--border)" }} className="py-2">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-4 py-2 text-[13px]"
          style={{ color: "var(--text-2)", textDecoration: "none" }}
        >
          <Settings size={16} strokeWidth={1.75} />
          Settings
        </Link>
      </div>
    </aside>
  );
}
