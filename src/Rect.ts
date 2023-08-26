import { pick, clamp } from "./utils.js";

export interface RectPosX {
  left: number;
  right: number;
  centerx: number;
}

export interface RectPosY {
  top: number;
  bottom: number;
  centery: number;
}

export interface RectSizeX {
  width: number;
  halfWidth: number;
  radius: number;
}

export interface RectSizeY {
  height: number;
  halfHeight: number;
  radius: number;
}

export type RectOptions = RectPosX & RectPosY & RectSizeX & RectSizeY;

export class Rect {
  // Implementation details

  _left = 0;
  _top = 0;
  _width = 0;
  _height = 0;
  _last_x: keyof RectPosX = "left";
  _last_y: keyof RectPosY = "top";

  get left() {
    return this._left;
  }

  set left(value: number) {
    this._left = value;
    this._last_x = "left";
  }

  get right() {
    return this._left + this._width;
  }

  set right(value: number) {
    this._left = value - this._width;
    this._last_x = "right";
  }

  get centerx() {
    return this._left + this._width / 2;
  }

  set centerx(value: number) {
    this._left = value - this._width / 2;
    this._last_x = "centerx";
  }

  get top() {
    return this._top;
  }

  set top(value: number) {
    this._top = value;
    this._last_y = "top";
  }

  get bottom() {
    return this._top + this._height;
  }

  set bottom(value: number) {
    this._top = value - this._height;
    this._last_y = "bottom";
  }

  get centery() {
    return this._top + this._height / 2;
  }

  set centery(value: number) {
    this._top = value - this._height / 2;
    this._last_y = "centery";
  }

  get width() {
    return this._width;
  }

  set width(value: number) {
    const old_x = this[this._last_x];

    this._width = value;

    this[this._last_x] = old_x;
  }

  get halfWidth() {
    return this._width / 2;
  }

  set halfWidth(value: number) {
    const old_x = this[this._last_x];

    this._width = value * 2;

    this[this._last_x] = old_x;
  }

  get height() {
    return this._height;
  }

  set height(value: number) {
    const old_y = this[this._last_y];

    this._height = value;

    this[this._last_y] = old_y;
  }

  get halfHeight() {
    return this._height / 2;
  }

  set halfHeight(value: number) {
    const old_y = this[this._last_y];

    this._height = value * 2;

    this[this._last_y] = old_y;
  }

  get radius() {
    return Math.max(this._width, this._height) / 2;
  }

  set radius(value: number) {
    const old_x = this[this._last_x];
    const old_y = this[this._last_y];

    const new_value = value * 2;

    this._width = new_value;
    this._height = new_value;

    this[this._last_x] = old_x;
    this[this._last_y] = old_y;
  }

  constructor(options?: Partial<RectOptions>) {
    if (options) {
      Object.assign(
        this,
        pick(options, [
          "left",
          "right",
          "centerx",
          "top",
          "bottom",
          "centery",
          "width",
          "halfWidth",
          "height",
          "halfHeight",
          "radius",
        ])
      );
    }
  }

  // Collision detection

  collideRect(otherRect: Rect) {
    return !(
      this.bottom <= otherRect.top ||
      this.top >= otherRect.bottom ||
      this.left >= otherRect.right ||
      this.right <= otherRect.left
    );
  }

  collideRectPoint(x: number, y: number) {
    return x >= this.left && x < this.right && y >= this.top && y < this.bottom;
  }

  collideRectCircle(otherRect: Rect) {
    const centerx = otherRect.centerx;
    const centery = otherRect.centery;
    const radius = otherRect.radius;
    const nearest_x = clamp(centerx, this.left, this.right);
    const nearest_y = clamp(centery, this.top, this.bottom);
    const dx = centerx - nearest_x;
    const dy = centery - nearest_y;

    return dx * dx + dy * dy < radius * radius;
  }

  collideCircle(otherRect: Rect) {
    const dx = otherRect.centerx - this.centerx;
    const dy = otherRect.centery - this.centery;
    const radii = this.radius + otherRect.radius;

    return dx * dx + dy * dy < radii * radii;
  }

  collideCirclePoint(x: number, y: number) {
    const dx = x - this.centerx;
    const dy = y - this.centery;
    const radius = this.radius;

    return dx * dx + dy * dy < radius * radius;
  }

  collideCircleRect(otherRect: Rect) {
    const centerx = this.centerx;
    const centery = this.centery;
    const radius = this.radius;
    const nearest_x = clamp(centerx, otherRect.left, otherRect.right);
    const nearest_y = clamp(centery, otherRect.top, otherRect.bottom);
    const dx = centerx - nearest_x;
    const dy = centery - nearest_y;

    return dx * dx + dy * dy < radius * radius;
  }
}
