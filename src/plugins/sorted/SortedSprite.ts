import { Sprite } from "../../Sprite.js";
import { Playground } from "../../Playground.js";
import { Sorted } from "./SortedMixin.js";
import { SortedAnimation } from "./SortedAnimation.js";
import { SortedGroup } from "./SortedGroup.js";
import type { SpriteOptions } from "../../Sprite.js";
import type { BaseSpriteOptions } from "../../BaseSprite.js";
import type { RectSizeY } from "../../Rect.js";
import type { Animation } from "../../Animation.js";

export interface SortedSpriteOptions extends SpriteOptions {
  originy: keyof RectSizeY | number;
}

const SortedBaseSprite = Sorted(Sprite);

export class SortedSprite extends SortedBaseSprite {
  get animation() {
    return super.animation;
  }

  set animation(value: Animation | null) {
    if (value !== super.animation) {
      const parent = this.parent;
      if (parent instanceof SortedGroup) {
        parent._needsSorting = true;
      }

      super.animation = value;

      if (value instanceof SortedAnimation) {
        this._originy = value.originy;
      }

      this._sort_y = this._calcSortY();
    }
  }

  constructor(
    playground: Playground,
    parent?: SortedGroup,
    options?: Partial<BaseSpriteOptions & SortedSpriteOptions>
  ) {
    super(playground, parent, options);

    if (options) {
      if (options.animation instanceof SortedAnimation) {
        this.originy = options.animation.originy;
      }

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
