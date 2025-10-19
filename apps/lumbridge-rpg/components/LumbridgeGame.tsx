'use client';

import type Phaser from 'phaser';
import { useEffect, useMemo, useRef } from 'react';

import { createMainScene } from './phaser/createMainScene';
import {
  SKILL_LABELS,
  SKILL_ORDER,
  SKILL_XP_PER_INTERACTION,
  calculateLevelFromXp,
  useLumbridgeStore,
} from '../lib/state/gameStore';

interface SkillSummary {
  key: (typeof SKILL_ORDER)[number];
  label: string;
  xp: number;
  level: number;
}

const LumbridgeGame = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  const playerName = useLumbridgeStore((state) => state.playerName);
  const skills = useLumbridgeStore((state) => state.skills);
  const setPlayerName = useLumbridgeStore((state) => state.setPlayerName);
  const resetProgress = useLumbridgeStore((state) => state.resetProgress);

  const skillSummaries = useMemo<SkillSummary[]>(
    () =>
      SKILL_ORDER.map((skill) => ({
        key: skill,
        label: SKILL_LABELS[skill],
        xp: skills[skill],
        level: calculateLevelFromXp(skills[skill]),
      })),
    [skills]
  );

  useEffect(() => {
    let cancelled = false;

    const boot = async () => {
      if (!containerRef.current || cancelled || gameRef.current) {
        return;
      }

      const PhaserRuntime = (await import('phaser')).default as typeof Phaser;

      if (cancelled) {
        return;
      }

      const MainScene = createMainScene(PhaserRuntime);

      const config: Phaser.Types.Core.GameConfig = {
        type: PhaserRuntime.AUTO,
        parent: containerRef.current,
        backgroundColor: '#020617',
        physics: {
          default: 'arcade',
          arcade: {
            debug: false,
          },
        },
        scale: {
          mode: PhaserRuntime.Scale.FIT,
          autoCenter: PhaserRuntime.Scale.CENTER_BOTH,
          width: 960,
          height: 540,
        },
        scene: [MainScene],
      };

      gameRef.current = new PhaserRuntime.Game(config);
    };

    boot();

    return () => {
      cancelled = true;
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div className="game-page">
      <header className="game-header">
        <p className="game-subtitle">Prototype Sandbox</p>
        <h1 className="game-title">Lumbridge RPG — Phaser Foundations</h1>
        <p className="game-description">
          This sandbox pairs Next.js with Phaser 3 to lay the groundwork for the Lumbridge RPG MVP. Tap or click inside the
          training grounds to cycle through the four launch skills and watch XP accrue in real time.
        </p>
      </header>

      <div className="game-content">
        <section className="scene-card">
          <div ref={containerRef} className="scene-stage" />
        </section>

        <aside className="panel">
          <div>
            <h2>Adventurer Profile</h2>
            <label htmlFor="player-name">Display Name</label>
            <input
              id="player-name"
              value={playerName}
              onChange={(event) => setPlayerName(event.target.value)}
              placeholder="Adventurer"
              className="panel-input"
            />
            <p className="panel-helper">
              Your chosen name appears in the scene banner. Long-term we will persist this to a save slot.
            </p>
          </div>

          <div>
            <h3>Skills (MVP Focus)</h3>
            <ul className="skill-list">
              {skillSummaries.map((summary) => (
                <li key={summary.key} className="skill-item">
                  <div className="skill-item-row">
                    <span>{summary.label}</span>
                    <span>Lvl {summary.level}</span>
                  </div>
                  <span className="skill-item-xp">{summary.xp} xp</span>
                </li>
              ))}
            </ul>
            <p className="skill-note">
              Each click in the prototype grants {SKILL_XP_PER_INTERACTION} XP, rotating through Woodcutting, Fishing, Crafting, and
              Combat.
            </p>
            <button type="button" onClick={resetProgress} className="reset-button">
              Reset XP
            </button>
          </div>
        </aside>
      </div>

      <footer className="footer-card">
        Next steps include loading authentic Lumbridge tilemaps, wiring up quest state via Zustand, and evolving this sandbox into a
        fully navigable slice of Gielinor.
      </footer>
    </div>
  );
};

export default LumbridgeGame;
