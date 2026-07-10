import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AddButtonProps {
  label?: string
  onClick?: () => void
  className?: string
}

export function AddButton({ label = "Add", onClick, className }: AddButtonProps) {
  return (
    <Button
      onClick={onClick}
      className={cn(
        "h-10 rounded-xl bg-indigo-600 px-4 text-white hover:bg-indigo-700",
        className
      )}
    >
      <Plus className="size-4" />
      {label}
    </Button>
  )
}
