import { BaseSprite } from "./BaseSprite.js";
import type { BaseSpriteOptions } from "./BaseSprite.js";
import { pick } from "./utils.js";

export interface SpriteGroupOptions {
  crop: boolean;
  borderRadius: number;
  children: BaseSprite[];
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

  constructor(options?: Partial<BaseSpriteOptions & SpriteGroupOptions>) {
    super(options);

    if (options) {
      Object.assign(this, pick(options, ["crop", "borderRadius"]));

      if (options.children) {
        for (const child of options.children) {
          this.addChild(child);
        }
      }
    }

    this.teleport();
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

  addChild<T extends BaseSprite>(
    child: T,
    options?: { suppressWarning?: boolean }
  ) {
    if (!child.parent) {
      this._layers.push(child);

      this._reparentChild(child);

      this._checkUpdate();
    } else {
      if (
        typeof console !== "undefined" &&
        (!options || options.suppressWarning === false)
      ) {
        console.warn("child already has a parent");
        console.trace();
      }
    }

    return child;
  }

  insertChild<T extends BaseSprite>(
    child: T,
    options?: { suppressWarning?: boolean }
  ) {
    if (!child.parent) {
      this._layers.unshift(child);

      this._reparentChild(child);

      this._checkUpdate();
    } else {
      if (
        typeof console !== "undefined" &&
        (!options || options.suppressWarning === false)
      ) {
        console.warn("child already has a parent");
        console.trace();
      }
    }

    return child;
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

  _reparentChild(child: BaseSprite) {
    child._parent = new WeakRef(this);
    child._needsUpdate = false;
    child._checkUpdate();

    this._addPlaygroundToChild(child);
  }

  _addPlaygroundToChild(child: BaseSprite) {
    const playground = this.playground;

    if (playground) {
      child._playground = new WeakRef(playground);
      child._frameCounterLastMove = playground.frameCounter;
      child._initRenderer();
      child._onReparent();

      if ("_layers" in child) {
        for (const layer of child._layers as BaseSprite[]) {
          this._addPlaygroundToChild(layer);
        }
      }
    }
  }

  _checkUpdate() {
    const oldNeedsUpdate = this._needsUpdate;

    if (this._layers.length === 0) {
      this._needsUpdate = false;
    } else {
      this._needsUpdate = true;
    }

    this._updateNeedsUpdate(oldNeedsUpdate);
  }

  _initRenderer() {
    this.playground?._renderer.initGroup(this);
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
