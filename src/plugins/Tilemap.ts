import type { BaseSprite, BaseSpriteOptions } from "../BaseSprite.js";
import { Rectangle } from "../Rectangle.js";
import type { RectangleOptions } from "../Rectangle.js";
import { Sprite } from "../Sprite.js";
import type { SpriteOptions } from "../Sprite.js";
import { SpriteGroup } from "../SpriteGroup.js";
import type { SpriteGroupOptions } from "../SpriteGroup.js";
import type { SpriteRef } from "../utils.js";

// animationList MUST have at least `animation` or `background`
export interface TilemapOptions {
  sizex: number; // Num tiles
  sizey: number; // Num tiles
  tileWidth: number; // Pixel
  tileHeight: number; // Pixel
  data: number[]; // (sizex * sizey) members, indices of animationList
  animationList: Record<
    number,
    Partial<SpriteOptions> | Partial<RectangleOptions>
  >;
}

export class Tilemap extends SpriteGroup {
  sizex = 0;
  sizey = 0;
  tileWidth = 0;
  tileHeight = 0;

  _locations: Uint32Array;

  constructor(
    options: TilemapOptions &
      Partial<BaseSpriteOptions & SpriteGroupOptions> & {
        ref?: SpriteRef<Tilemap>;
      },
  ) {
    super(options);

    const { sizex, sizey, tileWidth, tileHeight } = options;

    this.sizex = sizex;
    this.sizey = sizey;
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;

    const locations = new Uint32Array(sizex * sizey).fill(0xffffffff);
    this._locations = locations;
    const layers = this._layers;

    if (
      options.width === undefined &&
      options.halfWidth === undefined &&
      options.radius === undefined
    ) {
      this.width = sizex * tileWidth;
    }

    if (
      options.height === undefined &&
      options.halfHeight === undefined &&
      options.radius === undefined
    ) {
      this.height = sizey * tileHeight;
    }

    const animationList = options.animationList;

    let i_location = 0;
    let row = 0;
    let col = 0;
    let left = 0;
    let top = 0;
    for (const data of options.data) {
      const animation_options = animationList[data];
      if (animation_options && "animation" in animation_options) {
        // Sprite
        const sprite_options = Object.assign({}, animation_options, {
          left,
          top,
          width: tileWidth,
          height: tileHeight,
        });
        this.addChild(new Sprite(sprite_options));
        locations[i_location] = layers.length - 1;
      } else if (animation_options && "background" in animation_options) {
        // Rectangle
        const rectangle_options = Object.assign({}, animation_options, {
          left,
          top,
          width: tileWidth,
          height: tileHeight,
        });
        this.addChild(new Rectangle(rectangle_options));
        locations[i_location] = layers.length - 1;
      } else {
        // TODO: Invalid
      }

      i_location += 1;
      left += tileWidth;
      col += 1;
      if (col >= sizex) {
        col = 0;
        left = 0;
        row += 1;
        top += tileHeight;
        if (row >= sizey) {
          break;
        }
      }
    }
  }

  getAt(row: number, col: number): BaseSprite {
    return this._layers[this._locations[row * this.sizex + col]];
  }
}
