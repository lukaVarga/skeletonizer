import { beforeEach, describe, expect, it } from 'vitest';
import { Schema, SkeletonComponent } from '../../index';
import { TTestComplexSkeletonConfig } from '../../../spec-helpers/test.helper.types';
import { TestHelperGenerators } from '../../../spec-helpers/test.helper.generators';

class AdapterComponent extends SkeletonComponent<TTestComplexSkeletonConfig> {
  public override setupModels(): void {
    super.setupModels();
  }
}

describe('SkeletonComponent', () => {
  let component: SkeletonComponent<TTestComplexSkeletonConfig>;

  beforeEach(() => {
    component = new SkeletonComponent<TTestComplexSkeletonConfig>();
  });

  it('should have null config', () => {
    expect(component.config).toBeNull();
  });

  it('should have empty array for viewModels', () => {
    expect(component.viewModels).toEqual([]);
  });

  describe('setupModels', () => {
    let adapter: AdapterComponent;

    beforeEach(() => {
      adapter = new AdapterComponent();
    });

    it('does not fail if config is null', () => {
      expect(() => {
        adapter.setupModels();
      }).not.toThrowError();

      adapter.setupModels();

      expect(adapter.viewModels).toEqual([]);
    });

    describe('config is defined', () => {
      beforeEach(() => {
        adapter.config = {
          repeat: 4,
          schemaGenerator: TestHelperGenerators.complexSkeletonSchemaConfigGenerator(),
        };
      });

      it('generates view models based on the config', () => {
        expect(adapter.viewModels.length).toBe(0);

        adapter.setupModels();

        expect(adapter.viewModels.length).toBe(4);

        adapter.viewModels.forEach((schema: Schema<TTestComplexSkeletonConfig>) => {
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
