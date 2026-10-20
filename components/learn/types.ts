import type React from "react";

export interface ConceptVisualComparison {
  withoutLabel?: string;
  withoutDesc: string;
  withLabel?: string;
  withDesc: string;
  previewCodeWithout?: string;
  previewCodeWith?: string;
}

export interface ConceptDemo {
  conceptTitle: string;
  whyItMatters: string;
  whatIfWithout?: string;
  keyTakeaways?: string[];
  codeExample?: string;
  visualComparison?: ConceptVisualComparison;
}

export interface ChallengeData {
  id: string;
  class_id: string;
  title: string;
  difficulty?: string;
  order_index?: number;
  instruction: string;
  theory?: string | null;
  concept_demo?: ConceptDemo | null;
  conceptDemo?: ConceptDemo | null;
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
    preview?: string;
    concept_demo?: ConceptDemo;
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
