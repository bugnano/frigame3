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
  _playground?: WeakRef<Playground>;
  _parent?: WeakRef<SpriteGroup>;

  _transformOriginx: keyof RectSizeX | number = "halfWidth";
  _transformOriginy: keyof RectSizeY | number = "halfHeight";

  _angle = 0;

  _scalex = 1;
  _scaley = 1;
  _fliph = 1;
  _flipv = 1;

  _opacity = 1;
  _hidden = false;

  _scaleh = 1;
  _scalev = 1;

  _blendMode: BlendMode = "normal";

  // Implementation details

  _needsUpdate = false;
  _prevLeft = 0;
  _prevTop = 0;
  _frameCounterLastMove = 0;
  _drawLeft = 0;
  _drawTop = 0;
  _drawWidth = 0;
  _drawHeight = 0;

  get playground(): Playground | undefined {
    return this._playground?.deref();
  }

  get parent(): SpriteGroup | undefined {
    return this._parent?.deref();
  }

  get transformOrigin(): (keyof RectSizeX & keyof RectSizeY) | number {
    return this._transformOriginx as
      | (keyof RectSizeX & keyof RectSizeY)
      | number;
  }

  set transformOrigin(value: (keyof RectSizeX & keyof RectSizeY) | number) {
    this._transformOriginx = value;
    this._transformOriginy = value;
  }

  get transformOriginx(): keyof RectSizeX | number {
    return this._transformOriginx;
  }

  set transformOriginx(value: keyof RectSizeX | number) {
    this._transformOriginx = value;
  }

  get transformOriginy(): keyof RectSizeY | number {
    return this._transformOriginy;
  }

  set transformOriginy(value: keyof RectSizeY | number) {
    this._transformOriginy = value;
  }

  get angle(): number {
    return this._angle;
  }

  set angle(value: number) {
    this._angle = value;
  }

  get scalex(): number {
    return this._scalex;
  }

  set scalex(value: number) {
    this._scalex = value;
    this._scaleh = value * this._fliph;
  }

  get scaley(): number {
    return this._scaley;
  }

  set scaley(value: number) {
    this._scaley = value;
    this._scalev = value * this._flipv;
  }

  get scale(): number {
    return this._scalex;
  }

  set scale(value: number) {
    this._scalex = value;
    this._scaley = value;

    this._scaleh = value * this._fliph;
    this._scalev = value * this._flipv;
  }

  get fliph(): boolean {
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

  get flipv(): boolean {
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

  get flip(): boolean {
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

  get opacity(): number {
    return this._opacity;
  }

  set opacity(value: number) {
    this._opacity = clamp(value, 0, 1) || 0;
  }

  get hidden(): boolean {
    return this._hidden;
  }

  set hidden(value: boolean) {
    this._hidden = value;
  }

  get blendMode(): BlendMode {
    return this._blendMode;
  }

  set blendMode(value: BlendMode) {
    this._blendMode = value;
  }

  get left(): number {
    return super.left;
  }

  set left(value: number) {
    this._move("left", value);
  }

  get right(): number {
    return super.right;
  }

  set right(value: number) {
    this._move("right", value);
  }

  get centerx(): number {
    return super.centerx;
  }

  set centerx(value: number) {
    this._move("centerx", value);
  }

  get top(): number {
    return super.top;
  }

  set top(value: number) {
    this._move("top", value);
  }

  get bottom(): number {
    return super.bottom;
  }

  set bottom(value: number) {
    this._move("bottom", value);
  }

  get centery(): number {
    return super.centery;
  }

  set centery(value: number) {
    this._move("centery", value);
  }

  get width(): number {
    return super.width;
  }

  set width(value: number) {
    this._resize("width", value);
  }

  get halfWidth(): number {
    return super.halfWidth;
  }

  set halfWidth(value: number) {
    this._resize("halfWidth", value);
  }

  get height(): number {
    return super.height;
  }

  set height(value: number) {
    this._resize("height", value);
  }

  get halfHeight(): number {
    return super.halfHeight;
  }

  set halfHeight(value: number) {
    this._resize("halfHeight", value);
  }

  get radius(): number {
    return super.radius;
  }

  set radius(value: number) {
    this._resize("radius", value);
  }

  constructor(options?: Partial<BaseSpriteOptions>) {
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
        ]),
      );
    }

    this.teleport();
  }

  // Public functions

  drawFirst(): this {
    const parent = this.parent;

    if (parent) {
      const parent_layers = parent._layers;

      const index = parent_layers.indexOf(this);
      if (index >= 0) {
        // Step 1: Remove myself from the parent layers
        parent_layers.splice(index, 1);

        // Step 2: Insert myself
        parent_layers.unshift(this);
      }
    }

    return this;
  }

  drawLast(): this {
    const parent = this.parent;

    if (parent) {
      const parent_layers = parent._layers;

      const index = parent_layers.indexOf(this);
      if (index >= 0) {
        // Step 1: Remove myself from the parent layers
        parent_layers.splice(index, 1);

        // Step 2: Insert myself
        parent_layers.push(this);
      }
    }

    return this;
  }

  getDrawIndex(): number {
    const parent = this.parent;

    if (parent) {
      return parent._layers.indexOf(this);
    }

    return -1;
  }

  drawTo(index: number): this {
    const parent = this.parent;

    if (parent) {
      const parent_layers = parent._layers;

      const i = parent_layers.indexOf(this);
      if (i >= 0) {
        // Step 1: Remove myself from the parent layers
        parent_layers.splice(i, 1);

        // Step 2: Insert myself
        parent_layers.splice(
          clamp(Math.round(index) || 0, 0, parent_layers.length),
          0,
          this,
        );
      }
    }

    return this;
  }

  drawBefore(sprite: BaseSprite): this {
    const parent = this.parent;

    if (parent) {
      const parent_layers = parent._layers;
      const sprite_index = parent_layers.indexOf(sprite);

      if (sprite_index >= 0) {
        const index = parent_layers.indexOf(this);
        if (index >= 0) {
          // Step 1: Remove myself from the parent layers
          parent_layers.splice(index, 1);

          // Step 2: Insert myself
          parent_layers.splice(sprite_index, 0, this);
        }
      } else if (typeof console !== "undefined") {
        console.error("Sprite not found in the same sprite group");
        console.trace();
      }
    }

    return this;
  }

  drawAfter(sprite: BaseSprite): this {
    const parent = this.parent;

    if (parent) {
      const parent_layers = parent._layers;
      const sprite_index = parent_layers.indexOf(sprite);

      if (sprite_index >= 0) {
        const index = parent_layers.indexOf(this);
        if (index >= 0) {
          // Step 1: Remove myself from the parent layers
          parent_layers.splice(index, 1);

          // Step 2: Insert myself
          parent_layers.splice(sprite_index + 1, 0, this);
        }
      } else if (typeof console !== "undefined") {
        console.error("Sprite not found in the same sprite group");
        console.trace();
      }
    }

    return this;
  }

  getAbsRect(): Rect {
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

  teleport(): this {
    const playground = this.playground;

    this._prevLeft = this._left;
    this._prevTop = this._top;

    if (playground) {
      this._frameCounterLastMove = playground.frameCounter;
    }

    return this;
  }

  wrapLeft(increment: number, modulo: number): this {
    this.left += increment;

    if (modulo > 0) {
      while (this._left > 0) {
        this._left -= modulo;
        this._prevLeft -= modulo;
      }

      while (this._left <= -modulo) {
        this._left += modulo;
        this._prevLeft += modulo;
      }
    } else if (modulo < 0) {
      while (this._left > 0) {
        this._left += modulo;
        this._prevLeft += modulo;
      }

      while (this._left <= modulo) {
        this._left -= modulo;
        this._prevLeft -= modulo;
      }
    } else {
      this._left = 0;
      this._prevLeft = 0;
    }

    return this;
  }

  wrapTop(increment: number, modulo: number): this {
    this.top += increment;

    if (modulo > 0) {
      while (this._top > 0) {
        this._top -= modulo;
        this._prevTop -= modulo;
      }

      while (this._top <= -modulo) {
        this._top += modulo;
        this._prevTop += modulo;
      }
    } else if (modulo < 0) {
      while (this._top > 0) {
        this._top += modulo;
        this._prevTop += modulo;
      }

      while (this._top <= modulo) {
        this._top -= modulo;
        this._prevTop -= modulo;
      }
    } else {
      this._top = 0;
      this._prevTop = 0;
    }

    return this;
  }

  // Implementation details

  _resize(prop: keyof RectSizeX | keyof RectSizeY, value: number): void {
    const left = this._left;
    const top = this._top;
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

  _move(prop: keyof RectPosX | keyof RectPosY, value: number): void {
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

  _checkUpdate(): void {
    const oldNeedsUpdate = this._needsUpdate;

    this._needsUpdate = false;

    this._updateNeedsUpdate(oldNeedsUpdate);
  }

  _updateNeedsUpdate(oldNeedsUpdate: boolean): void {
    const parent = this.parent;

    if (parent) {
      const parent_update_list = parent._updateList;

      if (this._needsUpdate && !oldNeedsUpdate) {
        const index = parent_update_list.indexOf(this);
        if (index < 0) {
          parent_update_list.push(this);
        }
      } else if (!this._needsUpdate && oldNeedsUpdate) {
        const index = parent_update_list.indexOf(this);
        if (index >= 0) {
          parent_update_list.splice(index, 1);
        }
      }
    }
  }

  _onReparent(): void {
    // no-op
  }

  _initRenderer(): void {
    // no-op
  }

  _update(): void {
    // no-op
  }

  _draw(interp: number): void {
    const playground = this.playground;

    if (playground) {
      const trunc = Math.trunc;
      const myLeft = this._left;
      const myTop = this._top;
      const prevLeft = this._prevLeft;
      const prevTop = this._prevTop;
      let left = trunc(myLeft);
      let top = trunc(myTop);

      if (left !== prevLeft || top !== prevTop) {
        if (this._frameCounterLastMove === playground.frameCounter - 1) {
          const round = Math.round;

          left = round(left * interp + trunc(prevLeft) * (1 - interp));
          top = round(top * interp + trunc(prevTop) * (1 - interp));
        } else {
          this._prevLeft = myLeft;
          this._prevTop = myTop;
        }
      }

      this._drawLeft = left;
      this._drawTop = top;
      this._drawWidth = trunc(this._width);
      this._drawHeight = trunc(this._height);
    }
  }

  _remove(): void {
    // no-op
  }
}
