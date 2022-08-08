import type { Coordinate } from 'openlayers';
import { buildGPX, GarminBuilder } from 'gpx-builder';
import { Route } from 'gpx-builder/dist/builder/BaseBuilder/models';
const { Point } = GarminBuilder.MODELS;

export function nbDigits(len: number): number {
  return Math.floor(Math.log(len) / Math.log(10)) + 1;
}

export function iTag(i: number, len: number): string {
  const s = (i + 1).toString();
  return ('0'.repeat(nbDigits(len) - s.length)) + s;
}

export function trajectoryExportEmlidCsv(namePrefix: string, trajectory: Coordinate[]): string {
  let buffer = 'name,longitude,latitude,elevation\n';

  const n = trajectory.length;
  trajectory.forEach((c, i) => buffer += `${namePrefix}${iTag(i, n)},${c[0]},${c[1]},0\n`);
  return buffer;
}

export function trajectoryExportGpx(namePrefix: string, trajectory: Coordinate[]): string {
  const points = trajectory.map( c => new Point(c[1], c[0]))
  const route = new Route({rtept: points})
  const gpxData = new GarminBuilder();
  gpxData.setRoutes([route])

  return buildGPX(gpxData.toObject()).toString()
}
