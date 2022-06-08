import { assert, expect, test } from 'vitest';
import MappingPerimeter from '@/models/mappingPerimeter';
import type { Coordinate } from 'openlayers';


const perimeter = new MappingPerimeter([
  [23.132780264484538, 37.42725785827072],
  [23.13403170227313, 37.42725785827072],
  [23.13403170227313, 37.428833421485024],
  [23.132780264484538, 37.428833421485024]
]);

test('width', () => {
  const got = perimeter.width();

  assert.approximately(got, 139.309, 0.001);
});

test('height', () => {
  const got = perimeter.height();

  assert.approximately(got, 220.862, 0.001);
});

test('diagonalLength', () => {
  const got = perimeter.diagonalLength();

  assert.approximately(got, 261.127, 0.001);
});

test('intersectOtherSide - horizontal middle', () => {
  const lat0 = (perimeter.path[0][1] + perimeter.path[2][1]) / 2;
  const p0: Coordinate = [perimeter.path[1][0], lat0];

  const got = perimeter.intersectOtherSide(p0, 0.5, 0);

  const expected = [perimeter.path[0][0], lat0];
  assert.approximately(got[0], expected[0], 0.00000001);
  assert.approximately(got[1], expected[1], 0.00000001);
});

test('intersectOtherSide - horizontal corner', () => {
  const lat0 = perimeter.path[0][1];
  const p0: Coordinate = [perimeter.path[1][0], lat0];

  const got = perimeter.intersectOtherSide(p0, 0.5, 0);

  const expected = [perimeter.path[0][0], lat0];
  assert.approximately(got[0], expected[0], 0.00000001);
  assert.approximately(got[1], expected[1], 0.00000001);
});


test('intersectOtherSide - vertical middle', () => {
  const lon0 = (perimeter.path[0][0] + perimeter.path[1][0]) / 2;
  const p0: Coordinate = [lon0, perimeter.path[1][1]];

  const got = perimeter.intersectOtherSide(p0, 0, 2.0);

  const expected = [lon0, perimeter.path[2][1]];
  assert.approximately(got[0], expected[0], 0.00000001);
  assert.approximately(got[1], expected[1], 0.00000001);
});
