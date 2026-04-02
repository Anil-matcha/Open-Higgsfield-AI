# Consolidated Plan: Complete Template System Implementation

## Summary
Implement the Template Creation Module UI for ALL templates while preserving the existing 208 templates and ADDING 120 new templates from the matrix. Total: 328 templates.

## Template Inventory

### Existing Templates (KEEP - 208 total)
| Source | Count | Structure | Status |
|--------|-------|-----------|--------|
| `templates.js` | 88 | Standard with `inputs[]` | KEEP |
| `nicheTemplates.js` | 40 | Niche with `quickInputs[]` + `advancedInputs[]` | KEEP |
| `nicheTemplatesPart2.js` | 40 | Niche with `quickInputs[]` + `advancedInputs[]` | KEEP |
| `nicheTemplatesPart3.js` | 40 | Niche with `quickInputs[]` + `advancedInputs[]` | KEEP |
| **Subtotal** | **208** | | |

### New Templates (ADD - 120 total)
| Source | Count | Structure | Status |
|--------|-------|-----------|--------|
| `templateMatrix.js` (NEW) | 120 | Matrix with `filmFamily`, `storyBlueprint`, etc. | ADD |
| **Grand Total** | **328** | | |

## Implementation Phases

### Phase 1: Template Creation Module UI
Build the UI that works with ALL 328 templates.

**File: `src/components/TemplateStudio.js` (REPLACE)**
- Loads ANY template by ID (existing or new)
- Adapts UI based on template structure
- Carries over: name, description, thumbnail, category, inputs
- Displays appropriate form fields based on template type

**File: `src/lib/templateAdapter.js` (NEW)**
- Normalizes different template structures into a common format
- Handles: standard templates, niche templates, matrix templates
- Returns consistent interface for the UI

### Phase 2: 120-Template Matrix Addition
Add the new templates without touching existing ones.

**File: `src/lib/templateMatrix.js` (NEW)**
- Contains 120 new templates in matrix format
- Organized by 12 niche packs × 10 templates
- Includes film families, story blueprints, prompt directions
- Exports: `MATRIX_TEMPLATES`, `FILM_FAMILIES`, `NICHE_ENRICHMENT`

**File: `src/lib/promptEngine.js` (NEW)**
- Generates 5-output prompt pack for matrix templates
- Uses film family + niche enrichment + camera terms
- Outputs: master_prompt, shot_enhanced, scene_pack, voiceover, negative

### Phase 3: Template Aggregation
Combine all templates into unified access layer.

**File: `src/lib/templates.js` (MODIFY)**
- Import matrix templates
- Export combined `allTemplates = [...templates, ...ALL_NICHE_TEMPLATES, ...MATRIX_TEMPLATES]`
- Update `getTemplateById()` to search all sources
- Update `getAllCategories()` to include matrix categories

## File Changes

| File | Action | Purpose |
|------|--------|---------|
| `src/components/TemplateStudio.js` | REPLACE | New UI for all templates |
| `src/lib/templateAdapter.js` | CREATE | Normalize template structures |
| `src/lib/templateMatrix.js` | CREATE | 120 new templates |
| `src/lib/promptEngine.js` | CREATE | 5-output prompt generation |
| `src/lib/templates.js` | MODIFY | Aggregate all templates |
| `src/lib/nicheTemplates.js` | KEEP | Existing 40 niche templates |
| `src/lib/nicheTemplatesPart2.js` | KEEP | Existing 40 niche templates |
| `src/lib/nicheTemplatesPart3.js` | KEEP | Existing 40 niche templates |

## Template Adapter Architecture

The adapter normalizes ALL template types into a common interface:

