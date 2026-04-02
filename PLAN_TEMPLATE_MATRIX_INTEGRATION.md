# Updated Plan: Template Matrix Integration

## Enhancement Summary
The 120-template matrix transforms the template system from ad-hoc structures to a unified, scalable architecture with film family mapping and 5-output prompt packs.

## New Data Architecture

### Template Matrix Structure
```javascript
// src/lib/templateMatrix.js (NEW)
export const FILM_FAMILIES = {
  'cinematic-commercial': {
    blueprint: ['hook', 'space or brand intro', 'hero details', 'human value moment', 'brand reveal / CTA'],
    promptDirection: 'premium commercial look, polished composition, slow dolly or tracking movement, controlled lighting, clear subject focus'
  },
  'promo-film': {
    blueprint: ['opening atmosphere', 'offer or service intro', 'value demonstration', 'offer reveal', 'CTA'],
    promptDirection: 'conversion-aware visuals, persuasive product/service framing, elegant momentum, clean CTA ending'
  },
  // ... 6 more film families
};

export const NICHE_ENRICHMENT = {
  restaurant: ['cinematic food close-ups', 'steam texture plating details', 'warm hospitality atmosphere', 'kitchen action shots', 'guest experience moments'],
  'med-spa': ['luxury treatment rooms', 'clean premium interiors', 'close-up skincare details', 'client glow-up moments', 'elegant beauty-commercial tone'],
  // ... 10 more niches
};

export const CAMERA_TERMS = [
  'slow dolly movements',
  'shallow depth of field', 
  'close-up detail shots',
  'dynamic camera motion',
  'atmospheric lighting',
  'emotionally engaging pacing'
];

// The 120-template matrix
export const TEMPLATE_MATRIX = {
  // 12 niche packs × 10 templates each
  restaurant: [
    {
      publicName: 'Midnight Table Film',
      internalName: 'restaurant_brand_film',
      templateFormat: 'Brand Film',
      filmFamily: 'cinematic-commercial',
      uiDescription: 'Flagship restaurant brand piece for premium positioning and reservations.',
      storyBlueprint: ['hook', 'location intro', 'food hero details', 'guest dining moment', 'brand reveal'],
      defaultPromptDirection: 'warm hospitality atmosphere, cinematic food close-ups, steam and plating detail, ambient tungsten glow, slow pan, premium dining textures'
    },
    // ... 9 more restaurant templates
  ],
  'med-spa': [ /* 10 templates */ ],
  salon: [ /* 10 templates */ ],
  fitness: [ /* 10 templates */ ],
  'real-estate': [ /* 10 templates */ ],
  dental: [ /* 10 templates */ */,
  chiropractic: [ /* 10 templates */ ],
  legal: [ /* 10 templates */ ],
  automotive: [ /* 10 templates */ */,
  fashion: [ /* 10 templates */ */,
  events: [ /* 10 templates */ */,
  luxury: [ /* 10 templates */ */
};

// Helper to get all templates as flat array
export function getAllTemplates() {
  const templates = [];
  for (const [niche, nicheTemplates] of Object.entries(TEMPLATE_MATRIX)) {
    for (const template of nicheTemplates) {
      templates.push({
        ...template,
        id: template.internalName,
        name: template.publicName,
        niche,
        category: getNicheDisplayName(niche),
        icon: getNicheIcon(niche),
        outputType: 'video' // All templates are video
      });
    }
  }
  return templates;
}

export function getTemplateById(id) {
  return getAllTemplates().find(t => t.id === id);
}

export function getTemplateByNiche(niche) {
  return TEMPLATE_MATRIX[niche] || [];
}
```

### 5-Output Prompt Engine
```javascript
// src/lib/promptEngine.js (NEW)
export function generatePromptPack(template, formInputs) {
  const filmFamily = FILM_FAMILIES[template.filmFamily];
  const nicheTerms = NICHE_ENRICHMENT[template.niche] || [];
  
  return {
    masterPrompt: buildMasterPrompt(template, formInputs, filmFamily, nicheTerms),
    shotEnhancedPrompt: buildShotPrompt(template, formInputs, filmFamily),
    scenePromptPack: buildScenePack(template.storyBlueprint, formInputs),
    voiceoverDirection: buildVoiceover(template, formInputs),
    negativePrompt: buildNegativePrompt()
  };
}

function buildMasterPrompt(template, inputs, filmFamily, nicheTerms) {
  return cleanPrompt([
    inputs.prompt || template.defaultPromptDirection,
    template.templateFormat,
    ...filmFamily.promptDirection.split(', '),
    ...CAMERA_TERMS,
    ...nicheTerms,
    ...template.storyBlueprint,
    inputs.setting,
    inputs.subject,
    inputs.extraInstructions
  ].filter(Boolean).join(', '));
}

function buildShotPrompt(template, inputs, filmFamily) {
  return cleanPrompt([
    'shot-level detail',
    ...CAMERA_TERMS,
    filmFamily.promptDirection,
    inputs.aspectRatio ? `aspect ratio: ${inputs.aspectRatio}` : '',
    inputs.duration ? `duration: ${inputs.duration}s` : ''
  ].filter(Boolean).join(', '));
}

function buildScenePack(blueprint, inputs) {
  return blueprint.map((scene, i) => ({
    beat: i + 1,
    name: scene,
    direction: `Scene ${i + 1}: ${scene}`
  }));
}

function buildVoiceover(template, inputs) {
  return cleanPrompt([
    `Create a premium voiceover for a ${template.templateFormat}`,
    inputs.audience ? `speak to ${inputs.audience}` : 'speak to the ideal viewer',
    'open with a fast hook',
    'build emotional or commercial momentum',
    inputs.cta ? `end with: ${inputs.cta}` : 'end with a clear call to action'
  ].join(', '));
}

function buildNegativePrompt() {
  return 'avoid generic visuals, avoid flat lighting, avoid repetitive cinematic wording, avoid cluttered frames, avoid weak subject focus, avoid conflicting styles';
}
```

