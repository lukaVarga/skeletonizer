import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkeletonizerSkeletonComponent } from './skeletonizer.skeleton.component';
import {
  ISkeletonizerColorSchema,
  SchemaItem,
  SkeletonAdapterComponent,
  TSchemaConfig,
  TSchemaTransformer,
} from '@skeletonizer/utils';
import { Component, input, InputSignal, signal, ViewChild, WritableSignal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';
import { SkeletonAbstractComponent } from './skeleton-abstract.component';

interface ISkeletonScope {
  name: string;
}

type TOuterScope = TestComponent;

@Component({
  template: `
  <skeletonizer-skeleton [config]="skeletonConfig()" [scope]="this" [colorSchema]="colorSchema()" [showSkeleton]="showSkeleton()">
    <ng-template let-context>
      <div class="projected">{{ proxy(context).name }}</div>
    </ng-template>
  </skeletonizer-skeleton>`,
  selector: 'test-component',
  imports: [SkeletonizerSkeletonComponent],
  standalone: true,
})
class TestComponent extends SkeletonAbstractComponent<ISkeletonScope> {
  @ViewChild(SkeletonizerSkeletonComponent) public skeletonInstance!: SkeletonizerSkeletonComponent<ISkeletonScope, TOuterScope>;
  public showSkeleton: WritableSignal<boolean> = signal(false);
  public colorSchema: InputSignal<ISkeletonizerColorSchema | undefined> = input<ISkeletonizerColorSchema | undefined>(undefined);

  public name: string = 'John Doe';

  public skeletonConfig: WritableSignal<TSchemaConfig<ISkeletonScope>> = signal({
    repeat: 3,
    schemaGenerator: () => ({
      name: new SchemaItem<string>().words(3),
    }),
  });
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
    TestBed.initTestEnvironment(BrowserTestingModule, platformBrowserTesting(), { teardown: { destroyAfterEach: true } });
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
      imports: [
        TestComponent,
        CommonModule,
        SkeletonizerSkeletonComponent,
      ],
    });

    testComponentFixture = TestBed.createComponent(TestComponent);
    testComponent = testComponentFixture.componentInstance;

    fixture = TestBed.createComponent(SkeletonizerSkeletonComponent<ISkeletonScope, TOuterScope>);
    component = fixture.componentInstance;

    // Set required inputs before detectChanges
    fixture.componentRef.setInput('config', config);
    fixture.componentRef.setInput('showSkeleton', false);
    fixture.componentRef.setInput('scope', testComponent);

    testComponentFixture.detectChanges();

    fixture.detectChanges();
  });

  it('extends SkeletonAdapterComponent', () => {
    expect(component).toBeInstanceOf(SkeletonAdapterComponent);
  });

  describe('configInput', () => {
    it('stores config before calling setupModels', () => {
      // Create a new fixture to test the initial config setup
      const newFixture: ComponentFixture<SkeletonizerSkeletonComponent<ISkeletonScope, TOuterScope>>
        = TestBed.createComponent(SkeletonizerSkeletonComponent<ISkeletonScope, TOuterScope>);

      const newComponent: SkeletonizerSkeletonComponent<ISkeletonScope, TOuterScope> = newFixture.componentInstance;

      spyOn(newComponent, 'setupModels').and.callFake(() => {
        expect(newComponent.config).toBe(config);
      });

      newFixture.componentRef.setInput('config', config);
      newFixture.componentRef.setInput('showSkeleton', false);
      newFixture.componentRef.setInput('scope', testComponent);

      newFixture.detectChanges();

      expect(newComponent.setupModels).toHaveBeenCalledTimes(1);
    });
  });

  describe('skeleton is shown', () => {
    beforeEach(() => {
      testComponent.showSkeleton.set(true);

      testComponentFixture.componentRef.setInput('colorSchema', {
        primaryColor,
        secondaryColor,
      });

      testComponentFixture.detectChanges();

      const wrapper: string = `<div style="${style}" data-skeletonizer="wrapper-element">`;
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
      testComponent.skeletonConfig.update((conf: TSchemaConfig<ISkeletonScope>) => ({
        ...conf,
        repeat: 1,
      }));

      testComponentFixture.detectChanges();
      TestBed.tick();
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
      testComponent.showSkeleton.set(false);

      testComponentFixture.detectChanges();

      expect(
        testComponentFixture.debugElement.query(
          By.directive(SkeletonizerSkeletonComponent),
        ).nativeElement.innerHTML.replace(htmlCommentRegex, ''),
      ).toEqual('<div class="projected">John Doe</div>');
    });
  });
});
