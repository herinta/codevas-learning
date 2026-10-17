import React from "react";
import { Trophy, Crown, Sparkles } from "lucide-react";

export interface LeaderboardUser {
  readonly rank: number;
  readonly name: string;
  readonly challengesCount: number;
  readonly xp: number;
  readonly isCurrentUser?: boolean;
  readonly badge?: string;
  readonly avatarBg: string;
}

export const LeaderboardWidget: React.FC = () => {
  const users: LeaderboardUser[] = [
    {
      rank: 1,
      name: "Nadia Rahma",
      challengesCount: 18,
      xp: 2450,
      badge: "👑",
      avatarBg: "bg-primary-fixed text-primary",
    },
    {
      rank: 2,
      name: "Budi Santoso",
      challengesCount: 15,
      xp: 2120,
      avatarBg: "bg-secondary-fixed text-secondary",
    },
    {
      rank: 3,
      name: "Kamu (Alex)",
      challengesCount: 12,
      xp: 1240,
      isCurrentUser: true,
      avatarBg: "bg-tertiary-fixed text-tertiary",
    },
    {
      rank: 4,
      name: "Rian Pratama",
      challengesCount: 11,
      xp: 1090,
      avatarBg: "bg-[#e0f2fe] text-sky-700",
    },
    {
      rank: 5,
      name: "Citra Lestari",
      challengesCount: 9,
      xp: 980,
      avatarBg: "bg-[#fce7f3] text-pink-700",
    },
  ];

  return (
    <div id="leaderboard" className="bg-surface-container-lowest rounded-2xl border-2 border-on-surface p-5 sm:p-6 candy-card-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-full bg-secondary-fixed text-secondary flex items-center justify-center border-2 border-on-surface font-black text-sm">
            🏆
          </span>
          <div>
            <h3 className="font-display font-black text-base text-on-surface leading-tight">
              Weekly Leaderboard
            </h3>
            <span className="text-[11px] font-bold text-on-surface-variant">
              Papan Peringkat Teman Belajar
            </span>
          </div>
        </div>
        <span className="text-xs font-bold text-secondary hover:underline cursor-pointer">
          Lihat Semua
        </span>
      </div>

      {/* Leaderboard Ranking List 1-5 */}
      <div className="space-y-2.5">
        {users.map((u) => {
          if (u.isCurrentUser) {
            return (
              <div
                key={u.rank}
                className="flex items-center justify-between p-2.5 rounded-xl bg-tertiary-fixed/40 border-2 border-tertiary shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-[#d97706] text-white flex items-center justify-center text-xs font-black border border-on-surface">
                    {u.rank}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center font-black text-xs ${u.avatarBg}`}
                  >
                    AX
                  </div>
                  <div>
                    <div className="text-xs font-black text-tertiary flex items-center gap-1.5">
                      <span>{u.name}</span>
                      <span className="text-[9px] bg-tertiary text-white px-1.5 py-0.2 rounded-full font-bold">
                        You
                      </span>
                    </div>
                    <span className="text-[10px] text-on-surface-variant font-medium">
                      {u.challengesCount} Tantangan
                    </span>
                  </div>
                </div>
                <span className="text-xs font-black text-tertiary">
                  {u.xp.toLocaleString()} XP
                </span>
              </div>
            );
          }

          return (
            <div
              key={u.rank}
              className={`flex items-center justify-between p-2.5 rounded-xl border ${
                u.rank === 1
                  ? "bg-primary-fixed/30 border-2 border-on-surface"
                  : "bg-surface-container-low border-outline-variant"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black border border-on-surface ${
                    u.rank === 1
                      ? "bg-[#f59e0b] text-white"
                      : u.rank === 2
                      ? "bg-[#9ca3af] text-white"
                      : "bg-surface-container-high text-on-surface"
                  }`}
                >
                  {u.rank}
                </span>
                <div
                  className={`w-8 h-8 rounded-full border-2 border-on-surface flex items-center justify-center font-black text-xs ${u.avatarBg}`}
                >
                  {u.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="text-xs font-black text-on-surface flex items-center gap-1">
                    <span>{u.name}</span>
                    {u.badge && <span>{u.badge}</span>}
                  </div>
                  <span className="text-[10px] text-on-surface-variant font-medium">
                    {u.challengesCount} Tantangan
                  </span>
                </div>
              </div>
              <span
                className={`text-xs font-black ${
                  u.rank === 1 ? "text-primary" : "text-on-surface"
                }`}
              >
                {u.xp.toLocaleString()} XP
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
