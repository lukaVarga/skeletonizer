import { Schema } from '../models';
import { TSchemaConfig } from '../types';

// every component that uses skeleton adapters should extend SkeletonAbstractComponent
export abstract class SkeletonAbstractComponent<T extends object> {
  public abstract skeletonConfig: TSchemaConfig<T>;
  public abstract showSkeleton: boolean;

  // when accessing skeletonized component properties / methods from within the view, they should be accessed via proxy method
  // this is necessary to ensure:
  // - that all properties / methods accessed from within skeletonized part of the view are a part of skeletonSchema
  // - that typescript understands correct type of each property / method accessed from within the skeletonized part of the view
  public proxy(scope: T | Schema<T>): T {
    return scope instanceof Schema ? scope.value : scope;
  }
}
