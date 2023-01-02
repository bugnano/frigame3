import { Sprite } from "../Sprite.js";
import { playgroundMap } from "./renderPlayground.js";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function initSprite(sprite: Sprite) {
  // no-op
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function removeSprite(sprite: Sprite) {
  // no-op
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function drawSprite(sprite: Sprite, interp: number) {
  const playground = sprite.playground!;

  const left = sprite._drawLeft;
  const top = sprite._drawTop;
  const width = sprite._drawWidth;
  const height = sprite._drawHeight;

  const insidePlayground = playground._insidePlayground(
    left,
    top,
    width,
    height
  );
  const animation = sprite._animation;
  const opacity = sprite._opacity;
  const scaleh = sprite._scaleh;
  const scalev = sprite._scalev;

  if (
    insidePlayground &&
    animation &&
    opacity &&
    scaleh &&
    scalev &&
    !sprite.hidden
  ) {
    const playgroundData = playgroundMap.get(playground)!;
    const ctx = playgroundData.ctx;

    let old_alpha = 1;
    let alpha_changed = false;
    if (opacity !== 1) {
      // Don't save the entire context only for opacity changes
      old_alpha = ctx.globalAlpha;

      ctx.globalAlpha = old_alpha * opacity;

      alpha_changed = true;
    }

    let old_blend_mode: GlobalCompositeOperation = "source-over";
    let blend_mode_changed = false;
    const blendMode = sprite.blendMode;
    if (blendMode !== "normal") {
      old_blend_mode = ctx.globalCompositeOperation;

      if (blendMode === "add") {
        ctx.globalCompositeOperation = "lighter";
      } else {
        ctx.globalCompositeOperation = blendMode;
      }

      blend_mode_changed = true;
    }

    const angle = sprite.angle;
    const sprite_sheet = animation.frameset[sprite._currentSpriteSheet];
    const currentFrame = sprite._currentFrame;

    if (angle || scaleh !== 1 || scalev !== 1) {
      const trunc = Math.trunc;

      ctx.save();

      let transformOriginx = sprite.transformOriginx;

      if (typeof transformOriginx === "string") {
        transformOriginx = sprite[transformOriginx];
      }

      transformOriginx = trunc(transformOriginx);

      let transformOriginy = sprite.transformOriginy;

      if (typeof transformOriginy === "string") {
        transformOriginy = sprite[transformOriginy];
      }

      transformOriginy = trunc(transformOriginy);

      ctx.translate(left + transformOriginx, top + transformOriginy);

      if (angle) {
        ctx.rotate(angle);
      }

      if (scaleh !== 1 || scalev !== 1) {
        ctx.scale(scaleh, scalev);
      }

      ctx.translate(-transformOriginx, -transformOriginy);

      ctx.drawImage(
        sprite_sheet._img,
        sprite_sheet.offsetx +
          sprite._multix +
          currentFrame * sprite_sheet._deltax,
        sprite_sheet.offsety +
          sprite._multiy +
          currentFrame * sprite_sheet._deltay,
        width,
        height,
        0,
        0,
        width,
        height
      );

      ctx.restore();
    } else {
      ctx.drawImage(
        sprite_sheet._img,
        sprite_sheet.offsetx +
          sprite._multix +
          currentFrame * sprite_sheet._deltax,
        sprite_sheet.offsety +
          sprite._multiy +
          currentFrame * sprite_sheet._deltay,
        width,
        height,
        left,
        top,
        width,
        height
      );

      if (blend_mode_changed) {
        ctx.globalCompositeOperation = old_blend_mode;
      }

      if (alpha_changed) {
        ctx.globalAlpha = old_alpha;
      }
    }
  }
}
