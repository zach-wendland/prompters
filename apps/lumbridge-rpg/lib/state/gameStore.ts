import { create } from 'zustand';

export type Skill = 'woodcutting' | 'fishing' | 'crafting' | 'combat';

export const SKILL_LABELS: Record<Skill, string> = {
  woodcutting: 'Woodcutting',
  fishing: 'Fishing',
  crafting: 'Crafting',
  combat: 'Combat',
};

export const SKILL_XP_PER_INTERACTION = 25;

export interface SkillState {
  woodcutting: number;
  fishing: number;
  crafting: number;
  combat: number;
}

export interface LumbridgeState {
  playerName: string;
  skills: SkillState;
  setPlayerName: (playerName: string) => void;
  addSkillXp: (skill: Skill, amount: number) => void;
  resetProgress: () => void;
}

const createInitialSkills = (): SkillState => ({
  woodcutting: 0,
  fishing: 0,
  crafting: 0,
  combat: 0,
});

export const calculateLevelFromXp = (xp: number): number => {
  if (xp <= 0) {
    return 1;
  }

  const adjusted = Math.max(xp, 0);
  const level = Math.floor(Math.sqrt(adjusted / 75));

  return Math.min(20, level + 1);
};

export const useLumbridgeStore = create<LumbridgeState>((set) => ({
  playerName: 'Adventurer',
  skills: createInitialSkills(),
  setPlayerName: (playerName) =>
    set(() => ({
      playerName: playerName.trim().length > 0 ? playerName.trim() : 'Adventurer',
    })),
  addSkillXp: (skill, amount) =>
    set((state) => {
      const increment = Math.max(0, amount);

      if (increment === 0) {
        return state;
      }

      return {
        skills: {
          ...state.skills,
          [skill]: state.skills[skill] + increment,
        },
      };
    }),
  resetProgress: () =>
    set(() => ({
      skills: createInitialSkills(),
    })),
}));

export const SKILL_ORDER: Skill[] = ['woodcutting', 'fishing', 'crafting', 'combat'];
