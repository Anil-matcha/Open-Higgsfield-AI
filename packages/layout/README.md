# Unified Layout System API Documentation

## Overview

The `@higgsfield/layout` package provides a comprehensive, framework-agnostic layout system for Open Higgsfield AI applications. It ensures consistent full-width headers, responsive navigation, and accessible design patterns across all platforms.

## Installation

```bash
npm install @higgsfield/layout @higgsfield/tokens @higgsfield/navigation
```

## Architecture

### Core Components

| Component | Purpose | Framework Support |
|-----------|---------|-------------------|
| `AppShell` | Full-page container (`100vw`/`100vh`) | React/Vue/Vanilla |
| `Header` | Full-width navigation bar | React/Vue/Vanilla |
| `Sidebar` | Collapsible navigation panel | React/Vue/Vanilla |
| `ContentArea` | Main content container | React/Vue/Vanilla |

### Design System Integration

The layout system integrates with:
- **@higgsfield/tokens**: CSS custom properties and theme variants
- **@higgsfield/navigation**: Menu configuration and routing utilities

## API Reference

### AppShell

Root container component that provides the full-page layout structure.

#### Props (React)
```typescript
interface AppShellProps {
  children: React.ReactNode;
  config?: AppShellConfig;
  className?: string;
}
```

#### Props (Vue)
```typescript
interface Props {
  config?: AppShellConfig;
  className?: string;
}
```

#### Configuration
```typescript
interface AppShellConfig {
  header: {
    enabled: boolean;      // Default: true
    sticky: boolean;       // Default: true
    zIndex: number;        // Default: 50
  };
  sidebar: {
    enabled: boolean;      // Default: true
    width: string;         // Default: '250px'
    collapsible: boolean;  // Default: true
    defaultCollapsed: boolean; // Default: false
  };
  content: {
    flexible: boolean;     // Default: true
  };
}
```

#### Usage Examples

**React:**
```jsx
import { AppShell } from '@higgsfield/layout/react';

function App() {
  return (
    <AppShell className="theme-default">
      {/* Header, Sidebar, ContentArea components */}
    </AppShell>
  );
}
```

**Vue:**
```vue
<template>
  <AppShell class="theme-cinematic">
    <Header>
      <template #logo><Logo /></template>
    </Header>
    <div style="display: flex; flex: 1;">
      <Sidebar :items="menuItems" />
      <ContentArea>
        <slot />
      </ContentArea>
    </div>
  </AppShell>
</template>

<script setup>
import { AppShell, Header, Sidebar, ContentArea } from '@higgsfield/layout/vue';
</script>
```

**Vanilla JS:**
```javascript
import { createAppShell, createHeader, createSidebar, createContentArea } from '@higgsfield/layout/vanilla';

const appShell = createAppShell();
const header = createHeader({ /* config */ });
const sidebar = createSidebar({ /* config */ });
const contentArea = createContentArea();

appShell.element.appendChild(header.element);
// ... append other components
document.body.appendChild(appShell.element);
```

---

### Header

Full-width navigation component spanning the entire application width.

#### Props (React)
```typescript
interface HeaderProps {
  config?: HeaderConfig;
  logo?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  mobileMenuRenderer?: (items: NavigationItem[], closeMenu: () => void) => React.ReactNode;
}
```

#### Props (Vue)
```typescript
interface Props {
  config?: HeaderConfig;
  className?: string;
}
```

#### Configuration
```typescript
interface HeaderConfig {
  logo: {
    enabled: boolean;      // Default: true
  };
  navigation: {
    enabled: boolean;      // Default: true
    items: NavigationItem[]; // Menu items
  };
  actions: {
    enabled: boolean;      // Default: true
  };
  mobile: {
    enabled: boolean;      // Default: true
    breakpoint: string;    // Default: 'lg' (1024px)
  };
}

interface NavigationItem {
  label: string;           // Display text
  route: string;           // Navigation route
  icon?: string;           // Optional icon
  dropdown?: NavigationItem[]; // Sub-menu items
  onClick?: () => void;    // Click handler
}
```

#### Features

- **Full-width span**: Always spans 100% of viewport width
- **Sticky positioning**: Stays at top when scrolling
- **Dropdown menus**: Support for nested navigation
- **Mobile responsive**: Hamburger menu on small screens
- **Accessibility**: Proper ARIA labels and keyboard navigation

---

### Sidebar

Collapsible navigation panel with menu items and state management.

#### Props (React)
```typescript
interface SidebarProps {
  config?: SidebarConfig;
  className?: string;
  itemRenderer?: (item: SidebarItem, isActive: boolean) => React.ReactNode;
}
```

#### Props (Vue)
```typescript
interface Props {
  config?: SidebarConfig;
  className?: string;
}
```

