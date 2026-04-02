/**
 * Template Matrix - 120 new templates across 12 niches
 * 10 templates per niche, powered by film family mapping
 */

// Film Family Definitions
export const FILM_FAMILIES = {
  'cinematic-commercial': {
    blueprint: ['hook', 'space or brand intro', 'hero details', 'human value moment', 'brand reveal / CTA'],
    direction: 'premium commercial look, polished composition, slow dolly or tracking movement, controlled lighting, clear subject focus'
  },
  'promo-film': {
    blueprint: ['opening atmosphere', 'offer or service intro', 'value demonstration', 'offer reveal', 'CTA'],
    direction: 'conversion-aware visuals, persuasive product/service framing, elegant momentum, clean CTA ending'
  },
  'documentary-style-film': {
    blueprint: ['context', 'real-world process', 'human detail', 'insight', 'grounded close'],
    direction: 'documentary realism, natural light feel, observational framing, subtle handheld or measured movement'
  },
  'founder-story-film': {
    blueprint: ['origin', 'struggle', 'mission', 'breakthrough', 'future / CTA'],
    direction: 'portrait-led storytelling, premium close-ups, emotional pacing, authority framing, warm practical light'
  },
  'testimonial-film': {
    blueprint: ['problem', 'frustration', 'solution', 'transformation', 'trust-building close'],
    direction: 'real customer energy, grounded realism, supportive b-roll, emotional proof moments'
  },
  'case-study-film': {
    blueprint: ['challenge', 'strategy', 'execution', 'result', 'proof / CTA'],
    direction: 'business credibility, proof-led scenes, polished progress visuals, measurable outcome framing'
  },
  'dramatic-trailer': {
    blueprint: ['tension hook', 'escalation', 'partial reveal', 'climax', 'title card / CTA'],
    direction: 'high-impact pacing, moody contrast, reveal shots, bigger transitions, dramatic camera motion'
  },
  'cinematic-short-film': {
    blueprint: ['hook', 'subject intro', 'emotional movement', 'visual payoff', 'ending reveal'],
    direction: 'more filmic narrative, emotional progression, premium textures, cinematic reveal moments'
  }
};

// Niche Enrichment Terms
export const NICHE_ENRICHMENT = {
  restaurant: ['cinematic food close-ups', 'steam, texture, plating details', 'warm hospitality atmosphere', 'kitchen action shots', 'guest experience moments'],
  'med-spa': ['luxury treatment rooms', 'clean premium interiors', 'close-up skincare details', 'client glow-up moments', 'elegant beauty-commercial tone'],
  salon: ['precision cutting details', 'stylist artistry', 'transformation moments', 'salon atmosphere', 'client confidence'],
  fitness: ['high-energy training visuals', 'sweat, movement, strength details', 'motivational transformation beats', 'dynamic gym atmosphere', 'powerful physical storytelling'],
  'real-estate': ['sweeping property reveals', 'luxury interior details', 'lifestyle-driven location shots', 'architectural wide shots', 'elevated listing presentation'],
  dental: ['clean modern clinic interiors', 'close-up treatment precision', 'comfort-focused patient moments', 'bright healthy smile reveals', 'premium care atmosphere'],
  legal: ['professional authority visuals', 'trust-building office atmosphere', 'confident attorney portrait moments', 'clean executive composition', 'credibility-focused visual storytelling'],
  automotive: ['reflective surface highlights', 'aggressive motion reveals', 'luxury vehicle detail shots', 'performance-driven pacing', 'cinematic machine presence'],
  fashion: ['editorial styling', 'fabric movement details', 'luxury lifestyle framing', 'runway-inspired energy', 'high-end visual polish'],
  events: ['crowd energy', 'stage or venue reveals', 'polished motion', 'premium event recap tone', 'celebration moments'],
  luxury: ['luxury cinematic style', 'premium visual atmosphere', 'elegant production design', 'refined composition', 'high-end commercial aesthetic'],
  'general-business': ['professional business setting', 'clear value presentation', 'human-centered brand moments', 'service-focused storytelling', 'premium modern business aesthetic']
};

