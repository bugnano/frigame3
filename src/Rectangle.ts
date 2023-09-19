import { BaseSprite } from "./BaseSprite.js";
import { Gradient } from "./Gradient.js";
import type { BaseSpriteOptions } from "./BaseSprite.js";
import type { ColorObj, ColorArr } from "./Gradient.js";
import type { SpriteRef } from "./utils.js";
import { pick } from "./utils.js";

export interface RectangleOptions {
  background: Gradient | Partial<ColorObj> | Partial<ColorArr> | null;
  borderRadius: number;
  borderWidth: number;
  borderColor: Gradient | Partial<ColorObj> | Partial<ColorArr> | null;
}

export class Rectangle extends BaseSprite {
  _background: Gradient | null = null;
  _borderRadius = 0;
  _borderWidth = 1;
  _borderColor: Gradient | null = null;

  get background(): Gradient | null {
    return this._background;
  }

  set background(
    value: Gradient | Partial<ColorObj> | Partial<ColorArr> | null,
  ) {
    if (value === null || value instanceof Gradient) {
      this._background = value;
    } else {
      this._background = new Gradient(value);
    }
  }

  get borderRadius(): number {
    return this._borderRadius;
  }

  set borderRadius(value: number) {
    this._borderRadius = value;
  }

  get borderWidth(): number {
    return this._borderWidth;
  }

  set borderWidth(value: number) {
    this._borderWidth = value;
  }

  get borderColor(): Gradient | null {
    return this._borderColor;
  }

  set borderColor(
    value: Gradient | Partial<ColorObj> | Partial<ColorArr> | null,
  ) {
    if (value === null || value instanceof Gradient) {
      this._borderColor = value;
    } else {
      this._borderColor = new Gradient(value);
    }
  }

  constructor(
    options?: Partial<
      BaseSpriteOptions & RectangleOptions & { ref?: SpriteRef<Rectangle> }
    >,
  ) {
    super(options);

    if (options) {
      Object.assign(
        this,
        pick(options, [
          "background",
          "borderRadius",
          "borderWidth",
          "borderColor",
        ]),
      );

      if (options.ref) {
        options.ref.current = this;
      }
    }

    this.teleport();
  }

  // Implementation details

  _initRenderer(): void {
    this.playground?._renderer.initRectangle(this);
  }

  _draw(interp: number): void {
    super._draw(interp);

    this.playground?._renderer.drawRectangle(this, interp);
  }

  _remove(): void {
    this.playground?._renderer.removeRectangle(this);
  }
}
