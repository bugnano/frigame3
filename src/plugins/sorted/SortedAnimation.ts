import { Animation } from "../../Animation.js";
import { resourceManager } from "../../resourceManager.js";
import type {
  SpriteSheet,
  AnimationOptions,
  FrameOptions,
} from "../../Animation.js";
import type { RectSizeY } from "../../Rect.js";

export interface SortedAnimationOptions extends AnimationOptions {
  originy: keyof RectSizeY | number;
}

export class SortedAnimation extends Animation {
  originy: keyof RectSizeY | number = "height";

  constructor(
    options:
      | Partial<SpriteSheet & SortedAnimationOptions & FrameOptions>
      | string
  ) {
    super(options);

    if (options && typeof options !== "string") {
      if (options.originy !== undefined) {
        this.originy = options.originy;
      }
    }
  }

  onLoad() {
    super.onLoad();

    const originy = this.originy;

    if (typeof originy === "string") {
      this.originy = this[originy];
    }
  }
}

export function addSortedAnimation(
  options: Partial<SpriteSheet & SortedAnimationOptions & FrameOptions> | string
) {
  const animation = new SortedAnimation(options);

  resourceManager.addResource(animation);

  return animation;
}
