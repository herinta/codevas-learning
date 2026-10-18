"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  Layers,
  Activity,
  Plus,
  Trash2,
  Edit,
  Shield,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Search,
  BookOpen,
  ArrowLeft,
  ExternalLink,
  Code2,
  ListOrdered,
  AlertCircle,
  HelpCircle,
  Zap,
  Eye,
  Sliders,
  Play,
  Flame,
  Award,
  Sparkles,
  Lock,
  Globe,
  Compass,
  MousePointerClick,
  Menu,
  X,
  LayoutDashboard,
} from "lucide-react";
import { useAuth } from "@/components/auth/auth-context";

interface AdminStats {
  totalUsers: number;
  onlineUsers: number;
  activeUsersToday: number;
  adminCount: number;
  totalClasses: number;
  liveCodeClasses: number;
  totalChallenges: number;
  totalEnrollments: number;
  totalCompletions: number;
  totalLandingVisits?: number;
  uniqueLandingVisitors?: number;
  landingVisitorsToday?: number;
  landingVisitorsOnline?: number;
}

interface UserItem {
  id: string;
  username: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  xp_points: number;
  streak_days: number;
  last_active_date: string;
  last_seen_at?: string;
  role: "USER" | "ADMIN";
  created_at: string;
}

interface ClassItem {
  id: string;
  category: "LIVE_CODE" | "DRAG_DROP" | "QUIZ";
  title: string;
  tagline: string | null;
  description: string | null;
  difficulty_level: string;
  xp_reward: number;
  estimated_time: string;
  is_published: boolean;
  order_index: number;
  totalChallenges: number;
  totalEnrollments: number;
  totalCompletions: number;
}

interface ChallengeItem {
  id: string;
  class_id: string;
  title: string;
  difficulty: "EASY" | "MEDIUM" | "HARD" | "BOSS_FIGHT";
  order_index: number;
  xp_reward: number;
  instruction: string;
  theory: string | null;
  syntax_helpers: string[];
  hint: string | null;
  locked_template: {
    element?: string;
    itemsCount?: number;
    itemLabels?: string[];
  };
  target_visual: {
    display?: string;
    flexDirection?: string;
    justifyContent?: string;
    alignItems?: string;
    flexWrap?: string;
    gap?: string;
    description?: string;
  };
  initial_state: string;
}

