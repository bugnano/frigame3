import { Rectangle } from "../Rectangle.js";
import { playgroundMap } from "./renderPlayground.js";

export function initRectangle(rectangle: Rectangle) {
  // no-op
}

export function drawRectangle(rectangle: Rectangle, interp: number) {
  const playground = rectangle.playground!;

  const trunc = Math.trunc;
  const rectangleLeft = rectangle._left;
  const rectangleTop = rectangle._top;
  const prevLeft = rectangle._prevLeft;
  const prevTop = rectangle._prevTop;
  let left = trunc(rectangleLeft);
  let top = trunc(rectangleTop);
  const width = trunc(rectangle._width);
  const height = trunc(rectangle._height);

  if (left !== prevLeft || top !== prevTop) {
    if (rectangle._frameCounterLastMove === playground.frameCounter - 1) {
      const round = Math.round;

      left = round(left * interp + trunc(prevLeft) * (1 - interp));
      top = round(top * interp + trunc(prevTop) * (1 - interp));
    } else {
      rectangle._prevLeft = rectangleLeft;
      rectangle._prevTop = rectangleTop;
    }
  }

  const insidePlayground = playground._insidePlayground(
    left,
    top,
    width,
    height
  );
  const background = rectangle._background;
  const border_width = trunc(rectangle.borderWidth);
  const border_color = rectangle._borderColor;
  const opacity = rectangle._opacity;
  const scaleh = rectangle._scaleh;
  const scalev = rectangle._scalev;

  if (
    insidePlayground &&
    (background || (border_width > 0 && border_color)) &&
    opacity &&
    scaleh &&
    scalev &&
    !rectangle.hidden
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
    const blendMode = rectangle.blendMode;
    if (blendMode !== "normal") {
      old_blend_mode = ctx.globalCompositeOperation;

      if (blendMode === "add") {
        ctx.globalCompositeOperation = "lighter";
      } else {
        ctx.globalCompositeOperation = blendMode;
      }

      blend_mode_changed = true;
    }

    const angle = rectangle.angle;
    const border_radius = trunc(rectangle.borderRadius);
    const border_half_width = border_width / 2;

    if (angle || scaleh !== 1 || scalev !== 1) {
      ctx.save();

      let transformOriginx = rectangle.transformOriginx;

      if (typeof transformOriginx === "string") {
        transformOriginx = rectangle[transformOriginx];
      }

      transformOriginx = trunc(transformOriginx);

      let transformOriginy = rectangle.transformOriginy;

      if (typeof transformOriginy === "string") {
        transformOriginy = rectangle[transformOriginy];
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

      if (background) {
        // Prepare a rect path for the background and the clipping region
        ctx.beginPath();

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

        // TODO: Set fill style
        ctx.fill();
      }

      if (border_width > 0 && border_color) {
        ctx.beginPath();

        if (border_radius > 0) {
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          if (ctx.roundRect) {
            ctx.roundRect(
              -border_half_width,
              -border_half_width,
              width + border_width,
              height + border_width,
              border_radius + border_half_width
            );
          } else {
            roundRect(
              ctx,
              -border_half_width,
              -border_half_width,
              width + border_width,
              height + border_width,
              border_radius + border_half_width
            );
          }
        } else {
          ctx.rect(
            -border_half_width,
            -border_half_width,
            width + border_width,
            height + border_width
          );
        }

        ctx.closePath();

        // TODO: Set stroke style
        ctx.lineWidth = border_width;
        ctx.stroke();
      }

      ctx.restore();
    } else {
      if (background) {
        // Prepare a rect path for the background and the clipping region
        ctx.beginPath();

        if (border_radius > 0) {
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          if (ctx.roundRect) {
            ctx.roundRect(left, top, width, height, border_radius);
          } else {
            roundRect(ctx, left, top, width, height, border_radius);
          }
        } else {
          ctx.rect(left, top, width, height);
        }

        ctx.closePath();

        // TODO: Set fill style
        ctx.fill();
      }

      if (border_width > 0 && border_color) {
        ctx.beginPath();

        if (border_radius > 0) {
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          if (ctx.roundRect) {
            ctx.roundRect(
              left - border_half_width,
              top - border_half_width,
              width + border_width,
              height + border_width,
              border_radius + border_half_width
            );
          } else {
            roundRect(
              ctx,
              left - border_half_width,
              top - border_half_width,
              width + border_width,
              height + border_width,
              border_radius + border_half_width
            );
          }
        } else {
          ctx.rect(
            left - border_half_width,
            top - border_half_width,
            width + border_width,
            height + border_width
          );
        }

        ctx.closePath();

        // TODO: Set stroke style
        ctx.lineWidth = border_width;
        ctx.stroke();
      }

      if (blend_mode_changed) {
        ctx.globalCompositeOperation = old_blend_mode;
      }

      if (alpha_changed) {
        ctx.globalAlpha = old_alpha;
      }
    }
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
