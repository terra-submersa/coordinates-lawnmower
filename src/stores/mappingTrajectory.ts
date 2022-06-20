import { defineStore } from 'pinia';
import type MappingPerimeter from '@/models/mappingPerimeter';
import type { Coordinate } from 'openlayers';
import { lawnMowerTrajectory } from '@/models/track';
import { useMappingAreaStore } from '@/stores/mappingArea';
import { useAcquisitionStore } from '@/stores/acquisition';

export const useTrajectoryStore = defineStore({
  id: 'mappingTrajectory',
  state: () => ({
    // the list of points to be followed
    trajectory: [] as Coordinate[],
    // the maximum distance between two consecutive points
    pointLeap: 5
  }),
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
        this.pointLeap
      );
    }
  },
});
