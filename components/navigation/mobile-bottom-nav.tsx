"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Compass,
  Trophy,
  User,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/components/auth/auth-context";

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();
  const { user } = useAuth();

  // Only render on dashboard / app scope
  const isAppScope =
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/classes/") ||
    pathname?.startsWith("/profile");

  // Don't render inside the coding arena (learn page needs full-screen workspace)
  const isLearnPage = pathname?.includes("/learn/");

  if (!isAppScope || isLearnPage || !user) {
    return null;
  }

  const isWorkspace = pathname === "/dashboard";
  const isClasses = pathname === "/dashboard/classes" || pathname?.startsWith("/dashboard/classes");
  const isProfile = pathname === "/profile";

  const navItems = [
    {
      label: "Workspace",
      href: "/dashboard",
      icon: <LayoutGrid className="w-5 h-5" />,
      active: isWorkspace,
    },
    {
      label: "Silabus",
      href: "/dashboard/classes",
      icon: <Compass className="w-5 h-5" />,
      active: isClasses,
    },
    {
      label: "Peringkat",
      href: "/dashboard#leaderboard",
      icon: <Trophy className="w-5 h-5" />,
      active: false,
    },
    {
      label: "Profil",
      href: "/profile",
      icon: user?.avatar_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={user.avatar_url}
          alt="Avatar"
          className="w-5 h-5 rounded-full object-cover border border-on-surface"
        />
      ) : (
        <User className="w-5 h-5" />
      ),
      active: isProfile,
    },
  ];

  return (
    <aside
      aria-label="Navigasi Bawah Mobile"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t-3 border-slate-900 shadow-[0_-4px_16px_rgba(15,23,42,0.08)] px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
    >
      <nav className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1.5 px-3.5 rounded-2xl transition-all cursor-pointer ${
                item.active
                  ? "bg-[#FEF08A] text-slate-900 font-display font-black shadow-[0_2px_0_#0f172a] border-2 border-slate-900 -translate-y-0.5"
                  : "text-slate-600 hover:text-slate-900 font-bold opacity-80 hover:opacity-100"
              }`}
            >
              <div className="relative">
                {item.icon}
                {item.active && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#EF4444] border border-slate-900" />
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5 leading-tight">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
