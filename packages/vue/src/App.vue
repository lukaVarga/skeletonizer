<script setup lang="ts">
import HelloWorld from './showcase/HelloWorld.vue';
import TheWelcome from './showcase/TheWelcome.vue';
import { SchemaItem } from '@skeletonizer/utils';
import { type Ref, ref } from 'vue';
import { SkeletonizerComponentComposable } from './lib/composables/skeletonizer.component.composable';
import SkeletonizerSkeleton from './lib/components/SkeletonizerSkeleton.vue';

type TSkeletonized = { message: string };

const message: Ref<string> = ref('You did it!');

const skeletonizer: SkeletonizerComponentComposable<TSkeletonized> = SkeletonizerComponentComposable.generate<TSkeletonized>(
  {
    repeat: 1,
    schemaGenerator: () => ({
      message: new SchemaItem().words(5),
    }),
  },
  true,
);

setTimeout(() => {
  skeletonizer.showSkeleton = false;
}, 5000 * Math.random());

setTimeout(() => {
  message.value = 'Async update of message';
}, 5000);
</script>

<template>
  <skeletonizer-skeleton
    v-slot="{ scope }"
    :config="skeletonizer.skeletonConfig"
    :show-skeleton="skeletonizer.showSkeleton"
    :scope="{ message }"
    :color-schema="{ primaryColor: 'rgba(100, 100, 100, .6)', secondaryColor: 'rgba(100, 100, 100, .3)' }"
  >
    <header>
      <img
        alt="Vue logo"
        class="logo"
        src="./showcase/images/logo.svg"
        width="125"
        height="125"
      >

      <div class="wrapper">
        <hello-world :msg="skeletonizer.proxy(scope).message" />
      </div>
    </header>

    <main>
      <the-welcome />
    </main>
  </skeletonizer-skeleton>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    padding-right: calc(var(--section-gap) / 2);
    place-items: center;
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    flex-wrap: wrap;
    place-items: flex-start;
  }
}
</style>
