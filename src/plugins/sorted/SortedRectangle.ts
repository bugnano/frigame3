import { Rectangle } from "../../Rectangle.js";
import { Playground } from "../../Playground.js";
import { Sorted } from "./SortedMixin.js";
import { SortedGroup } from "./SortedGroup.js";
import type { RectangleOptions } from "../../Rectangle.js";
import type { BaseSpriteOptions } from "../../BaseSprite.js";
import type { RectSizeY } from "../../Rect.js";

export interface SortedRectangleOptions extends RectangleOptions {
  originy: keyof RectSizeY | number;
}

const SortedBaseRectangle = Sorted(Rectangle);

export class SortedRectangle extends SortedBaseRectangle {
  constructor(
    playground: Playground,
    parent?: SortedGroup,
    options?: Partial<BaseSpriteOptions & SortedRectangleOptions>
  ) {
    super(playground, parent, options);

    if (options) {
      if (options.originy !== undefined) {
        this.originy = options.originy;
      }
    }

    if (parent instanceof SortedGroup) {
      parent._needsSorting = true;
    }

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
