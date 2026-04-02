/**
 * TEMPLATE ADAPTER
 * Bridges different template systems (standard, niche, matrix) with a unified interface
 * Integrates enhanced template specs from templateSpecs.js
 */

import { 
  CINEMATIC_TEMPLATES,
  CINEMATIC_CATEGORIES,
  OUTPUT_STYLES,
  VISUAL_STYLES,
  SCENE_STRUCTURES,
  BRAND_VOICES,
  TARGET_AUDIENCES,
  CTA_TYPES,
  SHOT_TYPES,
  CAMERA_MOVEMENTS,
  PACING_OPTIONS
} from './cinematicTemplates.js';

import { TEMPLATE_SPECS } from './templateSpecs.js';

/**
 * Detect template type based on its structure
 * @param {Object} template - The template object
 * @returns {'standard' | 'niche' | 'matrix'} - The detected type
 */
function detectTemplateType(template) {
  // Matrix templates have filmFamily
  if (template.filmFamily) return 'matrix';
  
  // Niche templates have quickInputs or advancedInputs
  if (template.quickInputs || template.advancedInputs) return 'niche';
  
  // Standard templates have inputs array
  return 'standard';
}

/**
 * Normalize inputs from different template types
 * @param {Object} template - The template object
 * @returns {Array} - Normalized inputs array
 */
function normalizeInputs(template) {
  // Standard templates
  if (template.inputs && Array.isArray(template.inputs)) {
    return template.inputs;
  }
  
  // Niche templates - merge quick and advanced inputs
  if (template.quickInputs) {
    const quick = template.quickInputs || [];
    const advanced = template.advancedInputs || [];
    return [...quick, ...advanced];
  }
  
  // Matrix templates - generate inputs based on template type
  if (template.filmFamily) {
    return generateMatrixInputs(template);
  }
  
  return [];
}

/**
 * Generate inputs for matrix templates
 * @param {Object} template - The matrix template
 * @returns {Array} - Generated inputs array
 */
function generateMatrixInputs(template) {
  const inputs = [];
  
  // Always add prompt input
  inputs.push({
    name: 'prompt',
    type: 'textarea',
    label: 'Describe your video',
    placeholder: 'e.g. A cinematic shot of...'
  });
  
  // Add image input for video templates
  if (template.outputType === 'video') {
    inputs.push({
      name: 'image_url',
      type: 'image',
      label: 'Upload your photo'
    });
  }
  
  // Add aspect ratio if specified
  if (template.aspectRatios) {
    inputs.push({
      name: 'aspect_ratio',
      type: 'select',
      label: 'Aspect Ratio',
      options: template.aspectRatios
    });
  }
  
  // Add duration if specified
  if (template.duration) {
    const durationOptions = [];
    for (let i = template.duration.min; i <= template.duration.max; i += 15) {
      durationOptions.push(`${i}s`);
    }
    if (durationOptions.length > 0) {
      inputs.push({
        name: 'duration',
        type: 'select',
        label: 'Duration',
        options: durationOptions
      });
    }
  }
  
  return inputs;
}

/**
 * Infer model based on template type and output type
 * @param {string} type - The template type
 * @param {string} outputType - The output type (video/image)
 * @returns {string} - The model name
 */
function inferModel(type, outputType) {
  if (type === 'matrix') {
    return outputType === 'video' ? 'ai-video-effects' : 'nano-banana';
  }
  return 'ai-video-effects';
}

/**
 * Infer model type based on output type
 * @param {string} outputType - The output type
 * @returns {string} - The model type (i2v/t2i)
 */
function inferModelType(outputType) {
  return outputType === 'video' ? 'i2v' : 't2i';
}

/**
 * Build base prompt from template and specs
 * @param {Object} template - The template object
 * @param {Object} specs - The template specs
 * @returns {string} - The base prompt
 */
function buildBasePrompt(template, specs) {
  // Use existing base prompt if available
  if (template.basePrompt) return template.basePrompt;
  
  // Build from specs
  const parts = [];
  
  if (specs.enhancerKeywords) {
    parts.push(specs.enhancerKeywords);
  }
  
  if (specs.visualStyle) {
    parts.push(specs.visualStyle);
  }
  
  if (template.promptDirection) {
    parts.push(template.promptDirection);
  }
  
  return parts.join(', ');
}

