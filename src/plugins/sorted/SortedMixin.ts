import { SortedGroup } from "./SortedGroup.js";
import type { RectSizeY } from "../../Rect.js";
import type { BaseSprite } from "../../BaseSprite.js";

type GConstructor<T extends object> = new (...args: any[]) => T;

export function Sorted<TBase extends GConstructor<BaseSprite>>(Base: TBase) {
  return class SortedMixin extends Base {
    _originy: keyof RectSizeY | number = "height";
    _sort_y = 0;

    get originy() {
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

    get top() {
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

    get bottom() {
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

    get centery() {
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

    get height() {
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

    get halfHeight() {
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

    get radius() {
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

    _calcSortY() {
      let originy = this._originy;

      if (typeof originy === "string") {
        originy = this[originy];
      }

      return this.top + originy;
    }
  };
}
