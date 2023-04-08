import { BaseSprite } from "../../BaseSprite.js";
import { ISO } from "./ISOMixin.js";
import { addSortedSprite } from "../sorted/SortedSprite.js";
import { pick } from "../../utils.js";
import type { SortedAnimation } from "../sorted/SortedAnimation.js";
import type { SortedSprite } from "../sorted/SortedSprite.js";
import type { ISOSpriteGroup } from "./ISOSpriteGroup.js";
import type { Playground } from "../../Playground.js";
import type { ISORectOptions } from "./ISORect.js";
import type { SpriteOptions } from "../../Sprite.js";
import type { BaseSpriteOptions } from "../../BaseSprite.js";
import type { RectSizeX, RectSizeY } from "../../Rect.js";

export interface ISOSpriteOptions extends SpriteOptions {
  reference: (keyof RectSizeX & keyof RectSizeY) | number;
  referencex: keyof RectSizeX | number;
  referencey: keyof RectSizeY | number;
}

const ISOBaseSprite = ISO(BaseSprite);

export class ISOSprite extends ISOBaseSprite {
  _screen_obj: SortedSprite;

  // Proxy getters & setters
  get animation() {
    return this._screen_obj.animation;
  }

  set animation(value: SortedAnimation | null) {
    const screen_obj = this._screen_obj;

    if (value !== screen_obj.animation) {
      screen_obj.animation = value;

      if (value) {
        this.originx = screen_obj.originx;
        this.originy = screen_obj.originy;
      }
    }
  }

  get animationIndex() {
    return this._screen_obj.animationIndex;
  }

  set animationIndex(value: number) {
    this._screen_obj.animationIndex = value;
  }

  get callback() {
    return this._screen_obj.callback;
  }

  set callback(value: (() => void) | null) {
    this._screen_obj.callback = value;
  }

  get paused() {
    return this._screen_obj.paused;
  }

  set paused(value: boolean) {
    this._screen_obj.paused = value;
  }

  get rate() {
    return this._screen_obj.rate;
  }

  set rate(value: number) {
    this._screen_obj.rate = value;
  }

  get once() {
    return this._screen_obj.once;
  }

  set once(value: boolean) {
    this._screen_obj.once = value;
  }

  get pingpong() {
    return this._screen_obj.pingpong;
  }

  set pingpong(value: boolean) {
    this._screen_obj.pingpong = value;
  }

  get backwards() {
    return this._screen_obj.backwards;
  }

  set backwards(value: boolean) {
    this._screen_obj.backwards = value;
  }

  constructor(
    playground: Playground,
    parent: ISOSpriteGroup,
    options?: Partial<BaseSpriteOptions & ISORectOptions & ISOSpriteOptions>
  ) {
    super(playground, parent);

    // The screen sprite must be created in the screen layer
    this._screen_obj = addSortedSprite(parent._screen_obj);

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
          "animation",
          "animationIndex",
          "callback",
          "paused",
          "rate",
          "once",
          "pingpong",
          "backwards",
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

  // The _resize function has been deliberately omitted,
  // as the screen object automatically gets the size of the animation
  // and the size of the ISOSprite is independent of it
}

export function addISOSprite(
  parent: ISOSpriteGroup,
  options?: Partial<BaseSpriteOptions & ISORectOptions & ISOSpriteOptions>
) {
  const sprite = new ISOSprite(parent.playground!, parent, options);

  parent.addChild(sprite);

  sprite._screen_obj.drawLast();

  return sprite;
}

export function insertISOSprite(
  parent: ISOSpriteGroup,
  options?: Partial<BaseSpriteOptions & ISORectOptions & ISOSpriteOptions>
) {
  const sprite = new ISOSprite(parent.playground!, parent, options);

  parent.insertChild(sprite);

  sprite._screen_obj.drawFirst();

  return sprite;
}