/**
 * Normalize duration to a single number (seconds)
 * @param {number | object} duration - The duration value
 * @returns {number} - Duration in seconds
 */
function normalizeDuration(duration) {
  if (!duration) return 5;
  if (typeof duration === 'number') return duration;
  if (typeof duration === 'object') {
    return duration.default || duration.min || 5;
  }
  return 5;
}

/**
 * Normalize any template type into a common interface
 * @param {Object} template - The template object (standard, niche, or matrix)
 * @returns {Object} - Normalized template with consistent structure
 */
export function normalizeTemplate(template) {
  if (!template) return null;

  const specs = TEMPLATE_SPECS[template.id] || {};
  const type = detectTemplateType(template);

  return {
    // Core identification
    id: template.id,
    name: template.name,
    description: specs.uiDescription || template.description || '',
    icon: template.icon || '🎬',
    category: template.category || 'Uncategorized',
    outputType: template.outputType || 'video',
    
    // Thumbnail
    thumbnail: template.thumbnail,
    
    // Enhanced fields from specs
    coreUseCase: specs.coreUseCase || template.description || '',
    promptGoal: specs.promptGoal || '',
    visualStyle: specs.visualStyle || '',
    sceneBlueprint: specs.sceneBlueprint || template.sceneStructure || [],
    cinematography: specs.cinematography || '',
    enhancerKeywords: specs.enhancerKeywords || '',
    negativePrompt: specs.negativePrompt || '',
    outputPackage: specs.outputPackage || ['master prompt'],
    
    // Input fields (normalized)
    inputs: normalizeInputs(template),
    quickInputs: template.quickInputs || [],
    advancedInputs: template.advancedInputs || [],
    
    // Generation config
    model: template.model || inferModel(type, template.outputType),
    modelType: template.modelType || inferModelType(template.outputType),
    basePrompt: template.basePrompt || buildBasePrompt(template, specs),
    aspectRatio: template.aspectRatio || template.aspectRatios?.[0] || '16:9',
    duration: normalizeDuration(template.duration),
    defaultParams: template.defaultParams || { resolution: '720p', duration: normalizeDuration(template.duration) },
    
    // Matrix-specific fields
    filmFamily: template.filmFamily,
    storyBlueprint: template.storyBlueprint,
    promptDirection: template.promptDirection,
    niche: template.niche,
    
    // Template type indicator
    _type: type,
    
    // Original reference for generation
    _original: template
  };
}

/**
 * Get all normalized templates
 * @param {Array} templates - Array of template objects
 * @returns {Array} - Array of normalized templates
 */
export function normalizeAllTemplates(templates) {
  return templates.map(normalizeTemplate).filter(Boolean);
}

/**
 * Find template by ID in normalized array
 * @param {Array} templates - Normalized templates array
 * @param {string} id - Template ID
 * @returns {Object | null}
 */
export function findTemplateById(templates, id) {
  return templates.find(t => t.id === id) || null;
}

/**
 * Filter templates by category
 * @param {Array} templates - Normalized templates array
 * @param {string} category - Category to filter by
 * @returns {Array}
 */
export function filterByCategory(templates, category) {
  if (!category) return templates;
  return templates.filter(t => t.category === category);
}

/**
 * Filter templates by type
 * @param {Array} templates - Normalized templates array
 * @param {string} type - Type to filter by ('standard', 'niche', 'matrix')
 * @returns {Array}
 */
export function filterByType(templates, type) {
  if (!type) return templates;
  return templates.filter(t => t._type === type);
}

/**
 * Get all unique categories from templates
 * @param {Array} templates - Normalized templates array
 * @returns {Array}
 */
export function getAllCategories(templates) {
  const categories = new Set(templates.map(t => t.category));
  return Array.from(categories).sort();
}

/**
 * Get all unique types from templates
 * @param {Array} templates - Normalized templates array
 * @returns {Array}
 */
export function getAllTypes(templates) {
  const types = new Set(templates.map(t => t._type));
  return Array.from(types);
}

// Legacy function for backward compatibility with existing code
export function adaptCinematicTemplate(cinematicTemplate) {
  return normalizeTemplate(cinematicTemplate);
}

