import { Signal } from '@angular/core';
import { Schema, TSchemaConfig, SkeletonAbstractComponent as BaseAbstract } from '@skeletonizer/utils';

type TAbstractComponent<T extends object> = {
  [K in keyof BaseAbstract<T>]: K extends 'proxy' ? BaseAbstract<T>[K] : Signal<BaseAbstract<T>[K]>;
};

/**
 * Angular-specific abstract component for skeletonizer.
 * Every Angular component that uses Skeletonizer should extend this class.
 *
 * This version uses Angular signals for reactive state management.
 *
 * @template T - The type of the data model for the skeletonized part of the component
 */
export abstract class SkeletonAbstractComponent<T extends object> implements TAbstractComponent<T> {
  /**
   * Configuration for the skeleton schema.
   * Defines how the skeleton data should be generated.
   */
  public abstract skeletonConfig: Signal<TSchemaConfig<T>>;

  /**
   * Signal that controls whether the skeleton is shown or the actual content.
   * Use `.set()` to update the value if using WritableSignal.
   */
  public abstract showSkeleton: Signal<boolean>;

  /**
   * Proxy method for type-safe access to properties/methods within the skeletonized part of the view.
   *
   * When accessing component properties/methods from within the skeletonized template,
   * they should be accessed via this proxy method. This ensures:
   * - All accessed properties/methods are part of the skeleton schema
   * - TypeScript understands the correct type of each property/method
   *
   * @param scope - Either the skeleton schema or the actual scope object
   * @returns The unwrapped scope object with proper typing
   *
   * @example
   * ```html
   * <ng-template let-context>
   *   <div>{{ proxy(context).userName }}</div>
   * </ng-template>
   * ```
   */
  public proxy(scope: T | Schema<T>): T {
    return scope instanceof Schema ? scope.value : scope;
  }
}
