import { type FormEventHandler, type ReactNode } from "react"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface FormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  /** Form fields — the consumer owns state / validation (e.g. React Hook Form). */
  children: ReactNode
  /** Wire this to `handleSubmit(onValid)` when using React Hook Form. */
  onSubmit: FormEventHandler<HTMLFormElement>
  submitLabel?: string
  cancelLabel?: string
  loading?: boolean
}

export function FormDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  onSubmit,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  loading = false,
}: FormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl">
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>

          <div className="grid gap-4 py-1">{children}</div>

          <DialogFooter className="rounded-b-2xl">
            <DialogClose
              render={
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 rounded-xl"
                  disabled={loading}
                />
              }
            >
              {cancelLabel}
            </DialogClose>
            <Button
              type="submit"
              disabled={loading}
              className="h-10 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
            >
              {loading ? "Saving..." : submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
