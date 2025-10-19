'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { MouseEvent } from 'react';

import {
  SKILL_LABELS,
  SKILL_ORDER,
  SKILL_XP_PER_INTERACTION,
  calculateLevelFromXp,
  useLumbridgeStore,
} from '../lib/state/gameStore';
import { InteractionController, type InteractionEffect } from '../lib/scene/interactionController';

interface SkillSummary {
  key: (typeof SKILL_ORDER)[number];
  label: string;
  xp: number;
  level: number;
}

const EFFECT_DURATION_MS = 750;

const LumbridgeGame = () => {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const controllerRef = useRef<InteractionController | null>(null);
  const [effects, setEffects] = useState<InteractionEffect[]>([]);

  const playerName = useLumbridgeStore((state) => state.playerName);
  const skills = useLumbridgeStore((state) => state.skills);
  const setPlayerName = useLumbridgeStore((state) => state.setPlayerName);
  const resetProgress = useLumbridgeStore((state) => state.resetProgress);
  const addSkillXp = useLumbridgeStore((state) => state.addSkillXp);

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

  const triggerInteraction = useCallback(
    (offsetX: number, offsetY: number) => {
      const stage = stageRef.current;

      if (!stage) {
        return;
      }

      const rect = stage.getBoundingClientRect();

      const controller = controllerRef.current;

      if (!controller) {
        return;
      }

      const effect = controller.trigger(offsetX, offsetY, rect.width, rect.height);

      if (!effect) {
        return;
      }

      setEffects((current) => [...current, effect]);

      window.setTimeout(() => {
        setEffects((current) => current.filter((candidate) => candidate.id !== effect.id));
      }, EFFECT_DURATION_MS);
    },
    []
  );

  useEffect(() => {
    controllerRef.current = new InteractionController(addSkillXp);
  }, [addSkillXp]);

  useEffect(() => {
    const stage = stageRef.current;

    if (!stage) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) {
        return;
      }

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        const rect = stage.getBoundingClientRect();
        triggerInteraction(rect.width / 2, rect.height / 2);
      }
    };

    stage.addEventListener('keydown', handleKeyDown);

    return () => {
      stage.removeEventListener('keydown', handleKeyDown);
    };
  }, [triggerInteraction]);

  const handleStageClick = (event: MouseEvent<HTMLDivElement>) => {
    const stage = stageRef.current;

    if (!stage) {
      return;
    }

    const rect = stage.getBoundingClientRect();
    triggerInteraction(event.clientX - rect.left, event.clientY - rect.top);
  };

  return (
    <div className="game-page">
      <header className="game-header">
        <p className="game-subtitle">Prototype Sandbox</p>
        <h1 className="game-title">Lumbridge RPG — Foundations</h1>
        <p className="game-description">
          This sandbox pairs Next.js with a custom interactive training ground to lay the groundwork for the Lumbridge RPG MVP.
          Tap or click inside the training grounds to cycle through the four launch skills and watch XP accrue in real time.
        </p>
      </header>

      <div className="game-content">
        <section className="scene-card">
          <div
            ref={stageRef}
            className="scene-stage"
            role="button"
            tabIndex={0}
            data-testid="scene-stage"
            onClick={handleStageClick}
          >
            <div className="scene-banner">
              <span className="scene-banner-title">Lumbridge RPG Prototype</span>
              <span className="scene-banner-subtitle">Welcome, {playerName}!</span>
            </div>

            <div className="scene-grid" aria-hidden="true" />

            <div className="scene-overlay">
              <div className="scene-instructions">Click anywhere to train</div>
              <ul className="scene-skill-list">
                {skillSummaries.map((summary) => (
                  <li key={summary.key} className="scene-skill-item">
                    <span className="scene-skill-name">{summary.label}</span>
                    <span className="scene-skill-value">{summary.xp} xp · lvl {summary.level}</span>
                  </li>
                ))}
              </ul>
            </div>

            {effects.map((effect) => (
              <div
                key={effect.id}
                className="xp-effect"
                style={{ left: `${effect.xPercent}%`, top: `${effect.yPercent}%` }}
                data-testid="xp-effect"
              >
                <span className="xp-effect-label">+{SKILL_XP_PER_INTERACTION} {SKILL_LABELS[effect.skill]}</span>
                <span className="xp-effect-ripple" />
              </div>
            ))}
          </div>
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
              Each click in the prototype grants {SKILL_XP_PER_INTERACTION} XP, rotating through Woodcutting, Fishing, Crafting,
              and Combat.
            </p>
            <button type="button" onClick={resetProgress} className="reset-button">
              Reset XP
            </button>
          </div>
        </aside>
      </div>

      <footer className="footer-card">
        Next steps include loading authentic Lumbridge tilemaps, wiring up quest state via Zustand, and evolving this sandbox into
        a fully navigable slice of Gielinor.
      </footer>
    </div>
  );
};

export default LumbridgeGame;
