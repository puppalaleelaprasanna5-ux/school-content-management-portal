import { ListFilter, ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export interface FilterOption {
  label: string
  value: string
}

export interface FilterConfig {
  key: string
  label: string
  /** First option is treated as the "all / no filter" default. */
  options: FilterOption[]
}

interface FiltersProps {
  filters: FilterConfig[]
  /** Current value per filter key. */
  values: Record<string, string>
  onChange: (key: string, value: string) => void
}

export function Filters({ filters, values, onChange }: FiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.map((filter) => {
        const current = values[filter.key] ?? filter.options[0]?.value
        const selected = filter.options.find((o) => o.value === current)
        const isDefault = current === filter.options[0]?.value

        return (
          <DropdownMenu key={filter.key}>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="outline"
                  className="h-10 rounded-xl border-slate-200 px-3 text-slate-700"
                />
              }
            >
              <ListFilter className="size-4 text-slate-400" />
              <span className="text-sm">
                {filter.label}
                {!isDefault && selected && (
                  <span className="ml-1 font-medium text-indigo-600">
                    · {selected.label}
                  </span>
                )}
              </span>
              <ChevronDown className="size-4 text-slate-400" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48 rounded-xl">
              <DropdownMenuLabel>{filter.label}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={current}
                onValueChange={(value) => onChange(filter.key, value)}
              >
                {filter.options.map((option) => (
                  <DropdownMenuRadioItem
                    key={option.value}
                    value={option.value}
                    className="rounded-lg"
                  >
                    {option.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      })}
    </div>
  )
}
