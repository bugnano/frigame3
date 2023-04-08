import { SpriteGroup } from "../../SpriteGroup.js";
import { ISO } from "./ISOMixin.js";
import { addSortedGroup } from "../sorted/SortedGroup.js";
import { pick } from "../../utils.js";
import type { SortedGroup } from "../sorted/SortedGroup.js";
import type { Playground } from "../../Playground.js";
import type { ISORectOptions } from "./ISORect.js";
import type { SpriteGroupOptions } from "../../SpriteGroup.js";
import type { BaseSpriteOptions } from "../../BaseSprite.js";
import type { RectSizeX, RectSizeY } from "../../Rect.js";

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
  _screen_obj: SortedGroup;

  // Proxy getters & setters
  get crop() {
    return this._screen_obj.crop;
  }

  set crop(value: boolean) {
    this._screen_obj.crop = value;
  }

  get borderRadius() {
    return this._screen_obj.borderRadius;
  }

  set borderRadius(value: number) {
    this._screen_obj.borderRadius = value;
  }

  constructor(
    playground: Playground,
    parent: SpriteGroup,
    options?: Partial<BaseSpriteOptions & ISORectOptions & ISOGroupOptions>
  ) {
    super(playground, parent);

    // The screen sprite group must be created in the screen layer
    const parent_screen_obj =
      "_screen_obj" in parent ? (parent._screen_obj as ISOSpriteGroup) : parent;

    this._screen_obj = addSortedGroup(parent_screen_obj);

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
        ])
      );
    }

    this._move(null, 0);
    this.teleport();
  }

  // Implementation details

  _resize(prop: keyof RectSizeX | keyof RectSizeY, value: number) {
    // TODO: I'm not sure that proxying the new size is the right approach here,
    // as the screen object is merely a graphical representation of a projection.
    // In theory the size of any ISO should be independent of the size of its
    // screen object.
    super._resize(prop, value);

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    this._screen_obj?._resize(prop, value);
  }
}

export function addISOGroup(
  parent: SpriteGroup,
  options?: Partial<BaseSpriteOptions & ISORectOptions & ISOGroupOptions>
) {
  const group = new ISOSpriteGroup(parent.playground!, parent, options);

  parent.addChild(group);

  group._screen_obj.drawLast();

  return group;
}

export function insertISOGroup(
  parent: SpriteGroup,
  options?: Partial<BaseSpriteOptions & ISORectOptions & ISOGroupOptions>
) {
  const group = new ISOSpriteGroup(parent.playground!, parent, options);

  parent.insertChild(group);

  group._screen_obj.drawFirst();

  return group;
}
