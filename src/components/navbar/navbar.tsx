"use client";

import Link from "next/link";

import {
  ChevronDown,
  ChevronUp,
  LayoutDashboard,
  Map,
  PlusCircle,
  UserRoundCog
} from "lucide-react";

import { usePathname, useRouter } from "next/navigation";

import { useState } from "react";

import { useSession } from "next-auth/react";

const navItems = [
  {
    href: "/",
    label: "Peta Sebaran",
    icon: Map,
    protected: false,
  },

  {
    label: "Input",
    icon: PlusCircle,
    protected: true,
    children: [
      {
        href: "/input/pengajuan",
        label: "Data Pengajuan",
      },
      {
        href: "/input/masjidmn",
        label: "Data Sudah Dibangun",
      },
    ],
  },
  {
    href: "/admin/dashboard/masjid",
    label: "Dashboard Admin",
    icon: LayoutDashboard,
    protected: true,
    adminOnly: true,
  },
  {
    label: "User",
    icon: UserRoundCog,
    protected: true,
    children: [
      {
        href: "/admin/user/list",
        label: "List User",
      },
      {
        href: "/admin/user/form",
        label: "Add User",
      },
    ],
  },
];

interface NavbarProps {
  collapsed: boolean;
}

export function Navbar({
  collapsed,
}: NavbarProps) {
  const pathname = usePathname();

  const router = useRouter();

  const { data: session, status } =
    useSession();

  const isLoggedIn =
    status === "authenticated";

  const userRole =
    session?.user?.role;

  const [openMenus, setOpenMenus] =
    useState<string[]>([]);

  function handleProtectedNav(
    e: React.MouseEvent,
    href: string,
    isProtected: boolean
  ) {
    if (
      isProtected &&
      !isLoggedIn
    ) {
      e.preventDefault();

      router.push(
        `/login?redirect=${href}`
      );
    }
  }

  function toggleMenu(label: string) {
    setOpenMenus((prev) =>
      prev.includes(label)
        ? prev.filter(
            (item) => item !== label
          )
        : [...prev, label]
    );
  }

  // FILTER MENU
  const filteredNavItems =
    navItems.filter((item) => {
      // admin only
      if (
        item.adminOnly &&
        userRole !== "Admin"
      ) {
        return false;
      }

      // protected menu
      if (
        item.protected &&
        !isLoggedIn
      ) {
        return false;
      }

      return true;
    });

  return (
    <nav
      className="nav"
      aria-label="Navigasi utama"
    >
      {filteredNavItems.map(
        (item) => {
          const Icon = item.icon;

          // menu dengan child
          if (item.children) {
            const parentActive =
              item.children.some(
                (child) =>
                  child.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(
                        child.href
                      )
              );

            const isOpen =
              openMenus.includes(
                item.label
              );

            return (
              <div
                key={item.label}
                className="nav-group"
              >
                <button
                  type="button"
                  onClick={() =>
                    toggleMenu(
                      item.label
                    )
                  }
                  className={`nav-item nav-parent ${
                    parentActive
                      ? "active"
                      : ""
                  }`}
                >
                  <Icon
                    size={26}
                    strokeWidth={3}
                  />

                  {!collapsed && (
                    <>
                      <span className="nav-label">
                        {
                          item.label
                        }
                      </span>

                      <span className="nav-expand">
                        {isOpen ? (
                          <ChevronUp
                            size={16}
                          />
                        ) : (
                          <ChevronDown
                            size={16}
                          />
                        )}
                      </span>
                    </>
                  )}
                </button>

                {!collapsed &&
                  isOpen && (
                    <div className="nav-children">
                      {item.children.map(
                        (
                          child
                        ) => {
                          const childActive =
                            child.href ===
                            "/"
                              ? pathname ===
                                "/"
                              : pathname.startsWith(
                                  child.href
                                );

                          return (
                            <Link
                              key={
                                child.href
                              }
                              href={
                                child.href
                              }
                              className={`nav-child ${
                                childActive
                                  ? "active"
                                  : ""
                              }`}
                            >
                              {
                                child.label
                              }
                            </Link>
                          );
                        }
                      )}
                    </div>
                  )}
              </div>
            );
          }

          // menu biasa
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(
                  item.href
                );

          return (
            <Link
              key={item.href}
              className={`nav-item ${
                active
                  ? "active"
                  : ""
              }`}
              href={item.href}
              onClick={(e) =>
                handleProtectedNav(
                  e,
                  item.href,
                  !!item.protected
                )
              }
            >
              <Icon
                size={26}
                strokeWidth={3}
              />

              {!collapsed && (
                <span className="nav-label">
                  {item.label}
                </span>
              )}
            </Link>
          );
        }
      )}
    </nav>
  );
}