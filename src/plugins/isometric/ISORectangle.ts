import type { BaseSpriteOptions } from "../../BaseSprite.js";
import type { ColorArr, ColorObj, Gradient } from "../../Gradient.js";
import type { RectSizeX, RectSizeY } from "../../Rect.js";
import type { RectangleOptions } from "../../Rectangle.js";
import { Rectangle } from "../../Rectangle.js";
import type { SpriteRef } from "../../utils.js";
import { pick } from "../../utils.js";
import { SortedRectangle } from "../sorted/SortedRectangle.js";
import { ISO } from "./ISOMixin.js";
import type { ISORectOptions } from "./ISORect.js";
import type { ISOSpriteGroup } from "./ISOSpriteGroup.js";

export interface ISORectangleOptions extends RectangleOptions {
  reference: (keyof RectSizeX & keyof RectSizeY) | number;
  referencex: keyof RectSizeX | number;
  referencey: keyof RectSizeY | number;
}

const ISOBaseRectangle = ISO(Rectangle);

export class ISORectangle extends ISOBaseRectangle {
  _screen_obj: SortedRectangle | null = null;

  // Proxy getters & setters

  get background(): Gradient | null {
    return super.background;
  }

  set background(value:
    | Gradient
    | Partial<ColorObj>
    | Partial<ColorArr>
    | null) {
    super.background = value;

    if (this._screen_obj) {
      this._screen_obj.background = value;
    }
  }

  get borderRadius(): number {
    return super.borderRadius;
  }

  set borderRadius(value: number) {
    super.borderRadius = value;

    if (this._screen_obj) {
      this._screen_obj.borderRadius = value;
    }
  }

  get borderWidth(): number {
    return super.borderWidth;
  }

  set borderWidth(value: number) {
    super.borderWidth = value;

    if (this._screen_obj) {
      this._screen_obj.borderWidth = value;
    }
  }

  get borderColor(): Gradient | null {
    return super.borderColor;
  }

  set borderColor(value:
    | Gradient
    | Partial<ColorObj>
    | Partial<ColorArr>
    | null) {
    super.borderColor = value;

    if (this._screen_obj) {
      this._screen_obj.borderColor = value;
    }
  }

  constructor(
    options?: Partial<
      BaseSpriteOptions & ISORectOptions & ISORectangleOptions
    > & { ref?: SpriteRef<ISORectangle> },
  ) {
    super();

    if (options) {
      Object.assign(
        this,
        pick(options, [
          "left",
          "right",
          "centerx",
          "top",
          "bottom",
          "centery",
          "width",
          "halfWidth",
          "height",
          "halfHeight",
          "radius",
          "transformOrigin",
          "transformOriginx",
          "transformOriginy",
          "angle",
          "scale",
          "scalex",
          "scaley",
          "flip",
          "fliph",
          "flipv",
          "opacity",
          "hidden",
          "blendMode",
          "background",
          "borderRadius",
          "borderWidth",
          "borderColor",
          "originx",
          "originy",
          "referencex",
          "referencey",
          "elevation",
        ]),
      );

      if (options.ref) {
        options.ref.current = this;
      }
    }

    this._move(null, 0);
    this.teleport();
  }

  // Implementation details

  _resize(prop: keyof RectSizeX | keyof RectSizeY, value: number): void {
    // TODO: I'm not sure that proxying the new size is the right approach here,
    // as the screen object is merely a graphical representation of a projection.
    // In theory the size of any ISO should be independent of the size of its
    // screen object.
    super._resize(prop, value);

    this._screen_obj?._resize(prop, value);
  }

  _onReparent(): void {
    // The screen rectangle must be created in the screen layer
    const parent = this.parent as ISOSpriteGroup;
    const parent_screen_obj = parent._screen_obj!;

    // TODO: Is the newly created screen object in the correct drawing order?
    this._screen_obj = parent_screen_obj.addChild(
      new SortedRectangle({
        width: this.width,
        height: this.height,
        transformOriginx: this.transformOriginx,
        transformOriginy: this.transformOriginy,
        angle: this.angle,
        scalex: this.scalex,
        scaley: this.scaley,
        fliph: this.fliph,
        flipv: this.flipv,
        opacity: this.opacity,
        hidden: this.hidden,
        blendMode: this.blendMode,
        background: this.background,
        borderRadius: this.borderRadius,
        borderWidth: this.borderWidth,
        borderColor: this.borderColor,
        originx: this.originx,
        originy: this.originy,
      }),
    );

    this._move("elevation", this.elevation);
    this.teleport();
  }
}
