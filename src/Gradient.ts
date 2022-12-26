import { clamp } from "./utils.js";

export interface ColorObj {
  r: number;
  g: number;
  b: number;
  a: number;
}

export type ColorArr = [number, number, number, number];

export type Color = ColorObj | ColorArr;

export type GradientType = "vertical" | "horizontal";

export class Gradient {
  startColor: ColorObj;
  startColorStr: string;
  endColor: ColorObj;
  endColorStr: string;
  type: GradientType;

  constructor(
    startColor?: Partial<Color>,
    endColor?: Partial<Color>,
    type: GradientType = "vertical"
  ) {
    const round = Math.round;

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

    this.startColor = {
      r: clamp(round(r ?? 0), 0, 255),
      g: clamp(round(g ?? 0), 0, 255),
      b: clamp(round(b ?? 0), 0, 255),
      a: clamp(a ?? 1, 0, 1),
    };
    this.startColorStr = `rgba(${this.startColor.r},${this.startColor.g},${this.startColor.b},${this.startColor.a})`;

    if (endColor) {
      const [r, g, b, a] = (() => {
        if (Array.isArray(endColor)) {
          return endColor;
        } else {
          const { r, g, b, a } = endColor;
          return [r, g, b, a];
        }
      })();

      this.endColor = {
        r: clamp(round(r ?? 0), 0, 255),
        g: clamp(round(g ?? 0), 0, 255),
        b: clamp(round(b ?? 0), 0, 255),
        a: clamp(a ?? 1, 0, 1),
      };
      this.endColorStr = `rgba(${this.endColor.r},${this.endColor.g},${this.endColor.b},${this.endColor.a})`;
    } else {
      this.endColor = this.startColor;
      this.endColorStr = this.startColorStr;
    }

    this.type = type;
  }
}
