import { expectTypeOf, it, describe } from 'vitest';
import type { TSchemaTransformer, ISchemaLeafTypes } from '../transformer.types';
import { ITestComplexSkeletonConfig } from '../../../spec-helpers/test.helper.types';
import { SchemaItem } from '../../models';

interface ICustomLeaf {
  custom: boolean;
  nested: { deep: string };
}

declare module '../transformer.types' {
  interface ISchemaLeafTypes {
    customLeaf: ICustomLeaf;
  }
}

interface IModelWithLeaf {
  name: string;
  leaf: ICustomLeaf;
  nested: { inner: ICustomLeaf };
}

describe('TSchemaTransfomer', () => {
  it('works with complex config', () => {
    // @ts-ignore
    const complexConfig: TSchemaTransformer<ITestComplexSkeletonConfig> = {};

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

  it('treats types registered in ISchemaLeafTypes as leaf SchemaItems', () => {
    // @ts-ignore
    const config: TSchemaTransformer<IModelWithLeaf> = {};

    // ICustomLeaf should be wrapped as SchemaItem<ICustomLeaf>, not recursively decomposed
    expectTypeOf(config).toEqualTypeOf<{
      name: SchemaItem<string>;
      leaf: SchemaItem<ICustomLeaf>;
      nested: {
        inner: SchemaItem<ICustomLeaf>;
      };
    }>();
  });

  it('exposes ISchemaLeafTypes for module augmentation', () => {
    // ISchemaLeafTypes must be an interface (not a type alias) to support declaration merging
    expectTypeOf<ISchemaLeafTypes>().toHaveProperty('date');
    expectTypeOf<ISchemaLeafTypes['date']>().toEqualTypeOf<Date>();
  });
});
