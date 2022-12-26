import { Playground } from "../Playground.js";
import type { RendererElement } from "../Renderer.js";
import { cssClass } from "../defines.js";

const canvasRegistry = new FinalizationRegistry((canvas: HTMLCanvasElement) => {
  if (canvas.parentNode) {
    canvas.parentNode.removeChild(canvas);
  }
});

export const playgroundMap = new WeakMap<
  Playground,
  {
    ctx: CanvasRenderingContext2D;
    globalAlpha: number;
  }
>();

export function initPlayground(
  playground: Playground,
  dom?: string | RendererElement
) {
  const parentDOM = (() => {
    if (typeof dom === "string") {
      // Allow the ID to start with the '#' symbol
      if (dom.startsWith("#")) {
        return document.getElementById(dom.slice(1))!;
      } else {
        return document.getElementById(dom)!;
      }
    } else if (!dom) {
      // Default to the element with id of 'playground'
      return document.getElementById("playground")!;
    } else {
      return dom as HTMLElement;
    }
  })();

  const [ctx, width, height] = (() => {
    if (parentDOM instanceof HTMLCanvasElement) {
      const ctx = parentDOM.getContext("2d");

      const width = parentDOM.width || 300;
      const height = parentDOM.height || 150;

      return [ctx, width, height];
    } else {
      const width = parentDOM.offsetWidth || 300;
      const height = parentDOM.offsetHeight || 150;

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      parentDOM.insertBefore(canvas, parentDOM.firstChild);
      canvas.className = cssClass; // Reset background properties set by external CSS
      Object.assign(canvas.style, {
        left: "0px",
        top: "0px",
        width: `${width}px`,
        height: `${height}px`,
        overflow: "hidden",
      });

      canvasRegistry.register(playground, canvas);

      const ctx = canvas.getContext("2d");

      return [ctx, width, height];
    }
  })();

  playgroundMap.set(playground, {
    ctx: ctx!,
    globalAlpha: 1,
  });

  return [width, height];
}

export function drawPlaygroundBeforeChildren(
  playground: Playground,
  interp: number // eslint-disable-line @typescript-eslint/no-unused-vars
) {
  const playgroundData = playgroundMap.get(playground)!;

  playgroundData.ctx.clearRect(0, 0, playground._width, playground._height);
  playgroundData.globalAlpha = 1;
}

export function drawPlaygroundAfterChildren(
  playground: Playground, // eslint-disable-line @typescript-eslint/no-unused-vars
  interp: number // eslint-disable-line @typescript-eslint/no-unused-vars
) {
  // no-op
}
