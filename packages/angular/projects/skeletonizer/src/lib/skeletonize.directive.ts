import { AfterViewInit, Directive, ElementRef, inject, Input } from '@angular/core';
import { ISkeletonizerColorSchema, SkeletonDirective } from '@skeletonizer/utils';

@Directive({
  selector: '[skeletonize]',
  standalone: true,
})
export class SkeletonizeDirective implements AfterViewInit {
  @Input({ alias: 'skeletonize' }) public colorSchema: ISkeletonizerColorSchema | undefined;
  private readonly el: ElementRef = inject(ElementRef);

  public ngAfterViewInit(): void {
    SkeletonDirective.skeletonizeProjectedTemplate(this.el.nativeElement, this.colorSchema);
  }
}
