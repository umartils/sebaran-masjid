"use client";

import Image from "next/image";
import Link from "next/link";

import { ChevronLeft, ChevronRight, LogIn, LogOut, User } from "lucide-react";

import { useEffect, useState } from "react";

import { signOut, useSession } from "next-auth/react";
import { Navbar } from "./navbar/navbar";
import { useToast } from "@/hooks/useToast";
import { useMobileOverlay } from "@/context/MobileOverlayContext";

export function SideBar({ children }: { children: React.ReactNode }) {
  const { isSidebarOpen, setIsSidebarOpen } = useMobileOverlay();
  
  const { data: session, status } = useSession();

  const isLoggedIn = status === "authenticated";

  const username = session?.user?.name ?? session?.user?.email ?? "Relawan";
  const userRole = session?.user?.role ?? "Relawan";

  // const [collapsed, setCollapsed] = useState(false);
  const collapsed = !isSidebarOpen;

  const { toast, showToast } = useToast();

  // useEffect(() => {
  //   if (window.innerWidth <= 900) {
  //     setCollapsed(true);
  //   }
  // }, []);

  async function handleLogout() {
    sessionStorage.setItem("logoutSuccess", "true");

    await signOut({
      callbackUrl: "/",
    });
  }

  useEffect(() => {
    const logoutSuccess = sessionStorage.getItem("logoutSuccess");

    if (logoutSuccess === "true") {
      showToast("Berhasil keluar", "success");
      sessionStorage.removeItem("logoutSuccess");
    }
  }, []);

  return (
    <div className="app-shell">
      <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <button
          className="sidebar-toggle"
          type="button"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
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

            <span className="brand-text">Se-IMaN</span>
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
            <Link className="login-button" href={`/login?redirect=/`}>
              <LogIn size={18} />

              <span>Login Relawan</span>
            </Link>
          )}
        </div>
      </aside>

      <main className={`content ${collapsed ? "expanded" : ""}`}>
        {children}
      </main>

      {toast.show && (
        <div
          className={`custom-toast ${
            toast.type === "success"
              ? "custom-toast--success"
              : "custom-toast--error"
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
