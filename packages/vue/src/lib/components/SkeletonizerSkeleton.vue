<script setup lang="ts" generic="TSkeletonScopeObject extends object">
import { type ISkeletonizerColorSchema, SkeletonAdapterComponent, type TSchemaConfig } from '@skeletonizer/utils';
import { reactive, type UnwrapNestedRefs, type UnwrapRef, watch } from 'vue';

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

defineSlots<{
  default?: (props: { scope: TSkeletonScopeObject | UnwrapRef<TSkeletonScopeObject> }) => {
    scope: TSkeletonScopeObject | UnwrapRef<TSkeletonScopeObject>;
  };
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
  @import '../../utils/src/styles/helpers';
  @import '../../utils/src/styles/directives';
</style>