// Adapter to convert cinematic template to TemplateStudio format
export function adaptCinematicTemplateLegacy(cinematicTemplate) {
  const isVideo = cinematicTemplate.outputType === 'video';
  
  // Extract quick inputs (most important fields for quick mode)
  const quickInputs = cinematicTemplate.quickInputs?.slice(0, 3) || [];
  
  // Build base prompt from template characteristics
  const styleModifiers = cinematicTemplate.outputStyle?.characteristics?.join(', ') || 'cinematic quality';
  const visualStyle = cinematicTemplate.visualStyle ? 
    VISUAL_STYLES[cinematicTemplate.visualStyle.toUpperCase().replace(/ /g, '_')]?.modifiers?.join(', ') : 
    'professional cinematography';
  
  // Create basePrompt from template data
  const basePromptTemplate = `{prompt}, ${styleModifiers}, ${visualStyle}, 4K quality`;
  
  // Map to TemplateStudio-compatible format
  return {
    id: cinematicTemplate.id,
    name: cinematicTemplate.name,
    description: cinematicTemplate.description,
    category: mapCategory(cinematicTemplate.category),
    icon: cinematicTemplate.icon,
    outputType: cinematicTemplate.outputType,
    model: isVideo ? 'motion-controls' : 'nano-banana',
    modelType: isVideo ? 'i2v' : 't2i',
    aspectRatio: cinematicTemplate.aspectRatios?.[0] || '16:9',
    
    // Cinematic-specific flag for TemplateStudio
    isCinematic: true,
    
    // Full cinematic data for wizard
    cinematicData: {
      quickInputs: cinematicTemplate.quickInputs,
      advancedInputs: cinematicTemplate.advancedInputs,
      sceneBuilder: cinematicTemplate.sceneBuilder,
      shotBuilder: cinematicTemplate.shotBuilder,
      storyboardBuilder: cinematicTemplate.storyboardBuilder,
      outputStyle: cinematicTemplate.outputStyle,
      visualStyles: VISUAL_STYLES,
      sceneStructures: SCENE_STRUCTURES,
      brandVoices: BRAND_VOICES,
      targetAudiences: TARGET_AUDIENCES,
      ctaTypes: CTA_TYPES,
      shotTypes: SHOT_TYPES,
      cameraMovements: CAMERA_MOVEMENTS,
      pacingOptions: PACING_OPTIONS,
      includeCTA: cinematicTemplate.includeCTA,
      ctaOptions: cinematicTemplate.ctaOptions,
      includeBrandContext: cinematicTemplate.includeBrandContext,
      duration: cinematicTemplate.duration,
      aspectRatios: cinematicTemplate.aspectRatios
    },
    
    // Adapted inputs for basic TemplateStudio (used if wizard not activated)
    inputs: adaptInputs(quickInputs),
    basePrompt: basePromptTemplate,
    defaultParams: { resolution: '720p', duration: cinematicTemplate.duration?.default || 30 }
  };
}

function adaptInputs(quickInputs) {
  if (!quickInputs || quickInputs.length === 0) {
    return [{ name: 'prompt', type: 'text', label: 'Describe your vision', placeholder: 'e.g. cinematic scene...' }];
  }
  
  return quickInputs.map(input => ({
    name: input.name,
    type: input.type === 'textarea' ? 'textarea' : input.type === 'select' ? 'select' : 'text',
    label: input.label,
    placeholder: input.placeholder,
    options: input.options,
    required: input.required
  }));
}

