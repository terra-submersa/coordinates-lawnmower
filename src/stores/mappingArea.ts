import { defineStore } from "pinia";
import type MappingPerimeter from '@/models/mappingPerimeter';

export const useMappingAreaStore = defineStore({
  id: "mappingArea",
  state: () => ({
    perimeter: null as (MappingPerimeter | null)
  }),
  getters: {
    area: (state) => state.perimeter?.area(),
  },
  actions: {
  },
});
