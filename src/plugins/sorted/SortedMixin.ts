import { SortedGroup } from "./SortedGroup.js";
import type { BaseSprite } from "../../BaseSprite.js";
import type { RectSizeX, RectSizeY } from "../../Rect.js";
import type { GConstructor } from "../../utils.js";

export function Sorted<TBase extends GConstructor<BaseSprite>>(Base: TBase) {
  return class SortedMixin extends Base {
    _originx: keyof RectSizeX | number = "halfWidth";
    _originy: keyof RectSizeY | number = "height";
    _sort_y = 0;

    get originx(): keyof RectSizeX | number {
      return this._originx;
    }

    set originx(value: keyof RectSizeX | number) {
      this._originx = value;
    }

    get originy(): keyof RectSizeY | number {
      return this._originy;
    }

    set originy(value: keyof RectSizeY | number) {
      if (value !== this._originy) {
        const parent = this.parent;
        if (parent instanceof SortedGroup) {
          parent._needsSorting = true;
        }

        this._originy = value;
        this._sort_y = this._calcSortY();
      }
    }

    get top(): number {
      return super.top;
    }

    set top(value: number) {
      if (value !== super.top) {
        const parent = this.parent;
        if (parent instanceof SortedGroup) {
          parent._needsSorting = true;
        }

        super.top = value;
        this._sort_y = this._calcSortY();
      }
    }

    get bottom(): number {
      return super.bottom;
    }

    set bottom(value: number) {
      if (value !== super.bottom) {
        const parent = this.parent;
        if (parent instanceof SortedGroup) {
          parent._needsSorting = true;
        }

        super.bottom = value;
        this._sort_y = this._calcSortY();
      }
    }

    get centery(): number {
      return super.centery;
    }

    set centery(value: number) {
      if (value !== super.centery) {
        const parent = this.parent;
        if (parent instanceof SortedGroup) {
          parent._needsSorting = true;
        }

        super.centery = value;
        this._sort_y = this._calcSortY();
      }
    }

    get height(): number {
      return super.height;
    }

    set height(value: number) {
      if (value !== super.height) {
        const parent = this.parent;
        if (parent instanceof SortedGroup) {
          parent._needsSorting = true;
        }

        super.height = value;
        this._sort_y = this._calcSortY();
      }
    }

    get halfHeight(): number {
      return super.halfHeight;
    }

    set halfHeight(value: number) {
      if (value !== super.halfHeight) {
        const parent = this.parent;
        if (parent instanceof SortedGroup) {
          parent._needsSorting = true;
        }

        super.halfHeight = value;
        this._sort_y = this._calcSortY();
      }
    }

    get radius(): number {
      return super.radius;
    }

    set radius(value: number) {
      if (value !== super.halfWidth || value !== super.halfHeight) {
        const parent = this.parent;
        if (parent instanceof SortedGroup) {
          parent._needsSorting = true;
        }

        super.radius = value;
        this._sort_y = this._calcSortY();
      }
    }

    _calcSortY(): number {
      let originy = this._originy;

      if (typeof originy === "string") {
        originy = this[originy];
      }

      return this.top + originy;
    }
  };
}
