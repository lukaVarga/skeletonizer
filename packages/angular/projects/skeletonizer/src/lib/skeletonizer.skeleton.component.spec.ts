import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkeletonizerSkeletonComponent } from './skeletonizer.skeleton.component';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import {
  ISkeletonizerColorSchema,
  SchemaItem, SkeletonAbstractComponent,
  SkeletonAdapterComponent,
  TSchemaConfig,
  TSchemaTransformer,
} from '@skeletonizer/utils';
import { Component, Input, ViewChild } from '@angular/core';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

interface ISkeletonScope {
  name: string;
}

type TOuterScope = TestComponent;

@Component({
  template: `
  <skeletonizer-skeleton [config]="skeletonConfig" [scope]="this" [colorSchema]="colorSchema" [showSkeleton]="showSkeleton">
    <ng-template let-context>
      <div class="projected">{{ proxy(context).name }}</div>
    </ng-template>
  </skeletonizer-skeleton>`,
  selector: 'test-component',
})
class TestComponent extends SkeletonAbstractComponent<ISkeletonScope> {
  @ViewChild(SkeletonizerSkeletonComponent) public skeletonInstance!: SkeletonizerSkeletonComponent<ISkeletonScope, TOuterScope>;
  @Input() public scope!: TOuterScope;
  @Input() public showSkeleton!: boolean;
  @Input() public colorSchema?: ISkeletonizerColorSchema;

  public name: string = 'John Doe';

  public skeletonConfig: TSchemaConfig<ISkeletonScope> = {
    repeat: 3,
    schemaGenerator: () => ({
      name: new SchemaItem<string>().words(3),
    }),
  };
}

describe('SkeletonizerSkeletonComponent', () => {
  let component: SkeletonizerSkeletonComponent<ISkeletonScope, TOuterScope>;
  let fixture: ComponentFixture<SkeletonizerSkeletonComponent<ISkeletonScope, TOuterScope>>;
  let testComponent: TestComponent;
  let testComponentFixture: ComponentFixture<TestComponent>;
  let config: TSchemaConfig<ISkeletonScope>;
  let primaryColor: string;
  let secondaryColor: string;
  let style: string;
  let domIteration: (name: string) => string;
  let htmlCommentRegex: RegExp;

  beforeAll(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting(), { teardown: { destroyAfterEach: true } });
  });

  beforeEach(() => {
    htmlCommentRegex = /<!--(.[*:[\]\n]*)*?-->/g;

    config = {
      repeat: 3,
      schemaGenerator: (): TSchemaTransformer<ISkeletonScope> => ({
        name: new SchemaItem<string>().words(5),
      }),
    };

    primaryColor = 'rgba(144, 80, 70, .6)';
    secondaryColor = 'rgba(65,18,8,0.3)';

    style = `--skeletonizer-primary-color: ${primaryColor}; --skeletonizer-secondary-color: ${secondaryColor};`;

    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [
        CommonModule,
        SkeletonizerSkeletonComponent,
      ],
    });

    fixture = TestBed.createComponent(SkeletonizerSkeletonComponent<ISkeletonScope, TOuterScope>);
    component = fixture.componentInstance;

    testComponentFixture = TestBed.createComponent(TestComponent);
    testComponent = testComponentFixture.componentInstance;
    testComponentFixture.detectChanges();

    fixture.detectChanges();
  });

  it('extends SkeletonAdapterComponent', () => {
    expect(component).toBeInstanceOf(SkeletonAdapterComponent);
  });

  describe('configInput', () => {
    it('stores config before calling setupModels', () => {
      spyOn(component, 'setupModels').and.callFake(() => {
        expect(component.config).toBe(config);
      });

      component.configInput = config;

      expect(component.setupModels).toHaveBeenCalledTimes(1);
    });
  });

  describe('skeleton is shown', () => {
    beforeEach(() => {
      testComponent.showSkeleton = true;

      testComponent.colorSchema = {
        primaryColor,
        secondaryColor,
      };

      testComponentFixture.detectChanges();

      const wrapper: string = `<div ng-reflect-color-schema="[object Object]" style="${style}" data-skeletonizer="wrapper-element">`;
      domIteration = (name: string): string => `${wrapper}<div class="projected"><span data-skeletonizer="text">${name}</span></div></div>`;
    });

    it('renders skeletonized variant', () => {
      const expectedHtml: string =
        domIteration(testComponent.skeletonInstance.viewModels[0].value.name) +
        domIteration(testComponent.skeletonInstance.viewModels[1].value.name) +
        domIteration(testComponent.skeletonInstance.viewModels[2].value.name);

      expect(
        testComponentFixture.debugElement.query(
          By.directive(SkeletonizerSkeletonComponent),
        ).nativeElement.innerHTML.replace(htmlCommentRegex, ''),
      ).toEqual(expectedHtml);
    });

    it('adjusts the DOM if skeleton config changes', () => {
      testComponent.skeletonConfig = {
        ...testComponent.skeletonConfig,
        repeat: 1,
      };

      testComponentFixture.detectChanges();

      expect(
        testComponentFixture.debugElement.query(
          By.directive(SkeletonizerSkeletonComponent),
        ).nativeElement.innerHTML.replace(htmlCommentRegex, ''),
      ).toEqual(domIteration(testComponent.skeletonInstance.viewModels[0].value.name));
    });
  });

  describe('skeleton is not shown', () => {
    it('shows non-skeletonized variant once showSkeleton is set to false', () => {
      testComponent.showSkeleton = false;

      testComponentFixture.detectChanges();

      expect(
        testComponentFixture.debugElement.query(
          By.directive(SkeletonizerSkeletonComponent),
        ).nativeElement.innerHTML.replace(htmlCommentRegex, ''),
      ).toEqual('<div class="projected">John Doe</div>');
    });
  });
});
