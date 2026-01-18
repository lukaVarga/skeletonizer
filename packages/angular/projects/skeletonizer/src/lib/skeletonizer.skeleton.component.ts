import { Component, ContentChild, effect, input, InputSignal, TemplateRef, ViewEncapsulation } from '@angular/core';
import { ISkeletonizerColorSchema, Schema, SkeletonAdapterComponent, TSchemaConfig } from '@skeletonizer/utils';
import { SkeletonizeDirective } from './skeletonize.directive';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'skeletonizer-skeleton',
  templateUrl: './skeletonizer.skeleton.component.html',
  styleUrls: ['./skeletonizer.skeleton.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    SkeletonizeDirective,
    NgTemplateOutlet,
  ],
})
export class SkeletonizerSkeletonComponent<T extends object, Scope extends T> extends SkeletonAdapterComponent<T> {
  @ContentChild(TemplateRef) public readonly templateRef!: TemplateRef<{ $implicit: Schema<T> | Scope }>;

  public readonly showSkeleton: InputSignal<boolean> = input.required<boolean>();
  public readonly scope: InputSignal<Scope> = input.required<Scope>();
  public readonly configInput: InputSignal<TSchemaConfig<T>> = input.required<TSchemaConfig<T>>({ alias: 'config' });
  public readonly colorSchema: InputSignal<ISkeletonizerColorSchema | undefined> = input<ISkeletonizerColorSchema | undefined>(undefined);

  public constructor() {
    super();

    effect(() => {
      this.config = this.configInput();
      this.setupModels();
    });
  }
}