```javascript
// src/lib/templateAdapter.js
export function normalizeTemplate(template) {
  // Detect template type
  const type = detectTemplateType(template);

  return {
    // Common fields (all templates)
    id: template.id || template.internalName,
    name: template.name || template.publicName,
    description: template.description || template.uiDescription,
    icon: template.icon || getIconForType(type),
    category: template.category || template.niche,
    outputType: template.outputType || 'video',
    thumbnail: getTemplateThumbnail(template.id),

    // Input fields (normalized)
    inputs: normalizeInputs(template, type),

    // Generation config
    model: template.model || inferModel(template),
    modelType: template.modelType || inferModelType(template),
    basePrompt: template.basePrompt || buildBasePrompt(template),
    aspectRatio: template.aspectRatio || template.aspectRatios?.[0] || '16:9',
    duration: normalizeDuration(template.duration),

    // Matrix-specific fields (optional)
    filmFamily: template.filmFamily,
    storyBlueprint: template.storyBlueprint,
    promptDirection: template.promptDirection,
    niche: template.niche,

    // Original template reference
    _original: template,
    _type: type // 'standard' | 'niche' | 'matrix'
  };
}

function detectTemplateType(template) {
  if (template.filmFamily) return 'matrix';
  if (template.quickInputs || template.advancedInputs) return 'niche';
  return 'standard';
}

function normalizeInputs(template, type) {
  if (type === 'standard') return template.inputs || [];
  if (type === 'niche') return [...(template.quickInputs || []), ...(template.advancedInputs || [])];
  if (type === 'matrix') return generateMatrixInputs(template);
  return [];
}
```

## UI Behavior by Template Type

### Standard Templates (88)
- Form fields from `inputs[]`
- Direct API generation using `model`, `modelType`, `basePrompt`
- Simple prompt enhancement

### Niche Templates (120)
- Form fields from `quickInputs[]` + `advancedInputs[]`
- Advanced controls shown by default
- Scene structure displayed
- Niche enrichment applied

### Matrix Templates (120)
- Form fields generated from template metadata
- 5-output prompt pack displayed
- Film family blueprint shown
- Niche enrichment from matrix
- Shot-enhanced prompts available

## 5-Output Prompt Pack (Matrix Templates Only)

When generating with matrix templates, users get 5 outputs:

1. **Master Prompt** - Main generation prompt
2. **Shot Enhanced** - Camera/lens/lighting details
3. **Scene Pack** - Beat-by-beat breakdown
4. **Voiceover Direction** - VO script direction
5. **Negative Prompt** - What to avoid

## Template Selection UI

The Templates page shows all 328 templates:

```
[All] [Standard] [Niche] [Matrix]

Standard Templates (88)
├── Social Media (10)
├── Style Transfer (8)
├── Entertainment (10)
├── ...

Niche Templates (120)
├── Restaurant & Cafe (10)
├── Med Spa & Beauty (10)
├── Salon & Barbershop (10)
├── ...

Matrix Templates (120)
├── Restaurant Matrix (10)
├── Med Spa Matrix (10)
├── Salon Matrix (10)
├── ...
```

Users can filter by:
- Template type (Standard/Niche/Matrix)
- Category/Niche
- Film family
- Output type

## Implementation Order

### Step 1: Template Adapter (Foundation)
Create `templateAdapter.js` to normalize all template types.

### Step 2: Template Creation Module UI
Build the new UI that works with the adapter.

### Step 3: Matrix Templates
Add the 120 new templates to `templateMatrix.js`.

### Step 4: Prompt Engine
Create the 5-output prompt generation system.

### Step 5: Integration
Wire everything together in `templates.js`.

### Step 6: Testing
Test with templates from each type:
- 5 standard templates
- 5 niche templates
- 5 matrix templates

## Benefits

1. **No Breaking Changes**: All 208 existing templates preserved
2. **Enhanced Capabilities**: 120 new templates with advanced features
3. **Unified UI**: One component handles all template types
4. **Gradual Migration**: Can upgrade existing templates over time
5. **Scalable**: Easy to add more templates to any category

## Testing Checklist

### Standard Templates
- [ ] TikTok Video Creator loads correctly
- [ ] Form fields display properly
- [ ] Generation works with existing API

### Niche Templates
- [ ] Midnight Table Film loads correctly
- [ ] Quick + advanced inputs display
- [ ] Scene structure shows

### Matrix Templates
- [ ] New matrix templates load
- [ ] 5-output pack generates
- [ ] Film family blueprint displays
- [ ] Niche enrichment applies

### Cross-Type Features
- [ ] Thumbnail carries over for all types
- [ ] Name/description display correctly
- [ ] Category filtering works
- [ ] Search finds all templates

## Total Line Count Estimate

| File | Lines | Purpose |
|------|-------|---------|
| templateAdapter.js | 200 | Normalize templates |
| templateMatrix.js | 2500 | 120 templates data |
| promptEngine.js | 400 | 5-output generation |
| TemplateStudio.js | 900 | UI component |
| templates.js changes | 100 | Aggregation |
| **Total** | **4100** | |
