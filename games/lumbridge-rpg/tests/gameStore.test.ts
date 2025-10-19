import assert from 'node:assert/strict';
import test from 'node:test';

import {
  SKILL_ORDER,
  SKILL_XP_PER_INTERACTION,
  calculateLevelFromXp,
  useLumbridgeStore,
} from '../lib/state/gameStore';

test('calculateLevelFromXp respects floor and caps at 20', () => {
  assert.equal(calculateLevelFromXp(0), 1);
  assert.equal(calculateLevelFromXp(-30), 1);
  assert.equal(calculateLevelFromXp(75), 2);
  assert.ok(calculateLevelFromXp(300) > 2);
  assert.ok(calculateLevelFromXp(20000) <= 20);
});

test('store setters trim player names and apply defaults', () => {
  useLumbridgeStore.setState({
    playerName: 'Adventurer',
    skills: {
      woodcutting: 0,
      fishing: 0,
      crafting: 0,
      combat: 0,
    },
  });

  useLumbridgeStore.getState().setPlayerName('   ');
  assert.equal(useLumbridgeStore.getState().playerName, 'Adventurer');

  useLumbridgeStore.getState().setPlayerName('  Lumbridge Hero  ');
  assert.equal(useLumbridgeStore.getState().playerName, 'Lumbridge Hero');
});

test('adding xp updates each skill independently', () => {
  useLumbridgeStore.setState({
    playerName: 'Adventurer',
    skills: {
      woodcutting: 0,
      fishing: 0,
      crafting: 0,
      combat: 0,
    },
  });

  SKILL_ORDER.forEach((skill, index) => {
    const amount = SKILL_XP_PER_INTERACTION * (index + 1);
    useLumbridgeStore.getState().addSkillXp(skill, amount);
    assert.equal(useLumbridgeStore.getState().skills[skill], amount);
  });
});

test('resetProgress zeros all skill xp values', () => {
  useLumbridgeStore.setState({
    playerName: 'Adventurer',
    skills: {
      woodcutting: 50,
      fishing: 40,
      crafting: 30,
      combat: 20,
    },
  });

  useLumbridgeStore.getState().resetProgress();

  assert.deepEqual(useLumbridgeStore.getState().skills, {
    woodcutting: 0,
    fishing: 0,
    crafting: 0,
    combat: 0,
  });
});
