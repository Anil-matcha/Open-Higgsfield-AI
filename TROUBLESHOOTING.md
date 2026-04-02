# Troubleshooting FAQ - Unified Layout System

## Common Issues & Solutions

### ❌ Components Not Rendering

**Symptoms:**
- Layout components appear blank or don't show content
- Console errors about missing imports

**Solutions:**

1. **Check CSS token imports:**
   ```javascript
   // Ensure @higgsfield/tokens is imported
   import '@higgsfield/tokens';
   ```

2. **Verify framework imports:**
   ```javascript
   // React
   import { AppShell } from '@higgsfield/layout/react';

   // Vue
   import { AppShell } from '@higgsfield/layout/vue';

   // Vanilla
   import { createAppShell } from '@higgsfield/layout/vanilla';
   ```

3. **Check package installation:**
   ```bash
   npm list @higgsfield/layout @higgsfield/tokens @higgsfield/navigation
   ```

---

### 🎨 Theme Not Applying

**Symptoms:**
- Colors don't change when switching themes
- Components use default colors instead of theme colors

**Solutions:**

1. **Apply theme class to AppShell:**
   ```jsx
   // ✅ Correct
   <AppShell className="theme-cinematic">

   // ❌ Wrong - theme class missing
   <AppShell>
   ```

2. **Check CSS custom property support:**
   ```css
   /* Modern browsers support CSS variables */
   .test { color: var(--color-primary, #d9ff00); }
   ```

3. **Verify theme CSS is loaded:**
   - Check Network tab for `@higgsfield/tokens` requests
   - Ensure theme CSS files are bundled

---

### 📱 Responsive Issues

**Symptoms:**
- Mobile menu doesn't appear
- Sidebar doesn't hide on mobile
- Layout breaks on different screen sizes

**Solutions:**

1. **Add viewport meta tag:**
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   ```

2. **Check breakpoint definitions:**
   ```css
   /* Layout uses 1024px breakpoint */
   @media (max-width: 1023px) {
     .sidebar { display: none; }
   }
   ```

3. **Test with browser dev tools:**
   - Use responsive design mode
   - Check CSS media queries
   - Verify flexbox behavior

---

### ♿ Accessibility Problems

**Symptoms:**
- Screen readers don't announce navigation
- Keyboard navigation doesn't work
- Focus indicators missing

**Solutions:**

1. **Test with screen readers:**
   - **Windows**: NVDA or JAWS
   - **macOS**: VoiceOver
   - **Chrome**: Accessibility Developer Tools

2. **Check ARIA landmarks:**
   ```html
   <!-- Ensure proper roles -->
   <header role="banner">
   <nav role="navigation">
   <main role="main">
   ```

3. **Keyboard navigation:**
   - Tab through all interactive elements
   - Ensure logical focus order
   - Test with keyboard-only usage

---

### ⚡ Performance Issues

**Symptoms:**
- Slow initial load times
- Large bundle sizes
- Layout rendering delays

**Solutions:**

1. **Bundle analysis:**
   ```bash
   npm run build:analyze
   # Check @higgsfield/layout bundle size
   ```

2. **Lazy loading:**
   ```javascript
   // Dynamic imports for better code splitting
   const Layout = lazy(() => import('@higgsfield/layout/react'));
   ```

3. **CSS optimization:**
   - Minimize CSS custom property usage
   - Avoid deep CSS selector chains
   - Use CSS containment where possible

---

### 🔧 Framework-Specific Issues

#### React Issues

**Hook errors:**
```javascript
// Error: useAppShell must be used within AppShell provider
// Solution: Ensure AppShell wraps the component tree
<AppShell>
  <Sidebar /> {/* Can now use useAppShell() */}
</AppShell>
```

**TypeScript errors:**
```typescript
// Error: CSS properties not recognized
// Solution: Use style objects carefully
<div style={{ display: 'flex', flexDirection: 'column' }}>
```

#### Vue Issues

**Composition API errors:**
```javascript
// Error: inject() not found
// Solution: Use within AppShell component tree
<template>
  <AppShell>
    <Sidebar /> <!-- inject() works here -->
  </AppShell>
