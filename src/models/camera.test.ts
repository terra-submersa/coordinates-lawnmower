import { assert, test } from 'vitest';
import { Camera, CameraViewMode, loadCameraLibrary } from '@/models/camera';

const cameraLib = loadCameraLibrary();


test('loadCameraLibrary - count cameras', () => {
  assert.equal(cameraLib.length, 1);
});

test('loadCameraLibrary - first camera', () => {
  const camera = cameraLib[0];
  assert.isTrue(camera instanceof Camera);

  assert.equal(camera.viewModes.length, 3);
  assert.isTrue(camera.viewModes[0] instanceof CameraViewMode);
});

test('projectedArea', () => {
  const viewMode = new CameraViewMode({
    name: 'Linear (zoom=1.0x) 4:3 portrait',
    vertFov: 70,
    horizFov: 86,
  });

  const got = viewMode.projectedArea(0.75);

  assert.approximately(got.width, 1.399,0.01);
  assert.approximately(got.height, 1.042, 0.01);
});
