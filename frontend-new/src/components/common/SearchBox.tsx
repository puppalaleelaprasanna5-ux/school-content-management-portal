import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface SearchBoxProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  className?: string
}

export function SearchBox({
  placeholder = "Search...",
  value,
  onChange,
  className,
}: SearchBoxProps) {
  return (
    <div className={cn("relative w-full max-w-md", className)}>
      <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
      <Input
        type="search"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="h-10 rounded-xl border-slate-200 bg-slate-100/70 pl-10 transition-all focus-visible:bg-white focus-visible:shadow-sm focus-visible:shadow-slate-900/5"
      />
    </div>
  )
}
