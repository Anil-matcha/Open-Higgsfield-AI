# Plan: Template Creation Module UI Implementation

## Overview
Implement the Template Creation Module UI that displays when clicking any template thumbnail. The page carries over the template's thumbnail, name, description, category, and input fields to populate the enhanced editor shell.

## Current State
- **Templates**: 200+ templates (88 standard + 120+ niche) in `src/lib/templates.js` and niche files
- **TemplateStudio**: Simple form generator at `src/components/TemplateStudio.js`
- **Router**: `template/:id` route loads `TemplateStudio(templateId)`
- **Input Structure**: Standard templates use `inputs[]`, niche templates use `quickInputs[]` + `advancedInputs[]`

## Files to Modify

### 1. `src/components/TemplateStudio.js` (REPLACE)
Replace entire component with new Template Creation Module UI that:
- Accepts `templateId` parameter
- Loads template via `getTemplateById(templateId)`
- Loads thumbnail via `getTemplateThumbnail(templateId)`
- Renders the enhanced UI with all template data carried over

### 2. `src/lib/templates.js` (MODIFY)
Add helper functions:
- `getTemplateInputs(template)` - Merges `inputs`, `quickInputs`, `advancedInputs`
- `getTemplateConfig(template)` - Returns normalized config for both template types
- `inferNicheFromTemplate(template)` - Auto-detects niche from template data

### 3. `src/lib/templateEnhancer.js` (NEW)
Create AI enhancement logic module:
- `enhanceFieldValue(fieldKey, value, form)` - Enhances individual fields
- `buildOutputs(form)` - Builds enhanced prompt, scene beats, voiceover, negative prompt
- `inferNiche(prompt)` - Detects niche from prompt text
- `cleanPrompt(text)` - Cleans and formats prompt text
- All the visual style buckets, niche enrichment data, story structures, camera terms

### 4. `src/styles/template-creation.css` (NEW - optional)
Extract complex CSS into dedicated stylesheet if needed for maintainability.

## Implementation Steps

### Step 1: Create Template Enhancer Module
Create `src/lib/templateEnhancer.js` with:
```
- visualStyleBuckets (luxury, dramatic, documentary, commercial)
- nicheEnrichment (12 niches with 5 terms each)
- storyStructures (8 film types with scene beats)
- cameraTerms array
- filmTypes array
- niches array
- effects array
- aspectRatios, durations arrays
- Helper functions: inferNiche, uniqueTerms, cleanPrompt, enhanceFieldValue, buildOutputs
```

### Step 2: Create TemplateStudio Component
Replace `src/components/TemplateStudio.js` with new component that:

**Data Loading:**
```javascript
export function TemplateStudio(templateId) {
  const template = getTemplateById(templateId);
  if (!template) return createNotFound();
  
  const thumbnailUrl = getTemplateThumbnail(templateId);
  const inputs = getTemplateInputs(template); // merges inputs/quickInputs/advancedInputs
  const config = getTemplateConfig(template); // normalizes model, modelType, etc.
}
```

**UI Structure (matching provided design):**
1. **Header Section**
   - Back button → navigate('templates')
   - Template thumbnail (carried over from template data)
   - Template name (carried over)
   - Template description (carried over)
   - Pills: outputType, category

2. **Left Panel (520px)**
   - Dynamic form fields based on template inputs
   - Each field maps template input type to UI component:
     - `image` → Upload area
     - `text` → Input field
     - `textarea` → Textarea
     - `select` → Select dropdown
   - Enhancer buttons on text fields
   - AI Enhancer toggle + Advanced Controls section
   - Generate button

3. **Right Panel**
   - Preview area with template thumbnail
   - Status pills: templateType, detectedNiche, aspectRatio, duration
   - Output tabs: Enhanced Prompt, Scene Beats, Voiceover, Negative Prompt
   - Editable output textarea with wand button

4. **Creative Intelligence Section**
   - 5 insight tiles with template-specific data
   - Auto-detected niche, Scene structure, Cinematic enrichment, etc.

5. **Enhance Modal**
   - Wand button opens modal for AI enhancement
   - Current content textarea
   - Enhancement instruction textarea
   - Enhance with AI button

**Form State Management:**
```javascript
const formState = {
  // Dynamic fields from template inputs
  ...Object.fromEntries(inputs.map(i => [i.name, ''])),
  
  // AI Enhancer fields
  aiEnhancer: true,
  showAdvanced: false,
  templateType: 'promo-film',
  niche: 'auto-detect',
  visualStyle: 'luxury',
  businessType: '',
  audience: '',
  subject: '',
  setting: '',
  cta: '',
  extraInstructions: '',
  
  // Drafts
  tileDrafts: {},
  outputDrafts: {},
  enhancedFields: {},
};
```

