import { describe, expect, test } from 'vitest';
import { iTag, nbDigits } from '@/services/trajectory-exporter';


describe('trajectory-exporter', () => {
  test.each([
    [1, 1],
    [9, 1],
    [10, 2],
    [11, 2],
    [99, 2],
    [100, 3],
  ])('nbDigits(%i) -> %i', (len, expected) => {
    expect(nbDigits(len)).toBe(expected);
  });

  test.each([
    [1, 2, '2'],
    [9, 10, '10'],
    [0, 10, '01'],
    [11, 100, '012'],
    [99, 100, '100'],
    [0, 1200, '0001'],
    [100, 1200, '0101'],
    [999, 1200, '1000'],
  ])('iTag(%i, i%) -> %i', (i: number, len: number, expected: string) => {
    expect(iTag(i, len)).toBe(expected);
  });
});
