# Plan: Apply RenderPage Design to All Platform Apps

## Goal
Convert all 50+ components to use the RenderPage.js design system — dark glass panels, `#d9ff00` primary accents, compact heroes, centered layouts — without removing any content, thumbnails, event handlers, or unique functionality.

## Reference Design (RenderPage.js)
```css
/* Container */
bg-app-bg (#050505) + centered flex column + max-w-5xl + custom-scrollbar + p-4 md:p-6

/* Hero */
createHeroSection('video', 'h-32 md:h-44 mb-4')  /* compact */

/* Content Cards */
bg-[#111]/90 backdrop-blur-xl border border-white/10 rounded-[1.5rem] shadow-3xl

/* Action Buttons */
bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/30 rounded-2xl
  + icon container: bg-primary/20 rounded-xl + text-primary SVGs

/* Primary CTA */
bg-primary text-black font-black rounded-xl hover:scale-105 hover:shadow-glow
```

---

## Changes by Category

### CATEGORY A: Marketing/Landing Pages (13 files) — FULL REWRITE
These currently use `bg-black`, gradient heroes, `max-w-7xl`, multi-section marketing layouts with footers. Convert to RenderPage glass panel style.

**Files:**
1. `src/components/EffectsPage.js`
2. `src/components/CharacterPage.js`
3. `src/components/StoryboardPage.js`
4. `src/components/CinemaPage.js`
5. `src/components/CommercialPage.js`
6. `src/components/ImageToImagePage.js`
7. `src/components/ImageToVideoPage.js`
8. `src/components/TextToImagePage.js`
9. `src/components/TextToVideoPage.js`
10. `src/components/VideoToVideoPage.js`
11. `src/components/VideoWatermarkPage.js`
12. `src/components/InfluencerPage.js`
13. `src/components/UpscalePage.js`

**What changes:**
- Container: `bg-black` → `bg-app-bg` with standard studio container classes
- Layout: Multi-section marketing → single centered view with `max-w-5xl`
- Hero: Gradient overlays → `createHeroSection(type, 'h-32 md:h-44 mb-4')`
- Cards: `bg-white/5 border-white/10` → `bg-[#111]/90 backdrop-blur-xl border-white/10 rounded-[1.5rem] shadow-3xl`
- CTA buttons: `bg-white text-black rounded-full` → `bg-primary text-black rounded-xl hover:shadow-glow`
- Accent colors: Per-page gradients → unified `#d9ff00` primary
- Remove: gradient hero overlays, logos strip, footer section
- Keep: ALL text content, model arrays, example prompts, event handlers, navigation targets, localStorage logic, thumbnail references

**New structure per page:**
```js
export function XxxPage() {
  const container = document.createElement('div');
  container.className = 'w-full h-full flex flex-col items-center bg-app-bg relative p-4 md:p-6 overflow-y-auto custom-scrollbar overflow-x-hidden';

  const inner = document.createElement('div');
  inner.className = 'w-full max-w-5xl';

  // 1. Hero (compact, using createHeroSection if thumbnail exists)
  // 2. Content cards in bg-[#111]/90 glass panels
  // 3. Preserved event handlers

  container.appendChild(inner);
  return container;
}
```

**Per-page specific content to preserve:**
| Page | heroType | Navigate Target | Unique Sections |
|------|----------|----------------|-----------------|
| EffectsPage | 'effects' | 'effects' | Effects categories, popular effects |
| CharacterPage | 'character' | 'character' | Models, example prompts |
| StoryboardPage | 'storyboard' | 'storyboard' | Shot types, example frames |
| CinemaPage | 'cinema' | 'cinema' | Camera angles, lens types, example shots |
| CommercialPage | 'commercial' | 'commercial' | Scene presets, export formats |
| ImageToImagePage | 'edit' | 'edit' | 21 models with data-model, 5 examples, localStorage |
| ImageToVideoPage | 'video' | 'video' | 19 models with data-model, 5 examples, localStorage |
| TextToImagePage | 'image' | 'image' | 27 models with data-model, 5 examples, localStorage |
| TextToVideoPage | 'video' | 'video' | 28 models with data-model, 5 examples, localStorage |
| VideoToVideoPage | 'video' | 'video' | 4 tools with data-model, 3 examples, localStorage |
| VideoWatermarkPage | 'video' | 'video' | How It Works steps, 3 tools with data-model |
| InfluencerPage | 'influencer' | 'influencer' | Style presets, format presets |
| UpscalePage | 'upscale' | 'upscale' | Upscale methods, upscale factors |

---

### CATEGORY B: Studio Components (17 files) — HERO + SPACING UPDATE
These already use `bg-app-bg` and glass panels. Standardize hero size and spacing.

