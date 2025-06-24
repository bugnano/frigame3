import type { Playground } from "./Playground.js";
import type { Rectangle } from "./Rectangle.js";
import type { Renderer, RendererElement } from "./Renderer.js";
import type { Sprite } from "./Sprite.js";
import type { SpriteGroup } from "./SpriteGroup.js";

export const dummyRenderer: Renderer = {
  // biome-ignore lint/correctness/noUnusedFunctionParameters: reason
  initPlayground(playground: Playground, dom?: string | RendererElement) {
    return [0, 0];
  },

  // biome-ignore lint/correctness/noUnusedFunctionParameters: reason
  drawPlaygroundBeforeChildren(playground: Playground, interp: number) {
    // no-op
  },

  // biome-ignore lint/correctness/noUnusedFunctionParameters: reason
  drawPlaygroundAfterChildren(playground: Playground, interp: number) {
    // no-op
  },

  // biome-ignore lint/correctness/noUnusedFunctionParameters: reason
  initGroup(group: SpriteGroup) {
    // no-op
  },

  // biome-ignore lint/correctness/noUnusedFunctionParameters: reason
  removeGroup(group: SpriteGroup) {
    // no-op
  },

  // biome-ignore lint/correctness/noUnusedFunctionParameters: reason
  drawGroupBeforeChildren(group: SpriteGroup, interp: number) {
    // no-op
  },

  // biome-ignore lint/correctness/noUnusedFunctionParameters: reason
  drawGroupAfterChildren(group: SpriteGroup, interp: number) {
    // no-op
  },

  // biome-ignore lint/correctness/noUnusedFunctionParameters: reason
  initSprite(sprite: Sprite) {
    // no-op
  },

  // biome-ignore lint/correctness/noUnusedFunctionParameters: reason
  removeSprite(sprite: Sprite) {
    // no-op
  },

  // biome-ignore lint/correctness/noUnusedFunctionParameters: reason
  drawSprite(sprite: Sprite, interp: number) {
    // no-op
  },

  // biome-ignore lint/correctness/noUnusedFunctionParameters: reason
  initRectangle(rectangle: Rectangle) {
    // no-op
  },

  // biome-ignore lint/correctness/noUnusedFunctionParameters: reason
  removeRectangle(rectangle: Rectangle) {
    // no-op
  },

  // biome-ignore lint/correctness/noUnusedFunctionParameters: reason
  drawRectangle(rectangle: Rectangle, interp: number) {
    // no-op
  },
};
