import type Phaser from 'phaser';

import {
  SKILL_LABELS,
  SKILL_ORDER,
  SKILL_XP_PER_INTERACTION,
  type Skill,
  useLumbridgeStore,
} from '../../lib/state/gameStore';

const formatSkillLine = (skill: Skill, xp: number): string => {
  const label = SKILL_LABELS[skill];
  return `${label.padEnd(12, ' ')} ${xp.toString().padStart(4, ' ')} xp`;
};

export const createMainScene = (PhaserModule: typeof Phaser) => {
  class MainScene extends PhaserModule.Scene {
    private cycleIndex = 0;
    private skillTracker?: PhaserModule.GameObjects.Text;
    private unsubscribeStore?: () => void;
    private pointerHandler?: (pointer: PhaserModule.Input.Pointer) => void;

    constructor() {
      super('LumbridgeMainScene');
    }

    preload(): void {
      this.load.setBaseURL('');
    }

    create(): void {
      this.cameras.main.setBackgroundColor('#0f172a');

      const { centerX, centerY } = this.cameras.main;
      const { playerName } = useLumbridgeStore.getState();

      this.add
        .text(centerX, 48, 'Lumbridge RPG Prototype', {
          fontFamily: 'Georgia, serif',
          fontSize: '36px',
          color: '#eab308',
        })
        .setOrigin(0.5, 0.5)
        .setShadow(2, 2, '#1f2937', 4, true, true);

      this.add
        .text(centerX, 96, `Welcome, ${playerName}!`, {
          fontFamily: 'Georgia, serif',
          fontSize: '20px',
          color: '#f8fafc',
        })
        .setOrigin(0.5, 0.5);

      const groundWidth = 720;
      const groundHeight = 360;

      this.add
        .grid(centerX, centerY + 40, groundWidth, groundHeight, 60, 60, 0x1e3a8a, 0x1d4ed8, 0.16, 0.24)
        .setAltFillStyle(0x172554, 0.24)
        .setAltStrokeStyle(0x3b82f6, 0.3);

      this.add
        .rectangle(centerX, centerY + 40, groundWidth + 16, groundHeight + 16)
        .setStrokeStyle(2, 0x2563eb, 0.6)
        .setFillStyle(0x0b1120, 0.1);

      this.skillTracker = this.add
        .text(36, 140, this.composeSkillBlock(useLumbridgeStore.getState().skills), {
          fontFamily: 'monospace',
          fontSize: '18px',
          color: '#bae6fd',
          align: 'left',
          lineSpacing: 8,
        })
        .setDepth(5)
        .setShadow(1, 1, '#0f172a', 2, true, true);

      this.unsubscribeStore = useLumbridgeStore.subscribe((state) => {
        if (this.skillTracker) {
          this.skillTracker.setText(this.composeSkillBlock(state.skills));
        }
      });

      this.pointerHandler = (pointer: PhaserModule.Input.Pointer) => {
        const skill = this.resolveNextSkill();
        useLumbridgeStore.getState().addSkillXp(skill, SKILL_XP_PER_INTERACTION);

        const label = this.add
          .text(pointer.worldX, pointer.worldY, `+${SKILL_XP_PER_INTERACTION} ${SKILL_LABELS[skill]}`, {
            fontFamily: 'monospace',
            fontSize: '16px',
            color: '#fde68a',
            stroke: '#1f2937',
            strokeThickness: 2,
          })
          .setOrigin(0.5, 0.5)
          .setDepth(10);

        this.tweens.add({
          targets: label,
          alpha: 0,
          y: label.y - 40,
          duration: 750,
          ease: PhaserModule.Math.Easing.Cubic.Out,
          onComplete: () => label.destroy(),
        });

        const ripple = this.add
          .ellipse(pointer.worldX, pointer.worldY, 32, 32, 0x60a5fa, 0.18)
          .setStrokeStyle(2, 0x60a5fa, 0.6)
          .setDepth(4);

        this.tweens.add({
          targets: ripple,
          scaleX: 2.6,
          scaleY: 2.6,
          alpha: 0,
          duration: 500,
          ease: PhaserModule.Math.Easing.Cubic.In,
          onComplete: () => ripple.destroy(),
        });
      };

      this.input.on(PhaserModule.Input.Events.POINTER_DOWN, this.pointerHandler);
    }

    shutdown(): void {
      this.cleanup();
    }

    destroy(): void {
      this.cleanup();
      super.destroy();
    }

    private cleanup(): void {
      if (this.unsubscribeStore) {
        this.unsubscribeStore();
        this.unsubscribeStore = undefined;
      }

      if (this.pointerHandler) {
        this.input.off(PhaserModule.Input.Events.POINTER_DOWN, this.pointerHandler);
        this.pointerHandler = undefined;
      }
    }

    private composeSkillBlock(skills: Record<Skill, number>): string {
      return SKILL_ORDER.map((skill) => formatSkillLine(skill, skills[skill])).join('\n');
    }

    private resolveNextSkill(): Skill {
      const skill = SKILL_ORDER[this.cycleIndex % SKILL_ORDER.length];
      this.cycleIndex += 1;
      return skill;
    }
  }

  return MainScene;
};
