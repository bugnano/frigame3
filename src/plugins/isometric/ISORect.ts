import { Rect } from "../../Rect.js";
import type { RectSizeX, RectSizeY, RectOptions } from "../../Rect.js";
import { pick } from "../../utils.js";

export interface ISORectOptions {
  originx: keyof RectSizeX | number;
  originy: keyof RectSizeY | number;
  elevation: number;
}

export class ISORect extends Rect {
  originx: keyof RectSizeX | number = 0;
  originy: keyof RectSizeY | number = 0;
  elevation = 0;

  constructor(options?: Partial<RectOptions & ISORectOptions>) {
    super(options);

    if (options) {
      Object.assign(this, pick(options, ["originx", "originy", "elevation"]));
    }
  }
}
