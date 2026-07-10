import {
  LayoutDashboard,
  FolderOpen,
  FileText,
  GraduationCap,
  Layers,
  Users,
  type LucideIcon,
} from "lucide-react"

export interface NavItem {
  label: string
  to: string
  icon: LucideIcon
}

export interface NavSection {
  title?: string
  items: NavItem[]
}

/**
 * Single source of truth for the sidebar navigation.
 * Add or reorder sections/items here — the Sidebar renders whatever is defined.
 */
export const navigation: NavSection[] = [
  {
    items: [{ label: "Dashboard", to: "/", icon: LayoutDashboard }],
  },
  {
    title: "Content",
    items: [
      { label: "Folders", to: "/folders", icon: FolderOpen },
      { label: "Content", to: "/content", icon: FileText },
    ],
  },
  {
    title: "School",
    items: [
      { label: "Grades", to: "/grades", icon: Layers },
      { label: "Classes", to: "/classes", icon: GraduationCap },
      { label: "Students", to: "/students", icon: Users },
    ],
  },
]
