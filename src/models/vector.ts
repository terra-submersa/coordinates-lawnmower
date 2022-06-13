import type { Coordinate } from 'openlayers';

export default class Vector {
  readonly x: number;
  readonly y: number;

  /**
   * Creates a vector, either from its two coordinates of from two points (origin/end)
   * @param x
   * @param y
   */
  constructor(x: number | Coordinate, y: number | Coordinate) {
    if (typeof x == 'number' && typeof y == 'number') {
      this.x = x;
      this.y = y;
    } else if (Array.isArray(x) && Array.isArray(y)) {
      this.x = y[0]-x[0]
      this.y = y[1]-x[1]
    }else{
      throw new Error(`Cannot crete a Vector out of (${x}, ${y})`);
    }

  }

  rotate90(): Vector {
    return new Vector(-this.y, this.x);
  }
}
