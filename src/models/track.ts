import * as _ from 'lodash';

import { Projection } from 'ol/proj';
import { LineString, Point } from 'ol/geom';
import type { Coordinate } from 'openlayers';
import type MappingPerimeter from '@/models/mappingPerimeter';
import Vector from '@/models/vector';

const projGeographic = new Projection({code: 'EPSG:4326'});
const projMercator = new Projection({code: 'EPSG:900913'});

function toMercator(point: Coordinate) {
  return new Point(point).transform(projGeographic, projMercator).getExtent();
}

export function distance(p1: Coordinate, p2: Coordinate): number {
  const line = new LineString([toMercator(p1), toMercator(p2)]);
  return line.getLength();
}

/**
 * Build a list of evenly distributed points between p1 and p2, with a max distance
 * @param p1
 * @param p2
 * @param maxDistance
 */
export function dashing(p1: Coordinate, p2: Coordinate, maxDistance: number): Coordinate[] {
  const nbPoints = Math.ceil(distance(p1, p2) / maxDistance);
  const points = _.range(0, nbPoints).map((i) => [
    p1[0] + i / nbPoints * (p2[0] - p1[0]),
    p1[1] + i / nbPoints * (p2[1] - p1[1])
  ] as Coordinate);
  points.push(p2);
  return points;
}

export function lawnMowerTrajectory(perimeter: MappingPerimeter,
                                    maxDistanceBetweenBands: number,
                                    maxDistanceBetweenPoints: number
): Coordinate[] {
  const vBand = new Vector(perimeter.path[0], perimeter.path[3]);
  const bandStarts = dashing(perimeter.path[0], perimeter.path[1], maxDistanceBetweenBands);
  const bandEnds = bandStarts.map(s => perimeter.intersectOtherSide(s, vBand));

  const points: Coordinate[] = [];
  for (let iBand = 0; iBand < bandStarts.length; iBand++) {
    let bandDash;
    if (iBand % 2 === 0) {
      bandDash = dashing(bandStarts[iBand], bandEnds[iBand], maxDistanceBetweenPoints);
    } else {
      bandDash = dashing(bandEnds[iBand], bandStarts[iBand], maxDistanceBetweenPoints);
    }
    bandDash.forEach(p => points.push(p));
  }
  return points;
}
