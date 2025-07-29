import type { Playground } from "../../Playground.js";
import { swing } from "./easing.js";

export type Speed = "slow" | "fast";

export interface TweenOptions {
  duration: Speed | number;
  easing: (t: number) => number;
  callback: () => void;
  suppressWarning: boolean;
}

interface TweenProp {
  start_value: number;
  target_value: number;
  change: number;
}

interface TweenObj<T extends object> {
  target_obj: T;
  current_step: number;
  num_step: number;
  easing: (t: number) => number;
  callback?: () => void;
  property_list: Map<keyof T, TweenProp>;
}

const speeds = {
  slow: 600,
  fast: 200,
  _default: 400,
};

export class Tweener extends EventTarget {
  _nextId = 1; // Start from 1 to guarantee that tweenId is always truthy
  _tween_queue: Map<number, TweenObj<Record<string, number>>> = new Map<
    number,
    TweenObj<Record<string, number>>
  >();
  _tweening = false;
  _playground: WeakRef<Playground>;
  _callbackId: number | null = null;

  constructor(playground: Playground) {
    super();

    this._playground = new WeakRef(playground);

    this.registerCallback();

    playground.addEventListener("clearCallbacks", this._onClearCallbacks);
  }

  _tweenStep = (): void => {
    if (this._tweening) {
      // Process all the tweens in the queue
      for (const [tweenId, tween_obj] of this._tween_queue) {
        const target_obj = tween_obj.target_obj;

        tween_obj.current_step += 1;

        if (tween_obj.current_step >= tween_obj.num_step) {
          // This object has finished its tweening

          // Set every property to its target value
          for (const [property, tween_prop] of tween_obj.property_list) {
            target_obj[property] = tween_prop.target_value;
          }

          // Call the complete callback
          const callback = tween_obj.callback;
          callback?.();

          // Remove this tween
          this._tween_queue.delete(tweenId);
        } else {
          const step = tween_obj.easing(
            tween_obj.current_step / tween_obj.num_step,
          );

          // Set the properties to the current value
          for (const [property, tween_prop] of tween_obj.property_list) {
            target_obj[property] =
              tween_prop.start_value + tween_prop.change * step;
          }
        }
      }

      // If there are no more tweens in the queue, this callback can be stopped
      if (this._tween_queue.size === 0) {
        this._tweening = false;
      }
    }
  };

  registerCallback(options?: { suppressWarning?: boolean }): this {
    if (this._callbackId === null) {
      const playground = this._playground.deref();

      if (playground) {
        this._callbackId = playground.registerCallback(this._tweenStep);
      } else {
        if (
          typeof console !== "undefined" &&
          options?.suppressWarning === false
        ) {
          console.warn("playground has been garbage collected");
          console.trace();
        }
      }
    } else {
      if (
        typeof console !== "undefined" &&
        options?.suppressWarning === false
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
        options?.suppressWarning === false
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

  tween<T extends object>(
    target_obj: T,
    properties: Partial<Record<keyof T, number>>,
    options?: Partial<TweenOptions>,
  ): number {
    const playground = this._playground.deref();

    if (playground) {
      const duration =
        (typeof options?.duration === "string"
          ? speeds[options.duration]
          : options?.duration) ?? speeds._default;

      const easing = options?.easing ?? swing;

      const tween_obj: TweenObj<T> = {
        target_obj: target_obj,
        current_step: 0,
        num_step: playground.framesFromMs(duration),
        easing: easing,
        callback: options?.callback,
        property_list: new Map<keyof T, TweenProp>(),
      };

      const property_list = tween_obj.property_list;

      for (const [property, value] of Object.entries(properties)) {
        const start_value = target_obj[property as keyof T] as number;
        const target_value = value as number;

        property_list.set(property as keyof T, {
          start_value: start_value,
          target_value: target_value,
          change: target_value - start_value,
        });
      }

      const tweenId = this._nextId;
      this._nextId += 1;

      this._tween_queue.set(
        tweenId,
        tween_obj as unknown as TweenObj<Record<string, number>>,
      );
      this._tweening = true;

      return tweenId;
    } else {
      if (
        typeof console !== "undefined" &&
        options?.suppressWarning === false
      ) {
        console.warn("playground has been garbage collected");
        console.trace();
      }

      return -1;
    }
  }

  removeTween(
    tweenId: number | null,
    options?: { suppressWarning?: boolean },
  ): this {
    if (tweenId !== 0 && !tweenId) {
      if (
        typeof console !== "undefined" &&
        options?.suppressWarning === false
      ) {
        console.warn("tweenId is null");
        console.trace();
      }
      return this;
    }

    const deleted = this._tween_queue.delete(tweenId);

    if (
      !deleted &&
      typeof console !== "undefined" &&
      options?.suppressWarning === false
    ) {
      console.warn("No tweens removed");
      console.trace();
    }

    return this;
  }

  clearTweens(): this {
    this._tween_queue.clear();

    this.dispatchEvent(new Event("clearTweens"));

    return this;
  }
}
