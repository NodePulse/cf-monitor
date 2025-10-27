"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Calendar,
  LayoutDashboard,
  List,
  Monitor,
  LogOut,
  CoinsIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Submissions", icon: List },
  { href: "/stats", label: "Stats", icon: BarChart3 },
  { href: "/calender", label: "Calendar", icon: Calendar },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/points", label: "Points", icon: CoinsIcon },
];

const SidebarLink = ({
  href,
  label,
  icon: Icon,
  current,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  current: boolean;
}) => (
  <Link
    href={href}
    className={cn(
      "flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all hover:translate-x-1 hover:bg-indigo-100 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-300",
      current
        ? "bg-indigo-200 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 shadow-inner"
        : "text-slate-700 dark:text-slate-300"
    )}
  >
    <Icon className="size-5" />
    {label}
  </Link>
);

const AppSidebar = () => {
  const pathname = usePathname();

  return (
    <div className="flex h-full max-h-screen flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-slate-200 dark:border-slate-800 px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Monitor className="size-6 text-indigo-600 dark:text-indigo-400" />
          <span className="text-lg">CF Monitor</span>
        </Link>
      </div>

      {/* Nav Links */}
      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
        {navLinks.map(({ href, label, icon }) => (
          <SidebarLink
            key={href}
            href={href}
            label={label}
            icon={icon}
            current={pathname === href}
          />
        ))}
      </div>

      {/* User Footer */}
      <div className="mt-auto border-t border-slate-200 dark:border-slate-800 p-4">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-100/60 dark:bg-slate-800/60 backdrop-blur-md hover:shadow-md transition-all">
          <Avatar className="size-10 border-2 border-indigo-500">
            <AvatarImage
              src="https://github.com/sachin-bh123.png"
              alt="@sachin_bh123"
            />
            <AvatarFallback>SB</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">Sachin</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              sachin.bh@example.com
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppSidebar;
