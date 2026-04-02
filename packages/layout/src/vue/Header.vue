<template>
  <header class="header" :style="containerStyle">
    <div :style="navBarStyle">
      <!-- Left Part - Logo and Navigation -->
      <div :style="leftPartStyle">
        <div v-if="config.logo.enabled" class="logo-container" style="cursor: pointer;">
          <slot name="logo"></slot>
        </div>

        <nav
          v-if="config.navigation.enabled"
          class="hidden lg:flex items-center"
          :style="menuStyle"
        >
          <a
            v-for="(item, index) in config.navigation.items"
            :key="index"
            class="hover:text-white transition-all cursor-pointer relative group whitespace-nowrap"
            @click="item.onClick"
          >
            {{ item.label }}

            <div
              v-if="item.dropdown"
              class="absolute top-full left-0 mt-2 w-48 bg-[#111]/90 backdrop-blur-xl border border-white/10 rounded-lg shadow-xl z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all"
            >
              <a
                v-for="(dropdownItem, dropdownIndex) in item.dropdown"
                :key="dropdownIndex"
                class="block px-4 py-2 text-sm text-secondary hover:text-white hover:bg-white/5 cursor-pointer"
                @click="dropdownItem.onClick"
              >
                {{ dropdownItem.label }}
              </a>
            </div>
          </a>
        </nav>
      </div>

      <!-- Right Part - Actions -->
      <div :style="rightPartStyle">
        <button
          v-if="config.mobile.enabled"
          class="lg:hidden p-2 text-secondary hover:text-white transition-colors"
          @click="toggleMobileMenu"
          aria-label="Toggle mobile menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <slot name="actions"></slot>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div
      v-if="config.mobile.enabled && mobileMenuOpen"
      class="fixed inset-0 bg-black/95 z-[100] flex flex-col items-center justify-center gap-4"
    >
      <button
        class="absolute top-4 right-4 p-2 text-white"
        @click="toggleMobileMenu"
        aria-label="Close menu"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <a
        v-for="(item, index) in config.navigation.items"
        :key="index"
        class="text-xl font-bold text-secondary hover:text-white transition-colors cursor-pointer"
        @click="handleMobileItemClick(item)"
      >
        {{ item.label }}

        <a
          v-for="(dropdownItem, dropdownIndex) in item.dropdown"
          :key="dropdownIndex"
          class="block text-lg font-bold text-muted hover:text-white transition-colors cursor-pointer mt-2 ml-4"
          @click="handleMobileItemClick(dropdownItem)"
        >
          → {{ dropdownItem.label }}
        </a>
      </a>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { HeaderConfig, defaultHeaderConfig, createHeaderStructure, NavigationItem } from '../core/header';

interface Props {
  config?: HeaderConfig;
}

const props = withDefaults(defineProps<Props>(), {
  config: () => defaultHeaderConfig,
});

const mobileMenuOpen = ref(false);

const headerStructure = createHeaderStructure(props.config);

const containerStyle = computed(() => headerStructure.container);
const navBarStyle = computed(() => headerStructure.navBar);
const leftPartStyle = computed(() => headerStructure.leftPart);
const rightPartStyle = computed(() => headerStructure.rightPart);
const menuStyle = computed(() => headerStructure.menu);

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const handleMobileItemClick = (item: NavigationItem) => {
  item.onClick?.();
  mobileMenuOpen.value = false;
};
</script>

<style scoped>
.header {
  width: 100%;
  display: flex;
  flex-direction: column;
  z-index: 50;
  position: sticky;
  top: 0;
}
</style>
