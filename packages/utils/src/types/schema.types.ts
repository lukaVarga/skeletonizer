import { TSchemaTransformer } from './transformer.types';

export type TSchemaGenerator<T extends object> = () => TSchemaTransformer<T>;

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type TSchemaConfig<T extends object> = {
  repeat: number;
  schemaGenerator: TSchemaGenerator<T>;
};
