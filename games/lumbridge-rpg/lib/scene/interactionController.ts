import { SKILL_ORDER, SKILL_XP_PER_INTERACTION, type Skill } from '../state/gameStore';

export interface InteractionEffect {
  id: number;
  skill: Skill;
  xPercent: number;
  yPercent: number;
}

export class InteractionController {
  private cycleIndex = 0;
  private effectCounter = 0;

  constructor(private readonly awardXp: (skill: Skill, amount: number) => void) {}

  public resolveNextSkill(): Skill {
    const skill = SKILL_ORDER[this.cycleIndex % SKILL_ORDER.length];
    this.cycleIndex += 1;
    return skill;
  }

  public trigger(offsetX: number, offsetY: number, stageWidth: number, stageHeight: number): InteractionEffect | null {
    if (stageWidth <= 0 || stageHeight <= 0) {
      return null;
    }

    if (offsetX < 0 || offsetY < 0 || offsetX > stageWidth || offsetY > stageHeight) {
      return null;
    }

    const xPercent = (offsetX / stageWidth) * 100;
    const yPercent = (offsetY / stageHeight) * 100;

    const skill = this.resolveNextSkill();
    this.awardXp(skill, SKILL_XP_PER_INTERACTION);

    this.effectCounter += 1;

    return {
      id: this.effectCounter,
      skill,
      xPercent,
      yPercent,
    };
  }

  public resetCycle(): void {
    this.cycleIndex = 0;
  }
}
