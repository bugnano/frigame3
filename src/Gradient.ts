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

  get r() {
    return this._r;
  }

  set r(value: number) {
    this._r = clamp(Math.round(value), 0, 255) || 0;
    this._str = `rgba(${this._r},${this._g},${this._b},${this._a})`;
  }

  get g() {
    return this._g;
  }

  set g(value: number) {
    this._g = clamp(Math.round(value), 0, 255) || 0;
    this._str = `rgba(${this._r},${this._g},${this._b},${this._a})`;
  }

  get b() {
    return this._b;
  }

  set b(value: number) {
    this._b = clamp(Math.round(value), 0, 255) || 0;
    this._str = `rgba(${this._r},${this._g},${this._b},${this._a})`;
  }

  get a() {
    return this._a;
  }

  set a(value: number) {
    this._a = clamp(
      typeof value === "number" && !Number.isNaN(value) ? value : 1,
      0,
      1
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
    type: GradientType = "vertical"
  ) {
    const [r, g, b, a] = (() => {
      if (startColor) {
        if (Array.isArray(startColor)) {
          return startColor;
        } else {
          const { r, g, b, a } = startColor;
          return [r, g, b, a];
        }
      } else {
        return [0, 0, 0, 1];
      }
    })();

    this.startColor = new Color({ r, g, b, a });

    if (endColor) {
      const [r, g, b, a] = (() => {
        if (Array.isArray(endColor)) {
          return endColor;
        } else {
          const { r, g, b, a } = endColor;
          return [r, g, b, a];
        }
      })();

      this.endColor = new Color({ r, g, b, a });
    } else {
      this.endColor = this.startColor;
    }

    this.type = type;
  }
}