## Updated Component Architecture

### TemplateStudio (Enhanced)
The TemplateStudio now:
1. Loads template from matrix via `getTemplateById()`
2. Uses consistent template structure (no more inputs vs quickInputs confusion)
3. Generates 5-output prompt pack
4. Displays film family blueprint
5. Shows niche enrichment

### Template Data Flow
```
[Template Click] 
    ↓
[Load from MATRIX via ID]
    ↓
[Extract: name, description, niche, filmFamily, storyBlueprint, promptDirection]
    ↓
[Render Form with dynamic fields based on template type]
    ↓
[User Input + AI Enhancer]
    ↓
[Generate 5-Output Prompt Pack]
    ↓
[API Call with masterPrompt]
    ↓
[Display Result + All 5 Outputs]
```

## UI Integration

### Header Section (Carried Over Data)
- Template `publicName` → Title
- Template `uiDescription` → Subtitle
- Template `niche` → Niche pill
- Template `templateFormat` → Format pill
- Template thumbnail → Image area

### Creative Intelligence Tiles (New Data)
1. **Auto-Detected Niche** - From template or inferred
2. **Scene Structure** - From `storyBlueprint` array
3. **Cinematic Enrichment** - From `filmFamily.promptDirection`
4. **Template Logic** - Film family + niche combination
5. **Reusable Pattern** - How this template's blueprint works

### Output Tabs (5-Output Pack)
1. **Master Prompt** - Main generation prompt
2. **Shot Enhanced** - Camera/lens/lighting details
3. **Scene Beats** - Scene-by-scene breakdown
4. **Voiceover Direction** - VO script direction
5. **Negative Prompt** - What to avoid

## Implementation Steps (Updated)

### Step 1: Create Template Matrix Module
Create `src/lib/templateMatrix.js` with:
- FILM_FAMILIES definitions (8 families)
- NICHE_ENRICHMENT data (12 niches × 5 terms)
- CAMERA_TERMS array
- TEMPLATE_MATRIX object (120 templates)
- Helper functions: getAllTemplates, getTemplateById, getTemplateByNiche

### Step 2: Create Prompt Engine Module
Create `src/lib/promptEngine.js` with:
- generatePromptPack() - Main function
- buildMasterPrompt() - Builds main prompt
- buildShotPrompt() - Builds shot-level prompt
- buildScenePack() - Builds scene breakdown
- buildVoiceover() - Builds VO direction
- buildNegativePrompt() - Builds negative prompt
- cleanPrompt() - Cleans and formats

### Step 3: Update TemplateStudio Component
Modify `src/components/TemplateStudio.js` to:
- Import from templateMatrix instead of templates
- Use consistent template structure
- Call generatePromptPack() for 5 outputs
- Display film family and blueprint info
- Show niche enrichment terms

### Step 4: Update Router
No changes needed - `template/:id` route already works.

### Step 5: Migrate Existing Templates
Option A: Replace templates.js entirely with templateMatrix.js
Option B: Keep templates.js for backward compatibility, add matrix as new layer

**Recommendation**: Option A - Cleaner architecture, no duplication.

## Benefits of This Enhancement

1. **Consistency**: All 120 templates follow same structure
2. **Scalability**: Add templates by adding matrix rows
3. **Maintainability**: Film families and niches are centralized
4. **Quality**: 5-output prompt pack ensures comprehensive generation
5. **Flexibility**: Easy to add new film families or niches

## File Changes Summary

| File | Action | Purpose |
|------|--------|---------|
| `src/lib/templateMatrix.js` | CREATE | Template matrix + film families |
| `src/lib/promptEngine.js` | CREATE | 5-output prompt generation |
| `src/components/TemplateStudio.js` | MODIFY | Use matrix + prompt engine |
| `src/lib/templates.js` | DEPRECATE | Replaced by matrix |

## Testing Matrix

Test with templates from each niche:
- [ ] Restaurant: Midnight Table Film
- [ ] Med Spa: Velvet Glow Film  
- [ ] Salon: Final Cut Film
- [ ] Fitness: Iron Frame Film
- [ ] Real Estate: Open Door Film
- [ ] Dental: Smile Frame Film
- [ ] Wellness: Return to Balance Film
- [ ] Legal: Authority Case Film
- [ ] Automotive: Chrome Story Film
- [ ] Fashion: Vogue Motion Film
- [ ] Events: Highlight Film
- [ ] Luxury: House of Light Film

Verify:
- [ ] Template loads with correct data
- [ ] 5 outputs generate correctly
- [ ] Film family blueprint displays
- [ ] Niche enrichment applies
- [ ] Generation uses masterPrompt
