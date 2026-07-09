import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";
import { useAuth } from "../../context/AuthContext";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/classes": "Classes",
  "/dashboard/grades": "Grades",
  "/dashboard/folders": "Folders",
  "/dashboard/content": "Content",
};

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tabletExpanded, setTabletExpanded] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const pageTitle = pageTitles[location.pathname] ?? "Dashboard";

  useEffect(() => {
    setMobileOpen(false);
    setTabletExpanded(false);
  }, [location.pathname]);

  function handleLogout() {
    logout();
    navigate("/", { replace: true });
  }

  return (
    <div className="min-h-screen w-full bg-slate-100 md:grid md:grid-cols-[72px_minmax(0,1fr)] lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)]">
      <Sidebar
        mobileOpen={mobileOpen}
        tabletExpanded={tabletExpanded}
        onCloseMobile={() => setMobileOpen(false)}
        onToggleTabletExpand={() => setTabletExpanded((prev) => !prev)}
        onLogout={handleLogout}
      />

      <div className="flex min-h-screen min-w-0 flex-col">
        <TopNavbar
          onOpenMobileSidebar={() => setMobileOpen(true)}
          title={pageTitle}
        />

        <main className="flex-1 px-4 py-5 sm:px-5 lg:px-6 lg:py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
