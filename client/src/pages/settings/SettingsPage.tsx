import { useState } from "react";
import {
  Shield,
  Bell,
  Lock,
  LogOut,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  Settings2,
  SlidersHorizontal,
} from "lucide-react";
import clsx from "clsx";

import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Badge from "../../components/ui/Badge";
import Select from "../../components/ui/Select";
import PageHeader from "../../components/ui/PageHeader";
import { useAuth } from "../../context/AuthContext";

interface School {
  id: string;
  name: string;
}

interface UserWithSchool {
  id: string;
  name: string;
  email: string;
  role: string;
  school?: School;
  gradeId?: string;
  classId?: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface SchoolSettingsFormData {
  schoolName: string;
  academicYear: string;
  defaultGrade: string;
  timeZone: string;
}

type TabKey = "general" | "security" | "notifications" | "preferences";

const TABS: { key: TabKey; label: string; icon: typeof Shield }[] = [
  { key: "general", label: "General", icon: Settings2 },
  { key: "security", label: "Security", icon: Shield },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "preferences", label: "Preferences", icon: SlidersHorizontal },
];

const fieldLabel = "mb-1.5 block text-sm font-medium text-slate-700";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function SectionCard({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: typeof Shield;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm shadow-slate-200/40 ring-1 ring-slate-200/70">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <Icon size={20} />
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const { user } = useAuth();
  const userWithSchool = user as UserWithSchool | null;

  const [activeTab, setActiveTab] = useState<TabKey>("general");

  // Profile edit modal
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileName, setProfileName] = useState(user?.name || "");
  const [savingProfile, setSavingProfile] = useState(false);

  // Password change
  const [passwordForm, setPasswordForm] = useState<PasswordFormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  // School settings
  const [schoolSettings, setSchoolSettings] = useState<SchoolSettingsFormData>({
    schoolName: userWithSchool?.school?.name || "",
    academicYear: "2024-2025",
    defaultGrade: "",
    timeZone: "UTC",
  });
  const [savingSchoolSettings, setSavingSchoolSettings] = useState(false);

  // Preferences
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [language, setLanguage] = useState("en");
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
  });

  // Toast notification
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveProfile = async () => {
    if (!profileName.trim()) return;

    setSavingProfile(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showToast("success", "Profile updated successfully");
      setIsProfileModalOpen(false);
    } catch {
      showToast("error", "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError("All fields are required");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }

    setChangingPassword(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setPasswordSuccess("Password changed successfully");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      showToast("success", "Password changed successfully");
    } catch {
      setPasswordError("Failed to change password");
      showToast("error", "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  const handleSaveSchoolSettings = async () => {
    setSavingSchoolSettings(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showToast("success", "School settings updated successfully");
    } catch {
      showToast("error", "Failed to update school settings");
    } finally {
      setSavingSchoolSettings(false);
    }
  };

  const handleLogoutAllDevices = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showToast("success", "Logged out from all devices successfully");
    } catch {
      showToast("error", "Failed to logout from all devices");
    }
  };

  const passwordFields: {
    id: string;
    label: string;
    key: keyof PasswordFormData;
    show: keyof typeof showPassword;
  }[] = [
    { id: "current-password", label: "Current Password", key: "currentPassword", show: "current" },
    { id: "new-password", label: "New Password", key: "newPassword", show: "new" },
    { id: "confirm-password", label: "Confirm New Password", key: "confirmPassword", show: "confirm" },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      {/* Toast notification */}
      {toast && (
        <div
          className={clsx(
            "fixed right-4 top-4 z-50 flex items-center gap-3 rounded-xl px-4 py-3 text-white shadow-lg animate-in fade-in slide-in-from-top-2",
            toast.type === "success" ? "bg-emerald-600" : "bg-red-600"
          )}
        >
          {toast.type === "success" ? <Check size={18} /> : <AlertCircle size={18} />}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      <PageHeader title="Settings" subtitle="Manage your account settings and preferences" />

      <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
        {/* Left — profile card */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl bg-white p-6 shadow-sm shadow-slate-200/40 ring-1 ring-slate-200/70">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 text-2xl font-semibold text-white shadow-lg shadow-indigo-500/30">
                {user?.name ? getInitials(user.name) : "?"}
              </div>

              <h3 className="mt-4 text-lg font-semibold text-slate-900">{user?.name || "User"}</h3>
              <p className="mt-0.5 text-sm text-slate-500">{user?.email || ""}</p>

              <div className="mt-3">
                <Badge tone="indigo">
                  <span className="capitalize">{user?.role?.toLowerCase() || "member"}</span>
                </Badge>
              </div>

              {userWithSchool?.school && (
                <div className="mt-5 w-full rounded-xl bg-slate-50 px-4 py-3 text-left ring-1 ring-slate-100">
                  <p className="text-xs font-medium text-slate-500">School</p>
                  <p className="mt-0.5 truncate text-sm font-medium text-slate-900">
                    {userWithSchool.school?.name ?? "Unknown"}
                  </p>
                </div>
              )}

              <Button
                type="button"
                onClick={() => {
                  setProfileName(user?.name || "");
                  setIsProfileModalOpen(true);
                }}
                variant="secondary"
                size="sm"
                className="mt-6 w-full"
              >
                Edit Profile
              </Button>
            </div>
          </div>
        </aside>

        {/* Right — tabs + panels */}
        <div className="space-y-6">
          {/* Tab bar */}
          <div
            role="tablist"
            aria-label="Settings sections"
            className="flex gap-1 overflow-x-auto rounded-2xl bg-white p-1.5 shadow-sm shadow-slate-200/40 ring-1 ring-slate-200/70"
          >
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={activeTab === key}
                onClick={() => setActiveTab(key)}
                className={clsx(
                  "flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200",
                  activeTab === key
                    ? "bg-gradient-to-b from-indigo-500 to-indigo-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <Icon size={16} />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>

          {/* General */}
          {activeTab === "general" && (
            <SectionCard
              icon={Settings2}
              title="School Settings"
              description="Configure school-wide settings"
            >
              <div className="space-y-5">
                <div>
                  <label htmlFor="school-name" className={fieldLabel}>
                    School Name
                  </label>
                  <Input
                    id="school-name"
                    type="text"
                    value={schoolSettings.schoolName}
                    onChange={(e) => setSchoolSettings({ ...schoolSettings, schoolName: e.target.value })}
                    placeholder="Enter school name"
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="academic-year" className={fieldLabel}>
                      Academic Year
                    </label>
                    <Select
                      id="academic-year"
                      value={schoolSettings.academicYear}
                      onChange={(e) => setSchoolSettings({ ...schoolSettings, academicYear: e.target.value })}
                      wrapperClassName="w-full"
                    >
                      <option value="2024-2025">2024-2025</option>
                      <option value="2025-2026">2025-2026</option>
                      <option value="2026-2027">2026-2027</option>
                    </Select>
                  </div>

                  <div>
                    <label htmlFor="default-grade" className={fieldLabel}>
                      Default Grade
                    </label>
                    <Select
                      id="default-grade"
                      value={schoolSettings.defaultGrade}
                      onChange={(e) => setSchoolSettings({ ...schoolSettings, defaultGrade: e.target.value })}
                      wrapperClassName="w-full"
                    >
                      <option value="">Select default grade</option>
                      <option value="grade-1">Grade 1</option>
                      <option value="grade-2">Grade 2</option>
                      <option value="grade-3">Grade 3</option>
                      <option value="grade-4">Grade 4</option>
                      <option value="grade-5">Grade 5</option>
                      <option value="grade-6">Grade 6</option>
                    </Select>
                  </div>
                </div>

                <div>
                  <label htmlFor="timezone" className={fieldLabel}>
                    Time Zone
                  </label>
                  <Select
                    id="timezone"
                    value={schoolSettings.timeZone}
                    onChange={(e) => setSchoolSettings({ ...schoolSettings, timeZone: e.target.value })}
                    wrapperClassName="w-full"
                  >
                    <option value="UTC">UTC (Coordinated Universal Time)</option>
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    <option value="Asia/Kolkata">India Standard Time (IST)</option>
                    <option value="Europe/London">Greenwich Mean Time (GMT)</option>
                  </Select>
                </div>

                <Button
                  type="button"
                  onClick={handleSaveSchoolSettings}
                  loading={savingSchoolSettings}
                  size="sm"
                >
                  Save Changes
                </Button>
              </div>
            </SectionCard>
          )}

          {/* Security */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <SectionCard icon={Lock} title="Password" description="Change your account password">
                <form onSubmit={handlePasswordChange} className="space-y-5">
                  {passwordFields.map(({ id, label, key, show }) => (
                    <div key={id}>
                      <label htmlFor={id} className={fieldLabel}>
                        {label}
                      </label>
                      <div className="relative">
                        <Input
                          id={id}
                          type={showPassword[show] ? "text" : "password"}
                          placeholder={label}
                          value={passwordForm[key]}
                          onChange={(e) => setPasswordForm({ ...passwordForm, [key]: e.target.value })}
                          className="pr-11"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword({ ...showPassword, [show]: !showPassword[show] })}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-indigo-600"
                          aria-label={showPassword[show] ? "Hide password" : "Show password"}
                        >
                          {showPassword[show] ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  ))}

                  {passwordError && (
                    <div className="flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600 ring-1 ring-red-100">
                      <AlertCircle size={16} />
                      {passwordError}
                    </div>
                  )}

                  {passwordSuccess && (
                    <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-600 ring-1 ring-emerald-100">
                      <Check size={16} />
                      {passwordSuccess}
                    </div>
                  )}

                  <Button type="submit" loading={changingPassword} size="sm">
                    Change Password
                  </Button>
                </form>
              </SectionCard>

              <SectionCard icon={Shield} title="Account Security" description="Sessions and account status">
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 ring-1 ring-slate-100">
                    <div>
                      <p className="text-sm font-medium text-slate-900">Account Status</p>
                      <p className="text-xs text-slate-500">Your account is active and secure</p>
                    </div>
                    <Badge tone="emerald" dot>
                      Active
                    </Badge>
                  </div>

                  <div className="rounded-xl bg-slate-50 px-4 py-3 ring-1 ring-slate-100">
                    <p className="text-sm font-medium text-slate-900">Last Login</p>
                    <p className="text-xs text-slate-500">Today at {new Date().toLocaleTimeString()}</p>
                  </div>

                  <div className="rounded-xl bg-slate-50 px-4 py-3 ring-1 ring-slate-100">
                    <p className="text-sm font-medium text-slate-900">Active Sessions</p>
                    <p className="text-xs text-slate-500">1 device currently logged in</p>
                  </div>

                  <Button type="button" onClick={handleLogoutAllDevices} variant="danger" size="sm">
                    <LogOut size={16} />
                    Logout from All Devices
                  </Button>
                </div>
              </SectionCard>
            </div>
          )}

          {/* Notifications */}
          {activeTab === "notifications" && (
            <SectionCard
              icon={Bell}
              title="Notifications"
              description="Choose how you want to be notified"
            >
              <div className="space-y-3">
                {(
                  [
                    { key: "email", label: "Email notifications", desc: "Receive updates in your inbox" },
                    { key: "push", label: "Push notifications", desc: "Get alerts in your browser" },
                    { key: "sms", label: "SMS notifications", desc: "Text messages for critical alerts" },
                  ] as const
                ).map(({ key, label, desc }) => (
                  <label
                    key={key}
                    className="flex cursor-pointer items-center justify-between rounded-xl bg-slate-50 px-4 py-3 ring-1 ring-slate-100 transition-colors hover:bg-slate-100/70"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900">{label}</p>
                      <p className="text-xs text-slate-500">{desc}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications[key]}
                      onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })}
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
                    />
                  </label>
                ))}
              </div>
            </SectionCard>
          )}

          {/* Preferences */}
          {activeTab === "preferences" && (
            <SectionCard
              icon={SlidersHorizontal}
              title="Preferences"
              description="Customize your experience"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="theme" className={fieldLabel}>
                    Theme
                  </label>
                  <Select
                    id="theme"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value as "light" | "dark")}
                    wrapperClassName="w-full"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark (Coming Soon)</option>
                  </Select>
                </div>

                <div>
                  <label htmlFor="language" className={fieldLabel}>
                    Language
                  </label>
                  <Select
                    id="language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    wrapperClassName="w-full"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish (Coming Soon)</option>
                    <option value="fr">French (Coming Soon)</option>
                  </Select>
                </div>
              </div>
            </SectionCard>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        title="Edit Profile"
        size="sm"
        footer={
          <>
            <Button type="button" onClick={() => setIsProfileModalOpen(false)} variant="secondary" size="sm">
              Cancel
            </Button>
            <Button type="button" onClick={handleSaveProfile} loading={savingProfile} size="sm">
              Save Changes
            </Button>
          </>
        }
      >
        <div className="space-y-5">
          <div>
            <label htmlFor="profile-name" className={fieldLabel}>
              Full Name
            </label>
            <Input
              id="profile-name"
              type="text"
              placeholder="Enter your full name"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="profile-email" className={fieldLabel}>
              Email
            </label>
            <Input id="profile-email" type="email" value={user?.email || ""} disabled />
            <p className="mt-1.5 text-xs text-slate-500">Email cannot be changed</p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
