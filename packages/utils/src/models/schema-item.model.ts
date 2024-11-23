import { LOREM_IPSUM } from '../constants';
import { DateHelpers } from '../helpers';

let uuid: number = 0;

type TSchemaInstance<T> = InstanceType<typeof SchemaItem<T>>;

export class SchemaItem<T = never> {
  public get value(): T {
    return this.#val;
  }

  #val!: T;

  public words(this: TSchemaInstance<string | undefined>, count: number): TSchemaInstance<string> {
    this.assertType<string>();
    let val: string = '';
    let i: number = 0;

    while (i < count) {
      val += this.randomLoremWord() + ' ';
      i++;
    }

    this.#val = val.trim();

    return this;
  }

  public paragraphs(this: TSchemaInstance<string | undefined>, count: number): TSchemaInstance<string> {
    this.assertType<string>();
    let val: string = '';
    let i: number = 0;
    const wordsPerParagraph: number = 50;

    while (i < count) {
      const wordCount: number = wordsPerParagraph - (Math.round(wordsPerParagraph * Math.random() * 0.2) * (Math.random() < 0.5 ? -1 : 1));
      val += this.words(wordCount).value;

      if (i !== count - 1) {
        val += '\n';
      }

      i++;
    }

    this.#val = val;

    return this;
  }

  public number(this: TSchemaInstance<number | undefined>, min: number = 0, max: number = 1000): TSchemaInstance<number> {
    this.assertType<number>();
    this.#val = Math.ceil(Math.random() * (max - min)) + min;

    return this;
  }

  public currency(
    this: TSchemaInstance<number | string>,
    config: { locale: string; currency: string; options?: Omit<Intl.NumberFormatOptions, 'style' | 'currency'> },
  ): TSchemaInstance<string> {
    this.assertType<string>();

    this.#val = new Intl.NumberFormat(
      config.locale,
      { ...config.options, style: 'currency', currency: config.currency },
    ).format(+this.#val);

    return this;
  }

  public multiply(this: TSchemaInstance<number>, multiplier: number): TSchemaInstance<number> {
    this.assertType<number>();
    this.#val *= multiplier;

    return this;
  }

  public date(
    this: TSchemaInstance<Date | undefined>,
    config: Partial<{ isFuture: boolean; isPast: boolean; max: Date; min: Date }> = {},
  ): TSchemaInstance<Date> {
    this.assertType<Date>();

    let max: Date = config.max ?? new Date('2100-01-01');
    let min: Date = config.min ?? new Date('1970-01-01');

    if (config.isFuture) {
      min = new Date(Date.now() + DateHelpers.daysInMs(1));
    } else if (config.isPast) {
      max = new Date(Date.now() - DateHelpers.daysInMs(1));
    }

    this.#val = DateHelpers.dateBetween(min, max);

    return this;
  }

  public uuid(this: TSchemaInstance<number | undefined>): TSchemaInstance<number> {
    uuid++;
    this.assertType<number>();
    this.#val = uuid;

    return this;
  }

  public boolean(this: TSchemaInstance<boolean | undefined>): TSchemaInstance<boolean> {
    this.assertType<boolean>();
    this.#val = Math.random() <= 0.5;

    return this;
  }

  public symbol(this: TSchemaInstance<symbol | undefined>, val: string | number = 0): TSchemaInstance<symbol> {
    this.assertType<symbol>();
    this.#val = Symbol(val);

    return this;
  }

  public randomItem<R>(this: TSchemaInstance<R | undefined>, items: R[]): TSchemaInstance<R> {
    this.assertType<R>();
    const index: number = Math.floor(Math.random() * items.length);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.#val = items[index]!;

    return this;
  }

  public prefix(this: TSchemaInstance<number | string>, prefix: string): TSchemaInstance<string> {
    this.assertType<string>();
    this.#val = `${prefix}${this.#val}`;

    return this;
  }

  public suffix(this: TSchemaInstance<number | string>, suffix: string): TSchemaInstance<string> {
    this.assertType<string>();
    this.#val = `${this.#val}${suffix}`;

    return this;
  }

  public identical<R>(this: TSchemaInstance<R | undefined>, identity: R): TSchemaInstance<R> {
    this.assertType<R>();
    this.#val = identity;

    return this;
  }

  private assertType<R>(): asserts this is TSchemaInstance<R> {}

  private randomLoremWord(): string {
    const index: number = Math.floor(Math.random() * LOREM_IPSUM.length);

    return LOREM_IPSUM[index] ?? 'lorem';
  }
}
