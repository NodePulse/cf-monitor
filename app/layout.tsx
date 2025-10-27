import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CF Monitor",
  description: "Track and analyze Codeforces submissions beautifully.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 dark:bg-slate-950`}
      >
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            {/* Sidebar */}
            <Sidebar className="hidden lg:block w-64 border-r border-slate-200 dark:border-slate-800">
              <AppSidebar />
            </Sidebar>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
              {/* Mobile Sidebar Trigger */}
              <header className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between lg:hidden bg-slate-100 dark:bg-slate-900">
                <SidebarTrigger />
                <h1 className="font-semibold text-slate-900 dark:text-slate-100">
                  CF Monitor
                </h1>
              </header>

              <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto">
                {children}
              </main>
            </div>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
