"use client";
import Image from "next/image";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Map,
  PlusCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/", label: "Peta Sebaran", icon: Map },
  { href: "/input", label: "Input Data", icon: PlusCircle },
  { href: "/admin", label: "Dashboard Admin", icon: LayoutDashboard },
];

const sidebarBase =
  "fixed inset-y-0 left-0 z-[500] flex flex-col gap-[25px] border-r border-line bg-white/[0.97] p-[25px] transition-[width,transform] duration-[180ms]";
const sidebarExpanded = "w-[300px] max-md:w-[286px] max-md:translate-x-0";
const sidebarCollapsed =
  "w-[92px] px-5 max-md:w-[286px] max-md:-translate-x-full";
const sidebarToggleBase =
  "absolute right-[-18px] top-[350px] flex h-9 w-9 items-center justify-center rounded-full border-0 bg-brand text-white shadow-[0_10px_24px_rgba(246,163,19,0.3)] max-md:right-[-20px]";
const navItemBase =
  "flex min-h-[50px] items-center gap-4 rounded-lg px-7 text-[17px] font-semibold text-[#65748a] [&_svg]:shrink-0";
const navItemActive =
  "rounded-[15px] bg-brand text-white shadow-[0_10px_20px_rgba(246,163,19,0.24)]";

export function AppFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (window.innerWidth <= 900) {
      setCollapsed(true);
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-soft">
      <aside
        className={`${sidebarBase} ${
          collapsed ? sidebarCollapsed : sidebarExpanded
        }`}
      >
        <button
          className={`${sidebarToggleBase} ${
            collapsed ? "max-md:left-[calc(100%+12px)] max-md:right-auto" : ""
          }`}
          type="button"
          onClick={() => setCollapsed((value) => !value)}
          aria-label={collapsed ? "Tampilkan sidebar" : "Sembunyikan sidebar"}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>

        <Link
          className="flex min-h-12 items-center gap-3.5 text-[30px] font-extrabold text-[#3d424a]"
          href="/"
        >
          <Image
            src="/assets/cropped-logo-masjid-nusantara.png"
            alt="Logo"
            width={50}
            height={50}
          />
          <span className={collapsed ? "hidden" : ""}>SEIMAN</span>
        </Link>

        <nav className="grid gap-2.5" aria-label="Navigasi utama">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                className={`${navItemBase} ${
                  active ? navItemActive : ""
                } ${collapsed ? "justify-center px-0" : ""}`}
                href={item.href}
              >
                <Icon size={26} strokeWidth={3} />
                <span className={collapsed ? "hidden" : ""}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div
          className={`mt-auto border-t border-dashed border-line pt-5 ${
            collapsed ? "hidden" : ""
          }`}
        >
          {pathname === "/" ? (
            <Link
              className="block w-full rounded-[10px] bg-brand px-2.5 py-3.5 text-center text-lg font-semibold text-white"
              href="/input"
            >
              Login Relawan
            </Link>
          ) : (
            <strong>Relawan: </strong>
          )}
        </div>
      </aside>

      <main
        className={`min-h-screen w-full transition-[margin-left] duration-[180ms] max-md:ml-0 ${
          collapsed ? "ml-[92px]" : "ml-[300px]"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