function mapCategory(cinematicCategory) {
  const categoryMap = {
    [CINEMATIC_CATEGORIES.FILM]: 'Cinematic Film',
    [CINEMATIC_CATEGORIES.BUSINESS]: 'Business & Brand',
    [CINEMATIC_CATEGORIES.COMMERCIAL]: 'Commercial & Ads',
    [CINEMATIC_CATEGORIES.SOCIAL]: 'Social Media',
    [CINEMATIC_CATEGORIES.DOCUMENTARY]: 'Documentary',
    [CINEMATIC_CATEGORIES.PERSONAL]: 'Personal Story',
    [CINEMATIC_CATEGORIES.INDUSTRY]: 'Industry Specific',
    [CINEMATIC_CATEGORIES.CREATIVE]: 'Creative & Artistic',
    [CINEMATIC_CATEGORIES.NARRATIVE]: 'Narrative & Story',
    [CINEMATIC_CATEGORIES.FILM_GENRE]: 'Film Genres',
    [CINEMATIC_CATEGORIES.SCENE_CONSTRUCTION]: 'Scene Construction',
    [CINEMATIC_CATEGORIES.MOVIE_POSTER]: 'Movie Poster & Promo',
    // Niche Categories
    [CINEMATIC_CATEGORIES.RESTAURANT]: 'Restaurant & Cafe',
    [CINEMATIC_CATEGORIES.MED_SPA]: 'Med Spa & Beauty',
    [CINEMATIC_CATEGORIES.SALON]: 'Salon & Barbershop',
    [CINEMATIC_CATEGORIES.FITNESS]: 'Gym & Fitness',
    [CINEMATIC_CATEGORIES.REAL_ESTATE]: 'Real Estate & Realtor',
    [CINEMATIC_CATEGORIES.DENTAL]: 'Dental Office',
    [CINEMATIC_CATEGORIES.CHIROPRACTIC]: 'Chiropractic & Wellness',
    [CINEMATIC_CATEGORIES.LEGAL]: 'Law Firm & Legal',
    [CINEMATIC_CATEGORIES.AUTOMOTIVE]: 'Automotive & Dealer',
    [CINEMATIC_CATEGORIES.FASHION]: 'Fashion & Lifestyle',
    [CINEMATIC_CATEGORIES.EVENT]: 'Event & Recap',
    [CINEMATIC_CATEGORIES.LUXURY]: 'Luxury Brand'
  };
  return categoryMap[cinematicCategory] || 'Cinematic Film';
}

// Get all adapted cinematic templates
export function getCinematicTemplatesAdapted() {
  return CINEMATIC_TEMPLATES.map(adaptCinematicTemplateLegacy);
}

// Get a specific adapted template by ID
export function getAdaptedTemplateById(id) {
  const cinematicTemplate = CINEMATIC_TEMPLATES.find(t => t.id === id);
  if (cinematicTemplate) {
    return adaptCinematicTemplateLegacy(cinematicTemplate);
  }
  return null;
}

// Get templates by category
export function getCinematicTemplatesByCategory(category) {
  const filtered = CINEMATIC_TEMPLATES.filter(t => t.category === category);
  return filtered.map(adaptCinematicTemplateLegacy);
}

// Search cinematic templates
export function searchCinematicTemplates(query) {
  const lowerQuery = query.toLowerCase();
  return CINEMATIC_TEMPLATES
    .filter(t => 
      t.name.toLowerCase().includes(lowerQuery) ||
      t.description.toLowerCase().includes(lowerQuery)
    )
    .map(adaptCinematicTemplateLegacy);
}

// Export all cinematic categories
export const CINEMATIC_TEMPLATE_CATEGORIES = {
  FILM: 'Cinematic Film',
  BUSINESS: 'Business & Brand',
  COMMERCIAL: 'Commercial & Ads',
  SOCIAL: 'Social Media',
  DOCUMENTARY: 'Documentary',
  PERSONAL: 'Personal Story',
  INDUSTRY: 'Industry Specific',
  CREATIVE: 'Creative & Artistic',
  NARRATIVE: 'Narrative & Story',
  FILM_GENRE: 'Film Genres',
  SCENE_CONSTRUCTION: 'Scene Construction',
  MOVIE_POSTER: 'Movie Poster & Promo',
  // Niche Categories
  RESTAURANT: 'Restaurant & Cafe',
  MED_SPA: 'Med Spa & Beauty',
  SALON: 'Salon & Barbershop',
  FITNESS: 'Gym & Fitness',
  REAL_ESTATE: 'Real Estate & Realtor',
  DENTAL: 'Dental Office',
  CHIROPRACTIC: 'Chiropractic & Wellness',
  LEGAL: 'Law Firm & Legal',
  AUTOMOTIVE: 'Automotive & Dealer',
  FASHION: 'Fashion & Lifestyle',
  EVENT: 'Event & Recap',
  LUXURY: 'Luxury Brand'
};

export default {
  normalizeTemplate,
  normalizeAllTemplates,
  findTemplateById,
  filterByCategory,
  filterByType,
  getAllCategories,
  getAllTypes,
  adaptCinematicTemplate,
  adaptCinematicTemplateLegacy,
  getCinematicTemplatesAdapted,
  getAdaptedTemplateById,
  getCinematicTemplatesByCategory,
  searchCinematicTemplates,
  CINEMATIC_TEMPLATE_CATEGORIES
};
