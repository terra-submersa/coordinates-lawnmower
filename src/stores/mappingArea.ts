import { defineStore } from 'pinia';
import type MappingPerimeter from '@/models/mappingPerimeter';
import type { Coordinate } from 'openlayers';
import * as _ from 'lodash';

export const useMappingAreaStore = defineStore({
  id: 'mappingArea',
  state: () => ({
    // the mapping are perimeter
    perimeter: null as (MappingPerimeter | null),
  }),
  getters: {
    height: (state) => state.perimeter?.height() || 0,
    width: (state) => state.perimeter?.width() || 0,
    area: (state) => (state.perimeter?.height() || 0) * (state.perimeter?.width() || 0),
    cornerNW: (state) => {
      if (!state.perimeter) {
        return [undefined, undefined];
      }
      return [
        _.chain(state.perimeter.path).map(c => c[0]).min().round(6).value(),
        _.chain(state.perimeter.path).map(c => c[1]).max().round(6).value()
      ];
    },
    cornerSE: (state) => {
      if (!state.perimeter) {
        return [undefined, undefined];
      }
      return [
        _.chain(state.perimeter.path).map(c => c[0]).max().round(6).value(),
        _.chain(state.perimeter.path).map(c => c[1]).min().round(6).value()
      ];
    },
  }
});
