import { beforeEach, describe, expect, it } from 'vitest';
import { SkeletonizerComponentComposable } from '../skeletonizer.component.composable';
import { SchemaItem, SkeletonAbstractComponent, type TSchemaConfig, type TSchemaTransformer } from '@skeletonizer/utils';
import { isReactive, type UnwrapNestedRefs } from 'vue';

type TConfig = {
  name: string;
  birthday: Date;
};

describe('SkeletonizerComponentComposable', () => {
  let skeletonConfig: TSchemaConfig<TConfig>;
  let composable: UnwrapNestedRefs<SkeletonizerComponentComposable<TConfig>>;

  beforeEach(() => {
    skeletonConfig = {
      repeat: 1,
      schemaGenerator: (): TSchemaTransformer<TConfig> => ({
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
});
