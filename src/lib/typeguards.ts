import type { Cenotaph, RunestoneSpec } from '../types/index.js';

export function isRunestone(artifact: RunestoneSpec | Cenotaph): artifact is RunestoneSpec {
  return !('flaws' in artifact);
}
