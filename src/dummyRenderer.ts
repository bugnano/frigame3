import type { Playground, PlaygroundOptions } from "./Playground.js";
import type { Rectangle } from "./Rectangle.js";
import type { Renderer } from "./Renderer.js";
import type { Sprite } from "./Sprite.js";
import type { SpriteGroup } from "./SpriteGroup.js";

export const dummyRenderer: Renderer = {
  initPlayground(
    _playground: Playground,
    _options?: Partial<PlaygroundOptions>,
  ) {
    return [0, 0];
  },

  drawPlaygroundBeforeChildren(_playground: Playground, _interp: number) {
    // no-op
  },

  drawPlaygroundAfterChildren(_playground: Playground, _interp: number) {
    // no-op
  },

  initGroup(_group: SpriteGroup) {
    // no-op
  },

  removeGroup(_group: SpriteGroup) {
    // no-op
  },

  drawGroupBeforeChildren(_group: SpriteGroup, _interp: number) {
    // no-op
  },

  drawGroupAfterChildren(_group: SpriteGroup, _interp: number) {
    // no-op
  },

  initSprite(_sprite: Sprite) {
    // no-op
  },

  removeSprite(_sprite: Sprite) {
    // no-op
  },

  drawSprite(_sprite: Sprite, _interp: number) {
    // no-op
  },

  initRectangle(_rectangle: Rectangle) {
    // no-op
  },

  removeRectangle(_rectangle: Rectangle) {
    // no-op
  },

  drawRectangle(_rectangle: Rectangle, _interp: number) {
    // no-op
  },
};
