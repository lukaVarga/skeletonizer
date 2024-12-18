import { describe, it, expect, beforeEach } from 'vitest';
import { SkeletonAbstractComponent } from '../skeleton.abstract.component';
import { ITestComplexSkeletonConfig } from '../../../spec-helpers/test.helper.types';
import { TestHelperGenerators } from '../../../spec-helpers/test.helper.generators';
import { TSchemaConfig } from '../../types';
import { Schema } from '../../models';

class MockComponent extends SkeletonAbstractComponent<ITestComplexSkeletonConfig> {
  public skeletonConfig: TSchemaConfig<ITestComplexSkeletonConfig> = {
    repeat: 4,
    schemaGenerator: TestHelperGenerators.complexSkeletonSchemaConfigGenerator(),
  };

  public showSkeleton: boolean = false;
}

describe('SkeletonAbstractComponent', () => {
  let component: SkeletonAbstractComponent<ITestComplexSkeletonConfig>;

  beforeEach(() => {
    component = new MockComponent();
  });

  describe('proxy', () => {
    it('returns the same object when passing a non-schema scope', () => {
      const scope: ITestComplexSkeletonConfig = {
        stringArray: ['string1', 'string2', 'string3'],
        someBool: true,
        complexObj: {
          foo: 'bar',
          test: 123,
          innerObj: {
            numArr: [1, 2, 3],
            date: new Date(),
            symbol: Symbol('symbol1'),
          },
        },
      };

      expect(component.proxy(scope)).toBe(scope);
    });

    it('returns the schema value when passing schema scope', () => {
      const schema: Schema<ITestComplexSkeletonConfig> = new Schema(component.skeletonConfig.schemaGenerator);

      expect(component.proxy(schema)).toBe(schema.value);
    });
  });
});
