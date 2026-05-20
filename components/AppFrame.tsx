"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, ChevronLeft, ChevronRight, LayoutDashboard, Map, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/", label: "Peta Sebaran", icon: Map },
  { href: "/input", label: "Input Data", icon: PlusCircle },
  { href: "/admin", label: "Dashboard Admin", icon: LayoutDashboard }
];

export function AppFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (window.innerWidth <= 900) {
      setCollapsed(true);
    }
  }, []);

  return (
    <div className="app-shell">
      <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <button
          className="sidebar-toggle"
          type="button"
          onClick={() => setCollapsed((value) => !value)}
          aria-label={collapsed ? "Tampilkan sidebar" : "Sembunyikan sidebar"}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>

        <Link className="brand" href="/">
          <Building2 className="brand-icon" strokeWidth={3} />
          <span className="brand-text">MasjidCare</span>
        </Link>

        <nav className="nav" aria-label="Navigasi utama">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

            return (
              <Link key={item.href} className={`nav-item ${active ? "active" : ""}`} href={item.href}>
                <Icon size={26} strokeWidth={3} />
                <span className="nav-label">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          {pathname === "/" ? (
            <Link className="login-button" href="/input">
              Login Relawan
            </Link>
          ) : (
            <strong>Relawan: Ahmad D.</strong>
          )}
        </div>
      </aside>

      <main className={`content ${collapsed ? "expanded" : ""}`}>{children}</main>
    </div>
  );
}