**Files:**
1. `src/components/ImageStudio.js` — hero: `h-40 md:h-56` → `h-32 md:h-44`, margin: `mb-10 md:mb-20` → `mb-8 md:mb-12`
2. `src/components/VideoStudio.js` — same as above
3. `src/components/CinemaStudio.js` — hero: `h-44 md:h-64` → `h-32 md:h-44`, margin update
4. `src/components/CharacterStudio.js` — hero: `h-36 md:h-48` → `h-32 md:h-44`
5. `src/components/ChatStudio.js` — same
6. `src/components/AudioStudio.js` — same
7. `src/components/AvatarStudio.js` — same
8. `src/components/TrainingStudio.js` — same
9. `src/components/VideoToolsStudio.js` — same
10. `src/components/EditStudio.js` — hero already `h-32 md:h-44` ✓
11. `src/components/UpscaleStudio.js` — hero: `h-36 md:h-48` → `h-32 md:h-44`
12. `src/components/EffectsStudio.js` — hero already `h-32 md:h-44` ✓
13. `src/components/StoryboardStudio.js` — hero already `h-32 md:h-44` ✓
14. `src/components/CommercialStudio.js` — hero: `h-36 md:h-48` → `h-32 md:h-44`
15. `src/components/InfluencerStudio.js` — hero: `h-36 md:h-48` → `h-32 md:h-44`
16. `src/components/TemplateStudio.js` — no hero banner, leave as-is
17. `src/components/LipSyncStudio.js` — custom hero, leave as-is

**What changes per file:**
- Hero section class: update height to `h-32 md:h-44`
- Hero section class: update margin to `mb-4`
- Content wrapper: add `max-w-5xl` if missing (some use `max-w-4xl`)
- No content removal

---

### CATEGORY C: Hub/List Pages (6 files) — CARD STYLE + CONTAINER UPDATE
These use `bg-app-bg` already but have different card styles.

**Files:**
1. `src/components/AppsHub.js`
2. `src/components/ExplorePage.js`
3. `src/components/TemplatesPage.js`
4. `src/components/CommunityPage.js`
5. `src/components/LibraryPage.js`
6. `src/components/AssistPage.js`

**What changes:**
- Cards: `bg-white/[0.03] border-white/5` → `bg-[#111]/90 backdrop-blur-xl border-white/10 rounded-[1.5rem] shadow-3xl`
- Inner container: keep `max-w-6xl` (grid layout needs wider container)
- Section spacing: standardize padding
- No content removal, all thumbnails preserved

---

### CATEGORY D: Other Pages (5 files) — MINOR UPDATES
1. `src/components/DirectorPage.js` — complex multi-panel, leave layout as-is, no changes
2. `src/components/EditorPage.js` — complex NLE, leave layout as-is, no changes
3. `src/components/VideoAgentPage.js` — update hero size if needed
4. `src/components/PlaceholderPage.js` — update card style to glass panels
5. `src/components/Page404.js` — update card style to glass panels

---

## Execution Order

### Phase 1: CSS Foundation (if any shared classes need adding)
- Review `src/styles/global.css` for any new reusable component classes needed
- Add `.glass-card` shorthand if useful: `bg-[#111]/90 backdrop-blur-xl border border-white/10 rounded-[1.5rem] shadow-3xl`

### Phase 2: Marketing Pages (Category A) — 13 files
Rewrite each marketing page one at a time. For each:
1. Read the current file
2. Extract all unique data (models, prompts, text, navigation targets, event handlers)
3. Rewrite the container + layout to match RenderPage style
4. Re-insert all unique content inside glass panels
5. Preserve all event handlers and localStorage logic

### Phase 3: Studio Components (Category B) — 9 files that need hero updates
Update hero sizes and margins. Simple find-and-replace on hero class strings.

### Phase 4: Hub/List Pages (Category C) — 6 files
Update card styles and container widths.

### Phase 5: Other Pages (Category D) — 2-3 files
Minor card style updates.

---

## CSS Changes (Minimal)
File: `src/styles/global.css`

Add a reusable glass card class if not already sufficient:
```css
.glass-card {
    @apply bg-[#111]/90 backdrop-blur-xl border border-white/10 rounded-[1.5rem] shadow-3xl;
}
```

This is optional — inline Tailwind classes work too. The existing `.glass` class uses `bg-black/80` which is slightly different from RenderPage's `bg-[#111]/90`.

---

## What Will NOT Change
- No content removal (all text, models, prompts, thumbnails preserved)
- No event handler removal
- No navigation target changes
- No localStorage logic changes
- No import changes (unless adding createHeroSection import)
- DirectorPage and EditorPage complex layouts untouched
- Sidebar.js and Header.js untouched
- All CSS variables and Tailwind config untouched
- Router logic untouched
