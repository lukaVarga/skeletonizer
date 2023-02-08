import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { SchemaItem } from '../schema-item.model';
import { LOREM_IPSUM } from '../../constants';
import { DateHelpers } from '../../helpers';

describe('SchemaItem', () => {
  describe('value', () => {
    it('returns the inner value of the schema item', () => {
      expect(new SchemaItem().identical(10).value).toBe(10);
    });
  });

  describe('words', () => {
    let schemaItem: SchemaItem<string>;

    it('generates the desired number of words from lorem ipsum const', () => {
      schemaItem = new SchemaItem().words(7);

      expect(schemaItem.value).toBeTypeOf('string');
      expect(schemaItem.value.split(' ').length).toBe(7);

      schemaItem.words(3);
      expect(schemaItem.value.split(' ').length).toBe(3);

      schemaItem.words(50);
      expect(schemaItem.value.split(' ').length).toBe(50);

      expect(schemaItem.value.split(' ').every((word: string) => LOREM_IPSUM.includes(word))).toBe(true);
    });
  });

  describe('paragraphs', () => {
    let schemaItem: SchemaItem<string>;

    it('generates the desired number of paragraphs, each with 40 - 60 words from lorem ipsum const', () => {
      schemaItem = new SchemaItem().paragraphs(5);

      expect(schemaItem.value).toBeTypeOf('string');
      expect(schemaItem.value.split('\n').length).toBe(5);

      schemaItem.paragraphs(3);
      expect(schemaItem.value.split('\n').length).toBe(3);

      schemaItem.paragraphs(5000);
      expect(schemaItem.value.split('\n').length).toBe(5000);

      const paragraphArray: string[] = schemaItem.value.split('\n');
      const wordsArray: string[] = paragraphArray.join(' ').split(' ');

      expect(wordsArray.every((word: string) => LOREM_IPSUM.includes(word))).toBe(true);
      expect(paragraphArray.every((paragraph: string) => paragraph.split(' ').length <= 60)).toBe(true);
      expect(paragraphArray.every((paragraph: string) => paragraph.split(' ').length >= 40)).toBe(true);
    });
  });

  describe('number', () => {
    let schemaItem: SchemaItem<number>;

    beforeEach(() => {
      schemaItem = new SchemaItem().number();
    });

    it('generates a random number between 0 and 1000 by default', () => {
      Array.from({ length: 2000 }).forEach(() => {
        schemaItem.number();

        expect(schemaItem.value).toBeGreaterThanOrEqual(0);
        expect(schemaItem.value).toBeLessThanOrEqual(1000);
      });
    });

    it('generates a random number between min and max provided values', () => {
      Array.from({ length: 2000 }).forEach(() => {
        schemaItem.number(50, 100);

        expect(schemaItem.value).toBeGreaterThanOrEqual(50);
        expect(schemaItem.value).toBeLessThanOrEqual(100);
      });
    });

    it('generates a random number between min and max provided values when both are negative', () => {
      Array.from({ length: 2000 }).forEach(() => {
        schemaItem.number(-500, -100);

        expect(schemaItem.value).toBeGreaterThanOrEqual(-500);
        expect(schemaItem.value).toBeLessThanOrEqual(-100);
      });
    });

    it('generates a random number between min and max provided values when min is negative and max is positive', () => {
      schemaItem = new SchemaItem<number>().number(-100, 100);

      Array.from({ length: 2000 }).forEach(() => {
        schemaItem.number(-100, 100);

        expect(schemaItem.value).toBeGreaterThanOrEqual(-100);
        expect(schemaItem.value).toBeLessThanOrEqual(100);
      });
    });
  });

  describe('multiply', () => {
    it('multiplies the value by multiplier', () => {
      expect(new SchemaItem().identical(5).multiply(7).value).toBe(35);
      expect(new SchemaItem().number(10, 10).multiply(8).value).toBe(80);
    });
  });

  describe('date', () => {
    let schemaItem: SchemaItem<Date>;
    const epochTo2100Diff: number = new Date('2100-01-01').getTime();
    const epoch: number = 0;
    let now: Date;
    let nowSinceEpoch: number;

    beforeEach(() => {
      now = new Date();
      nowSinceEpoch = now.getTime();
      vi.useFakeTimers();
      vi.setSystemTime(now);

      schemaItem = new SchemaItem().date();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('generates a random date between Jan 1st, 1970 and Jan 1st, 2100 by default', () => {
      Array.from({ length: 2000 }).forEach(() => {
        schemaItem.date();

        expect(schemaItem.value.getTime()).toBeGreaterThanOrEqual(epoch);
        expect(schemaItem.value.getTime()).toBeLessThanOrEqual(epochTo2100Diff);
      });
    });

    describe('isFuture is set', () => {
      it('generates a random date between now and Jan 1st, 2100', () => {
        Array.from({ length: 2000 }).forEach(() => {
          schemaItem.date({ isFuture: true });

          expect(schemaItem.value.getTime()).toBeGreaterThanOrEqual(nowSinceEpoch);
          expect(schemaItem.value.getTime()).toBeLessThanOrEqual(epochTo2100Diff);
        });
      });

      it('generates a random date between now and max date', () => {
        const maxDateSinceEpoch: number = nowSinceEpoch + DateHelpers.daysInMs(100);
        const maxDate: Date = new Date(maxDateSinceEpoch);

        Array.from({ length: 2000 }).forEach(() => {
          schemaItem.date({ isFuture: true, max: maxDate });

          expect(schemaItem.value.getTime()).toBeGreaterThanOrEqual(nowSinceEpoch);
          expect(schemaItem.value.getTime()).toBeLessThanOrEqual(maxDateSinceEpoch);
        });
      });
    });

    describe('isPast is set', () => {
      it('generates a random date between Jan 1st, 1970 and now', () => {
        Array.from({ length: 2000 }).forEach(() => {
          schemaItem.date({ isPast: true });

          expect(schemaItem.value.getTime()).toBeGreaterThanOrEqual(epoch);
          expect(schemaItem.value.getTime()).toBeLessThanOrEqual(nowSinceEpoch);
        });
      });

      it('generates a random date between min and now', () => {
        const minDateSinceEpoch: number = nowSinceEpoch - DateHelpers.daysInMs(100);
        const minDate: Date = new Date(minDateSinceEpoch);

        Array.from({ length: 2000 }).forEach(() => {
          schemaItem.date({ isPast: true, min: minDate });

          expect(schemaItem.value.getTime()).toBeGreaterThanOrEqual(minDateSinceEpoch);
          expect(schemaItem.value.getTime()).toBeLessThanOrEqual(nowSinceEpoch);
        });
      });
    });

    describe('min and max are set', () => {
      it('generates a random date between min and max', () => {
        const minDateSinceEpoch: number = nowSinceEpoch - DateHelpers.daysInMs(100);
        const minDate: Date = new Date(minDateSinceEpoch);
        const maxDateSinceEpoch: number = nowSinceEpoch + DateHelpers.daysInMs(150);
        const maxDate: Date = new Date(maxDateSinceEpoch);

        Array.from({ length: 2000 }).forEach(() => {
          schemaItem.date({ min: minDate, max: maxDate });

          expect(schemaItem.value.getTime()).toBeGreaterThanOrEqual(minDateSinceEpoch);
          expect(schemaItem.value.getTime()).toBeLessThanOrEqual(maxDateSinceEpoch);
        });
      });
    });
  });

  describe('uuid', () => {
    it('always returns an incrementing number', () => {
      const initialId: number = new SchemaItem().uuid().value;

      Array.from({ length: 2000 }).forEach(() => {
        new SchemaItem();
      });

      Array.from({ length: 2000 }).forEach((_: unknown, i: number) => {
        expect(new SchemaItem().uuid().value).toBe(i + initialId + 1);
      });
    });
  });

  describe('boolean', () => {
    it('generates a random true / false value', () => {
      const bools: boolean[] = Array.from({ length: 2000 }, () => new SchemaItem().boolean())
        .map((item: SchemaItem<boolean>) => item.value);

      expect(bools.some((bool: unknown) => bool === true)).toBe(true);
      expect(bools.some((bool: unknown) => bool === false)).toBe(true);

      expect(bools.every((bool: unknown) => bool === true || bool === false)).toBe(true);
    });
  });

  describe.todo('symbol', () => {});
  describe.todo('identical', () => {});
});
