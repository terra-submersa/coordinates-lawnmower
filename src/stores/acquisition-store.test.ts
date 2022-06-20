import { it, assert, test, describe, beforeEach } from 'vitest';
import { Camera, CameraViewMode, loadCameraLibrary } from '@/models/camera';
import { createPinia, setActivePinia } from 'pinia';
import { useAcquisitionStore } from '@/stores/acquisition';

const cameraLib = loadCameraLibrary();

describe('acquisition store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('default defined', () => {
    const store = useAcquisitionStore();
    const camera = store.selectedCamera;

    assert.isNotNull(camera);
  });

  it('shot distances', () => {
    const viewMode = new CameraViewMode({
      name: 'Linear (zoom=1.0x) 4:3 portrait',
      vertFov: 70,
      horizFov: 86,
    });
    const store = useAcquisitionStore();
    store.selectedViewMode = viewMode;
    store.frontOverlapPercent = 70;
    store.sideOverlapPercent = 90;
    store.distanceToGround=0.75;


    assert.approximately(store.frontShotDistance,0.315, 0.001);
    assert.approximately(store.sideShotDistance,0.1399, 0.001);

  });

});
