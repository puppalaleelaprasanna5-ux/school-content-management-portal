import { useEffect, useState } from "react";

import api from "../services/api";

export interface ContentItem {
  id: string;
  title: string;
  type: "PDF" | "VIDEO" | "TEXT" | "IMAGE";
  createdAt: string;
  folder?: { name: string; id: string };
  uploadedBy?: { name: string };
  published?: boolean;
}

export interface ClassItem {
  id: string;
  name: string;
  grade?: { id: string; name: string };
  createdAt: string;
}

export interface StudentItem {
  id: string;
  name: string;
  email: string;
  grade?: { id: string; name: string };
  class?: { id: string; name: string };
  createdAt: string;
}

export interface FolderItem {
  id: string;
  name: string;
  grade: { id: string; name: string };
  class: { id: string; name: string };
  createdAt: string;
}

interface ListResponse<T> {
  success: boolean;
  count: number;
  data: T[];
}

export interface DashboardStats {
  classes: number;
  grades: number;
  folders: number;
  content: number;
  students: number;
}

interface DashboardData {
  stats: DashboardStats;
  recentUploads: ContentItem[];
  todayUploads: ContentItem[];
  recentClasses: ClassItem[];
  recentStudents: StudentItem[];
  recentFolders: FolderItem[];
  recentContent: ContentItem[];
  loading: boolean;
}

const emptyStats: DashboardStats = {
  classes: 0,
  grades: 0,
  folders: 0,
  content: 0,
  students: 0,
};

export function useDashboardData(): DashboardData {
  const [stats, setStats] = useState<DashboardStats>(emptyStats);
  const [recentUploads, setRecentUploads] = useState<ContentItem[]>([]);
  const [todayUploads, setTodayUploads] = useState<ContentItem[]>([]);
  const [recentClasses, setRecentClasses] = useState<ClassItem[]>([]);
  const [recentStudents, setRecentStudents] = useState<StudentItem[]>([]);
  const [recentFolders, setRecentFolders] = useState<FolderItem[]>([]);
  const [recentContent, setRecentContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchDashboardData() {
      try {
        const [classesRes, gradesRes, foldersRes, contentRes, studentsRes] =
          await Promise.all([
            api.get<ListResponse<ClassItem>>("/classes"),
            api.get<ListResponse<unknown>>("/grades"),
            api.get<ListResponse<FolderItem>>("/folders"),
            api.get<ListResponse<ContentItem>>("/content"),
            api.get<ListResponse<StudentItem>>("/students"),
          ]);

        if (cancelled) return;

        setStats({
          classes: classesRes.data.count ?? 0,
          grades: gradesRes.data.count ?? 0,
          folders: foldersRes.data.count ?? 0,
          content: contentRes.data.count ?? 0,
          students: studentsRes.data.count ?? 0,
        });

        const allContent = contentRes.data.data ?? [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        setRecentUploads(allContent.slice(0, 5));
        setTodayUploads(allContent.filter(item => new Date(item.createdAt) >= today).slice(0, 5));
        setRecentClasses((classesRes.data.data ?? []).slice(0, 5));
        setRecentStudents((studentsRes.data.data ?? []).slice(0, 5));
        setRecentFolders((foldersRes.data.data ?? []).slice(0, 5));
        setRecentContent(allContent.slice(0, 8));
      } catch {
        if (!cancelled) {
          setStats(emptyStats);
          setRecentUploads([]);
          setTodayUploads([]);
          setRecentClasses([]);
          setRecentStudents([]);
          setRecentFolders([]);
          setRecentContent([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchDashboardData();

    return () => {
      cancelled = true;
    };
  }, []);

  return { 
    stats, 
    recentUploads, 
    todayUploads,
    recentClasses,
    recentStudents,
    recentFolders,
    recentContent,
    loading 
  };
}
