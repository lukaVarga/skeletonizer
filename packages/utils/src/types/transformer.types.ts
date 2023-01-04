import { SchemaItem } from '../models';

export type TSchemaTransformer<T> =
  T extends Array<infer Element>
    ? Array<TSchemaTransformer<Element>>
    : T extends Date
      ? SchemaItem<Date>
      : T extends boolean
        ? SchemaItem<boolean>
        : T extends object
          ? { [K in keyof T]: TSchemaTransformer<T[K]> }
          : SchemaItem<T>;
