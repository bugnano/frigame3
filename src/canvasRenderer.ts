import type { Renderer } from "./Renderer.js";
import {
  drawGroupAfterChildren,
  drawGroupBeforeChildren,
  initGroup,
  removeGroup,
} from "./canvasRenderer/renderGroup.js";
import {
  drawPlaygroundAfterChildren,
  drawPlaygroundBeforeChildren,
  initPlayground,
} from "./canvasRenderer/renderPlayground.js";
import {
  drawRectangle,
  initRectangle,
  removeRectangle,
} from "./canvasRenderer/renderRectangle.js";
import {
  drawSprite,
  initSprite,
  removeSprite,
} from "./canvasRenderer/renderSprite.js";

export const canvasRenderer: Renderer = {
  initPlayground,
  drawPlaygroundBeforeChildren,
  drawPlaygroundAfterChildren,
  initGroup,
  removeGroup,
  drawGroupBeforeChildren,
  drawGroupAfterChildren,
  initSprite,
  removeSprite,
  drawSprite,
  initRectangle,
  removeRectangle,
  drawRectangle,
};
