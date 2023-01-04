import { SkeletonAbstractComponent, type TSchemaConfig } from '@skeletonizer/utils';
import { reactive, type UnwrapNestedRefs } from 'vue';

export class SkeletonizerComponentComposable<T extends object> extends SkeletonAbstractComponent<T> {
  private constructor(
    public skeletonConfig: TSchemaConfig<T>,
    public showSkeleton: boolean,
  ) {
    super();
  }

  public static generate<T extends object>(
    skeletonConfig: TSchemaConfig<T>,
    showSkeleton: boolean,
  ): UnwrapNestedRefs<SkeletonizerComponentComposable<T>> {
    return reactive(new SkeletonizerComponentComposable<T>(skeletonConfig, showSkeleton));
  }
}
