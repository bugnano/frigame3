import { REFRESH_RATE } from "./defines.js";

export type GConstructor<T extends object> = new (...args: any[]) => T;

export function noop() {
  // no-op
}

export function isEmptyObject<T extends object>(obj: T) {
  for (const name in obj) {
    return false;
  }

  return true;
}

// Return a new object with only the keys defined in the keys array parameter
export function pick<T extends object, U extends keyof T>(
  obj: T,
  keys: readonly U[]
) {
  const result: Partial<Pick<T, U>> = {};

  for (const key of keys) {
    const val = obj[key];

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (val !== undefined) {
      result[key] = val;
    }
  }

  return result;
}

export function clamp(n: number, minVal: number, maxVal: number) {
  return Math.min(Math.max(n, minVal), maxVal);
}

export function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

export function framesFromMs(ms: number) {
  return Math.max(Math.round(ms / REFRESH_RATE), 1) || 1;
}

export function msFromFrames(frames: number) {
  return frames * REFRESH_RATE || 0;
}

export interface SpriteRef<T> {
  current?: T;
}

export function spriteRef<T>(): SpriteRef<T> {
  return {};
}
