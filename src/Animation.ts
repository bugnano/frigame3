import type { Resource } from "./resourceManager.js";

export type AnimationType = "vertical" | "horizontal";

export interface SpriteSheet {
  imageURL: string;
  numberOfFrame: number;
  type: AnimationType;
  offsetx: number;
  offsety: number;

  // Implementation details
  _img: HTMLImageElement;
  _deltax: number;
  _deltay: number;
  _multix: number;
  _multiy: number;
}

export interface AnimationOptions {
  rate: number;
  once: boolean;
  pingpong: boolean;
  backwards: boolean;
}

export interface FrameOptions {
  frameWidth: number;
  frameHeight: number;
  frameset: (Partial<SpriteSheet> | string)[];
}

// TODO: HTMLImageElement is not available on Nodejs
const images = new Map<
  string,
  {
    img: HTMLImageElement;
    refCount: number;
  }
>();

function getImage(imageURL: string): HTMLImageElement {
  let img: HTMLImageElement;

  const image = images.get(imageURL);
  if (image) {
    img = image.img;
    image.refCount += 1;
  } else {
    // TODO: Use "image-size" when HTMLImageElement is not available
    img = new Image();
    img.src = imageURL;

    images.set(imageURL, {
      img: img,
      refCount: 1,
    });
  }

  return img;
}

const imagesRegistry = new FinalizationRegistry((imageURLs: string[]): void => {
  for (const imageURL of imageURLs) {
    const image = images.get(imageURL);
    if (image) {
      image.refCount -= 1;
      if (image.refCount <= 0) {
        images.delete(imageURL);
      }
    }
  }
});

export class Animation implements Resource {
  rate = 0;
  once = false;
  pingpong = false;
  backwards = false;
  frameWidth = 0;
  frameHeight = 0;
  frameset: SpriteSheet[] = [];

  get width(): number {
    return this.frameWidth;
  }

  get height(): number {
    return this.frameHeight;
  }

  get halfWidth(): number {
    return this.frameWidth / 2;
  }

  get halfHeight(): number {
    return this.frameHeight / 2;
  }

  get radius(): number {
    return Math.max(this.frameWidth, this.frameHeight) / 2;
  }

  constructor(
    options: Partial<SpriteSheet & AnimationOptions & FrameOptions> | string,
  ) {
    if (typeof options === "string") {
      this.frameset.push({
        imageURL: options,
        numberOfFrame: 1,
        type: "horizontal",
        offsetx: 0,
        offsety: 0,

        _img: getImage(options),
        _deltax: 0,
        _deltay: 0,
        _multix: 0,
        _multiy: 0,
      });
    } else {
      this.rate = Number(options.rate) || 0;

      if (options.once !== undefined) {
        this.once = options.once;
      }
      if (options.pingpong !== undefined) {
        this.pingpong = options.pingpong;
      }
      if (options.backwards !== undefined) {
        this.backwards = options.backwards;
      }
      if (options.frameWidth !== undefined) {
        this.frameWidth = options.frameWidth;
      }
      if (options.frameHeight !== undefined) {
        this.frameHeight = options.frameHeight;
      }

      let imageURL: string;

      if (options.imageURL !== undefined) {
        imageURL = options.imageURL;

        this.frameset.push({
          imageURL: imageURL,
          numberOfFrame: options.numberOfFrame ?? 1,
          type: options.type ?? "horizontal",
          offsetx: options.offsetx ?? 0,
          offsety: options.offsety ?? 0,

          _img: getImage(imageURL),
          _deltax: 0,
          _deltay: 0,
          _multix: 0,
          _multiy: 0,
        });
      }

      if (options.frameset?.length) {
        // The default imageURL is the one of the first element
        imageURL ??=
          typeof options.frameset[0] === "string"
            ? options.frameset[0]
            : (options.frameset[0].imageURL ?? "");

        for (const sprite_sheet of options.frameset) {
          if (typeof sprite_sheet === "string") {
            this.frameset.push({
              imageURL: sprite_sheet,
              numberOfFrame: 1,
              type: "horizontal",
              offsetx: 0,
              offsety: 0,

              _img: getImage(sprite_sheet),
              _deltax: 0,
              _deltay: 0,
              _multix: 0,
              _multiy: 0,
            });
          } else {
            const url = sprite_sheet.imageURL ?? imageURL;

            this.frameset.push({
              imageURL: url,
              numberOfFrame: sprite_sheet.numberOfFrame ?? 1,
              type: sprite_sheet.type ?? "horizontal",
              offsetx: sprite_sheet.offsetx ?? 0,
              offsety: sprite_sheet.offsety ?? 0,

              _img: getImage(url),
              _deltax: 0,
              _deltay: 0,
              _multix: 0,
              _multiy: 0,
            });
          }
        }
      }
    }

    imagesRegistry.register(
      this,
      this.frameset.map(
        (sprite_sheet: SpriteSheet): string => sprite_sheet.imageURL,
      ),
    );
  }

  complete(): boolean {
    for (const sprite_sheet of this.frameset) {
      const img = sprite_sheet._img;

      // Apparently there are some cases where img.complete is true, even if its width and height are not known yet
      if (!(img.complete && img.width && img.height)) {
        return false;
      }
    }

    return true;
  }

  onLoad(): void {
    if (this.frameset.length) {
      // The first sprite sheet is used to calculate the frame dimensions
      const sprite_sheet = this.frameset[0];
      const img = sprite_sheet._img;

      if (sprite_sheet.type === "vertical") {
        // On multi vertical animations the frameWidth parameter is required
        this.frameWidth ||= img.width - sprite_sheet.offsetx;

        // On vertical animations the frameHeight parameter is optional
        this.frameHeight ||= Math.trunc(
          (img.height - sprite_sheet.offsety) / sprite_sheet.numberOfFrame,
        );
      } else {
        // On horizontal animations the frameWidth parameter is optional
        this.frameWidth ||= Math.trunc(
          (img.width - sprite_sheet.offsetx) / sprite_sheet.numberOfFrame,
        );

        // On multi horizontal animations the frameHeight parameter is required
        this.frameHeight ||= img.height - sprite_sheet.offsety;
      }
    }

    for (const sprite_sheet of this.frameset) {
      if (sprite_sheet.type === "vertical") {
        sprite_sheet._deltax = 0;
        sprite_sheet._deltay = this.frameHeight;
        sprite_sheet._multix = this.frameWidth;
        sprite_sheet._multiy = 0;
      } else {
        sprite_sheet._deltax = this.frameWidth;
        sprite_sheet._deltay = 0;
        sprite_sheet._multix = 0;
        sprite_sheet._multiy = this.frameHeight;
      }
    }
  }
}