#### Configuration
```typescript
interface SidebarConfig {
  width: string;           // Default: '250px'
  collapsible: boolean;    // Default: true
  defaultCollapsed: boolean; // Default: false
  items: SidebarItem[];    // Navigation items
}

interface SidebarItem {
  label: string;           // Display text
  route: string;           // Navigation route
  icon?: string;           // Optional icon/emoji
  children?: SidebarItem[]; // Nested items
  onClick?: () => void;    // Click handler
}
```

#### Features

- **Collapsible**: Can collapse to icon-only mode
- **Active state**: Highlights current page/section
- **Custom rendering**: Optional custom item renderer
- **Smooth animations**: CSS transitions for expand/collapse
- **Accessibility**: Keyboard navigation and screen reader support

---

### ContentArea

Main content container that fills remaining space after header/sidebar.

#### Props (React)
```typescript
interface ContentAreaProps {
  children: React.ReactNode;
  config?: ContentAreaConfig;
  className?: string;
}
```

#### Props (Vue)
```typescript
interface Props {
  config?: ContentAreaConfig;
  className?: string;
}
```

#### Configuration
```typescript
interface ContentAreaConfig {
  flexible: boolean;       // Default: true (fills available space)
  background: string;      // Default: 'var(--bg-app)'
  padding: string;         // Default: '0'
}
```

#### Features

- **Flexible layout**: Uses flexbox to fill available space
- **Scrollable content**: Auto-scrolling for overflow
- **Custom styling**: Configurable background and padding
- **Accessibility**: Proper main content landmark

---

## Theme System

### Available Themes

```typescript
type ThemeName =
  | 'theme-default'     // Neon yellow-green (#d9ff00)
  | 'theme-cinematic'   // Warm amber (#d4a054)
  | 'theme-electric'    // Blue (#2B61FF)
  | 'theme-violet';     // Violet (#8b5cf6)
```

### CSS Variables

Each theme provides comprehensive CSS custom properties:

```css
/* Color Palette */
--color-primary: #d9ff00;
--color-primary-hover: #c4e600;
--color-accent: #a855f7;
--color-success: #22c55e;
--color-warning: #f59e0b;
--color-danger: #ef4444;

/* Backgrounds */
--bg-app: #050505;
--bg-panel: #0a0a0a;
--bg-card: #141414;
--bg-glass: rgba(10, 10, 10, 0.8);

/* Text Colors */
--text-primary: #ffffff;
--text-secondary: #a1a1aa;
--text-muted: #52525b;

/* Interactive States */
--color-primary-50: rgba(217, 255, 0, 0.05);
--color-primary-100: rgba(217, 255, 0, 0.1);
--color-primary-200: rgba(217, 255, 0, 0.2);
```

### Theme Application

```jsx
// Apply theme to AppShell
<AppShell className="theme-cinematic">
  {/* Components inherit theme colors */}
</AppShell>
```

---

## Accessibility Features

### Keyboard Navigation
- **Tab order**: Logical navigation through all interactive elements
- **Focus management**: Visible focus indicators with theme colors
- **Skip links**: "Skip to main content" for screen readers

### Screen Reader Support
- **ARIA landmarks**: `banner`, `navigation`, `main` roles
- **Menu semantics**: Proper `menu`, `menuitem` roles for dropdowns
- **Live regions**: Status announcements for dynamic content

### Motion Preferences
- **Reduced motion**: Respects `prefers-reduced-motion` setting
- **High contrast**: Enhanced borders for `prefers-contrast: high`

### Mobile Accessibility
- **Touch targets**: Minimum 44px touch targets
- **Gesture support**: Swipe gestures where appropriate
- **Orientation support**: Works in portrait and landscape

---

## Responsive Design

### Breakpoints
- **Mobile**: `< 1024px` - Hamburger menu, hidden sidebar
- **Desktop**: `≥ 1024px` - Full navigation, visible sidebar
- **Large screens**: `≥ 1440px` - Enhanced padding and spacing

### Adaptive Behavior
```css
/* Mobile */
@media (max-width: 1023px) {
  .sidebar { display: none; }
  .nav-menu { display: none; }
  .mobile-menu-btn { display: flex; }
}

/* Desktop */
@media (min-width: 1024px) {
  .mobile-menu-btn { display: none; }
}
```

---

## Integration Examples

### Complete React App
```jsx
import React from 'react';
import {
  AppShell,
  Header,
  Sidebar,
  ContentArea
} from '@higgsfield/layout/react';

const navigationItems = [
  { label: 'Home', route: 'home' },
  { label: 'Create', route: 'create' },
  // ... more items
];

const sidebarItems = [
  { label: 'Dashboard', route: 'dashboard', icon: '📊' },
  { label: 'Projects', route: 'projects', icon: '📁' },
  // ... more items
];

function MyApp() {
  return (
    <AppShell className="theme-default">
      <Header
        logo={<div>Logo</div>}
        actions={<UserMenu />}
      />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar items={sidebarItems} />
        <ContentArea>
          {/* Your app content */}
        </ContentArea>
      </div>
    </AppShell>
  );
}
```

