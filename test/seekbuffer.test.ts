/**
 * @fileoverview repos/runestone-ts/test/seekbuffer.test.ts
 */

import { Buff } from '@vbyte/buff';
import { SeekBuffer } from '../src/seekbuffer';

describe('SeekBuffer', () => {
  it('works on empty buffer correctly', () => {
    const seekBuffer = new SeekBuffer(Buff.from([]));
    expect(seekBuffer.isFinished()).toBe(true);
    expect(seekBuffer.readUInt8()).toBeUndefined();
  });

  it('succeeds on readUInt8 call', () => {
    const seekBuffer = new SeekBuffer(Buff.from([123]));
    const uint8 = seekBuffer.readUInt8();
    expect(uint8).toBe(123);
  });

  it('consumes on repeated readUInt8 calls', () => {
    const seekBuffer = new SeekBuffer(Buff.from([2, 4, 6, 8, 10]));
    const bytes = [
      seekBuffer.readUInt8(),
      seekBuffer.readUInt8(),
      seekBuffer.readUInt8(),
      seekBuffer.readUInt8(),
      seekBuffer.readUInt8(),
    ];
    expect(bytes).toEqual([2, 4, 6, 8, 10]);
  });

  it('correct states isFinished at the appropriate time', () => {
    const seekBuffer = new SeekBuffer(Buff.from([2, 4, 6, 8, 10]));

    expect(seekBuffer.isFinished()).toBe(false);
    expect(seekBuffer.readUInt8()).not.toBeUndefined();
    expect(seekBuffer.isFinished()).toBe(false);
    expect(seekBuffer.readUInt8()).not.toBeUndefined();
    expect(seekBuffer.isFinished()).toBe(false);
    expect(seekBuffer.readUInt8()).not.toBeUndefined();
    expect(seekBuffer.isFinished()).toBe(false);
    expect(seekBuffer.readUInt8()).not.toBeUndefined();
    expect(seekBuffer.isFinished()).toBe(false);
    expect(seekBuffer.readUInt8()).not.toBeUndefined();

    expect(seekBuffer.isFinished()).toBe(true);
    expect(seekBuffer.readUInt8()).toBeUndefined();
  });
});
