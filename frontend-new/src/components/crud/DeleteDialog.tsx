import { TriangleAlert } from "lucide-react"

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

interface DeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  /** Name of the item being deleted, shown in the default description. */
  itemLabel?: string
  confirmLabel?: string
  loading?: boolean
  onConfirm: () => void
}

export function DeleteDialog({
  open,
  onOpenChange,
  title = "Delete item",
  description,
  itemLabel,
  confirmLabel = "Delete",
  loading = false,
  onConfirm,
}: DeleteDialogProps) {
  const resolvedDescription =
    description ??
    `Are you sure you want to delete ${
      itemLabel ? `“${itemLabel}”` : "this item"
    }? This action cannot be undone.`

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl" showCloseButton={false}>
        <DialogHeader>
          <div className="flex size-11 items-center justify-center rounded-full bg-rose-50 text-rose-600">
            <TriangleAlert className="size-5" />
          </div>
          <DialogTitle className="mt-1">{title}</DialogTitle>
          <DialogDescription>{resolvedDescription}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="rounded-b-2xl">
          <DialogClose
            render={
              <Button variant="outline" className="h-10 rounded-xl" disabled={loading} />
            }
          >
            Cancel
          </DialogClose>
          <Button
            onClick={onConfirm}
            disabled={loading}
            className="h-10 rounded-xl bg-rose-600 text-white hover:bg-rose-700"
          >
            {loading ? "Deleting..." : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
