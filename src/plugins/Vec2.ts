export interface IVec2 {
  x: number;
  y: number;
}

export class Vec2 implements IVec2 {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  static clone(a: IVec2): Vec2 {
    return new Vec2(a.x, a.y);
  }

  clone(b: IVec2): this {
    this.x = b.x;
    this.y = b.y;

    return this;
  }

  static fromValues(x: number, y: number): Vec2 {
    return new Vec2(x, y);
  }

  fromValues(x: number, y: number): this {
    this.x = x;
    this.y = y;

    return this;
  }

  static fromPolar(mag: number, angle: number): Vec2 {
    return new Vec2(Math.cos(angle) * mag, Math.sin(angle) * mag);
  }

  fromPolar(mag: number, angle: number): this {
    this.x = Math.cos(angle) * mag;
    this.y = Math.sin(angle) * mag;

    return this;
  }

  static randomUnit(): Vec2 {
    const angle = Math.random() * Math.PI * 2;

    return new Vec2(Math.cos(angle), Math.sin(angle));
  }

  randomUnit(): this {
    const angle = Math.random() * Math.PI * 2;

    this.x = Math.cos(angle);
    this.y = Math.sin(angle);

    return this;
  }

  static random(scalar = 1): Vec2 {
    const mag = Math.random() * scalar;
    const angle = Math.random() * Math.PI * 2;

    return new Vec2(Math.cos(angle) * mag, Math.sin(angle) * mag);
  }

  random(scalar = 1): this {
    const mag = Math.random() * scalar;
    const angle = Math.random() * Math.PI * 2;

    this.x = Math.cos(angle) * mag;
    this.y = Math.sin(angle) * mag;

    return this;
  }

  static add(a: IVec2, b: IVec2): Vec2 {
    return new Vec2(a.x + b.x, a.y + b.y);
  }

  add(b: IVec2): this {
    this.x += b.x;
    this.y += b.y;

    return this;
  }

  static sub(a: IVec2, b: IVec2): Vec2 {
    return new Vec2(a.x - b.x, a.y - b.y);
  }

  sub(b: IVec2): this {
    this.x -= b.x;
    this.y -= b.y;

    return this;
  }

  static scale(a: IVec2, sx: number, sy: number = sx): Vec2 {
    return new Vec2(a.x * sx, a.y * sy);
  }

  scale(sx: number, sy: number = sx): this {
    this.x *= sx;
    this.y *= sy;

    return this;
  }

  static invert(a: IVec2): Vec2 {
    return new Vec2(-a.x, -a.y);
  }

  invert(): this {
    this.x *= -1;
    this.y *= -1;

    return this;
  }

  static normalize(a: IVec2): Vec2 {
    let mag = Math.hypot(a.x, a.y);
    if (mag !== 0) {
      mag = 1 / mag;
    }

    return new Vec2(a.x * mag, a.y * mag);
  }

  normalize(): this {
    let mag = Math.hypot(this.x, this.y);
    if (mag !== 0) {
      mag = 1 / mag;
    }

    this.x *= mag;
    this.y *= mag;

    return this;
  }

  static rotate(a: IVec2, angle: number): Vec2 {
    const x = a.x;
    const y = a.y;
    const ct = Math.cos(angle);
    const st = Math.sin(angle);

    return new Vec2(x * ct - y * st, x * st + y * ct);
  }

  rotate(angle: number): this {
    const x = this.x;
    const y = this.y;
    const ct = Math.cos(angle);
    const st = Math.sin(angle);

    this.x = x * ct - y * st;
    this.y = x * st + y * ct;

    return this;
  }

  static rotateAroundPoint(a: IVec2, axisPoint: IVec2, angle: number): Vec2 {
    return Vec2.clone(a).sub(axisPoint).rotate(angle).add(axisPoint);
  }

  rotateAroundPoint(axisPoint: IVec2, angle: number): this {
    return this.sub(axisPoint).rotate(angle).add(axisPoint);
  }

  static scaleAndRotate(
    a: IVec2,
    axisPoint: IVec2,
    angle: number,
    sx: number,
    sy: number = sx,
  ): Vec2 {
    return Vec2.clone(a)
      .sub(axisPoint)
      .scale(sx, sy)
      .rotate(angle)
      .add(axisPoint);
  }

  scaleAndRotate(
    axisPoint: IVec2,
    angle: number,
    sx: number,
    sy: number = sx,
  ): this {
    return this.sub(axisPoint).scale(sx, sy).rotate(angle).add(axisPoint);
  }

  static lerp(a: IVec2, b: IVec2, t: number): Vec2 {
    const ax = a.x;
    const ay = a.y;

    return new Vec2(ax + t * (b.x - ax), ay + t * (b.y - ay));
  }

