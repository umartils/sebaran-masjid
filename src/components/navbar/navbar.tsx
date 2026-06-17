"use client";

import Link from "next/link";
import {
  ChevronDown,
  ChevronUp,
  LayoutDashboard,
  Map,
  PlusCircle,
  UserRoundCog,
  History,
  Wrench,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useState, useMemo } from "react";
import { useSession } from "next-auth/react";

// ── tipe ──────────────────────────────────────────────────────────────
interface NavChild {
  href: string;
  label: string;
  adminOnly?: boolean;
}

interface NavItem {
  href?: string;
  label: string;
  icon: React.ElementType;
  protected?: boolean;
  adminOnly?: boolean;
  children?: NavChild[];
}

// ── data statis — taruh DI LUAR komponen agar tidak dibuat ulang tiap render
const navItems: NavItem[] = [
  { href: "/", label: "Peta Sebaran", icon: Map, protected: false },
  {
    label: "Input",
    icon: PlusCircle,
    protected: true,
    children: [
      { href: "/input/pengajuan", label: "Data Pengajuan" },
      { href: "/input/masjidmn", label: "Data Sudah Dibangun" },
    ],
  },
  {
    href: "/history/pengajuan",
    label: "History",
    icon: History,
    protected: true,
  },
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    protected: true,
    adminOnly: true,
    children: [
      { href: "/admin/dashboard/masjid", label: "List Pengajuan" },
      { href: "/admin/dashboard/tracking", label: "List Progres" },
    ],
  },
  {
    label: "User",
    icon: UserRoundCog,
    protected: true,
    adminOnly: true,
    children: [
      { href: "/admin/user/form", label: "Add User" },
      { href: "/admin/user/list", label: "List User" },
    ],
  },
  {
    label: "Tools",
    icon: Wrench,
    protected: true,
    adminOnly: true,
    children: [
      { href: "https://data-clean-ymn.vercel.app/", label: "Data Cleaning" },
      // { href: "/admin/user/list", label: "List User" },
    ],
  },
];

// ── helper ────────────────────────────────────────────────────────────
function isActive(href: string, pathname: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

// ── props ─────────────────────────────────────────────────────────────
interface NavbarProps {
  collapsed: boolean;
}

// ── komponen ──────────────────────────────────────────────────────────
export function Navbar({ collapsed }: NavbarProps) {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const isLoggedIn = status === "authenticated";
  const isAdmin = session?.user?.role === "Admin";

  // Gunakan Record<string, boolean> → tidak perlu spread array tiap toggle
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  function toggleMenu(label: string) {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  }

  // useMemo → filteredNavItems tidak dihitung ulang kecuali isLoggedIn/isAdmin berubah
  const filteredNavItems = useMemo(
    () =>
      navItems.filter((item) => {
        if (item.adminOnly && !isAdmin) return false;
        if (item.protected && !isLoggedIn) return false;
        return true;
      }),
    [isLoggedIn, isAdmin]
  );

  // Jangan render apapun saat session masih loading → cegah layout shift
  if (status === "loading") {
    return <nav aria-label="Navigasi utama" className="nav" />;
  }

  return (
    <nav className="nav" aria-label="Navigasi utama">
      {filteredNavItems.map((item) => {
        const Icon = item.icon;

        // ── menu dengan children ───────────────────────────────────────
        if (item.children) {
          const parentActive = item.children.some((child) =>
            isActive(child.href, pathname)
          );
          const isOpen = !!openMenus[item.label];

          return (
            <div key={item.label} className="nav-group">
              <button
                type="button"
                onClick={() => toggleMenu(item.label)}
                className={`nav-item nav-parent ${
                  parentActive ? "active" : ""
                }`}
                aria-expanded={isOpen}
              >
                <Icon size={26} strokeWidth={3} />
                {!collapsed && (
                  <>
                    <span className="nav-label">{item.label}</span>
                    <span className="nav-expand" aria-hidden>
                      {isOpen ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </span>
                  </>
                )}
              </button>

              {!collapsed && isOpen && (
                <div className="nav-children">
                  {item.children
                    .filter((child) => !(child.adminOnly && !isAdmin))
                    .map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        prefetch={true} // ← prefetch saat hover
                        className={`nav-child ${
                          isActive(child.href, pathname) ? "active" : ""
                        }`}
                      >
                        {child.label}
                      </Link>
                    ))}
                </div>
              )}
            </div>
          );
        }

        // ── menu biasa ────────────────────────────────────────────────
        // Protected route → middleware sudah handle redirect,
        // tidak perlu router.push manual di sini
        return (
          <Link
            key={item.href}
            href={item.href || "/"}
            prefetch={true} // ← prefetch saat hover
            className={`nav-item ${
              isActive(item.href || "", pathname) ? "active" : ""
            }`}
          >
            <Icon size={26} strokeWidth={3} />
            {!collapsed && <span className="nav-label">{item.label}</span>}
          </Link>
        );
      })}
    </nav>
  );
}