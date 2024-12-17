export class Vec2 {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  static fromMagAngle(mag: number, angle: number): Vec2 {
    return new Vec2(Math.cos(angle) * mag, Math.sin(angle) * mag);
  }

  static randomUnit(): Vec2 {
    const angle = Math.random() * Math.PI * 2;

    return new Vec2(Math.cos(angle), Math.sin(angle));
  }

  static random(scale = 1): Vec2 {
    const mag = Math.random() * scale;
    const angle = Math.random() * Math.PI * 2;

    return new Vec2(Math.cos(angle) * mag, Math.sin(angle) * mag);
  }

  static sum(a: Vec2, b: Vec2): Vec2 {
    return new Vec2(a.x + b.x, a.y + b.y);
  }

  static difference(a: Vec2, b: Vec2): Vec2 {
    return new Vec2(a.x - b.x, a.y - b.y);
  }

  static rotateAroundPoint(a: Vec2, axisPoint: Vec2, angle: number): Vec2 {
    return Vec2.clone(a).subtract(axisPoint).rotate(angle).add(axisPoint);
  }

  static scaleAndRotate(
    a: Vec2,
    axisPoint: Vec2,
    scalex: number,
    scaley: number,
    angle: number,
  ): Vec2 {
    return Vec2.clone(a)
      .subtract(axisPoint)
      .scale(scalex, scaley)
      .rotate(angle)
      .add(axisPoint);
  }

  static lerp(a: Vec2, b: Vec2, t: number): Vec2 {
    const ax = a.x;
    const ay = a.y;

    const x = ax + t * (b.x - ax);
    const y = ay + t * (b.y - ay);

    return new Vec2(x, y);
  }

  static rescaled(a: Vec2, sx: number, sy: number = sx): Vec2 {
    return new Vec2(a.x * sx, a.y * sy);
  }

  static clone(a: Vec2): Vec2 {
    return new Vec2(a.x, a.y);
  }

  fromMagAngle(mag: number, angle: number): this {
    this.x = Math.cos(angle) * mag;
    this.y = Math.sin(angle) * mag;

    return this;
  }

  clone(a: Vec2): this {
    this.x = a.x;
    this.y = a.y;

    return this;
  }

  assign(x: number, y: number): this {
    this.x = x;
    this.y = y;

    return this;
  }

  toString(): string {
    return `Vec2(${this.x}, ${this.y})`;
  }

  magnitude(): number {
    return Math.hypot(this.x, this.y);
  }

  squaredMagnitude(): number {
    const x = this.x;
    const y = this.y;

    return x * x + y * y;
  }

  azimuth(): number {
    return Math.atan2(this.y, this.x);
  }

  scale(sx: number, sy: number = sx): this {
    this.x *= sx;
    this.y *= sy;

    return this;
  }

  invert(): this {
    this.x *= -1;
    this.y *= -1;

    return this;
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

  add(a: Vec2): this {
    this.x += a.x;
    this.y += a.y;

    return this;
  }

  subtract(a: Vec2): this {
    this.x -= a.x;
    this.y -= a.y;

    return this;
  }

  rotate(angle: number): this {
    const x = this.x;
    const y = this.y;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    this.x = x * cos - y * sin;
    this.y = y * cos + x * sin;

    return this;
  }

  equals(a: Vec2): boolean {
    return this.x === a.x && this.y === a.y;
  }

  distance(a: Vec2): number {
    return Math.hypot(this.x - a.x, this.y - a.y);
  }

  squaredDistance(a: Vec2): number {
    const dx = this.x - a.x;
    const dy = this.y - a.y;

    return dx * dx + dy * dy;
  }

  ceil(): this {
    this.x = Math.ceil(this.x);
    this.y = Math.ceil(this.y);

    return this;
  }

  floor(): this {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);

    return this;
  }

  round(): this {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);

    return this;
  }

  trunc(): this {
    this.x = Math.trunc(this.x);
    this.y = Math.trunc(this.y);

    return this;
  }

  dot(a: Vec2): number {
    return this.x * a.x + this.y * a.y;
  }

  determinant(a: Vec2): number {
    return this.x * a.y - this.y * a.x;
  }

  rotateAroundPoint(axisPoint: Vec2, angle: number): this {
    return this.subtract(axisPoint).rotate(angle).add(axisPoint);
  }

  scaleAndRotate(
    axisPoint: Vec2,
    scalex: number,
    scaley: number,
    angle: number,
  ): this {
    return this.subtract(axisPoint)
      .scale(scalex, scaley)
      .rotate(angle)
      .add(axisPoint);
  }

  lerp(a: Vec2, t: number): this {
    const x = this.x;
    const y = this.y;

    this.x = x + t * (a.x - x);
    this.y = y + t * (a.y - y);

    return this;
  }
}
