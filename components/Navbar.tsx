"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, List } from "lucide-react";

const navLinks = [
  { href: "/", label: "Submissions", icon: List },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

export const Navbar = () => {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-700/60 bg-slate-950/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full"
          />
          <span className="text-xl font-bold tracking-wider text-slate-100">
            Codeforces<span className="text-indigo-400">Monitor</span>
          </span>
        </Link>
        <nav className="flex items-center gap-2 rounded-full bg-slate-900/50 border border-slate-700/60 p-1 shadow-lg">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link href={href} key={href}>
                <span className={cn("flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors", isActive ? "bg-indigo-600 text-white shadow-md" : "text-slate-300 hover:bg-slate-800/50")}>
                  <Icon size={16} />
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};