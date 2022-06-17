import { defineStore } from 'pinia';
import { loadCameraLibrary } from '@/models/camera';

const cameras = loadCameraLibrary();
export const useAcquisitionStore = defineStore({
  id: 'acquisition',
  state: () => ({
    cameraLibrary: cameras,
    selectedCamera: cameras[0],
    selectedViewMode: cameras[0].viewModes[0],
    distanceToGround: 2.5,
    frontOverlapPercent: 80,
    sideOverlapPercent: 70,
  }),
  getters: {
    frontShotDistance: (state) =>
      state.selectedViewMode.projectedArea(state.distanceToGround).height * (1 - state.frontOverlapPercent / 100.0),
    sideShotDistance: (state) =>
      state.selectedViewMode.projectedArea(state.distanceToGround).width * (1 - state.sideOverlapPercent / 100.0)
  },
  actions: {},
});
