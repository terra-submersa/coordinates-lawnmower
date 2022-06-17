export class CameraViewMode {
  readonly name: string;
  // field of view, in degrees
  readonly horizFov: number;
  readonly vertFov: number;

  constructor(params: { name: string, horizFov: number, vertFov: number }) {
    this.name = params.name;
    this.horizFov = params.horizFov;
    this.vertFov = params.vertFov;
  }

  /**
   * computes the area covered by the given FOV at the given distance
   * @param atDistance distance in meters (or in fact, in the same unit as what you expect in return)
   */
  projectedArea(atDistance: number): { height: number, width: number } {
    return {
      height: this.projectedLength(this.vertFov, atDistance),
      width: this.projectedLength(this.horizFov, atDistance)
    };
  }

  projectedLength(fov: number, atDistance: number): number {
    return Math.tan(fov / 2 / 180 * Math.PI) * atDistance * 2;
  }
}

export class Camera {
  readonly name: string;
  readonly viewModes: CameraViewMode[];

  constructor(params: { name: string, viewModes: any[] }) {
    this.name = params.name;
    this.viewModes = params.viewModes.map(vm => new CameraViewMode(vm));
  }
}

export function loadCameraLibrary(): Camera[] {
  return cameraLibrary.map(c => new Camera(c));
}

export const cameraLibrary = [
  {
    name: 'Go Pro Hero 8',
    viewModes: [
      {
        name: 'Narrow 4:3 portrait',
        vertFov: 53.7,
        horizFov: 68,
      },
      {
        name: 'Linear (zoom=1.0x) 4:3 portrait',
        vertFov: 70,
        horizFov: 86,
      },
      {
        name: 'Wide 4:3 portrait',
        vertFov: 94.4,
        horizFov: 122.6,
      },
    ]
  }
];
