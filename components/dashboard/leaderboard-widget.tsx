"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Trophy, Crown, Sparkles, Loader2, RefreshCw, X, User } from "lucide-react";
import { useAuth } from "@/components/auth/auth-context";

export interface LeaderboardUser {
  rank: number;
  id: string;
  username: string;
  full_name: string;
  avatar_url?: string | null;
  xp_points: number;
  level: number;
  rank_title: string;
  rank_badge: string;
  streak_days: number;
  completed_challenges_count: number;
  isCurrentUser?: boolean;
}

export const LeaderboardWidget: React.FC = () => {
  const { user: authUser } = useAuth();
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [currentUserRank, setCurrentUserRank] = useState<number | null>(null);
  const [currentUserData, setCurrentUserData] = useState<LeaderboardUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showFullModal, setShowFullModal] = useState(false);
  const [fullList, setFullList] = useState<LeaderboardUser[]>([]);
  const [fullLoading, setFullLoading] = useState(false);

  const fetchLeaderboard = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await fetch("/api/leaderboard?limit=5");
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setUsers(json.data);
          setCurrentUserRank(json.currentUserRank ?? null);
          setCurrentUserData(json.currentUser ?? null);
        }
      }
    } catch (err) {
      console.error("Gagal memuat leaderboard:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const fetchFullLeaderboard = async () => {
    setShowFullModal(true);
    setFullLoading(true);
    try {
      const res = await fetch("/api/leaderboard?limit=25");
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setFullList(json.data);
        }
      }
    } catch (err) {
      console.error("Gagal memuat full leaderboard:", err);
    } finally {
      setFullLoading(false);
    }
  };

  const getRankBadgeClass = (rank: number) => {
    if (rank === 1) return "bg-amber-400 text-amber-950 border-on-surface";
    if (rank === 2) return "bg-slate-300 text-slate-900 border-on-surface";
    if (rank === 3) return "bg-amber-700 text-white border-on-surface";
    return "bg-surface-container-high text-on-surface border-outline-variant";
  };

  // Check if current user is within the top 5
  const isCurrentUserInTop = users.some((u) => u.isCurrentUser || (authUser && u.id === authUser.id));

  return (
    <div id="leaderboard" className="bg-surface-container-lowest rounded-2xl border-2 border-on-surface p-5 sm:p-6 candy-card-shadow space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-full bg-secondary-fixed text-secondary flex items-center justify-center border-2 border-on-surface font-black text-sm">
            <Trophy className="w-4 h-4 text-secondary fill-secondary" />
          </span>
          <div>
            <h3 className="font-display font-black text-base text-on-surface leading-tight">
              Papan Peringkat
            </h3>
            <span className="text-[11px] font-bold text-on-surface-variant">
              Top Learner Komunitas
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchLeaderboard(true)}
            disabled={refreshing}
            className="p-1.5 rounded-lg border border-on-surface bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface-variant"
            title="Refresh Leaderboard"
            aria-label="Refresh Leaderboard"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={fetchFullLeaderboard}
            className="text-xs font-bold text-secondary hover:underline cursor-pointer"
          >
            Lihat Semua
          </button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="py-8 flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
          <span className="text-xs font-bold text-on-surface-variant">Memuat skor peringkat...</span>
        </div>
      ) : users.length === 0 ? (
        <div className="p-4 bg-surface-container-low rounded-xl border border-dashed border-on-surface text-center text-xs text-on-surface-variant font-medium">
          Belum ada pengguna di leaderboard. Jadilah yang pertama meraih XP!
        </div>
      ) : (
        /* Leaderboard Ranking List Top 5 */
        <div className="space-y-2.5">
          {users.map((u) => {
            const isMe = u.isCurrentUser || (authUser && u.id === authUser.id);

            return (
              <div
                key={u.id}
                className={`flex items-center justify-between p-2.5 rounded-xl border-2 transition-transform ${
                  isMe
                    ? "bg-secondary-fixed/40 border-secondary shadow-xs scale-[1.01]"
                    : u.rank === 1
                    ? "bg-amber-100/60 border-on-surface shadow-xs"
                    : "bg-surface-container-low border-outline-variant hover:border-on-surface"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Rank Badge */}
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black border shrink-0 ${getRankBadgeClass(
                      u.rank
                    )}`}
                  >
                    {u.rank === 1 ? "🥇" : u.rank === 2 ? "🥈" : u.rank === 3 ? "🥉" : u.rank}
                  </span>

                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full border border-on-surface overflow-hidden bg-primary-fixed shrink-0 flex items-center justify-center">
                    {u.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={u.avatar_url} alt={u.username} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs font-black uppercase text-primary">
                        {u.username.slice(0, 2)}
                      </span>
                    )}
                  </div>

                  {/* User Details */}
                  <div className="min-w-0">
                    <div className="text-xs font-black text-on-surface flex items-center gap-1.5 truncate">
                      <span className="truncate">{u.full_name || u.username}</span>
                      {isMe && (
                        <span className="text-[9px] bg-secondary text-white px-1.5 py-0.2 rounded-full font-mono font-bold shrink-0">
                          Kamu
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-on-surface-variant font-medium">
                      <span className="font-mono font-bold text-amber-800 bg-amber-200/80 px-1 rounded">
                        Lv.{u.level}
                      </span>
                      <span>•</span>
                      <span>{u.completed_challenges_count} Quest</span>
                    </div>
                  </div>
                </div>

                {/* XP Count */}
                <span className="text-xs font-mono font-black text-secondary shrink-0 ml-2">
                  {u.xp_points.toLocaleString()} XP
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Pinned Card if Current User is Outside Top 5 */}
      {!loading && !isCurrentUserInTop && authUser && (
        <div className="pt-2 border-t border-dashed border-outline-variant">
          <div className="p-3 bg-secondary-fixed/40 rounded-xl border-2 border-secondary flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-secondary text-white font-mono font-black text-xs flex items-center justify-center border border-on-surface">
                {currentUserRank ? `#${currentUserRank}` : "—"}
              </span>
              <div>
                <div className="text-xs font-headline font-black text-on-surface flex items-center gap-1.5">
                  <span>Kamu (@{authUser.username})</span>
                  <span className="text-[9px] bg-secondary text-white px-1.5 py-0.2 rounded-full font-bold">
                    Peringkatmu
                  </span>
                </div>
                <div className="text-[10px] text-on-surface-variant font-medium">
                  Level {authUser.level || 1} • {authUser.rank_title || "Siswa Pemula"}
                </div>
              </div>
            </div>
            <span className="text-xs font-mono font-black text-secondary">
              {authUser.xp_points.toLocaleString()} XP
            </span>
          </div>
        </div>
      )}

      {/* Full Leaderboard Modal */}
      {showFullModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest border-4 border-on-surface rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-brutal space-y-4 max-h-[85vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b-2 border-outline-variant shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-secondary-fixed text-secondary flex items-center justify-center border-2 border-on-surface font-black">
                  🏆
                </span>
                <div>
                  <h3 className="font-display font-black text-lg text-on-surface">
                    Top 25 Papan Peringkat
                  </h3>
                  <p className="text-xs text-on-surface-variant font-medium">
                    Peringkat keseluruhan berdasarkan perolehan XP &amp; quest selesai
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowFullModal(false)}
                className="p-1.5 rounded-full border border-on-surface hover:bg-surface-container transition-colors"
                aria-label="Tutup"
              >
                <X className="w-5 h-5 text-on-surface" />
              </button>
            </div>

            {/* Modal List */}
            <div className="overflow-y-auto space-y-2 flex-1 pr-1">
              {fullLoading ? (
                <div className="py-12 flex flex-col items-center justify-center gap-2">
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                  <span className="text-xs font-bold text-on-surface-variant">Memuat data lengkap...</span>
                </div>
              ) : fullList.length === 0 ? (
                <div className="py-8 text-center text-xs text-on-surface-variant">
                  Tidak ada data leaderboard.
                </div>
              ) : (
                fullList.map((u) => {
                  const isMe = u.isCurrentUser || (authUser && u.id === authUser.id);
                  return (
                    <div
                      key={u.id}
                      className={`flex items-center justify-between p-3 rounded-xl border-2 transition-transform ${
                        isMe
                          ? "bg-secondary-fixed/40 border-secondary shadow-xs"
                          : u.rank === 1
                          ? "bg-amber-100/70 border-on-surface"
                          : "bg-surface-container-low border-outline-variant"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-black border shrink-0 ${getRankBadgeClass(
                            u.rank
                          )}`}
                        >
                          {u.rank === 1 ? "🥇" : u.rank === 2 ? "🥈" : u.rank === 3 ? "🥉" : u.rank}
                        </span>

                        <div className="w-8 h-8 rounded-full border border-on-surface overflow-hidden bg-primary-fixed shrink-0 flex items-center justify-center">
                          {u.avatar_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={u.avatar_url} alt={u.username} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-xs font-black uppercase text-primary">
                              {u.username.slice(0, 2)}
                            </span>
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="text-xs font-black text-on-surface flex items-center gap-1.5 truncate">
                            <span className="truncate">{u.full_name || u.username}</span>
                            {isMe && (
                              <span className="text-[9px] bg-secondary text-white px-1.5 py-0.2 rounded-full font-mono font-bold shrink-0">
                                Kamu
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] text-on-surface-variant font-medium">
                            <span className="font-mono font-bold text-amber-800 bg-amber-200/80 px-1 rounded">
                              Lv.{u.level}
                            </span>
                            <span>•</span>
                            <span>{u.rank_title}</span>
                            <span>•</span>
                            <span>{u.completed_challenges_count} Quest</span>
                          </div>
                        </div>
                      </div>

                      <span className="text-xs font-mono font-black text-secondary shrink-0 ml-2">
                        {u.xp_points.toLocaleString()} XP
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-2 border-t border-outline-variant flex justify-end shrink-0">
              <button
                onClick={() => setShowFullModal(false)}
                className="px-5 py-2.5 bg-surface-container-high hover:bg-surface-container-highest text-on-surface border-2 border-on-surface rounded-xl font-headline font-bold text-xs cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
