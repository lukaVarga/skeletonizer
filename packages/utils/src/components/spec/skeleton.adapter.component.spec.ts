import { beforeEach, describe, expect, it } from 'vitest';
import { Schema, SkeletonAdapterComponent } from '../../index';
import { TTestComplexSkeletonConfig } from '../../../spec-helpers/test.helper.types';
import { TestHelperGenerators } from '../../../spec-helpers/test.helper.generators';

describe('SkeletonAdapterComponent', () => {
  let component: SkeletonAdapterComponent<TTestComplexSkeletonConfig>;

  beforeEach(() => {
    component = new SkeletonAdapterComponent<TTestComplexSkeletonConfig>();
  });

  it('should have null config', () => {
    expect(component.config).toBeNull();
  });

  it('should have empty array for viewModels', () => {
    expect(component.viewModels).toEqual([]);
  });

  describe('setupModels', () => {
    it('does not fail if config is null', () => {
      expect(() => {
        component.setupModels();
      }).not.toThrowError();

      component.setupModels();

      expect(component.viewModels).toEqual([]);
    });

    describe('config is defined', () => {
      beforeEach(() => {
        component.config = {
          repeat: 4,
          schemaGenerator: TestHelperGenerators.complexSkeletonSchemaConfigGenerator(),
        };
      });

      it('generates view models based on the config', () => {
        expect(component.viewModels.length).toBe(0);

        component.setupModels();

        expect(component.viewModels.length).toBe(4);

        component.viewModels.forEach((schema: Schema<TTestComplexSkeletonConfig>) => {
          expect(schema.value.stringArray.length).toEqual(2);
          expect(schema.value.stringArray.every((val: unknown) => typeof val === 'string')).toBe(true);
          expect(schema.value.someBool).toBeTypeOf('boolean');
          expect(schema.value.complexObj.foo).toBe('bar');
          expect(schema.value.complexObj.test).toBeTypeOf('number');
          expect(schema.value.complexObj.innerObj.numArr.every((val: unknown) => typeof val === 'number')).toBe(true);
          expect(schema.value.complexObj.innerObj.date).toBeInstanceOf(Date);
          expect(schema.value.complexObj.innerObj.symbol).toBeTypeOf('symbol');
        });
      });
    });
  });
});
