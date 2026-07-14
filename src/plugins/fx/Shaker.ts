import type { Playground } from "../../Playground.js";
import { lerp } from "../../utils.js";
import { linear } from "./easing.js";

// Inspired by https://jonny.morrill.me/en/blog/gamedev-how-to-implement-a-camera-shake-effect/

export interface ShakeOptions {
  duration: number;
  frequency: number;
  decay: (t: number) => number;
  callback: () => void;
  suppressWarning: boolean;
}

interface ShakeProp {
  amplitude: number;
  start_value: number;
  current_value: number;
  sample_value: number;
}

interface ShakeObj<T extends object> {
  target_obj: T;
  current_sample: number;
  num_sample: number;
  current_step: number;
  steps_per_sample: number;
  decay: (t: number) => number;
  callback?: () => void;
  property_list: Map<keyof T, ShakeProp>;
}

export class Shaker extends EventTarget {
  _nextId = 1; // Start from 1 to guarantee that shakeId is always truthy
  _shake_queue: Map<number, ShakeObj<Record<string, number>>> = new Map<
    number,
    ShakeObj<Record<string, number>>
  >();
  _shaking = false;
  _playground: WeakRef<Playground>;
  _callbackId: number | null = null;

  constructor(playground: Playground) {
    super();

    this._playground = new WeakRef(playground);

    this.registerCallback();

    playground.addEventListener("clearCallbacks", this._onClearCallbacks);
  }

  _shakeStep = (): void => {
    if (this._shaking) {
      // Process all the shakes in the queue
      for (const [shakeId, shake_obj] of this._shake_queue) {
        const target_obj = shake_obj.target_obj;

        shake_obj.current_step += 1;

        if (shake_obj.current_step >= shake_obj.steps_per_sample) {
          shake_obj.current_step = 0;
          shake_obj.current_sample += 1;

          if (shake_obj.current_sample >= shake_obj.num_sample) {
            // This object has finished its shaking

            // Restore every property to its initial value
            for (const [property, shake_prop] of shake_obj.property_list) {
              target_obj[property] = shake_prop.start_value;
            }

            // Call the complete callback
            const callback = shake_obj.callback;
            callback?.();

            // Remove this shake
            this._shake_queue.delete(shakeId);
          } else {
            for (const [property, shake_prop] of shake_obj.property_list) {
              // Set the properties to the current value
              target_obj[property] = shake_prop.sample_value;

              // Update the property list with a new sample
              shake_prop.current_value = shake_prop.sample_value;
              shake_prop.sample_value =
                shake_prop.start_value +
                lerp(
                  (Math.random() * 2 - 1) * shake_prop.amplitude,
                  0,
                  shake_obj.decay(
                    shake_obj.current_sample / shake_obj.num_sample,
                  ),
                );
            }
          }
        } else {
          // Set the properties to the current value
          for (const [property, shake_prop] of shake_obj.property_list) {
            target_obj[property] = lerp(
              shake_prop.current_value,
              shake_prop.sample_value,
              shake_obj.current_step / shake_obj.steps_per_sample,
            );
          }
        }
      }

      // If there are no more shakes in the queue, this callback can be stopped
      if (this._shake_queue.size === 0) {
        this._shaking = false;
      }
    }
  };

  registerCallback(options?: { suppressWarning?: boolean }): this {
    if (this._callbackId === null) {
      const playground = this._playground.deref();

      if (playground !== undefined) {
        this._callbackId = playground.registerCallback(this._shakeStep);
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

    if (playground !== undefined) {
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

  shake<T extends object>(
    target_obj: T,
    properties: Partial<Record<keyof T, number>>,
    options?: Partial<ShakeOptions>,
  ): number {
    const playground = this._playground.deref();

    if (playground !== undefined) {
      const duration = options?.duration || 1;
      const frequency = options?.frequency || 60;
      const decay = options?.decay ?? linear;

      const steps_per_sample = playground.framesFromMs(1000 / frequency);
      const num_sample = Math.ceil(
        playground.framesFromMs(duration) / steps_per_sample,
      );

      const shake_obj: ShakeObj<T> = {
        target_obj: target_obj,
        current_sample: 0,
        num_sample: num_sample,
        current_step: 0,
        steps_per_sample: steps_per_sample,
        decay: decay,
        property_list: new Map<keyof T, ShakeProp>(),
      };

      if (options?.callback !== undefined) {
        shake_obj.callback = options.callback;
      }

      const property_list = shake_obj.property_list;

      for (const [property, value] of Object.entries(properties)) {
        const start_value = target_obj[property as keyof T] as number;
        const amplitude = value as number;

        property_list.set(property as keyof T, {
          amplitude: amplitude,
          start_value: start_value,
          current_value: start_value,
          sample_value: start_value + (Math.random() * 2 - 1) * amplitude,
        });
      }

      const shakeId = this._nextId;
      this._nextId += 1;

      this._shake_queue.set(
        shakeId,
        shake_obj as unknown as ShakeObj<Record<string, number>>,
      );
      this._shaking = true;

      return shakeId;
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

  removeShake(
    shakeId: number | null,
    options?: { suppressWarning?: boolean },
  ): this {
    if (shakeId === null) {
      if (
        typeof console !== "undefined" &&
        options?.suppressWarning === false
      ) {
        console.warn("shakeId is null");
        console.trace();
      }
      return this;
    }

    const deleted = this._shake_queue.delete(shakeId);

    if (
      !deleted &&
      typeof console !== "undefined" &&
      options?.suppressWarning === false
    ) {
      console.warn("No shakes removed");
      console.trace();
    }

    return this;
  }

  clearShakes(): this {
    this._shake_queue.clear();

    this.dispatchEvent(new Event("clearShakes"));

    return this;
  }
}
