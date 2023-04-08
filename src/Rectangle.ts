import { BaseSprite } from "./BaseSprite.js";
import { Gradient } from "./Gradient.js";
import type { Playground } from "./Playground.js";
import type { SpriteGroup } from "./SpriteGroup.js";
import type { BaseSpriteOptions } from "./BaseSprite.js";
import type { ColorObj, ColorArr } from "./Gradient.js";
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

  get background() {
    return this._background;
  }

  set background(
    value: Gradient | Partial<ColorObj> | Partial<ColorArr> | null
  ) {
    if (value === null || value instanceof Gradient) {
      this._background = value;
    } else {
      this._background = new Gradient(value);
    }
  }

  get borderRadius() {
    return this._borderRadius;
  }

  set borderRadius(value: number) {
    this._borderRadius = value;
  }

  get borderWidth() {
    return this._borderWidth;
  }

  set borderWidth(value: number) {
    this._borderWidth = value;
  }

  get borderColor() {
    return this._borderColor;
  }

  set borderColor(
    value: Gradient | Partial<ColorObj> | Partial<ColorArr> | null
  ) {
    if (value === null || value instanceof Gradient) {
      this._borderColor = value;
    } else {
      this._borderColor = new Gradient(value);
    }
  }

  constructor(
    playground: Playground,
    parent: SpriteGroup,
    options?: Partial<BaseSpriteOptions & RectangleOptions>
  ) {
    super(playground, parent, options);

    if (options) {
      Object.assign(
        this,
        pick(options, [
          "background",
          "borderRadius",
          "borderWidth",
          "borderColor",
        ])
      );

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
    } else {
      this.width = parent.width;
      this.height = parent.height;
    }

    this.teleport();

    playground._renderer.initRectangle(this);
  }

  // Implementation details

  _draw(interp: number) {
    super._draw(interp);

    this.playground?._renderer.drawRectangle(this, interp);
  }

  _remove() {
    this.playground?._renderer.removeRectangle(this);
  }
}

export function addRectangle(
  parent: SpriteGroup,
  options?: Partial<BaseSpriteOptions & RectangleOptions>
) {
  const rectangle = new Rectangle(parent.playground!, parent, options);

  parent.addChild(rectangle);

  return rectangle;
}

export function insertRectangle(
  parent: SpriteGroup,
  options?: Partial<BaseSpriteOptions & RectangleOptions>
) {
  const rectangle = new Rectangle(parent.playground!, parent, options);

  parent.insertChild(rectangle);

  return rectangle;
}
