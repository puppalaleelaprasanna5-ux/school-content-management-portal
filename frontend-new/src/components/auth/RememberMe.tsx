import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface RememberMeProps {
  id?: string
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

export function RememberMe({
  id = "remember-me",
  checked,
  onCheckedChange,
}: RememberMeProps) {
  return (
    <div className="flex items-center gap-2">
      <Checkbox id={id} checked={checked} onCheckedChange={onCheckedChange} />
      <Label
        htmlFor={id}
        className="cursor-pointer text-sm font-normal text-slate-600"
      >
        Remember me
      </Label>
    </div>
  )
}
