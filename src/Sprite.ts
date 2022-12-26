import { BaseSprite } from "./BaseSprite.js";
import { SpriteGroup } from "./SpriteGroup.js";
import { Animation } from "./Animation.js";
import type { AnimationOptions } from "./Animation.js";
import type { Playground } from "./Playground.js";
import type { BaseSpriteOptions } from "./BaseSprite.js";
import { pick } from "./utils.js";

export interface SpriteOptions extends AnimationOptions {
  animation: Animation | null;
  animationIndex: number;
  callback: (() => void) | null;
  paused: boolean;
}

export class Sprite extends BaseSprite {
  _animation: Animation | null = null;
  _animationIndex = 0;
  _callback: (() => void) | null = null;
  _paused = false;
  rate = 1;
  once = false;
  pingpong = false;
  backwards = false;

  // Implementation details
  _idleCounter = 0;
  _lastSpriteSheet = 0;
  _currentSpriteSheet = 0;
  _numberOfFrame = 0;
  _currentFrame = 0;
  _frameIncrement = 1;
  _multix = 0;
  _multiy = 0;
  _endAnimation = false;

  get animation() {
    return this._animation;
  }

  set animation(value: Animation | null) {
    if (value !== this._animation) {
      this._animation = value;

      if (value) {
        this.rate = value.rate;
        this.once = value.once;
        this.pingpong = value.pingpong;
        this.backwards = value.backwards;

        // Force new width and height based on the animation frame size
        super.width = value.frameWidth;
        super.height = value.frameHeight;
      } else {
        this.rate = 1;
        this.once = false;
        this.pingpong = false;
        this.backwards = false;

        super.width = 0;
        super.height = 0;
      }

      this._animationIndex = 0;
      this.callback = null;
      this.paused = false;

      this.restartAnimation();

      this._checkUpdate();
    }
  }

  get animationIndex() {
    return this._animationIndex;
  }

  set animationIndex(value: number) {
    if (value != this._animationIndex) {
      this._animationIndex = value;
      this.callback = null;
      this.paused = false;

      this.restartAnimation();
    }
  }

  get callback() {
    return this._callback;
  }

  set callback(value: (() => void) | null) {
    this._callback = value;

    this._checkUpdate();
  }

  get paused() {
    return this._paused;
  }

  set paused(value: boolean) {
    this._paused = value;

    this._checkUpdate();
  }

  constructor(
    playground: Playground,
    parent?: SpriteGroup,
    options?: Partial<BaseSpriteOptions & SpriteOptions>
  ) {
    super(playground, parent, options);

    if (options) {
      for (const [prop, val] of Object.entries(
        pick(options, [
          "animation",
          "animationIndex",
          "callback",
          "paused",
          "rate",
          "once",
          "pingpong",
          "backwards",
        ])
      )) {
        (this as any)[prop as keyof SpriteOptions] = val;
      }
    }

    this.teleport();
  }

  // Public functions

  restartAnimation() {
    const animation = this._animation;

    if (animation && this.backwards) {
      this._lastSpriteSheet = animation.frameset.length - 1;
      this._currentSpriteSheet = this._lastSpriteSheet;
      this._numberOfFrame =
        animation.frameset[this._currentSpriteSheet].numberOfFrame;
      this._currentFrame = this._numberOfFrame - 1;
      this._frameIncrement = -1;
    } else {
      this._currentSpriteSheet = 0;
      if (animation) {
        this._lastSpriteSheet = animation.frameset.length - 1;
        this._numberOfFrame = animation.frameset[0].numberOfFrame;
      } else {
        this._lastSpriteSheet = 0;
        this._numberOfFrame = 0;
      }
      this._currentFrame = 0;
      this._frameIncrement = 1;
    }

    this._idleCounter = 0;
    this._endAnimation = false;

    const index = this._animationIndex;

    if (animation && index) {
      const sprite_sheet = animation.frameset[this._currentSpriteSheet];
      this._multix = index * sprite_sheet._multix;
      this._multiy = index * sprite_sheet._multiy;
    } else {
      this._multix = 0;
      this._multiy = 0;
    }

    return this;
  }

  // Implementation details

