import { useNavigate } from "react-router-dom"
import { Mail, Phone, Building2, ShieldCheck, KeyRound, Pencil } from "lucide-react"

import { PageHeader } from "@/components/crud"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/context/AuthContext"
import type { Role } from "@/lib/api/types"

// Placeholders — the backend user record doesn't expose these fields.
const PLACEHOLDER_SCHOOL = "MLR Institute School"
const PLACEHOLDER_PHONE = "+91 98765 43210"

const roleLabels: Record<Role, string> = {
  ADMIN: "School Administrator",
  STAFF: "Staff Member",
  STUDENT: "Student",
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export function ProfilePage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const name = user?.name ?? "School Admin"
  const email = user?.email ?? "admin@school.com"
  const role = user?.role ?? "ADMIN"
  const roleLabel = roleLabels[role]

  const details = [
    { icon: Mail, label: "Email", value: email },
    { icon: ShieldCheck, label: "Role", value: roleLabel },
    { icon: Building2, label: "School", value: PLACEHOLDER_SCHOOL },
    { icon: Phone, label: "Phone", value: PLACEHOLDER_PHONE },
  ]

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-4 sm:px-6 lg:px-8">
      <PageHeader
        title="My Profile"
        description="View your account details and manage your profile."
      />

      {/* Identity card */}
      <Card className="rounded-xl border-0 shadow-sm ring-1 ring-slate-200/70">
        <CardContent className="flex flex-col items-center gap-5 py-8 text-center sm:flex-row sm:items-center sm:gap-6 sm:py-6 sm:text-left">
          <Avatar className="size-20 shrink-0 ring-4 ring-white shadow-sm">
            <AvatarImage src={undefined} alt={name} />
            <AvatarFallback className="bg-indigo-100 text-2xl font-semibold text-indigo-700">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <h2 className="text-xl font-semibold tracking-tight text-slate-900">
              {name}
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">{email}</p>
            <Badge className="mt-2 rounded-lg bg-indigo-50 text-indigo-700">
              <ShieldCheck className="size-3" />
              {roleLabel}
            </Badge>
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Button
              variant="outline"
              className="h-10 rounded-xl"
              onClick={() => navigate("/settings")}
            >
              <KeyRound className="size-4" />
              Change Password
            </Button>
            <Button
              className="h-10 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
              onClick={() => navigate("/settings")}
            >
              <Pencil className="size-4" />
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Details card */}
      <Card className="rounded-xl border-0 shadow-sm ring-1 ring-slate-200/70">
        <CardHeader className="border-b [.border-b]:pb-4">
          <CardTitle className="text-base font-semibold text-slate-900">
            Account details
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <dl className="divide-y divide-slate-100">
            {details.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                  <item.icon className="size-[18px]" />
                </span>
                <div className="min-w-0">
                  <dt className="text-xs font-medium tracking-wide text-slate-400 uppercase">
                    {item.label}
                  </dt>
                  <dd className="truncate text-sm font-medium text-slate-900">
                    {item.value}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProfilePage
