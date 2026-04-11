export class Vector2 {
  x: number;
  y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  add(v: Vector2): this {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  sub(v: Vector2): this {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  mult(n: number): this {
    this.x *= n;
    this.y *= n;
    return this;
  }

  div(n: number): this {
    if (n !== 0) {
      this.x /= n;
      this.y /= n;
    }
    return this;
  }

  mag(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  magSq(): number {
    return this.x * this.x + this.y * this.y;
  }

  normalize(): this {
    let m = this.mag();
    if (m !== 0 && m !== 1) {
      this.div(m);
    }
    return this;
  }

  setMag(len: number): this {
    this.normalize();
    this.mult(len);
    return this;
  }

  limit(max: number): this {
    if (this.magSq() > max * max) {
      this.normalize();
      this.mult(max);
    }
    return this;
  }

  heading(): number {
    return Math.atan2(this.y, this.x);
  }

  copy(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  dist(v: Vector2): number {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
  
  static sub(v1: Vector2, v2: Vector2): Vector2 {
    return new Vector2(v1.x - v2.x, v1.y - v2.y);
  }
}
