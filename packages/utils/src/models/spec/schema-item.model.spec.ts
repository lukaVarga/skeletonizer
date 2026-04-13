import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { SchemaItem } from '../schema-item.model';
import { LOREM_IPSUM } from '../../constants';
import { DateHelpers } from '../../helpers';
import { TSchemaCountryCodeIso2, TSchemaCountryCodeIso3, TSchemaCurrencyCode } from '../schema-item.model.types';

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
      Array.from({ length: 2000 }).forEach(() => {
        schemaItem = new SchemaItem<number>().number(-100, 100);

        expect(schemaItem.value).toBeGreaterThanOrEqual(-100);
        expect(schemaItem.value).toBeLessThanOrEqual(100);
      });
    });
  });

  describe('float', () => {
    let schemaItem: SchemaItem<number>;

    it('generates a random float between 0 and 1000 by default', () => {
      Array.from({ length: 2000 }).forEach(() => {
        schemaItem = new SchemaItem().float();

        expect(schemaItem.value).toBeGreaterThanOrEqual(0);
        expect(schemaItem.value).toBeLessThanOrEqual(1000);
        expect(schemaItem.value).toBeGreaterThan(Math.floor(schemaItem.value));
      });
    });

    it('generates a random float between min and max provided values', () => {
      Array.from({ length: 2000 }).forEach(() => {
        schemaItem = new SchemaItem().float(50, 100);

        expect(schemaItem.value).toBeGreaterThanOrEqual(50);
        expect(schemaItem.value).toBeLessThanOrEqual(100);
      });
    });

    it('generates a random float between min and max provided values when both are negative', () => {
      Array.from({ length: 2000 }).forEach(() => {
        schemaItem = new SchemaItem().float(-500, -100);

        expect(schemaItem.value).toBeGreaterThanOrEqual(-500);
        expect(schemaItem.value).toBeLessThanOrEqual(-100);
      });
    });

    it('generates a random float between min and max provided values when min is negative and max is positive', () => {
      Array.from({ length: 2000 }).forEach(() => {
        schemaItem = new SchemaItem().float(-100, 100);

        expect(schemaItem.value).toBeGreaterThanOrEqual(-100);
        expect(schemaItem.value).toBeLessThanOrEqual(100);
      });
    });

    it('turns an integer into a float', () => {
      schemaItem = new SchemaItem<number>().identical(5).float();

      expect(schemaItem.value).toBeGreaterThan(5);
      expect(schemaItem.value).toBeLessThan(6);
    });
  });

  describe('currency', () => {
    it('uses locale and currency to format the number', () => {
      expect(new SchemaItem().identical(5_000).currency({ locale: 'en-US', currency: 'USD' }).value).toEqual('$5,000.00');

      expect(new SchemaItem().identical('15289').currency({
        locale: 'de-DE',
        currency: 'EUR',
        options: { currencyDisplay: 'code', minimumFractionDigits: 2 },
      }).value).toEqual('15.289,00\u00A0EUR');
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

  describe('stringify', () => {
    it('converts a number to string', () => {
      expect(new SchemaItem().identical(42).stringify().value).toBe('42');
      expect(new SchemaItem().number(10, 10).stringify().value).toBe('10');
    });

    it('converts a boolean to string', () => {
      expect(new SchemaItem().identical(true).stringify().value).toBe('true');
      expect(new SchemaItem().identical(false).stringify().value).toBe('false');
    });

    it('converts a symbol to string', () => {
      expect(new SchemaItem().symbol('test').stringify().value).toBe('Symbol(test)');
    });
  });

  describe('format', () => {
    it('formats a date with yyyy-MM-dd pattern', () => {
      const date: Date = new Date('2026-03-15T09:05:30.000Z');

      expect(new SchemaItem().date({ min: date, max: date }).format('yyyy-MM-dd').value)
        .toBe('2026-03-15');
    });

    it('formats a date with full datetime pattern', () => {
      const date: Date = new Date('2026-03-15T09:05:30.000Z');

      expect(new SchemaItem().date({ min: date, max: date }).format('dd/MM/yyyy HH:mm:ss').value)
        .toBe('15/03/2026 09:05:30');
    });

    it('formats with 12-hour clock', () => {
      const date: Date = new Date('2026-03-15T15:30:00.000Z');

      expect(new SchemaItem().date({ min: date, max: date }).format('hh:mm').value)
        .toBe('03:30');
    });

    it('handles midnight correctly in 12-hour format', () => {
      const date: Date = new Date('2026-01-01T00:00:00.000Z');

      expect(new SchemaItem().date({ min: date, max: date }).format('hh:mm').value)
        .toBe('12:00');
    });

    it('supports 2-digit year format', () => {
      const date: Date = new Date('2026-06-01T00:00:00.000Z');

      expect(new SchemaItem().date({ min: date, max: date }).format('yy/MM/dd').value)
        .toBe('26/06/01');
    });

    it('generates a random date when no date is set', () => {
      const formatted: string = new SchemaItem().format('yyyy-MM-dd').value;

      expect(formatted).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('currencyCode', () => {
    const codes: TSchemaCurrencyCode[] = ['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'AUD', 'CAD', 'CHF', 'SEK', 'NZD'];

    it('returns a random uppercase currency code by default', () => {
      Array.from({ length: 100 }).forEach(() => {
        const code: TSchemaCurrencyCode = new SchemaItem().currencyCode().value;

        expect(code).toBe(code.toUpperCase());
        expect(code.length).toBe(3);
        expect(codes).toContain(code);
      });
    });

    it('returns a lowercase currency code when lowercase is true', () => {
      Array.from({ length: 100 }).forEach(() => {
        const code: Lowercase<TSchemaCurrencyCode> = new SchemaItem().currencyCode(true).value;

        expect(code).toBe(code.toLowerCase());
        expect(code.length).toBe(3);
        expect(codes.map((c: string) => c.toLowerCase())).toContain(code);
      });
    });
  });

  describe('countryCode', () => {
    const iso2Codes: TSchemaCountryCodeIso2[] = ['US', 'GB', 'DE', 'FR', 'JP', 'CN', 'AU', 'CA', 'CH', 'SE'];
    const iso3Codes: TSchemaCountryCodeIso3[] = ['USA', 'GBR', 'DEU', 'FRA', 'JPN', 'CHN', 'AUS', 'CAN', 'CHE', 'SWE'];

    it('returns a random uppercase iso2 country code by default', () => {
      Array.from({ length: 100 }).forEach(() => {
        const code: TSchemaCountryCodeIso2 = new SchemaItem().countryCode().value;

        expect(code).toBe(code.toUpperCase());
        expect(code.length).toBe(2);
        expect(iso2Codes).toContain(code);
      });
    });

    it('returns an iso3 country code when iso is set to iso3', () => {
      Array.from({ length: 100 }).forEach(() => {
        const code: TSchemaCountryCodeIso3 = new SchemaItem().countryCode({ iso: 'iso3' }).value;

        expect(code).toBe(code.toUpperCase());
        expect(code.length).toBe(3);
        expect(iso3Codes).toContain(code);
      });
    });

    it('returns a lowercase code when lowercase is true', () => {
      Array.from({ length: 100 }).forEach(() => {
        const code: Lowercase<TSchemaCountryCodeIso2> = new SchemaItem().countryCode({ lowercase: true }).value;

        expect(code).toBe(code.toLowerCase());
        expect(code.length).toBe(2);
        expect(iso2Codes.map((c: string) => c.toLowerCase())).toContain(code);
      });
    });

    it('returns a lowercase iso3 code when both options are set', () => {
      Array.from({ length: 100 }).forEach(() => {
        const code: Lowercase<TSchemaCountryCodeIso3> = new SchemaItem().countryCode({ iso: 'iso3', lowercase: true }).value;

        expect(code).toBe(code.toLowerCase());
        expect(code.length).toBe(3);
        expect(iso3Codes.map((c: string) => c.toLowerCase())).toContain(code);
      });
    });
  });

  describe('email', () => {
    const domains: string[] = 'gmail.com outlook.com yahoo.com example.com mail.com'.split(' ');

    it('generates an email with a lorem word, random number, and known domain', () => {
      Array.from({ length: 100 }).forEach(() => {
        const email: string = new SchemaItem().email().value;
        const [local, domain]: string[] = email.split('@');

        expect(local).toMatch(/^[a-z]+\d+$/);
        expect(domains).toContain(domain);
      });
    });

    it('generates lowercase emails', () => {
      Array.from({ length: 100 }).forEach(() => {
        const email: string = new SchemaItem().email().value;

        expect(email).toBe(email.toLowerCase());
      });
    });
  });

  describe('timeOfDay', () => {
    let schemaItem: SchemaItem<string>;
    let date: Date;

    beforeEach(() => {
      date = new Date('2021-01-01T15:30:00.000Z');
    });

    it('generates a random time of day', () => {
      schemaItem = new SchemaItem().timeOfDay();

      expect(schemaItem.value).toBeTypeOf('string');
      expect(schemaItem.value.split(':').length).toBe(2);
      expect(schemaItem.value.split(':')[0]).toBeTypeOf('string');
      expect(schemaItem.value.split(':')[1]).toBeTypeOf('string');

      schemaItem.value.split(':').forEach((timePart: string) => {
        expect(+timePart).toBeGreaterThanOrEqual(0);
        expect(+timePart).toBeLessThanOrEqual(59);
        expect(timePart.length).toBe(2);
      });
    });

    it('uses the provided date to generate the time of day', () => {
      expect(new SchemaItem().date({ min: date, max: date }).timeOfDay().value).toBe('15:30');
    });

    it('pads the hours, minutes and seconds with 0 if they are less than 10', () => {
      date = new Date('2021-01-01T05:06:07.000Z');

      expect(new SchemaItem().date({ min: date, max: date }).timeOfDay({ showSeconds: true }).value)
        .toBe('05:06:07');
    });

    it('uses 12-hour format if use12HourFormat is set', () => {
      expect(new SchemaItem().date({ min: date, max: date }).timeOfDay({ use12HourFormat: true }).value)
        .toBe('03:30');
    });

    it('appends AM or PM if showAmPm is set', () => {
      expect(new SchemaItem().date({ min: date, max: date }).timeOfDay({ showAmPm: true, use12HourFormat: true }).value)
        .toBe('03:30 PM');
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

  describe('symbol', () => {
    let schemaItem: SchemaItem<symbol>;

    it('creates a new symbol with the given value', () => {
      schemaItem = new SchemaItem();
      const symbolVal: string = 'testSymbol';
      schemaItem.symbol(symbolVal);

      expect(schemaItem.value).toBeTypeOf('symbol');
      expect(schemaItem.value.toString()).toEqual(`Symbol(${symbolVal})`);
    });
  });

  describe('randomItem', () => {
    it('returns a random item from the provided array', () => {
      const items: Array<SchemaItem<'foo' | 'bar' | 'baz'>> = Array.from({ length: 4000 })
        .map(() => new SchemaItem().randomItem(['foo', 'bar', 'baz']));

      expect(items.some((item: SchemaItem<'foo' | 'bar' | 'baz'>) => item.value === 'foo')).toBe(true);
      expect(items.some((item: SchemaItem<'foo' | 'bar' | 'baz'>) => item.value === 'bar')).toBe(true);
      expect(items.some((item: SchemaItem<'foo' | 'bar' | 'baz'>) => item.value === 'baz')).toBe(true);
    });
  });

  describe('prefix', () => {
    it('adds the prefix to the value', () => {
      expect(new SchemaItem().identical('test').prefix('pre').value).toBe('pretest');
      expect(new SchemaItem().identical(5).prefix('$').value).toBe('$5');
    });
  });

  describe('suffix', () => {
    it('adds the suffix to the value', () => {
      expect(new SchemaItem().identical('test').suffix('suf').value).toBe('testsuf');
      expect(new SchemaItem().identical(5).suffix('€').value).toBe('5€');
    });
  });

  describe('identical', () => {
    it('passes the identity to the value', () => {
      expect(new SchemaItem().identical(5).value).toBe(5);
      expect(new SchemaItem().identical('47').value).toBe('47');
      expect(new SchemaItem().identical([1, 6, 3, '234', true]).value).toEqual([1, 6, 3, '234', true]);
    });
  });
});
