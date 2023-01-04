import { config } from '@vue/test-utils';
import { type ISkeletonizerColorSchema, SkeletonDirective } from '@skeletonizer/utils';

config.global.directives = {
  skeletonize: (el: HTMLElement, binding: { value: ISkeletonizerColorSchema }): void => {
    SkeletonDirective.skeletonizeProjectedTemplate(el, binding.value);
  },
};
