import { Navigate, useLocation } from "react-router-dom"
import { Loader2 } from "lucide-react"

import { useAuth } from "@/context/AuthContext"
import type { Role } from "@/lib/api/types"

/** The admin app shell is for staff/admins only. */
const ADMIN_ROLES: Role[] = ["ADMIN", "STAFF"]

export function ProtectedRoute({
  children,
  roles = ADMIN_ROLES,
}: {
  children: React.ReactNode
  roles?: Role[]
}) {
  const { isAuthenticated, initializing, user } = useAuth()
  const location = useLocation()

  if (initializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="size-6 animate-spin text-indigo-600" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  // Authenticated but wrong role for this area — don't render the admin UI on
  // a non-admin token (that is what caused admin-only requests to 403).
  // Send students to their own portal instead.
  if (user && !roles.includes(user.role)) {
    const fallback = user.role === "STUDENT" ? "/student/dashboard" : "/login"
    return <Navigate to={fallback} replace />
  }

  return <>{children}</>
}
