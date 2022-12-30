import { BaseSprite } from "./BaseSprite.js";
import { SpriteGroup } from "./SpriteGroup.js";
import { Gradient } from "./Gradient.js";
import { Playground } from "./Playground.js";
import type { BaseSpriteOptions } from "./BaseSprite.js";
import type { ColorObj, ColorArr } from "./Gradient.js";
import { pick } from "./utils.js";

export interface RectangleOptions {
  background: Gradient | Partial<ColorObj | ColorArr> | null;
  borderRadius: number;
  borderWidth: number;
  borderColor: Gradient | Partial<ColorObj | ColorArr> | null;
}

export class Rectangle extends BaseSprite {
  _background: Gradient | null = null;
  borderRadius = 0;
  borderWidth = 1;
  _borderColor: Gradient | null = null;

  get background() {
    return this._background;
  }

  set background(value: Gradient | Partial<ColorObj | ColorArr> | null) {
    if (value === null || value instanceof Gradient) {
      this._background = value;
    } else {
      this._background = new Gradient(value);
    }
  }

  get borderColor() {
    return this._borderColor;
  }

  set borderColor(value: Gradient | Partial<ColorObj | ColorArr> | null) {
    if (value === null || value instanceof Gradient) {
      this._borderColor = value;
    } else {
      this._borderColor = new Gradient(value);
    }
  }

  constructor(
    playground: Playground,
    parent?: SpriteGroup,
    options?: Partial<BaseSpriteOptions & RectangleOptions>
  ) {
    super(playground, parent, options);

    if (options) {
      for (const [prop, val] of Object.entries(
        pick(options, [
          "background",
          "borderRadius",
          "borderWidth",
          "borderColor",
        ])
      )) {
        (this as any)[prop as keyof RectangleOptions] = val;
      }

      if (parent) {
        if (
          options.width === undefined &&
          options.halfWidth === undefined &&
          options.radius === undefined
        ) {
          this.width = parent.width;
        }

        if (
          options.height === undefined &&
          options.halfHeight === undefined &&
          options.radius === undefined
        ) {
          this.height = parent.height;
        }
      }
    } else {
      if (parent) {
        this.width = parent.width;
        this.height = parent.height;
      }
    }

    this.teleport();

    playground._renderer.initRectangle(this);
  }

  // Implementation details

  _draw(interp: number) {
    this.playground?._renderer.drawRectangle(this, interp);
  }
}

export function addRectangle(
  parent: SpriteGroup,
  options?: Partial<BaseSpriteOptions & RectangleOptions>
) {
  const rectangle = new Rectangle(parent.playground!, parent, options);
  parent._layers.push(rectangle);

  parent._checkUpdate();

  return rectangle;
}

export function insertRectangle(
  parent: SpriteGroup,
  options?: Partial<BaseSpriteOptions & RectangleOptions>
) {
  const rectangle = new Rectangle(parent.playground!, parent, options);
  parent._layers.unshift(rectangle);

  parent._checkUpdate();

  return rectangle;
}
