import { Component, input, InputSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ISkeletonizerColorSchema, SkeletonDirective } from '@skeletonizer/utils';
import { SkeletonizeDirective } from './skeletonize.directive';
import { By } from '@angular/platform-browser';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';

@Component({
  template: `
    <div [skeletonize]="colorSchema()">
      <div>Foo</div>
    </div>
  `,
  selector: 'mocked-component',
  imports: [SkeletonizeDirective],
  standalone: true,
})
class MockedComponent {
  public colorSchema: InputSignal<ISkeletonizerColorSchema | undefined> = input<ISkeletonizerColorSchema | undefined>(undefined);
}

describe('SkeletonizeDirective', () => {
  let fixture: ComponentFixture<MockedComponent>;
  let component: MockedComponent;

  beforeAll(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserTestingModule, platformBrowserTesting(), { teardown: { destroyAfterEach: true } });
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MockedComponent,
        CommonModule,
        SkeletonizeDirective,
      ],
    });

    fixture = TestBed.createComponent(MockedComponent);
    component = fixture.componentInstance;
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  describe('ngAfterViewInit', () => {
    it('should call SkeletonDirective.skeletonizeProjectedTemplate with native element and color schema', () => {
      const colorSchema: ISkeletonizerColorSchema = {
        primaryColor: 'rgba(0, 23, 28, .8)',
        secondaryColor: 'rgba(29, 88, 23, .6)',
      };

      fixture.componentRef.setInput('colorSchema', colorSchema);

      spyOn(SkeletonDirective, 'skeletonizeProjectedTemplate').and.callThrough();

      fixture.detectChanges();

      expect(SkeletonDirective.skeletonizeProjectedTemplate).toHaveBeenCalledOnceWith(
        fixture.debugElement.query(By.directive(SkeletonizeDirective)).nativeElement,
        colorSchema,
      );
    });
  });
});
