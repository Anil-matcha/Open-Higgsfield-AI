# StoryboardPage.js Refactoring Plan

## Overview
Refactor StoryboardPage.js to use the approved cinematic glass morphism design system from `cinematicTheme.js` while preserving the existing AI hero section exactly as-is.

## Current Implementation Analysis

### Already Using Design System (Good)
- `glassPanel()` - Used for main panels
- `glassCard()` - Used for feature cards
- `chipButton()` - Used for shot type pills
- `actionButton({ variant: 'primary' })` - Used for CTA button
- `cx()` - Used for class composition

### Gaps - Not Using Design System Functions
1. **Page wrapper** - Uses inline classes: `'w-full h-full flex flex-col items-center relative overflow-y-auto custom-scrollbar overflow-x-hidden'`
   - Should use: `pageShell()` or a dedicated container function

2. **Text styling** - Uses inline classes like:
   - `text-xl font-black` (should use `CINEMATIC_THEME.text.sectionTitle`)
   - `text-sm text-white/50` (should use `CINEMATIC_THEME.text.bodySoft`)
   - `text-white/60` (should use `CINEMATIC_THEME.text.body`)
   - `text-base font-black` (should use `CINEMATIC_THEME.text.title`)
   - `text-xs font-semibold` (should use smaller text variant)

3. **Feature icons** - Uses `text-3xl` directly

4. **Example frame shot type badge** - Uses hardcoded Tailwind classes:
   - `rounded-lg bg-indigo-500/12 text-indigo-300 text-xs font-semibold px-3 py-1 border border-indigo-500/20`
   - Should use a consistent badge pattern from the design system

## Refactoring Todo List

### Step 1: Update Imports
Add missing imports from `cinematicTheme.js`:
- Import `CINEMATIC_THEME` for text constants
- Import any additional helpers if needed

### Step 2: Refactor Page Container
- Replace inline container classes with design system
- Create or use `pageShell()` equivalent
- Preserve: `relative overflow-y-auto custom-scrollbar overflow-x-hidden`

### Step 3: Refactor Text Styling
Replace inline text classes with design system constants:
- Section headers → `text.sectionTitle`
- Body text → `text.body` or `text.bodySoft`
- Keep existing font weights where needed

### Step 4: Refactor Feature Cards
- Already using `glassCard()` - good
- Add text styling from design system

### Step 5: Refactor Shot Type Pills
- Already using `chipButton()` - good
- Consider adding active state support if needed

### Step 6: Refactor Example Frame Badges
- Create consistent badge styling using design system
- Replace hardcoded indigo classes

### Step 7: Verify Hero Section
- Confirm hero is completely untouched
- Verify it still works correctly

## What To Keep Unchanged (CONSTRAINTS)

| Element | Action |
|---------|--------|
| AI Hero (lines 24-38) | DO NOT TOUCH |
| navigate() import | Keep |
| createHeroSection import | Keep |
| SHOT_TYPES data | Keep |
| FEATURES data | Keep |
| EXAMPLE_PROMPTS data | Keep |
| Event handlers | Keep |
| Business logic | Keep |

## Implementation Order

1. Update import statement (add CINEMATIC_THEME)
2. Refactor page container
3. Refactor text styling throughout
4. Refactor example frame badges
5. Verify hero remains unchanged
6. Verify no syntax errors