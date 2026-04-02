# Template System Implementation Plan

## Overview
Implement the Template Creation Module UI for all 328 templates (208 existing + 120 new matrix templates).

## Current State Analysis

### Existing Template Structure (`templates.js`)
```javascript
{
  id: 'tiktok-video',
  name: 'TikTok Video Creator',
  description: 'Create viral 9:16 videos with trending effects',
  category: 'Social Media',
  icon: '🎵',
  outputType: 'video',
  model: 'ai-video-effects',
  modelType: 'i2v',
  aspectRatio: '9:16',
  inputs: [...],
  basePrompt: '{prompt}, TikTok video format...',
  defaultParams: { resolution: '720p', duration: 5 }
}
```

### Missing Fields (Required by New UI)
- `coreUseCase` - Purpose of the template
- `uiDescription` - Detailed UI description
- `promptGoal` - What the prompt aims to achieve
- `visualStyle` - Cinematic style keywords
- `sceneBlueprint` - Scene/composition steps
- `cinematography` - Camera direction
- `enhancerKeywords` - AI enhancer keywords
- `negativePrompt` - What to avoid
- `outputPackage` - Output types to generate

## Implementation Steps

## Template Specifications Data Structure

The user is providing enhanced specifications for all 88 existing templates. Each template specification includes:

| Field | Description | Example (TikTok Video Creator) |
|-------|-------------|-------------------------------|
| Template Name | Display name | TikTok Video Creator |
| Internal Name | Template ID | `tiktok-video` |
| Category | Template category | Social Media |
| Format | Output type | Video |
| Core Use Case | Primary purpose | Viral 9:16 short videos |
| UI Description | User-facing description | Create vertical TikTok-style videos with strong opening hooks, motion, and social-native energy. |
| Prompt Goal | What the prompt achieves | Turn a simple idea into a highly watchable short-form vertical concept. |
| Visual Style | Style keywords | Trend-aware, cinematic-social, energetic, polished |
| Scene Blueprint | Scene beats | Hook frame → subject reveal → motion beat → visual payoff → CTA/end beat |
| Cinematography | Camera direction | Vertical framing, hook-first composition, dynamic close-ups, fast push-ins, punchy transitions |
| Enhancer Keywords | AI enhancer keywords | viral tiktok video, 9:16 social video, trending motion, hook-first pacing, scroll-stopping visuals |
| Negative Prompt | What to avoid | weak hook, flat pacing, generic stock look, cluttered frame, no focal subject |
| Output Package | Generated outputs | master prompt, short-form scene prompts, hook prompt, CTA ending prompt |

This data structure enables:
1. **Creative Intelligence Tiles** - Display scene blueprint, visual style, cinematography
2. **AI Enhancer** - Use enhancer keywords and negative prompts for prompt enhancement
3. **Output Tabs** - Generate outputs based on output package
4. **Dynamic UI** - Show template-specific information

## Implementation Steps

### Step 1: Create Template Specifications File
**File: `src/lib/templateSpecs.js`**

Create a lookup object mapping template IDs to their enhanced specifications:

```javascript
export const TEMPLATE_SPECS = {
  'tiktok-video': {
    coreUseCase: 'Viral 9:16 short videos',
    uiDescription: 'Create vertical TikTok-style videos with strong opening hooks, motion, and social-native energy.',
    promptGoal: 'Turn a simple idea into a highly watchable short-form vertical concept.',
    visualStyle: 'Trend-aware, cinematic-social, energetic, polished',
    sceneBlueprint: ['Hook frame', 'subject reveal', 'motion beat', 'visual payoff', 'CTA/end beat'],
    cinematography: 'Vertical framing, hook-first composition, dynamic close-ups, fast push-ins, punchy transitions',
    enhancerKeywords: 'viral tiktok video, 9:16 social video, trending motion, hook-first pacing, scroll-stopping visuals',
    negativePrompt: 'weak hook, flat pacing, generic stock look, cluttered frame, no focal subject',
    outputPackage: ['master prompt', 'short-form scene prompts', 'hook prompt', 'CTA ending prompt']
  },
  'instagram-reel': {
    // ... specs for all 88 templates
  },
  // ... more templates
};
```

**Categories covered:**
- Social Media (8 templates)
- Style Transfer (8 templates)
- Entertainment (10 templates)
- Commercial (8 templates)
- VFX & Action (6 templates)
- Portrait & Creator (7 templates)
- Decade & Era (4 templates)
- Camera & Cinematic (4 templates)

**Total: 88 template specifications**

### Step 2: Create Template Adapter
**File: `src/lib/templateAdapter.js`**

Normalizes all template types (standard, niche, matrix) into a common interface:

