import { Component, ContentChild, Input, TemplateRef, ViewEncapsulation } from '@angular/core';
import { ISkeletonizerColorSchema, Schema, SkeletonAdapterComponent, TSchemaConfig } from '@skeletonizer/utils';
import { SkeletonizeDirective } from './skeletonize.directive';
import { NgFor, NgIf, NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'skeletonizer-skeleton',
  templateUrl: './skeletonizer.skeleton.component.html',
  styleUrls: ['./skeletonizer.skeleton.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    SkeletonizeDirective,
    NgIf,
    NgFor,
    NgTemplateOutlet,
  ],
})
export class SkeletonizerSkeletonComponent<T extends object, Scope extends T> extends SkeletonAdapterComponent<T> {
  @ContentChild(TemplateRef) public readonly templateRef!: TemplateRef<{ $implicit: Schema<T> | Scope }>;

  @Input({ required: true }) public showSkeleton!: boolean;
  @Input({ required: true }) public scope!: Scope;
  @Input() public colorSchema?: ISkeletonizerColorSchema;

  @Input({ alias: 'config', required: true }) public set configInput(config: TSchemaConfig<T>) {
    this.config = config;

    this.setupModels();
  }
}
