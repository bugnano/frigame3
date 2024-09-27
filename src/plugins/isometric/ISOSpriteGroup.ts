import type { BaseSpriteOptions } from "../../BaseSprite.js";
import type { RectSizeX, RectSizeY } from "../../Rect.js";
import { SpriteGroup } from "../../SpriteGroup.js";
import type { SpriteGroupOptions } from "../../SpriteGroup.js";
import { pick } from "../../utils.js";
import type { SpriteRef } from "../../utils.js";
import { SortedGroup } from "../sorted/SortedGroup.js";
import { ISO } from "./ISOMixin.js";
import type { ISORectOptions } from "./ISORect.js";

export interface ISOGroupOptions extends SpriteGroupOptions {
  reference: (keyof RectSizeX & keyof RectSizeY) | number;
  referencex: keyof RectSizeX | number;
  referencey: keyof RectSizeY | number;
}

const ISOBaseGroup = ISO(SpriteGroup);

export class ISOSpriteGroup extends ISOBaseGroup {
  _originx: keyof RectSizeX | number = 0;
  _originy: keyof RectSizeY | number = 0;
  _referencex: keyof RectSizeX | number = 0;
  _referencey: keyof RectSizeY | number = 0;
  _screen_obj: SortedGroup | null = null;

  // Proxy getters & setters

  get crop(): boolean {
    return super.crop;
  }

  set crop(value: boolean) {
    super.crop = value;

    if (this._screen_obj) {
      this._screen_obj.crop = value;
    }
  }

  get borderRadius(): number {
    return super.borderRadius;
  }

  set borderRadius(value: number) {
    super.borderRadius = value;

    if (this._screen_obj) {
      this._screen_obj.borderRadius = value;
    }
  }

  constructor(
    options?: Partial<BaseSpriteOptions & ISORectOptions & ISOGroupOptions> & {
      ref?: SpriteRef<ISOSpriteGroup>;
    },
  ) {
    super();

    if (options) {
      Object.assign(
        this,
        pick(options, [
          "left",
          "right",
          "centerx",
          "top",
          "bottom",
          "centery",
          "width",
          "halfWidth",
          "height",
          "halfHeight",
          "radius",
          "transformOrigin",
          "transformOriginx",
          "transformOriginy",
          "angle",
          "scale",
          "scalex",
          "scaley",
          "flip",
          "fliph",
          "flipv",
          "opacity",
          "hidden",
          "blendMode",
          "crop",
          "borderRadius",
          "originx",
          "originy",
          "referencex",
          "referencey",
          "elevation",
        ]),
      );

      if (options.children) {
        for (const child of options.children) {
          this.addChild(child);
        }
      }

      if (options.ref) {
        options.ref.current = this;
      }
    }

    this._move(null, 0);
    this.teleport();
  }

  // Implementation details

  _resize(prop: keyof RectSizeX | keyof RectSizeY, value: number): void {
    // TODO: I'm not sure that proxying the new size is the right approach here,
    // as the screen object is merely a graphical representation of a projection.
    // In theory the size of any ISO should be independent of the size of its
    // screen object.
    super._resize(prop, value);

    this._screen_obj?._resize(prop, value);
  }

  _onReparent(): void {
    // The screen sprite group must be created in the screen layer
    const parent = this.parent!;
    const parent_screen_obj =
      "_screen_obj" in parent ? (parent._screen_obj as SortedGroup) : parent;

    // TODO: Is the newly created screen object in the correct drawing order?
    this._screen_obj = parent_screen_obj.addChild(
      new SortedGroup({
        width: this.width,
        height: this.height,
        transformOriginx: this.transformOriginx,
        transformOriginy: this.transformOriginy,
        angle: this.angle,
        scalex: this.scalex,
        scaley: this.scaley,
        fliph: this.fliph,
        flipv: this.flipv,
        opacity: this.opacity,
        hidden: this.hidden,
        blendMode: this.blendMode,
        crop: this.crop,
        borderRadius: this.borderRadius,
        originx: this.originx,
        originy: this.originy,
      }),
    );

    this._move("elevation", this.elevation);
    this.teleport();
  }

  _remove(): void {
    super._remove();

    this.clear();
  }
}
