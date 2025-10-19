import assert from 'node:assert/strict';
import test from 'node:test';

import { SKILL_ORDER, SKILL_XP_PER_INTERACTION } from '../lib/state/gameStore';
import { InteractionController } from '../lib/scene/interactionController';

test('InteractionController cycles through skills and awards xp', () => {
  const awarded: Array<{ skill: string; amount: number }> = [];
  const controller = new InteractionController((skill, amount) => {
    awarded.push({ skill, amount });
  });

  const effect = controller.trigger(30, 40, 300, 200);
  assert.ok(effect);
  if (effect) {
    assert.equal(effect.skill, SKILL_ORDER[0]);
    assert.equal(effect.xPercent, (30 / 300) * 100);
    assert.equal(effect.yPercent, (40 / 200) * 100);
    assert.equal(effect.id, 1);
  }

  const second = controller.trigger(60, 100, 300, 200);
  assert.ok(second);
  if (second) {
    assert.equal(second.skill, SKILL_ORDER[1]);
    assert.equal(second.id, 2);
  }

  assert.deepEqual(awarded, [
    { skill: SKILL_ORDER[0], amount: SKILL_XP_PER_INTERACTION },
    { skill: SKILL_ORDER[1], amount: SKILL_XP_PER_INTERACTION },
  ]);
});

test('InteractionController ignores invalid stage metrics', () => {
  const controller = new InteractionController(() => undefined);

  assert.equal(controller.trigger(10, 10, 0, 100), null);
  assert.equal(controller.trigger(-10, 10, 100, 100), null);
  assert.equal(controller.trigger(10, 300, 100, 200), null);
});

test('resetCycle rewinds to the first skill', () => {
  const controller = new InteractionController(() => undefined);
  controller.trigger(10, 10, 100, 100);
  controller.trigger(10, 10, 100, 100);

  controller.resetCycle();
  const effect = controller.trigger(10, 10, 100, 100);
  assert.ok(effect);
  if (effect) {
    assert.equal(effect.skill, SKILL_ORDER[0]);
  }
});
