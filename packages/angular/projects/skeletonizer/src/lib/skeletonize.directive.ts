import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';
import { ISkeletonizerColorSchema, SkeletonDirective } from '@skeletonizer/utils';

@Directive({
  selector: '[skeletonize]',
})
export class SkeletonizeDirective implements AfterViewInit {
  @Input({ alias: 'skeletonize' }) public colorSchema: ISkeletonizerColorSchema | undefined;

  public constructor(
    private readonly el: ElementRef,
  ) {}

  public ngAfterViewInit(): void {
    SkeletonDirective.skeletonizeProjectedTemplate(this.el.nativeElement, this.colorSchema);
  }
}
