// biome-ignore lint/suspicious/noExplicitAny: reason
export type GConstructor<T extends object> = new (...args: any[]) => T;

export function noop(): void {
  // no-op
}

export function isEmptyObject<T extends object>(obj: T): boolean {
  for (const _name in obj) {
    return false;
  }

  return true;
}

// Return a new object with only the keys defined in the keys array parameter
export function pick<T extends object, U extends keyof T>(
  obj: T,
  keys: readonly U[],
): Partial<Pick<T, U>> {
  const result: Partial<Pick<T, U>> = {};

  for (const key of keys) {
    const val = obj[key];

    if (val !== undefined) {
      result[key] = val;
    }
  }

  return result;
}

export function clamp(n: number, minVal: number, maxVal: number): number {
  return Math.min(Math.max(n, minVal), maxVal);
}

export function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

export interface SpriteRef<T> {
  current?: T;
}

export function spriteRef<T>(): SpriteRef<T> {
  return {};
}
