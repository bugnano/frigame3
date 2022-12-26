import { SpriteGroup } from "../SpriteGroup.js";
import { playgroundMap } from "./renderPlayground.js";

export const spriteGroupMap = new WeakMap<
  SpriteGroup,
  {
    oldAlpha: number;
  }
>();

export function initGroup(group: SpriteGroup) {
  spriteGroupMap.set(group, {
    oldAlpha: 1,
  });
}

export function drawGroupBeforeChildren(group: SpriteGroup, interp: number) {
  const playground = group.playground!;

  const trunc = Math.trunc;
  const groupLeft = group._left;
  const groupTop = group._top;
  const prevLeft = group._prevLeft;
  const prevTop = group._prevTop;
  let left = trunc(groupLeft);
  let top = trunc(groupTop);

  if (groupLeft !== prevLeft || groupTop !== prevTop) {
    if (group._frameCounterLastMove === playground.frameCounter - 1) {
      const round = Math.round;

      left = round(left * interp + trunc(prevLeft) * (1 - interp));
      top = round(top * interp + trunc(prevTop) * (1 - interp));
    } else {
      group._prevLeft = groupLeft;
      group._prevTop = groupTop;
    }
  }

  const opacity = group._opacity;
  const scaleh = group._scaleh;
  const scalev = group._scalev;

  if (group._layers.length && opacity && scaleh && scalev && !group.hidden) {
    const playgroundData = playgroundMap.get(playground)!;
    const ctx = playgroundData.ctx;

    ctx.save();

    const groupData = spriteGroupMap.get(group)!;

    groupData.oldAlpha = playgroundData.globalAlpha;
    if (opacity !== 1) {
      playgroundData.globalAlpha *= opacity;
      ctx.globalAlpha = playgroundData.globalAlpha;
    }

    const blendMode = group.blendMode;
    if (blendMode !== "normal") {
      if (blendMode === "add") {
        ctx.globalCompositeOperation = "lighter";
      } else {
        ctx.globalCompositeOperation = blendMode;
      }
    }

    const angle = group.angle;

    if (angle || scaleh !== 1 || scalev !== 1) {
      let transformOriginx = group.transformOriginx;

      if (typeof transformOriginx === "string") {
        transformOriginx = group[transformOriginx];
      }

      transformOriginx = trunc(transformOriginx);

      let transformOriginy = group.transformOriginy;

      if (typeof transformOriginy === "string") {
        transformOriginy = group[transformOriginy];
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
    } else {
      ctx.translate(left, top);
    }

    if (group.crop) {
      // Prepare a rect path for the clipping region
      ctx.beginPath();

      const width = trunc(group._width);
      const height = trunc(group._height);
      const border_radius = trunc(group.borderRadius);

      if (border_radius > 0) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (ctx.roundRect) {
          ctx.roundRect(0, 0, width, height, border_radius);
        } else {
          roundRect(ctx, 0, 0, width, height, border_radius);
        }
      } else {
        ctx.rect(0, 0, width, height);
      }

      ctx.closePath();

      ctx.clip();
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function drawGroupAfterChildren(group: SpriteGroup, interp: number) {
  if (
    group._layers.length &&
    group._opacity &&
    group._scaleh &&
    group._scalev &&
    !group.hidden
  ) {
    const playground = group.playground!;
    const playgroundData = playgroundMap.get(playground)!;
    const ctx = playgroundData.ctx;

    // ctx.restore restores also the globalCompositeOperation and globalAlpha values
    ctx.restore();

    const groupData = spriteGroupMap.get(group)!;

    playgroundData.globalAlpha = groupData.oldAlpha;
  }
}

export function roundRect(
  ctx: CanvasRenderingContext2D,
  left: number,
  top: number,
  width: number,
  height: number,
  border_radius: number
) {
  const pi = Math.PI;
  const pi_2 = pi / 2;
  const right = left + width;
  const bottom = top + height;
  const top_left_x = left + border_radius;
  const top_right_x = right - border_radius;
  const bottom_right_y = bottom - border_radius;
  const bottom_left_x = left + border_radius;
  const top_left_y = top + border_radius;

  ctx.moveTo(top_left_x, top);

  ctx.lineTo(top_right_x, top);

  ctx.arc(top_right_x, top + border_radius, border_radius, -pi_2, 0, false);

  ctx.lineTo(right, bottom_right_y);

  ctx.arc(right - border_radius, bottom_right_y, border_radius, 0, pi_2, false);

  ctx.lineTo(bottom_left_x, bottom);

  ctx.arc(
    bottom_left_x,
    bottom - border_radius,
    border_radius,
    pi_2,
    pi,
    false
  );

  ctx.lineTo(left, top_left_y);

  ctx.arc(top_left_x, top_left_y, border_radius, pi, -pi_2, false);
}
