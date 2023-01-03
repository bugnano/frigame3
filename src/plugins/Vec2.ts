export class Vec2 {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  static randomUnit() {
    const angle = Math.random() * Math.PI * 2;

    return new Vec2(Math.cos(angle), Math.sin(angle));
  }

  static random(scale = 1) {
    const mag = Math.random() * scale;
    const angle = Math.random() * Math.PI * 2;

    return new Vec2(Math.cos(angle) * mag, Math.sin(angle) * mag);
  }

  static copy(a: Vec2) {
    return new Vec2(a.x, a.y);
  }

  clone(a: Vec2) {
    this.x = a.x;
    this.y = a.y;

    return this;
  }

  magnitude() {
    const x = this.x;
    const y = this.y;

    return Math.sqrt(x * x + y * y);
  }

  squaredMagnitude() {
    const x = this.x;
    const y = this.y;

    return x * x + y * y;
  }

  azimuth() {
    return Math.atan2(this.y, this.x);
  }

  static fromMagAngle(mag: number, angle: number) {
    return new Vec2(Math.cos(angle) * mag, Math.sin(angle) * mag);
  }

  scale(value: number) {
    this.x *= value;
    this.y *= value;

    return this;
  }

  invert() {
    this.x *= -1;
    this.y *= -1;

    return this;
  }

  normalize() {
    const x = this.x;
    const y = this.y;
    let mag = x * x + y * y;

    if (mag !== 0) {
      mag = 1 / Math.sqrt(mag);
    }

    this.x = x * mag;
    this.y = y * mag;

    return this;
  }

  add(a: Vec2) {
    this.x += a.x;
    this.y += a.y;

    return this;
  }

  subtract(a: Vec2) {
    this.x -= a.x;
    this.y -= a.y;

    return this;
  }

  rotate(angle: number) {
    const x = this.x;
    const y = this.y;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    this.x = x * cos - y * sin;
    this.y = y * cos + x * sin;

    return this;
  }

  rotateAroundPoint(a: Vec2, axisPoint: Vec2, angle: number) {
    return this.clone(a).subtract(axisPoint).rotate(angle).add(axisPoint);
  }

  equals(a: Vec2) {
    return this.x === a.x && this.y === a.y;
  }

  distance(a: Vec2) {
    const dx = this.x - a.x;
    const dy = this.y - a.y;

    return Math.sqrt(dx * dx + dy * dy);
  }

  squaredDistance(a: Vec2) {
    const dx = this.x - a.x;
    const dy = this.y - a.y;

    return dx * dx + dy * dy;
  }

  static sum(a: Vec2, b: Vec2) {
    return new Vec2(a.x + b.x, a.y + b.y);
  }

  static difference(a: Vec2, b: Vec2) {
    return new Vec2(a.x - b.x, a.y - b.y);
  }

  dot(a: Vec2) {
    return this.x * a.x + this.y * a.y;
  }

  cross(a: Vec2) {
    return this.x * a.y - this.y * a.x;
  }

  static lerp(a: Vec2, b: Vec2, t: number) {
    const ax = a.x;
    const ay = a.y;

    const x = ax + t * (b.x - ax);
    const y = ay + t * (b.y - ay);

    return new Vec2(x, y);
  }
}
