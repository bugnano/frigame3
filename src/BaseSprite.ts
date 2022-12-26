import { Rect } from "./Rect.js";
import type {
  RectPosX,
  RectPosY,
  RectSizeX,
  RectSizeY,
  RectOptions,
} from "./Rect.js";
import type { Playground } from "./Playground.js";
import type { SpriteGroup } from "./SpriteGroup.js";
import { pick, clamp } from "./utils.js";

// source-over, lighter, multiply, screen
export type BlendMode = "normal" | "add" | "multiply" | "screen";

export interface TransformOptions {
  transformOrigin: (keyof RectSizeX & keyof RectSizeY) | number;
  transformOriginx: keyof RectSizeX | number;
  transformOriginy: keyof RectSizeY | number;

  angle: number;

  scale: number;
  scalex: number;
  scaley: number;

  flip: boolean;
  fliph: boolean;
  flipv: boolean;

  opacity: number;
  hidden: boolean;

  blendMode: BlendMode;
}

export type BaseSpriteOptions = RectOptions & TransformOptions;

export class BaseSprite extends Rect {
  _playground: WeakRef<Playground>;
  _parent?: WeakRef<SpriteGroup>;

  transformOriginx: keyof RectSizeX | number = "halfWidth";
  transformOriginy: keyof RectSizeY | number = "halfHeight";

  angle = 0;

  _scalex = 1;
  _scaley = 1;
  _fliph = 1;
  _flipv = 1;

  _alpha = 1;
  hidden = false;

  _scaleh = 1;
  _scalev = 1;

  blendMode: BlendMode = "normal";

  // Implementation details
  _needsUpdate = false;
  _prevLeft = 0;
  _prevTop = 0;
  _frameCounterLastMove = 0;

  get playground() {
    return this._playground.deref();
  }

  get parent() {
    return this._parent?.deref();
  }

  get transformOrigin() {
    return this.transformOriginx as
      | (keyof RectSizeX & keyof RectSizeY)
      | number;
  }

  set transformOrigin(value: (keyof RectSizeX & keyof RectSizeY) | number) {
    this.transformOriginx = value;
    this.transformOriginy = value;
  }

  get scalex() {
    return this._scalex;
  }

  set scalex(value: number) {
    this._scalex = value;
    this._scaleh = value * this._fliph;
  }

  get scaley() {
    return this._scaley;
  }

  set scaley(value: number) {
    this._scaley = value;
    this._scalev = value * this._flipv;
  }

  get scale() {
    return this._scalex;
  }

  set scale(value: number) {
    this._scalex = value;
    this._scaley = value;

    this._scaleh = value * this._fliph;
    this._scalev = value * this._flipv;
  }

  get fliph() {
    return this._fliph < 0;
  }

  set fliph(value: boolean) {
    if (value) {
      this._fliph = -1;
      this._scaleh = -this._scalex;
    } else {
      this._fliph = 1;
      this._scaleh = this._scalex;
    }
  }

  get flipv() {
    return this._flipv < 0;
  }

  set flipv(value: boolean) {
    if (value) {
      this._flipv = -1;
      this._scalev = -this._scaley;
    } else {
      this._flipv = 1;
      this._scalev = this._scaley;
    }
  }

  get flip() {
    return this._fliph < 0;
  }

  set flip(value: boolean) {
    if (value) {
      this._fliph = -1;
      this._flipv = -1;

      this._scaleh = -this._scalex;
      this._scalev = -this._scaley;
    } else {
      this._fliph = 1;
      this._flipv = 1;

      this._scaleh = this._scalex;
      this._scalev = this._scaley;
    }
  }

  get opacity() {
    return this._alpha;
  }

  set opacity(value: number) {
    this._alpha = clamp(value, 0, 1) || 0;
  }

  set left(value: number) {
    this._move("left", value);
  }

  set right(value: number) {
    this._move("right", value);
  }

  set centerx(value: number) {
    this._move("centerx", value);
  }

  set top(value: number) {
    this._move("top", value);
  }

  set bottom(value: number) {
    this._move("bottom", value);
  }

  set centery(value: number) {
    this._move("centery", value);
  }

  set width(value: number) {
    this._resize("width", value);
  }

  set halfWidth(value: number) {
    this._resize("halfWidth", value);
  }

  set height(value: number) {
    this._resize("height", value);
  }

  set halfHeight(value: number) {
    this._resize("halfHeight", value);
  }

  set radius(value: number) {
    this._resize("radius", value);
  }

  constructor(
    playground: Playground,
    parent?: SpriteGroup,
    options?: Partial<BaseSpriteOptions>
  ) {
    super(options);

    this._playground = new WeakRef(playground);

    if (parent) {
      this._parent = new WeakRef(parent);
    }

    if (options) {
      for (const [prop, val] of Object.entries(
        pick(options, [
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
        ])
      )) {
        (this as any)[prop as keyof TransformOptions] = val;
      }
    }

    this.teleport();
  }

