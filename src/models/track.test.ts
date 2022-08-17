import { assert, describe, test, it } from 'vitest';
import MappingPerimeter from '@/models/mappingPerimeter';
import { dashing, distance, lawnMowerTrajectory, toLonLatCoords, toUTMCoords } from '@/models/track';
import type { Coordinate } from 'openlayers';
import proj4 from 'proj4';


describe('track', () => {

  const perimeter = new MappingPerimeter([
    [23.132780264484538, 37.42725785827072],
    [23.13403170227313, 37.42725785827072],
    [23.13403170227313, 37.428833421485024],
    [23.132780264484538, 37.428833421485024]
  ]);

  it('dashing', () => {
    const got = dashing(perimeter.path[0], perimeter.path[2], 10);

    assert.equal(got.length, 28);
    assert.approximately(distance(got[5], got[6]), 9.671, 0.001);
  });

  it('lawnMowerTrajectory', () => {
    const got = lawnMowerTrajectory(perimeter, 20, 10, 0);

    assert.equal(got.length, 192);
  });

  describe('conversions', () => {
    describe('toLonLatCoords', () => {
      // data from Garmin 66sr showing in two different system

      const utmCoords = [696520, 4138380] as Coordinate;
      const utmZone = '34N';
      const geoCoords = [23 + 13.1628 / 60, 37 + 22.2814 / 60] as Coordinate;


      it('UTM 34N-1', () => {
        const got = toLonLatCoords(utmCoords, '32634');
        assert.approximately(geoCoords[0], got[0], 0.0001);
        assert.approximately(geoCoords[1], got[1], 0.0001);
      });

      describe('toUTMCoords', () => {
        it('lamba', () => {
          const {coords, zone} = toUTMCoords(geoCoords);
          assert.approximately(utmCoords[0], coords[0], 0.5);
          assert.approximately(utmCoords[1], coords[1], 0.5);
          assert.equal('34N', zone);
        });
      });
    });
  });
});

