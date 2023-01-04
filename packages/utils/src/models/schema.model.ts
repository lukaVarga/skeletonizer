import { SchemaItem } from './schema-item.model';
import { TSchemaGenerator, TSchemaTransformer } from '../types';

let schemaIdx: number = 0;

export class Schema<T extends object> {
  public readonly uuid: number = schemaIdx++;
  public readonly viewModel: TSchemaTransformer<T>;

  public get value(): T {
    return this.val;
  }

  private readonly val: T;

  public constructor(
    public readonly generator: TSchemaGenerator<T>,
  ) {
    this.viewModel = this.generator();
    this.val = Schema.modelToValue<T>(this.viewModel);
  }

  private static modelToValue<T>(model: TSchemaTransformer<T>): T {
    if (model instanceof SchemaItem) {
      return model.value as T;
    } else if (Array.isArray(model)) {
      return model.map(this.modelToValue) as T;
    } else {
      const obj: T = {} as T;

      (Object.keys(model) as Array<keyof T>).forEach((key: keyof T) => {
        obj[key] = Schema.modelToValue(
          (model[key as keyof T & keyof TSchemaTransformer<T>]) as TSchemaTransformer<T[keyof T]>,
        );
      });

      return obj;
    }
  }
}
