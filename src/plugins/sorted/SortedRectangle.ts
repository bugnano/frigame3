import type { RectangleOptions } from "../../Rectangle.js";
import { Rectangle } from "../../Rectangle.js";
import type { SpriteRef } from "../../utils.js";
import type { SortedOptions } from "./SortedMixin.js";
import { Sorted } from "./SortedMixin.js";

export interface SortedRectangleOptions
  extends RectangleOptions,
    SortedOptions {}

const SortedBaseRectangle = Sorted(Rectangle);

export class SortedRectangle
  extends SortedBaseRectangle
  implements SortedRectangleOptions
{
  constructor(
    options?: Partial<SortedRectangleOptions> & {
      ref?: SpriteRef<SortedRectangle>;
    },
  ) {
    super(options);

    if (options !== undefined) {
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
