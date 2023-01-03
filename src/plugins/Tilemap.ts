import { SpriteGroup } from "../SpriteGroup.js";
import { Playground } from "../Playground.js";
import { addSprite } from "../Sprite.js";
import { addRectangle } from "../Rectangle.js";
import type { BaseSpriteOptions } from "../BaseSprite.js";
import type { SpriteGroupOptions } from "../SpriteGroup.js";
import type { SpriteOptions } from "../Sprite.js";
import type { RectangleOptions } from "../Rectangle.js";

// animationList MUST have at least `animation` or `background`
export interface TilemapOptions {
  sizex: number; // Num tiles
  sizey: number; // Num tiles
  tileWidth: number; // Pixel
  tileHeight: number; // Pixel
  data: number[]; // (sizex * sizey) members, indices of animationList
  animationList: Record<number, SpriteOptions | RectangleOptions>;
}

export class Tilemap extends SpriteGroup {
  sizex = 0;
  sizey = 0;
  tileWidth = 0;
  tileHeight = 0;

  constructor(
    playground: Playground,
    parent: SpriteGroup,
    options: TilemapOptions & Partial<BaseSpriteOptions & SpriteGroupOptions>
  ) {
    super(playground, parent, options);

    const { sizex, sizey, tileWidth, tileHeight } = options;

    this.sizex = sizex;
    this.sizey = sizey;
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;

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
          width: tileWidth,
          height: tileHeight,
        });
        addSprite(this, sprite_options);
      } else if (
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        animation_options &&
        "background" in animation_options
      ) {
        // Rectangle
        const rectangle_options = Object.assign({}, animation_options, {
          left,
          top,
          width: tileWidth,
          height: tileHeight,
        });
        addRectangle(this, rectangle_options);
      } else {
        // TODO: Invalid
      }

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
}

export function addTilemap(
  parent: SpriteGroup,
  options: TilemapOptions & Partial<BaseSpriteOptions & SpriteGroupOptions>
) {
  const tilemap = new Tilemap(parent.playground!, parent, options);
  parent._layers.push(tilemap);

  parent._checkUpdate();

  return tilemap;
}

export function insertTilemap(
  parent: SpriteGroup,
  options: TilemapOptions & Partial<BaseSpriteOptions & SpriteGroupOptions>
) {
  const tilemap = new Tilemap(parent.playground!, parent, options);
  parent._layers.unshift(tilemap);

  parent._checkUpdate();

  return tilemap;
}
