import type { Cenotaph, RunestoneSpec } from '../types';

export function isRunestone(artifact: RunestoneSpec | Cenotaph): artifact is RunestoneSpec {
  return !('flaws' in artifact);
}