### Step 3: Template Data Mapping
Map template fields to UI:

| Template Field | UI Location | Notes |
|---------------|-------------|-------|
| `name` | Header title | Direct display |
| `description` | Header subtitle | Direct display |
| `icon` | Header thumbnail area | Fallback if no thumbnail |
| `category` | Pills row | Direct display |
| `outputType` | Pills row | "Video" or "Image" |
| `inputs[]` | Left panel form | Dynamic field generation |
| `quickInputs[]` | Left panel form (primary) | Merged with inputs |
| `advancedInputs[]` | Left panel form (advanced) | Shown in advanced section |
| `aspectRatio` / `aspectRatios` | Select field | Single or array |
| `duration` | Select field | Number or {min,max,default} |
| `model` | Generation config | Hidden from user |
| `modelType` | Generation config | Determines API call type |
| `basePrompt` | Enhanced prompt generation | Used in prompt building |
| `sceneStructure` | Scene Beats tab | Direct display |
| `outputStyle` | Visual style inference | Maps to visualStyle bucket |
| `niche` | Auto-detected niche | From template or inferred |

### Step 4: Niche Template Handling
For niche templates (missing `model`, `modelType`, `basePrompt`):
- Use `outputStyle` to infer visual style bucket
- Use `sceneStructure` for scene beats
- Use `niche` property for enrichment terms
- Generate default model/type based on `outputType` and template context
- Build synthetic `basePrompt` from template metadata

### Step 5: Generation Flow
When Generate is clicked:
1. Collect all form field values
2. If AI Enhancer is on:
   - Run `enhanceFieldValue()` on prompt field
   - Run `buildOutputs()` to generate all outputs
3. Build API params:
   - Standard templates: Use `model`, `modelType`, `basePrompt`
   - Niche templates: Infer model from context, build prompt from scene structure
4. Call appropriate `muapi` method
5. Show result in preview area
6. Save to history

## Template-Specific Customizations

### Standard Templates (e.g., TikTok Video Creator)
- Has `inputs` array with image/text/select fields
- Has `model`, `modelType`, `basePrompt`
- Uses `defaultParams` for resolution/duration
- Direct API call support

### Niche Templates (e.g., Midnight Table Film)
- Has `quickInputs` + `advancedInputs`
- Missing `model`, `modelType`, `basePrompt`
- Has `sceneStructure`, `outputStyle`, `duration` object
- Needs synthetic model/prompt generation

### Image Templates (outputType: 'image')
- Generate calls `muapi.generateImage()` or `muapi.generateI2I()`
- No video playback controls
- Simpler preview area

### Video Templates (outputType: 'video')
- Generate calls `muapi.generateI2V()` or `muapi.generateVideo()`
- Video player in preview area
- Duration and aspect ratio controls

## State Transitions

```
[Template Click] → [Load Template Data] → [Render Form]
       ↓
[User Fills Form] → [AI Enhancer Optional] → [Generate Click]
       ↓
[API Call] → [Loading State] → [Result Display]
       ↓
[Download] / [Regenerate] / [History Save]
```

## Testing Checklist
- [ ] Click standard template → form loads with correct fields
- [ ] Click niche template → form loads with quickInputs + advancedInputs
- [ ] Template name, description, thumbnail display correctly
- [ ] Image upload field works
- [ ] Text fields accept input
- [ ] Select fields have correct options
- [ ] AI Enhancer toggle works
- [ ] Advanced Controls show/hide works
- [ ] Enhance buttons trigger enhancement
- [ ] Generate button calls API correctly
- [ ] Result displays in preview area
- [ ] Download button works
- [ ] History saves to localStorage
- [ ] Back button navigates to templates
- [ ] All 200+ templates load correctly

## Dependencies
- `src/lib/muapi.js` - API client for generation
- `src/lib/templates.js` - Template data and helpers
- `src/lib/thumbnails.js` - Thumbnail loading
- `src/lib/router.js` - Navigation
- `src/components/AuthModal.js` - API key authentication
- `src/components/UploadPicker.js` - Image upload

## Estimated Complexity
- **New code**: ~800-1000 lines for TemplateStudio
- **New code**: ~300-400 lines for templateEnhancer.js
- **Modified**: ~50 lines in templates.js for helpers
- **Total**: ~1200-1500 lines of new/modified code

## Implementation Order
1. Create `templateEnhancer.js` with all enhancement logic
2. Add helper functions to `templates.js`
3. Replace `TemplateStudio.js` with new UI
4. Test with 5-10 different template types
5. Verify all 200+ templates work correctly
