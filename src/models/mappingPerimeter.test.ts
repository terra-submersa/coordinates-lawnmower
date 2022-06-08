import { assert, expect, test } from 'vitest'
import MappingPerimeter from '@/models/mappingPerimeter';
import Coordinates from '@/models/Coordinates';

test('area', ()=>{
  const perimeter = new MappingPerimeter(new Coordinates(0,0),5,7);

  const got = perimeter.area();

  assert.equal(got, 35);
})