</template>
```

**Slot issues:**
```vue
<!-- Error: slot not rendering -->
<!-- Solution: Use correct slot syntax -->
<Header>
  <template #logo>
    <Logo />
  </template>
</Header>
```

#### Vanilla JS Issues

**DOM manipulation errors:**
```javascript
// Error: element is null
// Solution: Wait for DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const app = createAppShell();
  document.body.appendChild(app.element);
});
```

---

### 🌐 Browser Compatibility

**Supported browsers:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Polyfills needed:**
```javascript
// For older browsers
import 'core-js/stable';
import 'regenerator-runtime/runtime';
```

**CSS support:**
- CSS Custom Properties (CSS Variables)
- CSS Grid and Flexbox
- CSS Transforms and Animations

---

### 🛠️ Development Tools

#### Debugging Layout Issues

1. **Browser DevTools:**
   - Elements panel: Check CSS variables
   - Console: Look for layout errors
   - Network: Verify asset loading

2. **Layout Debugging:**
   ```css
   /* Add to debug layout issues */
   .debug-layout * {
     outline: 1px solid red;
   }
   ```

3. **Performance Monitoring:**
   ```javascript
   // Monitor layout performance
   const observer = new PerformanceObserver((list) => {
     for (const entry of list.getEntries()) {
       console.log('Layout shift:', entry.value);
     }
   });
   observer.observe({ entryTypes: ['layout-shift'] });
   ```

---

### 📚 Common Error Messages

#### "Cannot resolve module '@higgsfield/layout'"
```
Error: Cannot resolve module '@higgsfield/layout'
Solution: Install the package first
npm install @higgsfield/layout
```

#### "CSS custom properties not working"
```
Problem: Theme colors not applying
Solution: Import tokens CSS
import '@higgsfield/tokens';
```

#### "useAppShell must be used within AppShell provider"
```
Problem: Hook used outside AppShell
Solution: Wrap component tree with AppShell
<AppShell>
  <YourComponent />
</AppShell>
```

#### "Sidebar not collapsing on mobile"
```
Problem: Responsive behavior not working
Solution: Check viewport meta tag and media queries
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

---

### 🚨 Critical Issues

#### Layout Breaking Entire App

**Immediate fixes:**
1. Temporarily remove layout components
2. Check for CSS conflicts
3. Verify framework compatibility
4. Test in isolation

**Recovery steps:**
```javascript
// Temporarily disable layout
const DISABLE_LAYOUT = true;

function App() {
  if (DISABLE_LAYOUT) {
    return <div>Your original layout</div>;
  }

  return (
    <AppShell>
      {/* Layout components */}
    </AppShell>
  );
}
```

#### Accessibility Violations

**WCAG AA compliance checklist:**
- [ ] Color contrast ratios ≥ 4.5:1
- [ ] Keyboard navigation works
- [ ] Screen reader announcements
- [ ] Focus indicators visible
- [ ] ARIA labels present
- [ ] Semantic HTML used

**Testing tools:**
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [axe-core](https://github.com/dequelabs/axe-core)
- [WAVE](https://wave.webaim.org/)

---

### 📞 Getting Help

1. **Check documentation:** `/packages/layout/README.md`
2. **Review examples:** `/apps/` directory implementations
3. **Test demo:** `http://localhost:3000/demo/`
4. **Console logging:** Enable debug mode
5. **Community support:** Check GitHub issues

---

### 🔄 Fallback Strategies

If layout system causes issues:

#### Temporary Disable
```javascript
// Feature flag for layout system
const USE_UNIFIED_LAYOUT = false;

function App() {
  if (!USE_UNIFIED_LAYOUT) {
    return <OriginalLayout />;
  }

  return <UnifiedLayout />;
}
```

#### Progressive Enhancement
```javascript
// Load layout only if supported
function loadLayout() {
  try {
    return import('@higgsfield/layout/react');
  } catch {
    return null; // Fallback to basic layout
  }
}
```

#### CSS-Only Fallback
```css
/* Fallback styles if JS fails */
.app-fallback {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
}
```

---

*Last updated: Phase 4 Completion - Enhanced & Polished*