### Complete Vue App
```vue
<template>
  <AppShell class="theme-cinematic">
    <Header>
      <template #logo>
        <div>Logo</div>
      </template>
      <template #actions>
        <UserMenu />
      </template>
    </Header>

    <div style="display: flex; flex: 1;">
      <Sidebar :items="sidebarItems" />
      <ContentArea>
        <router-view />
      </ContentArea>
    </div>
  </AppShell>
</template>

<script setup>
import { AppShell, Header, Sidebar, ContentArea } from '@higgsfield/layout/vue';

const sidebarItems = [
  { label: 'Dashboard', route: 'dashboard', icon: '📊' },
  { label: 'Projects', route: 'projects', icon: '📁' },
];
</script>
```

---

## Migration Guide

### From Custom Layouts

1. **Install packages**:
   ```bash
   npm install @higgsfield/layout @higgsfield/tokens @higgsfield/navigation
   ```

2. **Import components**:
   ```javascript
   // React
   import { AppShell, Header, Sidebar, ContentArea } from '@higgsfield/layout/react';

   // Vue
   import { AppShell, Header, Sidebar, ContentArea } from '@higgsfield/layout/vue';
   ```

3. **Wrap your app**:
   ```jsx
   // Before
   <div className="app-layout">
     <CustomHeader />
     <CustomSidebar />
     <main>{content}</main>
   </div>

   // After
   <AppShell className="theme-default">
     <Header logo={<Logo />} />
     <div style={{ display: 'flex', flex: 1 }}>
       <Sidebar items={menuItems} />
       <ContentArea>
         {content}
       </ContentArea>
     </div>
   </AppShell>
   ```

4. **Configure navigation**:
   ```javascript
   const navigationItems = [
     { label: 'Home', route: 'home' },
     { label: 'Create', route: 'create' },
   ];
   ```

5. **Apply theme**:
   ```jsx
   <AppShell className="theme-cinematic">
   ```

---

## Best Practices

### Performance
- **Lazy load components**: Import components dynamically for better initial bundle size
- **Memoize callbacks**: Use `useCallback` for event handlers
- **Avoid deep nesting**: Keep layout hierarchy shallow

### Accessibility
- **Test with screen readers**: Use NVDA, JAWS, or VoiceOver
- **Keyboard navigation**: Ensure all interactions work without mouse
- **Color contrast**: Verify WCAG AA compliance
- **Focus management**: Implement proper focus trapping in modals

### Responsive Design
- **Mobile-first**: Design for mobile, enhance for desktop
- **Touch targets**: Minimum 44px for touch interactions
- **Content prioritization**: Show essential content on small screens

### Theming
- **Consistent naming**: Use semantic color names
- **Fallback values**: Always provide CSS variable fallbacks
- **Theme validation**: Test all themes across components

---

## Troubleshooting

### Common Issues

**Components not rendering:**
- Check that CSS tokens are imported: `import '@higgsfield/tokens'`
- Verify framework-specific imports

**Theme not applying:**
- Ensure theme class is on `AppShell`: `<AppShell className="theme-default">`
- Check CSS custom property support

**Responsive issues:**
- Verify viewport meta tag: `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
- Check breakpoint definitions

**Accessibility warnings:**
- Run axe-core or lighthouse audits
- Test with keyboard-only navigation
- Validate ARIA implementation

### Debug Mode

Enable debug logging:
```javascript
// In development
localStorage.setItem('higgsfield-layout-debug', 'true');
```

---

## Contributing

### Development Setup
```bash
# Clone and setup
git clone <repo>
cd packages/layout
npm install
npm run typecheck  # Verify TypeScript

# Test changes
cd ../../
npm run dev
```

### Code Standards
- **TypeScript strict**: All components fully typed
- **Accessibility first**: WCAG AA compliance
- **Cross-browser**: Support modern browsers
- **Performance**: Minimize bundle impact

### Testing
```bash
# Unit tests
npm test

# Integration tests
npm run test:e2e

# Accessibility tests
npm run test:a11y
```

---

## Changelog

### v1.0.0
- ✅ Initial release
- ✅ React, Vue, Vanilla JS support
- ✅ Theme system with 4 variants
- ✅ Full accessibility compliance
- ✅ Responsive design
- ✅ Documentation and examples

---

*For more examples and advanced usage, see the `/demo` directory and individual component READMEs.*
