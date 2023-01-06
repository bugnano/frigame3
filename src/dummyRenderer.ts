import type { Renderer, RendererElement } from "./Renderer.js";
import type { Playground } from "./Playground.js";
import type { SpriteGroup } from "./SpriteGroup.js";
import type { Sprite } from "./Sprite.js";
import type { Rectangle } from "./Rectangle.js";

export const dummyRenderer: Renderer = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  initPlayground(playground: Playground, dom?: string | RendererElement) {
    return [0, 0];
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  drawPlaygroundBeforeChildren(playground: Playground, interp: number) {
    // no-op
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  drawPlaygroundAfterChildren(playground: Playground, interp: number) {
    // no-op
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  initGroup(group: SpriteGroup) {
    // no-op
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeGroup(group: SpriteGroup) {
    // no-op
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  drawGroupBeforeChildren(group: SpriteGroup, interp: number) {
    // no-op
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  drawGroupAfterChildren(group: SpriteGroup, interp: number) {
    // no-op
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  initSprite(sprite: Sprite) {
    // no-op
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeSprite(sprite: Sprite) {
    // no-op
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  drawSprite(sprite: Sprite, interp: number) {
    // no-op
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  initRectangle(rectangle: Rectangle) {
    // no-op
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeRectangle(rectangle: Rectangle) {
    // no-op
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  drawRectangle(rectangle: Rectangle, interp: number) {
    // no-op
  },
};
