import type { Renderer } from "./Renderer.js";
import {
  initPlayground,
  drawPlaygroundBeforeChildren,
  drawPlaygroundAfterChildren,
} from "./canvasRenderer/renderPlayground.js";
import {
  initGroup,
  removeGroup,
  drawGroupBeforeChildren,
  drawGroupAfterChildren,
} from "./canvasRenderer/renderGroup.js";
import {
  initSprite,
  removeSprite,
  drawSprite,
} from "./canvasRenderer/renderSprite.js";
import {
  initRectangle,
  removeRectangle,
  drawRectangle,
} from "./canvasRenderer/renderRectangle.js";

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
