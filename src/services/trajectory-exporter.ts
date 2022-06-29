import type { Coordinate } from 'openlayers';

export function nbDigits(len: number): number {
  return Math.floor(Math.log(len) / Math.log(10)) + 1;
}

export function iTag(i: number, len: number): string {
  const s = (i + 1).toString();
  return ('0'.repeat(nbDigits(len) - s.length)) + s;
}

export function trajectoryExport(namePrefix: string, trajectory: Coordinate[]): string {
  let buffer = 'name,longitude,latitude,elevation\n';

  const n = trajectory.length;
  trajectory.forEach((c, i) => buffer += `${namePrefix}${iTag(i, n)},${c[0]},${c[1]},0\n`);
  return buffer;
}
