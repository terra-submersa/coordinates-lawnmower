import { assert, test } from 'vitest';
import MappingPerimeter from '@/models/mappingPerimeter';
import { dashing, distance, lawnMowerTrajectory } from '@/models/track';


const perimeter = new MappingPerimeter([
  [23.132780264484538, 37.42725785827072],
  [23.13403170227313, 37.42725785827072],
  [23.13403170227313, 37.428833421485024],
  [23.132780264484538, 37.428833421485024]
]);


test('dashing', ()=>{
  const got = dashing(perimeter.path[0], perimeter.path[2], 10);

  assert.equal(got.length, 28);
  assert.approximately(distance(got[5], got[6]), 9.671, 0.001)
})

test('lawnMowerTrajectory', ()=>{
  const got = lawnMowerTrajectory(perimeter, 20, 10);

  assert.equal(got.length, 192)
})
