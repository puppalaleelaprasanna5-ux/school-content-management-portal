import { Routes, Route } from "react-router-dom";

import LoginPage from "./pages/auth/LoginPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";
import DashboardPage from "./pages/dashboard/DashboardPage";
import PlaceholderPage from "./pages/dashboard/PlaceholderPage";
import ClassesPage from "./pages/classes/ClassesPage";
import GradesPage from "./pages/grades/GradesPage";
import FoldersPage from "./pages/folders/FoldersPage";

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
        <Route
          path="folders"
          element={
            <PlaceholderPage
              title="Folders"
              description="Folder management will be built in the next feature."
            />
          }
        />
        <Route
          path="content"
          element={
            <PlaceholderPage
              title="Content"
              description="Content management will be built in the next feature."
            />
          }
        />
      </Route>
    </Routes>
  );
}
