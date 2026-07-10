export interface ProfileData {
  firstName: string
  lastName: string
  email: string
  phone: string
  role: string
  bio: string
}

export const mockProfile: ProfileData = {
  firstName: "Prasanna",
  lastName: "Leela",
  email: "admin@school.edu",
  phone: "+91 98765 43210",
  role: "Administrator",
  bio: "School administrator managing curriculum and content across all grades.",
}

export interface SchoolData {
  name: string
  code: string
  email: string
  phone: string
  website: string
  address: string
  timezone: string
}

export const mockSchool: SchoolData = {
  name: "MLR Institute School",
  code: "MLRIT-2026",
  email: "contact@mlrit.edu",
  phone: "+91 40 1234 5678",
  website: "https://school.mlrit.edu",
  address: "Dundigal, Hyderabad, Telangana 500043",
  timezone: "Asia/Kolkata (GMT+5:30)",
}

export type ActivationStatus = "active" | "used" | "expired"

export interface ActivationCode {
  id: string
  code: string
  role: string
  status: ActivationStatus
  createdAt: string
}

export const mockActivationCodes: ActivationCode[] = [
  { id: "c1", code: "SCH-8F2K-9QX1", role: "Teacher", status: "active", createdAt: "2026-07-02" },
  { id: "c2", code: "SCH-3D7M-2LP8", role: "Teacher", status: "used", createdAt: "2026-06-21" },
  { id: "c3", code: "SCH-1A5B-7RT4", role: "Student", status: "active", createdAt: "2026-07-05" },
  { id: "c4", code: "SCH-9K0C-4WE2", role: "Admin", status: "expired", createdAt: "2026-05-14" },
]

export interface NotificationPref {
  key: string
  title: string
  description: string
  enabled: boolean
}

export const mockNotificationPrefs: NotificationPref[] = [
  {
    key: "content_uploads",
    title: "Content uploads",
    description: "Notify me when new content is uploaded to shared folders.",
    enabled: true,
  },
  {
    key: "new_students",
    title: "New enrollments",
    description: "Get an email when a student enrolls in a class.",
    enabled: true,
  },
  {
    key: "weekly_digest",
    title: "Weekly digest",
    description: "A weekly summary of activity across your school.",
    enabled: false,
  },
  {
    key: "product_updates",
    title: "Product updates",
    description: "News about new features and improvements.",
    enabled: false,
  },
]

export interface SessionInfo {
  id: string
  device: string
  location: string
  lastActive: string
  current: boolean
}

export const mockSessions: SessionInfo[] = [
  {
    id: "s1",
    device: "Chrome · Windows",
    location: "Hyderabad, IN",
    lastActive: "Active now",
    current: true,
  },
  {
    id: "s2",
    device: "Safari · iPhone",
    location: "Hyderabad, IN",
    lastActive: "2 hours ago",
    current: false,
  },
  {
    id: "s3",
    device: "Firefox · macOS",
    location: "Bengaluru, IN",
    lastActive: "Yesterday",
    current: false,
  },
]
