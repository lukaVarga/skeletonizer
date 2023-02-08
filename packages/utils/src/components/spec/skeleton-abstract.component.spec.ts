import { describe, it, expect, beforeEach } from 'vitest';
import { SkeletonAbstractComponent } from '../skeleton-abstract.component';
import { TTestComplexSkeletonConfig } from '../../../spec-helpers/test.helper.types';
import { Schema } from '../../models';
import { TestHelperGenerators } from '../../../spec-helpers/test.helper.generators';

class MockComponent extends SkeletonAbstractComponent<TTestComplexSkeletonConfig> {
  public readonly skeletonSchema: Schema<TTestComplexSkeletonConfig> = new Schema<TTestComplexSkeletonConfig>(
    TestHelperGenerators.complexSkeletonSchemaConfigGenerator(),
  );

  public showSkeleton: boolean = false;
}

describe('SkeletonAbstractComponent', () => {
  let component: SkeletonAbstractComponent<TTestComplexSkeletonConfig>;

  beforeEach(() => {
    component = new MockComponent();
  });

  describe('proxy', () => {
    it('returns the same object that gets passed', () => {
      expect(component.proxy(component.skeletonSchema.value)).toBe(component.skeletonSchema.value);
    });
  });
});
