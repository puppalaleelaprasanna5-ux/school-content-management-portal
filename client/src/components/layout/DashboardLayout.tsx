import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import clsx from "clsx";

import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";
import CommandPalette from "../ui/CommandPalette";
import { useAuth } from "../../context/AuthContext";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/classes": "Classes",
  "/dashboard/grades": "Grades",
  "/dashboard/folders": "Folders",
  "/dashboard/content": "Content",
  "/dashboard/students": "Students",
  "/dashboard/activity": "Activity",
  "/dashboard/settings": "Settings",
};

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const pageTitle = pageTitles[location.pathname] ?? "Dashboard";

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Keyboard shortcut for command palette (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      if (e.key === "Escape" && isCommandPaletteOpen) {
        setIsCommandPaletteOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isCommandPaletteOpen]);

  function handleLogout() {
    logout();
    navigate("/", { replace: true });
  }

  return (
    <div
      className={clsx(
        "min-h-screen w-full bg-slate-50 md:grid",
        collapsed
          ? "md:grid-cols-[76px_minmax(0,1fr)]"
          : "md:grid-cols-[248px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)]"
      )}
    >
      <Sidebar
        mobileOpen={mobileOpen}
        collapsed={collapsed}
        onCloseMobile={() => setMobileOpen(false)}
        onToggleCollapse={() => setCollapsed((v) => !v)}
        onLogout={handleLogout}
      />

      <div className="flex min-h-screen min-w-0 flex-col">
        <TopNavbar
          onOpenMobileSidebar={() => setMobileOpen(true)}
          title={pageTitle}
          onLogout={handleLogout}
        />

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </div>
  );
}
