import { useSyncExternalStore } from 'react';

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

const listeners = new Set<() => void>();

const notify = () => {
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

let currentState: LumbridgeState;

const setState = (partial: Partial<LumbridgeState>) => {
  currentState = {
    ...currentState,
    ...partial,
  };
  notify();
};

const getState = () => currentState;

const initializeState = (): LumbridgeState => ({
  playerName: 'Adventurer',
  skills: createInitialSkills(),
  setPlayerName: (playerName: string) => {
    const trimmed = playerName.trim();
    setState({ playerName: trimmed.length > 0 ? trimmed : 'Adventurer' });
  },
  addSkillXp: (skill: Skill, amount: number) => {
    const increment = Math.max(0, amount);
    if (increment === 0) {
      return;
    }

    setState({
      skills: {
        ...currentState.skills,
        [skill]: currentState.skills[skill] + increment,
      },
    });
  },
  resetProgress: () => {
    setState({ skills: createInitialSkills() });
  },
});

currentState = initializeState();

export const calculateLevelFromXp = (xp: number): number => {
  if (xp <= 0) {
    return 1;
  }

  const adjusted = Math.max(xp, 0);
  const level = Math.floor(Math.sqrt(adjusted / 75));

  return Math.min(20, level + 1);
};

export interface LumbridgeStoreHook {
  <T>(selector: (state: LumbridgeState) => T): T;
  getState: () => LumbridgeState;
  setState: (updater: Partial<LumbridgeState> | ((state: LumbridgeState) => LumbridgeState)) => void;
  subscribe: (listener: () => void) => () => void;
}

export const useLumbridgeStore = ((selector) =>
  useSyncExternalStore(subscribe, () => selector(getState()))
) as LumbridgeStoreHook;

useLumbridgeStore.getState = getState;
useLumbridgeStore.setState = (updater) => {
  const nextState = typeof updater === 'function' ? updater(currentState) : { ...currentState, ...updater };
  currentState = nextState;
  notify();
};
useLumbridgeStore.subscribe = subscribe;

export const SKILL_ORDER: Skill[] = ['woodcutting', 'fishing', 'crafting', 'combat'];
