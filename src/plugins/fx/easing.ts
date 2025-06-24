// biome-ignore-all lint/style/noParameterAssign: reason

export function linear(t: number): number {
  return t;
}

export function swing(t: number): number {
  return 0.5 - Math.cos(t * Math.PI) / 2;
}

export function easeInQuad(t: number): number {
  return t * t;
}

export function easeOutQuad(t: number): number {
  return -(t * (t - 2));
}

export function easeInOutQuad(t: number): number {
  t *= 2;

  if (t < 1) {
    return (t * t) / 2;
  }

  t -= 1;

  return -(t * (t - 2) - 1) / 2;
}

export function easeInCubic(t: number): number {
  return t * t * t;
}

export function easeOutCubic(t: number): number {
  t -= 1;

  return t * t * t + 1;
}

export function easeInOutCubic(t: number): number {
  t *= 2;

  if (t < 1) {
    return (t * t * t) / 2;
  }

  t -= 2;

  return (t * t * t + 2) / 2;
}

export function easeInQuart(t: number): number {
  return t * t * t * t;
}

export function easeOutQuart(t: number): number {
  t -= 1;

  return -(t * t * t * t - 1);
}

export function easeInOutQuart(t: number): number {
  t *= 2;

  if (t < 1) {
    return (t * t * t * t) / 2;
  }

  t -= 2;

  return -(t * t * t * t - 2) / 2;
}

export function easeInQuint(t: number): number {
  return t * t * t * t * t;
}

export function easeOutQuint(t: number): number {
  t -= 1;

  return t * t * t * t * t + 1;
}

export function easeInOutQuint(t: number): number {
  t *= 2;

  if (t < 1) {
    return (t * t * t * t * t) / 2;
  }

  t -= 2;

  return (t * t * t * t * t + 2) / 2;
}

export function easeInSine(t: number): number {
  return -Math.cos(t * (Math.PI / 2)) + 1;
}

export function easeOutSine(t: number): number {
  return Math.sin(t * (Math.PI / 2));
}

export function easeInOutSine(t: number): number {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}

export function easeInExpo(t: number): number {
  return t === 0 ? 0 : Math.pow(2, 10 * (t - 1));
}

export function easeOutExpo(t: number): number {
  return t === 1 ? 1 : -Math.pow(2, -10 * t) + 1;
}

export function easeInOutExpo(t: number): number {
  if (t === 0) {
    return 0;
  }

  if (t === 1) {
    return 1;
  }

  t *= 2;

  if (t < 1) {
    return Math.pow(2, 10 * (t - 1)) / 2;
  }

  t -= 1;

  return (-Math.pow(2, -10 * t) + 2) / 2;
}

export function easeInCirc(t: number): number {
  return -(Math.sqrt(1 - t * t) - 1);
}

export function easeOutCirc(t: number): number {
  t -= 1;

  return Math.sqrt(1 - t * t);
}

export function easeInOutCirc(t: number): number {
  t *= 2;

  if (t < 1) {
    return -(Math.sqrt(1 - t * t) - 1) / 2;
  }

  t -= 2;

  return (Math.sqrt(1 - t * t) + 1) / 2;
}

export function easeInElastic(t: number): number {
  const p = 0.3;
  const s = p / 4;

  if (t === 0) {
    return 0;
  }

  if (t === 1) {
    return 1;
  }

  t -= 1;

  return -(Math.pow(2, 10 * t) * Math.sin(((t - s) * (2 * Math.PI)) / p));
}

export function easeOutElastic(t: number): number {
  const p = 0.3;
  const s = p / 4;

  if (t === 0) {
    return 0;
  }

  if (t === 1) {
    return 1;
  }

  return Math.pow(2, -10 * t) * Math.sin(((t - s) * (2 * Math.PI)) / p) + 1;
}

export function easeInOutElastic(t: number): number {
  const p = 0.45;
  const s = p / 4;

  if (t === 0) {
    return 0;
  }

  t *= 2;
  if (t === 2) {
    return 1;
  }

  if (t < 1) {
    t -= 1;

    return -(Math.pow(2, 10 * t) * Math.sin(((t - s) * (2 * Math.PI)) / p)) / 2;
  }

  t -= 1;

  return (
    (Math.pow(2, -10 * t) * Math.sin(((t - s) * (2 * Math.PI)) / p)) / 2 + 1
  );
}

export function easeInBack(t: number): number {
  const s = 1.70158;

  return t * t * ((s + 1) * t - s);
}

export function easeOutBack(t: number): number {
  const s = 1.70158;

  t -= 1;

  return t * t * ((s + 1) * t + s) + 1;
}

export function easeInOutBack(t: number): number {
  const s = 1.70158 * 1.525;

  t *= 2;

  if (t < 1) {
    return (t * t * ((s + 1) * t - s)) / 2;
  }

  t -= 2;

  return (t * t * ((s + 1) * t + s) + 2) / 2;
}
export function easeInBounce(t: number): number {
  return 1 - easeOutBounce(1 - t);
}

export function easeOutBounce(t: number): number {
  if (t < 1 / 2.75) {
    return 7.5625 * t * t;
  }

  if (t < 2 / 2.75) {
    t -= 1.5 / 2.75;

    return 7.5625 * (t * t) + 0.75;
  }

  if (t < 2.5 / 2.75) {
    t -= 2.25 / 2.75;

    return 7.5625 * (t * t) + 0.9375;
  }

  t -= 2.625 / 2.75;

  return 7.5625 * (t * t) + 0.984375;
}

export function easeInOutBounce(t: number): number {
  if (t < 0.5) {
    return easeInBounce(t * 2) / 2;
  }

  return easeOutBounce(t * 2 - 1) / 2 + 0.5;
}
