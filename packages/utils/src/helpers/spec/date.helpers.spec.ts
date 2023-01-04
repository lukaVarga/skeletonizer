import { describe, expect, it } from 'vitest';
import { DateHelpers } from '../index';

describe('DateHelpers', () => {
  describe('daysInMs', () => {
    it('should return the correct number of milliseconds for the number of days', () => {
      expect(DateHelpers.daysInMs(5)).toEqual(432000000);
    });
  });

  describe('dateBetween', () => {
    const testCases: Array<[Date, Date]> = [
      [new Date('2018-01-14'), new Date('2020-09-13')],
      [new Date('2025-11-16'), new Date('2028-03-12')],
      [new Date('2024-02-29'), new Date('2024-03-01')],
      [new Date('2023-01-28T22:27:14.358Z'), new Date('2023-01-28T22:27:24.358Z')],
      [new Date('1900-02-07'), new Date('1907-03-23')],
      [new Date('1900-08-08'), new Date('2220-09-13')],
    ];

    testCases.forEach(([min, max]: [Date, Date]) => {
      it(`generates a date between ${min.toISOString()} and ${max.toISOString()}`, () => {
        const date: Date = DateHelpers.dateBetween(min, max);

        expect(date.getTime()).toBeLessThan(max.getTime());
        expect(date.getTime()).toBeGreaterThan(min.getTime());
      });
    });
  });
});
