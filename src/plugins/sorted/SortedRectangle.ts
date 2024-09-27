import type { BaseSpriteOptions } from "../../BaseSprite.js";
import type { RectSizeX, RectSizeY } from "../../Rect.js";
import { Rectangle } from "../../Rectangle.js";
import type { RectangleOptions } from "../../Rectangle.js";
import type { SpriteRef } from "../../utils.js";
import { Sorted } from "./SortedMixin.js";

export interface SortedRectangleOptions extends RectangleOptions {
  originx: keyof RectSizeX | number;
  originy: keyof RectSizeY | number;
}

const SortedBaseRectangle = Sorted(Rectangle);

export class SortedRectangle extends SortedBaseRectangle {
  constructor(
    options?: Partial<BaseSpriteOptions & SortedRectangleOptions> & {
      ref?: SpriteRef<SortedRectangle>;
    },
  ) {
    super(options);

    if (options) {
      if (options.originx !== undefined) {
        this.originx = options.originx;
      }
      if (options.originy !== undefined) {
        this.originy = options.originy;
      }
    }

    this._sort_y = this._calcSortY();
  }
}
