import type { Playground, PlaygroundOptions } from "./Playground.js";
import type { Rectangle } from "./Rectangle.js";
import type { Renderer } from "./Renderer.js";
import type { Sprite } from "./Sprite.js";
import type { SpriteGroup } from "./SpriteGroup.js";

export const dummyRenderer: Renderer = {
  initPlayground(
    _playground: Playground,
    _options?: Partial<PlaygroundOptions>,
  ): [number, number] {
    return [0, 0];
  },

  drawPlaygroundBeforeChildren(_playground: Playground, _interp: number): void {
    // no-op
  },

  drawPlaygroundAfterChildren(_playground: Playground, _interp: number): void {
    // no-op
  },

  initGroup(_group: SpriteGroup): void {
    // no-op
  },

  removeGroup(_group: SpriteGroup): void {
    // no-op
  },

  drawGroupBeforeChildren(_group: SpriteGroup, _interp: number): void {
    // no-op
  },

  drawGroupAfterChildren(_group: SpriteGroup, _interp: number): void {
    // no-op
  },

  initSprite(_sprite: Sprite): void {
    // no-op
  },

  removeSprite(_sprite: Sprite): void {
    // no-op
  },

  drawSprite(_sprite: Sprite, _interp: number): void {
    // no-op
  },

  initRectangle(_rectangle: Rectangle): void {
    // no-op
  },

  removeRectangle(_rectangle: Rectangle): void {
    // no-op
  },

  drawRectangle(_rectangle: Rectangle, _interp: number): void {
    // no-op
  },
};
