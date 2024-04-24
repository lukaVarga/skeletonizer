import type { App, DirectiveBinding } from 'vue';
import SkeletonizerSkeleton from './components/SkeletonizerSkeleton.vue';
import { type ISkeletonizerColorSchema, SkeletonDirective } from '@skeletonizer/utils';

export default {
  install: (app: App): void => {
    app.component('SkeletonizerSkeleton', SkeletonizerSkeleton);

    app.directive('skeletonize', (el: HTMLElement, binding: DirectiveBinding<ISkeletonizerColorSchema>) => {
      SkeletonDirective.skeletonizeProjectedTemplate(el, binding.value);
    });
  },
};
