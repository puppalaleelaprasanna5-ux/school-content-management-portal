import axios from "axios"

export const TOKEN_KEY = "scms_token"
/** Separate storage slot for the student portal so it never collides with the
 *  admin session (which uses TOKEN_KEY). */
export const STUDENT_TOKEN_KEY = "scms_student_token"

/**
 * Which token slot the current request should use. The student portal lives
 * under `/student/*`; everything else is the admin app. Keeping them in
 * separate slots means a logged-in admin can never leak into a student view
 * (and vice versa) even within the same browser.
 */
export function activeTokenKey(): string {
  if (
    typeof window !== "undefined" &&
    window.location.pathname.startsWith("/student")
  ) {
    return STUDENT_TOKEN_KEY
  }
  return TOKEN_KEY
}

/** Base URL of the existing Express backend (override with VITE_API_URL). */
const BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ??
  "https://school-content-management-portal.onrender.com/api"

export const api = axios.create({ baseURL: BASE_URL })

/**
 * Origin of the backend server without the `/api` suffix. Uploaded files are
 * served as static assets from `/uploads`, which sits at the server root
 * rather than under the API prefix.
 */
export const SERVER_ORIGIN = BASE_URL.replace(/\/api\/?$/, "")

/**
 * Builds an absolute URL for a file stored by the backend (e.g. a `filePath`
 * like `uploads/pdfs/123.pdf`). Normalises Windows-style backslashes and any
 * leading slash so the path joins cleanly onto the server origin.
 */
export function fileUrl(filePath: string): string {
  const normalized = filePath.replace(/\\/g, "/").replace(/^\/+/, "")
  return `${SERVER_ORIGIN}/${normalized}`
}

// Attach the bearer token to every request (student or admin slot by route).
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(activeTokenKey())
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Global 401 handling: if a stored session becomes invalid, clear it and
// let the app react (ProtectedRoute redirects to /login).
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const key = activeTokenKey()
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      localStorage.getItem(key)
    ) {
      localStorage.removeItem(key)
      window.dispatchEvent(new Event("auth:logout"))
    }
    return Promise.reject(error)
  }
)

/** Extracts a human-readable message from an API/network error. */
export function getErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again."
): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined
    if (data?.message) return data.message
    if (error.code === "ERR_NETWORK") {
      return "Cannot reach the server. Is the backend running?"
    }
    return error.message || fallback
  }
  if (error instanceof Error) return error.message
  return fallback
}