export function AdminDashboardClient() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // Active top navigation tab
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "classes">("overview");

  // Mobile sidebar open state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Selected class for managing levels (null means viewing classes list)
  const [selectedClassForLevels, setSelectedClassForLevels] = useState<ClassItem | null>(null);

  // Category filter for classes management
  const [selectedCategory, setSelectedCategory] = useState<"LIVE_CODE" | "DRAG_DROP" | "QUIZ">("LIVE_CODE");

  // Loading & notification states
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [loadingChallenges, setLoadingChallenges] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Data states
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [challenges, setChallenges] = useState<ChallengeItem[]>([]);

  // Users filter states
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState<string>("");

  // Modals state
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [userFormData, setUserFormData] = useState({
    username: "",
    email: "",
    password: "",
    full_name: "",
    xp_points: 50,
    streak_days: 1,
    role: "USER" as "USER" | "ADMIN",
  });

  const [showClassModal, setShowClassModal] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassItem | null>(null);
  const [classFormData, setClassFormData] = useState({
    id: "",
    category: "LIVE_CODE" as "LIVE_CODE" | "DRAG_DROP" | "QUIZ",
    title: "",
    tagline: "",
    description: "",
    difficulty_level: "Pemula",
    xp_reward: 150,
    estimated_time: "2 Jam",
    is_published: true,
    order_index: 1,
  });

  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<ChallengeItem | null>(null);
  const [challengeFormData, setChallengeFormData] = useState({
    id: "",
    class_id: "",
    title: "",
    difficulty: "EASY" as "EASY" | "MEDIUM" | "HARD" | "BOSS_FIGHT",
    order_index: 1,
    xp_reward: 20,
    instruction: "",
    theory: "",
    syntax_helpers_raw: "display: flex, justify-content: center, align-items: center",
    hint: "",
    initial_state: ".arena {\n  display: flex;\n  /* Tulis CSS di sini */\n}",
    itemsCount: 3,
    itemLabelsRaw: "Permen 1, Permen 2, Permen 3",
    targetDisplay: "flex",
    targetFlexDirection: "row",
    targetJustifyContent: "center",
    targetAlignItems: "center",
    targetFlexWrap: "nowrap",
    targetGap: "16px",
    targetDescription: "Semua elemen sejajar di tengah arena.",
  });

  // Check auth
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/login?redirect=/admin");
      } else if (user.role !== "ADMIN") {
        router.push("/dashboard");
      }
    }
  }, [user, authLoading, router]);

  // Toast auto-clear
  useEffect(() => {
    if (actionMessage) {
      const timer = setTimeout(() => setActionMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [actionMessage]);

  // Fetch Stats
  const fetchStats = useCallback(async () => {
    try {
      setLoadingStats(true);
      const res = await fetch("/api/admin/stats");
      const json = await res.json();
      if (json.success) {
        setStats(json.data);
      }
    } catch (err) {
      console.error("Gagal mengambil stats admin:", err);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  // Fetch Users
  const fetchUsers = useCallback(async () => {
    try {
      setLoadingUsers(true);
      const params = new URLSearchParams();
      if (userSearch.trim()) params.append("search", userSearch.trim());
      if (userRoleFilter) params.append("role", userRoleFilter);

      const res = await fetch(`/api/admin/users?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setUsers(json.data.users || []);
      }
    } catch (err) {
      console.error("Gagal mengambil user:", err);
    } finally {
      setLoadingUsers(false);
    }
  }, [userSearch, userRoleFilter]);

  // Fetch Classes
  const fetchClasses = useCallback(async () => {
    try {
      setLoadingClasses(true);
      const res = await fetch(`/api/admin/classes?category=${selectedCategory}`);
      const json = await res.json();
      if (json.success) {
        setClasses(json.data || []);
      }
    } catch (err) {
      console.error("Gagal mengambil kelas:", err);
    } finally {
      setLoadingClasses(false);
    }
  }, [selectedCategory]);

  // Fetch Challenges for selected class
  const fetchChallenges = useCallback(async (classId: string) => {
    try {
      setLoadingChallenges(true);
      const res = await fetch(`/api/admin/classes/${classId}`);
      const json = await res.json();
      if (json.success && json.data) {
        setChallenges(json.data.challenges || []);
      }
    } catch (err) {
      console.error("Gagal mengambil challenges:", err);
    } finally {
      setLoadingChallenges(false);
    }
  }, []);

  // Load initial data
  useEffect(() => {
    if (user?.role === "ADMIN") {
      fetchStats();
      fetchUsers();
      fetchClasses();
    }
  }, [user, fetchStats, fetchUsers, fetchClasses]);

  // If a class is selected, load its challenges
  useEffect(() => {
    if (selectedClassForLevels) {
      fetchChallenges(selectedClassForLevels.id);
    }
  }, [selectedClassForLevels, fetchChallenges]);

  // Is online helper (< 15 mins)
  const isUserOnline = (lastSeen?: string) => {
    if (!lastSeen) return false;
    const diffMs = Date.now() - new Date(lastSeen).getTime();
    return diffMs < 15 * 60 * 1000;
  };

  // User CRUD Handlers
  const handleOpenUserModal = (u?: UserItem) => {
    if (u) {
      setEditingUser(u);
      setUserFormData({
        username: u.username,
        email: u.email,
        password: "",
        full_name: u.full_name || "",
        xp_points: u.xp_points,
        streak_days: u.streak_days,
        role: u.role,
      });
    } else {
      setEditingUser(null);
      setUserFormData({
        username: "",
        email: "",
        password: "",
        full_name: "",
        xp_points: 50,
        streak_days: 1,
        role: "USER",
      });
    }
    setShowUserModal(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        // Update user
        const res = await fetch(`/api/admin/users/${editingUser.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: userFormData.username,
            email: userFormData.email,
            full_name: userFormData.full_name,
            xp_points: userFormData.xp_points,
            streak_days: userFormData.streak_days,
            role: userFormData.role,
          }),
        });
        const json = await res.json();
        if (json.success) {
          setActionMessage({ type: "success", text: "Data pengguna berhasil diperbarui!" });
          setShowUserModal(false);
          fetchUsers();
          fetchStats();
        } else {
          setActionMessage({ type: "error", text: json.message || "Gagal memperbarui pengguna" });
        }
      } else {
        // Create user
        const res = await fetch(`/api/admin/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userFormData),
        });
        const json = await res.json();
        if (json.success) {
          setActionMessage({ type: "success", text: `User @${json.data.username} berhasil dibuat!` });
          setShowUserModal(false);
          fetchUsers();
          fetchStats();
        } else {
          setActionMessage({ type: "error", text: json.message || "Gagal membuat pengguna" });
        }
      }
    } catch {
      setActionMessage({ type: "error", text: "Terjadi kesalahan jaringan." });
    }
  };

  const handleToggleRole = async (targetUser: UserItem) => {
    if (targetUser.id === user?.id) {
      setActionMessage({ type: "error", text: "Anda tidak dapat mengubah role akun admin Anda sendiri." });
      return;
    }
    const newRole = targetUser.role === "ADMIN" ? "USER" : "ADMIN";
    const confirmMsg = `Ubah role @${targetUser.username} menjadi ${newRole}?`;
    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await fetch(`/api/admin/users/${targetUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      const json = await res.json();
      if (json.success) {
        setActionMessage({ type: "success", text: `Role @${targetUser.username} diubah menjadi ${newRole}!` });
        fetchUsers();
        fetchStats();
      } else {
        setActionMessage({ type: "error", text: json.message });
      }
    } catch {
      setActionMessage({ type: "error", text: "Gagal mengubah role." });
    }
  };

  const handleDeleteUser = async (targetUser: UserItem) => {
    if (targetUser.id === user?.id) {
      setActionMessage({ type: "error", text: "Anda tidak dapat menghapus akun admin Anda sendiri." });
      return;
    }
    if (!window.confirm(`Yakin ingin menghapus permanen pengguna @${targetUser.username}? Seluruh data progres akan dihapus.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${targetUser.id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setActionMessage({ type: "success", text: "Pengguna berhasil dihapus." });
        fetchUsers();
        fetchStats();
      } else {
        setActionMessage({ type: "error", text: json.message });
      }
    } catch {
      setActionMessage({ type: "error", text: "Gagal menghapus pengguna." });
    }
  };

  // Class CRUD Handlers
  const handleOpenClassModal = (c?: ClassItem) => {
    if (c) {
      setEditingClass(c);
      setClassFormData({
        id: c.id,
        category: c.category,
        title: c.title,
        tagline: c.tagline || "",
        description: c.description || "",
        difficulty_level: c.difficulty_level,
        xp_reward: c.xp_reward,
        estimated_time: c.estimated_time,
        is_published: c.is_published,
        order_index: c.order_index,
      });
    } else {
      setEditingClass(null);
      setClassFormData({
        id: "",
        category: selectedCategory,
        title: "",
        tagline: "",
        description: "",
        difficulty_level: "Pemula",
        xp_reward: 150,
        estimated_time: "2 Jam",
        is_published: true,
        order_index: classes.length + 1,
      });
    }
    setShowClassModal(true);
  };

  const handleSaveClass = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingClass) {
        const res = await fetch(`/api/admin/classes/${editingClass.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(classFormData),
        });
        const json = await res.json();
        if (json.success) {
          setActionMessage({ type: "success", text: "Kelas berhasil diperbarui!" });
          setShowClassModal(false);
          fetchClasses();
          fetchStats();
        } else {
          setActionMessage({ type: "error", text: json.message });
        }
      } else {
        const res = await fetch(`/api/admin/classes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(classFormData),
        });
        const json = await res.json();
        if (json.success) {
          setActionMessage({ type: "success", text: `Kelas '${json.data.title}' berhasil dibuat!` });
          setShowClassModal(false);
          fetchClasses();
          fetchStats();
        } else {
          setActionMessage({ type: "error", text: json.message });
        }
      }
    } catch {
      setActionMessage({ type: "error", text: "Gagal menyimpan kelas." });
    }
  };

  const handleDeleteClass = async (c: ClassItem) => {
    if (!window.confirm(`Hapus kelas '${c.title}' beserta seluruh level dan progres siswa di dalamnya?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/classes/${c.id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setActionMessage({ type: "success", text: "Kelas berhasil dihapus." });
        if (selectedClassForLevels?.id === c.id) {
          setSelectedClassForLevels(null);
        }
        fetchClasses();
        fetchStats();
      } else {
        setActionMessage({ type: "error", text: json.message });
      }
    } catch {
      setActionMessage({ type: "error", text: "Gagal menghapus kelas." });
    }
  };

  // Challenge CRUD Handlers (for Live Code)
  const handleOpenChallengeModal = (ch?: ChallengeItem) => {
    if (!selectedClassForLevels) return;

    if (ch) {
      setEditingChallenge(ch);
      setChallengeFormData({
        id: ch.id,
        class_id: ch.class_id,
        title: ch.title,
        difficulty: ch.difficulty,
        order_index: ch.order_index,
        xp_reward: ch.xp_reward,
        instruction: ch.instruction,
        theory: ch.theory || "",
        syntax_helpers_raw: (ch.syntax_helpers || []).join(", "),
        hint: ch.hint || "",
        initial_state: ch.initial_state,
        itemsCount: ch.locked_template?.itemsCount || 3,
        itemLabelsRaw: (ch.locked_template?.itemLabels || ["Permen 1", "Permen 2", "Permen 3"]).join(", "),
        targetDisplay: ch.target_visual?.display || "flex",
        targetFlexDirection: ch.target_visual?.flexDirection || "row",
        targetJustifyContent: ch.target_visual?.justifyContent || "center",
        targetAlignItems: ch.target_visual?.alignItems || "center",
        targetFlexWrap: ch.target_visual?.flexWrap || "nowrap",
        targetGap: ch.target_visual?.gap || "16px",
        targetDescription: ch.target_visual?.description || "",
      });
    } else {
      setEditingChallenge(null);
      const nextOrder = challenges.length + 1;
      setChallengeFormData({
        id: `${selectedClassForLevels.id}-${nextOrder}-level`,
        class_id: selectedClassForLevels.id,
        title: `Level ${nextOrder}: `,
        difficulty: "EASY",
        order_index: nextOrder,
        xp_reward: 20,
        instruction: "",
        theory: "",
        syntax_helpers_raw: "display: flex, justify-content: center, align-items: center",
        hint: "",
        initial_state: ".arena {\n  display: flex;\n  /* Tulis CSS di sini */\n}",
        itemsCount: 3,
        itemLabelsRaw: "Permen 1, Permen 2, Permen 3",
        targetDisplay: "flex",
        targetFlexDirection: "row",
        targetJustifyContent: "center",
        targetAlignItems: "center",
        targetFlexWrap: "nowrap",
        targetGap: "16px",
        targetDescription: "Semua elemen berada di tengah arena secara proporsional.",
      });
    }
    setShowChallengeModal(true);
  };

  const handleSaveChallenge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClassForLevels) return;

    const syntaxHelpersArray = challengeFormData.syntax_helpers_raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const itemLabelsArray = challengeFormData.itemLabelsRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      id: challengeFormData.id,
      class_id: selectedClassForLevels.id,
      title: challengeFormData.title,
      difficulty: challengeFormData.difficulty,
      order_index: Number(challengeFormData.order_index),
      xp_reward: Number(challengeFormData.xp_reward),
      instruction: challengeFormData.instruction,
      theory: challengeFormData.theory,
      syntax_helpers: syntaxHelpersArray,
      hint: challengeFormData.hint,
      initial_state: challengeFormData.initial_state,
      locked_template: {
        element: "arena",
        itemsCount: Number(challengeFormData.itemsCount),
        itemLabels: itemLabelsArray,
      },
      target_visual: {
        display: challengeFormData.targetDisplay,
        flexDirection: challengeFormData.targetFlexDirection,
        justifyContent: challengeFormData.targetJustifyContent,
        alignItems: challengeFormData.targetAlignItems,
        flexWrap: challengeFormData.targetFlexWrap,
        gap: challengeFormData.targetGap,
        description: challengeFormData.targetDescription,
      },
    };

    try {
      if (editingChallenge) {
        const res = await fetch(`/api/admin/challenges/${editingChallenge.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (json.success) {
          setActionMessage({ type: "success", text: "Level berhasil diperbarui!" });
          setShowChallengeModal(false);
          fetchChallenges(selectedClassForLevels.id);
          fetchClasses();
        } else {
          setActionMessage({ type: "error", text: json.message });
        }
      } else {
        const res = await fetch(`/api/admin/challenges`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (json.success) {
          setActionMessage({ type: "success", text: `Level '${json.data.title}' berhasil dibuat!` });
          setShowChallengeModal(false);
          fetchChallenges(selectedClassForLevels.id);
          fetchClasses();
          fetchStats();
        } else {
          setActionMessage({ type: "error", text: json.message });
        }
      }
    } catch {
      setActionMessage({ type: "error", text: "Gagal menyimpan level tantangan." });
    }
  };

  const handleDeleteChallenge = async (ch: ChallengeItem) => {
    if (!window.confirm(`Hapus '${ch.title}' dari kelas ini?`)) return;

    try {
      const res = await fetch(`/api/admin/challenges/${ch.id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setActionMessage({ type: "success", text: "Level berhasil dihapus." });
        if (selectedClassForLevels) {
          fetchChallenges(selectedClassForLevels.id);
          fetchClasses();
          fetchStats();
        }
      } else {
        setActionMessage({ type: "error", text: json.message });
      }
    } catch {
      setActionMessage({ type: "error", text: "Gagal menghapus level." });
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-3">
        <RefreshCw className="w-8 h-8 text-primary animate-spin" />
        <p className="font-headline font-bold text-sm text-on-surface">Memverifikasi Otoritas Admin...</p>
      </div>
    );
  }

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-red-100 border-3 border-on-surface flex items-center justify-center shadow-brutal mb-4 text-red-600">
          <Lock className="w-8 h-8 stroke-[2.5]" />
        </div>
        <h1 className="font-display font-black text-2xl text-on-surface mb-2">Akses Terbatas: Administrator Saja</h1>
        <p className="text-sm text-on-surface-variant max-w-md mb-6 font-medium">
          Halaman ini khusus untuk pemantauan sistem, pengelolaan pengguna, dan setup kurikulum kelas interaktif Codevas.
        </p>
        <Link href="/dashboard">
          <button className="px-6 py-2.5 bg-primary text-white font-headline font-bold rounded-full border-2 border-on-surface shadow-brutal-sm hover:scale-105 active:scale-95 transition-all">
            Kembali ke Dashboard Saya
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background text-on-surface">
      {/* Floating Action Notification */}
      {actionMessage && (
        <div className="fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-top duration-200">
          <div
            className={`px-4 py-3 rounded-2xl border-3 border-on-surface shadow-brutal flex items-center gap-2.5 text-xs font-headline font-black ${
              actionMessage.type === "success"
                ? "bg-emerald-100 text-emerald-950 border-emerald-900"
                : "bg-red-100 text-red-950 border-red-900"
            }`}
          >
            {actionMessage.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
            )}
            <span>{actionMessage.text}</span>
          </div>
        </div>
      )}

      {/* MOBILE SIDEBAR BACKDROP */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* ADMIN SIDEBAR (Desktop: Sticky, Mobile: Slide-over Drawer) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-surface-container-lowest border-r-3 border-on-surface flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen lg:sticky lg:top-0 shrink-0 ${
          sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-5 border-b-2 border-on-surface flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-primary text-white border-2 border-on-surface shadow-xs flex items-center justify-center font-black text-xl group-hover:scale-105 transition-transform">
              C
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-black text-xl text-on-surface tracking-tight">
                  Codevas
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-black uppercase tracking-wider bg-amber-300 text-amber-950 border border-on-surface">
                  ADMIN
                </span>
              </div>
              <p className="text-[10px] text-on-surface-variant font-medium">
                Pusat Kendali Sistem
              </p>
            </div>
          </Link>

          {/* Mobile Close Button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-xl border border-on-surface hover:bg-surface-container lg:hidden text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
            aria-label="Tutup Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Navigation Links */}
        <div className="p-4 flex-1 overflow-y-auto space-y-6">
          {/* Main Navigation Group */}
          <div>
            <span className="px-3 text-[10px] font-mono font-black uppercase tracking-wider text-on-surface-variant block mb-2">
              Menu Navigasi
            </span>
            <div className="space-y-1.5">
              {/* Tab 1: Overview */}
              <button
                onClick={() => {
                  setActiveTab("overview");
                  setSelectedClassForLevels(null);
                  setSidebarOpen(false);
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl font-headline font-bold text-xs sm:text-sm flex items-center justify-between transition-all cursor-pointer ${
                  activeTab === "overview"
                    ? "bg-primary text-white border-2 border-on-surface shadow-brutal-sm scale-[1.02]"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Activity className="w-4 h-4 shrink-0" />
                  <span>Monitoring &amp; Ikhtisar</span>
                </div>
                {stats && stats.onlineUsers > 0 && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      activeTab === "overview"
                        ? "bg-white/20 text-white"
                        : "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    }`}
                  >
                    {stats.onlineUsers} online
                  </span>
                )}
              </button>

              {/* Tab 2: Users */}
              <button
                onClick={() => {
                  setActiveTab("users");
                  setSelectedClassForLevels(null);
                  setSidebarOpen(false);
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl font-headline font-bold text-xs sm:text-sm flex items-center justify-between transition-all cursor-pointer ${
                  activeTab === "users"
                    ? "bg-primary text-white border-2 border-on-surface shadow-brutal-sm scale-[1.02]"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 shrink-0" />
                  <span>Manajemen Pengguna</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    activeTab === "users"
                      ? "bg-white/20 text-white"
                      : "bg-surface-container text-on-surface border border-outline-variant"
                  }`}
                >
                  {stats?.totalUsers ?? users.length}
                </span>
              </button>

              {/* Tab 3: Classes & Challenges */}
              <button
                onClick={() => {
                  setActiveTab("classes");
                  setSidebarOpen(false);
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl font-headline font-bold text-xs sm:text-sm flex items-center justify-between transition-all cursor-pointer ${
                  activeTab === "classes"
                    ? "bg-primary text-white border-2 border-on-surface shadow-brutal-sm scale-[1.02]"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 shrink-0" />
                  <span>Kelas &amp; Tantangan</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    activeTab === "classes"
                      ? "bg-white/20 text-white"
                      : "bg-surface-container text-on-surface border border-outline-variant"
                  }`}
                >
                  {stats?.totalClasses ?? classes.length}
                </span>
              </button>
            </div>
          </div>

          {/* Quick External Links */}
          <div>
            <span className="px-3 text-[10px] font-mono font-black uppercase tracking-wider text-on-surface-variant block mb-2">
              Aplikasi Pengguna
            </span>
            <div className="space-y-1.5">
              <Link
                href="/dashboard"
                className="w-full px-3.5 py-2.5 rounded-xl font-headline font-bold text-xs text-on-surface-variant hover:text-on-surface hover:bg-surface-container flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Compass className="w-4 h-4 shrink-0 text-primary" />
                  <span>Ke Dashboard Siswa</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              </Link>

              <Link
                href="/classes"
                className="w-full px-3.5 py-2.5 rounded-xl font-headline font-bold text-xs text-on-surface-variant hover:text-on-surface hover:bg-surface-container flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4 shrink-0 text-secondary" />
                  <span>Katalog Kelas Publik</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              </Link>
            </div>
          </div>
        </div>

        {/* Sidebar Footer - Admin Profile & Data Sync */}
        <div className="p-4 border-t-2 border-on-surface bg-surface-container-low space-y-3">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={user?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.username}`}
              alt={user.username}
              className="w-9 h-9 rounded-xl border border-on-surface bg-white shrink-0 object-cover"
            />
            <div className="min-w-0 flex-1">
              <span className="font-headline font-black text-xs text-on-surface block truncate">
                {user.full_name || user.username}
              </span>
              <span className="text-[11px] text-on-surface-variant font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>@{user.username}</span>
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              fetchStats();
              fetchUsers();
              fetchClasses();
              if (selectedClassForLevels) fetchChallenges(selectedClassForLevels.id);
              setActionMessage({ type: "success", text: "Data sistem berhasil disinkronkan!" });
            }}
            className="w-full py-2 px-3 rounded-xl bg-surface-container-lowest hover:bg-surface-container border-2 border-on-surface font-headline font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sinkronkan Data</span>
          </button>
        </div>
      </aside>

      {/* RIGHT MAIN WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* TOP BAR FOR RIGHT SIDE */}
        <header className="sticky top-0 z-30 bg-surface-container-low/95 backdrop-blur-md border-b-2 border-on-surface px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Mobile Sidebar Toggle Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl border-2 border-on-surface bg-surface-container-lowest text-on-surface lg:hidden hover:bg-surface-container shadow-xs cursor-pointer"
              aria-label="Buka Menu Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] sm:text-[11px] font-mono font-bold text-on-surface-variant uppercase tracking-wider">
                  Admin Console /
                </span>
                <span className="text-[10px] sm:text-[11px] font-mono font-bold text-primary uppercase tracking-wider">
                  {activeTab === "overview"
                    ? "Monitoring"
                    : activeTab === "users"
                    ? "Pengguna"
                    : "Kurikulum"}
                </span>
              </div>
              <h1 className="font-display font-black text-base sm:text-xl text-on-surface leading-tight">
                {activeTab === "overview" && "Monitoring & Ikhtisar Sistem"}
                {activeTab === "users" && "Manajemen & Audit Pengguna"}
                {activeTab === "classes" &&
                  (selectedClassForLevels
                    ? `Level Tantangan: ${selectedClassForLevels.title}`
                    : "Manajemen Kelas & Kurikulum")}
              </h1>
            </div>
          </div>

          {/* Top Bar Quick Stats & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {stats && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 border border-emerald-400 text-emerald-950 text-xs font-bold font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span>{stats.onlineUsers} Online</span>
              </div>
            )}

            <button
              onClick={() => {
                fetchStats();
                fetchUsers();
                fetchClasses();
                if (selectedClassForLevels) fetchChallenges(selectedClassForLevels.id);
                setActionMessage({ type: "success", text: "Data sistem berhasil diperbarui!" });
              }}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-surface-container-lowest border-2 border-on-surface font-headline font-bold text-xs flex items-center gap-1.5 shadow-xs hover:bg-surface-container transition-colors cursor-pointer"
              title="Perbarui Data"
            >
              <RefreshCw className="w-4 h-4 text-on-surface" />
              <span className="hidden md:inline">Sinkronkan</span>
            </button>

            <Link
              href="/dashboard"
              className="px-3 py-1.5 rounded-xl bg-primary text-white border-2 border-on-surface font-headline font-bold text-xs flex items-center gap-1.5 shadow-brutal-sm hover:scale-105 active:scale-95 transition-all"
            >
              <Compass className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ke Dashboard</span>
            </Link>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1 w-full space-y-8">
        {/* ========================================================= */}
        {/* TAB 1: MONITORING & OVERVIEW */}
        {/* ========================================================= */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Real-time Metric Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {/* Online Users Card */}
              <div className="p-4 rounded-2xl border-3 border-on-surface bg-emerald-50 shadow-brutal flex flex-col justify-between relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-headline font-black uppercase text-emerald-950">User Online</span>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-200" />
                </div>
                <div className="font-display font-black text-3xl text-emerald-900">
                  {stats ? stats.onlineUsers : <RefreshCw className="w-5 h-5 animate-spin" />}
                </div>
                <p className="text-[10px] text-emerald-700 font-medium mt-1">Aktif 15 menit terakhir</p>
              </div>

              {/* Active Today Card */}
              <div className="p-4 rounded-2xl border-3 border-on-surface bg-amber-50 shadow-brutal flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-headline font-black uppercase text-amber-950">Aktif Hari Ini</span>
                  <Flame className="w-4 h-4 text-amber-600 fill-amber-500" />
                </div>
                <div className="font-display font-black text-3xl text-amber-900">
                  {stats ? stats.activeUsersToday : "-"}
                </div>
                <p className="text-[10px] text-amber-700 font-medium mt-1">Total interaksi harian</p>
              </div>

              {/* Total Users */}
              <div className="p-4 rounded-2xl border-3 border-on-surface bg-sky-50 shadow-brutal flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-headline font-black uppercase text-sky-950">Total Pengguna</span>
                  <Users className="w-4 h-4 text-sky-600" />
                </div>
                <div className="font-display font-black text-3xl text-sky-900">
                  {stats ? stats.totalUsers : "-"}
                </div>
                <p className="text-[10px] text-sky-700 font-medium mt-1">Akun terdaftar sistem</p>
              </div>

              {/* Live Code Classes */}
              <div className="p-4 rounded-2xl border-3 border-on-surface bg-purple-50 shadow-brutal flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-headline font-black uppercase text-purple-950">Kelas Live Code</span>
                  <Code2 className="w-4 h-4 text-purple-600" />
                </div>
                <div className="font-display font-black text-3xl text-purple-900">
                  {stats ? stats.liveCodeClasses : "-"}
                </div>
                <p className="text-[10px] text-purple-700 font-medium mt-1">Modul playground aktif</p>
              </div>

              {/* Total Challenges */}
              <div className="p-4 rounded-2xl border-3 border-on-surface bg-rose-50 shadow-brutal flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-headline font-black uppercase text-rose-950">Total Level</span>
                  <ListOrdered className="w-4 h-4 text-rose-600" />
                </div>
                <div className="font-display font-black text-3xl text-rose-900">
                  {stats ? stats.totalChallenges : "-"}
                </div>
                <p className="text-[10px] text-rose-700 font-medium mt-1">Soal &amp; quest interaktif</p>
              </div>

              {/* Total Quest Completions */}
              <div className="p-4 rounded-2xl border-3 border-on-surface bg-primary-fixed shadow-brutal flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-headline font-black uppercase text-primary">Quest Tamat</span>
                  <Award className="w-4 h-4 text-primary" />
                </div>
                <div className="font-display font-black text-3xl text-primary">
                  {stats ? stats.totalCompletions : "-"}
                </div>
                <p className="text-[10px] text-primary/80 font-medium mt-1">Level berhasil diselesaikan</p>
              </div>
            </div>

            {/* LANDING PAGE VISITOR ANALYTICS SECTION (TANPA LOGIN) */}
            <div className="p-6 rounded-3xl border-3 border-on-surface bg-surface-container-lowest shadow-brutal space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-outline-variant pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-teal-100 border-2 border-on-surface flex items-center justify-center text-teal-800 shadow-brutal-sm">
                    <Globe className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div>
                    <h2 className="font-display font-black text-base sm:text-lg text-on-surface flex items-center gap-2">
                      <span>Pengunjung Website Landing (Tanpa Login)</span>
                      <span className="text-[10px] font-mono font-bold bg-teal-100 text-teal-900 border border-teal-300 px-2 py-0.5 rounded-full">
                        Publik / Guest
                      </span>
                    </h2>
                    <p className="text-xs text-on-surface-variant font-medium">
                      Pelacakan anonim kunjungan publik di landing page sebelum pengguna masuk atau registrasi.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse" />
                  <span>Real-time Tracker Aktif</span>
                </div>
              </div>

              {/* 4 Visitor Metric Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* 1. Pengunjung Landing Online */}
                <div className="p-4 rounded-2xl border-2 border-on-surface bg-teal-50/60 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-headline font-black uppercase text-teal-950">
                      Pengunjung Sedang Aktif
                    </span>
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-500 ring-4 ring-teal-200" />
                  </div>
                  <div className="font-display font-black text-2xl sm:text-3xl text-teal-900">
                    {stats?.landingVisitorsOnline ?? 0}
                  </div>
                  <p className="text-[10px] text-teal-700 font-medium mt-1">
                    Sedang membuka landing page (15m)
                  </p>
                </div>

                {/* 2. Pengunjung Hari Ini */}
                <div className="p-4 rounded-2xl border-2 border-on-surface bg-indigo-50/60 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-headline font-black uppercase text-indigo-950">
                      Pengunjung Hari Ini
                    </span>
                    <Compass className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="font-display font-black text-2xl sm:text-3xl text-indigo-900">
                    {stats?.landingVisitorsToday ?? 0}
                  </div>
                  <p className="text-[10px] text-indigo-700 font-medium mt-1">
                    Pengunjung unik hari ini
                  </p>
                </div>

                {/* 3. Total Pengunjung Unik */}
                <div className="p-4 rounded-2xl border-2 border-on-surface bg-amber-50/60 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-headline font-black uppercase text-amber-950">
                      Total Pengunjung Unik
                    </span>
                    <Globe className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="font-display font-black text-2xl sm:text-3xl text-amber-900">
                    {stats?.uniqueLandingVisitors ?? 0}
                  </div>
                  <p className="text-[10px] text-amber-700 font-medium mt-1">
                    Perangkat / browser unik
                  </p>
                </div>

                {/* 4. Total Kunjungan Halaman (Pageviews) */}
                <div className="p-4 rounded-2xl border-2 border-on-surface bg-rose-50/60 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-headline font-black uppercase text-rose-950">
                      Total Kunjungan Halaman
                    </span>
                    <MousePointerClick className="w-4 h-4 text-rose-600" />
                  </div>
                  <div className="font-display font-black text-2xl sm:text-3xl text-rose-900">
                    {stats?.totalLandingVisits ?? 0}
                  </div>
                  <p className="text-[10px] text-rose-700 font-medium mt-1">
                    Total hit &amp; reload landing
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Management Shortcuts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div
                onClick={() => setActiveTab("users")}
                className="p-6 rounded-2xl border-3 border-on-surface bg-surface-container-lowest shadow-brutal hover:translate-x-1 hover:-translate-y-1 transition-transform cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-sky-100 border-2 border-on-surface flex items-center justify-center text-sky-700 mb-3 shadow-brutal-sm">
                  <Users className="w-5 h-5 stroke-[2.5]" />
                </div>
                <h3 className="font-display font-black text-lg text-on-surface mb-1">Kelola Pengguna</h3>
                <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
                  Pantau akun aktif, ubah hak akses (Role USER / ADMIN), reset XP &amp; streak, atau hapus user.
                </p>
              </div>

              <div
                onClick={() => {
                  setActiveTab("classes");
                  setSelectedCategory("LIVE_CODE");
                }}
                className="p-6 rounded-2xl border-3 border-on-surface bg-surface-container-lowest shadow-brutal hover:translate-x-1 hover:-translate-y-1 transition-transform cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-100 border-2 border-on-surface flex items-center justify-center text-purple-700 mb-3 shadow-brutal-sm">
                  <Code2 className="w-5 h-5 stroke-[2.5]" />
                </div>
                <h3 className="font-display font-black text-lg text-on-surface mb-1">Kurikulum Live Code</h3>
                <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
                  Kelola kelas live code (CSS Flexbox, Grid), buat level baru, atur soal, teori, target visual, dan tombol ketik cepat.
                </p>
              </div>

              <div
                onClick={() => handleOpenClassModal()}
                className="p-6 rounded-2xl border-3 border-on-surface bg-surface-container-lowest shadow-brutal hover:translate-x-1 hover:-translate-y-1 transition-transform cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100 border-2 border-on-surface flex items-center justify-center text-emerald-700 mb-3 shadow-brutal-sm">
                  <Plus className="w-5 h-5 stroke-[2.5]" />
                </div>
                <h3 className="font-display font-black text-lg text-on-surface mb-1">Tambah Kelas Baru</h3>
                <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
                  Buat modul kelas baru per kategori dengan formulir konfigurasi terpadu.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: USER MANAGEMENT */}
        {/* ========================================================= */}
        {activeTab === "users" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Search & Actions Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2 flex-1 max-w-xl">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-4 h-4 text-on-surface-variant absolute left-3 top-3" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && fetchUsers()}
                    placeholder="Cari username, nama, atau email..."
                    className="w-full pl-9 pr-3 py-2 bg-surface-container-lowest border-2 border-on-surface rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                  />
                </div>

                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="px-3 py-2 bg-surface-container-lowest border-2 border-on-surface rounded-xl text-xs sm:text-sm font-bold focus:outline-none cursor-pointer"
                >
                  <option value="">Semua Role</option>
                  <option value="USER">User Biasa</option>
                  <option value="ADMIN">Administrator</option>
                </select>

                <button
                  onClick={fetchUsers}
                  className="px-3 py-2 bg-surface-container border-2 border-on-surface rounded-xl font-bold text-xs hover:bg-surface-container-high transition-colors"
                >
                  Cari
                </button>
              </div>

              <button
                onClick={() => handleOpenUserModal()}
                className="px-4 py-2 bg-primary text-white border-2 border-on-surface rounded-xl font-headline font-black text-xs sm:text-sm shadow-brutal-sm hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Tambah Pengguna</span>
              </button>
            </div>

            {/* Users Table */}
            <div className="bg-surface-container-lowest border-3 border-on-surface rounded-2xl shadow-brutal overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low border-b-2 border-on-surface text-[11px] font-headline font-black uppercase text-on-surface tracking-wider">
                      <th className="p-4">Pengguna</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">Progres (XP / Streak)</th>
                      <th className="p-4">Aktivitas Terakhir</th>
                      <th className="p-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y border-outline-variant text-xs font-medium">
                    {loadingUsers ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-on-surface-variant font-bold">
                          <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-primary" />
                          Memuat data pengguna...
                        </td>
                      </tr>
                    ) : users.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-on-surface-variant">
                          Tidak ada pengguna yang cocok dengan kriteria pencarian.
                        </td>
                      </tr>
                    ) : (
                      users.map((u) => {
                        const online = isUserOnline(u.last_seen_at);
                        const isSelf = u.id === user?.id;

                        return (
                          <tr key={u.id} className="hover:bg-surface-container-low/50 transition-colors">
                            {/* User Avatar & Name */}
                            <td className="p-4 flex items-center gap-3">
                              <div className="relative">
                                <div className="w-9 h-9 rounded-full bg-primary text-white font-bold flex items-center justify-center border border-on-surface uppercase text-xs">
                                  {u.username.slice(0, 2)}
                                </div>
                                {online && (
                                  <span
                                    className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white absolute -bottom-0.5 -right-0.5"
                                    title="Online Sekarang"
                                  />
                                )}
                              </div>
                              <div>
                                <div className="font-headline font-black text-on-surface flex items-center gap-1.5">
                                  <span>{u.full_name || u.username}</span>
                                  {isSelf && (
                                    <span className="text-[10px] bg-primary-fixed text-primary px-1.5 py-0.2 rounded border border-primary font-mono">
                                      Anda
                                    </span>
                                  )}
                                </div>
                                <span className="text-on-surface-variant text-[11px] font-mono">@{u.username}</span>
                              </div>
                            </td>

                            {/* Email */}
                            <td className="p-4 text-on-surface-variant font-mono text-[11px]">{u.email}</td>

                            {/* Role Badge */}
                            <td className="p-4">
                              <span
                                className={`px-2.5 py-1 rounded-full font-headline font-black text-[10px] border ${
                                  u.role === "ADMIN"
                                    ? "bg-amber-100 text-amber-900 border-amber-400"
                                    : "bg-surface-container text-on-surface-variant border-outline"
                                }`}
                              >
                                {u.role}
                              </span>
                            </td>

                            {/* XP & Streak */}
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-secondary-fixed text-secondary border border-secondary rounded font-bold text-[11px]">
                                  <Zap className="w-3 h-3 fill-secondary" />
                                  {u.xp_points} XP
                                </span>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-800 border border-amber-300 rounded font-bold text-[11px]">
                                  <Flame className="w-3 h-3 fill-amber-600" />
                                  {u.streak_days} Hari
                                </span>
                              </div>
                            </td>

                            {/* Activity */}
                            <td className="p-4">
                              {online ? (
                                <span className="inline-flex items-center gap-1.5 text-emerald-600 font-bold text-[11px]">
                                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                  Online Sekarang
                                </span>
                              ) : (
                                <span className="text-on-surface-variant text-[11px]">
                                  {u.last_seen_at
                                    ? new Date(u.last_seen_at).toLocaleString("id-ID", {
                                        dateStyle: "medium",
                                        timeStyle: "short",
                                      })
                                    : new Date(u.last_active_date).toLocaleDateString("id-ID")}
                                </span>
                              )}
                            </td>

                            {/* Actions */}
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleToggleRole(u)}
                                  disabled={isSelf}
                                  title={u.role === "ADMIN" ? "Ubah jadi USER" : "Jadikan ADMIN"}
                                  className="p-1.5 rounded-lg border border-on-surface bg-surface-container hover:bg-surface-container-high disabled:opacity-40 transition-colors"
                                >
                                  <Shield className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleOpenUserModal(u)}
                                  title="Edit Pengguna"
                                  className="p-1.5 rounded-lg border border-on-surface bg-surface-container hover:bg-surface-container-high transition-colors"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(u)}
                                  disabled={isSelf}
                                  title="Hapus Pengguna"
                                  className="p-1.5 rounded-lg border border-red-800 bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-40 transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: CLASSES & LEVEL MANAGEMENT */}
        {/* ========================================================= */}
        {activeTab === "classes" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Category Selector Tabs */}
            <div className="flex items-center gap-2 p-1.5 bg-surface-container-low border-2 border-on-surface rounded-2xl w-fit overflow-x-auto">
              <button
                onClick={() => {
                  setSelectedCategory("LIVE_CODE");
                  setSelectedClassForLevels(null);
                }}
                className={`px-4 py-2 rounded-xl font-headline font-black text-xs flex items-center gap-2 transition-all cursor-pointer ${
                  selectedCategory === "LIVE_CODE"
                    ? "bg-primary text-white border-2 border-on-surface shadow-brutal-sm"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <Code2 className="w-4 h-4" />
                <span>1. Live Code Playground</span>
                <span className="text-[10px] bg-white text-primary px-1.5 py-0.2 rounded-full font-mono">
                  Aktif
                </span>
              </button>

              <button
                onClick={() => {
                  setSelectedCategory("DRAG_DROP");
                  setSelectedClassForLevels(null);
                }}
                className={`px-4 py-2 rounded-xl font-headline font-black text-xs flex items-center gap-2 transition-all cursor-pointer ${
                  selectedCategory === "DRAG_DROP"
                    ? "bg-primary text-white border-2 border-on-surface shadow-brutal-sm"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>2. Drag &amp; Drop Visual</span>
                <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded-full font-mono">
                  Segera
                </span>
              </button>

              <button
                onClick={() => {
                  setSelectedCategory("QUIZ");
                  setSelectedClassForLevels(null);
                }}
                className={`px-4 py-2 rounded-xl font-headline font-black text-xs flex items-center gap-2 transition-all cursor-pointer ${
                  selectedCategory === "QUIZ"
                    ? "bg-primary text-white border-2 border-on-surface shadow-brutal-sm"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span>3. Kuis Interaktif</span>
                <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded-full font-mono">
                  Segera
                </span>
              </button>
            </div>

            {/* Note banner when DRAG_DROP or QUIZ is selected */}
            {selectedCategory !== "LIVE_CODE" && (
              <div className="p-6 rounded-2xl border-3 border-dashed border-amber-600 bg-amber-50/70 text-amber-950 space-y-2">
                <div className="flex items-center gap-2 font-headline font-black text-base">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                  <span>Kategori {selectedCategory === "DRAG_DROP" ? "Drag & Drop" : "Quiz"} Memerlukan Form Khusus</span>
                </div>
                <p className="text-xs font-medium leading-relaxed max-w-2xl">
                  Sesuai kebutuhan, tiap kategori memiliki skema soal yang berbeda (pilihan ganda, visual canvas, isian). Untuk saat ini modul <strong>LIVE_CODE</strong> telah siap 100% dengan manajemen level, visual target, materi, dan quick syntax helper.
                </p>
              </div>
            )}

            {/* Sub-view: CHALLENGES OF A SPECIFIC CLASS */}
            {selectedClassForLevels ? (
              <div className="space-y-6">
                {/* Back Breadcrumb & Header */}
                <div className="p-5 rounded-2xl border-3 border-on-surface bg-surface-container-lowest shadow-brutal flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <button
                      onClick={() => setSelectedClassForLevels(null)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline mb-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Kembali ke Daftar Kelas {selectedCategory}</span>
                    </button>
                    <h2 className="font-display font-black text-xl text-on-surface flex items-center gap-2">
                      <span>Level &amp; Quest: {selectedClassForLevels.title}</span>
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-primary-fixed border border-primary text-primary">
                        ID: {selectedClassForLevels.id}
                      </span>
                    </h2>
                    <p className="text-xs text-on-surface-variant font-medium mt-0.5">
                      Kelola 10 level live coding dengan konfigurasi soal, materi teori, kode awal, dan target visual solusi.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/classes/${selectedClassForLevels.id}`}
                      target="_blank"
                      className="px-3.5 py-2 rounded-xl bg-surface-container border-2 border-on-surface font-headline font-bold text-xs flex items-center gap-1.5 hover:bg-surface-container-high transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Lihat Silabus</span>
                    </Link>

                    <button
                      onClick={() => handleOpenChallengeModal()}
                      className="px-4 py-2 bg-primary text-white border-2 border-on-surface rounded-xl font-headline font-black text-xs shadow-brutal-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4 stroke-[3]" />
                      <span>Tambah Level Baru</span>
                    </button>
                  </div>
                </div>

                {/* Challenges List */}
                <div className="space-y-3">
                  {loadingChallenges ? (
                    <div className="p-12 text-center text-on-surface-variant font-bold bg-surface-container-lowest rounded-2xl border-2 border-on-surface">
                      <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-primary" />
                      Memuat daftar level tantangan...
                    </div>
                  ) : challenges.length === 0 ? (
                    <div className="p-12 text-center text-on-surface-variant font-medium bg-surface-container-lowest rounded-2xl border-2 border-on-surface">
                      Belum ada level tantangan yang dibuat untuk kelas ini. Klik tombol di atas untuk menambah Level 1.
                    </div>
                  ) : (
                    challenges.map((ch) => (
                      <div
                        key={ch.id}
                        className="p-5 rounded-2xl border-3 border-on-surface bg-surface-container-lowest shadow-brutal-sm hover:shadow-brutal transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-primary text-white border-2 border-on-surface flex items-center justify-center font-headline font-black text-sm shrink-0 shadow-sm">
                            {ch.order_index}
                          </div>

                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-display font-black text-base text-on-surface">{ch.title}</h3>
                              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-on-surface bg-primary text-white">
                                {ch.difficulty}
                              </span>
                              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-amber-300 bg-amber-100 text-amber-900">
                                +{ch.xp_reward} XP
                              </span>
                              <span className="text-[10px] font-mono text-on-surface-variant">ID: {ch.id}</span>
                            </div>

                            <p className="text-xs text-on-surface-variant font-medium line-clamp-2 max-w-3xl">
                              <strong>Misi:</strong> {ch.instruction}
                            </p>

                            {ch.theory && (
                              <p className="text-[11px] text-primary/90 font-medium line-clamp-1 max-w-3xl flex items-center gap-1">
                                <BookOpen className="w-3 h-3 text-primary shrink-0" />
                                <span>Teori: {ch.theory}</span>
                              </p>
                            )}

                            {/* Syntax helpers tags */}
                            {ch.syntax_helpers && ch.syntax_helpers.length > 0 && (
                              <div className="flex flex-wrap gap-1 pt-1">
                                {ch.syntax_helpers.map((h, i) => (
                                  <span
                                    key={i}
                                    className="text-[10px] font-mono font-bold bg-surface-container px-2 py-0.5 rounded border border-outline-variant"
                                  >
                                    +{h}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions for this level */}
                        <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                          <Link
                            href={`/classes/${selectedClassForLevels.id}/learn/${ch.id}`}
                            target="_blank"
                            className="p-2 rounded-xl border border-on-surface bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold text-xs flex items-center gap-1"
                            title="Buka di Workspace Live Coding"
                          >
                            <Play className="w-3.5 h-3.5 fill-emerald-700" />
                            <span>Playground</span>
                          </Link>

                          <button
                            onClick={() => handleOpenChallengeModal(ch)}
                            className="p-2 rounded-xl border border-on-surface bg-surface-container hover:bg-surface-container-high transition-colors"
                            title="Edit Level & Soal"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteChallenge(ch)}
                            className="p-2 rounded-xl border border-red-800 bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                            title="Hapus Level"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              /* Sub-view: LIST OF CLASSES FOR SELECTED CATEGORY */
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-display font-black text-xl text-on-surface">
                      Daftar Modul Kelas: {selectedCategory}
                    </h2>
                    <p className="text-xs text-on-surface-variant font-medium">
                      Pilih modul kelas untuk mengelola kurikulum dan level soal interaktifnya.
                    </p>
                  </div>

                  <button
                    onClick={() => handleOpenClassModal()}
                    className="px-4 py-2 bg-primary text-white border-2 border-on-surface rounded-xl font-headline font-black text-xs sm:text-sm shadow-brutal-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>Tambah Kelas {selectedCategory}</span>
                  </button>
                </div>

                {/* Classes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {loadingClasses ? (
                    <div className="col-span-2 p-12 text-center text-on-surface-variant font-bold bg-surface-container-lowest rounded-2xl border-2 border-on-surface">
                      <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-primary" />
                      Memuat daftar kelas...
                    </div>
                  ) : classes.length === 0 ? (
                    <div className="col-span-2 p-12 text-center text-on-surface-variant font-medium bg-surface-container-lowest rounded-2xl border-2 border-on-surface">
                      Belum ada kelas terdaftar pada kategori {selectedCategory}.
                    </div>
                  ) : (
                    classes.map((cls) => (
                      <div
                        key={cls.id}
                        className="p-5 rounded-2xl border-3 border-on-surface bg-surface-container-lowest shadow-brutal flex flex-col justify-between space-y-4"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-primary-fixed border border-primary text-primary">
                              {cls.category} • Urutan #{cls.order_index}
                            </span>
                            <span
                              className={`text-[10px] font-headline font-bold px-2 py-0.5 rounded-full border ${
                                cls.is_published
                                  ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                                  : "bg-surface-container text-on-surface-variant border-outline"
                              }`}
                            >
                              {cls.is_published ? "Tayang (Published)" : "Draf (Draft)"}
                            </span>
                          </div>

                          <h3 className="font-display font-black text-lg text-on-surface leading-tight">
                            {cls.title}
                          </h3>

                          {cls.tagline && (
                            <p className="text-xs text-on-surface-variant font-medium line-clamp-2">
                              {cls.tagline}
                            </p>
                          )}

                          {/* Stats Metrics */}
                          <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] font-bold">
                            <span className="px-2.5 py-1 bg-surface-container-low border border-outline rounded-lg">
                              📚 {cls.totalChallenges} Quest Level
                            </span>
                            <span className="px-2.5 py-1 bg-surface-container-low border border-outline rounded-lg">
                              👥 {cls.totalEnrollments} Siswa Terdaftar
                            </span>
                            <span className="px-2.5 py-1 bg-surface-container-low border border-outline rounded-lg">
                              ⭐ +{cls.xp_reward} XP
                            </span>
                          </div>
                        </div>

                        {/* Actions for Class */}
                        <div className="pt-3 border-t border-outline-variant flex items-center justify-between gap-2">
                          <button
                            onClick={() => setSelectedClassForLevels(cls)}
                            className="flex-1 py-2 px-3 rounded-xl bg-primary text-white font-headline font-black text-xs border-2 border-on-surface shadow-brutal-sm hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Sliders className="w-3.5 h-3.5" />
                            <span>Kelola Level &amp; Soal ({cls.totalChallenges})</span>
                          </button>

                          <button
                            onClick={() => handleOpenClassModal(cls)}
                            className="p-2 rounded-xl border-2 border-on-surface bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer"
                            title="Edit Info Kelas"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteClass(cls)}
                            className="p-2 rounded-xl border-2 border-red-800 bg-red-50 text-red-700 hover:bg-red-100 transition-colors cursor-pointer"
                            title="Hapus Kelas"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        </main>
      </div>

      {/* ========================================================= */}
      {/* MODAL: ADD / EDIT USER */}
      {/* ========================================================= */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-container-lowest border-4 border-on-surface rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-brutal space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-black text-xl text-on-surface">
                {editingUser ? `Edit Pengguna @${editingUser.username}` : "Tambah Pengguna Baru"}
              </h2>
              <button
                onClick={() => setShowUserModal(false)}
                className="w-8 h-8 rounded-full border-2 border-on-surface bg-surface-container flex items-center justify-center font-bold text-xs hover:bg-red-100 transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4 text-xs font-bold">
              <div>
                <label className="block text-on-surface-variant uppercase tracking-wider mb-1">Username</label>
                <input
                  type="text"
                  required
                  value={userFormData.username}
                  onChange={(e) => setUserFormData({ ...userFormData, username: e.target.value })}
                  placeholder="e.g. herinta"
                  className="w-full p-2.5 bg-surface-container-low border-2 border-on-surface rounded-xl font-mono text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-on-surface-variant uppercase tracking-wider mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={userFormData.email}
                  onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                  placeholder="e.g. user@codevas.dev"
                  className="w-full p-2.5 bg-surface-container-low border-2 border-on-surface rounded-xl font-mono text-sm focus:outline-none"
                />
              </div>

              {!editingUser && (
                <div>
                  <label className="block text-on-surface-variant uppercase tracking-wider mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={userFormData.password}
                    onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                    placeholder="Minimal 6 karakter"
                    className="w-full p-2.5 bg-surface-container-low border-2 border-on-surface rounded-xl text-sm focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-on-surface-variant uppercase tracking-wider mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={userFormData.full_name}
                  onChange={(e) => setUserFormData({ ...userFormData, full_name: e.target.value })}
                  placeholder="e.g. Herinta Dwi"
                  className="w-full p-2.5 bg-surface-container-low border-2 border-on-surface rounded-xl text-sm focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-on-surface-variant uppercase tracking-wider mb-1">XP Points</label>
                  <input
                    type="number"
                    value={userFormData.xp_points}
                    onChange={(e) => setUserFormData({ ...userFormData, xp_points: Number(e.target.value) })}
                    className="w-full p-2.5 bg-surface-container-low border-2 border-on-surface rounded-xl font-mono text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-on-surface-variant uppercase tracking-wider mb-1">Streak (Hari)</label>
                  <input
                    type="number"
                    value={userFormData.streak_days}
                    onChange={(e) => setUserFormData({ ...userFormData, streak_days: Number(e.target.value) })}
                    className="w-full p-2.5 bg-surface-container-low border-2 border-on-surface rounded-xl font-mono text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-on-surface-variant uppercase tracking-wider mb-1">Role Otoritas</label>
                <select
                  value={userFormData.role}
                  onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value as any })}
                  className="w-full p-2.5 bg-surface-container-low border-2 border-on-surface rounded-xl font-bold text-sm focus:outline-none cursor-pointer"
                >
                  <option value="USER">USER (Pelajar Biasa)</option>
                  <option value="ADMIN">ADMIN (Akses Penuh Console)</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="px-4 py-2 rounded-xl bg-surface-container border border-on-surface text-on-surface font-bold text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary text-white border-2 border-on-surface shadow-brutal-sm font-headline font-black text-xs hover:scale-105 active:scale-95 transition-all"
                >
                  Simpan Pengguna
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ADD / EDIT CLASS */}
      {/* ========================================================= */}
      {showClassModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-container-lowest border-4 border-on-surface rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-brutal space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-black text-xl text-on-surface">
                {editingClass ? `Edit Kelas: ${editingClass.title}` : `Tambah Kelas ${selectedCategory} Baru`}
              </h2>
              <button
                onClick={() => setShowClassModal(false)}
                className="w-8 h-8 rounded-full border-2 border-on-surface bg-surface-container flex items-center justify-center font-bold text-xs hover:bg-red-100 transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveClass} className="space-y-4 text-xs font-bold">
              <div>
                <label className="block text-on-surface-variant uppercase tracking-wider mb-1">ID Kelas (Slug)</label>
                <input
                  type="text"
                  required
                  disabled={Boolean(editingClass)}
                  value={classFormData.id}
                  onChange={(e) => setClassFormData({ ...classFormData, id: e.target.value })}
                  placeholder="e.g. css-flexbox-mastery"
                  className="w-full p-2.5 bg-surface-container-low border-2 border-on-surface rounded-xl font-mono text-sm focus:outline-none disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block text-on-surface-variant uppercase tracking-wider mb-1">Judul Kelas</label>
                <input
                  type="text"
                  required
                  value={classFormData.title}
                  onChange={(e) => setClassFormData({ ...classFormData, title: e.target.value })}
                  placeholder="e.g. CSS Flexbox Mastery"
                  className="w-full p-2.5 bg-surface-container-low border-2 border-on-surface rounded-xl text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-on-surface-variant uppercase tracking-wider mb-1">Tagline Singkat</label>
                <input
                  type="text"
                  value={classFormData.tagline}
                  onChange={(e) => setClassFormData({ ...classFormData, tagline: e.target.value })}
                  placeholder="e.g. Kuasai tata letak satu dimensi modern dengan 10 level interaktif!"
                  className="w-full p-2.5 bg-surface-container-low border-2 border-on-surface rounded-xl text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-on-surface-variant uppercase tracking-wider mb-1">Deskripsi Lengkap</label>
                <textarea
                  rows={3}
                  value={classFormData.description}
                  onChange={(e) => setClassFormData({ ...classFormData, description: e.target.value })}
                  placeholder="Rincian silabus yang akan dipelajari siswa..."
                  className="w-full p-2.5 bg-surface-container-low border-2 border-on-surface rounded-xl text-sm focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-on-surface-variant uppercase tracking-wider mb-1">Tingkat</label>
                  <select
                    value={classFormData.difficulty_level}
                    onChange={(e) => setClassFormData({ ...classFormData, difficulty_level: e.target.value })}
                    className="w-full p-2 bg-surface-container-low border-2 border-on-surface rounded-xl text-xs font-bold"
                  >
                    <option value="Pemula">Pemula</option>
                    <option value="Menengah">Menengah</option>
                    <option value="Lanjutan">Lanjutan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-on-surface-variant uppercase tracking-wider mb-1">XP Reward</label>
                  <input
                    type="number"
                    value={classFormData.xp_reward}
                    onChange={(e) => setClassFormData({ ...classFormData, xp_reward: Number(e.target.value) })}
                    className="w-full p-2 bg-surface-container-low border-2 border-on-surface rounded-xl font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-on-surface-variant uppercase tracking-wider mb-1">Urutan</label>
                  <input
                    type="number"
                    value={classFormData.order_index}
                    onChange={(e) => setClassFormData({ ...classFormData, order_index: Number(e.target.value) })}
                    className="w-full p-2 bg-surface-container-low border-2 border-on-surface rounded-xl font-mono text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="classPublished"
                  checked={classFormData.is_published}
                  onChange={(e) => setClassFormData({ ...classFormData, is_published: e.target.checked })}
                  className="w-4 h-4 rounded border-2 border-on-surface"
                />
                <label htmlFor="classPublished" className="text-on-surface font-bold cursor-pointer">
                  Publikasikan kelas (Dapat diakses oleh siswa di katalog)
                </label>
              </div>

              <div className="pt-3 border-t border-outline-variant flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowClassModal(false)}
                  className="px-4 py-2 rounded-xl bg-surface-container border border-on-surface text-on-surface font-bold text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary text-white border-2 border-on-surface shadow-brutal-sm font-headline font-black text-xs hover:scale-105 active:scale-95 transition-all"
                >
                  Simpan Kelas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ADD / EDIT CHALLENGE LEVEL FOR LIVE_CODE */}
      {/* ========================================================= */}
      {showChallengeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-container-lowest border-4 border-on-surface rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-brutal space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-black text-xl text-on-surface">
                  {editingChallenge ? `Edit Level: ${editingChallenge.title}` : `Tambah Level Live Code Baru`}
                </h2>
                <span className="text-xs font-mono text-on-surface-variant font-bold">
                  Kelas: {selectedClassForLevels?.title} ({selectedClassForLevels?.id})
                </span>
              </div>
              <button
                onClick={() => setShowChallengeModal(false)}
                className="w-8 h-8 rounded-full border-2 border-on-surface bg-surface-container flex items-center justify-center font-bold text-xs hover:bg-red-100 transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveChallenge} className="space-y-4 text-xs font-bold">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-on-surface-variant uppercase tracking-wider mb-1">ID Level (Slug)</label>
                  <input
                    type="text"
                    required
                    disabled={Boolean(editingChallenge)}
                    value={challengeFormData.id}
                    onChange={(e) => setChallengeFormData({ ...challengeFormData, id: e.target.value })}
                    placeholder="e.g. flexbox-1-activation"
                    className="w-full p-2.5 bg-surface-container-low border-2 border-on-surface rounded-xl font-mono text-xs focus:outline-none disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="block text-on-surface-variant uppercase tracking-wider mb-1">Nomor Urut</label>
                  <input
                    type="number"
                    required
                    value={challengeFormData.order_index}
                    onChange={(e) => setChallengeFormData({ ...challengeFormData, order_index: Number(e.target.value) })}
                    className="w-full p-2.5 bg-surface-container-low border-2 border-on-surface rounded-xl font-mono text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-on-surface-variant uppercase tracking-wider mb-1">Judul Level / Quest</label>
                <input
                  type="text"
                  required
                  value={challengeFormData.title}
                  onChange={(e) => setChallengeFormData({ ...challengeFormData, title: e.target.value })}
                  placeholder="e.g. Level 1: Rapatkan 3 Permen ke Titik Tengah"
                  className="w-full p-2.5 bg-surface-container-low border-2 border-on-surface rounded-xl text-sm focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-on-surface-variant uppercase tracking-wider mb-1">Tingkat Kesulitan</label>
                  <select
                    value={challengeFormData.difficulty}
                    onChange={(e) => setChallengeFormData({ ...challengeFormData, difficulty: e.target.value as any })}
                    className="w-full p-2.5 bg-surface-container-low border-2 border-on-surface rounded-xl text-xs font-bold"
                  >
                    <option value="EASY">EASY</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HARD">HARD</option>
                    <option value="BOSS_FIGHT">BOSS_FIGHT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-on-surface-variant uppercase tracking-wider mb-1">Hadiah XP</label>
                  <input
                    type="number"
                    value={challengeFormData.xp_reward}
                    onChange={(e) => setChallengeFormData({ ...challengeFormData, xp_reward: Number(e.target.value) })}
                    className="w-full p-2.5 bg-surface-container-low border-2 border-on-surface rounded-xl font-mono text-xs"
                  />
                </div>
              </div>

              {/* Soal / Misi */}
              <div>
                <label className="block text-primary uppercase tracking-wider mb-1">
                  Misi Tantangan / Soal (Tampil di Panel 1 Siswa)
                </label>
                <textarea
                  rows={3}
                  required
                  value={challengeFormData.instruction}
                  onChange={(e) => setChallengeFormData({ ...challengeFormData, instruction: e.target.value })}
                  placeholder="Tuliskan instruksi tugas yang harus diselesaikan siswa..."
                  className="w-full p-3 bg-surface-container-low border-2 border-on-surface rounded-xl text-xs focus:outline-none resize-none leading-relaxed"
                />
              </div>

              {/* Materi & Teori */}
              <div>
                <label className="block text-primary uppercase tracking-wider mb-1">
                  Materi &amp; Teori Pembelajaran (Tampil di Kartu Teori Panel 1)
                </label>
                <textarea
                  rows={3}
                  value={challengeFormData.theory}
                  onChange={(e) => setChallengeFormData({ ...challengeFormData, theory: e.target.value })}
                  placeholder="Penjelasan konsep CSS yang dipelajari pada level ini..."
                  className="w-full p-3 bg-surface-container-low border-2 border-on-surface rounded-xl text-xs focus:outline-none resize-none leading-relaxed"
                />
              </div>

              {/* Tombol Ketik Cepat */}
              <div>
                <label className="block text-on-surface-variant uppercase tracking-wider mb-1">
                  Tombol Ketik Cepat (Pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  value={challengeFormData.syntax_helpers_raw}
                  onChange={(e) => setChallengeFormData({ ...challengeFormData, syntax_helpers_raw: e.target.value })}
                  placeholder="display: flex, justify-content: center, align-items: center"
                  className="w-full p-2.5 bg-surface-container-low border-2 border-on-surface rounded-xl font-mono text-xs focus:outline-none"
                />
              </div>

              {/* Petunjuk / Hint */}
              <div>
                <label className="block text-on-surface-variant uppercase tracking-wider mb-1">
                  Petunjuk Bantuan (Hint Opsional)
                </label>
                <input
                  type="text"
                  value={challengeFormData.hint}
                  onChange={(e) => setChallengeFormData({ ...challengeFormData, hint: e.target.value })}
                  placeholder="e.g. Gunakan display: flex; dan justify-content: space-between;"
                  className="w-full p-2.5 bg-surface-container-low border-2 border-on-surface rounded-xl text-xs focus:outline-none"
                />
              </div>

              {/* Kode Awal / Initial State */}
              <div>
                <label className="block text-on-surface-variant uppercase tracking-wider mb-1">
                  Kode Awal CSS Editor
                </label>
                <textarea
                  rows={3}
                  value={challengeFormData.initial_state}
                  onChange={(e) => setChallengeFormData({ ...challengeFormData, initial_state: e.target.value })}
                  className="w-full p-3 bg-[#1e1e2e] text-[#cdd6f4] font-mono text-xs rounded-xl border-2 border-on-surface focus:outline-none resize-none"
                />
              </div>

              {/* Konfigurasi Visual Target Solusi (Khusus LIVE_CODE) */}
              <div className="p-4 bg-surface-container-low border-2 border-on-surface rounded-2xl space-y-3">
                <span className="block font-headline font-black text-xs uppercase text-emerald-800">
                  🎯 Konfigurasi Target Visual Solusi (Preview Goal)
                </span>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] text-on-surface-variant uppercase mb-1">Justify Content</label>
                    <select
                      value={challengeFormData.targetJustifyContent}
                      onChange={(e) => setChallengeFormData({ ...challengeFormData, targetJustifyContent: e.target.value })}
                      className="w-full p-2 bg-surface-container-lowest border border-on-surface rounded-lg text-[11px] font-mono"
                    >
                      <option value="center">center</option>
                      <option value="space-between">space-between</option>
                      <option value="space-around">space-around</option>
                      <option value="space-evenly">space-evenly</option>
                      <option value="flex-start">flex-start</option>
                      <option value="flex-end">flex-end</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] text-on-surface-variant uppercase mb-1">Align Items</label>
                    <select
                      value={challengeFormData.targetAlignItems}
                      onChange={(e) => setChallengeFormData({ ...challengeFormData, targetAlignItems: e.target.value })}
                      className="w-full p-2 bg-surface-container-lowest border border-on-surface rounded-lg text-[11px] font-mono"
                    >
                      <option value="center">center</option>
                      <option value="flex-start">flex-start</option>
                      <option value="flex-end">flex-end</option>
                      <option value="stretch">stretch</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] text-on-surface-variant uppercase mb-1">Flex Direction</label>
                    <select
                      value={challengeFormData.targetFlexDirection}
                      onChange={(e) => setChallengeFormData({ ...challengeFormData, targetFlexDirection: e.target.value })}
                      className="w-full p-2 bg-surface-container-lowest border border-on-surface rounded-lg text-[11px] font-mono"
                    >
                      <option value="row">row</option>
                      <option value="column">column</option>
                      <option value="column-reverse">column-reverse</option>
                      <option value="row-reverse">row-reverse</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-on-surface-variant uppercase mb-1">Flex Wrap</label>
                    <select
                      value={challengeFormData.targetFlexWrap}
                      onChange={(e) => setChallengeFormData({ ...challengeFormData, targetFlexWrap: e.target.value })}
                      className="w-full p-2 bg-surface-container-lowest border border-on-surface rounded-lg text-[11px] font-mono"
                    >
                      <option value="nowrap">nowrap</option>
                      <option value="wrap">wrap</option>
                      <option value="wrap-reverse">wrap-reverse</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] text-on-surface-variant uppercase mb-1">Gap</label>
                    <input
                      type="text"
                      value={challengeFormData.targetGap}
                      onChange={(e) => setChallengeFormData({ ...challengeFormData, targetGap: e.target.value })}
                      placeholder="e.g. 16px"
                      className="w-full p-2 bg-surface-container-lowest border border-on-surface rounded-lg text-[11px] font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-on-surface-variant uppercase mb-1">Deskripsi Target Solusi</label>
                  <input
                    type="text"
                    value={challengeFormData.targetDescription}
                    onChange={(e) => setChallengeFormData({ ...challengeFormData, targetDescription: e.target.value })}
                    placeholder="e.g. Permen tersebar merata dari ujung kiri hingga kanan arena."
                    className="w-full p-2 bg-surface-container-lowest border border-on-surface rounded-lg text-[11px]"
                  />
                </div>
              </div>

              {/* Template Arena Items */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] text-on-surface-variant uppercase mb-1">Jumlah Elemen</label>
                  <input
                    type="number"
                    min={1}
                    max={8}
                    value={challengeFormData.itemsCount}
                    onChange={(e) => setChallengeFormData({ ...challengeFormData, itemsCount: Number(e.target.value) })}
                    className="w-full p-2 bg-surface-container-low border-2 border-on-surface rounded-xl font-mono text-xs"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] text-on-surface-variant uppercase mb-1">Label Elemen (Pisahkan koma)</label>
                  <input
                    type="text"
                    value={challengeFormData.itemLabelsRaw}
                    onChange={(e) => setChallengeFormData({ ...challengeFormData, itemLabelsRaw: e.target.value })}
                    placeholder="Permen 1, Permen 2, Permen 3"
                    className="w-full p-2 bg-surface-container-low border-2 border-on-surface rounded-xl font-mono text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-outline-variant flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowChallengeModal(false)}
                  className="px-4 py-2 rounded-xl bg-surface-container border border-on-surface text-on-surface font-bold text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary text-white border-2 border-on-surface shadow-brutal-sm font-headline font-black text-xs hover:scale-105 active:scale-95 transition-all"
                >
                  Simpan Level Live Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
