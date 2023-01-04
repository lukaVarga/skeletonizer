import { TSchemaConfig, TSchemaGenerator } from '../types';
import { Schema } from '../models';

/** @internal: used by skeleton adapter components */
export class SkeletonAdapterComponent<T extends object> {
  public config: TSchemaConfig<T> | null = null;
  public viewModels: Array<Schema<T>> = [];

  // the method should be called from within specific packages whenever the adapter component's config changes
  public setupModels(): void {
    if (this.config) {
      const schemaGenerator: TSchemaGenerator<T> = this.config.schemaGenerator;
      this.viewModels = Array.from({ length: this.config.repeat }, () => new Schema<T>(schemaGenerator));
    }
  }
}