  // Public functions

  drawFirst() {
    const parent = this.parent;

    if (parent) {
      const parent_layers = parent._layers;

      // Step 1: Remove myself from the parent layers
      const index = parent_layers.indexOf(this);
      parent_layers.splice(index, 1);

      // Step 2: Insert myself
      parent_layers.unshift(this);
    }

    return this;
  }

  drawLast() {
    const parent = this.parent;

    if (parent) {
      const parent_layers = parent._layers;

      // Step 1: Remove myself from the parent layers
      const index = parent_layers.indexOf(this);
      parent_layers.splice(index, 1);

      // Step 2: Insert myself
      parent_layers.push(this);
    }

    return this;
  }

  getDrawIndex() {
    const parent = this.parent;

    if (parent) {
      return parent._layers.indexOf(this);
    }

    return -1;
  }

  drawTo(index: number) {
    const parent = this.parent;

    if (parent) {
      const parent_layers = parent._layers;

      // Step 1: Remove myself from the parent layers
      const i = parent_layers.indexOf(this);
      parent_layers.splice(i, 1);

      // Step 2: Insert myself
      parent_layers.splice(
        clamp(Math.round(index) || 0, 0, parent_layers.length),
        0,
        this
      );
    }

    return this;
  }

  drawBefore(sprite: BaseSprite) {
    const parent = this.parent;

    if (parent) {
      const parent_layers = parent._layers;
      const sprite_index = parent_layers.indexOf(sprite);

      if (sprite_index >= 0) {
        // Step 1: Remove myself from the parent layers
        const index = parent_layers.indexOf(this);
        parent_layers.splice(index, 1);

        // Step 2: Insert myself
        parent_layers.splice(sprite_index, 0, this);
      } else if (typeof console !== "undefined") {
        console.error("Sprite not found in the same sprite group");
        console.trace();
      }
    }

    return this;
  }

  drawAfter(sprite: BaseSprite) {
    const parent = this.parent;

    if (parent) {
      const parent_layers = parent._layers;
      const sprite_index = parent_layers.indexOf(sprite);

      if (sprite_index >= 0) {
        // Step 1: Remove myself from the parent layers
        const index = parent_layers.indexOf(this);
        parent_layers.splice(index, 1);

        // Step 2: Insert myself
        parent_layers.splice(sprite_index + 1, 0, this);
      } else if (typeof console !== "undefined") {
        console.error("Sprite not found in the same sprite group");
        console.trace();
      }
    }

    return this;
  }

  getAbsRect() {
    let left = this.left;
    let top = this.top;
    let parent = this.parent;
    while (parent) {
      left += parent.left;
      top += parent.top;
      parent = parent.parent;
    }

    return new Rect({
      left: left,
      top: top,
      width: this.width,
      height: this.height,
    });
  }

  teleport() {
    const playground = this.playground;

    if (playground) {
      this._prevLeft = this._left;
      this._prevTop = this._top;
      this._frameCounterLastMove = playground.frameCounter;
    }

    return this;
  }

  // Implementation details

  _resize(prop: keyof RectSizeX | keyof RectSizeY, value: number) {
    const left = this.left;
    const top = this.top;
    const prevLeft = this._prevLeft;
    const prevTop = this._prevTop;
    const frameCounterLastMove = this._frameCounterLastMove;

    super[prop] = value;

    // Resizing the sprite does not mean that it should change its position.
    // However, the new dimensions must be taken into consideration for the interpolation
    this._prevLeft = prevLeft + (this._left - left);
    this._prevTop = prevTop + (this._top - top);
    this._frameCounterLastMove = frameCounterLastMove;
  }

  _move(prop: keyof RectPosX | keyof RectPosY, value: number) {
    const playground = this.playground;

    if (playground) {
      const frameCounter = playground.frameCounter;

      if (frameCounter !== this._frameCounterLastMove) {
        this._prevLeft = this._left;
        this._prevTop = this._top;
        this._frameCounterLastMove = frameCounter;
      }
    }

    super[prop] = value;
  }

  _checkUpdate() {
    const oldNeedsUpdate = this._needsUpdate;

    this._needsUpdate = false;

    this._updateNeedsUpdate(oldNeedsUpdate);
  }

  _updateNeedsUpdate(oldNeedsUpdate: boolean) {
    const parent = this.parent;

    if (parent) {
      if (this._needsUpdate && !oldNeedsUpdate) {
        parent._updateList.push(this);
      } else if (!this._needsUpdate && oldNeedsUpdate) {
        const parent_update_list = parent._updateList;

        const index = parent_update_list.indexOf(this);
        parent_update_list.splice(index, 1);
      }
    }
  }

  _update() {
    // no-op
  }

  _draw(interp: number) {
    // no-op
  }
}
