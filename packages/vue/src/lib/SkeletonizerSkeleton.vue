<script setup lang="ts">
import { type ISkeletonizerColorSchema, SkeletonAdapterComponent, type TSchemaConfig } from '@skeletonizer/utils';
import { reactive, type UnwrapNestedRefs, watch } from 'vue';

// this can be transformed to a proper type-generic variant once the RFC is merged, presumably in v3.3
// https://github.com/vuejs/rfcs/discussions/436#discussioncomment-4907987
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TSkeletonScopeObject = any;

const props: Readonly<{
  config: TSchemaConfig<TSkeletonScopeObject>;
  showSkeleton: boolean;
  scope: TSkeletonScopeObject;
  colorSchema?: ISkeletonizerColorSchema;
}> = defineProps<{
  config: TSchemaConfig<TSkeletonScopeObject>;
  showSkeleton: boolean;
  scope: TSkeletonScopeObject;
  colorSchema?: ISkeletonizerColorSchema;
}>();

const component: UnwrapNestedRefs<SkeletonAdapterComponent<TSkeletonScopeObject>>
  = reactive(new SkeletonAdapterComponent<TSkeletonScopeObject>());

watch(
  props.config,
  (config: TSchemaConfig<TSkeletonScopeObject>) => {
    component.config = config;
    component.setupModels();
  },
  { immediate: true },
);
</script>

<template>
  <template v-if="showSkeleton">
    <div
      v-for="(model, index) of component.viewModels"
      :key="index"
      v-skeletonize="props.colorSchema"
    >
      <slot :scope="model.value" />
    </div>
  </template>

  <slot
    v-else
    :scope="props.scope"
  />
</template>

<style lang="scss">
  @import '../utils/src/styles/helpers';
  @import '../utils/src/styles/directives';
</style>
