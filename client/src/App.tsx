import { Routes, Route } from "react-router-dom";

import LoginPage from "./pages/auth/LoginPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";
import DashboardPage from "./pages/dashboard/DashboardPage";
import ClassesPage from "./pages/classes/ClassesPage";
import GradesPage from "./pages/grades/GradesPage";
import FoldersPage from "./pages/folders/FoldersPage";
import ContentPage from "./pages/content/ContentPage";
import SettingsPage from "./pages/settings/SettingsPage";
import StudentsPage from "./pages/students/StudentsPage";
import ActivityPage from "./pages/activity/ActivityPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="classes" element={<ClassesPage />} />
        <Route path="grades" element={<GradesPage />} />
        <Route path="folders" element={<FoldersPage />} />
        <Route path="content" element={<ContentPage />} />
        <Route path="students" element={<StudentsPage />} />
        <Route path="activity" element={<ActivityPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