  lerp(b: IVec2, t: number): this {
    const x = this.x;
    const y = this.y;

    this.x = x + t * (b.x - x);
    this.y = y + t * (b.y - y);

    return this;
  }

  static perp(a: IVec2): Vec2 {
    return new Vec2(-a.y, a.x);
  }

  perp(): this {
    const x = this.x;
    const y = this.y;

    this.x = -y;
    this.y = x;

    return this;
  }

  static magnitude(a: IVec2): number {
    return Math.hypot(a.x, a.y);
  }

  magnitude(): number {
    return Math.hypot(this.x, this.y);
  }

  static squaredMagnitude(a: IVec2): number {
    const x = a.x;
    const y = a.y;

    return x * x + y * y;
  }

  squaredMagnitude(): number {
    const x = this.x;
    const y = this.y;

    return x * x + y * y;
  }

  static azimuth(a: IVec2): number {
    return Math.atan2(a.y, a.x);
  }

  azimuth(): number {
    return Math.atan2(this.y, this.x);
  }

  static dot(a: IVec2, b: IVec2): number {
    return a.x * b.x + a.y * b.y;
  }

  dot(b: IVec2): number {
    return this.x * b.x + this.y * b.y;
  }

  static cross(a: IVec2, b: IVec2): number {
    return a.x * b.y - a.y * b.x;
  }

  cross(b: IVec2): number {
    return this.x * b.y - this.y * b.x;
  }

  static distance(a: IVec2, b: IVec2): number {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  distance(b: IVec2): number {
    return Math.hypot(this.x - b.x, this.y - b.y);
  }

  static squaredDistance(a: IVec2, b: IVec2): number {
    const dx = a.x - b.x;
    const dy = a.y - b.y;

    return dx * dx + dy * dy;
  }

  squaredDistance(b: IVec2): number {
    const dx = this.x - b.x;
    const dy = this.y - b.y;

    return dx * dx + dy * dy;
  }

  static direction(a: IVec2, b: IVec2): Vec2 {
    const dx = b.x - a.x;
    const dy = b.y - a.y;

    let mag = Math.hypot(dx, dy);
    if (mag !== 0) {
      mag = 1 / mag;
    }

    return new Vec2(dx * mag, dy * mag);
  }

  direction(b: IVec2): this {
    const dx = b.x - this.x;
    const dy = b.y - this.y;

    let mag = Math.hypot(dx, dy);
    if (mag !== 0) {
      mag = 1 / mag;
    }

    this.x = dx * mag;
    this.y = dy * mag;

    return this;
  }

  static project(a: IVec2, b: IVec2): Vec2 {
    const bx = b.x;
    const by = b.y;

    const dotAB = a.x * bx + a.y * by;

    let squaredMagB = bx * bx + by * by;
    if (squaredMagB !== 0) {
      squaredMagB = 1 / squaredMagB;
    }

    const scalar = dotAB * squaredMagB;

    return new Vec2(bx * scalar, by * scalar);
  }

  project(b: IVec2): this {
    const bx = b.x;
    const by = b.y;

    const dotAB = this.x * bx + this.y * by;

    let squaredMagB = bx * bx + by * by;
    if (squaredMagB !== 0) {
      squaredMagB = 1 / squaredMagB;
    }

    const scalar = dotAB * squaredMagB;

    this.x *= scalar;
    this.y *= scalar;

    return this;
  }

  static abs(a: IVec2): Vec2 {
    return new Vec2(Math.abs(a.x), Math.abs(a.y));
  }

  abs(): this {
    this.x = Math.abs(this.x);
    this.y = Math.abs(this.y);

    return this;
  }

  static ceil(a: IVec2): Vec2 {
    return new Vec2(Math.ceil(a.x), Math.ceil(a.y));
  }

  ceil(): this {
    this.x = Math.ceil(this.x);
    this.y = Math.ceil(this.y);

    return this;
  }

  static floor(a: IVec2): Vec2 {
    return new Vec2(Math.floor(a.x), Math.floor(a.y));
  }

  floor(): this {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);

    return this;
  }

  static round(a: IVec2): Vec2 {
    return new Vec2(Math.round(a.x), Math.round(a.y));
  }

  round(): this {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);

    return this;
  }

  static trunc(a: IVec2): Vec2 {
    return new Vec2(Math.trunc(a.x), Math.trunc(a.y));
  }

  trunc(): this {
    this.x = Math.trunc(this.x);
    this.y = Math.trunc(this.y);

    return this;
  }

  static equals(a: IVec2, b: IVec2): boolean {
    return a.x === b.x && a.y === b.y;
  }

  equals(b: IVec2): boolean {
    return this.x === b.x && this.y === b.y;
  }
}
