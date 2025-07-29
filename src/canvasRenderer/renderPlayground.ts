import type { Playground, PlaygroundOptions } from "../Playground.js";

export interface PlaygroundObj {
  ctx: CanvasRenderingContext2D;
  globalAlpha: number;
}

const canvasRegistry = new FinalizationRegistry(
  (canvas: HTMLCanvasElement): void => {
    if (canvas.parentNode) {
      canvas.parentNode.removeChild(canvas);
    }
  },
);

export const playgroundMap: WeakMap<Playground, PlaygroundObj> = new WeakMap<
  Playground,
  PlaygroundObj
>();

export function initPlayground(
  playground: Playground,
  options?: Partial<PlaygroundOptions>,
): [number, number] {
  const dom = options?.dom;

  const parentDOM = ((): HTMLElement => {
    if (typeof dom === "string") {
      // Allow the ID to start with the '#' symbol
      if (dom.startsWith("#")) {
        return document.getElementById(dom.slice(1))!;
      } else {
        return document.getElementById(dom)!;
      }
    } else if (dom === undefined) {
      // Default to the element with id of 'playground'
      return document.getElementById("playground")!;
    } else {
      return dom as HTMLElement;
    }
  })();

  const [ctx, width, height] = ((): [
    CanvasRenderingContext2D,
    number,
    number,
  ] => {
    if (parentDOM instanceof HTMLCanvasElement) {
      const ctx = parentDOM.getContext("2d");

      const width = parentDOM.width || 300;
      const height = parentDOM.height || 150;

      return [ctx!, width, height];
    } else {
      const width = parentDOM.offsetWidth || 300;
      const height = parentDOM.offsetHeight || 150;

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      parentDOM.insertBefore(canvas, parentDOM.firstChild);
      canvas.className = options?.cssClass ?? "friGame"; // Reset background properties set by external CSS
      Object.assign(canvas.style, {
        left: "0px",
        top: "0px",
        width: `${width}px`,
        height: `${height}px`,
        overflow: "hidden",
      });

      canvasRegistry.register(playground, canvas);

      const ctx = canvas.getContext("2d");

      return [ctx!, width, height];
    }
  })();

  playgroundMap.set(playground, {
    ctx,
    globalAlpha: 1,
  });

  return [width, height];
}

export function drawPlaygroundBeforeChildren(
  playground: Playground,
  // biome-ignore lint/correctness/noUnusedFunctionParameters: reason
  interp: number,
): void {
  const playgroundData = playgroundMap.get(playground)!;

  playgroundData.ctx.clearRect(0, 0, playground._width, playground._height);
  playgroundData.globalAlpha = 1;
}

export function drawPlaygroundAfterChildren(
  // biome-ignore lint/correctness/noUnusedFunctionParameters: reason
  playground: Playground,
  // biome-ignore lint/correctness/noUnusedFunctionParameters: reason
  interp: number,
): void {
  // no-op
}
