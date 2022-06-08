import type { Coordinate, } from 'openlayers';
import { distance } from '@/models/track';
import { checkIntersection } from 'line-intersect';
import * as _ from 'lodash';
import { maxBy } from 'lodash';

export default class MappingPerimeter {
  readonly path: Coordinate[];


  constructor(path: Coordinate[]) {
    this.path = [...path];
  }


  width() {
    return distance(this.path[0], this.path[1]);
  }

  height() {
    return distance(this.path[0], this.path[3]);
  }

  diagonalLength() {
    return distance(this.path[0], this.path[2]);
  }


  intersectOtherSide(p: Coordinate, vx: number, vy: number): Coordinate {
    const vLength = Math.sqrt(vx * vx + vy * vy);
    const vnx = vx / vLength;
    const vny = vy / vLength;
    const diag = this.diagonalLength() * 1.1;
    const segmentA = [[p[0] - diag * vnx, p[1] - diag * vny], [p[0] + diag * vnx, p[1] + diag * vny]];

    const segments = [
      [this.path[0], this.path[1]],
      [this.path[1], this.path[2]],
      [this.path[2], this.path[3]],
      [this.path[3], this.path[0]],
    ];


    const furthest = _.chain(segments)
      .map((seg) =>
        checkIntersection(
          segmentA[0][0], segmentA[0][1],
          segmentA[1][0], segmentA[1][1],
          seg[0][0], seg[0][1],
          seg[1][0], seg[1][1]
        )
      )
      .filter(check => check.type === 'intersecting')
      .map('point')
      .maxBy(pc => (pc.x - p[0]) * (pc.x - p[0]) + (pc.y - p[1]) * (pc.y - p[1]))
      .value();
    return [furthest.x, furthest.y];
  }
}
