import { SpriteGroup } from "./SpriteGroup.js";
import type { Renderer } from "./Renderer.js";
import { REFRESH_RATE } from "./defines.js";

export class Playground {
  _width = 0;
  _height = 0;

  running = false;
  frameCounter = 0;

  renderer: Renderer;
  scenegraph: SpriteGroup;

  // Implementation details
  _nextId = 1; // Start from 1 to guarantee that callbackId is always truthy
  _callbacks = new Map<
    number,
    { callback: () => void; rate: number; idleCounter: number }
  >();
  _idDraw: number | null = null;
  _accumulator = 0;
  _currentTime = 0;
  _absLeft = 0;
  _absTop = 0;

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  get halfWidth() {
    return this._width / 2;
  }

  get halfHeight() {
    return this._height / 2;
  }

  constructor(
    renderer: Renderer,
    dom?: string | HTMLElement | HTMLCanvasElement
  ) {
    this.renderer = renderer;

    const [width, height] = renderer.initPlayground(this, dom);

    this._width = width;
    this._height = height;

    this.scenegraph = new SpriteGroup(this, undefined, { width, height });
  }

  // Public functions
  registerCallback(callback: () => void, rate?: number) {
    const callbackId = this._nextId;
    this._nextId += 1;

    this._callbacks.set(callbackId, {
      callback: callback,
      rate: Math.max(rate ?? 1, 1) || 1,
      idleCounter: 0,
    });

    return callbackId;
  }

  removeCallback(
    callbackId: number | null,
    options?: { suppressWarning?: boolean }
  ) {
    if (callbackId == null) {
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

  clearCallbacks() {
    this._callbacks.clear();

    return this;
  }

  startGame() {
    this.running = true;

    if (this._idDraw === null) {
      this._accumulator = 0;
      this._currentTime = performance.now();
      this._idDraw = requestAnimationFrame(this._draw);
    }

    return this;
  }

  stopGame() {
    this.running = false;

    return this;
  }

  forceRedraw() {
    if (this._idDraw === null) {
      this._idDraw = requestAnimationFrame(this._draw);
    }

    return this;
  }

  // Implementation details

  _update() {
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

  _draw = (timestamp: number) => {
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

    this.scenegraph._draw(accumulator / dt);
  };

  _insidePlayground(left: number, top: number, width: number, height: number) {
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