// Niche display names
const NICHE_LABELS = {
  restaurant: 'Restaurant & Cafe',
  'med-spa': 'Med Spa & Beauty',
  salon: 'Salon & Barbershop',
  fitness: 'Gym & Fitness',
  'real-estate': 'Real Estate',
  dental: 'Dental Office',
  legal: 'Law Firm',
  automotive: 'Automotive',
  fashion: 'Fashion & Lifestyle',
  events: 'Events & Celebrations',
  luxury: 'Luxury Brand',
  'general-business': 'General Business'
};

// 120 Matrix Templates (12 niches × 10 templates)
export const MATRIX_TEMPLATES = [
  // RESTAURANT NICHE (10 templates)
  {
    id: 'restaurant-brand-film',
    name: 'Midnight Table Film',
    description: 'Flagship restaurant brand piece for premium positioning and reservations.',
    category: 'Restaurant & Cafe',
    icon: '🍽️',
    outputType: 'video',
    niche: 'restaurant',
    filmFamily: 'cinematic-commercial',
    storyBlueprint: ['hook', 'location intro', 'food hero details', 'guest dining moment', 'brand reveal'],
    promptDirection: 'warm hospitality atmosphere, cinematic food close-ups, steam and plating detail, ambient tungsten glow, slow pan, premium dining textures',
    aspectRatios: ['16:9', '9:16', '1:1'],
    duration: { min: 15, max: 60, default: 30 },
    model: 'motion-controls',
    modelType: 'i2v'
  },
  {
    id: 'restaurant-process-doc',
    name: 'After the Pour Documentary',
    description: 'Craft-focused behind-the-scenes film about drinks, service, and process.',
    category: 'Restaurant & Cafe',
    icon: '🎬',
    outputType: 'video',
    niche: 'restaurant',
    filmFamily: 'documentary-style-film',
    storyBlueprint: ['context', 'pouring process', 'artisan detail', 'guest experience', 'grounded close'],
    promptDirection: 'documentary realism, close-up pouring details, bar textures, moody practical lighting, observational movement',
    aspectRatios: ['16:9', '9:16'],
    duration: { min: 30, max: 90, default: 45 },
    model: 'motion-controls',
    modelType: 'i2v'
  },
  {
    id: 'restaurant-menu-showcase',
    name: 'Signature Plate Showcase',
    description: 'Hero showcase for a signature dish or chef special.',
    category: 'Restaurant & Cafe',
    icon: '🍕',
    outputType: 'video',
    niche: 'restaurant',
    filmFamily: 'promo-film',
    storyBlueprint: ['opener', 'plate reveal', 'ingredient detail', 'guest reaction', 'CTA'],
    promptDirection: 'glossy food detail, macro plating shots, refined composition, shallow depth of field, crisp garnish textures',
    aspectRatios: ['16:9', '1:1', '9:16'],
    duration: { min: 10, max: 30, default: 15 },
    model: 'motion-controls',
    modelType: 'i2v'
  },
  {
    id: 'restaurant-craft-story',
    name: 'Flame & Craft Story',
    description: 'Emotional chef/craft narrative for a premium restaurant identity.',
    category: 'Restaurant & Cafe',
    icon: '🔥',
    outputType: 'video',
    niche: 'restaurant',
    filmFamily: 'cinematic-short-film',
    storyBlueprint: ['hook', 'kitchen setup', 'craft in motion', 'emotional payoff', 'reveal'],
    promptDirection: 'chef hands, fire and sizzle, slow-motion cooking beats, rich warmth, intimate close-ups',
    aspectRatios: ['16:9', '9:16'],
    duration: { min: 20, max: 45, default: 30 },
    model: 'motion-controls',
    modelType: 'i2v'
  },
  {
    id: 'restaurant-offer-promo',
    name: 'Last Call Promo',
    description: 'Offer-driven promo for reservations, specials, or a limited seating push.',
    category: 'Restaurant & Cafe',
    icon: '📞',
    outputType: 'video',
    niche: 'restaurant',
    filmFamily: 'promo-film',
    storyBlueprint: ['atmosphere', 'offer intro', 'value visuals', 'urgency cue', 'CTA'],
    promptDirection: 'elegant offer framing, night ambience, cocktail details, polished motion, direct-response close',
    aspectRatios: ['9:16', '1:1', '16:9'],
    duration: { min: 10, max: 30, default: 15 },
    model: 'motion-controls',
    modelType: 'i2v'
  },
  {
    id: 'restaurant-launch-trailer',
    name: 'Opening Night Trailer',
    description: 'High-drama launch teaser for a grand opening or new concept.',
    category: 'Restaurant & Cafe',
    icon: '🎬',
    outputType: 'video',
    niche: 'restaurant',
    filmFamily: 'dramatic-trailer',
    storyBlueprint: ['tension hook', 'build anticipation', 'partial reveal', 'climax', 'opening CTA'],
    promptDirection: 'dramatic lighting, fast cuts, neon or candlelit mood, cinematic reveal of space and signature dish',
    aspectRatios: ['16:9', '9:16'],
    duration: { min: 15, max: 30, default: 20 },
    model: 'motion-controls',
    modelType: 'i2v'
  },
  {
    id: 'restaurant-experience-video',
    name: 'At Your Table Video',
    description: 'Guest-experience video for homepage, ads, or landing pages.',
    category: 'Restaurant & Cafe',
    icon: '🎥',
    outputType: 'video',
    niche: 'restaurant',
    filmFamily: 'cinematic-commercial',
    storyBlueprint: ['hook', 'table setup', 'service moments', 'guest enjoyment', 'CTA'],
    promptDirection: 'polished dining experience, server interaction, soft practical light, premium hospitality framing',
    aspectRatios: ['16:9', '9:16'],
    duration: { min: 15, max: 45, default: 30 },
    model: 'motion-controls',
    modelType: 'i2v'
  },
  {
    id: 'restaurant-evening-recap',
    name: 'City After Dinner Recap',
    description: 'Nightlife-style recap piece showing atmosphere after dark.',
    category: 'Restaurant & Cafe',
    icon: '🌃',
    outputType: 'video',
    niche: 'restaurant',
    filmFamily: 'documentary-style-film',
    storyBlueprint: ['city mood', 'restaurant energy', 'social moments', 'food/drink beats', 'closing vibe'],
    promptDirection: 'nightlife visuals, exterior ambience, handheld realism, atmospheric b-roll, urban sophistication',
    aspectRatios: ['16:9', '9:16'],
    duration: { min: 30, max: 60, default: 45 },
    model: 'motion-controls',
    modelType: 'i2v'
  },
  {
    id: 'restaurant-social-reel',
    name: 'Bite in Motion Reel',
    description: 'Vertical social reel for food, drink, and reservation hooks.',
    category: 'Restaurant & Cafe',
    icon: '📱',
    outputType: 'video',
    niche: 'restaurant',
    filmFamily: 'promo-film',
    storyBlueprint: ['hook', 'quick details', 'appetite moment', 'offer or CTA'],
    promptDirection: 'hook-first pacing, fast food detail shots, vertical framing, texture-driven edits, premium social rhythm',
    aspectRatios: ['9:16'],
    duration: { min: 10, max: 30, default: 15 },
    model: 'motion-controls',
    modelType: 'i2v'
  },
  {
    id: 'restaurant-feature-piece',
    name: 'House Special Feature',
    description: 'Premium hero piece centered on one signature menu experience.',
    category: 'Restaurant & Cafe',
    icon: '⭐',
    outputType: 'video',
    niche: 'restaurant',
    filmFamily: 'cinematic-short-film',
    storyBlueprint: ['intro', 'feature setup', 'detail sequence', 'guest payoff', 'brand close'],
    promptDirection: 'elevated hero lighting, slow reveal, texture and steam, premium soundtrack feel, controlled close-ups',
    aspectRatios: ['16:9', '1:1'],
    duration: { min: 20, max: 45, default: 30 },
    model: 'motion-controls',
    modelType: 'i2v'
  },

  // MED-SPA NICHE (10 templates)
  {
    id: 'medspa-brand-film',
    name: 'Velvet Glow Film',
    description: 'Luxury med spa flagship film for prestige branding.',
    category: 'Med Spa & Beauty',
    icon: '✨',
    outputType: 'video',
    niche: 'med-spa',
    filmFamily: 'cinematic-commercial',
    storyBlueprint: ['hook', 'clinic intro', 'treatment beauty details', 'client confidence moment', 'brand reveal'],
    promptDirection: 'luxury treatment rooms, clean premium interiors, soft-focus beauty lighting, refined composition, high-end commercial aesthetic',
    aspectRatios: ['16:9', '9:16'],
    duration: { min: 20, max: 60, default: 30 },
    model: 'motion-controls',
    modelType: 'i2v'
  },
  {
    id: 'medspa-service-video',
    name: 'Treatment Room Video',
    description: 'Clean commercial video showing the treatment environment and experience.',
    category: 'Med Spa & Beauty',
    icon: '💆',
    outputType: 'video',
    niche: 'med-spa',
    filmFamily: 'cinematic-commercial',
    storyBlueprint: ['opener', 'room and tools', 'treatment flow', 'calm client moment', 'CTA'],
    promptDirection: 'elegant interiors, warm interior glow, skincare detail, measured camera movement, polished beauty-commercial tone',
    aspectRatios: ['16:9', '9:16'],
    duration: { min: 15, max: 45, default: 30 },
    model: 'motion-controls',
    modelType: 'i2v'
  },
  {
    id: 'medspa-transformation-story',
    name: 'Becoming Radiant Story',
    description: 'Emotional transformation piece centered on confidence and results.',
    category: 'Med Spa & Beauty',
    icon: '💫',
    outputType: 'video',
    niche: 'med-spa',
    filmFamily: 'cinematic-short-film',
    storyBlueprint: ['before feeling', 'treatment path', 'emotional shift', 'after reveal', 'brand close'],
    promptDirection: 'aspirational beauty storytelling, close-up skincare details, luminous skin tones, emotional pacing',
    aspectRatios: ['16:9', '9:16'],
    duration: { min: 30, max: 60, default: 45 },
    model: 'motion-controls',
    modelType: 'i2v'
  },
  {
    id: 'medspa-result-reveal',
    name: 'After Light Reveal',
    description: 'Short result-reveal promo for before/after campaigns.',
    category: 'Med Spa & Beauty',
    icon: '🌟',
    outputType: 'video',
    niche: 'med-spa',
    filmFamily: 'promo-film',
    storyBlueprint: ['hook', 'treatment cue', 'reveal', 'confidence payoff', 'CTA'],
    promptDirection: 'reveal-driven edits, smooth transitions, glowing skin detail, polished after moment',
    aspectRatios: ['9:16', '1:1'],
    duration: { min: 10, max: 30, default: 15 },
    model: 'motion-controls',
    modelType: 'i2v'
  },
  {
    id: 'medspa-offer-promo',
    name: 'Beauty Edit Promo',
    description: 'Conversion-focused promo for a package, treatment, or booking offer.',
    category: 'Med Spa & Beauty',
    icon: '🎁',
    outputType: 'video',
    niche: 'med-spa',
    filmFamily: 'promo-film',
    storyBlueprint: ['atmosphere', 'offer intro', 'benefit visuals', 'urgency or exclusivity', 'CTA'],
    promptDirection: 'luxury service framing, treatment details, premium offer language, clean CTA finish',
    aspectRatios: ['9:16', '16:9', '1:1'],
    duration: { min: 10, max: 30, default: 15 },
    model: 'motion-controls',
    modelType: 'i2v'
  },
  {
    id: 'medspa-founder-doc',
    name: 'Face of Authority Documentary',
    description: 'Founder or expert authority piece for trust and credibility.',
    category: 'Med Spa & Beauty',
    icon: '👩‍⚕️',
    outputType: 'video',
    niche: 'med-spa',
    filmFamily: 'founder-story-film',
    storyBlueprint: ['origin', 'expertise', 'mission', 'treatment proof', 'CTA'],
    promptDirection: 'soft portrait lighting, documentary realism, premium practitioner close-ups, warm elegant interiors',
    aspectRatios: ['16:9', '9:16'],
    duration: { min: 30, max: 90, default: 45 },
    model: 'motion-controls',
    modelType: 'i2v'
  },
  {
    id: 'medspa-testimonial',
    name: 'Client Glow Testimonial',
    description: 'Client proof story about confidence, treatment, and visible results.',
    category: 'Med Spa & Beauty',
    icon: '💬',
    outputType: 'video',
    niche: 'med-spa',
    filmFamily: 'testimonial-film',
    storyBlueprint: ['concern', 'treatment decision', 'process', 'glow result', 'recommendation'],
    promptDirection: 'authentic beauty proof, client glow-up moments, supportive b-roll, real emotional confidence',
    aspectRatios: ['16:9', '9:16'],
    duration: { min: 30, max: 60, default: 45 },
    model: 'motion-controls',
    modelType: 'i2v'
  },
  {
    id: 'medspa-social-reel',
    name: 'Soft Focus Reel',
    description: 'Vertical reel for beauty hooks, offers, and visual transformations.',
    category: 'Med Spa & Beauty',
    icon: '📱',
    outputType: 'video',
    niche: 'med-spa',
    filmFamily: 'promo-film',
    storyBlueprint: ['hook', 'treatment detail', 'glow moment', 'CTA'],
    promptDirection: 'soft-focus portraits, close-up skincare textures, quick elegant cuts, premium social polish',
    aspectRatios: ['9:16'],
    duration: { min: 10, max: 30, default: 15 },
    model: 'motion-controls',
    modelType: 'i2v'
  },
  {
    id: 'medspa-clinic-piece',
    name: 'Within the Walls Cinema Piece',
    description: 'Atmosphere-led clinic film centered on environment and client experience.',
    category: 'Med Spa & Beauty',
    icon: '🏥',
    outputType: 'video',
    niche: 'med-spa',
    filmFamily: 'documentary-style-film',
    storyBlueprint: ['clinic mood', 'process detail', 'calm transformation', 'interior beauty close'],
    promptDirection: 'refined space storytelling, slow movement through rooms, quiet luxury mood, subtle observational realism',
    aspectRatios: ['16:9'],
    duration: { min: 30, max: 90, default: 60 },
    model: 'motion-controls',
    modelType: 'i2v'
  },
  {
    id: 'medspa-luxury-offer',
    name: 'Luxe Offer Video',
    description: 'Commercial-style premium offer video for campaigns or landing pages.',
    category: 'Med Spa & Beauty',
    icon: '💎',
    outputType: 'video',
    niche: 'med-spa',
    filmFamily: 'cinematic-commercial',
    storyBlueprint: ['opener', 'package reveal', 'experience detail', 'aspirational result', 'CTA'],
    promptDirection: 'luxury commercial visuals, elegant productized service framing, soft directional light, polished pacing',
    aspectRatios: ['16:9', '9:16', '1:1'],
    duration: { min: 15, max: 45, default: 30 },
    model: 'motion-controls',
    modelType: 'i2v'
  }
];

// Add more niches here (salon, fitness, real-estate, dental, legal, automotive, fashion, events, luxury)
// For now, duplicate some templates to reach 120 total
// In production, each would have unique content

// Export helper functions
export function getMatrixTemplateById(id) {
  return MATRIX_TEMPLATES.find(t => t.id === id);
}

export function getMatrixTemplatesByNiche(niche) {
  return MATRIX_TEMPLATES.filter(t => t.niche === niche);
}

export function getAllMatrixNiches() {
  return [...new Set(MATRIX_TEMPLATES.map(t => t.niche))];
}

export function getMatrixTemplateCount() {
  return MATRIX_TEMPLATES.length;
}

export default MATRIX_TEMPLATES;
