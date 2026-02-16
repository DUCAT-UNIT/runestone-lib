import { MAX_DIVISIBILITY } from '../constants';
import { Etching } from '../etching';
import { u128, u64 } from '../integer';
import { None, Some } from '../monads';
import { RuneId } from '../runeid';
import { Runestone } from '../runestone';
import { SpacedRune } from '../spacedrune';
import type { Option } from '../monads';
import type { Terms } from '../terms';
import type { RunestoneSpec } from '../types';
import { u128Strict, u32Strict, u64Strict, u8Strict } from './shared';

/**
 * Low-level function to encode a runestone from a spec.
 */
export function encodeRunestone(runestone: RunestoneSpec): {
  encodedRunestone: Buffer;
  etchingCommitment?: Buffer;
} {
  const mint = runestone.mint
    ? Some(new RuneId(u64Strict(runestone.mint.block), u32Strict(runestone.mint.tx)))
    : None;

  const pointer = runestone.pointer !== undefined ? Some(runestone.pointer).map(u32Strict) : None;

  const edicts = (runestone.edicts ?? []).map((edict) => ({
    id: new RuneId(u64Strict(edict.id.block), u32Strict(edict.id.tx)),
    amount: u128Strict(edict.amount),
    output: u32Strict(edict.output),
  }));

  let etching: Option<Etching> = None;
  let etchingCommitment: Buffer | undefined;

  if (runestone.etching) {
    const etchingSpec = runestone.etching;
    const spacedRune = etchingSpec.runeName ? SpacedRune.fromString(etchingSpec.runeName) : undefined;
    const rune = spacedRune?.rune !== undefined ? Some(spacedRune.rune) : None;

    const symbolCodePoint = etchingSpec.symbol?.codePointAt(0);
    if (
      etchingSpec.symbol &&
      !(
        etchingSpec.symbol.length === 1 ||
        (etchingSpec.symbol.length === 2 &&
          symbolCodePoint !== undefined &&
          symbolCodePoint >= 0x10000)
      )
    ) {
      throw Error('Symbol must be one code point');
    }

    const divisibility =
      etchingSpec.divisibility !== undefined ? Some(etchingSpec.divisibility).map(u8Strict) : None;
    const premine = etchingSpec.premine !== undefined ? Some(etchingSpec.premine).map(u128Strict) : None;
    const spacers =
      spacedRune?.spacers !== undefined && spacedRune.spacers !== 0
        ? Some(u32Strict(spacedRune.spacers))
        : None;
    const symbol = etchingSpec.symbol ? Some(etchingSpec.symbol) : None;

    if (divisibility.isSome() && divisibility.unwrap() > MAX_DIVISIBILITY) {
      throw Error(`Divisibility is greater than protocol max ${MAX_DIVISIBILITY}`);
    }

    let terms: Option<Terms> = None;
    if (etchingSpec.terms) {
      const termsSpec = etchingSpec.terms;

      const amount = termsSpec.amount !== undefined ? Some(termsSpec.amount).map(u128Strict) : None;
      const cap = termsSpec.cap !== undefined ? Some(termsSpec.cap).map(u128Strict) : None;
      const height: [Option<u64>, Option<u64>] = termsSpec.height
        ? [
            termsSpec.height.start !== undefined ? Some(termsSpec.height.start).map(u64Strict) : None,
            termsSpec.height.end !== undefined ? Some(termsSpec.height.end).map(u64Strict) : None,
          ]
        : [None, None];
      const offset: [Option<u64>, Option<u64>] = termsSpec.offset
        ? [
            termsSpec.offset.start !== undefined ? Some(termsSpec.offset.start).map(u64Strict) : None,
            termsSpec.offset.end !== undefined ? Some(termsSpec.offset.end).map(u64Strict) : None,
          ]
        : [None, None];

      if (amount.isSome() && cap.isSome() && amount.unwrap() * cap.unwrap() > u128.MAX) {
        throw Error('Terms overflow with amount times cap');
      }

      terms = Some({ amount, cap, height, offset });
    }

    const turbo = etchingSpec.turbo ?? false;
    etching = Some(new Etching(divisibility, rune, spacers, symbol, terms, premine, turbo));
    etchingCommitment = rune.isSome() ? rune.unwrap().commitment : undefined;
  }

  return {
    encodedRunestone: new Runestone(mint, pointer, edicts, etching).encipher(),
    etchingCommitment,
  };
}
