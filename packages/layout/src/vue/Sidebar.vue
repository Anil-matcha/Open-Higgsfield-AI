<template>
  <aside class="sidebar" :style="sidebarStyle">
    <div :style="contentStyle">
      <div
        v-for="(item, index) in config.items"
        :key="index"
        class="sidebar-item"
        :style="getItemStyle(item)"
        @click="handleItemClick(item)"
        data-sidebar-item
      >
        <span v-if="item.icon" class="sidebar-item-icon mr-3">
          {{ item.icon }}
        </span>

        <span v-if="!sidebarCollapsed" class="sidebar-item-label">
          {{ item.label }}
        </span>

        <svg
          v-if="item.children && !sidebarCollapsed"
          class="ml-auto"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </div>
    </div>

    <button
      v-if="config.collapsible"
      class="p-2 m-2 text-secondary hover:text-white transition-colors"
      @click="toggleSidebar"
      :aria-label="sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path v-if="sidebarCollapsed" d="M9 18l6-6-6-6" />
        <path v-else d="M15 18l-6-6 6-6" />
      </svg>
    </button>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed, inject } from 'vue';
import { SidebarConfig, defaultSidebarConfig, createSidebarStructure, SidebarItem } from '../core/sidebar';

interface Props {
  config?: SidebarConfig;
}

const props = withDefaults(defineProps<Props>(), {
  config: () => defaultSidebarConfig,
});

const activeItem = ref<string | null>(null);
const sidebarStructure = createSidebarStructure(props.config);

const appShell = inject<{
  sidebarCollapsed: { value: boolean };
  toggleSidebar: () => void;
}>('appShell');

const sidebarCollapsed = computed(() => appShell?.sidebarCollapsed.value ?? false);

const sidebarStyle = computed(() => ({
  ...sidebarStructure.container,
  width: sidebarCollapsed.value ? '64px' : props.config.width,
}));

const contentStyle = computed(() => sidebarStructure.content);

const getItemStyle = (item: SidebarItem) => {
  const isActive = activeItem.value === item.route;
  return {
    ...sidebarStructure.item,
    ...(isActive ? sidebarStructure.itemActive : {}),
  };
};

const handleItemClick = (item: SidebarItem) => {
  activeItem.value = item.route;
  item.onClick?.();
};

const toggleSidebar = () => {
  appShell?.toggleSidebar();
};
</script>

<style scoped>
.sidebar {
  height: 100%;
  background: var(--bg-panel, #0a0a0a);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: width 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar-item {
  cursor: pointer;
}

.sidebar-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary, #ffffff);
}
</style>
