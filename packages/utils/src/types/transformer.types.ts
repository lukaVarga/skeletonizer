import { SchemaItem } from '../models';

export interface ISchemaLeafTypes {
  date: Date;
}

type TSchemaLeaf = ISchemaLeafTypes[keyof ISchemaLeafTypes];

export type TSchemaTransformer<T> =
  T extends Array<infer Element>
    ? Array<TSchemaTransformer<Element>>
    : T extends boolean
      ? SchemaItem<boolean>
      : T extends TSchemaLeaf
        ? SchemaItem<T>
        : T extends object
          ? { [K in keyof T]: TSchemaTransformer<T[K]> }
          : SchemaItem<T>;
