import { useCallback, useEffect, useRef, useState } from "react"

import { getErrorMessage } from "@/lib/api/client"

interface ResourceState<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  setData: React.Dispatch<React.SetStateAction<T | null>>
}

/**
 * Generic data-fetching hook with loading + error state and manual refetch.
 * Keeps the latest fetcher in a ref so callers can pass inline closures
 * without retriggering the effect (pass `deps` to control refetching).
 */
export function useResource<T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = []
): ResourceState<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetcherRef.current()
      setData(result)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { data, loading, error, refetch, setData }
}
