import { beforeEach, describe, expect, it } from 'vitest';
import { SkeletonizerComponentComposable } from '../skeletonizer.component.composable';
import { SchemaItem, SkeletonAbstractComponent, type TSchemaConfig, type TSchemaTransformer } from '@skeletonizer/utils';
import { isReactive, type UnwrapNestedRefs } from 'vue';

interface IConfig {
  name: string;
  birthday: Date;
}

describe('SkeletonizerComponentComposable', () => {
  let skeletonConfig: TSchemaConfig<IConfig>;
  let composable: UnwrapNestedRefs<SkeletonizerComponentComposable<IConfig>>;

  beforeEach(() => {
    skeletonConfig = {
      repeat: 1,
      schemaGenerator: (): TSchemaTransformer<IConfig> => ({
        name: new SchemaItem().words(2),
        birthday: new SchemaItem<Date>().date({ max: new Date('1990-01-01') }),
      }),
    };

    composable = SkeletonizerComponentComposable.generate(skeletonConfig, true);
  });

  it('has a private constructor', () => {
    // @ts-expect-error
    new SkeletonizerComponentComposable(skeletonConfig, true);
  });

  it('extends SkeletonAbstractComponent', () => {
    expect(composable).toBeInstanceOf(SkeletonAbstractComponent);
  });

  it('is reactive', () => {
    expect(isReactive(composable)).toBe(true);
  });

  it('exposes skeletonConfig', () => {
    expect(composable.skeletonConfig).toStrictEqual(skeletonConfig);
  });

  it('exposes showSkeleton', () => {
    expect(composable.showSkeleton).toBe(true);

    composable = SkeletonizerComponentComposable.generate(skeletonConfig, false);

    expect(composable.showSkeleton).toBe(false);
  });

  it('is able to generate skeleton schema', () => {
    expect(composable.skeletonConfig.schemaGenerator()).toEqual({
      name: expect.any(SchemaItem),
      birthday: expect.any(SchemaItem),
    });
  });
});
