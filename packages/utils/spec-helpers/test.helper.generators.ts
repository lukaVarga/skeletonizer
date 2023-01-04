import { SchemaItem, TSchemaTransformer } from '../src';
import { TTestComplexSkeletonConfig } from './test.helper.types';

export class TestHelperGenerators {
  public static complexSkeletonSchemaConfigGenerator(): () => TSchemaTransformer<TTestComplexSkeletonConfig> {
    return () => ({
      stringArray: Array.from({ length: 2 }, () => new SchemaItem().words(5)),
      someBool: new SchemaItem().boolean(),
      complexObj: {
        foo: new SchemaItem().identical('bar'),
        test: new SchemaItem().number(),
        innerObj: {
          numArr: Array.from({ length: 4 }, () => new SchemaItem().number(500)),
          date: new SchemaItem().date(),
          symbol: new SchemaItem().symbol(),
        },
      },
    });
  }
}
