import { Sprite } from "../../Sprite.js";
import { Sorted } from "./SortedMixin.js";
import { SortedGroup } from "./SortedGroup.js";
import type { SortedAnimation } from "./SortedAnimation.js";
import type { Playground } from "../../Playground.js";
import type { SpriteOptions } from "../../Sprite.js";
import type { BaseSpriteOptions } from "../../BaseSprite.js";
import type { RectSizeX, RectSizeY } from "../../Rect.js";

export interface SortedSpriteOptions extends SpriteOptions {
  originx: keyof RectSizeX | number;
  originy: keyof RectSizeY | number;
}

const SortedBaseSprite = Sorted(Sprite);

export class SortedSprite extends SortedBaseSprite {
  get animation() {
    return super.animation as SortedAnimation | null;
  }

  set animation(value: SortedAnimation | null) {
    if (value !== super.animation) {
      const parent = this.parent;

      if (parent instanceof SortedGroup) {
        parent._needsSorting = true;
      }

      super.animation = value;

      if (value) {
        this._originx = value.originx;
        this._originy = value.originy;
      }

      this._sort_y = this._calcSortY();
    }
  }

  constructor(
    playground: Playground,
    parent: SortedGroup,
    options?: Partial<BaseSpriteOptions & SortedSpriteOptions>
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

export function addSortedSprite(
  parent: SortedGroup,
  options?: Partial<BaseSpriteOptions & SortedSpriteOptions>
) {
  const sprite = new SortedSprite(parent.playground!, parent, options);

  parent.addChild(sprite);

  return sprite;
}

export function insertSortedSprite(
  parent: SortedGroup,
  options?: Partial<BaseSpriteOptions & SortedSpriteOptions>
) {
  const sprite = new SortedSprite(parent.playground!, parent, options);

  parent.insertChild(sprite);

  return sprite;
}
