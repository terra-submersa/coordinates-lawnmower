import { Projection } from 'ol/proj';
import { LineString, Point } from 'ol/geom';
import type { Coordinate } from 'openlayers';

const projGeographic = new Projection({code: 'EPSG:4326'});
const projMercator = new Projection({code: 'EPSG:900913'});

function toMercator(point: Coordinate) {
  return new Point(point).transform(projGeographic, projMercator).getExtent();
}

export function distance(p1: Coordinate, p2: Coordinate): number {
  const line = new LineString([toMercator(p1), toMercator(p2)]);
  return line.getLength();
}

