export type Role = "ADMIN" | "STAFF" | "STUDENT"
export type ContentType = "PDF" | "VIDEO" | "TEXT"

export interface AuthUser {
  id: string
  name: string
  email: string
  role: Role
  schoolId?: string
  gradeId?: string | null
  classId?: string | null
}

export interface Grade {
  id: string
  name: string
  schoolId: string
  classes?: ClassSection[]
}

export interface ClassSection {
  id: string
  name: string
  gradeId: string
  grade?: Grade
}

export interface Student {
  id: string
  name: string
  email: string
  role: Role
  schoolId: string
  gradeId?: string | null
  classId?: string | null
  createdAt: string
  grade?: Grade | null
  class?: ClassSection | null
}

export interface Folder {
  id: string
  name: string
  parentId?: string | null
  schoolId: string
  gradeId?: string | null
  classId?: string | null
  createdById: string
  createdAt: string
  grade?: Grade | null
  class?: ClassSection | null
  parent?: Folder | null
  children?: Folder[]
  contents?: Content[]
  createdBy?: { id: string; name: string; email: string }
}

export interface Content {
  id: string
  title: string
  description?: string | null
  type: ContentType
  filePath?: string | null
  textContent?: string | null
  published: boolean
  publishedAt?: string | null
  folderId: string
  uploadedById: string
  createdAt: string
  folder?: Folder
  uploadedBy?: { id: string; name: string; email: string }
}

export interface Activity {
  id: string
  type: string
  title: string
  description: string
  metadata?: string | null
  userId: string
  schoolId: string
  createdAt: string
  user?: { id: string; name: string; email: string }
}

/* ------------------------------ Envelopes -------------------------------- */

export interface ApiList<T> {
  success: boolean
  count?: number
  total?: number
  data: T[]
}

export interface ApiItem<T> {
  success: boolean
  message?: string
  data: T
}

export interface ApiMessage {
  success: boolean
  message: string
}

export interface AuthResponse {
  success: boolean
  message: string
  token: string
  user: AuthUser
}