```javascript
import { TEMPLATE_SPECS } from './templateSpecs.js';
import { getTemplateThumbnail } from './thumbnails.js';

export function normalizeTemplate(template) {
  const specs = TEMPLATE_SPECS[template.id] || {};
  
  return {
    // Core fields
    id: template.id,
    name: template.name,
    description: specs.uiDescription || template.description,
    icon: template.icon,
    category: template.category,
    outputType: template.outputType,
    thumbnail: getTemplateThumbnail(template.id),
    
    // Enhanced fields from specs
    coreUseCase: specs.coreUseCase || template.description,
    promptGoal: specs.promptGoal || '',
    visualStyle: specs.visualStyle || '',
    sceneBlueprint: specs.sceneBlueprint || template.sceneStructure || [],
    cinematography: specs.cinematography || '',
    enhancerKeywords: specs.enhancerKeywords || '',
    negativePrompt: specs.negativePrompt || '',
    outputPackage: specs.outputPackage || ['master prompt'],
    
    // Input fields (normalized)
    inputs: normalizeInputs(template),
    
    // Generation config
    model: template.model,
    modelType: template.modelType,
    basePrompt: template.basePrompt,
    aspectRatio: template.aspectRatio || template.aspectRatios?.[0] || '16:9',
    duration: normalizeDuration(template.duration),
    
    // Original reference
    _original: template,
    _type: detectTemplateType(template)
  };
}

function normalizeInputs(template) {
  // Standard templates
  if (template.inputs) return template.inputs;
  
  // Niche templates - merge quick + advanced
  if (template.quickInputs) {
    return [
      ...template.quickInputs,
      ...(template.advancedInputs || [])
    ];
  }
  
  return [];
}

function detectTemplateType(template) {
  if (template.filmFamily) return 'matrix';
  if (template.quickInputs) return 'niche';
  return 'standard';
}

function normalizeDuration(duration) {
  if (!duration) return 5;
  if (typeof duration === 'number') return duration;
  if (duration.default) return duration.default;
  return 5;
}
```

### Step 3: Create Matrix Templates
**File: `src/lib/templateMatrix.js`**

Add the 120 new templates from the matrix:

```javascript
export const FILM_FAMILIES = {
  'cinematic-commercial': {
    blueprint: ['hook', 'intro', 'details', 'moment', 'CTA'],
    direction: 'premium commercial look, polished composition, slow dolly...'
  },
  // ... 7 more film families
};

export const NICHE_ENRICHMENT = {
  restaurant: ['cinematic food close-ups', 'steam texture plating', ...],
  // ... 11 more niches
};

export const MATRIX_TEMPLATES = [
  {
    id: 'restaurant_brand_film',
    name: 'Midnight Table Film',
    niche: 'restaurant',
    filmFamily: 'cinematic-commercial',
    // ... full template definition
  },
  // ... 119 more templates
];
```

### Step 4: Create Prompt Engine
**File: `src/lib/promptEngine.js`**

Generates 5-output prompt pack:

```javascript
export function generatePromptPack(template, formInputs) {
  const family = FILM_FAMILIES[template.filmFamily];
  const nicheTerms = NICHE_ENRICHMENT[template.niche] || [];
  
  return {
    masterPrompt: buildMasterPrompt(template, formInputs, family, nicheTerms),
    shotEnhanced: buildShotPrompt(template, formInputs, family),
    scenePack: buildScenePack(template.sceneBlueprint, formInputs),
    voiceover: buildVoiceover(template, formInputs),
    negativePrompt: template.negativePrompt || buildDefaultNegative()
  };
}
```

### Step 5: Update TemplateStudio
**File: `src/components/TemplateStudio.js` (REPLACE)**

New UI matching the React design:
- Left panel: Form fields + AI Enhancer + Advanced Controls
- Right panel: Preview + Output Tabs + Creative Intelligence
- Modal: AI Enhancement dialog

### Step 6: Update Templates Aggregation
**File: `src/lib/templates.js` (MODIFY)**

```javascript
import { MATRIX_TEMPLATES } from './templateMatrix.js';

// Combine all template sources
export const allTemplates = [
  ...templates,                    // 88 standard
  ...ALL_NICHE_TEMPLATES,          // 120 niche
  ...MATRIX_TEMPLATES              // 120 matrix
];
```

## File Summary

| File | Action | Lines | Purpose |
|------|--------|-------|---------|
| `templateSpecs.js` | CREATE | ~2000 | 88 template specifications |
| `templateAdapter.js` | CREATE | ~150 | Normalize template structures |
| `templateMatrix.js` | CREATE | ~2500 | 120 new matrix templates |
| `promptEngine.js` | CREATE | ~300 | 5-output prompt generation |
| `TemplateStudio.js` | REPLACE | ~900 | New UI component |
| `templates.js` | MODIFY | ~50 | Aggregate all sources |

## Testing Checklist

- [ ] Standard template (tiktok-video) loads with enhanced specs
- [ ] Niche template (midnight_table_film) loads with scene structure
- [ ] Matrix template loads with film family
- [ ] 5-output prompt pack generates for matrix templates
- [ ] AI Enhancer toggle works
- [ ] Advanced controls show/hide
- [ ] Generate button calls API correctly
- [ ] Thumbnail displays for all template types
- [ ] Back button navigates correctly
- [ ] All 328 templates accessible from Templates page

### Step 2: Create Template Adapter
**File: `src/lib/templateAdapter.js`**

Normalizes all template types (standard, niche, matrix) into a common interface:

