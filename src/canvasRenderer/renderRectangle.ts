import { playgroundMap } from "./renderPlayground.js";
import type { Rectangle } from "../Rectangle.js";
import type { GradientType } from "../Gradient.js";

export interface GradientObj {
  width: number;
  height: number;
  startColorStr: string;
  endColorStr: string;
  type: GradientType;
  gradient: CanvasGradient | null;
}

export const fillMap = new WeakMap<Rectangle, GradientObj>();
export const strokeMap = new WeakMap<Rectangle, GradientObj>();

export function initRectangle(rectangle: Rectangle): void {
  for (const map of [fillMap, strokeMap]) {
    map.set(rectangle, {
      width: 0,
      height: 0,
      startColorStr: "rgba(0,0,0,1)",
      endColorStr: "rgba(0,0,0,1)",
      type: "vertical",
      gradient: null,
    });
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function removeRectangle(rectangle: Rectangle): void {
  // no-op
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function drawRectangle(rectangle: Rectangle, interp: number): void {
  const playground = rectangle.playground!;

  const trunc = Math.trunc;
  const left = rectangle._drawLeft;
  const top = rectangle._drawTop;
  const width = rectangle._drawWidth;
  const height = rectangle._drawHeight;

  const insidePlayground = playground._insidePlayground(
    left,
    top,
    width,
    height,
  );
  const background = rectangle._background;
  const border_width = trunc(rectangle._borderWidth);
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
    !rectangle._hidden
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
    const blendMode = rectangle._blendMode;
    if (blendMode !== "normal") {
      old_blend_mode = ctx.globalCompositeOperation;

      if (blendMode === "add") {
        ctx.globalCompositeOperation = "lighter";
      } else {
        ctx.globalCompositeOperation = blendMode;
      }

      blend_mode_changed = true;
    }

    const angle = rectangle._angle;
    const border_radius = trunc(rectangle._borderRadius);
    const border_half_width = border_width / 2;

    if (angle || scaleh !== 1 || scalev !== 1) {
      ctx.save();

      let transformOriginx = rectangle._transformOriginx;

      if (typeof transformOriginx === "string") {
        transformOriginx = rectangle[transformOriginx];
      }

      transformOriginx = trunc(transformOriginx);

      let transformOriginy = rectangle._transformOriginy;

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
          ctx.roundRect(0, 0, width, height, border_radius);
        } else {
          ctx.rect(0, 0, width, height);
        }

        ctx.closePath();

        setFillStyle(ctx, rectangle);
        ctx.fill();
      }

      if (border_width > 0 && border_color) {
        ctx.beginPath();

        if (border_radius > 0) {
          ctx.roundRect(
            -border_half_width,
            -border_half_width,
            width + border_width,
            height + border_width,
            border_radius + border_half_width,
          );
        } else {
          ctx.rect(
            -border_half_width,
            -border_half_width,
            width + border_width,
            height + border_width,
          );
        }

        ctx.closePath();

        setStrokeStyle(ctx, rectangle);
        ctx.lineWidth = border_width;
        ctx.stroke();
      }

      ctx.restore();
    } else {
      let translated = false;

      if (background) {
        const startColorStr = background.startColor._str;

        if (startColorStr === background.endColor._str) {
          // Solid background
          ctx.beginPath();

          if (border_radius > 0) {
            ctx.roundRect(left, top, width, height, border_radius);
          } else {
            ctx.rect(left, top, width, height);
          }

          ctx.closePath();

          ctx.fillStyle = startColorStr;
          ctx.fill();
        } else {
          // Gradient background
          if (left || top) {
            ctx.translate(left, top);
          }
          translated = true;

          // Prepare a rect path for the background and the clipping region
          ctx.beginPath();

          if (border_radius > 0) {
            ctx.roundRect(0, 0, width, height, border_radius);
          } else {
            ctx.rect(0, 0, width, height);
          }

          ctx.closePath();

          setFillStyle(ctx, rectangle);
          ctx.fill();
        }
      }

      if (border_width > 0 && border_color) {
        const startColorStr = border_color.startColor._str;

        if (startColorStr === border_color.endColor._str) {
          // Solid border
          ctx.beginPath();

          if (translated) {
            if (border_radius > 0) {
              ctx.roundRect(
                -border_half_width,
                -border_half_width,
                width + border_width,
                height + border_width,
                border_radius + border_half_width,
              );
            } else {
              ctx.rect(
                -border_half_width,
                -border_half_width,
                width + border_width,
                height + border_width,
              );
            }
          } else {
            if (border_radius > 0) {
              ctx.roundRect(
                left - border_half_width,
                top - border_half_width,
                width + border_width,
                height + border_width,
                border_radius + border_half_width,
              );
            } else {
              ctx.rect(
                left - border_half_width,
                top - border_half_width,
                width + border_width,
                height + border_width,
              );
            }
          }

          ctx.closePath();

          ctx.strokeStyle = startColorStr;
          ctx.lineWidth = border_width;
          ctx.stroke();
        } else {
          // Gradient border
          if (!translated && (left || top)) {
            ctx.translate(left, top);
          }
          translated = true;

          ctx.beginPath();

          if (border_radius > 0) {
            ctx.roundRect(
              -border_half_width,
              -border_half_width,
              width + border_width,
              height + border_width,
              border_radius + border_half_width,
            );
          } else {
            ctx.rect(
              -border_half_width,
              -border_half_width,
              width + border_width,
              height + border_width,
            );
          }

          ctx.closePath();

          setStrokeStyle(ctx, rectangle);
          ctx.lineWidth = border_width;
          ctx.stroke();
        }
      }

      if (translated && (left || top)) {
        ctx.translate(-left, -top);
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

function setFillStyle(
  ctx: CanvasRenderingContext2D,
  rectangle: Rectangle,
): void {
  const background = rectangle._background;

  if (background) {
    const startColorStr = background.startColor._str;
    const endColorStr = background.endColor._str;

    if (startColorStr === endColorStr) {
      // Solid background
      ctx.fillStyle = startColorStr;
    } else {
      // Gradient background
      const gradient_obj = fillMap.get(rectangle)!;

      const trunc = Math.trunc;
      const width = trunc(rectangle._width);
      const height = trunc(rectangle._height);
      const type = background.type;

      if (
        !gradient_obj.gradient ||
        gradient_obj.width !== width ||
        gradient_obj.height !== height ||
        gradient_obj.startColorStr !== startColorStr ||
        gradient_obj.endColorStr !== endColorStr ||
        gradient_obj.type !== type
      ) {
        gradient_obj.width = width;
        gradient_obj.height = height;
        gradient_obj.startColorStr = startColorStr;
        gradient_obj.endColorStr = endColorStr;
        gradient_obj.type = type;

        const end_x = type === "vertical" ? 0 : width;
        const end_y = type === "vertical" ? height : 0;
        const gradient = ctx.createLinearGradient(0, 0, end_x, end_y);
        gradient.addColorStop(0, startColorStr);
        gradient.addColorStop(1, endColorStr);

        gradient_obj.gradient = gradient;

        ctx.fillStyle = gradient;
      } else {
        ctx.fillStyle = gradient_obj.gradient;
      }
    }
  }
}

function setStrokeStyle(
  ctx: CanvasRenderingContext2D,
  rectangle: Rectangle,
): void {
  const border_color = rectangle._borderColor;

  if (border_color) {
    const startColorStr = border_color.startColor._str;
    const endColorStr = border_color.endColor._str;

    if (startColorStr === endColorStr) {
      // Solid border
      ctx.strokeStyle = startColorStr;
    } else {
      // Gradient border
      const gradient_obj = strokeMap.get(rectangle)!;

      const trunc = Math.trunc;
      const width = trunc(rectangle._width);
      const height = trunc(rectangle._height);
      const type = border_color.type;

      if (
        !gradient_obj.gradient ||
        gradient_obj.width !== width ||
        gradient_obj.height !== height ||
        gradient_obj.startColorStr !== startColorStr ||
        gradient_obj.endColorStr !== endColorStr ||
        gradient_obj.type !== type
      ) {
        gradient_obj.width = width;
        gradient_obj.height = height;
        gradient_obj.startColorStr = startColorStr;
        gradient_obj.endColorStr = endColorStr;
        gradient_obj.type = type;

        const end_x = type === "vertical" ? 0 : width;
        const end_y = type === "vertical" ? height : 0;
        const gradient = ctx.createLinearGradient(0, 0, end_x, end_y);
        gradient.addColorStop(0, startColorStr);
        gradient.addColorStop(1, endColorStr);

        gradient_obj.gradient = gradient;

        ctx.strokeStyle = gradient;
      } else {
        ctx.strokeStyle = gradient_obj.gradient;
      }
    }
  }
}
