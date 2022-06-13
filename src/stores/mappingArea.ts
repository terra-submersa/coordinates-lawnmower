import { defineStore } from 'pinia';
import type MappingPerimeter from '@/models/mappingPerimeter';
import type { Coordinate } from 'openlayers';

export const useMappingAreaStore = defineStore({
  id: 'mappingArea',
  state: () => ({
    // the mapping are perimeter
    perimeter: null as (MappingPerimeter | null),
    // the list of points to be followed
    trajectory: [] as Coordinate[],
    // the maximum distance between two consecutive bands
    bandWidth: 10,
    // the maximum distance between two consecutive points
    pointLeap: 5
  }),
  getters: {},
  actions: {},
});
