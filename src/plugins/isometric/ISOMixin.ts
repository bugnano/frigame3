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
    _screen_obj?: SortedGroup | SortedSprite | SortedRectangle;

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
      const screen_obj = this._screen_obj!;

      let originx = value;

      if (typeof originx === "string") {
        originx = screen_obj[originx];
      }

      this._originx = value;
      screen_obj.originx = originx;
      this._move(null, 0);
    }

    get originy() {
      return this._originy;
    }

    set originy(value: keyof RectSizeY | number) {
      const screen_obj = this._screen_obj!;

      let originy = value;

      if (typeof originy === "string") {
        originy = screen_obj[originy];
      }

      this._originy = value;
      screen_obj.originy = originy + this._elevation;
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

    get hidden() {
      return this._screen_obj!.hidden;
    }

    set hidden(value: boolean) {
      this._screen_obj!.hidden = value;
    }

    get transformOrigin() {
      return this._screen_obj!.transformOrigin;
    }

    set transformOrigin(value: (keyof RectSizeX & keyof RectSizeY) | number) {
      this._screen_obj!.transformOrigin = value;
    }

    get transformOriginx() {
      return this._screen_obj!.transformOriginx;
    }

    set transformOriginx(value: keyof RectSizeX | number) {
      this._screen_obj!.transformOriginx = value;
    }

    get transformOriginy() {
      return this._screen_obj!.transformOriginy;
    }

    set transformOriginy(value: keyof RectSizeY | number) {
      this._screen_obj!.transformOriginy = value;
    }

    get angle() {
      return this._screen_obj!.angle;
    }

    set angle(value: number) {
      this._screen_obj!.angle = value;
    }

    get scalex() {
      return this._screen_obj!.scalex;
    }

    set scalex(value: number) {
      this._screen_obj!.scalex = value;
    }

    get scaley() {
      return this._screen_obj!.scaley;
    }

    set scaley(value: number) {
      this._screen_obj!.scaley = value;
    }

    get scale() {
      return this._screen_obj!.scale;
    }

    set scale(value: number) {
      this._screen_obj!.scale = value;
    }

    get fliph() {
      return this._screen_obj!.fliph;
    }

    set fliph(value: boolean) {
      this._screen_obj!.fliph = value;
    }

    get flipv() {
      return this._screen_obj!.flipv;
    }

    set flipv(value: boolean) {
      this._screen_obj!.flipv = value;
    }

    get flip() {
      return this._screen_obj!.flip;
    }

    set flip(value: boolean) {
      this._screen_obj!.flip = value;
    }

    get opacity() {
      return this._screen_obj!.opacity;
    }

    set opacity(value: number) {
      this._screen_obj!.opacity = value;
    }

    get blendMode() {
      return this._screen_obj!.blendMode;
    }

    set blendMode(value: BlendMode) {
      this._screen_obj!.blendMode = value;
    }

    // Public functions

    getScreenRect() {
      const screen_obj = this._screen_obj!;

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

    getScreenAbsRect() {
      const screen_obj = this._screen_obj!;

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

    // Proxy functions

    drawFirst() {
      super.drawFirst();
      this._screen_obj!.drawFirst();

      return this;
    }

    drawLast() {
      super.drawLast();
      this._screen_obj!.drawLast();

      return this;
    }

    getDrawIndex() {
      return this._screen_obj!.getDrawIndex();
    }

    drawTo(index: number) {
      super.drawTo(index);
      this._screen_obj!.drawTo(index);

      return this;
    }

    drawBefore(sprite: BaseSprite) {
      super.drawBefore(sprite);

      if ("_screen_obj" in sprite) {
        this._screen_obj!.drawBefore((sprite as ISOMixin)._screen_obj!);
      }

      return this;
    }

    drawAfter(sprite: BaseSprite) {
      super.drawAfter(sprite);

      if ("_screen_obj" in sprite) {
        this._screen_obj!.drawAfter((sprite as ISOMixin)._screen_obj!);
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _draw(interp: number) {
      // The drawing is performed only on the screen objects
    }

    _remove() {
      super._remove();

      this._screen_obj!.parent?.removeChild(this._screen_obj!, {
        suppressWarning: true,
      });
    }
  };
}
