import { BaseSprite } from "./BaseSprite.js";
import type { Playground } from "./Playground.js";
import type { BaseSpriteOptions } from "./BaseSprite.js";
import { pick } from "./utils.js";

export interface SpriteGroupOptions {
  crop: boolean;
  borderRadius: number;
}

export class SpriteGroup extends BaseSprite {
  _crop = false;
  _borderRadius = 0;

  get crop() {
    return this._crop;
  }

  set crop(value: boolean) {
    this._crop = value;
  }

  get borderRadius() {
    return this._borderRadius;
  }

  set borderRadius(value: number) {
    this._borderRadius = value;
  }

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
      Object.assign(this, pick(options, ["crop", "borderRadius"]));

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
    } else {
      if (parent) {
        this.width = parent.width;
        this.height = parent.height;
      }
    }

    this._checkUpdate();

    this.teleport();

    playground._renderer.initGroup(this);
  }

  // Public functions

  clear() {
    for (const sprite of this._layers) {
      sprite._remove();
    }

    this._layers.splice(0, this._layers.length);
    this._updateList.splice(0, this._updateList.length);

    this._checkUpdate();

    return this;
  }

  addChild(child: BaseSprite) {
    this._layers.push(child);

    this._checkUpdate();

    return this;
  }

  insertChild(child: BaseSprite) {
    this._layers.unshift(child);

    this._checkUpdate();

    return this;
  }

  removeChild(
    child: BaseSprite | null,
    options?: { suppressWarning?: boolean }
  ) {
    if (!child) {
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

      child._remove();

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
    super._draw(interp);

    const playground = this.playground;

    if (playground) {
      const absLeft = playground._absLeft;
      const absTop = playground._absTop;

      playground._absLeft += this._drawLeft;
      playground._absTop += this._drawTop;

      const renderer = playground._renderer;

      renderer.drawGroupBeforeChildren(this, interp);

      for (const sprite of this._layers) {
        sprite._draw(interp);
      }

      renderer.drawGroupAfterChildren(this, interp);

      playground._absLeft = absLeft;
      playground._absTop = absTop;
    }
  }

  _remove() {
    this.clear();

    this.playground?._renderer.removeGroup(this);
  }
}

export function addGroup(
  parent: SpriteGroup,
  options?: Partial<BaseSpriteOptions & SpriteGroupOptions>
) {
  const group = new SpriteGroup(parent.playground!, parent, options);

  parent.addChild(group);

  return group;
}

export function insertGroup(
  parent: SpriteGroup,
  options?: Partial<BaseSpriteOptions & SpriteGroupOptions>
) {
  const group = new SpriteGroup(parent.playground!, parent, options);

  parent.insertChild(group);

  return group;
}
