import { BaseSprite } from "./BaseSprite.js";
import type { Playground } from "./Playground.js";
import type { BaseSpriteOptions } from "./BaseSprite.js";
import { pick } from "./utils.js";

export interface SpriteGroupOptions {
  crop: boolean;
  borderRadius: number;
}

export class SpriteGroup extends BaseSprite {
  crop = false;
  borderRadius = 0;

  // Implementation details
  _layers: BaseSprite[] = [];
  _updateList: BaseSprite[] = [];

  constructor(
    playground: Playground,
    parent?: SpriteGroup,
    options?: Partial<BaseSpriteOptions & SpriteGroupOptions>
  ) {
    super(playground, parent, options);

    if (options) {
      for (const [prop, val] of Object.entries(
        pick(options, ["crop", "borderRadius"])
      )) {
        (this as any)[prop as keyof SpriteGroupOptions] = val;
      }

      if (parent) {
        if (
          options.width === undefined &&
          options.halfWidth === undefined &&
          options.radius === undefined
        ) {
          this.width = parent.width;
        }

        if (
          options.height === undefined &&
          options.halfHeight === undefined &&
          options.radius === undefined
        ) {
          this.height = parent.height;
        }
      }
    }

    this._checkUpdate();

    this.teleport();
  }

  // Public functions

  clear() {
    this._layers.splice(0, this._layers.length);
    this._updateList.splice(0, this._updateList.length);

    this._checkUpdate();

    return this;
  }

  removeChild(
    child: BaseSprite | null,
    options?: { suppressWarning?: boolean }
  ) {
    if (child == null) {
      if (
        typeof console !== "undefined" &&
        (!options || options.suppressWarning === false)
      ) {
        console.warn("child is null");
        console.trace();
      }
      return this;
    }

    const layers = this._layers;

    const index = layers.indexOf(child);
    if (index >= 0) {
      layers.splice(index, 1);

      const update_list = this._updateList;

      const i = update_list.indexOf(child);
      if (i >= 0) {
        update_list.splice(i, 1);
      }

      this._checkUpdate();
    } else {
      if (
        typeof console !== "undefined" &&
        (!options || options.suppressWarning === false)
      ) {
        console.warn("No children removed");
        console.trace();
      }
    }

    return this;
  }

  // Implementation details

  _checkUpdate() {
    const oldNeedsUpdate = this._needsUpdate;

    if (this._layers.length === 0) {
      this._needsUpdate = false;
    } else {
      this._needsUpdate = true;
    }

    this._updateNeedsUpdate(oldNeedsUpdate);
  }

  _update() {
    for (const sprite of this._updateList) {
      sprite._update();
    }
  }

  _draw(interp: number) {
    const playground = this.playground;

    if (playground) {
      let left = this._left;
      let top = this._top;
      const prevLeft = this._prevLeft;
      const prevTop = this._prevTop;

      if (left !== prevLeft || top !== prevTop) {
        if (this._frameCounterLastMove === playground.frameCounter - 1) {
          left = left * interp + prevLeft * (1 - interp);
          top = top * interp + prevTop * (1 - interp);
        }
      }

      const absLeft = playground._absLeft;
      const absTop = playground._absTop;

      playground._absLeft += left;
      playground._absTop += top;

      for (const sprite of this._layers) {
        sprite._draw(interp);
      }

      playground._absLeft = absLeft;
      playground._absTop = absTop;
    }
  }
}

export function addGroup(
  parent: SpriteGroup,
  options?: Partial<BaseSpriteOptions & SpriteGroupOptions>
) {
  const group = new SpriteGroup(parent.playground!, parent, options);
  parent._layers.push(group);

  parent._checkUpdate();

  return group;
}

export function insertGroup(
  parent: SpriteGroup,
  options?: Partial<BaseSpriteOptions & SpriteGroupOptions>
) {
  const group = new SpriteGroup(parent.playground!, parent, options);
  parent._layers.unshift(group);

  parent._checkUpdate();

  return group;
}
