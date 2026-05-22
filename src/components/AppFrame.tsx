"use client";

import Image from "next/image";
import Link from "next/link";

import { usePathname, useRouter } from "next/navigation";

import { ChevronLeft, ChevronRight, LogIn, LogOut, User } from "lucide-react";

import { useEffect, useState } from "react";

import { signOut, useSession } from "next-auth/react";
import { Navbar } from "./navbar/index";

export function AppFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const router = useRouter();

  const { data: session, status } = useSession();

  const isLoggedIn = status === "authenticated";

  const username = session?.user?.name ?? session?.user?.email ?? "Relawan";
  const userRole = session?.user?.role ?? "Relawan";

  const [collapsed, setCollapsed] = useState(false);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (window.innerWidth <= 900) {
      setCollapsed(true);
    }
  }, []);

  async function handleLogout() {
    await signOut({
      callbackUrl: "/",
    });
  }

  if (!mounted) {
    return null;
  }

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
        <div className="sidebar-header">
          <Link className="brand" href="/">
            <div className="brand-logo-wrapper">
              <Image
                className="brand-logo"
                src="/assets/cropped-logo-masjid-nusantara.png"
                alt="Logo"
                fill
              />
            </div>

            <span className="brand-text">SEIMAN</span>
          </Link>
        </div>
        <Navbar collapsed={collapsed} />

        <div className="sidebar-footer">
          {isLoggedIn ? (
            <div className="user-info">
              <div className="user-avatar">
                <User size={18} />
              </div>

              <div className="user-details">
                <span className="user-name">{username}</span>

                <span className="user-role">{userRole}</span>
              </div>

              <button
                className="logout-btn"
                onClick={handleLogout}
                title="Keluar"
                aria-label="Keluar"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link
              className="login-button"
              href={`/login?redirect=${pathname === "/" ? "/input" : pathname}`}
            >
              <LogIn size={18} />

              <span>Login Relawan</span>
            </Link>
          )}
        </div>
      </aside>

      <main className={`content ${collapsed ? "expanded" : ""}`}>
        {children}
      </main>
    </div>
  );
}