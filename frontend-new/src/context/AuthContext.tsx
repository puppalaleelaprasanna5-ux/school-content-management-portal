import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

import { TOKEN_KEY } from "@/lib/api/client"
import { authApi, type ActivatePayload } from "@/lib/api/services"
import type { AuthUser } from "@/lib/api/types"

interface AuthContextValue {
  user: AuthUser | null
  /** True while the initial session is being restored. */
  initializing: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  activate: (payload: ActivatePayload) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [initializing, setInitializing] = useState(true)

  // Restore session from a stored token on first load.
  useEffect(() => {
    let active = true
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) {
      setInitializing(false)
      return
    }
    authApi
      .me()
      .then((restored) => {
        if (active) setUser(restored)
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY)
      })
      .finally(() => {
        if (active) setInitializing(false)
      })
    return () => {
      active = false
    }
  }, [])

  // React to global 401s emitted by the axios interceptor.
  useEffect(() => {
    const onLogout = () => setUser(null)
    window.addEventListener("auth:logout", onLogout)
    return () => window.removeEventListener("auth:logout", onLogout)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const result = await authApi.login(email, password)
    localStorage.setItem(TOKEN_KEY, result.token)
    setUser(result.user)
  }, [])

  const activate = useCallback(async (payload: ActivatePayload) => {
    const result = await authApi.activate(payload)
    localStorage.setItem(TOKEN_KEY, result.token)
    setUser(result.user)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setUser(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      initializing,
      isAuthenticated: !!user,
      login,
      activate,
      logout,
    }),
    [user, initializing, login, activate, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return ctx
}
