import { describe, expect, it, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import {
  type TSchemaTransformer,
  SchemaItem,
  SkeletonAdapterComponent,
} from '@skeletonizer/utils';
import { SkeletonizerComponentComposable } from '../../composables/skeletonizer.component.composable';
import { h, type UnwrapNestedRefs } from 'vue';
import SkeletonizerSkeleton from '../SkeletonizerSkeleton.vue';

type TScope = {
  name: string;
};

describe('SkeletonizerSkeleton', () => {
  let wrapper: ReturnType<typeof mount<typeof SkeletonizerSkeleton>>;
  let outerScope: TScope;
  let skeletonizer: SkeletonizerComponentComposable<TScope>;
  let primaryColor: string;
  let secondaryColor: string;
  let style: string;
  let domIteration: (name: string) => string;

  beforeEach(() => {
    skeletonizer = SkeletonizerComponentComposable.generate({
      repeat: 3,
      schemaGenerator: (): TSchemaTransformer<TScope> => ({
        name: new SchemaItem<string>().words(2),
      }),
    }, true);

    primaryColor = 'rgba(144, 80, 70, .6)';
    secondaryColor = 'rgba(65,18,8,0.3)';

    style = `--skeletonizer-primary-color: ${primaryColor}; --skeletonizer-secondary-color: ${secondaryColor};`;

    outerScope = {
      name: 'John Doe',
    };

    wrapper = mount(SkeletonizerSkeleton, {
      slots: {
        default: ({ scope }: { scope: TScope }) => h(
          'div',
          { class: 'projected' },
          skeletonizer.proxy(scope).name,
        ),
      },
      props: {
        config: skeletonizer.skeletonConfig,
        scope: outerScope,
        showSkeleton: skeletonizer.showSkeleton,
        colorSchema: { primaryColor, secondaryColor },
      },
    });
  });

  describe('skeleton is shown', () => {
    let component: UnwrapNestedRefs<SkeletonAdapterComponent<TScope>>;

    beforeEach(() => {
      domIteration = (name: string): string => `<div style="${style}" data-skeletonizer="wrapper-element">
  <div class="projected"><span data-skeletonizer="text">${name}</span></div>
</div>`;

      component = (wrapper.vm as unknown as { component: UnwrapNestedRefs<SkeletonAdapterComponent<TScope>> }).component;
    });

    it('renders skeletonized variant', () => {
      const expectedHtml: string = `${domIteration(component.viewModels[0].value.name)}
${domIteration(component.viewModels[1].value.name)}
${domIteration(component.viewModels[2].value.name)}`;

      expect(wrapper.html()).toEqual(expectedHtml);
    });

    it('adjusts the DOM if skeleton config changes', async () => {
      skeletonizer.skeletonConfig.repeat = 1;

      await wrapper.vm.$nextTick();

      expect(wrapper.html()).toEqual(domIteration(component.viewModels[0].value.name));
    });
  });

  describe('skeleton is not shown', () => {
    it('shows non-skeletonized variant once showSkeleton is set to false', async () => {
      await wrapper.setProps({ showSkeleton: false });

      expect(wrapper.html()).toEqual('<div class="projected">John Doe</div>');
    });
  });
});
