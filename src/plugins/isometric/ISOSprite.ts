import type { BaseSpriteOptions } from "../../BaseSprite.js";
import type { RectSizeX, RectSizeY } from "../../Rect.js";
import { Sprite } from "../../Sprite.js";
import type { SpriteOptions } from "../../Sprite.js";
import { pick } from "../../utils.js";
import type { SpriteRef } from "../../utils.js";
import type { SortedAnimation } from "../sorted/SortedAnimation.js";
import { SortedSprite } from "../sorted/SortedSprite.js";
import { ISO } from "./ISOMixin.js";
import type { ISORectOptions } from "./ISORect.js";
import type { ISOSpriteGroup } from "./ISOSpriteGroup.js";

export interface ISOSpriteOptions extends SpriteOptions {
  reference: (keyof RectSizeX & keyof RectSizeY) | number;
  referencex: keyof RectSizeX | number;
  referencey: keyof RectSizeY | number;
}

const ISOBaseSprite = ISO(Sprite);

export class ISOSprite extends ISOBaseSprite {
  _screen_obj: SortedSprite | null = null;

  // Proxy getters & setters

  get animation(): SortedAnimation | null {
    return super.animation as SortedAnimation | null;
  }

  set animation(value: SortedAnimation | null) {
    if (value !== super.animation) {
      const width = super.width;
      const height = super.height;

      super.animation = value;

      super.width = width;
      super.height = height;

      if (value) {
        this.originx = value.originx;
        this.originy = value.originy;
      }

      if (this._screen_obj) {
        this._screen_obj.animation = value;
      }
    }
  }

  get animationIndex(): number {
    return super.animationIndex;
  }

  set animationIndex(value: number) {
    super.animationIndex = value;

    if (this._screen_obj) {
      this._screen_obj.animationIndex = value;
    }
  }

  get callback(): (() => void) | null {
    return super.callback;
  }

  set callback(value: (() => void) | null) {
    super.callback = value;

    if (this._screen_obj) {
      this._screen_obj.callback = value;
    }
  }

  get paused(): boolean {
    return super.paused;
  }

  set paused(value: boolean) {
    super.paused = value;

    if (this._screen_obj) {
      this._screen_obj.paused = value;
    }
  }

  get rate(): number {
    return super.rate;
  }

  set rate(value: number) {
    super.rate = value;

    if (this._screen_obj) {
      this._screen_obj.rate = value;
    }
  }

  get once(): boolean {
    return super.once;
  }

  set once(value: boolean) {
    super.once = value;

    if (this._screen_obj) {
      this._screen_obj.once = value;
    }
  }

  get pingpong(): boolean {
    return super.pingpong;
  }

  set pingpong(value: boolean) {
    super.pingpong = value;

    if (this._screen_obj) {
      this._screen_obj.pingpong = value;
    }
  }

  get backwards(): boolean {
    return super.backwards;
  }

  set backwards(value: boolean) {
    super.backwards = value;

    if (this._screen_obj) {
      this._screen_obj.backwards = value;
    }
  }

  constructor(
    options?: Partial<BaseSpriteOptions & ISORectOptions & ISOSpriteOptions> & {
      ref?: SpriteRef<ISOSprite>;
    },
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
        ]),
      );

      if (options.ref) {
        options.ref.current = this;
      }
    }

    this._move(null, 0);
    this.teleport();
  }

  // The _resize function has been deliberately omitted,
  // as the screen object automatically gets the size of the animation
  // and the size of the ISOSprite is independent of it

  _onReparent(): void {
    // The screen sprite must be created in the screen layer
    const parent = this.parent as ISOSpriteGroup;
    const parent_screen_obj = parent._screen_obj!;

    // TODO: Is the newly created screen object in the correct drawing order?
    this._screen_obj = parent_screen_obj.addChild(
      new SortedSprite({
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
        animation: this.animation,
        animationIndex: this.animationIndex,
        callback: this.callback,
        paused: this.paused,
        rate: this.rate,
        once: this.once,
        pingpong: this.pingpong,
        backwards: this.backwards,
        originx: this.originx,
        originy: this.originy,
      }),
    );

    this._move("elevation", this.elevation);
    this.teleport();
  }
}
