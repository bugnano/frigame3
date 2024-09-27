import type { Playground } from "./Playground.js";
import type { Rectangle } from "./Rectangle.js";
import type { Renderer, RendererElement } from "./Renderer.js";
import type { Sprite } from "./Sprite.js";
import type { SpriteGroup } from "./SpriteGroup.js";

export const dummyRenderer: Renderer = {
  // biome-ignore lint/correctness/noUnusedVariables:
  initPlayground(playground: Playground, dom?: string | RendererElement) {
    return [0, 0];
  },

  // biome-ignore lint/correctness/noUnusedVariables:
  drawPlaygroundBeforeChildren(playground: Playground, interp: number) {
    // no-op
  },

  // biome-ignore lint/correctness/noUnusedVariables:
  drawPlaygroundAfterChildren(playground: Playground, interp: number) {
    // no-op
  },

  // biome-ignore lint/correctness/noUnusedVariables:
  initGroup(group: SpriteGroup) {
    // no-op
  },

  // biome-ignore lint/correctness/noUnusedVariables:
  removeGroup(group: SpriteGroup) {
    // no-op
  },

  // biome-ignore lint/correctness/noUnusedVariables:
  drawGroupBeforeChildren(group: SpriteGroup, interp: number) {
    // no-op
  },

  // biome-ignore lint/correctness/noUnusedVariables:
  drawGroupAfterChildren(group: SpriteGroup, interp: number) {
    // no-op
  },

  // biome-ignore lint/correctness/noUnusedVariables:
  initSprite(sprite: Sprite) {
    // no-op
  },

  // biome-ignore lint/correctness/noUnusedVariables:
  removeSprite(sprite: Sprite) {
    // no-op
  },

  // biome-ignore lint/correctness/noUnusedVariables:
  drawSprite(sprite: Sprite, interp: number) {
    // no-op
  },

  // biome-ignore lint/correctness/noUnusedVariables:
  initRectangle(rectangle: Rectangle) {
    // no-op
  },

  // biome-ignore lint/correctness/noUnusedVariables:
  removeRectangle(rectangle: Rectangle) {
    // no-op
  },

  // biome-ignore lint/correctness/noUnusedVariables:
  drawRectangle(rectangle: Rectangle, interp: number) {
    // no-op
  },
};