  _checkUpdate() {
    const oldNeedsUpdate = this._needsUpdate;

    if (
      this._endAnimation ||
      this._paused ||
      (!this._callback &&
        (!this._animation ||
          (this._lastSpriteSheet <= 0 && this._numberOfFrame <= 1)))
    ) {
      this._needsUpdate = false;
    } else {
      this._needsUpdate = true;
    }

    this._updateNeedsUpdate(oldNeedsUpdate);
  }

  _update() {
    const callback = this._callback;
    const animation = this._animation;

    let currentSpriteSheet = this._currentSpriteSheet;
    let currentFrame = this._currentFrame;

    if (!(this._endAnimation || this._paused)) {
      if (animation) {
        this._idleCounter += 1;
        if (this._idleCounter >= this.rate) {
          this._idleCounter = 0;
          currentFrame += this._frameIncrement;
          if (this.backwards) {
            // Backwards animations
            if (this.pingpong) {
              // In pingpong animations the end is when the frame returns to the last frame
              if (currentFrame >= this._numberOfFrame) {
                if (currentSpriteSheet < this._lastSpriteSheet) {
                  currentSpriteSheet += 1;
                  this._currentSpriteSheet = currentSpriteSheet;
                  this._numberOfFrame =
                    animation.frameset[currentSpriteSheet].numberOfFrame;
                  this._currentFrame = 0;
                } else {
                  this._frameIncrement = -1;
                  if (this.once) {
                    currentFrame -= 1;
                    this._idleCounter = 1;
                    this._endAnimation = true;
                  } else {
                    // The first frame has already been displayed, start from the second
                    if (this._numberOfFrame > 1) {
                      currentFrame -= 2;
                    } else if (this._lastSpriteSheet > 0) {
                      currentSpriteSheet -= 1;
                      this._currentSpriteSheet = currentSpriteSheet;
                      this._numberOfFrame =
                        animation.frameset[currentSpriteSheet].numberOfFrame;
                      currentFrame = this._numberOfFrame - 1;
                    } else {
                      currentFrame -= 1;
                    }
                  }

                  // Update the details before the callback
                  this._currentFrame = currentFrame;

                  callback?.();
                }
              } else if (currentFrame < 0) {
                if (currentSpriteSheet > 0) {
                  currentSpriteSheet -= 1;
                  this._currentSpriteSheet = currentSpriteSheet;
                  this._numberOfFrame =
                    animation.frameset[currentSpriteSheet].numberOfFrame;
                  this._currentFrame = this._numberOfFrame - 1;
                } else {
                  // Last frame reached, change animation direction
                  this._frameIncrement = 1;
                  // The first frame has already been displayed, start from the second
                  if (this._numberOfFrame > 1) {
                    currentFrame = 1;
                  } else if (this._lastSpriteSheet > 0) {
                    currentSpriteSheet += 1;
                    this._currentSpriteSheet = currentSpriteSheet;
                    this._numberOfFrame =
                      animation.frameset[currentSpriteSheet].numberOfFrame;
                    currentFrame = 0;
                  } else {
                    currentFrame = 0;
                  }
                  this._currentFrame = currentFrame;
                }
              } else {
                // This is no particular frame, simply update the details
                this._currentFrame = currentFrame;
              }
            } else {
              // Normal animation
              if (currentFrame < 0) {
                if (currentSpriteSheet > 0) {
                  currentSpriteSheet -= 1;
                  this._currentSpriteSheet = currentSpriteSheet;
                  this._numberOfFrame =
                    animation.frameset[currentSpriteSheet].numberOfFrame;
                  this._currentFrame = this._numberOfFrame - 1;
                } else {
                  // Last frame reached
                  if (this.once) {
                    currentFrame = 0;
                    this._idleCounter = 1;
                    this._endAnimation = true;
                  } else {
                    currentSpriteSheet = this._lastSpriteSheet;
                    this._currentSpriteSheet = currentSpriteSheet;
                    this._numberOfFrame =
                      animation.frameset[currentSpriteSheet].numberOfFrame;
                    currentFrame = this._numberOfFrame - 1;
                  }

                  // Update the details before the callback
                  this._currentFrame = currentFrame;

                  callback?.();
                }
              } else {
                // This is no particular frame, simply update the details
                this._currentFrame = currentFrame;
              }
            }
          } else {
            // Forwards animations
            if (this.pingpong) {
              // In pingpong animations the end is when the frame goes below 0
              if (currentFrame < 0) {
                if (currentSpriteSheet > 0) {
                  currentSpriteSheet -= 1;
                  this._currentSpriteSheet = currentSpriteSheet;
                  this._numberOfFrame =
                    animation.frameset[currentSpriteSheet].numberOfFrame;
                  this._currentFrame = this._numberOfFrame - 1;
                } else {
                  this._frameIncrement = 1;
                  if (this.once) {
                    currentFrame = 0;
                    this._idleCounter = 1;
                    this._endAnimation = true;
                  } else {
                    // The first frame has already been displayed, start from the second
                    if (this._numberOfFrame > 1) {
                      currentFrame = 1;
                    } else if (this._lastSpriteSheet > 0) {
                      currentSpriteSheet += 1;
                      this._currentSpriteSheet = currentSpriteSheet;
                      this._numberOfFrame =
                        animation.frameset[currentSpriteSheet].numberOfFrame;
                      currentFrame = 0;
                    } else {
                      currentFrame = 0;
                    }
                  }

                  // Update the details before the callback
                  this._currentFrame = currentFrame;

                  callback?.();
                }
              } else if (currentFrame >= this._numberOfFrame) {
                if (currentSpriteSheet < this._lastSpriteSheet) {
                  currentSpriteSheet += 1;
                  this._currentSpriteSheet = currentSpriteSheet;
                  this._numberOfFrame =
                    animation.frameset[currentSpriteSheet].numberOfFrame;
                  this._currentFrame = 0;
                } else {
                  // Last frame reached, change animation direction
                  this._frameIncrement = -1;
                  if (this._numberOfFrame > 1) {
                    currentFrame -= 2;
                  } else if (this._lastSpriteSheet > 0) {
                    currentSpriteSheet -= 1;
                    this._currentSpriteSheet = currentSpriteSheet;
                    this._numberOfFrame =
                      animation.frameset[currentSpriteSheet].numberOfFrame;
                    currentFrame = this._numberOfFrame - 1;
                  } else {
                    currentFrame -= 1;
                  }
                  this._currentFrame = currentFrame;
                }
              } else {
                // This is no particular frame, simply update the details
                this._currentFrame = currentFrame;
              }
            } else {
              // Normal animation
              if (currentFrame >= this._numberOfFrame) {
                if (currentSpriteSheet < this._lastSpriteSheet) {
                  currentSpriteSheet += 1;
                  this._currentSpriteSheet = currentSpriteSheet;
                  this._numberOfFrame =
                    animation.frameset[currentSpriteSheet].numberOfFrame;
                  this._currentFrame = 0;
                } else {
                  // Last frame reached
                  if (this.once) {
                    currentFrame -= 1;
                    this._idleCounter = 1;
                    this._endAnimation = true;
                  } else {
                    currentSpriteSheet = 0;
                    this._currentSpriteSheet = currentSpriteSheet;
                    this._numberOfFrame =
                      animation.frameset[currentSpriteSheet].numberOfFrame;
                    currentFrame = 0;
                  }

                  // Update the details before the callback
                  this._currentFrame = currentFrame;

                  callback?.();
                }
              } else {
                // This is no particular frame, simply update the details
                this._currentFrame = currentFrame;
              }
            }
          }
        }
      } else {
        // Make sure that the callback is called even if there is no animation
        callback?.();
      }
    }
  }
}

export function addSprite(
  parent: SpriteGroup,
  options?: Partial<BaseSpriteOptions & SpriteOptions>
) {
  const sprite = new Sprite(parent.playground!, parent, options);
  parent._layers.push(sprite);

  parent._checkUpdate();

  return sprite;
}

export function insertSprite(
  parent: SpriteGroup,
  options?: Partial<BaseSpriteOptions & SpriteOptions>
) {
  const sprite = new Sprite(parent.playground!, parent, options);
  parent._layers.unshift(sprite);

  parent._checkUpdate();

  return sprite;
}
