<template>
  <main class="content-area" :style="containerStyle">
    <div :style="innerStyle">
      <slot></slot>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ContentAreaConfig, defaultContentAreaConfig, createContentAreaStructure } from '../core/content-area';

interface Props {
  config?: ContentAreaConfig;
}

const props = withDefaults(defineProps<Props>(), {
  config: () => defaultContentAreaConfig,
});

const contentStructure = createContentAreaStructure(props.config);

const containerStyle = computed(() => contentStructure.container);
const innerStyle = computed(() => contentStructure.inner);
</script>

<style scoped>
.content-area {
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  background: var(--bg-app, #050505);
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
