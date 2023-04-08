import { Rectangle } from "../../Rectangle.js";
import { Sorted } from "./SortedMixin.js";
import type { SortedGroup } from "./SortedGroup.js";
import type { Playground } from "../../Playground.js";
import type { RectangleOptions } from "../../Rectangle.js";
import type { BaseSpriteOptions } from "../../BaseSprite.js";
import type { RectSizeX, RectSizeY } from "../../Rect.js";

export interface SortedRectangleOptions extends RectangleOptions {
  originx: keyof RectSizeX | number;
  originy: keyof RectSizeY | number;
}

const SortedBaseRectangle = Sorted(Rectangle);

export class SortedRectangle extends SortedBaseRectangle {
  constructor(
    playground: Playground,
    parent: SortedGroup,
    options?: Partial<BaseSpriteOptions & SortedRectangleOptions>
  ) {
    super(playground, parent, options);

    if (options) {
      if (options.originx !== undefined) {
        this.originx = options.originx;
      }
      if (options.originy !== undefined) {
        this.originy = options.originy;
      }
    }

    parent._needsSorting = true;

    this._sort_y = this._calcSortY();
  }
}

export function addSortedRectangle(
  parent: SortedGroup,
  options?: Partial<BaseSpriteOptions & SortedRectangleOptions>
) {
  const rectangle = new SortedRectangle(parent.playground!, parent, options);

  parent.addChild(rectangle);

  return rectangle;
}

export function insertSortedRectangle(
  parent: SortedGroup,
  options?: Partial<BaseSpriteOptions & SortedRectangleOptions>
) {
  const rectangle = new SortedRectangle(parent.playground!, parent, options);

  parent.insertChild(rectangle);

  return rectangle;
}
