import { ISOSpriteGroup } from "./ISOSpriteGroup.js";
import { addISOSprite } from "./ISOSprite.js";
import { addISORectangle } from "./ISORectangle.js";
import type { Playground } from "../../Playground.js";
import type { SpriteGroup } from "../../SpriteGroup.js";
import type { ISORectOptions } from "./ISORect.js";
import type { BaseSpriteOptions } from "../../BaseSprite.js";
import type { ISOGroupOptions } from "./ISOSpriteGroup.js";
import type { ISOSpriteOptions } from "./ISOSprite.js";
import type { ISORectangleOptions } from "./ISORectangle.js";

// animationList MUST have at least `animation` or `background`
export interface ISOTilemapOptions {
  sizex: number; // Num tiles
  sizey: number; // Num tiles
  tileSize: number; // Pixel
  data: number[]; // (sizex * sizey) members, indices of animationList
  animationList: Record<
    number,
    Partial<ISOSpriteOptions> | Partial<ISORectangleOptions>
  >;
}

export class ISOTilemap extends ISOSpriteGroup {
  sizex = 0;
  sizey = 0;
  tileSize = 0;

  _locations: Uint32Array;

  constructor(
    playground: Playground,
    parent: SpriteGroup,
    options: ISOTilemapOptions &
      Partial<BaseSpriteOptions & ISORectOptions & ISOGroupOptions>
  ) {
    super(playground, parent, options);

    const { sizex, sizey, tileSize } = options;

    this.sizex = sizex;
    this.sizey = sizey;
    this.tileSize = tileSize;

    const locations = new Uint32Array(sizex * sizey).fill(0xffffffff);
    this._locations = locations;
    const layers = this._layers;

    if (
      options.width === undefined &&
      options.halfWidth === undefined &&
      options.radius === undefined
    ) {
      this.width = sizex * tileSize;
    }

    if (
      options.height === undefined &&
      options.halfHeight === undefined &&
      options.radius === undefined
    ) {
      this.height = sizey * tileSize;
    }

    const animationList = options.animationList;

    let i_location = 0;
    let row = 0;
    let col = 0;
    let left = 0;
    let top = 0;
    for (const data of options.data) {
      const animation_options = animationList[data];
      if (
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        animation_options &&
        "animation" in animation_options
      ) {
        // Sprite
        const sprite_options = Object.assign({}, animation_options, {
          left,
          top,
          width: tileSize,
          height: tileSize,
        });
        addISOSprite(this, sprite_options);
        locations[i_location] = layers.length - 1;
      } else if (
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        animation_options &&
        "background" in animation_options
      ) {
        // Rectangle
        const rectangle_options = Object.assign({}, animation_options, {
          left,
          top,
          width: tileSize,
          height: tileSize,
        });
        addISORectangle(this, rectangle_options);
        locations[i_location] = layers.length - 1;
      } else {
        // TODO: Invalid
      }

      i_location += 1;
      left += tileSize;
      col += 1;
      if (col >= sizex) {
        col = 0;
        left = 0;
        row += 1;
        top += tileSize;
        if (row >= sizey) {
          break;
        }
      }
    }
  }

  getAt(row: number, col: number) {
    return this._layers[this._locations[row * this.sizex + col]];
  }
}

export function addISOTilemap(
  parent: SpriteGroup,
  options: ISOTilemapOptions &
    Partial<BaseSpriteOptions & ISORectOptions & ISOGroupOptions>
) {
  const tilemap = new ISOTilemap(parent.playground!, parent, options);

  parent.addChild(tilemap);

  tilemap._screen_obj.drawLast();

  return tilemap;
}

export function insertISOTilemap(
  parent: SpriteGroup,
  options: ISOTilemapOptions &
    Partial<BaseSpriteOptions & ISORectOptions & ISOGroupOptions>
) {
  const tilemap = new ISOTilemap(parent.playground!, parent, options);

  parent.insertChild(tilemap);

  tilemap._screen_obj.drawFirst();

  return tilemap;
}
