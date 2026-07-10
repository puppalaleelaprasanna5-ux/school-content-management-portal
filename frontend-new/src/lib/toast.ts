import { toast } from "sonner"

/** Re-export the raw sonner API for advanced use. */
export { toast }

/** Convenience helpers with consistent copy across management pages. */
export const notify = {
  success: (message: string, description?: string) =>
    toast.success(message, { description }),
  error: (message: string, description?: string) =>
    toast.error(message, { description }),
  info: (message: string, description?: string) =>
    toast(message, { description }),
  /** Common CRUD outcomes. */
  created: (entity: string) => toast.success(`${entity} created`),
  updated: (entity: string) => toast.success(`${entity} updated`),
  deleted: (entity: string) => toast.success(`${entity} deleted`),
}
