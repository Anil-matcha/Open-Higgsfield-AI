/**
 * CINEMATIC TEMPLATE SYSTEM
 * A unified engine for creating cinematic and business video templates
 * Supports quick mode (simple inputs) and advanced mode (full scene/shot control)
 */

// ============================================
// TEMPLATE CATEGORIES
// ============================================

export const CINEMATIC_CATEGORIES = {
  FILM: 'Cinematic Films',
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

// ============================================
// OUTPUT STYLE DEFINITIONS
// ============================================

export const OUTPUT_STYLES = {
  CINEMATIC_COMMERCIAL: {
    id: 'cinematic_commercial',
    name: 'Cinematic Commercial',
    description: 'High-production value commercial with cinematic feel',
    icon: '🎬',
    characteristics: ['epic cinematography', 'emotional storytelling', 'brand integration', 'professional grade']
  },
  DOCUMENTARY: {
    id: 'documentary',
    name: 'Documentary',
    description: 'Authentic documentary-style narrative',
    icon: '📽️',
    characteristics: ['real-world footage', 'interview segments', 'narrative voiceover', 'ambient sound']
  },
  EMOTIONAL_BRAND_STORY: {
    id: 'emotional_brand_story',
    name: 'Emotional Brand Story',
    description: 'Deep emotional connection through personal narrative',
    icon: '💫',
    characteristics: ['personal journey', 'transformation arc', 'relatable hero', 'emotional climax']
  },
  BOLD_DIRECT_RESPONSE: {
    id: 'bold_direct_response',
    name: 'Bold Direct Response Ad',
    description: 'High-impact call-to-action driven ad',
    icon: '⚡',
    characteristics: ['strong CTA', 'urgency elements', 'benefit-focused', 'clear offer']
  },
  LUXURY_BRAND_PROMO: {
    id: 'luxury_brand_promo',
    name: 'Luxury Brand Promo',
    description: 'Premium, aspirational brand content',
    icon: '✨',
    characteristics: ['elegant visuals', 'sophisticated narration', 'exclusive feel', 'refined aesthetics']
  },
  DRAMATIC_TRAILER: {
    id: 'dramatic_trailer',
    name: 'Dramatic Trailer',
    description: 'High-energy trailer with cliffhangers',
    icon: '🎥',
    characteristics: ['mystery pacing', 'reveal moments', 'intense music', 'suspenseful cuts']
  },
  INSPIRATIONAL_FOUNDER: {
    id: 'inspirational_founder',
    name: 'Inspirational Founder Film',
    description: 'Founder story with vision and mission',
    icon: '🚀',
    characteristics: ['visionary narrative', 'challenge overcome', 'passion driven', 'mission focused']
  },
  CUSTOMER_TRANSFORMATION: {
    id: 'customer_transformation',
    name: 'Customer Transformation Story',
    description: 'Before/after customer journey narrative',
    icon: '🔄',
    characteristics: ['problem-solution', 'transformation arc', 'testimonial integration', 'results showcase']
  },
  CINEMATIC_SOCIAL_SHORT: {
    id: 'cinematic_social_short',
    name: 'Cinematic Social Short',
    description: 'Vertical optimized cinematic social content',
    icon: '📱',
    characteristics: ['9:16 format', 'hook in first second', 'trend-aware', 'share-worthy']
  }
};

// ============================================
// VISUAL STYLE DEFINITIONS
// ============================================

export const VISUAL_STYLES = {
  NATURAL_LIGHT: {
    id: 'natural_light',
    name: 'Natural Light',
    description: 'Organic, authentic lighting',
    modifiers: ['golden hour', 'soft diffused light', 'natural shadows', 'warm tones']
  },
  DRAMATIC_CINEMATIC: {
    id: 'dramatic_cinematic',
    name: 'Dramatic Cinematic',
    description: 'High-contrast cinematic lighting',
    modifiers: ['volumetric lighting', 'anamorphic flares', 'deep shadows', 'moody atmosphere']
  },
  HIGH_KEY_BRIGHT: {
    id: 'high_key_bright',
    name: 'High Key Bright',
    description: 'Bright, optimistic visual style',
    modifiers: ['bright studio lighting', 'soft fill', 'clean whites', 'airy feel']
  },
  LOW_KEY_DARK: {
    id: 'low_key_dark',
    name: 'Low Key Dark',
    description: 'Dark, mysterious aesthetic',
    modifiers: ['moody darkness', 'selective lighting', 'deep blacks', 'shadow play']
  },
  RETRO_VINTAGE: {
    id: 'retro_vintage',
    name: 'Retro Vintage',
    description: 'Nostalgic vintage aesthetics',
    modifiers: ['film grain', 'warm color grading', 'soft focus', 'retro feel']
  },
  MINIMALIST_CLEAN: {
    id: 'minimalist_clean',
    name: 'Minimalist Clean',
    description: 'Clean, minimal aesthetic',
    modifiers: ['clean backgrounds', 'negative space', 'simple composition', 'modern feel']
  },
  BOLD_COLOR_GRADE: {
    id: 'bold_color_grade',
    name: 'Bold Color Grade',
    description: 'Vibrant, stylized color',
    modifiers: ['saturated colors', 'teal orange grading', 'bold contrast', 'stylized look']
  },
  LUXURY_ELEGANT: {
    id: 'luxury_elegant',
    name: 'Luxury Elegant',
    description: 'Premium, sophisticated look',
    modifiers: ['soft key light', 'rim lighting', 'shallow DOF', 'elegant color palette']
  }
};

// ============================================
// CAMERA & SHOT DEFINITIONS
// ============================================

export const SHOT_TYPES = {
  ESTABLISHING: { id: 'establishing', name: 'Establishing Shot', description: 'Wide establishing shot', duration: '3-5s' },
  WIDE: { id: 'wide', name: 'Wide Shot', description: 'Full scene overview', duration: '3-5s' },
  MEDIUM: { id: 'medium', name: 'Medium Shot', description: 'Waist-up framing', duration: '2-4s' },
  MEDIUM_CLOSE_UP: { id: 'medium_close_up', name: 'Medium Close-Up', description: 'Chest-up framing', duration: '2-3s' },
  CLOSE_UP: { id: 'close_up', name: 'Close-Up', description: 'Face-focused', duration: '1-3s' },
  EXTREME_CLOSE_UP: { id: 'extreme_close_up', name: 'Extreme Close-Up', description: 'Detail focused', duration: '1-2s' },
  OVER_SHOULDER: { id: 'over_shoulder', name: 'Over the Shoulder', description: 'POV framing', duration: '2-4s' },
  POV: { id: 'pov', name: 'Point of View', description: 'First-person perspective', duration: '2-5s' },
  DUTCH_ANGLE: { id: 'dutch_angle', name: 'Dutch Angle', description: 'Tilted dynamic framing', duration: '1-3s' },
  BIRDS_EYE: { id: 'birds_eye', name: "Bird's Eye", description: 'Top-down view', duration: '3-5s' },
  LOW_ANGLE: { id: 'low_angle', name: 'Low Angle', description: 'Heroic upward framing', duration: '2-4s' },
  HIGH_ANGLE: { id: 'high_angle', name: 'High Angle', description: 'Downward perspective', duration: '2-4s' }
};

export const CAMERA_MOVEMENTS = {
  STATIC: { id: 'static', name: 'Static', description: 'Fixed camera' },
  DOLLY_IN: { id: 'dolly_in', name: 'Dolly In', description: 'Camera moves toward subject' },
  DOLLY_OUT: { id: 'dolly_out', name: 'Dolly Out', description: 'Camera moves away from subject' },
  TRACKING: { id: 'tracking', name: 'Tracking', description: 'Following subject' },
  PAN_LEFT: { id: 'pan_left', name: 'Pan Left', description: 'Horizontal sweep left' },
  PAN_RIGHT: { id: 'pan_right', name: 'Pan Right', description: 'Horizontal sweep right' },
  TILT_UP: { id: 'tilt_up', name: 'Tilt Up', description: 'Vertical sweep up' },
  TILT_DOWN: { id: 'tilt_down', name: 'Tilt Down', description: 'Vertical sweep down' },
  CRANE_UP: { id: 'crane_up', name: 'Crane Up', description: 'Rising camera movement' },
  CRANE_DOWN: { id: 'crane_down', name: 'Crane Down', description: 'Lowering camera movement' },
  ZOOM_IN: { id: 'zoom_in', name: 'Zoom In', description: 'Lens compression effect' },
  ZOOM_OUT: { id: 'zoom_out', name: 'Zoom Out', description: 'Lens expansion effect' },
  HANDHELD: { id: 'handheld', name: 'Handheld', description: 'Organic shaky feel' },
  STEADICAM: { id: 'steadicam', name: 'Steadicam', description: 'Smooth floating movement' },
  FPV_DRONE: { id: 'fpv_drone', name: 'FPV Drone', description: 'Aggressive drone movement' }
};

export const PACING_OPTIONS = {
  SLOW: { id: 'slow', name: 'Slow & Deliberate', beatsPerMinute: 60, description: 'Contemplative, cinematic pacing' },
  MODERATE: { id: 'moderate', name: 'Moderate', beatsPerMinute: 90, description: 'Balanced storytelling pace' },
  FAST: { id: 'fast', name: 'Fast Cut', beatsPerMinute: 120, description: 'Energetic, dynamic editing' },
  MONTAGE: { id: 'montage', name: 'Montage', beatsPerMinute: 150, description: 'Rapid sequence of shots' }
};

// ============================================
// CTA (CALL TO ACTION) DEFINITIONS
// ============================================

export const CTA_TYPES = {
  SHOP_NOW: { id: 'shop_now', name: 'Shop Now', icon: '🛒', placement: 'end_card' },
  LEARN_MORE: { id: 'learn_more', name: 'Learn More', icon: '📖', placement: 'end_card' },
  SIGN_UP: { id: 'sign_up', name: 'Sign Up', icon: '✨', placement: 'end_card' },
  BOOK_NOW: { id: 'book_now', name: 'Book Now', icon: '📅', placement: 'end_card' },
  GET_QUOTE: { id: 'get_quote', name: 'Get Quote', icon: '💬', placement: 'end_card' },
  WATCH_MORE: { id: 'watch_more', name: 'Watch More', icon: '▶️', placement: 'end_card' },
  SUBSCRIBE: { id: 'subscribe', name: 'Subscribe', icon: '🔔', placement: 'end_card' },
  VISIT_US: { id: 'visit_us', name: 'Visit Us', icon: '📍', placement: 'end_card' },
  CALL_NOW: { id: 'call_now', name: 'Call Now', icon: '📞', placement: 'overlay' },
  SWIPE_UP: { id: 'swipe_up', name: 'Swipe Up', icon: '👆', placement: 'overlay' }
};

export const ENDING_TYPES = {
  HARD_CUT: { id: 'hard_cut', name: 'Hard Cut to Black', description: 'Immediate cut to end screen' },
  FADE_TO_BLACK: { id: 'fade_to_black', name: 'Fade to Black', description: 'Smooth fade out' },
  FREEZE_FRAME: { id: 'freeze_frame', name: 'Freeze Frame', description: 'Final moment frozen' },
  ZOOM_FREEZE: { id: 'zoom_freeze', name: 'Zoom & Freeze', description: 'Zoom into subject then freeze' },
  MATCH_CUT: { id: 'match_cut', name: 'Match Cut', description: 'Seamless transition to product' },
  LUTHERAN_CUT: { id: 'lutheran_cut', name: 'J-cut / L-cut', description: 'Audio continues over visual' }
};

// ============================================
// BRAND CONTEXT PRESETS
// ============================================

export const BRAND_VOICES = {
  PROFESSIONAL: { id: 'professional', name: 'Professional', adjectives: ['trusted', 'reliable', 'expert', 'established'] },
  PLAYFUL: { id: 'playful', name: 'Playful', adjectives: ['fun', 'energetic', 'quirky', 'friendly'] },
  LUXURY: { id: 'luxury', name: 'Luxury', adjectives: ['premium', 'exclusive', 'sophisticated', 'elegant'] },
  BOLD: { id: 'bold', name: 'Bold', adjectives: ['daring', 'confident', 'powerful', 'unapologetic'] },
  MINIMAL: { id: 'minimal', name: 'Minimal', adjectives: ['clean', 'simple', 'essential', 'refined'] },
  AUTHENTIC: { id: 'authentic', name: 'Authentic', adjectives: ['genuine', 'honest', 'real', 'relatable'] }
};

export const TARGET_AUDIENCES = {
  GEN_Z: { id: 'gen_z', name: 'Gen Z (18-25)', platforms: ['TikTok', 'Instagram', 'YouTube Shorts'] },
  MILLENNIAL: { id: 'millennial', name: 'Millennials (26-41)', platforms: ['Instagram', 'YouTube', 'LinkedIn'] },
  GEN_X: { id: 'gen_x', name: 'Gen X (42-57)', platforms: ['YouTube', 'Facebook', 'LinkedIn'] },
  BOOMER: { id: 'boomer', name: 'Baby Boomers (58+)', platforms: ['YouTube', 'Facebook'] },
  BUSINESS_PROFESSIONAL: { id: 'business_professional', name: 'Business Professionals', platforms: ['LinkedIn', 'YouTube', 'Website'] },
  CREATIVE_INDUSTRY: { id: 'creative_industry', name: 'Creative Industry', platforms: ['Instagram', 'TikTok', 'Behance'] },
  TECH_SAVVY: { id: 'tech_savvy', name: 'Tech Savvy', platforms: ['YouTube', 'Twitter', 'Reddit'] },
  PARENTS: { id: 'parents', name: 'Parents', platforms: ['Facebook', 'Instagram', 'YouTube'] }
};

// ============================================
// SCENE STRUCTURE TEMPLATES
// ============================================

export const SCENE_STRUCTURES = {
  THREE_ACT: {
    id: 'three_act',
    name: 'Three Act Structure',
    description: 'Classic setup-confrontation-resolution',
    acts: [
      { act: 1, name: 'Setup', duration: '25%', beats: ['Establish world', 'Introduce protagonist', 'Inciting incident'] },
      { act: 2, name: 'Confrontation', duration: '50%', beats: ['Rising action', 'Midpoint shift', 'Complications'] },
      { act: 3, name: 'Resolution', duration: '25%', beats: ['Climax', 'Falling action', 'Final reveal'] }
    ]
  },
  HERO_JOURNEY: {
    id: 'hero_journey',
    name: 'Hero\'s Journey',
    description: 'Transformation narrative arc',
    acts: [
      { act: 1, name: 'Ordinary World', duration: '15%', beats: ['Establish baseline', 'Introduce hero'] },
      { act: 2, name: 'Call to Adventure', duration: '20%', beats: ['Challenge presented', 'Hero hesitates'] },
      { act: 3, name: 'Tests & Allies', duration: '25%', beats: ['Obstacles faced', 'Mentor appears', 'Skills tested'] },
      { act: 4, name: 'Inner Challenge', duration: '20%', beats: ['Fear overcome', 'Transformation begins'] },
      { act: 5, name: 'Return', duration: '20%', beats: ['New equilibrium', 'Lesson learned', 'Inspire others'] }
    ]
  },
  PROBLEM_SOLUTION: {
    id: 'problem_solution',
    name: 'Problem-Solution',
    description: 'Direct problem/solution format',
    acts: [
      { act: 1, name: 'Hook', duration: '10%', beats: ['Pain point identified', 'Relatable struggle'] },
      { act: 2, name: 'Problem Deepen', duration: '25%', beats: ['Problem expanded', 'Emotional impact'] },
      { act: 3, name: 'Solution', duration: '35%', beats: ['Product/service introduced', 'How it works', 'Key features'] },
      { act: 4, name: 'Proof', duration: '20%', beats: ['Testimonial', 'Results showcase'] },
      { act: 5, name: 'CTA', duration: '10%', beats: ['Call to action', 'Final message'] }
    ]
  },
  TESTIMONIAL: {
    id: 'testimonial',
    name: 'Testimonial Story',
    description: 'Customer story format',
    acts: [
      { act: 1, name: 'Before', duration: '20%', beats: ['Customer introduction', 'Problem faced'] },
      { act: 2, name: 'Discovery', duration: '15%', beats: ['How they found solution'] },
      { act: 3, name: 'Experience', duration: '35%', beats: ['Journey with product', 'Key moments', 'Features loved'] },
      { act: 4, name: 'Results', duration: '20%', beats: ['Transformational results', 'Numbers/impact'] },
      { act: 5, name: 'Recommendation', duration: '10%', beats: ['Endorsement', 'Who it\'s for'] }
    ]
  },
  PRODUCT_REVEAL: {
    id: 'product_reveal',
    name: 'Product Reveal',
    description: 'Dramatic product showcase',
    acts: [
      { act: 1, name: 'Tease', duration: '10%', beats: ['Mystery/hint', 'Curiosity build'] },
      { act: 2, name: 'Reveal', duration: '15%', beats: ['Product unveiled', 'Hero shot'] },
      { act: 3, name: 'Features', duration: '35%', beats: ['Key features', 'Benefits', 'Use cases'] },
      { act: 4, name: 'Lifestyle', duration: '25%', beats: ['In-context usage', 'Aspirational imagery'] },
      { act: 5, name: 'Offer', duration: '15%', beats: ['Availability', 'Special offer', 'CTA'] }
    ]
  }
};

// ============================================
// CINEMATIC TEMPLATE DEFINITIONS
// ============================================

export const CINEMATIC_TEMPLATES = [
  // ==================== CINEMATIC FILMS ====================
  {
    id: 'cinematic_short_film',
    name: 'Cinematic Short Film',
    description: 'Professional short film with narrative arc',
    category: CINEMATIC_CATEGORIES.FILM,
    icon: '🎬',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.CINEMATIC_COMMERCIAL,
    duration: { min: 60, max: 180, default: 90 },
    aspectRatios: ['16:9', '21:9', '9:16'],
    sceneStructure: SCENE_STRUCTURES.THREE_ACT,
    quickInputs: [
      { name: 'genre', type: 'select', label: 'Genre', placeholder: 'e.g. drama, action, romance', required: true },
      { name: 'premise', type: 'textarea', label: 'Story Premise', placeholder: 'What happens in your story?', required: true },
      { name: 'tone', type: 'select', label: 'Tone', options: ['dramatic', 'lighthearted', 'mysterious', 'uplifting'] }
    ],
    advancedInputs: [
      { name: 'protagonist', type: 'text', label: 'Main Character' },
      { name: 'setting', type: 'text', label: 'Setting/Location' },
      { name: 'conflict', type: 'textarea', label: 'Central Conflict' },
      { name: 'visualStyle', type: 'select', label: 'Visual Style', options: Object.values(VISUAL_STYLES).map(s => s.id) },
      { name: 'pacing', type: 'select', label: 'Pacing', options: Object.values(PACING_OPTIONS).map(p => p.id) },
      { name: 'musicMood', type: 'text', label: 'Music Mood', placeholder: 'e.g. epic orchestral, ambient tension' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: true,
    includeCTA: false,
    includeBrandContext: false
  },
  {
    id: 'mini_movie',
    name: 'Mini Movie',
    description: 'Multi-scene story-driven video',
    category: CINEMATIC_CATEGORIES.FILM,
    icon: '🎥',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.DRAMATIC_TRAILER,
    duration: { min: 90, max: 300, default: 180 },
    aspectRatios: ['16:9', '9:16'],
    sceneStructure: SCENE_STRUCTURES.THREE_ACT,
    quickInputs: [
      { name: 'story', type: 'textarea', label: 'Story Summary', required: true },
      { name: 'characters', type: 'text', label: 'Characters' },
      { name: 'ending', type: 'select', label: 'Ending Type', options: ['bittersweet', 'happy', 'cliffhanger', 'tragic'] }
    ],
    advancedInputs: [
      { name: 'acts', type: 'custom', label: 'Act Breakdown' },
      { name: 'visualStyle', type: 'select', label: 'Visual Style', options: Object.values(VISUAL_STYLES).map(s => s.id) },
      { name: 'cameraMovements', type: 'multi-select', label: 'Camera Movements', options: Object.values(CAMERA_MOVEMENTS).map(c => c.id) },
      { name: 'musicScore', type: 'text', label: 'Score Style' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: true,
    includeCTA: false,
    includeBrandContext: false
  },
  {
    id: 'trailer_video',
    name: 'Trailer Video',
    description: 'High-impact promotional trailer',
    category: CINEMATIC_CATEGORIES.FILM,
    icon: '🎞️',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.DRAMATIC_TRAILER,
    duration: { min: 30, max: 90, default: 60 },
    aspectRatios: ['16:9', '21:9', '9:16'],
    sceneStructure: SCENE_STRUCTURES.PROBLEM_SOLUTION,
    quickInputs: [
      { name: 'subject', type: 'text', label: 'Subject', placeholder: 'What is the trailer about?', required: true },
      { name: 'genre', type: 'select', label: 'Genre', options: ['action', 'drama', 'comedy', 'horror', 'documentary'] },
      { name: 'hookType', type: 'select', label: 'Hook Style', options: ['mystery', 'emotion', 'action', 'question'] }
    ],
    advancedInputs: [
      { name: 'reveals', type: 'textarea', label: 'Key Reveals' },
      { name: 'music', type: 'text', label: 'Music/Score' },
      { name: 'textOverlays', type: 'custom', label: 'Text Overlays' },
      { name: 'cliffhanger', type: 'textarea', label: 'Cliffhanger Element' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: true,
    includeCTA: true,
    ctaOptions: ['watch_more', 'learn_more'],
    includeBrandContext: true
  },
  {
    id: 'character_driven_scene',
    name: 'Character-Driven Scene',
    description: 'Emotionally focused character moment',
    category: CINEMATIC_CATEGORIES.FILM,
    icon: '👤',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.EMOTIONAL_BRAND_STORY,
    duration: { min: 30, max: 120, default: 60 },
    aspectRatios: ['16:9', '9:16'],
    sceneStructure: null,
    quickInputs: [
      { name: 'character', type: 'text', label: 'Character Name', required: true },
      { name: 'emotion', type: 'select', label: 'Emotion', options: ['joy', 'sadness', 'anger', 'hope', 'love', 'fear', 'determination'] },
      { name: 'moment', type: 'textarea', label: 'The Moment', placeholder: 'What happens emotionally?' }
    ],
    advancedInputs: [
      { name: 'backstory', type: 'textarea', label: 'Backstory Context' },
      { name: 'dialogue', type: 'textarea', label: 'Key Dialogue' },
      { name: 'shotList', type: 'custom', label: 'Shot List' },
      { name: 'visualStyle', type: 'select', label: 'Visual Style', options: Object.values(VISUAL_STYLES).map(s => s.id) }
    ],
    sceneBuilder: false,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: false,
    includeBrandContext: false
  },
  {
    id: 'storyboarded_sequence',
    name: 'Storyboarded Scene Sequence',
    description: 'Carefully planned visual sequence',
    category: CINEMATIC_CATEGORIES.FILM,
    icon: '🎨',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.CINEMATIC_COMMERCIAL,
    duration: { min: 60, max: 300, default: 120 },
    aspectRatios: ['16:9', '21:9'],
    sceneStructure: SCENE_STRUCTURES.THREE_ACT,
    quickInputs: [
      { name: 'sequence', type: 'textarea', label: 'Sequence Description', required: true },
      { name: 'shots', type: 'number', label: 'Number of Shots', min: 3, max: 30 }
    ],
    advancedInputs: [
      { name: 'shotList', type: 'custom', label: 'Detailed Shot List', required: true },
      { name: 'cameraMovements', type: 'multi-select', label: 'Camera Movements', options: Object.values(CAMERA_MOVEMENTS).map(c => c.id) },
      { name: 'timing', type: 'custom', label: 'Timing Per Shot' },
      { name: 'transitions', type: 'custom', label: 'Transitions' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: true,
    includeCTA: false,
    includeBrandContext: false
  },
  {
    id: 'music_driven_visual',
    name: 'Music-Driven Visual Sequence',
    description: 'Visuals synchronized to music',
    category: CINEMATIC_CATEGORIES.FILM,
    icon: '🎵',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.CINEMATIC_COMMERCIAL,
    duration: { min: 60, max: 240, default: 120 },
    aspectRatios: ['16:9', '9:16', '1:1'],
    sceneStructure: null,
    quickInputs: [
      { name: 'musicMood', type: 'select', label: 'Music Mood', options: ['energetic', 'calm', 'dramatic', 'uplifting', 'mysterious'] },
      { name: 'visualTheme', type: 'text', label: 'Visual Theme', placeholder: 'e.g. urban nightlife, nature' }
    ],
    advancedInputs: [
      { name: 'beatMarkers', type: 'custom', label: 'Beat Markers' },
      { name: 'visualSync', type: 'custom', label: 'Visual Synchronization' },
      { name: 'colorPulsing', type: 'checkbox', label: 'Color Pulsing to Beat' },
      { name: 'lyricAlignment', type: 'custom', label: 'Lyric Alignment' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },

  // ==================== BUSINESS & BRAND FILMS ====================
  {
    id: 'brand_film',
    name: 'Brand Film',
    description: 'Long-form brand storytelling video',
    category: CINEMATIC_CATEGORIES.BUSINESS,
    icon: '🏢',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.EMOTIONAL_BRAND_STORY,
    duration: { min: 90, max: 300, default: 180 },
    aspectRatios: ['16:9', '21:9'],
    sceneStructure: SCENE_STRUCTURES.HERO_JOURNEY,
    quickInputs: [
      { name: 'brandName', type: 'text', label: 'Brand Name', required: true },
      { name: 'brandStory', type: 'textarea', label: 'Brand Story', placeholder: 'What is your brand\'s story?', required: true },
      { name: 'values', type: 'text', label: 'Core Values', placeholder: 'e.g. innovation, quality, community' }
    ],
    advancedInputs: [
      { name: 'founderStory', type: 'textarea', label: 'Founder Story' },
      { name: 'mission', type: 'textarea', label: 'Mission Statement' },
      { name: 'vision', type: 'textarea', label: 'Vision Statement' },
      { name: 'visualStyle', type: 'select', label: 'Visual Style', options: Object.values(VISUAL_STYLES).map(s => s.id) },
      { name: 'brandVoice', type: 'select', label: 'Brand Voice', options: Object.values(BRAND_VOICES).map(v => v.id) },
      { name: 'musicMood', type: 'text', label: 'Music Mood' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: true,
    includeCTA: true,
    ctaOptions: ['learn_more', 'visit_us'],
    includeBrandContext: true
  },
  {
    id: 'business_film',
    name: 'Business Film',
    description: 'Professional business presentation',
    category: CINEMATIC_CATEGORIES.BUSINESS,
    icon: '💼',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.CINEMATIC_COMMERCIAL,
    duration: { min: 60, max: 300, default: 120 },
    aspectRatios: ['16:9', '9:16'],
    sceneStructure: SCENE_STRUCTURES.PROBLEM_SOLUTION,
    quickInputs: [
      { name: 'company', type: 'text', label: 'Company Name', required: true },
      { name: 'service', type: 'text', label: 'Service/Product', required: true },
      { name: 'keyMessage', type: 'textarea', label: 'Key Message', required: true }
    ],
    advancedInputs: [
      { name: 'targetAudience', type: 'select', label: 'Target Audience', options: Object.values(TARGET_AUDIENCES).map(a => a.id) },
      { name: 'uniqueValue', type: 'textarea', label: 'Unique Value Proposition' },
      { name: 'proofPoints', type: 'custom', label: 'Proof Points' },
      { name: 'teamHighlights', type: 'textarea', label: 'Team Highlights' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    ctaOptions: ['get_quote', 'learn_more', 'book_now'],
    includeBrandContext: true
  },
  {
    id: 'visual_pitch_film',
    name: 'Visual Pitch Film',
    description: 'Startup/investor pitch video',
    category: CINEMATIC_CATEGORIES.BUSINESS,
    icon: '🚀',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.INSPIRATIONAL_FOUNDER,
    duration: { min: 60, max: 180, default: 120 },
    aspectRatios: ['16:9'],
    sceneStructure: SCENE_STRUCTURES.HERO_JOURNEY,
    quickInputs: [
      { name: 'startupName', type: 'text', label: 'Startup Name', required: true },
      { name: 'problem', type: 'textarea', label: 'Problem You Solve', required: true },
      { name: 'solution', type: 'textarea', label: 'Your Solution', required: true },
      { name: 'founderName', type: 'text', label: 'Founder Name' }
    ],
    advancedInputs: [
      { name: 'traction', type: 'textarea', label: 'Traction/Results' },
      { name: 'market', type: 'text', label: 'Market Opportunity' },
      { name: 'team', type: 'textarea', label: 'Team Overview' },
      { name: 'ask', type: 'textarea', label: 'The Ask' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    ctaOptions: ['get_quote', 'visit_us'],
    includeBrandContext: true
  },
  {
    id: 'case_study_film',
    name: 'Case Study Film',
    description: 'Client success story video',
    category: CINEMATIC_CATEGORIES.BUSINESS,
    icon: '📊',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.CUSTOMER_TRANSFORMATION,
    duration: { min: 90, max: 240, default: 150 },
    aspectRatios: ['16:9', '9:16'],
    sceneStructure: SCENE_STRUCTURES.TESTIMONIAL,
    quickInputs: [
      { name: 'clientName', type: 'text', label: 'Client Name', required: true },
      { name: 'industry', type: 'text', label: 'Industry' },
      { name: 'challenge', type: 'textarea', label: 'The Challenge', required: true },
      { name: 'solution', type: 'textarea', label: 'Your Solution', required: true },
      { name: 'results', type: 'textarea', label: 'Results/Impact', required: true }
    ],
    advancedInputs: [
      { name: 'metrics', type: 'custom', label: 'Key Metrics' },
      { name: 'testimonialQuote', type: 'textarea', label: 'Testimonial Quote' },
      { name: 'timeline', type: 'custom', label: 'Project Timeline' },
      { name: 'teamInvolved', type: 'text', label: 'Team Involved' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    ctaOptions: ['get_quote', 'learn_more'],
    includeBrandContext: true
  },
  {
    id: 'founder_story_film',
    name: 'Founder Story Film',
    description: 'Personal founder narrative',
    category: CINEMATIC_CATEGORIES.PERSONAL,
    icon: '💡',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.INSPIRATIONAL_FOUNDER,
    duration: { min: 90, max: 300, default: 180 },
    aspectRatios: ['16:9', '9:16'],
    sceneStructure: SCENE_STRUCTURES.HERO_JOURNEY,
    quickInputs: [
      { name: 'founderName', type: 'text', label: 'Founder Name', required: true },
      { name: 'journey', type: 'textarea', label: 'Your Story', placeholder: 'Share your journey...', required: true },
      { name: 'lesson', type: 'text', label: 'Key Lesson' }
    ],
    advancedInputs: [
      { name: 'background', type: 'textarea', label: 'Background Context' },
      { name: 'pivotalMoment', type: 'textarea', label: 'Pivotal Moment' },
      { name: 'obstacles', type: 'textarea', label: 'Obstacles Overcome' },
      { name: 'vision', type: 'textarea', label: 'Future Vision' },
      { name: 'personalDetails', type: 'textarea', label: 'Personal Details' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    ctaOptions: ['learn_more', 'visit_us', 'shop_now'],
    includeBrandContext: true
  },

  // ==================== COMMERCIAL & AD FILMS ====================
  {
    id: 'ad_film',
    name: 'Ad Film',
    description: 'High-production commercial',
    category: CINEMATIC_CATEGORIES.COMMERCIAL,
    icon: '📺',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.BOLD_DIRECT_RESPONSE,
    duration: { min: 15, max: 60, default: 30 },
    aspectRatios: ['16:9', '9:16', '1:1'],
    sceneStructure: SCENE_STRUCTURES.PROBLEM_SOLUTION,
    quickInputs: [
      { name: 'product', type: 'text', label: 'Product Name', required: true },
      { name: 'keyBenefit', type: 'text', label: 'Key Benefit', required: true },
      { name: 'offer', type: 'text', label: 'Special Offer' }
    ],
    advancedInputs: [
      { name: 'targetAudience', type: 'select', label: 'Target Audience', options: Object.values(TARGET_AUDIENCES).map(a => a.id) },
      { name: 'hook', type: 'text', label: 'Hook (First 3 Seconds)' },
      { name: 'proofPoints', type: 'textarea', label: 'Proof Points' },
      { name: 'urgency', type: 'text', label: 'Urgency Element' },
      { name: 'visualStyle', type: 'select', label: 'Visual Style', options: Object.values(VISUAL_STYLES).map(s => s.id) }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: true,
    includeCTA: true,
    ctaOptions: ['shop_now', 'sign_up', 'book_now', 'call_now', 'swipe_up'],
    includeBrandContext: true
  },
  {
    id: 'ai_commercial',
    name: 'AI Commercial',
    description: 'AI-themed commercial content',
    category: CINEMATIC_CATEGORIES.COMMERCIAL,
    icon: '🤖',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.CINEMATIC_COMMERCIAL,
    duration: { min: 30, max: 90, default: 45 },
    aspectRatios: ['16:9', '9:16'],
    sceneStructure: SCENE_STRUCTURES.PROBLEM_SOLUTION,
    quickInputs: [
      { name: 'product', type: 'text', label: 'AI Product', required: true },
      { name: 'capability', type: 'textarea', label: 'Key Capability', required: true },
      { name: 'useCase', type: 'text', label: 'Primary Use Case' }
    ],
    advancedInputs: [
      { name: 'visualEffects', type: 'multi-select', label: 'Visual Effects', options: ['futuristic', 'data visualization', 'neural networks', 'holographic', 'cyber'] },
      { name: 'techAesthetic', type: 'select', label: 'Tech Aesthetic', options: ['minimalist tech', 'sci-fi inspired', 'clean modern', 'futuristic'] }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'high_end_ugc_cinematic',
    name: 'High-End UGC Cinematic Ad',
    description: 'Authentic-feeling premium ad',
    category: CINEMATIC_CATEGORIES.COMMERCIAL,
    icon: '✨',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.CINEMATIC_COMMERCIAL,
    duration: { min: 15, max: 60, default: 30 },
    aspectRatios: ['9:16', '1:1', '16:9'],
    sceneStructure: null,
    quickInputs: [
      { name: 'product', type: 'text', label: 'Product', required: true },
      { name: 'lifestyle', type: 'textarea', label: 'Lifestyle Context', placeholder: 'e.g. morning routine, travel' }
    ],
    advancedInputs: [
      { name: 'firstPersonPerspective', type: 'checkbox', label: 'First Person Perspective' },
      { name: 'naturalLighting', type: 'checkbox', label: 'Natural/Available Lighting' },
      { name: 'cameraMovement', type: 'select', label: 'Camera Feel', options: ['handheld', 'stabilized', 'tripod'] }
    ],
    sceneBuilder: false,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'promo_film',
    name: 'Promo Film',
    description: 'Event/promotion announcement',
    category: CINEMATIC_CATEGORIES.COMMERCIAL,
    icon: '🎉',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.BOLD_DIRECT_RESPONSE,
    duration: { min: 15, max: 60, default: 30 },
    aspectRatios: ['16:9', '9:16', '1:1'],
    sceneStructure: SCENE_STRUCTURES.PROBLEM_SOLUTION,
    quickInputs: [
      { name: 'event', type: 'text', label: 'Event/Offer', required: true },
      { name: 'date', type: 'text', label: 'Date/Details' },
      { name: 'excitement', type: 'select', label: 'Tone', options: ['urgent', 'celebratory', 'mysterious', 'exclusive'] }
    ],
    advancedInputs: [
      { name: 'eventHighlights', type: 'textarea', label: 'Event Highlights' },
      { name: 'urgency', type: 'text', label: 'Urgency Copy' },
      { name: 'countdown', type: 'checkbox', label: 'Include Countdown' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    ctaOptions: ['shop_now', 'sign_up', 'book_now'],
    includeBrandContext: true
  },

  // ==================== SOCIAL MEDIA CINEMATIC ====================
  {
    id: 'social_cinematic_reel',
    name: 'Social Cinematic Reel',
    description: 'Vertical cinematic social content',
    category: CINEMATIC_CATEGORIES.SOCIAL,
    icon: '📱',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.CINEMATIC_SOCIAL_SHORT,
    duration: { min: 5, max: 60, default: 15 },
    aspectRatios: ['9:16'],
    sceneStructure: null,
    quickInputs: [
      { name: 'hook', type: 'text', label: 'Hook (First Second)', placeholder: 'Grab attention...', required: true },
      { name: 'content', type: 'textarea', label: 'Main Content', required: true },
      { name: 'trend', type: 'select', label: 'Trend Style', options: ['none', 'challenge', 'ASMR', 'before_after', 'day_in_life'] }
    ],
    advancedInputs: [
      { name: 'textOverlays', type: 'custom', label: 'Text Overlays' },
      { name: 'musicSync', type: 'checkbox', label: 'Sync to Music' },
      { name: 'loop', type: 'checkbox', label: 'Seamless Loop' },
      { name: 'captionStyle', type: 'select', label: 'Caption Style', options: ['standard', 'animated', 'bold', 'minimal'] }
    ],
    sceneBuilder: false,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    ctaOptions: ['swipe_up', 'watch_more', 'subscribe'],
    includeBrandContext: true
  },
  {
    id: 'youtube_cinematic_short',
    name: 'YouTube Cinematic Short',
    description: 'YouTube Shorts optimized content',
    category: CINEMATIC_CATEGORIES.SOCIAL,
    icon: '▶️',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.CINEMATIC_SOCIAL_SHORT,
    duration: { min: 15, max: 60, default: 30 },
    aspectRatios: ['9:16', '1:1'],
    sceneStructure: null,
    quickInputs: [
      { name: 'topic', type: 'text', label: 'Topic', required: true },
      { name: 'angle', type: 'text', label: 'Unique Angle', placeholder: 'What makes this interesting?' }
    ],
    advancedInputs: [
      { name: 'nugget', type: 'text', label: 'Key Takeaway/Nugget' },
      { name: 'pattern', type: 'select', label: 'Pattern Interruption', options: ['none', 'visual', 'audio', 'text'] }
    ],
    sceneBuilder: false,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    ctaOptions: ['subscribe', 'watch_more'],
    includeBrandContext: true
  },

  // ==================== DOCUMENTARY STYLE ====================
  {
    id: 'documentary_style',
    name: 'Documentary-Style Video',
    description: 'Authentic documentary narrative',
    category: CINEMATIC_CATEGORIES.DOCUMENTARY,
    icon: '📽️',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.DOCUMENTARY,
    duration: { min: 120, max: 600, default: 300 },
    aspectRatios: ['16:9', '21:9'],
    sceneStructure: SCENE_STRUCTURES.THREE_ACT,
    quickInputs: [
      { name: 'subject', type: 'text', label: 'Subject', required: true },
      { name: 'angle', type: 'textarea', label: 'Documentary Angle', placeholder: 'What aspect are you exploring?', required: true },
      { name: 'interviewSubject', type: 'text', label: 'Main Interview Subject' }
    ],
    advancedInputs: [
      { name: 'narrativeVoiceover', type: 'textarea', label: 'Narrative Voiceover Script' },
      { name: 'brollList', type: 'custom', label: 'B-Roll Shot List' },
      { name: 'interviewQuestions', type: 'custom', label: 'Key Interview Questions' },
      { name: 'archivalFootage', type: 'text', label: 'Archival/Stock Footage Needs' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: false,
    includeBrandContext: true
  },
  {
    id: 'cinematic_explainer',
    name: 'Cinematic Explainer Video',
    description: 'Story-driven explainer content',
    category: CINEMATIC_CATEGORIES.DOCUMENTARY,
    icon: '💡',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.EMOTIONAL_BRAND_STORY,
    duration: { min: 60, max: 180, default: 120 },
    aspectRatios: ['16:9', '9:16'],
    sceneStructure: SCENE_STRUCTURES.PROBLEM_SOLUTION,
    quickInputs: [
      { name: 'concept', type: 'text', label: 'Concept to Explain', required: true },
      { name: 'simplifiedVersion', type: 'textarea', label: 'Simple Explanation', required: true },
      { name: 'analogy', type: 'text', label: 'Real-World Analogy' }
    ],
    advancedInputs: [
      { name: 'steps', type: 'custom', label: 'Step-by-Step Breakdown' },
      { name: 'visualMetaphors', type: 'textarea', label: 'Visual Metaphors' },
      { name: 'animationStyle', type: 'select', label: 'Animation Integration', options: ['none', 'subtle', 'moderate', 'extensive'] }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: true,
    includeCTA: true,
    ctaOptions: ['learn_more', 'get_quote'],
    includeBrandContext: true
  },

  // ==================== PERSONAL STORY ====================
  {
    id: 'testimonial_film',
    name: 'Testimonial Film',
    description: 'Customer testimonial video',
    category: CINEMATIC_CATEGORIES.PERSONAL,
    icon: '💬',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.CUSTOMER_TRANSFORMATION,
    duration: { min: 60, max: 180, default: 90 },
    aspectRatios: ['16:9', '9:16'],
    sceneStructure: SCENE_STRUCTURES.TESTIMONIAL,
    quickInputs: [
      { name: 'customerName', type: 'text', label: 'Customer Name', required: true },
      { name: 'customerRole', type: 'text', label: 'Customer Role/Title' },
      { name: 'story', type: 'textarea', label: 'Their Story', placeholder: 'Share the customer journey...', required: true },
      { name: 'results', type: 'textarea', label: 'Results Achieved', required: true }
    ],
    advancedInputs: [
      { name: 'challenge', type: 'textarea', label: 'Challenge Faced' },
      { name: 'solution', type: 'textarea', label: 'Solution Experience' },
      { name: 'quote', type: 'textarea', label: 'Key Quote' },
      { name: 'metrics', type: 'text', label: 'Quantifiable Results' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    ctaOptions: ['learn_more', 'get_quote'],
    includeBrandContext: true
  },

  // ==================== INDUSTRY SPECIFIC ====================
  {
    id: 'luxury_brand_style',
    name: 'Luxury Brand Style Video',
    description: 'Premium luxury brand content',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '💎',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.LUXURY_BRAND_PROMO,
    duration: { min: 30, max: 120, default: 60 },
    aspectRatios: ['16:9', '21:9', '9:16'],
    sceneStructure: SCENE_STRUCTURES.PROBLEM_SOLUTION,
    quickInputs: [
      { name: 'product', type: 'text', label: 'Luxury Product', required: true },
      { name: 'aspiration', type: 'text', label: 'Aspiration/Lifestyle', placeholder: 'e.g. exclusive experiences' }
    ],
    advancedInputs: [
      { name: 'visualStyle', type: 'select', label: 'Visual Style', options: [VISUAL_STYLES.LUXURY_ELEGANT.id] },
      { name: 'colorPalette', type: 'custom', label: 'Color Palette' },
      { name: 'soundDesign', type: 'select', label: 'Sound Design', options: ['ambient', 'orchestral', 'minimal', 'nature'] }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: true,
    includeCTA: true,
    ctaOptions: ['shop_now', 'book_now', 'visit_us'],
    includeBrandContext: true
  },
  {
    id: 'restaurant_cafe_cinematic',
    name: 'Restaurant/Cafe Cinematic Film',
    description: 'Food establishment promotional',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '🍽️',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.CINEMATIC_COMMERCIAL,
    duration: { min: 30, max: 90, default: 45 },
    aspectRatios: ['16:9', '9:16', '1:1'],
    sceneStructure: SCENE_STRUCTURES.PROBLEM_SOLUTION,
    quickInputs: [
      { name: 'restaurantName', type: 'text', label: 'Restaurant Name', required: true },
      { name: 'cuisine', type: 'text', label: 'Cuisine Type' },
      { name: 'signature', type: 'text', label: 'Signature Dish/Drink' },
      { name: 'ambiance', type: 'select', label: 'Ambiance', options: ['cozy', 'elegant', 'vibrant', 'rustic', 'modern'] }
    ],
    advancedInputs: [
      { name: 'foodShots', type: 'custom', label: 'Food Shot List' },
      { name: 'interiorShots', type: 'custom', label: 'Interior/Exterior Shots' },
      { name: 'chefFeature', type: 'checkbox', label: 'Include Chef Feature' },
      { name: 'customerMoments', type: 'checkbox', label: 'Include Customer Moments' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: true,
    includeCTA: true,
    ctaOptions: ['book_now', 'visit_us', 'menu'],
    includeBrandContext: true
  },
  {
    id: 'real_estate_cinematic',
    name: 'Real Estate Cinematic Property',
    description: 'Property showcase video',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '🏠',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.CINEMATIC_COMMERCIAL,
    duration: { min: 60, max: 180, default: 90 },
    aspectRatios: ['16:9', '9:16'],
    sceneStructure: SCENE_STRUCTURES.PROBLEM_SOLUTION,
    quickInputs: [
      { name: 'propertyName', type: 'text', label: 'Property Name/Address', required: true },
      { name: 'propertyType', type: 'select', label: 'Property Type', options: ['house', 'apartment', 'condo', 'commercial', 'land'] },
      { name: 'keyFeatures', type: 'textarea', label: 'Key Features', required: true },
      { name: 'price', type: 'text', label: 'Price/Value Proposition' }
    ],
    advancedInputs: [
      { name: 'roomList', type: 'custom', label: 'Rooms to Feature' },
      { name: 'exteriorShots', type: 'custom', label: 'Exterior Shots' },
      { name: 'aerialFootage', type: 'checkbox', label: 'Include Aerial Footage' },
      { name: 'neighborhood', type: 'checkbox', label: 'Include Neighborhood Shots' },
      { name: 'agentFeature', type: 'checkbox', label: 'Include Agent Feature' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: true,
    includeCTA: true,
    ctaOptions: ['book_now', 'visit_us', 'call_now'],
    includeBrandContext: true
  },
  {
    id: 'automotive_cinematic',
    name: 'Automotive Cinematic Promo',
    description: 'Vehicle showcase video',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '🚗',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.CINEMATIC_COMMERCIAL,
    duration: { min: 45, max: 120, default: 60 },
    aspectRatios: ['16:9', '21:9', '9:16'],
    sceneStructure: SCENE_STRUCTURES.PROBLEM_SOLUTION,
    quickInputs: [
      { name: 'vehicleModel', type: 'text', label: 'Vehicle Model', required: true },
      { name: 'keySpecs', type: 'textarea', label: 'Key Specifications', required: true },
      { name: 'lifestyle', type: 'text', label: 'Lifestyle Context', placeholder: 'e.g. adventure, family, luxury' }
    ],
    advancedInputs: [
      { name: 'exteriorShots', type: 'custom', label: 'Exterior Shot List' },
      { name: 'interiorShots', type: 'custom', label: 'Interior Shot List' },
      { name: 'drivingShots', type: 'checkbox', label: 'Include Driving Shots' },
      { name: 'techFeatures', type: 'custom', label: 'Tech Features to Highlight' },
      { name: 'performanceShots', type: 'checkbox', label: 'Include Performance Footage' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: true,
    includeCTA: true,
    ctaOptions: ['book_now', 'visit_us', 'get_quote'],
    includeBrandContext: true
  },
  {
    id: 'fashion_lifestyle_film',
    name: 'Fashion & Lifestyle Film',
    description: 'Fashion brand/lifestyle content',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '👗',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.CINEMATIC_COMMERCIAL,
    duration: { min: 30, max: 120, default: 45 },
    aspectRatios: ['9:16', '16:9', '1:1'],
    sceneStructure: null,
    quickInputs: [
      { name: 'brandName', type: 'text', label: 'Brand Name', required: true },
      { name: 'collection', type: 'text', label: 'Collection/Line' },
      { name: 'style', type: 'select', label: 'Style', options: ['streetwear', 'luxury', 'sporty', 'bohemian', 'minimalist', 'vintage'] }
    ],
    advancedInputs: [
      { name: 'modelShots', type: 'custom', label: 'Model Shot List' },
      { name: 'productCloseups', type: 'custom', label: 'Product Close-ups' },
      { name: 'location', type: 'text', label: 'Location/Setting' },
      { name: 'musicMood', type: 'text', label: 'Music Mood' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: true,
    includeCTA: true,
    ctaOptions: ['shop_now', 'learn_more'],
    includeBrandContext: true
  },
  {
    id: 'fitness_transformation',
    name: 'Fitness Transformation Video',
    description: 'Before/after fitness showcase',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '💪',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.CUSTOMER_TRANSFORMATION,
    duration: { min: 45, max: 120, default: 60 },
    aspectRatios: ['16:9', '9:16'],
    sceneStructure: SCENE_STRUCTURES.TESTIMONIAL,
    quickInputs: [
      { name: 'personName', type: 'text', label: 'Person\'s Name', required: true },
      { name: 'journey', type: 'textarea', label: 'Fitness Journey', required: true },
      { name: 'results', type: 'textarea', label: 'Results Achieved', required: true }
    ],
    advancedInputs: [
      { name: 'beforeStats', type: 'custom', label: 'Before Stats' },
      { name: 'afterStats', type: 'custom', label: 'After Stats' },
      { name: 'milestones', type: 'custom', label: 'Key Milestones' },
      { name: 'workoutStyle', type: 'text', label: 'Workout Style' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    ctaOptions: ['learn_more', 'get_quote', 'sign_up'],
    includeBrandContext: true
  },
  {
    id: 'event_recap_film',
    name: 'Event Recap Film',
    description: 'Event highlight reel',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '🎪',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.CINEMATIC_COMMERCIAL,
    duration: { min: 60, max: 240, default: 120 },
    aspectRatios: ['16:9', '9:16'],
    sceneStructure: null,
    quickInputs: [
      { name: 'eventName', type: 'text', label: 'Event Name', required: true },
      { name: 'eventType', type: 'select', label: 'Event Type', options: ['conference', 'wedding', 'concert', 'corporate', 'festival', 'sports'] },
      { name: 'highlights', type: 'textarea', label: 'Key Highlights', required: true }
    ],
    advancedInputs: [
      { name: 'keynoteShots', type: 'checkbox', label: 'Include Keynote/Speaker Shots' },
      { name: 'crowdShots', type: 'checkbox', label: 'Include Crowd Reactions' },
      { name: 'behindScenes', type: 'checkbox', label: 'Include Behind-the-Scenes' },
      { name: 'interviews', type: 'checkbox', label: 'Include Attendee Interviews' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    ctaOptions: ['watch_more', 'learn_more', 'subscribe'],
    includeBrandContext: true
  },
  {
    id: 'local_business_cinematic',
    name: 'Local Business Cinematic Promo',
    description: 'Local business promotional video',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '🏪',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.EMOTIONAL_BRAND_STORY,
    duration: { min: 45, max: 120, default: 60 },
    aspectRatios: ['16:9', '9:16'],
    sceneStructure: SCENE_STRUCTURES.PROBLEM_SOLUTION,
    quickInputs: [
      { name: 'businessName', type: 'text', label: 'Business Name', required: true },
      { name: 'businessType', type: 'text', label: 'Business Type', placeholder: 'e.g. bakery, salon, auto repair' },
      { name: 'whatMakesSpecial', type: 'textarea', label: 'What Makes You Special', required: true },
      { name: 'location', type: 'text', label: 'Location/Neighborhood' }
    ],
    advancedInputs: [
      { name: 'ownerStory', type: 'textarea', label: 'Owner/Team Story' },
      { name: 'productHighlights', type: 'custom', label: 'Product/Service Highlights' },
      { name: 'customerTestimonials', type: 'checkbox', label: 'Include Customer Testimonials' },
      { name: 'communityInvolvement', type: 'text', label: 'Community Involvement' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    ctaOptions: ['visit_us', 'book_now', 'call_now'],
    includeBrandContext: true
  },

  // ==================== NARRATIVE & STORY TEMPLATES ====================
  {
    id: 'opening_scene',
    name: 'Opening Scene',
    description: 'Captivating opening that hooks viewers immediately',
    category: CINEMATIC_CATEGORIES.NARRATIVE,
    icon: '🎬',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.CINEMATIC_COMMERCIAL,
    duration: { min: 15, max: 60, default: 30 },
    aspectRatios: ['16:9', '21:9'],
    sceneStructure: null,
    quickInputs: [
      { name: 'hookType', type: 'select', label: 'Hook Type', options: ['mystery', 'action', 'emotion', 'question', 'visual'], required: true },
      { name: 'setting', type: 'text', label: 'Setting', placeholder: 'Where does this open?' }
    ],
    advancedInputs: [
      { name: 'incitingIncident', type: 'textarea', label: 'Inciting Incident' },
      { name: 'visualStyle', type: 'select', label: 'Visual Style', options: Object.values(VISUAL_STYLES).map(s => s.id) }
    ],
    sceneBuilder: false,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: false,
    includeBrandContext: false
  },
  {
    id: 'character_introduction_scene',
    name: 'Character Introduction Scene',
    description: 'Memorable introduction of a key character',
    category: CINEMATIC_CATEGORIES.NARRATIVE,
    icon: '👤',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.EMOTIONAL_BRAND_STORY,
    duration: { min: 30, max: 90, default: 45 },
    aspectRatios: ['16:9', '9:16'],
    sceneStructure: null,
    quickInputs: [
      { name: 'characterName', type: 'text', label: 'Character Name', required: true },
      { name: 'characterTrait', type: 'text', label: 'Key Trait', placeholder: 'What defines this character?' }
    ],
    advancedInputs: [
      { name: 'backstoryHint', type: 'textarea', label: 'Backstory Hint' },
      { name: 'visualStyle', type: 'select', label: 'Visual Style', options: Object.values(VISUAL_STYLES).map(s => s.id) },
      { name: 'shotType', type: 'select', label: 'Shot Type', options: Object.values(SHOT_TYPES).map(s => s.id) }
    ],
    sceneBuilder: false,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: false,
    includeBrandContext: false
  },
  {
    id: 'conflict_scene',
    name: 'Conflict Scene',
    description: 'High-stakes confrontation or obstacle',
    category: CINEMATIC_CATEGORIES.NARRATIVE,
    icon: '⚔️',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.DRAMATIC_TRAILER,
    duration: { min: 30, max: 120, default: 60 },
    aspectRatios: ['16:9'],
    sceneStructure: null,
    quickInputs: [
      { name: 'conflictType', type: 'select', label: 'Conflict Type', options: ['person vs person', 'person vs nature', 'person vs self', 'person vs society'] },
      { name: 'stakes', type: 'textarea', label: 'What is at stake?', required: true }
    ],
    advancedInputs: [
      { name: 'protagonistGoal', type: 'textarea', label: 'Protagonist Goal' },
      { name: 'antagonistForce', type: 'textarea', label: 'Opposing Force' },
      { name: 'visualStyle', type: 'select', label: 'Visual Style', options: Object.values(VISUAL_STYLES).map(s => s.id) },
      { name: 'pacing', type: 'select', label: 'Pacing', options: Object.values(PACING_OPTIONS).map(p => p.id) }
    ],
    sceneBuilder: false,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: false,
    includeBrandContext: false
  },
  {
    id: 'emotional_turning_point',
    name: 'Emotional Turning Point',
    description: 'Powerful moment that changes everything',
    category: CINEMATIC_CATEGORIES.NARRATIVE,
    icon: '💫',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.EMOTIONAL_BRAND_STORY,
    duration: { min: 20, max: 90, default: 45 },
    aspectRatios: ['16:9', '9:16'],
    sceneStructure: null,
    quickInputs: [
      { name: 'emotion', type: 'select', label: 'Primary Emotion', options: ['joy', 'grief', 'love', 'fear', 'hope', 'anger', 'revelation'] },
      { name: 'turningPoint', type: 'textarea', label: 'What causes the turn?', required: true }
    ],
    advancedInputs: [
      { name: 'backstory', type: 'textarea', label: 'Emotional Context' },
      { name: 'visualStyle', type: 'select', label: 'Visual Style', options: Object.values(VISUAL_STYLES).map(s => s.id) }
    ],
    sceneBuilder: false,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: false,
    includeBrandContext: false
  },
  {
    id: 'climax_scene',
    name: 'Climax Scene',
    description: 'The peak moment of action or revelation',
    category: CINEMATIC_CATEGORIES.NARRATIVE,
    icon: '🔥',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.DRAMATIC_TRAILER,
    duration: { min: 30, max: 180, default: 90 },
    aspectRatios: ['16:9', '21:9'],
    sceneStructure: null,
    quickInputs: [
      { name: 'climaxType', type: 'select', label: 'Climax Type', options: ['action', 'revelation', 'emotional', 'decision'] },
      { name: 'mainQuestion', type: 'textarea', label: 'The Central Question', required: true }
    ],
    advancedInputs: [
      { name: 'risingAction', type: 'textarea', label: 'Rising Tension Build-up' },
      { name: 'visualStyle', type: 'select', label: 'Visual Style', options: Object.values(VISUAL_STYLES).map(s => s.id) },
      { name: 'pacing', type: 'select', label: 'Pacing', options: ['fast', 'montage'] }
    ],
    sceneBuilder: false,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: false,
    includeBrandContext: false
  },
  {
    id: 'resolution_scene',
    name: 'Resolution Scene',
    description: 'Wrapping up story threads beautifully',
    category: CINEMATIC_CATEGORIES.NARRATIVE,
    icon: '🎁',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.EMOTIONAL_BRAND_STORY,
    duration: { min: 30, max: 120, default: 60 },
    aspectRatios: ['16:9', '9:16'],
    sceneStructure: null,
    quickInputs: [
      { name: 'resolutionType', type: 'select', label: 'Resolution Type', options: ['bittersweet', 'happy', 'open', 'circular'] },
      { name: 'mainTakeaway', type: 'text', label: 'Main Takeaway', placeholder: 'What should viewers feel?' }
    ],
    advancedInputs: [
      { name: 'looseEnds', type: 'textarea', label: 'Loose Ends to Tie' },
      { name: 'visualStyle', type: 'select', label: 'Visual Style', options: Object.values(VISUAL_STYLES).map(s => s.id) }
    ],
    sceneBuilder: false,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: false,
    includeBrandContext: false
  },
  {
    id: 'voiceover_story_film',
    name: 'Voiceover Story Film',
    description: 'Narrative driven by powerful voiceover',
    category: CINEMATIC_CATEGORIES.NARRATIVE,
    icon: '🎙️',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.EMOTIONAL_BRAND_STORY,
    duration: { min: 60, max: 180, default: 90 },
    aspectRatios: ['16:9', '9:16'],
    sceneStructure: SCENE_STRUCTURES.HERO_JOURNEY,
    quickInputs: [
      { name: 'storyTheme', type: 'text', label: 'Story Theme', required: true },
      { name: 'narratorVoice', type: 'select', label: 'Narrator Voice', options: ['wise', 'youthful', 'professional', 'conversational'] }
    ],
    advancedInputs: [
      { name: 'voiceoverText', type: 'textarea', label: 'Voiceover Script' },
      { name: 'visualStyle', type: 'select', label: 'Visual Style', options: Object.values(VISUAL_STYLES).map(s => s.id) },
      { name: 'musicMood', type: 'text', label: 'Music Mood' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: false,
    includeBrandContext: false
  },

  // ==================== FILM GENRE TEMPLATES ====================
  {
    id: 'drama_film_scene',
    name: 'Drama Film Scene',
    description: 'Intense dramatic character moment',
    category: CINEMATIC_CATEGORIES.FILM_GENRE,
    icon: '🎭',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.EMOTIONAL_BRAND_STORY,
    duration: { min: 60, max: 180, default: 90 },
    aspectRatios: ['16:9'],
    sceneStructure: SCENE_STRUCTURES.THREE_ACT,
    quickInputs: [
      { name: 'dramaticSituation', type: 'textarea', label: 'Dramatic Situation', required: true },
      { name: 'characterEmotion', type: 'select', label: 'Character Emotion', options: ['conflict', 'grief', 'love', 'determination', 'despair'] }
    ],
    advancedInputs: [
      { name: 'dialogue', type: 'textarea', label: 'Key Dialogue' },
      { name: 'visualStyle', type: 'select', label: 'Visual Style', options: Object.values(VISUAL_STYLES).map(s => s.id) }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: true,
    includeCTA: false,
    includeBrandContext: false
  },
  {
    id: 'action_film_scene',
    name: 'Action Film Scene',
    description: 'High-octane action sequence',
    category: CINEMATIC_CATEGORIES.FILM_GENRE,
    icon: '💥',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.BOLD_DIRECT_RESPONSE,
    duration: { min: 30, max: 120, default: 60 },
    aspectRatios: ['16:9', '21:9'],
    sceneStructure: null,
    quickInputs: [
      { name: 'actionType', type: 'select', label: 'Action Type', options: ['chase', 'fight', 'escape', 'battle', 'stunt'] },
      { name: 'location', type: 'text', label: 'Location', placeholder: 'Where does the action happen?' }
    ],
    advancedInputs: [
      { name: 'stunts', type: 'textarea', label: 'Stunt Description' },
      { name: 'visualStyle', type: 'select', label: 'Visual Style', options: Object.values(VISUAL_STYLES).map(s => s.id) },
      { name: 'pacing', type: 'select', label: 'Pacing', options: ['fast', 'montage'] }
    ],
    sceneBuilder: false,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: false,
    includeBrandContext: false
  },
  {
    id: 'thriller_scene',
    name: 'Thriller Scene',
    description: 'Suspenseful edge-of-your-seat moment',
    category: CINEMATIC_CATEGORIES.FILM_GENRE,
    icon: '😰',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.DRAMATIC_TRAILER,
    duration: { min: 30, max: 120, default: 60 },
    aspectRatios: ['16:9'],
    sceneStructure: null,
    quickInputs: [
      { name: 'threat', type: 'textarea', label: 'The Threat', required: true },
      { name: 'tensionType', type: 'select', label: 'Tension Type', options: ['psychological', 'physical', 'environmental', 'ticking clock'] }
    ],
    advancedInputs: [
      { name: 'suspenseBuild', type: 'textarea', label: 'Suspense Build-up' },
      { name: 'visualStyle', type: 'select', label: 'Visual Style', options: Object.values(VISUAL_STYLES).map(s => s.id) }
    ],
    sceneBuilder: false,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: false,
    includeBrandContext: false
  },
  {
    id: 'sci_fi_film_scene',
    name: 'Sci-Fi Film Scene',
    description: 'Futuristic sci-fi visual spectacle',
    category: CINEMATIC_CATEGORIES.FILM_GENRE,
    icon: '🚀',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.CINEMATIC_COMMERCIAL,
    duration: { min: 45, max: 150, default: 90 },
    aspectRatios: ['16:9', '21:9'],
    sceneStructure: null,
    quickInputs: [
      { name: 'sciFiElement', type: 'select', label: 'Sci-Fi Element', options: ['space', 'AI', 'time travel', 'dystopia', 'technology'] },
      { name: 'setting', type: 'text', label: 'Setting', placeholder: 'Describe the environment' }
    ],
    advancedInputs: [
      { name: 'technology', type: 'textarea', label: 'Key Technology' },
      { name: 'visualStyle', type: 'select', label: 'Visual Style', options: ['bold_color_grade', 'low_key_dark'] }
    ],
    sceneBuilder: false,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: false,
    includeBrandContext: false
  },
  {
    id: 'noir_film_scene',
    name: 'Noir Film Scene',
    description: 'Classic film noir atmospheric moment',
    category: CINEMATIC_CATEGORIES.FILM_GENRE,
    icon: '🕵️',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.DRAMATIC_TRAILER,
    duration: { min: 30, max: 120, default: 60 },
    aspectRatios: ['16:9', '4:3'],
    sceneStructure: null,
    quickInputs: [
      { name: 'noirScenario', type: 'select', label: 'Noir Scenario', options: ['investigation', 'double cross', 'femme fatale', 'detective mystery'] },
      { name: 'mood', type: 'select', label: 'Mood', options: ['suspenseful', 'dangerous', 'mysterious', 'romantic tension'] }
    ],
    advancedInputs: [
      { name: 'shadowPlay', type: 'checkbox', label: 'Heavy Shadow Use' },
      { name: 'visualStyle', type: 'select', label: 'Visual Style', options: ['low_key_dark', 'film_noir'] }
    ],
    sceneBuilder: false,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: false,
    includeBrandContext: false
  },

  // ==================== SCENE CONSTRUCTION TEMPLATES ====================
  {
    id: 'single_scene_generator',
    name: 'Single Scene Generator',
    description: 'Create a single powerful scene',
    category: CINEMATIC_CATEGORIES.SCENE_CONSTRUCTION,
    icon: '🎬',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.CINEMATIC_COMMERCIAL,
    duration: { min: 30, max: 120, default: 60 },
    aspectRatios: ['16:9', '9:16'],
    sceneStructure: null,
    quickInputs: [
      { name: 'sceneType', type: 'select', label: 'Scene Type', options: ['action', 'dialogue', 'emotional', 'transition', 'establishing'] },
      { name: 'sceneDescription', type: 'textarea', label: 'Scene Description', required: true }
    ],
    advancedInputs: [
      { name: 'shotList', type: 'custom', label: 'Shot List' },
      { name: 'visualStyle', type: 'select', label: 'Visual Style', options: Object.values(VISUAL_STYLES).map(s => s.id) },
      { name: 'cameraMovements', type: 'multi-select', label: 'Camera Movements', options: Object.values(CAMERA_MOVEMENTS).map(c => c.id) }
    ],
    sceneBuilder: false,
    shotBuilder: true,
    storyboardBuilder: true,
    includeCTA: false,
    includeBrandContext: false
  },
  {
    id: 'multi_scene_story_generator',
    name: 'Multi-Scene Story Generator',
    description: 'Create a story with multiple connected scenes',
    category: CINEMATIC_CATEGORIES.SCENE_CONSTRUCTION,
    icon: '🎥',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.CINEMATIC_COMMERCIAL,
    duration: { min: 90, max: 300, default: 180 },
    aspectRatios: ['16:9', '9:16'],
    sceneStructure: SCENE_STRUCTURES.THREE_ACT,
    quickInputs: [
      { name: 'storyPremise', type: 'textarea', label: 'Story Premise', required: true },
      { name: 'sceneCount', type: 'select', label: 'Number of Scenes', options: ['3', '4', '5', '6', '8'] }
    ],
    advancedInputs: [
      { name: 'sceneBreakdown', type: 'custom', label: 'Scene Breakdown' },
      { name: 'visualStyle', type: 'select', label: 'Visual Style', options: Object.values(VISUAL_STYLES).map(s => s.id) },
      { name: 'pacing', type: 'select', label: 'Pacing', options: Object.values(PACING_OPTIONS).map(p => p.id) }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: true,
    includeCTA: false,
    includeBrandContext: false
  },
  {
    id: 'shot_sequence_builder',
    name: 'Shot Sequence Builder',
    description: 'Design a specific sequence of shots',
    category: CINEMATIC_CATEGORIES.SCENE_CONSTRUCTION,
    icon: '🎞️',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.CINEMATIC_COMMERCIAL,
    duration: { min: 30, max: 120, default: 60 },
    aspectRatios: ['16:9'],
    sceneStructure: null,
    quickInputs: [
      { name: 'sequenceGoal', type: 'text', label: 'Sequence Goal', placeholder: 'What should this sequence accomplish?', required: true },
      { name: 'shotCount', type: 'number', label: 'Number of Shots', min: 3, max: 20 }
    ],
    advancedInputs: [
      { name: 'shotList', type: 'custom', label: 'Detailed Shot List', required: true },
      { name: 'transitions', type: 'custom', label: 'Transitions Between Shots' },
      { name: 'musicSync', type: 'checkbox', label: 'Sync to Music' }
    ],
    sceneBuilder: false,
    shotBuilder: true,
    storyboardBuilder: true,
    includeCTA: false,
    includeBrandContext: false
  },

  // ==================== MOVIE POSTER & PROMO TEMPLATES ====================
  {
    id: 'movie_poster',
    name: 'Movie Poster',
    description: 'Create a stunning movie poster',
    category: CINEMATIC_CATEGORIES.MOVIE_POSTER,
    icon: '🖼️',
    outputType: 'image',
    outputStyle: OUTPUT_STYLES.LUXURY_BRAND_PROMO,
    duration: { min: 1, max: 1, default: 1 },
    aspectRatios: ['2:3', '1:1'],
    sceneStructure: null,
    quickInputs: [
      { name: 'movieTitle', type: 'text', label: 'Movie Title', required: true },
      { name: 'genre', type: 'select', label: 'Genre', options: ['action', 'drama', 'comedy', 'horror', 'sci-fi', 'romance', 'thriller'] }
    ],
    advancedInputs: [
      { name: 'tagline', type: 'text', label: 'Tagline' },
      { name: 'visualStyle', type: 'select', label: 'Poster Style', options: ['dramatic_cinematic', 'luxury_elegant', 'bold_color_grade'] }
    ],
    sceneBuilder: false,
    shotBuilder: false,
    storyboardBuilder: false,
    includeCTA: false,
    includeBrandContext: false
  },
  {
    id: 'coming_soon_trailer',
    name: 'Coming Soon Trailer',
    description: 'Tease an upcoming release',
    category: CINEMATIC_CATEGORIES.MOVIE_POSTER,
    icon: '📢',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.DRAMATIC_TRAILER,
    duration: { min: 15, max: 60, default: 30 },
    aspectRatios: ['16:9', '21:9', '9:16'],
    sceneStructure: null,
    quickInputs: [
      { name: 'title', type: 'text', label: 'Title', required: true },
      { name: 'releaseTease', type: 'text', label: 'Release Date/Hint', placeholder: 'Coming soon, Summer 2025, etc.' }
    ],
    advancedInputs: [
      { name: 'teaserText', type: 'textarea', label: 'Teaser Text' },
      { name: 'visualStyle', type: 'select', label: 'Visual Style', options: Object.values(VISUAL_STYLES).map(s => s.id) },
      { name: 'musicMood', type: 'text', label: 'Music Mood' }
    ],
    sceneBuilder: false,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: false,
    includeBrandContext: false
  },
  {
    id: 'film_intro_sequence',
    name: 'Film Intro Sequence',
    description: 'Elegant opening title sequence',
    category: CINEMATIC_CATEGORIES.MOVIE_POSTER,
    icon: '🎬',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.LUXURY_BRAND_PROMO,
    duration: { min: 10, max: 30, default: 15 },
    aspectRatios: ['16:9', '21:9'],
    sceneStructure: null,
    quickInputs: [
      { name: 'titleText', type: 'text', label: 'Title Text', required: true },
      { name: 'introStyle', type: 'select', label: 'Style', options: ['elegant', 'dramatic', 'minimal', ' kinetic'] }
    ],
    advancedInputs: [
      { name: 'fontStyle', type: 'text', label: 'Font/Typography Style' },
      { name: 'visualStyle', type: 'select', label: 'Background Style', options: Object.values(VISUAL_STYLES).map(s => s.id) },
      { name: 'musicMood', type: 'text', label: 'Music Mood' }
    ],
    sceneBuilder: false,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: false,
    includeBrandContext: false
  }
];

// ============================================
// TEMPLATE REGISTRY
// ============================================

export class CinematicTemplateRegistry {
  constructor() {
    this.templates = new Map();
    this.customTemplates = this.loadCustomTemplates();
    this.initializeTemplates();
  }

  initializeTemplates() {
    CINEMATIC_TEMPLATES.forEach(template => {
      this.register(template);
    });
  }

  register(template) {
    this.templates.set(template.id, {
      ...template,
      createdAt: template.createdAt || new Date().toISOString(),
      usageCount: 0,
      isCustom: false
    });
  }

  registerCustom(template) {
    const customTemplate = {
      ...template,
      id: `custom_${Date.now()}`,
      createdAt: new Date().toISOString(),
      usageCount: 0,
      isCustom: true
    };
    this.templates.set(customTemplate.id, customTemplate);
    this.saveCustomTemplates();
    return customTemplate;
  }

  get(id) {
    const template = this.templates.get(id);
    if (template) {
      template.usageCount++;
    }
    return template;
  }

  getAll() {
    return Array.from(this.templates.values());
  }

  getByCategory(category) {
    return this.getAll().filter(t => t.category === category);
  }

  getByTag(tag) {
    return this.getAll().filter(t => 
      t.tags?.includes(tag) || 
      t.quickInputs?.some(i => i.name.toLowerCase().includes(tag.toLowerCase()))
    );
  }

  search(query) {
    const lowerQuery = query.toLowerCase();
    return this.getAll().filter(t => 
      t.name.toLowerCase().includes(lowerQuery) ||
      t.description.toLowerCase().includes(lowerQuery) ||
      t.category.toLowerCase().includes(lowerQuery)
    );
  }

  loadCustomTemplates() {
    try {
      const stored = localStorage.getItem('cinematic_custom_templates');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  saveCustomTemplates() {
    const customTemplates = this.getAll()
      .filter(t => t.isCustom)
      .map(t => ({
        ...t,
        usageCount: undefined,
        isCustom: undefined
      }));
    localStorage.setItem('cinematic_custom_templates', JSON.stringify(customTemplates));
  }

  deleteCustom(id) {
    const template = this.templates.get(id);
    if (template?.isCustom) {
      this.templates.delete(id);
      this.saveCustomTemplates();
      return true;
    }
    return false;
  }

  duplicate(id, newName) {
    const original = this.get(id);
    if (original) {
      return this.registerCustom({
        ...original,
        name: newName,
        id: undefined
      });
    }
    return null;
  }
}

// ============================================
// PROMPT ASSEMBLY ENGINE
// ============================================

export class PromptAssemblyEngine {
  constructor(template, inputs, brandContext = {}, options = {}) {
    this.template = template;
    this.inputs = inputs;
    this.brandContext = brandContext;
    this.options = options;
    this.mode = options.mode || 'quick'; // 'quick' or 'advanced'
  }

  assemble() {
    const parts = [];

    // 1. Scene/Story foundation
    parts.push(this.getScenePrompt());

    // 2. Visual style
    parts.push(this.getVisualStylePrompt());

    // 3. Camera & shot specifications
    if (this.mode === 'advanced') {
      parts.push(this.getCameraPrompt());
      parts.push(this.getShotPrompt());
    }

    // 4. Pacing & editing
    parts.push(this.getPacingPrompt());

    // 5. Brand context injection
    if (this.template.includeBrandContext) {
      parts.push(this.getBrandPrompt());
    }

    // 6. Output style modifiers
    parts.push(this.getOutputStylePrompt());

    // 7. CTA (if applicable)
    if (this.template.includeCTA && this.options.includeCTA !== false) {
      parts.push(this.getCTAPrompt());
    }

    // 8. Technical specs
    parts.push(this.getTechnicalSpecs());

    return parts.filter(p => p).join(', ');
  }

  getScenePrompt() {
    const { genre, premise, story, subject, hook, content } = this.inputs;
    
    const sceneElements = [];
    
    if (genre) sceneElements.push(`${genre} genre`);
    if (premise) sceneElements.push(premise);
    if (story) sceneElements.push(story);
    if (subject) sceneElements.push(subject);
    if (hook) sceneElements.push(`opening hook: ${hook}`);
    if (content) sceneElements.push(content);
    
    return sceneElements.join(', ');
  }

  getVisualStylePrompt() {
    const visualStyle = this.inputs.visualStyle || this.options.visualStyle;
    if (visualStyle && VISUAL_STYLES[visualStyle.toUpperCase().replace(/ /g, '_')]) {
      const style = VISUAL_STYLES[visualStyle.toUpperCase().replace(/ /g, '_')];
      return style.modifiers.join(', ');
    }
    
    // Default cinematic modifiers
    return 'cinematic color grading, professional cinematography, moody atmospheric lighting, high production value';
  }

  getCameraPrompt() {
    const { camera, lens, focal, aperture } = this.inputs;
    const parts = [];

    if (camera) parts.push(`camera: ${camera}`);
    if (lens) parts.push(`lens: ${lens}`);
    if (focal) parts.push(`focal length: ${focal}mm`);
    if (aperture) parts.push(`aperture: ${aperture}`);

    return parts.join(', ');
  }

  getShotPrompt() {
    const { shotType, cameraMovement } = this.inputs;
    const parts = [];

    if (shotType && SHOT_TYPES[shotType.toUpperCase().replace(/ /g, '_')]) {
      const shot = SHOT_TYPES[shotType.toUpperCase().replace(/ /g, '_')];
      parts.push(shot.description);
    }

    if (cameraMovement && CAMERA_MOVEMENTS[cameraMovement.toUpperCase().replace(/ /g, '_')]) {
      const movement = CAMERA_MOVEMENTS[cameraMovement.toUpperCase().replace(/ /g, '_')];
      parts.push(`camera movement: ${movement.description}`);
    }

    return parts.join(', ');
  }

  getPacingPrompt() {
    const { pacing } = this.inputs;
    
    if (pacing && PACING_OPTIONS[pacing.toUpperCase()]) {
      const pace = PACING_OPTIONS[pacing.toUpperCase()];
      return `${pace.name} editing, ${pace.description}`;
    }
    
    return 'moderate cinematic pacing, deliberate shot composition';
  }

  getBrandPrompt() {
    const { brandName, brandVoice, targetAudience } = { ...this.brandContext, ...this.inputs };
    const parts = [];

    if (brandName) parts.push(`brand: ${brandName}`);
    if (brandVoice && BRAND_VOICES[brandVoice.toUpperCase()]) {
      const voice = BRAND_VOICES[brandVoice.toUpperCase()];
      parts.push(`brand voice: ${voice.adjectives.join(', ')}`);
    }
    if (targetAudience && TARGET_AUDIENCES[targetAudience.toUpperCase()]) {
      const audience = TARGET_AUDIENCES[targetAudience.toUpperCase()];
      parts.push(`target audience: ${audience.name}`);
    }

    return parts.join(', ');
  }

  getOutputStylePrompt() {
    if (this.template.outputStyle) {
      const style = this.template.outputStyle;
      return style.characteristics.join(', ');
    }
    return 'cinematic commercial quality';
  }

  getCTAPrompt() {
    const { ctaType } = this.inputs;
    let ctaText = 'call to action';

    if (ctaType && CTA_TYPES[ctaType.toUpperCase().replace(/ /g, '_')]) {
      const cta = CTA_TYPES[ctaType.toUpperCase().replace(/ /g, '_')];
      ctaText = `CTA: ${cta.name}`;
    }

    const ending = this.inputs.endingType || 'fade_to_black';
    if (ending && ENDING_TYPES[ending.toUpperCase().replace(/ /g, '_')]) {
      const endType = ENDING_TYPES[ending.toUpperCase().replace(/ /g, '_')];
      return `${ctaText}, ending: ${endType.description}`;
    }

    return ctaText;
  }

  getTechnicalSpecs() {
    const { aspectRatio, duration } = this.inputs;
    const parts = [];

    if (aspectRatio) parts.push(`aspect ratio: ${aspectRatio}`);
    if (duration) parts.push(`duration: ${duration} seconds`);
    
    parts.push('4K resolution, professional color grading, high dynamic range');

    return parts.join(', ');
  }

  // Generate multiple prompts for scene-based templates
  assembleScenePrompts() {
    if (!this.template.sceneBuilder || !this.template.sceneStructure) {
      return [this.assemble()];
    }

    const scenes = this.buildScenes();
    return scenes.map(scene => {
      const sceneInputs = { ...this.inputs, ...scene };
      const sceneEngine = new PromptAssemblyEngine(
        this.template,
        sceneInputs,
        this.brandContext,
        { ...this.options, singleScene: true }
      );
      return {
        sceneNumber: scene.sceneNumber,
        prompt: sceneEngine.assemble(),
        duration: scene.duration,
        shots: scene.shots
      };
    });
  }

  buildScenes() {
    const structure = this.template.sceneStructure;
    if (!structure) return [];

    const scenes = [];
    const totalDuration = this.inputs.duration || this.template.duration?.default || 60;

    structure.acts.forEach((act, actIndex) => {
      const actDuration = (parseInt(act.duration) / 100) * totalDuration;
      
      act.beats.forEach((beat, beatIndex) => {
        scenes.push({
          sceneNumber: scenes.length + 1,
          act: act.act,
          actName: act.name,
          beat: beat,
          duration: actDuration / act.beats.length,
          shots: this.buildShotsForScene(beat)
        });
      });
    });

    return scenes;
  }

  buildShotsForScene(beat) {
    // Generate 2-4 shots per scene beat
    const shotCount = Math.floor(Math.random() * 3) + 2;
    const shots = [];
    const shotTypes = Object.values(SHOT_TYPES);
    const movements = Object.values(CAMERA_MOVEMENTS);

    for (let i = 0; i < shotCount; i++) {
      const shotType = shotTypes[Math.floor(Math.random() * shotTypes.length)];
      const movement = movements[Math.floor(Math.random() * movements.length)];
      
      shots.push({
        shotNumber: i + 1,
        type: shotType.id,
        movement: movement.id,
        description: `${shotType.name} with ${movement.name.toLowerCase()} - ${beat}`
      });
    }

    return shots;
  }
}

// ============================================
// SCENE BUILDER
// ============================================

export class SceneBuilder {
  constructor(template) {
    this.template = template;
    this.scenes = [];
  }

  addScene(sceneData) {
    const scene = {
      id: `scene_${Date.now()}`,
      order: this.scenes.length + 1,
      ...sceneData
    };
    this.scenes.push(scene);
    return scene;
  }

  removeScene(sceneId) {
    this.scenes = this.scenes.filter(s => s.id !== sceneId);
    this.reorderScenes();
  }

  reorderScenes() {
    this.scenes.forEach((scene, index) => {
      scene.order = index + 1;
    });
  }

  updateScene(sceneId, updates) {
    const scene = this.scenes.find(s => s.id === sceneId);
    if (scene) {
      Object.assign(scene, updates);
    }
  }

  moveScene(sceneId, newOrder) {
    const currentIndex = this.scenes.findIndex(s => s.id === sceneId);
    if (currentIndex !== -1 && newOrder >= 0 && newOrder < this.scenes.length) {
      const [scene] = this.scenes.splice(currentIndex, 1);
      this.scenes.splice(newOrder, 0, scene);
      this.reorderScenes();
    }
  }

  getScenes() {
    return [...this.scenes];
  }

  clear() {
    this.scenes = [];
  }

  toJSON() {
    return {
      template: this.template.id,
      scenes: this.scenes,
      totalDuration: this.scenes.reduce((sum, s) => sum + (s.duration || 0), 0)
    };
  }
}

// ============================================
// SHOT BUILDER
// ============================================

export class ShotBuilder {
  constructor(sceneId) {
    this.sceneId = sceneId;
    this.shots = [];
  }

  addShot(shotData) {
    const shot = {
      id: `shot_${Date.now()}`,
      sceneId: this.sceneId,
      order: this.shots.length + 1,
      ...shotData
    };
    this.shots.push(shot);
    return shot;
  }

  removeShot(shotId) {
    this.shots = this.shots.filter(s => s.id !== shotId);
    this.reorderShots();
  }

  reorderShots() {
    this.shots.forEach((shot, index) => {
      shot.order = index + 1;
    });
  }

  updateShot(shotId, updates) {
    const shot = this.shots.find(s => s.id === shotId);
    if (shot) {
      Object.assign(shot, updates);
    }
  }

  getShots() {
    return [...this.shots];
  }

  toPromptFragment() {
    return this.shots.map(shot => {
      const shotType = SHOT_TYPES[shot.type?.toUpperCase().replace(/ /g, '_')] || SHOT_TYPES.MEDIUM;
      const movement = CAMERA_MOVEMENTS[shot.movement?.toUpperCase().replace(/ /g, '_')] || CAMERA_MOVEMENTS.STATIC;
      return `${shotType.description} (${movement.description})`;
    }).join(', ');
  }
}

// ============================================
// STORYBOARD BUILDER
// ============================================

export class StoryboardBuilder {
  constructor(template) {
    this.template = template;
    this.boards = [];
  }

  addBoard(boardData) {
    const board = {
      id: `board_${Date.now()}`,
      order: this.boards.length + 1,
      ...boardData
    };
    this.boards.push(board);
    return board;
  }

  removeBoard(boardId) {
    this.boards = this.boards.filter(b => b.id !== boardId);
    this.reorderBoards();
  }

  reorderBoards() {
    this.boards.forEach((board, index) => {
      board.order = index + 1;
    });
  }

  updateBoard(boardId, updates) {
    const board = this.boards.find(b => b.id === boardId);
    if (board) {
      Object.assign(board, updates);
    }
  }

  getBoards() {
    return [...this.boards];
  }

  generateFromScenes(scenes) {
    this.boards = [];
    scenes.forEach(scene => {
      if (scene.shots) {
        scene.shots.forEach(shot => {
          this.addBoard({
            sceneNumber: scene.sceneNumber,
            sceneName: scene.beat || `Scene ${scene.sceneNumber}`,
            shotNumber: shot.shotNumber,
            shotType: shot.type,
            cameraMovement: shot.movement,
            description: shot.description,
            visualNotes: '',
            audioNotes: ''
          });
        });
      }
    });
  }

  toJSON() {
    return {
      template: this.template.id,
      boards: this.boards
    };
  }

  exportAsText() {
    return this.boards.map(board => {
      const shotType = SHOT_TYPES[board.shotType?.toUpperCase().replace(/ /g, '_')];
      const movement = CAMERA_MOVEMENTS[board.cameraMovement?.toUpperCase().replace(/ /g, '_')];
      
      return [
        `BOARD ${board.order}: ${board.sceneName}`,
        `Shot ${board.shotNumber}: ${shotType?.name || 'Medium'} - ${movement?.name || 'Static'}`,
        `Visual: ${board.description}`,
        board.visualNotes ? `Visual Notes: ${board.visualNotes}` : '',
        board.audioNotes ? `Audio: ${board.audioNotes}` : '',
        '---'
      ].filter(Boolean).join('\n');
    }).join('\n');
  }
}

// ============================================
// TEMPLATE INPUT FORM BUILDER
// ============================================

export class TemplateInputBuilder {
  constructor(template, mode = 'quick') {
    this.template = template;
    this.mode = mode;
    this.inputs = mode === 'quick' ? template.quickInputs : [...template.quickInputs, ...template.advancedInputs];
  }

  buildFormSchema() {
    return this.inputs.map(input => ({
      name: input.name,
      type: input.type,
      label: input.label,
      placeholder: input.placeholder,
      required: input.required || false,
      options: input.options || [],
      min: input.min,
      max: input.max,
      visible: true,
      section: this.getSection(input)
    }));
  }

  getSection(input) {
    const quickSections = ['basic', 'content'];
    const advancedSections = ['camera', 'shots', 'style', 'brand', 'cta'];
    
    // Categorize inputs into sections
    if (['genre', 'tone', 'subject', 'premise', 'story', 'product'].includes(input.name)) {
      return 'content';
    }
    if (['camera', 'lens', 'focal', 'aperture', 'shotType', 'cameraMovement'].includes(input.name)) {
      return 'camera';
    }
    if (['visualStyle', 'pacing', 'musicMood', 'endingType'].includes(input.name)) {
      return 'style';
    }
    if (['brandName', 'brandVoice', 'targetAudience'].includes(input.name)) {
      return 'brand';
    }
    if (['ctaType', 'includeCTA'].includes(input.name)) {
      return 'cta';
    }
    
    return 'basic';
  }

  validateInputs(values) {
    const errors = [];
    
    this.inputs.forEach(input => {
      if (input.required && !values[input.name]) {
        errors.push({
          field: input.name,
          message: `${input.label} is required`
        });
      }
      
      if (input.type === 'number' && values[input.name]) {
        const num = parseInt(values[input.name]);
        if (input.min && num < input.min) {
          errors.push({
            field: input.name,
            message: `${input.label} must be at least ${input.min}`
          });
        }
        if (input.max && num > input.max) {
          errors.push({
            field: input.name,
            message: `${input.label} must be no more than ${input.max}`
          });
        }
      }
    });
    
    return errors;
  }

  getDefaults() {
    const defaults = {};
    this.inputs.forEach(input => {
      if (input.type === 'select' && input.options?.length > 0) {
        defaults[input.name] = input.options[0];
      } else if (input.type === 'number' && input.min) {
        defaults[input.name] = input.min;
      } else {
        defaults[input.name] = '';
      }
    });
    return defaults;
  }
}

// ============================================
// TEMPLATE STORAGE & PERSISTENCE
// ============================================

export class TemplateStorage {
  static SAVED_TEMPLATES_KEY = 'cinematic_saved_templates';
  static RECENT_TEMPLATES_KEY = 'cinematic_recent_templates';
  static FAVORITES_KEY = 'cinematic_favorites';

  static saveProject(projectData) {
    const projects = this.getProjects();
    const project = {
      ...projectData,
      id: projectData.id || `project_${Date.now()}`,
      savedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const existingIndex = projects.findIndex(p => p.id === project.id);
    if (existingIndex !== -1) {
      projects[existingIndex] = project;
    } else {
      projects.unshift(project);
    }
    
    // Keep only last 50 projects
    localStorage.setItem(this.SAVED_TEMPLATES_KEY, JSON.stringify(projects.slice(0, 50)));
    return project;
  }

  static getProjects() {
    try {
      const stored = localStorage.getItem(this.SAVED_TEMPLATES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  static getProject(id) {
    return this.getProjects().find(p => p.id === id);
  }

  static deleteProject(id) {
    const projects = this.getProjects().filter(p => p.id !== id);
    localStorage.setItem(this.SAVED_TEMPLATES_KEY, JSON.stringify(projects));
  }

  static addToRecent(templateId, inputs = {}) {
    const recent = this.getRecent();
    const entry = {
      templateId,
      inputs,
      usedAt: new Date().toISOString()
    };
    
    // Remove duplicates and add to front
    const filtered = recent.filter(r => r.templateId !== templateId);
    filtered.unshift(entry);
    
    localStorage.setItem(this.RECENT_TEMPLATES_KEY, JSON.stringify(filtered.slice(0, 20)));
  }

  static getRecent() {
    try {
      const stored = localStorage.getItem(this.RECENT_TEMPLATES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  static addFavorite(templateId) {
    const favorites = this.getFavorites();
    if (!favorites.includes(templateId)) {
      favorites.push(templateId);
      localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(favorites));
    }
  }

  static removeFavorite(templateId) {
    const favorites = this.getFavorites().filter(id => id !== templateId);
    localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(favorites));
  }

  static getFavorites() {
    try {
      const stored = localStorage.getItem(this.FAVORITES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  static isFavorite(templateId) {
    return this.getFavorites().includes(templateId);
  }

  static exportTemplate(templateId) {
    const registry = new CinematicTemplateRegistry();
    const template = registry.get(templateId);
    if (template) {
      const exportData = {
        template: { ...template },
        exportedAt: new Date().toISOString(),
        version: '1.0'
      };
      delete exportData.template.usageCount;
      return JSON.stringify(exportData, null, 2);
    }
    return null;
  }

  static importTemplate(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      const registry = new CinematicTemplateRegistry();
      const imported = registry.registerCustom(data.template);
      return imported;
    } catch (error) {
      console.error('Failed to import template:', error);
      return null;
    }
  }
}

// ============================================
// RENDER HANDOFF STRUCTURE
// ============================================

export class RenderHandoff {
  constructor(template, inputs, scenes = [], options = {}) {
    this.template = template;
    this.inputs = inputs;
    this.scenes = scenes;
    this.options = options;
    this.generatedAt = new Date().toISOString();
  }

  generate() {
    return {
      metadata: this.getMetadata(),
      template: this.getTemplateInfo(),
      inputs: this.inputs,
      brandContext: this.getBrandContext(),
      scenes: this.getSceneData(),
      shots: this.getShotData(),
      technicalSpecs: this.getTechnicalSpecs(),
      output: this.getOutputConfig(),
      prompts: this.generatePrompts(),
      renderInstructions: this.getRenderInstructions()
    };
  }

  getMetadata() {
    return {
      generatedAt: this.generatedAt,
      version: '1.0',
      templateId: this.template.id,
      templateName: this.template.name,
      mode: this.options.mode || 'quick',
      generator: 'CinematicTemplateSystem'
    };
  }

  getTemplateInfo() {
    return {
      id: this.template.id,
      name: this.template.name,
      category: this.template.category,
      outputType: this.template.outputType,
      outputStyle: this.template.outputStyle?.id,
      duration: {
        target: this.inputs.duration || this.template.duration?.default,
        min: this.template.duration?.min,
        max: this.template.duration?.max
      },
      aspectRatio: this.inputs.aspectRatio || '16:9'
    };
  }

  getBrandContext() {
    if (!this.template.includeBrandContext) return null;
    
    return {
      brandName: this.inputs.brandName,
      brandVoice: this.inputs.brandVoice,
      targetAudience: this.inputs.targetAudience,
      visualStyle: this.inputs.visualStyle
    };
  }

  getSceneData() {
    if (!this.scenes.length) return null;
    
    return this.scenes.map(scene => ({
      number: scene.sceneNumber,
      name: scene.beat || `Scene ${scene.sceneNumber}`,
      duration: scene.duration,
      shots: scene.shots?.map(shot => ({
        number: shot.shotNumber,
        type: shot.type,
        movement: shot.movement,
        description: shot.description
      })) || []
    }));
  }

  getShotData() {
    const shots = [];
    this.scenes.forEach(scene => {
      if (scene.shots) {
        scene.shots.forEach(shot => {
          shots.push({
            sceneNumber: scene.sceneNumber,
            shotNumber: shot.shotNumber,
            type: shot.type,
            movement: shot.movement,
            prompt: this.buildShotPrompt(shot)
          });
        });
      }
    });
    return shots;
  }

  buildShotPrompt(shot) {
    const shotType = SHOT_TYPES[shot.type?.toUpperCase().replace(/ /g, '_')];
    const movement = CAMERA_MOVEMENTS[shot.movement?.toUpperCase().replace(/ /g, '_')];
    const visualStyle = VISUAL_STYLES[this.inputs.visualStyle?.toUpperCase().replace(/ /g, '_')];
    
    const parts = [
      shotType?.description || 'medium shot',
      movement?.description || 'static camera',
      visualStyle?.modifiers?.join(', ') || 'cinematic lighting',
      this.inputs.musicMood ? `music mood: ${this.inputs.musicMood}` : ''
    ];
    
    return parts.filter(Boolean).join(', ');
  }

  getTechnicalSpecs() {
    return {
      resolution: this.inputs.resolution || '4K',
      aspectRatio: this.inputs.aspectRatio || '16:9',
      frameRate: this.inputs.frameRate || 24,
      colorSpace: this.inputs.colorSpace || 'Rec. 709',
      audioFormat: this.inputs.audioFormat || 'AAC'
    };
  }

  getOutputConfig() {
    const config = {
      format: this.inputs.format || 'mp4',
      codec: this.inputs.codec || 'h264',
      quality: this.inputs.quality || 'high'
    };

    if (this.template.includeCTA) {
      config.ending = {
        type: this.inputs.endingType || 'fade_to_black',
        cta: this.inputs.ctaType,
        endCardDuration: 5
      };
    }

    return config;
  }

  generatePrompts() {
    const engine = new PromptAssemblyEngine(
      this.template,
      this.inputs,
      {},
      { mode: this.options.mode }
    );

    if (this.scenes.length > 0) {
      return engine.assembleScenePrompts();
    }

    return [{ prompt: engine.assemble(), duration: this.inputs.duration }];
  }

  getRenderInstructions() {
    const instructions = [];

    // Pre-render
    instructions.push('1. PREPARE ASSETS: Gather all reference images, footage, and audio files');
    
    // Scene setup
    if (this.scenes.length > 0) {
      instructions.push(`2. SETUP SCENES: ${this.scenes.length} scenes to render in sequence`);
    }
    
    // Style application
    instructions.push(`3. APPLY STYLE: ${this.inputs.visualStyle || 'cinematic'} visual treatment`);
    
    // Camera/Shot settings
    if (this.options.mode === 'advanced') {
      instructions.push('4. CAMERA SETTINGS: Use specified camera movements and shot types');
    }
    
    // Audio
    if (this.inputs.musicMood) {
      instructions.push(`5. AUDIO: ${this.inputs.musicMood} background music`);
    }
    
    // Post-processing
    instructions.push('6. POST-PROCESS: Apply color grading and finishing');
    
    // Export
    instructions.push(`7. EXPORT: ${this.inputs.format || 'mp4'} at ${this.inputs.quality || 'high'} quality`);

    return instructions;
  }

  toJSON() {
    return JSON.stringify(this.generate(), null, 2);
  }
}

// ============================================
// SINGLETON EXPORT
// ============================================

let registryInstance = null;

export function getTemplateRegistry() {
  if (!registryInstance) {
    registryInstance = new CinematicTemplateRegistry();
  }
  return registryInstance;
}

// Export all components for advanced usage
// Note: Individual exports are at the top of the file
// This empty export ensures the module syntax is valid
export {};
