import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"

import { authApi, classesApi, gradesApi } from "@/lib/api/services"
import type { AuthUser } from "@/lib/api/types"

interface StudentSessionValue {
  student: AuthUser | null
  gradeName: string | null
  className: string | null
  loading: boolean
  error: boolean
}

const StudentSessionContext = createContext<StudentSessionValue | null>(null)

/**
 * Loads the logged-in student once (via the existing `/auth/me`) and resolves
 * their grade/class names from `/grades/:id` and `/classes/:id`, then shares
 * the result with every student page + the sidebar so nothing re-fetches or
 * shows a different identity.
 */
export function StudentSessionProvider({ children }: { children: ReactNode }) {
  const [student, setStudent] = useState<AuthUser | null>(null)
  const [gradeName, setGradeName] = useState<string | null>(null)
  const [className, setClassName] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let active = true

    const load = async () => {
      try {
        const me = await authApi.me()
        if (!active) return
        setStudent(me)

        const [grade, cls] = await Promise.all([
          me.gradeId ? gradesApi.getById(me.gradeId).catch(() => null) : null,
          me.classId ? classesApi.getById(me.classId).catch(() => null) : null,
        ])
        if (!active) return
        setGradeName(grade?.name ?? null)
        setClassName(cls?.name ?? null)
      } catch {
        if (active) setError(true)
      } finally {
        if (active) setLoading(false)
      }
    }

    load()
    return () => {
      active = false
    }
  }, [])

  return (
    <StudentSessionContext.Provider
      value={{ student, gradeName, className, loading, error }}
    >
      {children}
    </StudentSessionContext.Provider>
  )
}

export function useStudentSession() {
  const ctx = useContext(StudentSessionContext)
  if (!ctx) {
    throw new Error(
      "useStudentSession must be used within a StudentSessionProvider"
    )
  }
  return ctx
}

/** First letters of the first two words of a name, e.g. "Leela Prasanna" → "LP". */
export function initialsOf(name?: string | null) {
  if (!name?.trim()) return "?"
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase()
}
