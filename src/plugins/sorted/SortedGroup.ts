import { BaseSprite } from "../../BaseSprite.js";
import { SpriteGroup } from "../../SpriteGroup.js";
import { Sorted } from "./SortedMixin.js";
import type { SpriteGroupOptions } from "../../SpriteGroup.js";
import type { BaseSpriteOptions } from "../../BaseSprite.js";
import type { RectSizeX, RectSizeY } from "../../Rect.js";

export interface SortedGroupOptions extends SpriteGroupOptions {
  originx: keyof RectSizeX | number;
  originy: keyof RectSizeY | number;
}

const SortedBaseGroup = Sorted(SpriteGroup);

export class SortedGroup extends SortedBaseGroup {
  _needsSorting = false;

  constructor(options?: Partial<BaseSpriteOptions & SortedGroupOptions>) {
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

  addChild<T extends BaseSprite>(
    child: T,
    options?: { suppressWarning?: boolean }
  ) {
    super.addChild(child, options);

    this._needsSorting = true;

    return child;
  }

  insertChild<T extends BaseSprite>(
    child: T,
    options?: { suppressWarning?: boolean }
  ) {
    super.insertChild(child, options);

    this._needsSorting = true;

    return child;
  }

  _sortLayers() {
    const layers = this._layers;
    const len_layers = layers.length;

    if (len_layers > 1) {
      let prev = layers[0] as SortedGroup;
      let prev_y = prev._sort_y;
      for (let i_cur = 1; i_cur < len_layers; i_cur += 1) {
        let cur = layers[i_cur] as SortedGroup;
        let cur_y = cur._sort_y;

        while (cur_y < prev_y) {
          layers.splice(i_cur, 1);

          let i_sorted = i_cur - 2;
          for (; i_sorted >= 0; i_sorted -= 1) {
            if (cur_y >= (layers[i_sorted] as SortedGroup)._sort_y) {
              break;
            }
          }

          layers.splice(i_sorted + 1, 0, cur);
          cur = layers[i_cur] as SortedGroup;
          cur_y = cur._sort_y;
        }

        prev = cur;
        prev_y = cur_y;
      }
    }
  }

  _draw(interp: number) {
    if (this._needsSorting) {
      this._needsSorting = false;
      this._sortLayers();
    }

    super._draw(interp);
  }
}
