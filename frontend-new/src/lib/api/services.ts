import { api } from "./client"
import type {
  ApiItem,
  ApiList,
  ApiMessage,
  AuthResponse,
  AuthUser,
  ClassSection,
  Content,
  Folder,
  Grade,
  Student,
  Activity,
} from "./types"

/* --------------------------------- Auth ---------------------------------- */

export interface ActivatePayload {
  schoolName: string
  adminName: string
  email: string
  password: string
  activationCode: string
}

export const authApi = {
  login: (email: string, password: string) =>
    api
      .post<AuthResponse>("/auth/login", { email, password })
      .then((r) => r.data),
  activate: (payload: ActivatePayload) =>
    api.post<AuthResponse>("/auth/activate", payload).then((r) => r.data),
  me: () =>
    api
      .get<{ success: boolean; user: AuthUser }>("/auth/me")
      .then((r) => r.data.user),
}

/* -------------------------------- Grades --------------------------------- */

export const gradesApi = {
  list: () => api.get<ApiList<Grade>>("/grades").then((r) => r.data.data),
  create: (name: string, schoolId: string) =>
    api.post<ApiItem<Grade>>("/grades", { name, schoolId }).then((r) => r.data.data),
  update: (id: string, name: string) =>
    api.put<ApiItem<Grade>>(`/grades/${id}`, { name }).then((r) => r.data.data),
  remove: (id: string) =>
    api.delete<ApiMessage>(`/grades/${id}`).then((r) => r.data),
}

/* -------------------------------- Classes -------------------------------- */

export const classesApi = {
  list: () =>
    api.get<ApiList<ClassSection>>("/classes").then((r) => r.data.data),
  create: (name: string, gradeId: string) =>
    api
      .post<ApiItem<ClassSection>>("/classes", { name, gradeId })
      .then((r) => r.data.data),
  update: (id: string, name: string) =>
    api
      .put<ApiItem<ClassSection>>(`/classes/${id}`, { name })
      .then((r) => r.data.data),
  remove: (id: string) =>
    api.delete<ApiMessage>(`/classes/${id}`).then((r) => r.data),
}

/* ------------------------------- Students -------------------------------- */

export interface StudentCreateInput {
  name: string
  email: string
  password: string
  gradeId?: string
  classId?: string
}

export interface StudentUpdateInput {
  name?: string
  email?: string
  gradeId?: string
  classId?: string
}

export const studentsApi = {
  list: () => api.get<ApiList<Student>>("/students").then((r) => r.data.data),
  create: (input: StudentCreateInput) =>
    api.post<ApiItem<Student>>("/students", input).then((r) => r.data.data),
  update: (id: string, input: StudentUpdateInput) =>
    api.put<ApiItem<Student>>(`/students/${id}`, input).then((r) => r.data.data),
  remove: (id: string) =>
    api.delete<ApiMessage>(`/students/${id}`).then((r) => r.data),
}

/* -------------------------------- Folders -------------------------------- */

export interface FolderCreateInput {
  name: string
  gradeId?: string
  classId?: string
  parentId?: string
}

export const foldersApi = {
  list: () => api.get<ApiList<Folder>>("/folders").then((r) => r.data.data),
  create: (input: FolderCreateInput) =>
    api.post<ApiItem<Folder>>("/folders", input).then((r) => r.data.data),
  update: (id: string, name: string) =>
    api.put<ApiItem<Folder>>(`/folders/${id}`, { name }).then((r) => r.data.data),
  remove: (id: string) =>
    api.delete<ApiMessage>(`/folders/${id}`).then((r) => r.data),
}

/* -------------------------------- Content -------------------------------- */

export const contentApi = {
  list: () => api.get<ApiList<Content>>("/content").then((r) => r.data.data),
  /** Multipart create — the browser sets the boundary automatically. */
  create: (form: FormData) =>
    api.post<ApiItem<Content>>("/content", form).then((r) => r.data.data),
  update: (
    id: string,
    input: { title?: string; description?: string; textContent?: string }
  ) => api.put<ApiItem<Content>>(`/content/${id}`, input).then((r) => r.data.data),
  remove: (id: string) =>
    api.delete<ApiMessage>(`/content/${id}`).then((r) => r.data),
}

/* ------------------------------ Activities ------------------------------- */

export const activitiesApi = {
  recent: (limit = 6) =>
    api
      .get<ApiList<Activity>>(`/activities/recent?limit=${limit}`)
      .then((r) => r.data.data),
}
