/**
 * NICHE TEMPLATES
 * 120 industry-specific cinematic templates organized by category
 * Templates use varied endings: Film, Trailer, Documentary, Video, Promo, Reel, Story, Showcase, Portrait, Ad, Feature, Short, etc.
 */

import { CINEMATIC_CATEGORIES, OUTPUT_STYLES, VISUAL_STYLES } from './cinematicTemplates.js';

// ============================================
// RESTAURANT / CAFE TEMPLATES (10)
// ============================================

export const RESTAURANT_TEMPLATES = [
  {
    id: 'midnight_table_film',
    name: 'Midnight Table Film',
    description: 'Upscale restaurant evening atmosphere with dramatic lighting',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '🍽️',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.LUXURY_BRAND_PROMO,
    duration: { min: 30, max: 90, default: 60 },
    aspectRatios: ['16:9', '9:16'],
    sceneStructure: ['opening atmosphere', 'location intro', 'signature dish', 'guest experience', 'brand reveal'],
    quickInputs: [
      { name: 'restaurantName', type: 'text', label: 'Restaurant Name', required: true },
      { name: 'cuisine', type: 'text', label: 'Cuisine Type', placeholder: 'e.g. Italian fine dining' }
    ],
    advancedInputs: [
      { name: 'signatureDish', type: 'text', label: 'Signature Dish' },
      { name: 'atmosphere', type: 'select', label: 'Atmosphere', options: ['intimate', 'vibrant', 'elegant', 'cozy'] }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'after_the_pour_documentary',
    name: 'After the Pour Documentary',
    description: 'Documentary-style look at bar program and cocktail crafting',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '🍸',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.DOCUMENTARY,
    duration: { min: 60, max: 180, default: 120 },
    aspectRatios: ['16:9', '21:9'],
    sceneStructure: ['environment establishing', 'bartender introduction', 'craft process', 'human element', 'authentic conclusion'],
    quickInputs: [
      { name: 'barName', type: 'text', label: 'Bar Name', required: true },
      { name: 'specialty', type: 'text', label: 'Specialty', placeholder: 'e.g. craft cocktails' }
    ],
    advancedInputs: [
      { name: 'signatureDrink', type: 'text', label: 'Signature Drink' },
      { name: 'docStyle', type: 'select', label: 'Doc Style', options: ['observational', 'interview-driven', 'hybrid'] }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: false,
    includeBrandContext: true
  },
  {
    id: 'signature_plate_showcase',
    name: 'Signature Plate Showcase',
    description: 'Food-focused product showcase with cinematic plating details',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '🍴',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.CINEMATIC_COMMERCIAL,
    duration: { min: 15, max: 60, default: 30 },
    aspectRatios: ['16:9', '1:1', '9:16'],
    sceneStructure: ['opening tease', 'plate reveal', 'detail shots', 'texture showcase', 'final presentation'],
    quickInputs: [
      { name: 'dishName', type: 'text', label: 'Dish Name', required: true },
      { name: 'restaurant', type: 'text', label: 'Restaurant' }
    ],
    advancedInputs: [
      { name: 'heroIngredient', type: 'text', label: 'Hero Ingredient' },
      { name: 'shotStyle', type: 'select', label: 'Shot Style', options: ['slow motion', 'static', 'dynamic'] }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'flame_and_craft_story',
    name: 'Flame & Craft Story',
    description: 'Behind-the-scenes look at chef at work with open flame cooking',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '🔥',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.DOCUMENTARY,
    duration: { min: 45, max: 120, default: 60 },
    aspectRatios: ['16:9', '21:9'],
    sceneStructure: ['kitchen establishing', 'chef introduction', 'flame technique', 'craft detail', 'final plate'],
    quickInputs: [
      { name: 'chefName', type: 'text', label: 'Chef Name', required: true },
      { name: 'technique', type: 'text', label: 'Cooking Technique', placeholder: 'e.g. wood-fired' }
    ],
    advancedInputs: [
      { name: 'protein', type: 'text', label: 'Protein/Dish' },
      { name: 'fireElement', type: 'checkbox', label: 'Emphasize Fire Element' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: false,
    includeBrandContext: true
  },
  {
    id: 'last_call_promo',
    name: 'Last Call Promo',
    description: 'Urgency-driven promotion for limited-time offer or event',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '⏰',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.BOLD_DIRECT_RESPONSE,
    duration: { min: 15, max: 30, default: 15 },
    aspectRatios: ['9:16', '16:9'],
    sceneStructure: ['tension hook', 'offer reveal', 'value showcase', 'urgency element', 'CTA'],
    quickInputs: [
      { name: 'offer', type: 'text', label: 'Offer', required: true },
      { name: 'deadline', type: 'text', label: 'Deadline', placeholder: 'e.g. This weekend only' }
    ],
    advancedInputs: [
      { name: 'discount', type: 'text', label: 'Discount/Promo Code' },
      { name: 'ctaText', type: 'text', label: 'CTA Button Text' }
    ],
    sceneBuilder: false,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'opening_night_trailer',
    name: 'Opening Night Trailer',
    description: 'Dramatic trailer for restaurant grand opening or special event',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '🎬',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.DRAMATIC_TRAILER,
    duration: { min: 30, max: 60, default: 45 },
    aspectRatios: ['16:9', '21:9'],
    sceneStructure: ['teaser hook', 'sneak peek reveals', 'mystery build', 'dramatic climax', 'opening date reveal'],
    quickInputs: [
      { name: 'eventName', type: 'text', label: 'Event Name', required: true },
      { name: 'date', type: 'text', label: 'Date', placeholder: 'e.g. Coming November 15' }
    ],
    advancedInputs: [
      { name: 'teaserText', type: 'textarea', label: 'Teaser Text' },
      { name: 'musicMood', type: 'select', label: 'Music Mood', options: ['epic', 'mysterious', 'elegant', 'energetic'] }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: true,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'at_your_table_video',
    name: 'At Your Table Video',
    description: 'Intimate dining experience showcase from guest perspective',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '🪑',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.EMOTIONAL_BRAND_STORY,
    duration: { min: 30, max: 90, default: 45 },
    aspectRatios: ['16:9', '9:16'],
    sceneStructure: ['arrival', 'setting the scene', 'first bite', 'experience moments', 'memorable departure'],
    quickInputs: [
      { name: 'restaurantName', type: 'text', label: 'Restaurant Name', required: true },
      { name: 'occasion', type: 'text', label: 'Occasion', placeholder: 'e.g. anniversary dinner' }
    ],
    advancedInputs: [
      { name: 'guestPerspective', type: 'checkbox', label: 'Use Guest POV' },
      { name: 'emotionalHook', type: 'text', label: 'Emotional Hook' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'city_after_dinner_recap',
    name: 'City After Dinner Recap',
    description: 'Evening cityscape paired with dining experience recap',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '🌃',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.CINEMATIC_COMMERCIAL,
    duration: { min: 30, max: 60, default: 45 },
    aspectRatios: ['16:9', '9:16'],
    sceneStructure: ['city establishing', 'restaurant approach', 'dining highlights', 'city night return', 'memorable close'],
    quickInputs: [
      { name: 'cityName', type: 'text', label: 'City Name', required: true },
      { name: 'restaurantName', type: 'text', label: 'Restaurant Name', required: true }
    ],
    advancedInputs: [
      { name: 'highlightMoments', type: 'textarea', label: 'Highlight Moments' },
      { name: 'cityLights', type: 'checkbox', label: 'Include City Lights' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'bite_in_motion_reel',
    name: 'Bite in Motion Reel',
    description: 'Vertical-optimized food motion content for social media',
    category: CINEMATIC_CATEGORIES.SOCIAL,
    icon: '📱',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.CINEMATIC_SOCIAL_SHORT,
    duration: { min: 5, max: 15, default: 10 },
    aspectRatios: ['9:16'],
    sceneStructure: ['hook bite', 'food reveal', 'texture close-up', 'satisfaction moment', 'share trigger'],
    quickInputs: [
      { name: 'dishName', type: 'text', label: 'Dish Name', required: true },
      { name: 'restaurant', type: 'text', label: 'Restaurant/Brand' }
    ],
    advancedInputs: [
      { name: 'slowMotion', type: 'checkbox', label: 'Slow Motion Effect' },
      { name: 'music', type: 'text', label: 'Trending Audio Reference' }
    ],
    sceneBuilder: false,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'house_special_feature',
    name: 'House Special Feature',
    description: 'Premium feature spotlight on house specialty dish or creation',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '⭐',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.LUXURY_BRAND_PROMO,
    duration: { min: 30, max: 90, default: 45 },
    aspectRatios: ['16:9', '1:1'],
    sceneStructure: ['ingredient reveal', 'preparation artistry', 'plating ceremony', 'dish hero shot', 'invitation to taste'],
    quickInputs: [
      { name: 'dishName', type: 'text', label: 'House Special Name', required: true },
      { name: 'restaurant', type: 'text', label: 'Restaurant' }
    ],
    advancedInputs: [
      { name: 'chefName', type: 'text', label: 'Chef' },
      { name: 'ingredients', type: 'textarea', label: 'Key Ingredients' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  }
];

// ============================================
// MED SPA / BEAUTY CLINIC TEMPLATES (10)
// ============================================

export const MED_SPA_TEMPLATES = [
  {
    id: 'velvet_glow_film',
    name: 'Velvet Glow Film',
    description: 'Luxury med spa experience with soft, radiant aesthetics',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '✨',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.LUXURY_BRAND_PROMO,
    duration: { min: 30, max: 90, default: 45 },
    aspectRatios: ['16:9', '9:16'],
    sceneStructure: ['serene entry', 'treatment room reveal', 'process showcase', 'glow transformation', 'confidence close'],
    quickInputs: [
      { name: 'clinicName', type: 'text', label: 'Clinic Name', required: true },
      { name: 'treatment', type: 'text', label: 'Featured Treatment', placeholder: 'e.g. hydrafacial' }
    ],
    advancedInputs: [
      { name: 'skinConcern', type: 'select', label: 'Skin Concern', options: ['hydration', 'anti-aging', 'brightening', 'acne'] },
      { name: 'mood', type: 'select', label: 'Mood', options: ['relaxing', 'clinical', 'spa-like', 'medical'] }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'treatment_room_video',
    name: 'Treatment Room Video',
    description: 'Behind-the-scenes look at treatment room and equipment',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '💆',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.DOCUMENTARY,
    duration: { min: 30, max: 60, default: 45 },
    aspectRatios: ['16:9'],
    sceneStructure: ['room reveal', 'equipment showcase', 'professional preparation', 'treatment moment', 'clinical trust'],
    quickInputs: [
      { name: 'clinicName', type: 'text', label: 'Clinic Name', required: true },
      { name: 'roomFeature', type: 'text', label: 'Room Feature', placeholder: 'e.g. laser suite' }
    ],
    advancedInputs: [
      { name: 'equipment', type: 'textarea', label: 'Key Equipment' },
      { name: 'sterility', type: 'checkbox', label: 'Emphasize Cleanliness' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: false,
    includeBrandContext: true
  },
  {
    id: 'becoming_radiant_story',
    name: 'Becoming Radiant Story',
    description: 'Transformation journey story for beauty treatment results',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '🌟',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.EMOTIONAL_BRAND_STORY,
    duration: { min: 60, max: 120, default: 90 },
    aspectRatios: ['16:9', '9:16'],
    sceneStructure: ['before state', 'decision moment', 'treatment process', 'progressive results', 'radiant reveal'],
    quickInputs: [
      { name: 'clientName', type: 'text', label: 'Client/Model Name', placeholder: 'Or keep anonymous' },
      { name: 'treatment', type: 'text', label: 'Treatment Type', required: true }
    ],
    advancedInputs: [
      { name: 'timeline', type: 'text', label: 'Treatment Timeline' },
      { name: 'testimonial', type: 'textarea', label: 'Client Testimonial' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'after_light_reveal',
    name: 'After Light Reveal',
    description: 'Before-and-after style reveal with dramatic lighting transition',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '💡',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.CINEMATIC_COMMERCIAL,
    duration: { min: 15, max: 30, default: 20 },
    aspectRatios: ['16:9', '1:1'],
    sceneStructure: ['before mood', 'transition moment', 'after reveal', 'detail showcase', 'brand close'],
    quickInputs: [
      { name: 'treatment', type: 'text', label: 'Treatment', required: true },
      { name: 'result', type: 'text', label: 'Key Result', placeholder: 'e.g. clearer skin' }
    ],
    advancedInputs: [
      { name: 'lightingStyle', type: 'select', label: 'Transition Style', options: ['dramatic', 'smooth', 'flash'] },
      { name: 'closeups', type: 'checkbox', label: 'Include Close-ups' }
    ],
    sceneBuilder: false,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'beauty_edit_promo',
    name: 'Beauty Edit Promo',
    description: 'Dynamic promotional edit showcasing multiple treatments',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '🎥',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.BOLD_DIRECT_RESPONSE,
    duration: { min: 15, max: 45, default: 30 },
    aspectRatios: ['9:16', '16:9', '1:1'],
    sceneStructure: ['attention hook', 'treatment montage', 'variety showcase', 'transformation moments', 'book now CTA'],
    quickInputs: [
      { name: 'clinicName', type: 'text', label: 'Clinic Name', required: true },
      { name: 'treatments', type: 'textarea', label: 'Treatments to Feature', placeholder: 'List treatments' }
    ],
    advancedInputs: [
      { name: 'musicStyle', type: 'select', label: 'Music Energy', options: ['upbeat', 'chill', 'cinematic'] },
      { name: 'pace', type: 'select', label: 'Edit Pace', options: ['fast', 'medium', 'slow'] }
    ],
    sceneBuilder: false,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'face_of_authority_documentary',
    name: 'Face of Authority Documentary',
    description: 'Provider or doctor profile documentary with expertise showcase',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '👩‍⚕️',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.DOCUMENTARY,
    duration: { min: 60, max: 180, default: 120 },
    aspectRatios: ['16:9'],
    sceneStructure: ['provider introduction', 'background story', 'expertise moments', 'patient interaction', 'philosophy close'],
    quickInputs: [
      { name: 'providerName', type: 'text', label: 'Provider Name', required: true },
      { name: 'specialty', type: 'text', label: 'Specialty', required: true }
    ],
    advancedInputs: [
      { name: 'credentials', type: 'textarea', label: 'Credentials' },
      { name: 'philosophy', type: 'textarea', label: 'Treatment Philosophy' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'client_glow_testimonial',
    name: 'Client Glow Testimonial',
    description: 'Authentic client testimonial with visible glow results',
    category: CINEMATIC_CATEGORIES.PERSONAL,
    icon: '💬',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.DOCUMENTARY,
    duration: { min: 30, max: 90, default: 60 },
    aspectRatios: ['16:9', '9:16'],
    sceneStructure: ['client introduction', 'before struggle', 'treatment journey', 'results reveal', 'recommendation close'],
    quickInputs: [
      { name: 'clientName', type: 'text', label: 'Client Name', placeholder: 'Or use first name only' },
      { name: 'treatment', type: 'text', label: 'Treatment Received', required: true }
    ],
    advancedInputs: [
      { name: 'concern', type: 'textarea', label: 'Original Concern' },
      { name: 'results', type: 'textarea', label: 'Results Achieved' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'soft_focus_reel',
    name: 'Soft Focus Reel',
    description: 'Vertical social content with soft, dreamy beauty aesthetic',
    category: CINEMATIC_CATEGORIES.SOCIAL,
    icon: '📱',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.CINEMATIC_SOCIAL_SHORT,
    duration: { min: 5, max: 15, default: 10 },
    aspectRatios: ['9:16'],
    sceneStructure: ['dreamy hook', 'beauty moment', 'soft reveal', 'glow highlight', 'share aesthetic'],
    quickInputs: [
      { name: 'treatment', type: 'text', label: 'Treatment/Product', required: true },
      { name: 'brand', type: 'text', label: 'Brand/Clinic' }
    ],
    advancedInputs: [
      { name: 'filter', type: 'select', label: 'Aesthetic', options: ['warm', 'cool', 'neutral', 'editorial'] },
      { name: 'music', type: 'text', label: 'Audio Reference' }
    ],
    sceneBuilder: false,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'within_the_walls_cinema_piece',
    name: 'Within the Walls Cinema Piece',
    description: 'Cinematic exploration of the clinic space and atmosphere',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '🏥',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.CINEMATIC_COMMERCIAL,
    duration: { min: 45, max: 120, default: 60 },
    aspectRatios: ['16:9', '21:9'],
    sceneStructure: ['exterior establishing', 'entry moment', 'space journey', 'detail wander', 'atmosphere summary'],
    quickInputs: [
      { name: 'clinicName', type: 'text', label: 'Clinic Name', required: true },
      { name: 'vibe', type: 'text', label: 'Atmosphere', placeholder: 'e.g. serene, modern, luxury' }
    ],
    advancedInputs: [
      { name: 'keyRooms', type: 'textarea', label: 'Rooms to Feature' },
      { name: 'cinematicStyle', type: 'select', label: 'Style', options: ['mystery', 'reveal', 'wandering'] }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'luxe_offer_video',
    name: 'Luxe Offer Video',
    description: 'Premium service package promotion with elegant presentation',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '🎁',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.LUXURY_BRAND_PROMO,
    duration: { min: 30, max: 60, default: 45 },
    aspectRatios: ['16:9', '9:16'],
    sceneStructure: ['premium hook', 'package reveal', 'value breakdown', 'inclusion showcase', 'exclusive CTA'],
    quickInputs: [
      { name: 'packageName', type: 'text', label: 'Package Name', required: true },
      { name: 'price', type: 'text', label: 'Price/Value', placeholder: 'e.g. $499 Value' }
    ],
    advancedInputs: [
      { name: 'inclusions', type: 'textarea', label: 'Package Inclusions' },
      { name: 'urgency', type: 'text', label: 'Availability Note' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  }
];

// ============================================
// SALON / BARBERSHOP TEMPLATES (10)
// ============================================

export const SALON_TEMPLATES = [
  {
    id: 'final_cut_film',
    name: 'Final Cut Film',
    description: 'Dramatic reveal of haircut transformation with cinematic polish',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '✂️',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.CINEMATIC_COMMERCIAL,
    duration: { min: 30, max: 60, default: 45 },
    aspectRatios: ['16:9', '9:16'],
    sceneStructure: ['before reveal', 'transformation process', 'detail work', 'big reveal', 'confidence moment'],
    quickInputs: [
      { name: 'clientName', type: 'text', label: 'Client Name', placeholder: 'Or keep anonymous' },
      { name: 'service', type: 'text', label: 'Service', required: true }
    ],
    advancedInputs: [
      { name: 'style', type: 'text', label: 'New Style' },
      { name: 'technique', type: 'text', label: 'Key Technique' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'the_chair_documentary',
    name: 'The Chair Documentary',
    description: 'Barbershop documentary capturing the chair experience',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '🪑',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.DOCUMENTARY,
    duration: { min: 60, max: 180, default: 90 },
    aspectRatios: ['16:9'],
    sceneStructure: ['shop establishing', 'chair introduction', 'client in chair', 'craft at work', 'shop community'],
    quickInputs: [
      { name: 'shopName', type: 'text', label: 'Shop Name', required: true },
      { name: 'location', type: 'text', label: 'Location/Vibe' }
    ],
    advancedInputs: [
      { name: 'specialty', type: 'text', label: 'Shop Specialty' },
      { name: 'community', type: 'checkbox', label: 'Emphasize Community' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: false,
    includeBrandContext: true
  },
  {
    id: 'mirror_change_reveal',
    name: 'Mirror Change Reveal',
    description: 'Classic mirror reveal moment with transformation impact',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '🪞',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.EMOTIONAL_BRAND_STORY,
    duration: { min: 20, max: 45, default: 30 },
    aspectRatios: ['16:9', '9:16'],
    sceneStructure: ['pre-mirror anticipation', 'mirror approach', 'first look', 'reaction capture', 'confidence close'],
    quickInputs: [
      { name: 'clientName', type: 'text', label: 'Client Name', placeholder: 'Or keep anonymous' },
      { name: 'service', type: 'text', label: 'Service', required: true }
    ],
    advancedInputs: [
      { name: 'emotion', type: 'select', label: 'Target Emotion', options: ['joy', 'confidence', 'relief', 'excitement'] },
      { name: 'music', type: 'text', label: 'Emotional Music' }
    ],
    sceneBuilder: false,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'hands_of_style_portrait',
    name: 'Hands of Style Portrait',
    description: 'Stylist hands at work portrait series with craft focus',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '🙌',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.DOCUMENTARY,
    duration: { min: 15, max: 30, default: 20 },
    aspectRatios: ['16:9', '1:1'],
    sceneStructure: ['hands intro', 'tool selection', 'technique moments', 'detail precision', 'final touch'],
    quickInputs: [
      { name: 'stylistName', type: 'text', label: 'Stylist Name', required: true },
      { name: 'service', type: 'text', label: 'Service' }
    ],
    advancedInputs: [
      { name: 'tools', type: 'textarea', label: 'Key Tools' },
      { name: 'focus', type: 'select', label: 'Focus', options: ['technical', 'artistic', 'both'] }
    ],
    sceneBuilder: false,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: false,
    includeBrandContext: true
  },
  {
    id: 'barber_code_promo',
    name: 'Barber Code Promo',
    description: 'Bold promotional content for barbershop services',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '💈',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.BOLD_DIRECT_RESPONSE,
    duration: { min: 15, max: 30, default: 20 },
    aspectRatios: ['9:16', '16:9'],
    sceneStructure: ['attention hook', 'service showcase', 'style variety', 'environment vibe', 'book now CTA'],
    quickInputs: [
      { name: 'shopName', type: 'text', label: 'Shop Name', required: true },
      { name: 'services', type: 'textarea', label: 'Services', placeholder: 'e.g. cuts, shaves, fades' }
    ],
    advancedInputs: [
      { name: 'promo', type: 'text', label: 'Special Offer' },
      { name: 'ctaText', type: 'text', label: 'CTA' }
    ],
    sceneBuilder: false,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'fresh_look_story',
    name: 'Fresh Look Story',
    description: 'Narrative journey from walk-in to walk-out with fresh look',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '🌟',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.EMOTIONAL_BRAND_STORY,
    duration: { min: 45, max: 90, default: 60 },
    aspectRatios: ['16:9', '9:16'],
    sceneStructure: ['arrival', 'consultation', 'transformation', 'reveal', 'departure confidence'],
    quickInputs: [
      { name: 'clientName', type: 'text', label: 'Client Name', placeholder: 'Or keep anonymous' },
      { name: 'service', type: 'text', label: 'Service', required: true }
    ],
    advancedInputs: [
      { name: 'consultationFocus', type: 'text', label: 'Style Goal' },
      { name: 'journey', type: 'checkbox', label: 'Full Journey' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'booked_by_friday_video',
    name: 'Booked by Friday Video',
    description: 'Urgency-driven promotion targeting weekend appointments',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '📅',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.BOLD_DIRECT_RESPONSE,
    duration: { min: 15, max: 30, default: 20 },
    aspectRatios: ['9:16', '16:9'],
    sceneStructure: ['weekend hook', 'availability tease', 'service highlights', 'urgency element', 'book CTA'],
    quickInputs: [
      { name: 'shopName', type: 'text', label: 'Shop Name', required: true },
      { name: 'offer', type: 'text', label: 'Friday Offer', placeholder: 'e.g. 20% off' }
    ],
    advancedInputs: [
      { name: 'slots', type: 'text', label: 'Available Slots' },
      { name: 'expires', type: 'text', label: 'Offer Expires' }
    ],
    sceneBuilder: false,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'shop_lights_reel',
    name: 'Shop Lights Reel',
    description: 'Vertical social content showcasing shop atmosphere',
    category: CINEMATIC_CATEGORIES.SOCIAL,
    icon: '💡',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.CINEMATIC_SOCIAL_SHORT,
    duration: { min: 5, max: 15, default: 10 },
    aspectRatios: ['9:16'],
    sceneStructure: ['lights intro', 'vibe capture', 'chair moment', 'tool glimpse', 'follow CTA'],
    quickInputs: [
      { name: 'shopName', type: 'text', label: 'Shop Name', required: true },
      { name: 'vibe', type: 'text', label: 'Vibe', placeholder: 'e.g. classic, modern, vintage' }
    ],
    advancedInputs: [
      { name: 'highlight', type: 'text', label: 'Feature Moment' },
      { name: 'music', type: 'text', label: 'Audio' }
    ],
    sceneBuilder: false,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'before_the_mirror_showcase',
    name: 'Before the Mirror Showcase',
    description: 'Pre-service styling moments at the mirror station',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '👀',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.CINEMATIC_COMMERCIAL,
    duration: { min: 20, max: 45, default: 30 },
    aspectRatios: ['16:9', '1:1'],
    sceneStructure: ['station setup', 'pre-service moments', 'styling process', 'mirror check', 'final preparation'],
    quickInputs: [
      { name: 'stylistName', type: 'text', label: 'Stylist Name', required: true },
      { name: 'service', type: 'text', label: 'Service' }
    ],
    advancedInputs: [
      { name: 'products', type: 'textarea', label: 'Products Used' },
      { name: 'technique', type: 'text', label: 'Key Technique' }
    ],
    sceneBuilder: false,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: false,
    includeBrandContext: true
  },
  {
    id: 'style_motion_short',
    name: 'Style Motion Short',
    description: 'Dynamic motion-focused content showcasing styling movement',
    category: CINEMATIC_CATEGORIES.SOCIAL,
    icon: '🎬',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.CINEMATIC_SOCIAL_SHORT,
    duration: { min: 5, max: 15, default: 10 },
    aspectRatios: ['9:16', '1:1'],
    sceneStructure: ['motion hook', 'movement showcase', 'style in action', 'dynamic close', 'save/trend trigger'],
    quickInputs: [
      { name: 'service', type: 'text', label: 'Service/Feature', required: true },
      { name: 'brand', type: 'text', label: 'Brand/Shop' }
    ],
    advancedInputs: [
      { name: 'slowMotion', type: 'checkbox', label: 'Slow Motion' },
      { name: 'transition', type: 'select', label: 'Transition', options: ['cut', 'morph', 'dissolve'] }
    ],
    sceneBuilder: false,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  }
];

// ============================================
// GYM / FITNESS STUDIO TEMPLATES (10)
// ============================================

export const FITNESS_TEMPLATES = [
  {
    id: 'iron_frame_film',
    name: 'Iron Frame Film',
    description: 'Powerful strength training documentary with dramatic visuals',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '🏋️',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.DRAMATIC_TRAILER,
    duration: { min: 30, max: 90, default: 45 },
    aspectRatios: ['16:9', '9:16'],
    sceneStructure: ['gym entrance', 'weight setup', 'intense lift', 'effort detail', 'strength reveal'],
    quickInputs: [
      { name: 'gymName', type: 'text', label: 'Gym Name', required: true },
      { name: 'athlete', type: 'text', label: 'Athlete/Feature', placeholder: 'Or keep generic' }
    ],
    advancedInputs: [
      { name: 'lift', type: 'text', label: 'Featured Lift' },
      { name: 'intensity', type: 'select', label: 'Intensity', options: ['moderate', 'high', 'max effort'] }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'built_in_motion_promo',
    name: 'Built in Motion Promo',
    description: 'High-energy promotional content showcasing fitness transformation',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '💪',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.BOLD_DIRECT_RESPONSE,
    duration: { min: 15, max: 45, default: 30 },
    aspectRatios: ['9:16', '16:9'],
    sceneStructure: ['transformation hook', 'workout montage', 'results showcase', 'community vibe', 'join CTA'],
    quickInputs: [
      { name: 'gymName', type: 'text', label: 'Gym Name', required: true },
      { name: 'offer', type: 'text', label: 'Membership Offer', placeholder: 'e.g. $1 first month' }
    ],
    advancedInputs: [
      { name: 'freeTrial', type: 'text', label: 'Free Trial Link' },
      { name: 'tagline', type: 'text', label: 'Tagline' }
    ],
    sceneBuilder: false,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'coach_cut_portrait',
    name: 'Coach Cut Portrait',
    description: 'Trainer/coach profile with expertise and authority showcase',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '👨‍🏫',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.DOCUMENTARY,
    duration: { min: 45, max: 120, default: 60 },
    aspectRatios: ['16:9'],
    sceneStructure: ['coach introduction', 'expertise moment', 'training style', 'client success', 'philosophy close'],
    quickInputs: [
      { name: 'coachName', type: 'text', label: 'Coach Name', required: true },
      { name: 'specialty', type: 'text', label: 'Specialty', required: true }
    ],
    advancedInputs: [
      { name: 'certifications', type: 'textarea', label: 'Certifications' },
      { name: 'approach', type: 'textarea', label: 'Training Approach' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'becoming_strong_story',
    name: 'Becoming Strong Story',
    description: 'Transformation narrative from beginner to strong',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '🔥',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.EMOTIONAL_BRAND_STORY,
    duration: { min: 60, max: 180, default: 90 },
    aspectRatios: ['16:9', '9:16'],
    sceneStructure: ['starting point', 'decision moment', 'grind montage', 'breakthrough', 'strong close'],
    quickInputs: [
      { name: 'memberName', type: 'text', label: 'Member Name', placeholder: 'Or keep anonymous' },
      { name: 'goal', type: 'text', label: 'Fitness Goal', required: true }
    ],
    advancedInputs: [
      { name: 'timeline', type: 'text', label: 'Transformation Period' },
      { name: 'testimonial', type: 'textarea', label: 'Quote' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'challenge_campaign_trailer',
    name: 'Challenge Campaign Trailer',
    description: 'Dramatic trailer for fitness challenge or program launch',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '🏆',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.DRAMATIC_TRAILER,
    duration: { min: 30, max: 60, default: 45 },
    aspectRatios: ['16:9', '9:16'],
    sceneStructure: ['challenge hook', 'intensity preview', 'community shots', 'results tease', 'join reveal'],
    quickInputs: [
      { name: 'challengeName', type: 'text', label: 'Challenge Name', required: true },
      { name: 'duration', type: 'text', label: 'Duration', placeholder: 'e.g. 30 days' }
    ],
    advancedInputs: [
      { name: 'prizes', type: 'textarea', label: 'Prizes/Rewards' },
      { name: 'startDate', type: 'text', label: 'Start Date' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: true,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'after_burn_reel',
    name: 'After Burn Reel',
    description: 'Vertical high-intensity workout content for social media',
    category: CINEMATIC_CATEGORIES.SOCIAL,
    icon: '⚡',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.CINEMATIC_SOCIAL_SHORT,
    duration: { min: 5, max: 15, default: 10 },
    aspectRatios: ['9:16'],
    sceneStructure: ['intensity hook', 'workout moment', 'sweat/details', 'pump reveal', 'tag/trending'],
    quickInputs: [
      { name: 'workout', type: 'text', label: 'Workout/Class', required: true },
      { name: 'gym', type: 'text', label: 'Gym Name' }
    ],
    advancedInputs: [
      { name: 'music', type: 'text', label: 'Trending Audio' },
      { name: 'energy', type: 'select', label: 'Energy Level', options: ['high', 'very high', 'maximum'] }
    ],
    sceneBuilder: false,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'proof_in_progress_documentary',
    name: 'Proof in Progress Documentary',
    description: 'In-progress workout documentary with raw training footage',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '📊',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.DOCUMENTARY,
    duration: { min: 60, max: 180, default: 90 },
    aspectRatios: ['16:9'],
    sceneStructure: ['training setup', 'warm-up intensity', 'main lifts', 'struggle moments', 'persistence close'],
    quickInputs: [
      { name: 'athleteName', type: 'text', label: 'Athlete Name', placeholder: 'Or keep anonymous' },
      { name: 'focus', type: 'text', label: 'Training Focus', required: true }
    ],
    advancedInputs: [
      { name: 'music', type: 'text', label: 'Underlying Music' },
      { name: 'rawFootage', type: 'checkbox', label: 'Emphasize Authenticity' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: false,
    includeBrandContext: true
  },
  {
    id: 'inside_the_grind_video',
    name: 'Inside the Grind Video',
    description: 'Day-in-the-life fitness content with gritty training aesthetic',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '⏰',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.DOCUMENTARY,
    duration: { min: 45, max: 120, default: 60 },
    aspectRatios: ['16:9', '9:16'],
    sceneStructure: ['early morning', 'gym arrival', 'training blocks', 'nutrition moment', 'rest/recovery'],
    quickInputs: [
      { name: 'athleteName', type: 'text', label: 'Athlete Name', required: true },
      { name: 'goal', type: 'text', label: 'Current Goal' }
    ],
    advancedInputs: [
      { name: 'trainingBlock', type: 'text', label: 'Training Phase' },
      { name: 'aesthetic', type: 'select', label: 'Aesthetic', options: ['gritty', 'clean', 'cinematic'] }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: false,
    includeBrandContext: true
  },
  {
    id: 'transformation_shot_reveal',
    name: 'Transformation Shot Reveal',
    description: 'Before/after visual sequence with dramatic reveal',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '📸',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.CINEMATIC_COMMERCIAL,
    duration: { min: 15, max: 30, default: 20 },
    aspectRatios: ['16:9', '1:1'],
    sceneStructure: ['before state', 'journey montage', 'transition moment', 'after reveal', 'achievement close'],
    quickInputs: [
      { name: 'memberName', type: 'text', label: 'Member Name', placeholder: 'Or keep anonymous' },
      { name: 'result', type: 'text', label: 'Transformation Result', required: true }
    ],
    advancedInputs: [
      { name: 'timeline', type: 'text', label: 'Time Period' },
      { name: 'stats', type: 'textarea', label: 'Key Stats Change' }
    ],
    sceneBuilder: false,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'pulse_motion_short',
    name: 'Pulse Motion Short',
    description: 'Beat-synced fitness content with rhythmic workout visuals',
    category: CINEMATIC_CATEGORIES.SOCIAL,
    icon: '🎵',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.CINEMATIC_SOCIAL_SHORT,
    duration: { min: 5, max: 15, default: 10 },
    aspectRatios: ['9:16'],
    sceneStructure: ['beat intro', 'rhythmic workout', 'beat drop moment', 'sweat details', 'end on beat'],
    quickInputs: [
      { name: 'className', type: 'text', label: 'Class/Workout', required: true },
      { name: 'gym', type: 'text', label: 'Gym' }
    ],
    advancedInputs: [
      { name: 'song', type: 'text', label: 'Song/Beat' },
      { name: 'syncStyle', type: 'select', label: 'Sync Style', options: ['precise', 'flow', 'intense'] }
    ],
    sceneBuilder: false,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  }
];

// ============================================
// REAL ESTATE / REALTOR TEMPLATES (10)
// ============================================

export const REAL_ESTATE_TEMPLATES = [
  {
    id: 'open_door_film',
    name: 'Open Door Film',
    description: 'Luxury property reveal with dramatic door-open moment',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '🚪',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.LUXURY_BRAND_PROMO,
    duration: { min: 60, max: 180, default: 90 },
    aspectRatios: ['16:9', '21:9'],
    sceneStructure: ['exterior approach', 'door moment', 'entry reveal', 'home journey', 'lifestyle close'],
    quickInputs: [
      { name: 'propertyAddress', type: 'text', label: 'Property Address', required: true },
      { name: 'price', type: 'text', label: 'Price', placeholder: 'e.g. $2.5M' }
    ],
    advancedInputs: [
      { name: 'highlights', type: 'textarea', label: 'Key Features' },
      { name: 'neighborhood', type: 'text', label: 'Neighborhood' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: true,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'luxury_address_showcase',
    name: 'Luxury Address Showcase',
    description: 'Premium property showcase with elegant presentation',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '🏰',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.LUXURY_BRAND_PROMO,
    duration: { min: 60, max: 180, default: 90 },
    aspectRatios: ['16:9', '21:9', '9:16'],
    sceneStructure: ['establishing shot', 'architectural detail', 'interior flow', 'outdoor living', 'address reveal'],
    quickInputs: [
      { name: 'propertyType', type: 'text', label: 'Property Type', placeholder: 'e.g. Estate, Penthouse' },
      { name: 'location', type: 'text', label: 'Location', required: true }
    ],
    advancedInputs: [
      { name: 'beds', type: 'number', label: 'Bedrooms' },
      { name: 'baths', type: 'number', label: 'Bathrooms' },
      { name: 'sqft', type: 'text', label: 'Square Feet' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'realtor_story_film',
    name: 'Realtor Story Film',
    description: 'Agent profile film with personal brand and expertise',
    category: CINEMATIC_CATEGORIES.PERSONAL,
    icon: '👔',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.INSPIRATIONAL_FOUNDER,
    duration: { min: 60, max: 180, default: 90 },
    aspectRatios: ['16:9'],
    sceneStructure: ['origin story', 'expertise area', 'client success', 'local knowledge', 'personal close'],
    quickInputs: [
      { name: 'agentName', type: 'text', label: 'Agent Name', required: true },
      { name: 'market', type: 'text', label: 'Market Area', required: true }
    ],
    advancedInputs: [
      { name: 'yearsExp', type: 'text', label: 'Years Experience' },
      { name: 'specialty', type: 'text', label: 'Specialty' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'living_here_video',
    name: 'Living Here Video',
    description: 'Lifestyle-focused content showing what it is like to live in the area',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '🏡',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.EMOTIONAL_BRAND_STORY,
    duration: { min: 45, max: 120, default: 60 },
    aspectRatios: ['16:9', '9:16'],
    sceneStructure: ['morning in neighborhood', 'local spots', 'community moments', 'evening atmosphere', 'home feeling'],
    quickInputs: [
      { name: 'neighborhood', type: 'text', label: 'Neighborhood', required: true },
      { name: 'location', type: 'text', label: 'City/Area' }
    ],
    advancedInputs: [
      { name: 'highlights', type: 'textarea', label: 'Local Highlights' },
      { name: 'vibe', type: 'select', label: 'Vibe', options: ['family', 'young professional', 'retirement', 'trendy'] }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'open_house_promo',
    name: 'Open House Promo',
    description: 'Event-driven promotion for upcoming open house',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '🏠',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.BOLD_DIRECT_RESPONSE,
    duration: { min: 15, max: 30, default: 20 },
    aspectRatios: ['9:16', '16:9'],
    sceneStructure: ['property tease', 'date/time reveal', 'feature highlights', 'urgency element', 'RSVP CTA'],
    quickInputs: [
      { name: 'propertyAddress', type: 'text', label: 'Property Address', required: true },
      { name: 'eventDate', type: 'text', label: 'Open House Date', required: true }
    ],
    advancedInputs: [
      { name: 'time', type: 'text', label: 'Time' },
      { name: 'agentName', type: 'text', label: 'Agent Name' }
    ],
    sceneBuilder: false,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'sold_story_feature',
    name: 'Sold Story Feature',
    description: 'Success story of property sold with client testimonial',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '📝',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.CUSTOMER_TRANSFORMATION,
    duration: { min: 45, max: 90, default: 60 },
    aspectRatios: ['16:9'],
    sceneStructure: ['client situation', 'property search', 'agent collaboration', 'winning moment', 'testimonial close'],
    quickInputs: [
      { name: 'clientName', type: 'text', label: 'Client Name', placeholder: 'Or keep anonymous' },
      { name: 'propertyType', type: 'text', label: 'Property Type', required: true }
    ],
    advancedInputs: [
      { name: 'timeline', type: 'text', label: 'Timeline' },
      { name: 'testimonial', type: 'textarea', label: 'Client Quote' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'keys_in_hand_film',
    name: 'Keys in Hand Film',
    description: 'Emotional closing day moment with keys handover',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '🔑',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.EMOTIONAL_BRAND_STORY,
    duration: { min: 30, max: 60, default: 45 },
    aspectRatios: ['16:9', '9:16'],
    sceneStructure: ['arrival moment', 'emotional anticipation', 'key handover', 'new home entry', 'dream fulfilled close'],
    quickInputs: [
      { name: 'clientName', type: 'text', label: 'Client Name', placeholder: 'Or keep anonymous' },
      { name: 'property', type: 'text', label: 'Property', required: true }
    ],
    advancedInputs: [
      { name: 'reaction', type: 'text', label: 'Emotional Hook' },
      { name: 'agentName', type: 'text', label: 'Agent Name' }
    ],
    sceneBuilder: false,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'agent_frame_portrait',
    name: 'Agent Frame Portrait',
    description: 'Professional agent portrait with authority and trust focus',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '📸',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.DOCUMENTARY,
    duration: { min: 30, max: 60, default: 45 },
    aspectRatios: ['16:9', '1:1'],
    sceneStructure: ['professional entrance', 'market expertise', 'personal brand', 'trust elements', 'contact close'],
    quickInputs: [
      { name: 'agentName', type: 'text', label: 'Agent Name', required: true },
      { name: 'title', type: 'text', label: 'Title', placeholder: 'e.g. Top Producer' }
    ],
    advancedInputs: [
      { name: 'market', type: 'text', label: 'Market Area' },
      { name: 'specialty', type: 'text', label: 'Specialty' }
    ],
    sceneBuilder: false,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'vertical_estate_reel',
    name: 'Vertical Estate Reel',
    description: 'Vertical-optimized property content for social media',
    category: CINEMATIC_CATEGORIES.SOCIAL,
    icon: '📱',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.CINEMATIC_SOCIAL_SHORT,
    duration: { min: 5, max: 15, default: 10 },
    aspectRatios: ['9:16'],
    sceneStructure: ['hook view', 'room flow', 'detail close-up', 'lifestyle moment', 'link in bio'],
    quickInputs: [
      { name: 'property', type: 'text', label: 'Property', required: true },
      { name: 'price', type: 'text', label: 'Price' }
    ],
    advancedInputs: [
      { name: 'feature', type: 'text', label: 'Hero Feature' },
      { name: 'music', type: 'text', label: 'Audio' }
    ],
    sceneBuilder: false,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'listing_call_ad',
    name: 'Listing Call Ad',
    description: 'Direct response ad targeting potential sellers',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '📞',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.BOLD_DIRECT_RESPONSE,
    duration: { min: 15, max: 30, default: 20 },
    aspectRatios: ['9:16', '16:9'],
    sceneStructure: ['property value hook', 'market info', 'agent credibility', 'free evaluation offer', 'call CTA'],
    quickInputs: [
      { name: 'agentName', type: 'text', label: 'Agent Name', required: true },
      { name: 'offer', type: 'text', label: 'Offer', placeholder: 'e.g. Free market analysis' }
    ],
    advancedInputs: [
      { name: 'phone', type: 'text', label: 'Phone Number' },
      { name: 'tagline', type: 'text', label: 'Tagline' }
    ],
    sceneBuilder: false,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  }
];

export default {
  RESTAURANT_TEMPLATES,
  MED_SPA_TEMPLATES,
  SALON_TEMPLATES,
  FITNESS_TEMPLATES,
  REAL_ESTATE_TEMPLATES
};
