import { SpriteGroup } from "../../SpriteGroup.js";
import { Sorted } from "./SortedMixin.js";
import type { Playground } from "../../Playground.js";
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

  constructor(
    playground: Playground,
    parent: SpriteGroup,
    options?: Partial<BaseSpriteOptions & SortedGroupOptions>
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

    if (parent instanceof SortedGroup) {
      parent._needsSorting = true;
    }

    this._sort_y = this._calcSortY();
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

export function addSortedGroup(
  parent: SpriteGroup,
  options?: Partial<BaseSpriteOptions & SortedGroupOptions>
) {
  const group = new SortedGroup(parent.playground!, parent, options);

  parent.addChild(group);

  return group;
}

export function insertSortedGroup(
  parent: SpriteGroup,
  options?: Partial<BaseSpriteOptions & SortedGroupOptions>
) {
  const group = new SortedGroup(parent.playground!, parent, options);

  parent.insertChild(group);

  return group;
}
