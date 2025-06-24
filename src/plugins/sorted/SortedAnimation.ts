import type {
  AnimationOptions,
  FrameOptions,
  SpriteSheet,
} from "../../Animation.js";
import { Animation } from "../../Animation.js";
import type { RectSizeX, RectSizeY } from "../../Rect.js";

export interface SortedAnimationOptions extends AnimationOptions {
  originx: keyof RectSizeX | number;
  originy: keyof RectSizeY | number;
}

export class SortedAnimation extends Animation {
  originx: keyof RectSizeX | number = "halfWidth";
  originy: keyof RectSizeY | number = "height";

  constructor(
    options:
      | Partial<SpriteSheet & SortedAnimationOptions & FrameOptions>
      | string,
  ) {
    super(options);

    if (options && typeof options !== "string") {
      if (options.originx !== undefined) {
        this.originx = options.originx;
      }
      if (options.originy !== undefined) {
        this.originy = options.originy;
      }
    }
  }

  onLoad(): void {
    super.onLoad();

    const originx = this.originx;

    if (typeof originx === "string") {
      this.originx = this[originx];
    }

    const originy = this.originy;

    if (typeof originy === "string") {
      this.originy = this[originy];
    }
  }
}