```javascript
import { TEMPLATE_SPECS } from './templateSpecs.js';

export function normalizeTemplate(template) {
  const specs = TEMPLATE_SPECS[template.id] || {};
  
  return {
    // Core fields
    id: template.id,
    name: template.name,
    description: specs.uiDescription || template.description,
    icon: template.icon,
    category: template.category,
    outputType: template.outputType,
    thumbnail: getTemplateThumbnail(template.id),
    
    // Enhanced fields from specs
    coreUseCase: specs.coreUseCase || template.description,
    promptGoal: specs.promptGoal || '',
    visualStyle: specs.visualStyle || '',
    sceneBlueprint: specs.sceneBlueprint || template.sceneStructure || [],
    cinematography: specs.cinematography || '',
    enhancerKeywords: specs.enhancerKeywords || '',
    negativePrompt: specs.negativePrompt || '',
    outputPackage: specs.outputPackage || ['master prompt'],
    
    // Input fields (normalized)
    inputs: normalizeInputs(template),
    
    // Generation config
    model: template.model,
    modelType: template.modelType,
    basePrompt: template.basePrompt,
    aspectRatio: template.aspectRatio || template.aspectRatios?.[0] || '16:9',
    duration: normalizeDuration(template.duration),
    
    // Original reference
    _original: template,
    _type: detectTemplateType(template)
  };
}

function normalizeInputs(template) {
  // Standard templates
  if (template.inputs) return template.inputs;
  
  // Niche templates - merge quick + advanced
  if (template.quickInputs) {
    return [
      ...template.quickInputs,
      ...(template.advancedInputs || [])
    ];
  }
  
  return [];
}

function detectTemplateType(template) {
  if (template.filmFamily) return 'matrix';
  if (template.quickInputs) return 'niche';
  return 'standard';
}
```

### Step 3: Create Matrix Templates
**File: `src/lib/templateMatrix.js`**

Add the 120 new templates from the matrix:

```javascript
export const FILM_FAMILIES = {
  'cinematic-commercial': {
    blueprint: ['hook', 'intro', 'details', 'moment', 'CTA'],
    direction: 'premium commercial look, polished composition, slow dolly...'
  },
  // ... 7 more film families
};

export const NICHE_ENRICHMENT = {
  restaurant: ['cinematic food close-ups', 'steam texture plating', ...],
  // ... 11 more niches
};

export const MATRIX_TEMPLATES = [
  {
    id: 'restaurant_brand_film',
    name: 'Midnight Table Film',
    niche: 'restaurant',
    filmFamily: 'cinematic-commercial',
    // ... full template definition
  },
  // ... 119 more templates
];
```

### Step 4: Create Prompt Engine
**File: `src/lib/promptEngine.js`**

Generates 5-output prompt pack:

```javascript
export function generatePromptPack(template, formInputs) {
  const family = FILM_FAMILIES[template.filmFamily];
  const nicheTerms = NICHE_ENRICHMENT[template.niche] || [];
  
  return {
    masterPrompt: buildMasterPrompt(template, formInputs, family, nicheTerms),
    shotEnhanced: buildShotPrompt(template, formInputs, family),
    scenePack: buildScenePack(template.sceneBlueprint, formInputs),
    voiceover: buildVoiceover(template, formInputs),
    negativePrompt: template.negativePrompt || buildDefaultNegative()
  };
}
```

### Step 5: Update TemplateStudio
**File: `src/components/TemplateStudio.js` (REPLACE)**

New UI matching the React design:
- Left panel: Form fields + AI Enhancer + Advanced Controls
- Right panel: Preview + Output Tabs + Creative Intelligence
- Modal: AI Enhancement dialog

### Step 6: Update Templates Aggregation
**File: `src/lib/templates.js` (MODIFY)**

```javascript
import { MATRIX_TEMPLATES } from './templateMatrix.js';

// Combine all template sources
export const allTemplates = [
  ...templates,                    // 88 standard
  ...ALL_NICHE_TEMPLATES,          // 120 niche
  ...MATRIX_TEMPLATES              // 120 matrix
];
```

## File Summary

| File | Action | Lines | Purpose |
|------|--------|-------|---------|
| `templateSpecs.js` | CREATE | ~2000 | 88 template specifications |
| `templateAdapter.js` | CREATE | ~150 | Normalize template structures |
| `templateMatrix.js` | CREATE | ~2500 | 120 new matrix templates |
| `promptEngine.js` | CREATE | ~300 | 5-output prompt generation |
| `TemplateStudio.js` | REPLACE | ~900 | New UI component |
| `templates.js` | MODIFY | ~50 | Aggregate all sources |

## Testing Checklist

- [ ] Standard template (tiktok-video) loads with enhanced specs
- [ ] Niche template (midnight_table_film) loads with scene structure
- [ ] Matrix template loads with film family
- [ ] 5-output prompt pack generates for matrix templates
- [ ] AI Enhancer toggle works
- [ ] Advanced controls show/hide
- [ ] Generate button calls API correctly
- [ ] Thumbnail displays for all template types
- [ ] Back button navigates correctly
- [ ] All 328 templates accessible from Templates page
