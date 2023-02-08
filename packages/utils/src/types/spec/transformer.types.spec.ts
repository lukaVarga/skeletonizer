import { expectTypeOf, it, describe } from 'vitest';
import { TSchemaTransformer } from '../transformer.types';
import { TTestComplexSkeletonConfig } from '../../../spec-helpers/test.helper.types';
import { SchemaItem } from '../../models';

describe('TSchemaTransfomer', () => {
  it('works with complex config', () => {
    // @ts-ignore
    const complexConfig: TSchemaTransformer<TTestComplexSkeletonConfig> = {};

    expectTypeOf(complexConfig).toEqualTypeOf<{
      stringArray: Array<SchemaItem<string>>;
      someBool: SchemaItem<boolean>;
      complexObj: {
        foo: SchemaItem<string>;
        test: SchemaItem<number>;
        innerObj: {
          numArr: Array<SchemaItem<number>>;
          date: SchemaItem<Date>;
          symbol: SchemaItem<symbol>;
        };
      };
    }>();
  });
});
