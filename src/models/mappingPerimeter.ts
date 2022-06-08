import type { LatLng } from 'leaflet';

export default class MappingPerimeter {
  readonly path: LatLng[];


  constructor(path: LatLng[]) {
    this.path = [...path];
  }

  area(): number {
    return 42;
  }
}
