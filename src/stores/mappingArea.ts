import { defineStore } from 'pinia';
import type MappingPerimeter from '@/models/mappingPerimeter';
import type { Coordinate } from 'openlayers';

export const useMappingAreaStore = defineStore({
  id: 'mappingArea',
  state: () => ({
    // the mapping are perimeter
    perimeter: null as (MappingPerimeter | null),
  }),
  getters: {},
  actions: {},
});
