import { BaseSprite } from "../../BaseSprite.js";
import { ISO } from "./ISOMixin.js";
import { addSortedRectangle } from "../sorted/SortedRectangle.js";
import { pick } from "../../utils.js";
import type { SortedRectangle } from "../sorted/SortedRectangle.js";
import type { ISOSpriteGroup } from "./ISOSpriteGroup.js";
import type { Playground } from "../../Playground.js";
import type { ISORectOptions } from "./ISORect.js";
import type { RectangleOptions } from "../../Rectangle.js";
import type { BaseSpriteOptions } from "../../BaseSprite.js";
import type { RectSizeX, RectSizeY } from "../../Rect.js";
import type { Gradient, ColorObj, ColorArr } from "../../Gradient.js";

export interface ISORectangleOptions extends RectangleOptions {
  reference: (keyof RectSizeX & keyof RectSizeY) | number;
  referencex: keyof RectSizeX | number;
  referencey: keyof RectSizeY | number;
}

const ISOBaseRectangle = ISO(BaseSprite);

export class ISORectangle extends ISOBaseRectangle {
  _screen_obj: SortedRectangle;

  // Proxy getters & setters

  get background() {
    return this._screen_obj.background;
  }

  set background(
    value: Gradient | Partial<ColorObj> | Partial<ColorArr> | null
  ) {
    this._screen_obj.background = value;
  }

  get borderRadius() {
    return this._screen_obj.borderRadius;
  }

  set borderRadius(value: number) {
    this._screen_obj.borderRadius = value;
  }

  get borderWidth() {
    return this._screen_obj.borderWidth;
  }

  set borderWidth(value: number) {
    this._screen_obj.borderWidth = value;
  }

  get borderColor() {
    return this._screen_obj.borderColor;
  }

  set borderColor(
    value: Gradient | Partial<ColorObj> | Partial<ColorArr> | null
  ) {
    this._screen_obj.borderColor = value;
  }

  constructor(
    playground: Playground,
    parent: ISOSpriteGroup,
    options?: Partial<BaseSpriteOptions & ISORectOptions & ISORectangleOptions>
  ) {
    super(playground, parent);

    // The screen rectangle must be created in the screen layer
    this._screen_obj = addSortedRectangle(parent._screen_obj);

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
        ])
      );
    }

    this._move(null, 0);
    this.teleport();
  }

  // Implementation details

  _resize(prop: keyof RectSizeX | keyof RectSizeY, value: number) {
    // TODO: I'm not sure that proxying the new size is the right approach here,
    // as the screen object is merely a graphical representation of a projection.
    // In theory the size of any ISO should be independent of the size of its
    // screen object.
    super._resize(prop, value);

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    this._screen_obj?._resize(prop, value);
  }
}

export function addISORectangle(
  parent: ISOSpriteGroup,
  options?: Partial<BaseSpriteOptions & ISORectOptions & ISORectangleOptions>
) {
  const rectangle = new ISORectangle(parent.playground!, parent, options);

  parent.addChild(rectangle);

  rectangle._screen_obj.drawLast();

  return rectangle;
}

export function insertISORectangle(
  parent: ISOSpriteGroup,
  options?: Partial<BaseSpriteOptions & ISORectOptions & ISORectangleOptions>
) {
  const rectangle = new ISORectangle(parent.playground!, parent, options);

  parent.insertChild(rectangle);

  rectangle._screen_obj.drawFirst();

  return rectangle;
}
