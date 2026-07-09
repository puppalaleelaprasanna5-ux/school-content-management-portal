import { useEffect, useState } from "react";

import api from "../services/api";

export interface ContentItem {
  id: string;
  title: string;
  type: "PDF" | "VIDEO" | "TEXT";
  createdAt: string;
  folder?: { name: string };
  uploadedBy?: { name: string };
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
}

interface DashboardData {
  stats: DashboardStats;
  recentUploads: ContentItem[];
  loading: boolean;
}

const emptyStats: DashboardStats = {
  classes: 0,
  grades: 0,
  folders: 0,
  content: 0,
};

export function useDashboardData(): DashboardData {
  const [stats, setStats] = useState<DashboardStats>(emptyStats);
  const [recentUploads, setRecentUploads] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchDashboardData() {
      try {
        const [classesRes, gradesRes, foldersRes, contentRes] =
          await Promise.all([
            api.get<ListResponse<unknown>>("/classes"),
            api.get<ListResponse<unknown>>("/grades"),
            api.get<ListResponse<unknown>>("/folders"),
            api.get<ListResponse<ContentItem>>("/content"),
          ]);

        if (cancelled) return;

        setStats({
          classes: classesRes.data.count ?? 0,
          grades: gradesRes.data.count ?? 0,
          folders: foldersRes.data.count ?? 0,
          content: contentRes.data.count ?? 0,
        });

        setRecentUploads(contentRes.data.data?.slice(0, 5) ?? []);
      } catch {
        if (!cancelled) {
          setStats(emptyStats);
          setRecentUploads([]);
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

  return { stats, recentUploads, loading };
}
