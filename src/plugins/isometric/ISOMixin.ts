import { ISORect } from "./ISORect.js";
import type { BaseSprite, BlendMode } from "../../BaseSprite.js";
import type { SortedGroup } from "../sorted/SortedGroup.js";
import type { SortedSprite } from "../sorted/SortedSprite.js";
import type { SortedRectangle } from "../sorted/SortedRectangle.js";
import type { RectPosX, RectPosY, RectSizeX, RectSizeY } from "../../Rect.js";
import type { GConstructor } from "../../utils.js";
import { screenFromGrid } from "./utils.js";

export function ISO<TBase extends GConstructor<BaseSprite>>(Base: TBase) {
  return class ISOMixin extends Base {
    _elevation = 0;
    _originx: keyof RectSizeX | number = "halfWidth";
    _originy: keyof RectSizeY | number = "height";
    _referencex: keyof RectSizeX | number = "halfWidth";
    _referencey: keyof RectSizeY | number = "halfHeight";
    _screen_obj: SortedGroup | SortedSprite | SortedRectangle | null = null;

    get elevation() {
      return this._elevation;
    }

    set elevation(value: number) {
      this._move("elevation", value);
    }

    get originx() {
      return this._originx;
    }

    set originx(value: keyof RectSizeX | number) {
      this._originx = value;

      const screen_obj = this._screen_obj;

      if (screen_obj) {
        let originx = value;

        if (typeof originx === "string") {
          originx = screen_obj[originx];
        }

        screen_obj.originx = originx;
      }

      this._move(null, 0);
    }

    get originy() {
      return this._originy;
    }

    set originy(value: keyof RectSizeY | number) {
      this._originy = value;

      const screen_obj = this._screen_obj;

      if (screen_obj) {
        let originy = value;

        if (typeof originy === "string") {
          originy = screen_obj[originy];
        }

        screen_obj.originy = originy + this._elevation;
      }

      this._move(null, 0);
    }

    get reference() {
      return this._referencex as (keyof RectSizeX & keyof RectSizeY) | number;
    }

    set reference(value: (keyof RectSizeX & keyof RectSizeY) | number) {
      this._referencex = value;
      this._referencey = value;
      this._move(null, 0);
    }

    get referencex() {
      return this._referencex;
    }

    set referencex(value: keyof RectSizeX | number) {
      this._referencex = value;
      this._move(null, 0);
    }

    get referencey() {
      return this._referencey;
    }

    set referencey(value: keyof RectSizeY | number) {
      this._referencey = value;
      this._move(null, 0);
    }

    // Proxy getters & setters

    get transformOrigin() {
      return super.transformOrigin;
    }

    set transformOrigin(value: (keyof RectSizeX & keyof RectSizeY) | number) {
      super.transformOrigin = value;

      if (this._screen_obj) {
        this._screen_obj.transformOrigin = value;
      }
    }

    get transformOriginx() {
      return super.transformOriginx;
    }

    set transformOriginx(value: keyof RectSizeX | number) {
      super.transformOriginx = value;

      if (this._screen_obj) {
        this._screen_obj.transformOriginx = value;
      }
    }

    get transformOriginy() {
      return super.transformOriginy;
    }

    set transformOriginy(value: keyof RectSizeY | number) {
      super.transformOriginy = value;

      if (this._screen_obj) {
        this._screen_obj.transformOriginy = value;
      }
    }

    get angle() {
      return super.angle;
    }

    set angle(value: number) {
      super.angle = value;

      if (this._screen_obj) {
        this._screen_obj.angle = value;
      }
    }

    get scalex() {
      return super.scalex;
    }

    set scalex(value: number) {
      super.scalex = value;

      if (this._screen_obj) {
        this._screen_obj.scalex = value;
      }
    }

    get scaley() {
      return super.scaley;
    }

    set scaley(value: number) {
      super.scaley = value;

      if (this._screen_obj) {
        this._screen_obj.scaley = value;
      }
    }

    get scale() {
      return super.scale;
    }

    set scale(value: number) {
      super.scale = value;

      if (this._screen_obj) {
        this._screen_obj.scale = value;
      }
    }

    get fliph() {
      return super.fliph;
    }

    set fliph(value: boolean) {
      super.fliph = value;

      if (this._screen_obj) {
        this._screen_obj.fliph = value;
      }
    }

    get flipv() {
      return super.flipv;
    }

    set flipv(value: boolean) {
      super.flipv = value;

      if (this._screen_obj) {
        this._screen_obj.flipv = value;
      }
    }

    get flip() {
      return super.flip;
    }

    set flip(value: boolean) {
      super.flip = value;

      if (this._screen_obj) {
        this._screen_obj.flip = value;
      }
    }

    get opacity() {
      return super.opacity;
    }

    set opacity(value: number) {
      super.opacity = value;

      if (this._screen_obj) {
        this._screen_obj.opacity = value;
      }
    }

    get hidden() {
      return super.hidden;
    }

    set hidden(value: boolean) {
      super.hidden = value;

      if (this._screen_obj) {
        this._screen_obj.hidden = value;
      }
    }

    get blendMode() {
      return super.blendMode;
    }

    set blendMode(value: BlendMode) {
      super.blendMode = value;

      if (this._screen_obj) {
        this._screen_obj.blendMode = value;
      }
    }

    // Public functions

    getScreenRect() {
      const screen_obj = this._screen_obj;

      if (screen_obj) {
        let originx = this._originx;

        if (typeof originx === "string") {
          originx = screen_obj[originx];
        }

        let originy = this._originy;

        if (typeof originy === "string") {
          originy = screen_obj[originy];
        }

        const screen_rect = new ISORect(screen_obj);

        screen_rect.originx = originx;
        screen_rect.originy = originy;
        screen_rect.elevation = this._elevation;

        return screen_rect;
      }

      return null;
    }

    getScreenAbsRect() {
      const screen_obj = this._screen_obj;

      if (screen_obj) {
        let originx = this._originx;

        if (typeof originx === "string") {
          originx = screen_obj[originx];
        }

        let originy = this._originy;

        if (typeof originy === "string") {
          originy = screen_obj[originy];
        }

        const screen_rect = new ISORect(screen_obj.getAbsRect());

        screen_rect.originx = originx;
        screen_rect.originy = originy;
        screen_rect.elevation = this._elevation;

        return screen_rect;
      }

      return null;
    }

    // Proxy functions

    drawFirst() {
      super.drawFirst();
      this._screen_obj?.drawFirst();

      return this;
    }

    drawLast() {
      super.drawLast();
      this._screen_obj?.drawLast();

      return this;
    }

    getDrawIndex() {
      if (this._screen_obj) {
        return this._screen_obj.getDrawIndex();
      } else {
        return super.getDrawIndex();
      }
    }

    drawTo(index: number) {
      super.drawTo(index);
      this._screen_obj?.drawTo(index);

      return this;
    }

    drawBefore(sprite: BaseSprite) {
      super.drawBefore(sprite);

      if ("_screen_obj" in sprite) {
        const s = sprite as ISOMixin;

        if (s._screen_obj) {
          this._screen_obj?.drawBefore(s._screen_obj);
        }
      }

      return this;
    }

    drawAfter(sprite: BaseSprite) {
      super.drawAfter(sprite);

      if ("_screen_obj" in sprite) {
        const s = sprite as ISOMixin;

        if (s._screen_obj) {
          this._screen_obj?.drawAfter(s._screen_obj);
        }
      }

      return this;
    }

    teleport() {
      super.teleport();
      this._screen_obj?.teleport();

      return this;
    }

    // Implementation details

    _move(
      prop: keyof RectPosX | keyof RectPosY | "elevation" | null,
      value: number
    ) {
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

          if (screen_obj) {
            screen_obj.originy = originy + value;
          }
        } else {
          super._move(prop, value);
        }
      }

      // Step 1: Calculate the screen object position
      const [screen_x, screen_y] = screenFromGrid(
        this._left + referencex,
        this._top + referencey
      );

      // Step 2: Move the screen object
      if (screen_obj) {
        screen_obj.left = screen_x - originx;
        screen_obj.top = screen_y - originy - this._elevation;
      }

      return this;
    }

    _initRenderer() {
      // no-op
    }

    _update() {
      // no-op
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _draw(interp: number) {
      // The drawing is performed only on the screen objects
    }

    _remove() {
      this._screen_obj?.parent?.removeChild(this._screen_obj, {
        suppressWarning: true,
      });
    }
  };
}
