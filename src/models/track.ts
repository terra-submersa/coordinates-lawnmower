import * as _ from 'lodash';
import { Projection } from 'ol/proj';
import { LineString, Point } from 'ol/geom';
import type { Coordinate } from 'openlayers';
import Vector from '@/models/vector';
import type MappingPerimeter from '@/models/mappingPerimeter';

const projGeographic = new Projection({code: 'EPSG:4326'});
const projMercator = new Projection({code: 'EPSG:900913'});

function toMercator(point: Coordinate) {
  return new Point(point).transform(projGeographic, projMercator).getExtent();
}

export function distance(p1: Coordinate, p2: Coordinate): number {
  const line = new LineString([toMercator(p1), toMercator(p2)]);
  return line.getLength();
}

export function pathLength(path: Coordinate[]): number {
  const line = new LineString(path.map(toMercator));
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
                                    maxDistanceBetweenPoints: number,
                                    angle: number
): Coordinate[] {
  let bandStarts: Coordinate[];
  let bandEnds: Coordinate[];
  if (angle === 0) {
    const vBand = new Vector(perimeter.path[0], perimeter.path[3]);
    bandStarts = dashing(perimeter.path[0], perimeter.path[1], maxDistanceBetweenBands);
    bandEnds = bandStarts.map(s => perimeter.intersectOtherSide(s, vBand));
  } else if (angle === 90) {
    const vBand = new Vector(perimeter.path[0], perimeter.path[1]);
    bandStarts = dashing(perimeter.path[0], perimeter.path[3], maxDistanceBetweenBands);
    bandEnds = bandStarts.map(s => perimeter.intersectOtherSide(s, vBand));
  } else {
    const alpha = angle / 180 * Math.PI;
    const vBand = new Vector(Math.sin(alpha), Math.cos(alpha));
    const dHoriz = maxDistanceBetweenBands / Math.cos(alpha);
    const horizBandStarts = dashing(perimeter.path[0], perimeter.path[1], dHoriz);
    const horizBandEnds = horizBandStarts.map(s => perimeter.intersectOtherSide(s, vBand));

    const dVert = maxDistanceBetweenBands / Math.sin(alpha);
    const vertBandStart = _.chain(dashing(perimeter.path[0], perimeter.path[3], dVert))
      .drop(1)
      .reverse()
      .value();
    const vertBandEnds = vertBandStart.map(s => perimeter.intersectOtherSide(s, vBand));


    bandStarts = [...vertBandStart, ...horizBandStarts];
    bandEnds = [...vertBandEnds, ...horizBandEnds];
  }
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
