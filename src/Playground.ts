import type { Renderer, RendererElement } from "./Renderer.js";
import { SpriteGroup } from "./SpriteGroup.js";
import { REFRESH_RATE } from "./defines.js";
import { framesFromMs } from "./utils.js";

interface CallbackObj {
  callback: () => void;
  rate: number;
  idleCounter: number;
}

export class Playground extends EventTarget {
  _width = 0;
  _height = 0;

  running = false;
  frameCounter = 0;

  scenegraph: SpriteGroup;

  // Implementation details

  _renderer: Renderer;
  _nextId = 1; // Start from 1 to guarantee that callbackId is always truthy
  _callbacks: Map<number, CallbackObj> = new Map<number, CallbackObj>();
  _idDraw: number | null = null;
  _accumulator = 0;
  _currentTime = 0;
  _absLeft = 0;
  _absTop = 0;

  get width(): number {
    return this._width;
  }

  get height(): number {
    return this._height;
  }

  get halfWidth(): number {
    return this._width / 2;
  }

  get halfHeight(): number {
    return this._height / 2;
  }

  constructor(renderer: Renderer, dom?: string | RendererElement) {
    super();

    this._renderer = renderer;

    const [width, height] = renderer.initPlayground(this, dom);

    this._width = width;
    this._height = height;

    this.scenegraph = new SpriteGroup({ width, height });
    this.scenegraph._playground = new WeakRef(this);
    this.scenegraph._initRenderer();

    this.startGame();
  }

  // Public functions

  registerCallback(callback: () => void, rate?: number): number {
    const callbackId = this._nextId;
    this._nextId += 1;

    this._callbacks.set(callbackId, {
      callback: callback,
      rate: framesFromMs(rate ?? 0),
      idleCounter: 0,
    });

    return callbackId;
  }

  removeCallback(
    callbackId: number | null,
    options?: { suppressWarning?: boolean },
  ): this {
    if (callbackId !== 0 && !callbackId) {
      if (
        typeof console !== "undefined" &&
        (!options || options.suppressWarning === false)
      ) {
        console.warn("callbackId is null");
        console.trace();
      }
      return this;
    }

    const deleted = this._callbacks.delete(callbackId);

    if (
      !deleted &&
      typeof console !== "undefined" &&
      (!options || options.suppressWarning === false)
    ) {
      console.warn("No callbacks removed");
      console.trace();
    }

    return this;
  }

  clearCallbacks(): this {
    this._callbacks.clear();

    this.dispatchEvent(new Event("clearCallbacks"));

    return this;
  }

  startGame(): this {
    this.running = true;

    if (this._idDraw === null) {
      this._accumulator = 0;
      this._currentTime = performance.now();
      this._idDraw = requestAnimationFrame(this._draw);
    }

    return this;
  }

  stopGame(): this {
    this.running = false;

    // The cancelAnimationFrame is optional, since this._draw will not call
    // this._update and requestAnimationFrame if this.running is false
    if (this._idDraw !== null) {
      cancelAnimationFrame(this._idDraw);
      this._idDraw = null;
    }

    return this;
  }

  forceRedraw(): this {
    if (this._idDraw === null) {
      this._idDraw = requestAnimationFrame(this._draw);
    }

    return this;
  }

  // Implementation details

  _update(): void {
    this.scenegraph._update();

    for (const callback_obj of this._callbacks.values()) {
      callback_obj.idleCounter += 1;
      if (callback_obj.idleCounter >= callback_obj.rate) {
        callback_obj.idleCounter = 0;

        const callback = callback_obj.callback;
        callback();
      }
    }
  }

  _draw = (timestamp: number): void => {
    const dt = REFRESH_RATE;
    let accumulator = this._accumulator;

    if (this.running) {
      this._idDraw = requestAnimationFrame(this._draw);

      accumulator += timestamp - this._currentTime;
      this._currentTime = timestamp;

      if (accumulator >= dt) {
        let numUpdateSteps = 0;

        while (accumulator >= dt) {
          this._update();
          accumulator -= dt;

          this.frameCounter += 1;

          // Avoid the spiral of death
          numUpdateSteps += 1;
          if (numUpdateSteps >= 240) {
            accumulator = 0;
            // TODO: Maybe a callback should be called here
            if (typeof console !== "undefined") {
              console.warn("Spiral of death");
            }
            break;
          }
        }
      }

      this._accumulator = accumulator;
    } else {
      this._idDraw = null;
    }

    const interp = accumulator / dt;

    this._renderer.drawPlaygroundBeforeChildren(this, interp);
    this.scenegraph._draw(interp);
    this._renderer.drawPlaygroundAfterChildren(this, interp);
  };

  _insidePlayground(
    left: number,
    top: number,
    width: number,
    height: number,
  ): boolean {
    const sprite_left = this._absLeft + left;
    const sprite_top = this._absTop + top;

    return !(
      sprite_top + height <= 0 ||
      sprite_top >= this._height ||
      sprite_left >= this._width ||
      sprite_left + width <= 0
    );
  }
}
