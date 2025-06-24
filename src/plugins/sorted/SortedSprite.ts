import type { BaseSpriteOptions } from "../../BaseSprite.js";
import type { RectSizeX, RectSizeY } from "../../Rect.js";
import type { SpriteOptions } from "../../Sprite.js";
import { Sprite } from "../../Sprite.js";
import type { SpriteRef } from "../../utils.js";
import type { SortedAnimation } from "./SortedAnimation.js";
import { SortedGroup } from "./SortedGroup.js";
import { Sorted } from "./SortedMixin.js";

export interface SortedSpriteOptions extends SpriteOptions {
  originx: keyof RectSizeX | number;
  originy: keyof RectSizeY | number;
}

const SortedBaseSprite = Sorted(Sprite);

export class SortedSprite extends SortedBaseSprite {
  get animation(): SortedAnimation | null {
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
    options?: Partial<BaseSpriteOptions & SortedSpriteOptions> & {
      ref?: SpriteRef<SortedSprite>;
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
