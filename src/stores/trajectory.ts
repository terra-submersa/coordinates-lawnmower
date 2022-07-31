import { defineStore } from 'pinia';
import type { Coordinate } from 'openlayers';
import { lawnMowerTrajectory, pathLength } from '@/models/track';
import { useMappingAreaStore } from '@/stores/mappingArea';
import { useAcquisitionStore } from '@/stores/acquisition';

export const useTrajectoryStore = defineStore({
  id: 'mappingTrajectory',
  state: () => ({
    // the list of points to be followed
    trajectory: [] as Coordinate[],
    // the maximum distance between two consecutive points
    pointLeap: 5,
    angle: 0,
    pointPrefix: 'P '
  }),
  getters: {
    distance: (state) => pathLength(state.trajectory),
    duration: (state) => {
      const acquisitionStore = useAcquisitionStore();
      return pathLength(state.trajectory) / acquisitionStore.swimmingSpeed;
    },
    routeFilename: (state) => {
      return 'swimming_route-' + (new Date().toISOString()) + '-' + state.angle + '_deg';
    },
  },
  actions: {
    updateTrajectory() {
      const mappingAreaStore = useMappingAreaStore();
      const acquisitionStore = useAcquisitionStore();

      if (mappingAreaStore.perimeter === null) {
        this.trajectory = [];
        return;
      }
      this.trajectory = lawnMowerTrajectory(
        mappingAreaStore.perimeter!!,
        acquisitionStore.sideShotDistance,
        this.pointLeap,
        this.angle
      );
    }
  },
});
