"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, FolderKanban, FileText, LogOut } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase-browser";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/content", label: "Site Content", icon: FileText },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const AUTH_PAGES = ["/admin/login", "/admin/forgot-password", "/admin/reset-password"];
  if (AUTH_PAGES.includes(pathname)) return <>{children}</>;

  async function handleLogout() {
    const supabase = supabaseBrowser();
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className="flex w-60 flex-col justify-between bg-ink-900 p-5 text-white">
        <div>
          <p className="mb-8 px-2 text-sm font-bold">Tactician Admin</p>
          <nav className="flex flex-col gap-1">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    active ? "bg-brand-600 text-white" : "text-white/70 hover:bg-white/10"
                  }`}
                >
                  <Icon size={16} /> {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white/70 hover:bg-white/10"
        >
          <LogOut size={16} /> Log Out
        </button>
      </aside>
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
