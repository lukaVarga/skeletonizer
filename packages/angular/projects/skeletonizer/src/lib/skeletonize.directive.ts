import { AfterViewInit, Directive, ElementRef, inject, input, InputSignal } from '@angular/core';
import { ISkeletonizerColorSchema, SkeletonDirective } from '@skeletonizer/utils';

@Directive({
  selector: '[skeletonize]',
  standalone: true,
})
export class SkeletonizeDirective implements AfterViewInit {
  public readonly colorSchema: InputSignal<ISkeletonizerColorSchema | undefined> = input<ISkeletonizerColorSchema | undefined>(
    undefined,
    { alias: 'skeletonize' },
  );

  private readonly el: ElementRef = inject(ElementRef);

  public ngAfterViewInit(): void {
    SkeletonDirective.skeletonizeProjectedTemplate(this.el.nativeElement, this.colorSchema());
  }
}
