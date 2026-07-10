import { Link } from "react-router-dom"
import {
  GraduationCap,
  Layers,
  UploadCloud,
  FolderPlus,
  Users,
  type LucideIcon,
} from "lucide-react"

import { Card } from "@/components/ui/card"

interface QuickAction {
  key: string
  label: string
  description: string
  icon: LucideIcon
  to: string
}

const quickActions: QuickAction[] = [
  { key: "grade", label: "Create Grade", description: "Add a grade level", icon: Layers, to: "/grades" },
  { key: "class", label: "Create Class", description: "Add a class section", icon: GraduationCap, to: "/classes" },
  { key: "upload", label: "Upload Content", description: "Add new material", icon: UploadCloud, to: "/content" },
  { key: "folder", label: "Create Folder", description: "Organize content", icon: FolderPlus, to: "/folders" },
  { key: "student", label: "Add Student", description: "Register a new student", icon: Users, to: "/students" },
]

export function QuickActions() {
  return (
    <Card className="h-fit gap-0 rounded-2xl border-0 p-5 shadow-sm ring-1 ring-slate-200/70">
      <h3 className="text-base font-semibold text-slate-900">Quick actions</h3>
      <p className="mt-0.5 text-sm text-slate-500">Jump back into your work</p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {quickActions.map((action) => (
          <Link
            key={action.key}
            to={action.to}
            className="group flex flex-col gap-2 rounded-xl border border-slate-200/80 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50/40 hover:shadow-sm"
          >
            <span className="flex size-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
              <action.icon className="size-[18px]" />
            </span>
            <span className="text-sm font-medium text-slate-900">{action.label}</span>
            <span className="text-xs text-slate-400">{action.description}</span>
          </Link>
        ))}
      </div>
    </Card>
  )
}
