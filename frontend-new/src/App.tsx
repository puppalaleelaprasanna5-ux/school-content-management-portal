import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom"

import { AuthProvider } from "@/context/AuthContext"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { DashboardPage } from "@/pages/dashboard/DashboardPage"
import { GradesPage } from "@/pages/manage/GradesPage"
import { ClassesPage } from "@/pages/manage/ClassesPage"
import { StudentsPage } from "@/pages/manage/StudentsPage"
import { FoldersPage } from "@/pages/manage/FoldersPage"
import { ContentPage } from "@/pages/manage/ContentPage"
import { SettingsPage } from "@/pages/settings/SettingsPage"
import { ProfilePage } from "@/pages/profile/ProfilePage"
import { LoginPage } from "@/pages/auth/LoginPage"
import { ActivatePage } from "@/pages/auth/ActivatePage"
import { ForgotPassword } from "@/pages/auth/ForgotPassword"
import { Toaster } from "@/components/ui/toaster"

// Student portal pages (default exports)
import { StudentLayout } from "@/components/layout/StudentLayout"
import StudentLogin from "@/pages/student/Login"
import StudentDashboard from "@/pages/student/Dashboard"
import FolderBrowser from "@/pages/student/FolderBrowser"
import ContentViewer from "@/pages/student/ContentViewer"

/** Authenticated app shell — sidebar + navbar + routed page content. */
function ProtectedLayout() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </ProtectedRoute>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/activate" element={<ActivatePage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Student portal — login is standalone; the rest share StudentLayout */}
          <Route path="/student/login" element={<StudentLogin />} />
          <Route element={<StudentLayout />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/folder/:id" element={<FolderBrowser />} />
            <Route path="/student/content/:id" element={<ContentViewer />} />
          </Route>

          {/* Protected (admin) */}
          <Route element={<ProtectedLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/grades" element={<GradesPage />} />
            <Route path="/classes" element={<ClassesPage />} />
            <Route path="/students" element={<StudentsPage />} />
            <Route path="/folders" element={<FoldersPage />} />
            <Route path="/content" element={<ContentPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Catch-all — MUST stay last so it never overrides the routes above */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
