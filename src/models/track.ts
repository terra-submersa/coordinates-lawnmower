import * as _ from 'lodash';
import { Projection } from 'ol/proj';
import { LineString, Point } from 'ol/geom';
import type { Coordinate } from 'openlayers';
import Vector from '@/models/vector';
import type MappingPerimeter from '@/models/mappingPerimeter';
import { toLonLat, transform } from 'ol/proj';
import proj4 from 'proj4';
import haversine from 'haversine-distance';


const projGeographic = new Projection({code: 'EPSG:4326'});
const projMercator900913 = new Projection({code: 'EPSG:900913'});
proj4.defs('EPSG:32634', '+proj=utm +zone=34 +datum=WGS84 +units=m +no_defs');
proj4.defs('EPSG:4326', '+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees');
_.times(60, (i) => {
  const band = i + 1;
  proj4.defs(`UTM:${band}N`, `+proj=utm +zone=${band} +datum=WGS84 +units=m +no_defs +crs`);
  proj4.defs(`UTM:${band}S`, `+proj=utm +zone=${band} +south +datum=WGS84 +units=m +no_defs +crs`);
});


function toMercator900913(point: Coordinate) {
  return new Point(point).transform(projGeographic, projMercator900913).getExtent();
}

export function toLonLatCoords(utmCoords: Coordinate, sourceRef: string): Coordinate {
  return proj4(sourceRef, 'EPSG:4326', utmCoords) as Coordinate;
}

export function toUTMCoords(coords: Coordinate): { coords: Coordinate, zone: string } {
  const utmBand = Math.floor(((coords[0] + 180) / 6) % 60) + 1;
  const utmZone = `${utmBand}` + ((coords[1] > 0) ? 'N' : 'S');

  return {
    coords: proj4('EPSG:4326', `UTM:${utmZone}`, coords) as Coordinate,
    zone: utmZone
  };
}

export function distance(p1: Coordinate, p2: Coordinate): number {
  return haversine(
    {latitude: p1[1], longitude: p1[0]},
    {latitude: p2[1], longitude: p2[0]},
  );
}

export function pathLength(path: Coordinate[]): number {
  if (path.length === 0) {
    return 0;
  }
  let d = 0;
  let dPrev = path[0];
  for (let i = 1; i < path.length; i++) {
    d += distance(dPrev, path[i]);
    dPrev = path[i];
  }
  return d;
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
