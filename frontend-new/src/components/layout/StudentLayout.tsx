import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { GraduationCap, LayoutDashboard, LogOut } from "lucide-react"

import { STUDENT_TOKEN_KEY } from "@/lib/api/client"
import {
  StudentSessionProvider,
  useStudentSession,
  initialsOf,
} from "@/context/StudentSessionContext"
import { cn } from "@/lib/utils"

/**
 * Shell for the student portal: a persistent left sidebar (brand, Dashboard,
 * student profile + Logout) on desktop and a compact top bar on mobile. The
 * routed page renders through <Outlet />. Used by /student/dashboard,
 * /student/folder/:id and /student/content/:id — login stays outside.
 */
export function StudentLayout() {
  return (
    <StudentSessionProvider>
      <StudentShell />
    </StudentSessionProvider>
  )
}

function StudentShell() {
  const navigate = useNavigate()
  const { student, gradeName } = useStudentSession()

  const handleLogout = () => {
    // Clear the student session (token + any cached student info) and leave.
    localStorage.removeItem(STUDENT_TOKEN_KEY)
    navigate("/student/login", { replace: true })
  }

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
      isActive
        ? "bg-indigo-50 text-indigo-700"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    )

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile top bar */}
      <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 md:hidden">
        <Brand />
        <div className="flex items-center gap-2">
          <Avatar name={student?.name} className="size-8 text-xs" />
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Logout"
            className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-rose-50 hover:text-rose-600"
          >
            <LogOut className="size-5" />
          </button>
        </div>
      </header>

      <div className="md:flex">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white px-4 py-6 md:flex">
          <Brand />

          <nav className="mt-8 flex-1 space-y-1">
            <NavLink to="/student/dashboard" className={navItemClass}>
              <LayoutDashboard className="size-5 shrink-0" />
              Dashboard
            </NavLink>
          </nav>

          {/* Student profile */}
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2.5">
            <Avatar name={student?.name} className="size-9 text-sm" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">
                {student?.name ?? "…"}
              </p>
              <p className="truncate text-xs text-slate-500">
                {gradeName ? `Grade · ${gradeName}` : "Student"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-rose-50 hover:text-rose-600"
          >
            <LogOut className="size-5 shrink-0" />
            Logout
          </button>
        </aside>

        {/* Routed page content + footer */}
        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <main className="flex-1">
            <Outlet />
          </main>
          <footer className="border-t border-slate-200 bg-white px-6 py-4 text-center text-xs text-slate-400">
            School Content Management Portal · Student Portal
          </footer>
        </div>
      </div>
    </div>
  )
}

function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex size-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-600/25">
        <GraduationCap className="size-5" />
      </div>
      <span className="text-sm font-semibold tracking-tight text-slate-900">
        Student Portal
      </span>
    </div>
  )
}

/** Circular initials avatar in the app's indigo accent. */
function Avatar({ name, className }: { name?: string | null; className?: string }) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700",
        className
      )}
    >
      {initialsOf(name)}
    </span>
  )
}

export default StudentLayout
