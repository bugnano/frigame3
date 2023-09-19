import type { Playground } from "../Playground.js";

export class GamepadTracker extends EventTarget {
  controllers = new Map<number, Gamepad>();

  _playground: WeakRef<Playground>;
  _callbackId: number | null = null;

  constructor(playground: Playground) {
    super();

    this._playground = new WeakRef(playground);

    this.registerCallback();

    playground.addEventListener("clearCallbacks", this._onClearCallbacks);
  }

  _scanGamepads = (): void => {
    const controllers = this.controllers;
    const gamepads = navigator.getGamepads();

    // Step 1: Update controller status
    for (const gamepad of gamepads) {
      if (gamepad) {
        controllers.set(gamepad.index, gamepad);
      }
    }

    // Step 2: Remove disconnected controllers
    const indexes = new Set(
      gamepads
        .filter((gamepad: Gamepad | null): boolean => gamepad !== null)
        .map((gamepad: Gamepad | null): number => gamepad!.index),
    );
    for (const index of controllers.keys()) {
      if (!indexes.has(index)) {
        controllers.delete(index);
      }
    }
  };

  registerCallback(options?: { suppressWarning?: boolean }): this {
    if (this._callbackId === null) {
      const playground = this._playground.deref();

      if (playground) {
        this._callbackId = playground.registerCallback(this._scanGamepads);
      } else {
        if (
          typeof console !== "undefined" &&
          (!options || options.suppressWarning === false)
        ) {
          console.warn("playground has been garbage collected");
          console.trace();
        }
      }
    } else {
      if (
        typeof console !== "undefined" &&
        (!options || options.suppressWarning === false)
      ) {
        console.warn("Callback already registered");
        console.trace();
      }
    }

    return this;
  }

  removeCallback(options?: { suppressWarning?: boolean }): this {
    const playground = this._playground.deref();

    if (playground) {
      playground.removeCallback(this._callbackId, options);
    } else {
      if (
        typeof console !== "undefined" &&
        (!options || options.suppressWarning === false)
      ) {
        console.warn("playground has been garbage collected");
        console.trace();
      }
    }

    this._callbackId = null;

    return this;
  }

  _onClearCallbacks = (): void => {
    if (this._callbackId !== null) {
      this._callbackId = null;
      this.registerCallback();
    }
  };
}
