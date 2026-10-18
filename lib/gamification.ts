/**
 * Codevas Gamification & EXP Progression System
 * Formula and level tier calculation for learners
 */

export interface LevelTier {
  level: number;
  title: string;
  badge: string;
  minXp: number;
  maxXp: number; // XP threshold for next level
}

export const LEVEL_TIERS: LevelTier[] = [
  { level: 1, title: "Siswa Pemula", badge: "🌱", minXp: 0, maxXp: 100 },
  { level: 2, title: "Penjelajah Kode", badge: "⚡", minXp: 100, maxXp: 250 },
  { level: 3, title: "Junior Coder", badge: "🛠️", minXp: 250, maxXp: 500 },
  { level: 4, title: "CSS Artisan", badge: "🎨", minXp: 500, maxXp: 850 },
  { level: 5, title: "Frontend Warrior", badge: "⚔️", minXp: 850, maxXp: 1300 },
  { level: 6, title: "Web Architect", badge: "🏛️", minXp: 1300, maxXp: 1850 },
  { level: 7, title: "Fullstack Knight", badge: "🛡️", minXp: 1850, maxXp: 2500 },
  { level: 8, title: "Code Magician", badge: "🔮", minXp: 2500, maxXp: 3300 },
  { level: 9, title: "Grandmaster", badge: "👑", minXp: 3300, maxXp: 4250 },
  { level: 10, title: "Codevas Legend", badge: "💎", minXp: 4250, maxXp: 100000 },
];

export interface GamificationStats {
  xp_points: number;
  level: number;
  rank_title: string;
  rank_badge: string;
  min_xp: number;
  next_level_xp: number;
  current_level_xp: number;
  xp_remaining: number;
  level_progress_percent: number;
}

export function calculateGamificationStats(totalXp: number = 0): GamificationStats {
  const xp = Math.max(0, Number(totalXp) || 0);

  let tier = LEVEL_TIERS[0];
  for (let i = LEVEL_TIERS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_TIERS[i].minXp) {
      tier = LEVEL_TIERS[i];
      break;
    }
  }

  const isMax = tier.level >= LEVEL_TIERS[LEVEL_TIERS.length - 1].level;
  const levelSpan = tier.maxXp - tier.minXp;
  const currentLevelXp = xp - tier.minXp;
  const xpRemaining = isMax ? 0 : Math.max(0, tier.maxXp - xp);
  const levelProgressPercent = isMax
    ? 100
    : Math.min(100, Math.max(0, Math.floor((currentLevelXp / levelSpan) * 100)));

  return {
    xp_points: xp,
    level: tier.level,
    rank_title: tier.title,
    rank_badge: tier.badge,
    min_xp: tier.minXp,
    next_level_xp: tier.maxXp,
    current_level_xp: currentLevelXp,
    xp_remaining: xpRemaining,
    level_progress_percent: levelProgressPercent,
  };
}

export function checkLevelUp(prevXp: number, newXp: number) {
  const oldStats = calculateGamificationStats(prevXp);
  const newStats = calculateGamificationStats(newXp);

  return {
    leveledUp: newStats.level > oldStats.level,
    oldLevel: oldStats.level,
    newLevel: newStats.level,
    newRankTitle: newStats.rank_title,
    newRankBadge: newStats.rank_badge,
    newStats,
  };
}
