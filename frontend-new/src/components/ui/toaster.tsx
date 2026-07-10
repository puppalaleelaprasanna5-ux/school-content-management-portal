import { Toaster as SonnerToaster } from "sonner"

/**
 * App-wide toast host. Mount once near the app root.
 * Styling is aligned with the SaaS theme (rounded, soft shadow).
 */
export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      offset={20}
      gap={10}
      duration={3500}
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "!rounded-2xl !border !border-slate-200 !bg-white !text-slate-900 !shadow-lg !shadow-slate-950/5 !gap-2.5",
          title: "!text-sm !font-semibold",
          description: "!text-slate-500",
          success: "!text-emerald-600",
          error: "!text-rose-600",
          actionButton: "!rounded-lg !bg-indigo-600 !text-white",
          cancelButton: "!rounded-lg !bg-slate-100 !text-slate-600",
          closeButton:
            "!rounded-lg !border-slate-200 !bg-white !text-slate-500 hover:!text-slate-900",
        },
      }}
    />
  )
}
