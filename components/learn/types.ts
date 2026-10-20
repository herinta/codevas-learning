import type React from "react";

export interface ChallengeData {
  id: string;
  class_id: string;
  title: string;
  difficulty?: string;
  order_index?: number;
  instruction: string;
  theory?: string | null;
  syntax_helpers?: string[];
  hint: string | null;
  xp_reward: number;
  initial_state: string;
  codeSnapshot?: string;
  locked_template?: {
    element?: string;
    itemsCount?: number;
    itemLabels?: string[];
  };
  target_visual?: {
    display?: string;
    flexDirection?: string;
    justifyContent?: string;
    alignItems?: string;
    flexWrap?: string;
    gap?: string;
    description?: string;
  };
}

export interface LiveGoal {
  label: string;
  passed: boolean;
}

export interface LiveEvalResult {
  passed: boolean;
  goals: LiveGoal[];
}

export interface EarnedXpInfo {
  earnedXp: number;
  leveledUp: boolean;
  level: number;
  rankTitle: string;
  newTotalXp?: number;
}

export interface ParsedStyles {
  arenaStyle: React.CSSProperties;
  itemStyles: Record<string, React.CSSProperties>;
}
