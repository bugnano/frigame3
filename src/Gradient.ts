import { clamp, pick } from "./utils.js";

export interface ColorObj {
  r: number;
  g: number;
  b: number;
  a: number;
}

export type ColorArr = [number, number, number, number];

export type GradientType = "vertical" | "horizontal";

class Color {
  _r = 0;
  _g = 0;
  _b = 0;
  _a = 1;
  _str = "rgba(0,0,0,1)";

  get r(): number {
    return this._r;
  }

  set r(value: number) {
    this._r = clamp(Math.round(value), 0, 255) || 0;
    this._str = `rgba(${this._r},${this._g},${this._b},${this._a})`;
  }

  get g(): number {
    return this._g;
  }

  set g(value: number) {
    this._g = clamp(Math.round(value), 0, 255) || 0;
    this._str = `rgba(${this._r},${this._g},${this._b},${this._a})`;
  }

  get b(): number {
    return this._b;
  }

  set b(value: number) {
    this._b = clamp(Math.round(value), 0, 255) || 0;
    this._str = `rgba(${this._r},${this._g},${this._b},${this._a})`;
  }

  get a(): number {
    return this._a;
  }

  set a(value: number) {
    this._a = clamp(
      typeof value === "number" && !Number.isNaN(value) ? value : 1,
      0,
      1,
    );
    this._str = `rgba(${this._r},${this._g},${this._b},${this._a})`;
  }

  constructor(options?: Partial<ColorObj>) {
    if (options) {
      Object.assign(this, pick(options, ["r", "g", "b", "a"]));
    }
  }
}

export class Gradient {
  startColor: Color;
  endColor: Color;
  type: GradientType;

  constructor(
    startColor?: Partial<ColorObj> | Partial<ColorArr>,
    endColor?: Partial<ColorObj> | Partial<ColorArr>,
    type: GradientType = "vertical",
  ) {
    const [r, g, b, a] = ((): ColorArr => {
      if (startColor) {
        if (Array.isArray(startColor)) {
          return [
            startColor[0] ?? 0,
            startColor[1] ?? 0,
            startColor[2] ?? 0,
            startColor[3] ?? 1,
          ];
        } else {
          const { r, g, b, a } = startColor;
          return [r ?? 0, g ?? 0, b ?? 0, a ?? 1];
        }
      } else {
        return [0, 0, 0, 1];
      }
    })();

    this.startColor = new Color({ r, g, b, a });

    if (endColor) {
      const [r, g, b, a] = ((): ColorArr => {
        if (Array.isArray(endColor)) {
          return [
            endColor[0] ?? 0,
            endColor[1] ?? 0,
            endColor[2] ?? 0,
            endColor[3] ?? 1,
          ];
        } else {
          const { r, g, b, a } = endColor;
          return [r ?? 0, g ?? 0, b ?? 0, a ?? 1];
        }
      })();

      this.endColor = new Color({ r, g, b, a });
    } else {
      this.endColor = this.startColor;
    }

    this.type = type;
  }
}
