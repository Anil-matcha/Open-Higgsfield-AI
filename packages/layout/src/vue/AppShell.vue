<template>
  <div class="app-shell" :style="shellStyle">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, provide } from 'vue';
import { AppShellConfig, defaultAppShellConfig, createLayoutStructure } from '../core/app-shell';

interface Props {
  config?: AppShellConfig;
}

const props = withDefaults(defineProps<Props>(), {
  config: () => defaultAppShellConfig,
});

const sidebarCollapsed = ref(props.config.sidebar.defaultCollapsed);

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value;
};

const layoutStructure = createLayoutStructure(props.config);

const shellStyle = computed(() => layoutStructure.appShell);

provide('appShell', {
  sidebarCollapsed,
  toggleSidebar,
  config: props.config,
});
</script>

<style scoped>
.app-shell {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-app, #050505);
}
</style>
