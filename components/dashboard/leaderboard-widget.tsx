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
    if (rank === 1) return "bg-[#FEF08A] text-slate-900 border-2 border-slate-900 shadow-[0_2px_0_#0f172a]";
    if (rank === 2) return "bg-[#E0F2FE] text-slate-900 border-2 border-slate-900 shadow-[0_2px_0_#0f172a]";
    if (rank === 3) return "bg-[#FECDD3] text-slate-900 border-2 border-slate-900 shadow-[0_2px_0_#0f172a]";
    return "bg-slate-100 text-slate-700 border-2 border-slate-900";
  };

  // Check if current user is within the top 5
  const isCurrentUserInTop = users.some((u) => u.isCurrentUser || (authUser && u.id === authUser.id));

  return (
    <div id="leaderboard" className="bg-white rounded-3xl border-3 sm:border-4 border-slate-900 p-5 sm:p-6 shadow-[0_6px_0_#0f172a] space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-xl bg-[#FEF08A] text-slate-900 flex items-center justify-center border-2 border-slate-900 shadow-[0_2px_0_#0f172a]">
            <Trophy className="w-5 h-5 text-amber-700 fill-amber-500" />
          </span>
          <div>
            <h3 className="font-display font-black text-lg text-slate-900 leading-tight">
              Papan Peringkat
            </h3>
            <span className="text-[11px] font-bold text-slate-500">
              Top Learner Komunitas
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchLeaderboard(true)}
            disabled={refreshing}
            className="p-2 rounded-xl border-2 border-slate-900 bg-white hover:bg-slate-100 transition-colors text-slate-900 shadow-[0_2px_0_#0f172a] cursor-pointer"
            title="Refresh Leaderboard"
            aria-label="Refresh Leaderboard"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={fetchFullLeaderboard}
            className="px-2.5 py-1 text-xs font-display font-black text-slate-900 bg-[#E0F2FE] hover:bg-[#BAE6FD] border-2 border-slate-900 rounded-lg shadow-[0_2px_0_#0f172a] cursor-pointer transition-transform hover:-translate-y-0.5 active:translate-y-0.5"
          >
            Lihat Semua
          </button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="py-8 flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-6 h-6 text-[#EF4444] animate-spin" />
          <span className="text-xs font-bold text-slate-600">Memuat skor peringkat...</span>
        </div>
      ) : users.length === 0 ? (
        <div className="p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-900 text-center text-xs text-slate-600 font-bold">
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
                className={`flex items-center justify-between p-3 rounded-2xl border-2 sm:border-3 transition-transform ${
                  isMe
                    ? "bg-[#FEF08A]/50 border-slate-900 shadow-[0_3px_0_#0f172a] scale-[1.01]"
                    : u.rank === 1
                    ? "bg-amber-50 border-slate-900 shadow-[0_2px_0_#0f172a]"
                    : "bg-slate-50 border-slate-900 hover:bg-white"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Rank Badge */}
                  <span
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-mono font-black shrink-0 ${getRankBadgeClass(
                      u.rank
                    )}`}
                  >
                    {u.rank === 1 ? "🥇" : u.rank === 2 ? "🥈" : u.rank === 3 ? "🥉" : u.rank}
                  </span>

                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-xl border-2 border-slate-900 overflow-hidden bg-[#BAE6FD] shrink-0 flex items-center justify-center">
                    {u.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={u.avatar_url} alt={u.username} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs font-black uppercase text-slate-900">
                        {u.username.slice(0, 2)}
                      </span>
                    )}
                  </div>

                  {/* User Details */}
                  <div className="min-w-0">
                    <div className="text-xs font-display font-black text-slate-900 flex items-center gap-1.5 truncate">
                      <span className="truncate">{u.full_name || u.username}</span>
                      {isMe && (
                        <span className="text-[9px] bg-[#EF4444] text-white px-1.5 py-0.5 rounded-md font-mono font-black border border-slate-900 shrink-0">
                          Kamu
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-600 font-bold">
                      <span className="font-mono font-black text-slate-900 bg-[#FEF08A] px-1 rounded border border-slate-900">
                        Lv.{u.level}
                      </span>
                      <span>•</span>
                      <span>{u.completed_challenges_count} Quest</span>
                    </div>
                  </div>
                </div>

                {/* XP Count */}
                <span className="text-xs font-mono font-black text-slate-900 bg-white px-2 py-1 rounded-lg border border-slate-900 shadow-xs shrink-0 ml-2">
                  {u.xp_points.toLocaleString()} XP
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Pinned Card if Current User is Outside Top 5 */}
      {!loading && !isCurrentUserInTop && authUser && (
        <div className="pt-2 border-t-2 border-dashed border-slate-300">
          <div className="p-3.5 bg-[#FEF08A]/40 rounded-2xl border-3 border-slate-900 flex items-center justify-between shadow-[0_3px_0_#0f172a]">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-slate-900 text-white font-mono font-black text-xs flex items-center justify-center border border-slate-900">
                {currentUserRank ? `#${currentUserRank}` : "—"}
              </span>
              <div>
                <div className="text-xs font-display font-black text-slate-900 flex items-center gap-1.5">
                  <span>Kamu (@{authUser.username})</span>
                  <span className="text-[9px] bg-[#EF4444] text-white px-1.5 py-0.5 rounded-md font-mono font-black border border-slate-900">
                    Peringkatmu
                  </span>
                </div>
                <div className="text-[10px] text-slate-700 font-bold">
                  Level {authUser.level || 1} • {authUser.rank_title || "Siswa Pemula"}
                </div>
              </div>
            </div>
            <span className="text-xs font-mono font-black text-slate-900 bg-white px-2 py-1 rounded-lg border border-slate-900 shadow-xs">
              {authUser.xp_points.toLocaleString()} XP
            </span>
          </div>
        </div>
      )}

      {/* Full Leaderboard Modal */}
      {showFullModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border-4 border-slate-900 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-[0_12px_0_#0f172a] space-y-4 max-h-[85vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b-2 border-slate-900 shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-xl bg-[#FEF08A] text-slate-900 flex items-center justify-center border-2 border-slate-900 shadow-[0_2px_0_#0f172a] font-black">
                  🏆
                </span>
                <div>
                  <h3 className="font-display font-black text-xl text-slate-900">
                    Top 25 Papan Peringkat
                  </h3>
                  <p className="text-xs text-slate-600 font-medium">
                    Peringkat keseluruhan berdasarkan perolehan XP &amp; quest selesai
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowFullModal(false)}
                className="p-2 rounded-xl border-2 border-slate-900 bg-white hover:bg-slate-100 transition-colors shadow-[0_2px_0_#0f172a] cursor-pointer"
                aria-label="Tutup"
              >
                <X className="w-5 h-5 text-slate-900" />
              </button>
            </div>

            {/* Modal List */}
            <div className="overflow-y-auto space-y-2 flex-1 pr-1">
              {fullLoading ? (
                <div className="py-12 flex flex-col items-center justify-center gap-2">
                  <Loader2 className="w-6 h-6 text-[#EF4444] animate-spin" />
                  <span className="text-xs font-bold text-slate-600">Memuat data lengkap...</span>
                </div>
              ) : fullList.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-600 font-bold">
                  Tidak ada data leaderboard.
                </div>
              ) : (
                fullList.map((u) => {
                  const isMe = u.isCurrentUser || (authUser && u.id === authUser.id);
                  return (
                    <div
                      key={u.id}
                      className={`flex items-center justify-between p-3 rounded-2xl border-2 transition-transform ${
                        isMe
                          ? "bg-[#FEF08A]/50 border-slate-900 shadow-[0_2px_0_#0f172a]"
                          : u.rank === 1
                          ? "bg-amber-50 border-slate-900"
                          : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-mono font-black shrink-0 ${getRankBadgeClass(
                            u.rank
                          )}`}
                        >
                          {u.rank === 1 ? "🥇" : u.rank === 2 ? "🥈" : u.rank === 3 ? "🥉" : u.rank}
                        </span>

                        <div className="w-8 h-8 rounded-xl border-2 border-slate-900 overflow-hidden bg-[#BAE6FD] shrink-0 flex items-center justify-center">
                          {u.avatar_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={u.avatar_url} alt={u.username} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-xs font-black uppercase text-slate-900">
                              {u.username.slice(0, 2)}
                            </span>
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="text-xs font-display font-black text-slate-900 flex items-center gap-1.5 truncate">
                            <span className="truncate">{u.full_name || u.username}</span>
                            {isMe && (
                              <span className="text-[9px] bg-[#EF4444] text-white px-1.5 py-0.5 rounded-md font-mono font-black border border-slate-900 shrink-0">
                                Kamu
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-600 font-bold">
                            <span className="font-mono font-black text-slate-900 bg-[#FEF08A] px-1 rounded border border-slate-900">
                              Lv.{u.level}
                            </span>
                            <span>•</span>
                            <span>{u.rank_title}</span>
                            <span>•</span>
                            <span>{u.completed_challenges_count} Quest</span>
                          </div>
                        </div>
                      </div>

                      <span className="text-xs font-mono font-black text-slate-900 bg-white px-2 py-1 rounded-lg border border-slate-900 shadow-xs shrink-0 ml-2">
                        {u.xp_points.toLocaleString()} XP
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t-2 border-slate-900 flex justify-end shrink-0">
              <button
                onClick={() => setShowFullModal(false)}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white border-2 border-slate-900 rounded-xl font-display font-black text-xs shadow-[0_3px_0_#0f172a] cursor-pointer"
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
