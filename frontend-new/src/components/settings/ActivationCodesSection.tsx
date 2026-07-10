import { useState } from "react"
import { Plus, Copy, Trash2, KeyRound } from "lucide-react"

import { SettingsCard } from "@/components/settings/SettingsCard"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { notify } from "@/lib/toast"
import {
  mockActivationCodes,
  type ActivationCode,
  type ActivationStatus,
} from "@/lib/mock/settings"

const statusStyles: Record<ActivationStatus, string> = {
  active: "bg-emerald-50 text-emerald-700",
  used: "bg-slate-100 text-slate-600",
  expired: "bg-rose-50 text-rose-700",
}

const roles = ["Teacher", "Student", "Admin"]

function randomSegment() {
  return Math.random().toString(36).slice(2, 6).toUpperCase()
}

export function ActivationCodesSection() {
  const [codes, setCodes] = useState<ActivationCode[]>(mockActivationCodes)

  const generateCode = () => {
    const newCode: ActivationCode = {
      id: `c_${Date.now()}`,
      code: `SCH-${randomSegment()}-${randomSegment()}`,
      role: roles[codes.length % roles.length],
      status: "active",
      createdAt: new Date().toISOString().slice(0, 10),
    }
    setCodes((prev) => [newCode, ...prev])
    notify.success("Activation code generated", newCode.code)
  }

  const copyCode = (code: string) => {
    navigator.clipboard?.writeText(code)
    notify.success("Copied to clipboard", code)
  }

  const revokeCode = (id: string) => {
    setCodes((prev) => prev.filter((c) => c.id !== id))
    notify.success("Activation code revoked")
  }

  return (
    <SettingsCard
      title="Activation codes"
      description="Generate and manage one-time codes used to onboard teachers and students."
      footer={
        <Button
          type="button"
          onClick={generateCode}
          className="h-10 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
        >
          <Plus className="size-4" />
          Generate code
        </Button>
      }
    >
      {codes.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <KeyRound className="size-6" />
          </div>
          <p className="text-sm text-slate-500">No activation codes yet.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-200 bg-slate-50/80 hover:bg-slate-50/80">
                <TableHead className="px-4 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                  Code
                </TableHead>
                <TableHead className="px-4 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                  Role
                </TableHead>
                <TableHead className="px-4 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                  Status
                </TableHead>
                <TableHead className="px-4 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                  Created
                </TableHead>
                <TableHead className="px-4 text-right text-xs font-semibold tracking-wide text-slate-500 uppercase">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {codes.map((code) => (
                <TableRow key={code.id} className="border-slate-100 hover:bg-slate-50">
                  <TableCell className="px-4 py-3 font-mono text-sm font-medium text-slate-900">
                    {code.code}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-slate-600">{code.role}</TableCell>
                  <TableCell className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex rounded-lg px-2 py-0.5 text-xs font-medium capitalize",
                        statusStyles[code.status]
                      )}
                    >
                      {code.status}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-slate-500">{code.createdAt}</TableCell>
                  <TableCell className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => copyCode(code.code)}
                        aria-label="Copy code"
                        className="inline-flex size-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                      >
                        <Copy className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => revokeCode(code.id)}
                        aria-label="Revoke code"
                        className="inline-flex size-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </SettingsCard>
  )
}
