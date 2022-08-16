import { defineStore } from 'pinia';
import { Camera, loadCameraLibrary } from '@/models/camera';

const cameras = loadCameraLibrary();
export const useAcquisitionStore = defineStore({
  id: 'acquisition',
  state: () => ({
    cameraLibrary: cameras,
    selectedCamera: cameras[0],
    selectedViewMode: cameras[0].viewModes[1],
    distanceToGround: 2.5,
    frontOverlapPercent: 80,
    sideOverlapPercent: 70,
    shotTimeInterval: 1
  }),
  getters: {
    frontShotDistance: (state) =>
      state.selectedViewMode.projectedArea(state.distanceToGround).height * (1 - state.frontOverlapPercent / 100.0),
    sideShotDistance: (state) =>
      state.selectedViewMode.projectedArea(state.distanceToGround).width * (1 - state.sideOverlapPercent / 100.0),
    swimmingSpeed: (state) =>
      state.selectedViewMode.projectedArea(state.distanceToGround).height * (1 - state.frontOverlapPercent / 100.0) /
      state.shotTimeInterval
  },
  actions: {
    setCamera(camera: Camera) {
      this.selectedCamera = camera;
      this.selectedViewMode = camera.viewModes[0];
    }
  },
});
