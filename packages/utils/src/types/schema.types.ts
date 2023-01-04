import { TSchemaTransformer } from './transformer.types';

export type TSchemaGenerator<T extends object> = () => TSchemaTransformer<T>;

export type TSchemaConfig<T extends object> = {
  repeat: number;
  schemaGenerator: TSchemaGenerator<T>;
};
