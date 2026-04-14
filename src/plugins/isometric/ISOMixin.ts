import type { BaseSprite, BlendMode } from "../../BaseSprite.js";
import type { RectPosX, RectPosY, RectSizeX, RectSizeY } from "../../Rect.js";
import type { GConstructor } from "../../utils.js";
import type { SortedGroup } from "../sorted/SortedGroup.js";
import type { SortedRectangle } from "../sorted/SortedRectangle.js";
import type { SortedSprite } from "../sorted/SortedSprite.js";
import { ISORect } from "./ISORect.js";
import { screenFromGrid } from "./utils.js";

// biome-ignore lint/nursery/useExplicitReturnType: reason
export function ISO<TBase extends GConstructor<BaseSprite>>(Base: TBase) {
  return class ISOMixin extends Base {
    _elevation = 0;
    _originx: keyof RectSizeX | number = "halfWidth";
    _originy: keyof RectSizeY | number = "height";
    _referencex: keyof RectSizeX | number = "halfWidth";
    _referencey: keyof RectSizeY | number = "halfHeight";
    _screen_obj: SortedGroup | SortedSprite | SortedRectangle | null = null;

    get elevation(): number {
      return this._elevation;
    }

    set elevation(value: number) {
      this._move("elevation", value);
    }

    get originx(): keyof RectSizeX | number {
      return this._originx;
    }

    set originx(value: keyof RectSizeX | number) {
      this._originx = value;

      const screen_obj = this._screen_obj;

      if (screen_obj !== null) {
        let originx = value;

        if (typeof originx === "string") {
          originx = screen_obj[originx];
        }

        screen_obj.originx = originx;
      }

      this._move(null, 0);
    }

    get originy(): keyof RectSizeY | number {
      return this._originy;
    }

    set originy(value: keyof RectSizeY | number) {
      this._originy = value;

      const screen_obj = this._screen_obj;

      if (screen_obj !== null) {
        let originy = value;

        if (typeof originy === "string") {
          originy = screen_obj[originy];
        }

        screen_obj.originy = originy + this._elevation;
      }

      this._move(null, 0);
    }

    get reference(): (keyof RectSizeX & keyof RectSizeY) | number {
      return this._referencex as (keyof RectSizeX & keyof RectSizeY) | number;
    }

    set reference(value: (keyof RectSizeX & keyof RectSizeY) | number) {
      this._referencex = value;
      this._referencey = value;
      this._move(null, 0);
    }

    get referencex(): keyof RectSizeX | number {
      return this._referencex;
    }

    set referencex(value: keyof RectSizeX | number) {
      this._referencex = value;
      this._move(null, 0);
    }

    get referencey(): keyof RectSizeY | number {
      return this._referencey;
    }

    set referencey(value: keyof RectSizeY | number) {
      this._referencey = value;
      this._move(null, 0);
    }

    // Proxy getters & setters

    override get transformOrigin():
      | (keyof RectSizeX & keyof RectSizeY)
      | number {
      return super.transformOrigin;
    }

    override set transformOrigin(value:
      | (keyof RectSizeX & keyof RectSizeY)
      | number) {
      super.transformOrigin = value;

      if (this._screen_obj !== null) {
        this._screen_obj.transformOrigin = value;
      }
    }

    override get transformOriginx(): keyof RectSizeX | number {
      return super.transformOriginx;
    }

    override set transformOriginx(value: keyof RectSizeX | number) {
      super.transformOriginx = value;

      if (this._screen_obj !== null) {
        this._screen_obj.transformOriginx = value;
      }
    }

    override get transformOriginy(): keyof RectSizeY | number {
      return super.transformOriginy;
    }

    override set transformOriginy(value: keyof RectSizeY | number) {
      super.transformOriginy = value;

      if (this._screen_obj !== null) {
        this._screen_obj.transformOriginy = value;
      }
    }

    override get angle(): number {
      return super.angle;
    }

    override set angle(value: number) {
      super.angle = value;

      if (this._screen_obj !== null) {
        this._screen_obj.angle = value;
      }
    }

    override get scalex(): number {
      return super.scalex;
    }

    override set scalex(value: number) {
      super.scalex = value;

      if (this._screen_obj !== null) {
        this._screen_obj.scalex = value;
      }
    }

    override get scaley(): number {
      return super.scaley;
    }

    override set scaley(value: number) {
      super.scaley = value;

      if (this._screen_obj !== null) {
        this._screen_obj.scaley = value;
      }
    }

    override get scale(): number {
      return super.scale;
    }

    override set scale(value: number) {
      super.scale = value;

      if (this._screen_obj !== null) {
        this._screen_obj.scale = value;
      }
    }

    override get fliph(): boolean {
      return super.fliph;
    }

    override set fliph(value: boolean) {
      super.fliph = value;

      if (this._screen_obj !== null) {
        this._screen_obj.fliph = value;
      }
    }

    override get flipv(): boolean {
      return super.flipv;
    }

    override set flipv(value: boolean) {
      super.flipv = value;

      if (this._screen_obj !== null) {
        this._screen_obj.flipv = value;
      }
    }

    override get flip(): boolean {
      return super.flip;
    }

    override set flip(value: boolean) {
      super.flip = value;

      if (this._screen_obj !== null) {
        this._screen_obj.flip = value;
      }
    }

    override get opacity(): number {
      return super.opacity;
    }

    override set opacity(value: number) {
      super.opacity = value;

      if (this._screen_obj !== null) {
        this._screen_obj.opacity = value;
      }
    }

    override get hidden(): boolean {
      return super.hidden;
    }

    override set hidden(value: boolean) {
      super.hidden = value;

      if (this._screen_obj !== null) {
        this._screen_obj.hidden = value;
      }
    }

    override get blendMode(): BlendMode {
      return super.blendMode;
    }

    override set blendMode(value: BlendMode) {
      super.blendMode = value;

      if (this._screen_obj !== null) {
        this._screen_obj.blendMode = value;
      }
    }

    // Public functions

    getScreenRect(screenRect?: ISORect): ISORect | null {
      const screen_obj = this._screen_obj;

      if (screen_obj !== null) {
        let originx = this._originx;

        if (typeof originx === "string") {
          originx = screen_obj[originx];
        }

        let originy = this._originy;

        if (typeof originy === "string") {
          originy = screen_obj[originy];
        }

        let screen_rect: ISORect;

        if (screenRect !== undefined) {
          screen_rect = screenRect;
          screen_rect.left = screen_obj.left;
          screen_rect.top = screen_obj.top;
          screen_rect.width = screen_obj.width;
          screen_rect.height = screen_obj.height;
        } else {
          screen_rect = new ISORect(screen_obj);
        }

        screen_rect.originx = originx;
        screen_rect.originy = originy;
        screen_rect.elevation = this._elevation;

        return screen_rect;
      }

      return null;
    }

    getScreenAbsRect(absRect?: ISORect): ISORect | null {
      const screen_obj = this._screen_obj;

      if (screen_obj !== null) {
        let originx = this._originx;

        if (typeof originx === "string") {
          originx = screen_obj[originx];
        }

        let originy = this._originy;

        if (typeof originy === "string") {
          originy = screen_obj[originy];
        }

        let screen_rect: ISORect;

        if (absRect !== undefined) {
          screen_rect = screen_obj.getAbsRect(absRect) as ISORect;
        } else {
          screen_rect = new ISORect(screen_obj.getAbsRect());
        }

        screen_rect.originx = originx;
        screen_rect.originy = originy;
        screen_rect.elevation = this._elevation;

        return screen_rect;
      }

      return null;
    }

    // Proxy functions

    override drawFirst(): this {
      // super.drawFirst() is deliberately omitted because:
      // 1. Only the screen_obj is drawn
      // 2. Allows for changing the drawing order inside a tilemap

      this._screen_obj?.drawFirst();

      return this;
    }

    override drawLast(): this {
      // super.drawLast() is deliberately omitted because:
      // 1. Only the screen_obj is drawn
      // 2. Allows for changing the drawing order inside a tilemap

      this._screen_obj?.drawLast();

      return this;
    }

    override getDrawIndex(): number {
      if (this._screen_obj !== null) {
        return this._screen_obj.getDrawIndex();
      } else {
        return -1;
      }
    }

    override drawTo(index: number): this {
      // super.drawTo(index) is deliberately omitted because:
      // 1. Only the screen_obj is drawn
      // 2. Allows for changing the drawing order inside a tilemap

      this._screen_obj?.drawTo(index);

      return this;
    }

    override drawBefore(sprite: BaseSprite): this {
      // super.drawBefore(sprite) is deliberately omitted because:
      // 1. Only the screen_obj is drawn
      // 2. Allows for changing the drawing order inside a tilemap

      if ("_screen_obj" in sprite) {
        const s = sprite as ISOMixin;

        if (s._screen_obj !== null) {
          this._screen_obj?.drawBefore(s._screen_obj);
        }
      } else {
        this._screen_obj?.drawBefore(sprite);
      }

      return this;
    }

    override drawAfter(sprite: BaseSprite): this {
      // super.drawAfter(sprite) is deliberately omitted because:
      // 1. Only the screen_obj is drawn
      // 2. Allows for changing the drawing order inside a tilemap

      if ("_screen_obj" in sprite) {
        const s = sprite as ISOMixin;

        if (s._screen_obj !== null) {
          this._screen_obj?.drawAfter(s._screen_obj);
        }
      } else {
        this._screen_obj?.drawAfter(sprite);
      }

      return this;
    }

    override teleport(): this {
      super.teleport();
      this._screen_obj?.teleport();

      return this;
    }

    // Implementation details

    override _move(
      prop: keyof RectPosX | keyof RectPosY | "elevation" | null,
      value: number,
    ): void {
      const screen_obj = this._screen_obj;

      let originx = this._originx;

      if (typeof originx === "string") {
        originx = screen_obj?.[originx] ?? this[originx];
      }

      let originy = this._originy;

      if (typeof originy === "string") {
        originy = screen_obj?.[originy] ?? this[originy];
      }

      let referencex = this._referencex;

      if (typeof referencex === "string") {
        referencex = this[referencex];
      }

      let referencey = this._referencey;

      if (typeof referencey === "string") {
        referencey = this[referencey];
      }

      if (prop !== null) {
        if (prop === "elevation") {
          this._elevation = value;

          if (screen_obj !== null) {
            screen_obj.originy = originy + value;
          }
        } else {
          super._move(prop, value);
        }
      }

      // Step 1: Calculate the screen object position
      const [screen_x, screen_y] = screenFromGrid(
        this._left + referencex,
        this._top + referencey,
      );

      // Step 2: Move the screen object
      if (screen_obj !== null) {
        screen_obj.left = screen_x - originx;
        screen_obj.top = screen_y - originy - this._elevation;
      }
    }

    override _initRenderer(): void {
      // no-op
    }

    override _update(): void {
      // no-op
    }

    override _draw(_interp: number): void {
      // The drawing is performed only on the screen objects
    }

    override _remove(): void {
      this._screen_obj?.parent?.removeChild(this._screen_obj, {
        suppressWarning: true,
      });
    }
  };
}
