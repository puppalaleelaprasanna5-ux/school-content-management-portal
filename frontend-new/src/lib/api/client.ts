import axios from "axios"

export const TOKEN_KEY = "scms_token"

/** Base URL of the existing Express backend (override with VITE_API_URL). */
const BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ??
  "https://school-content-management-portal.onrender.com/api"

export const api = axios.create({ baseURL: BASE_URL })

// Attach the bearer token to every request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
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
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      localStorage.getItem(TOKEN_KEY)
    ) {
      localStorage.removeItem(TOKEN_KEY)
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
