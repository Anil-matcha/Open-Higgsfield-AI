# Unified Layout System - Quick Reference

## What Is It?

A shared layout package that gives all apps the same structure:
- **Full-width header** spanning the entire app
- **Full-page layout** using `100vw`/`100vh`
- **Consistent sidebar** and content area

## Where Is It?

```
packages/
├── layout/       # @higgsfield/layout
├── tokens/       # @higgsfield/tokens
└── navigation/   # @higgsfield/navigation
```

## Apps Using It

| App | Status |
|-----|--------|
| Root App | ✅ Reference (already has full-width header) |
| ViMax | ✅ Integrated with `ViMaxLayout` |
| Director | ✅ Integrated with `DirectorLayout` |
| CineGen | ⏸️ Kept existing layout |
| LTX-Desktop | ⏸️ Kept existing layout |

## Quick Start

### React
```jsx
import { AppShell, Header, Sidebar, ContentArea } from '@higgsfield/layout/react';

function App() {
  return (
    <AppShell className="theme-default">
      <Header logo={<Logo />} actions={<UserMenu />} />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar items={menuItems} />
        <ContentArea>
          {/* Your app content */}
        </ContentArea>
      </div>
    </AppShell>
  );
}
```

### Vue
```vue
<template>
  <AppShell class="theme-default">
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
```

## Themes

- `theme-default` - Neon yellow-green (#d9ff00)
- `theme-cinematic` - Warm amber (#d4a054)
- `theme-electric` - Blue (#2B61FF)
- `theme-violet` - Violet (#8b5cf6)

## CSS Variables

```css
:root {
  --bg-app: #050505;
  --color-primary: #d9ff00;
  --text-primary: #ffffff;
  --text-secondary: #a1a1aa;
}
```

## Testing

```bash
# Root app
npm run dev

# ViMax
cd apps/vimax/frontend && npm start

# Director
cd apps/director/frontend && npm run dev
```
