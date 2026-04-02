/**
 * NICHE TEMPLATES PART 3
 * Final batch: Automotive, Fashion, Event, Luxury Brand templates
 */

import { CINEMATIC_CATEGORIES, OUTPUT_STYLES } from './cinematicTemplates.js';

// ============================================
// AUTOMOTIVE TEMPLATES (10)
// ============================================

export const AUTOMOTIVE_TEMPLATES = [
  {
    id: 'chrome_story_film',
    name: 'Chrome Story Film',
    description: 'Premium automotive showcase with dramatic chrome reflections',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '🚗',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.LUXURY_BRAND_PROMO,
    duration: { min: 45, max: 90, default: 60 },
    aspectRatios: ['16:9', '21:9'],
    sceneStructure: ['exterior reveal', 'chrome detail', 'interior luxury', 'design philosophy', 'driving tease'],
    quickInputs: [
      { name: 'vehicleName', type: 'text', label: 'Vehicle/Model', required: true },
      { name: 'dealer', type: 'text', label: 'Dealer/Brand' }
    ],
    advancedInputs: [
      { name: 'features', type: 'textarea', label: 'Key Features' },
      { name: 'mood', type: 'select', label: 'Mood', options: ['luxury', 'power', 'sleek', 'adventure'] }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'drive_sequence_showcase',
    name: 'Drive Sequence Showcase',
    description: 'Cinematic driving footage with vehicle in motion',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '🏎️',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.CINEMATIC_COMMERCIAL,
    duration: { min: 30, max: 60, default: 45 },
    aspectRatios: ['16:9', '21:9'],
    sceneStructure: ['vehicle approach', 'engine start', 'road journey', 'handling shots', 'destination'],
    quickInputs: [
      { name: 'vehicleName', type: 'text', label: 'Vehicle', required: true },
      { name: 'route', type: 'text', label: 'Setting', placeholder: 'e.g. coastal highway' }
    ],
    advancedInputs: [
      { name: 'drivingStyle', type: 'select', label: 'Style', options: ['relaxed', 'spirited', 'dynamic'] },
      { name: 'weather', type: 'text', label: 'Weather/Mood' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'showroom_lights_promo',
    name: 'Showroom Lights Promo',
    description: 'Dealer promotion with vehicle showcase under dramatic lighting',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '💡',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.CINEMATIC_COMMERCIAL,
    duration: { min: 30, max: 60, default: 45 },
    aspectRatios: ['16:9', '9:16'],
    sceneStructure: ['showroom reveal', 'vehicle spotlight', 'feature close-ups', 'deal highlight', 'visit CTA'],
    quickInputs: [
      { name: 'dealerName', type: 'text', label: 'Dealer Name', required: true },
      { name: 'vehicle', type: 'text', label: 'Featured Vehicle' }
    ],
    advancedInputs: [
      { name: 'deal', type: 'text', label: 'Special Deal' },
      { name: 'offer', type: 'text', label: 'Limited Time Offer' }
    ],
    sceneBuilder: false,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'under_the_hood_video',
    name: 'Under the Hood Video',
    description: 'Technical showcase of engine and performance features',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '🔧',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.DOCUMENTARY,
    duration: { min: 45, max: 90, default: 60 },
    aspectRatios: ['16:9'],
    sceneStructure: ['engine reveal', 'technical detail', 'performance specs', 'engineering moment', 'power close'],
    quickInputs: [
      { name: 'vehicle', type: 'text', label: 'Vehicle', required: true },
      { name: 'engine', type: 'text', label: 'Engine Type', placeholder: 'e.g. V8 Twin Turbo' }
    ],
    advancedInputs: [
      { name: 'horsepower', type: 'text', label: 'Horsepower' },
      { name: 'features', type: 'textarea', label: 'Tech Features' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: false,
    includeBrandContext: true
  },
  {
    id: 'driven_by_trust_testimonial',
    name: 'Driven by Trust Testimonial',
    description: 'Customer testimonial about vehicle purchase experience',
    category: CINEMATIC_CATEGORIES.PERSONAL,
    icon: '💬',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.DOCUMENTARY,
    duration: { min: 45, max: 90, default: 60 },
    aspectRatios: ['16:9', '9:16'],
    sceneStructure: ['buyer introduction', 'search journey', 'dealership experience', 'driving away happy', 'recommendation close'],
    quickInputs: [
      { name: 'customerName', type: 'text', label: 'Customer Name', placeholder: 'Or keep anonymous' },
      { name: 'vehicle', type: 'text', label: 'Vehicle Purchased', required: true }
    ],
    advancedInputs: [
      { name: 'dealership', type: 'text', label: 'Dealership Experience' },
      { name: 'testimonial', type: 'textarea', label: 'Quote' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'midnight_machine_reel',
    name: 'Midnight Machine Reel',
    description: 'Dramatic night-time vehicle content with moody aesthetics',
    category: CINEMATIC_CATEGORIES.SOCIAL,
    icon: '🌙',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.CINEMATIC_SOCIAL_SHORT,
    duration: { min: 5, max: 15, default: 10 },
    aspectRatios: ['9:16', '1:1'],
    sceneStructure: ['night hook', 'headlights on', 'detail in dark', 'engine growl', 'follow for more'],
    quickInputs: [
      { name: 'vehicle', type: 'text', label: 'Vehicle', required: true },
      { name: 'dealer', type: 'text', label: 'Dealer/Brand' }
    ],
    advancedInputs: [
      { name: 'music', type: 'text', label: 'Night Drive Audio' },
      { name: 'mood', type: 'select', label: 'Aesthetic', options: ['mysterious', 'powerful', 'sleek'] }
    ],
    sceneBuilder: false,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'fresh_arrival_spotlight',
    name: 'Fresh Arrival Spotlight',
    description: 'New inventory highlight with arrival announcement',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '🆕',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.BOLD_DIRECT_RESPONSE,
    duration: { min: 15, max: 30, default: 20 },
    aspectRatios: ['9:16', '16:9'],
    sceneStructure: ['arrival hook', 'vehicle reveal', 'key features', 'availability note', 'inquire CTA'],
    quickInputs: [
      { name: 'vehicle', type: 'text', label: 'New Vehicle', required: true },
      { name: 'dealer', type: 'text', label: 'Dealer' }
    ],
    advancedInputs: [
      { name: 'year', type: 'text', label: 'Year' },
      { name: 'availability', type: 'text', label: 'Availability' }
    ],
    sceneBuilder: false,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'launch_lane_trailer',
    name: 'Launch Lane Trailer',
    description: 'Vehicle launch trailer with hype and anticipation',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '🚀',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.DRAMATIC_TRAILER,
    duration: { min: 30, max: 60, default: 45 },
    aspectRatios: ['16:9', '21:9'],
    sceneStructure: ['teaser glimpses', 'spec reveals', 'design details', 'performance tease', 'launch date'],
    quickInputs: [
      { name: 'vehicle', type: 'text', label: 'New Vehicle', required: true },
      { name: 'launchDate', type: 'text', label: 'Launch Date', placeholder: 'e.g. Coming Spring 2025' }
    ],
    advancedInputs: [
      { name: 'teaser', type: 'textarea', label: 'Teaser Text' },
      { name: 'specs', type: 'textarea', label: 'Key Specs' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: true,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'fast_cut_ad',
    name: 'Fast Cut Ad',
    description: 'High-energy edited ad with quick vehicle cuts',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '⚡',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.BOLD_DIRECT_RESPONSE,
    duration: { min: 15, max: 30, default: 20 },
    aspectRatios: ['9:16', '16:9'],
    sceneStructure: ['fast hook', 'quick cuts montage', 'multiple angles', 'deal flash', 'act now CTA'],
    quickInputs: [
      { name: 'dealerName', type: 'text', label: 'Dealer Name', required: true },
      { name: 'offer', type: 'text', label: 'Deal', placeholder: 'e.g. 0% APR for 60 months' }
    ],
    advancedInputs: [
      { name: 'inventory', type: 'text', label: 'Inventory Highlight' },
      { name: 'expires', type: 'text', label: 'Offer Expires' }
    ],
    sceneBuilder: false,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'offer_drive_promo',
    name: 'Offer Drive Promo',
    description: 'Direct response promotion for special automotive offer',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '💰',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.BOLD_DIRECT_RESPONSE,
    duration: { min: 15, max: 30, default: 20 },
    aspectRatios: ['9:16', '16:9'],
    sceneStructure: ['attention hook', 'offer breakdown', 'vehicle showcase', 'urgency element', 'visit CTA'],
    quickInputs: [
      { name: 'dealerName', type: 'text', label: 'Dealer Name', required: true },
      { name: 'offer', type: 'text', label: 'Special Offer', required: true }
    ],
    advancedInputs: [
      { name: 'vehicle', type: 'text', label: 'Vehicle Featured' },
      { name: 'terms', type: 'text', label: 'Terms' }
    ],
    sceneBuilder: false,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  }
];

// ============================================
// FASHION / LIFESTYLE TEMPLATES (10)
// ============================================

export const FASHION_TEMPLATES = [
  {
    id: 'vogue_motion_film',
    name: 'Vogue Motion Film',
    description: 'High-fashion editorial content with runway-quality aesthetics',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '👗',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.LUXURY_BRAND_PROMO,
    duration: { min: 30, max: 60, default: 45 },
    aspectRatios: ['16:9', '1:1'],
    sceneStructure: ['editorial entrance', 'garment showcase', 'movement study', 'detail close-ups', 'designer credit'],
    quickInputs: [
      { name: 'collection', type: 'text', label: 'Collection/Item', required: true },
      { name: 'brand', type: 'text', label: 'Brand' }
    ],
    advancedInputs: [
      { name: 'designer', type: 'text', label: 'Designer' },
      { name: 'season', type: 'text', label: 'Season', placeholder: 'e.g. Spring 2025' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: false,
    includeBrandContext: true
  },
  {
    id: 'lookbook_showcase',
    name: 'Lookbook Showcase',
    description: 'Product lookbook with styled fashion imagery',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '📸',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.CINEMATIC_COMMERCIAL,
    duration: { min: 30, max: 60, default: 45 },
    aspectRatios: ['16:9', '9:16'],
    sceneStructure: ['opening look', 'multiple outfits', 'style transitions', 'accessory details', 'collection close'],
    quickInputs: [
      { name: 'collection', type: 'text', label: 'Collection/Line', required: true },
      { name: 'brand', type: 'text', label: 'Brand' }
    ],
    advancedInputs: [
      { name: 'pieces', type: 'number', label: 'Number of Looks' },
      { name: 'aesthetic', type: 'select', label: 'Aesthetic', options: ['minimal', 'bold', 'classic', 'edgy'] }
    ],
    sceneBuilder: false,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'collection_premiere_trailer',
    name: 'Collection Premiere Trailer',
    description: 'Dramatic trailer for new fashion collection launch',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '🎬',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.DRAMATIC_TRAILER,
    duration: { min: 30, max: 60, default: 45 },
    aspectRatios: ['16:9', '21:9'],
    sceneStructure: ['teaser glimpses', 'fabric details', 'model moments', 'collection theme', 'launch date'],
    quickInputs: [
      { name: 'collection', type: 'text', label: 'Collection Name', required: true },
      { name: 'launchDate', type: 'text', label: 'Launch Date' }
    ],
    advancedInputs: [
      { name: 'theme', type: 'text', label: 'Collection Theme' },
      { name: 'pieces', type: 'number', label: 'Key Pieces' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: true,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'designer_story_documentary',
    name: 'Designer Story Documentary',
    description: 'Designer profile with creative process and vision',
    category: CINEMATIC_CATEGORIES.PERSONAL,
    icon: '🎨',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.DOCUMENTARY,
    duration: { min: 90, max: 180, default: 120 },
    aspectRatios: ['16:9'],
    sceneStructure: ['designer introduction', 'creative origin', 'process behind collection', 'inspiration sources', 'vision close'],
    quickInputs: [
      { name: 'designerName', type: 'text', label: 'Designer Name', required: true },
      { name: 'brand', type: 'text', label: 'Brand', required: true }
    ],
    advancedInputs: [
      { name: 'background', type: 'textarea', label: 'Background' },
      { name: 'inspiration', type: 'textarea', label: 'Inspiration' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: false,
    includeBrandContext: true
  },
  {
    id: 'worn_with_confidence_testimonial',
    name: 'Worn with Confidence Testimonial',
    description: 'Styling testimonial with fashion-forward customer',
    category: CINEMATIC_CATEGORIES.PERSONAL,
    icon: '💃',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.DOCUMENTARY,
    duration: { min: 30, max: 60, default: 45 },
    aspectRatios: ['16:9', '9:16'],
    sceneStructure: ['customer introduction', 'style journey', 'wearing the piece', 'confidence moment', 'recommendation close'],
    quickInputs: [
      { name: 'customerName', type: 'text', label: 'Customer Name', placeholder: 'Or keep anonymous' },
      { name: 'item', type: 'text', label: 'Styled Item', required: true }
    ],
    advancedInputs: [
      { name: 'occasion', type: 'text', label: 'Occasion Worn' },
      { name: 'review', type: 'textarea', label: 'Style Review' }
    ],
    sceneBuilder: false,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'style_in_motion_reel',
    name: 'Style in Motion Reel',
    description: 'Vertical social content with fashion in movement',
    category: CINEMATIC_CATEGORIES.SOCIAL,
    icon: '📱',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.CINEMATIC_SOCIAL_SHORT,
    duration: { min: 5, max: 15, default: 10 },
    aspectRatios: ['9:16'],
    sceneStructure: ['movement hook', 'garment flow', 'detail in motion', 'spin/turn moment', 'save/share'],
    quickInputs: [
      { name: 'item', type: 'text', label: 'Featured Item', required: true },
      { name: 'brand', type: 'text', label: 'Brand' }
    ],
    advancedInputs: [
      { name: 'slowMotion', type: 'checkbox', label: 'Slow Motion' },
      { name: 'music', type: 'text', label: 'Trending Audio' }
    ],
    sceneBuilder: false,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'detail_shot_ad',
    name: 'Detail Shot Ad',
    description: 'Product-focused ad with fashion detail close-ups',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '🔍',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.BOLD_DIRECT_RESPONSE,
    duration: { min: 15, max: 30, default: 20 },
    aspectRatios: ['9:16', '1:1'],
    sceneStructure: ['detail hook', 'texture close-up', 'craftsmanship moment', 'quality reveal', 'shop CTA'],
    quickInputs: [
      { name: 'item', type: 'text', label: 'Product', required: true },
      { name: 'price', type: 'text', label: 'Price' }
    ],
    advancedInputs: [
      { name: 'material', type: 'text', label: 'Material/Quality' },
      { name: 'shopLink', type: 'text', label: 'Shop Link' }
    ],
    sceneBuilder: false,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'behind_the_label_story',
    name: 'Behind the Label Story',
    description: 'Brand story content with heritage and craftsmanship',
    category: CINEMATIC_CATEGORIES.PERSONAL,
    icon: '🏭',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.DOCUMENTARY,
    duration: { min: 60, max: 120, default: 90 },
    aspectRatios: ['16:9'],
    sceneStructure: ['label reveal', 'brand origin', 'craftsmanship journey', 'quality standards', 'heritage close'],
    quickInputs: [
      { name: 'brandName', type: 'text', label: 'Brand Name', required: true },
      { name: 'heritage', type: 'text', label: 'Heritage', placeholder: 'e.g. Made in Italy since 1950' }
    ],
    advancedInputs: [
      { name: 'process', type: 'textarea', label: 'Production Process' },
      { name: 'values', type: 'textarea', label: 'Brand Values' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'season_in_frame_promo',
    name: 'Season in Frame Promo',
    description: 'Seasonal fashion promotion with timely styling',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '🍂',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.CINEMATIC_COMMERCIAL,
    duration: { min: 20, max: 45, default: 30 },
    aspectRatios: ['9:16', '16:9'],
    sceneStructure: ['season hook', 'seasonal styling', 'key pieces', 'trend callout', 'shop now CTA'],
    quickInputs: [
      { name: 'season', type: 'text', label: 'Season', placeholder: 'e.g. Fall 2025', required: true },
      { name: 'brand', type: 'text', label: 'Brand' }
    ],
    advancedInputs: [
      { name: 'trends', type: 'textarea', label: 'Key Trends' },
      { name: 'collection', type: 'text', label: 'Collection Link' }
    ],
    sceneBuilder: false,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'runway_motion_short',
    name: 'Runway Motion Short',
    description: 'Fashion week or runway show highlight reel',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '👠',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.CINEMATIC_COMMERCIAL,
    duration: { min: 30, max: 90, default: 60 },
    aspectRatios: ['16:9', '9:16'],
    sceneStructure: ['venue establishing', 'opening look', 'key looks montage', 'closing finale', 'designer bow'],
    quickInputs: [
      { name: 'showName', type: 'text', label: 'Show/Event', required: true },
      { name: 'designer', type: 'text', label: 'Designer' }
    ],
    advancedInputs: [
      { name: 'location', type: 'text', label: 'Location' },
      { name: 'season', type: 'text', label: 'Season/Year' }
    ],
    sceneBuilder: false,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: false,
    includeBrandContext: true
  }
];

// ============================================
// EVENT / RECAP TEMPLATES (10)
// ============================================

export const EVENT_TEMPLATES = [
  {
    id: 'highlight_film',
    name: 'Highlight Film',
    description: 'Event highlight reel with key moments montage',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '🎯',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.CINEMATIC_COMMERCIAL,
    duration: { min: 60, max: 180, default: 90 },
    aspectRatios: ['16:9', '9:16'],
    sceneStructure: ['event establishing', 'key moment highlights', 'crowd energy', 'speaker/performance', 'memorable close'],
    quickInputs: [
      { name: 'eventName', type: 'text', label: 'Event Name', required: true },
      { name: 'date', type: 'text', label: 'Event Date' }
    ],
    advancedInputs: [
      { name: 'highlights', type: 'textarea', label: 'Key Moments' },
      { name: 'music', type: 'text', label: 'Highlight Music' }
    ],
    sceneBuilder: false,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: false,
    includeBrandContext: true
  },
  {
    id: 'after_the_applause_recap',
    name: 'After the Applause Recap',
    description: 'Post-event recap with audience reaction and energy',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '👏',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.DOCUMENTARY,
    duration: { min: 45, max: 90, default: 60 },
    aspectRatios: ['16:9'],
    sceneStructure: ['event atmosphere', 'crowd reaction', 'standing ovation moments', 'networking energy', 'until next time close'],
    quickInputs: [
      { name: 'eventName', type: 'text', label: 'Event Name', required: true },
      { name: 'attendees', type: 'text', label: 'Attendance', placeholder: 'e.g. 500 attendees' }
    ],
    advancedInputs: [
      { name: 'highlights', type: 'textarea', label: 'Memorable Moments' },
      { name: 'nextEvent', type: 'text', label: 'Next Event Tease' }
    ],
    sceneBuilder: false,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'launch_night_trailer',
    name: 'Launch Night Trailer',
    description: 'Product or business launch event trailer',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '🚀',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.DRAMATIC_TRAILER,
    duration: { min: 30, max: 60, default: 45 },
    aspectRatios: ['16:9'],
    sceneStructure: ['anticipation build', 'sneak peek reveals', 'crowd energy', 'launch moment climax', 'availability CTA'],
    quickInputs: [
      { name: 'productName', type: 'text', label: 'Product/Launch', required: true },
      { name: 'eventDate', type: 'text', label: 'Launch Date', required: true }
    ],
    advancedInputs: [
      { name: 'teaser', type: 'textarea', label: 'Teaser Text' },
      { name: 'venue', type: 'text', label: 'Venue' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: true,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'speaker_cut_spotlight',
    name: 'Speaker Cut Spotlight',
    description: 'Featured speaker or presenter highlight reel',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '🎤',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.DOCUMENTARY,
    duration: { min: 30, max: 90, default: 45 },
    aspectRatios: ['16:9'],
    sceneStructure: ['speaker entrance', 'key insight moment', 'crowd reaction', 'power quote', 'about speaker'],
    quickInputs: [
      { name: 'speakerName', type: 'text', label: 'Speaker Name', required: true },
      { name: 'eventName', type: 'text', label: 'Event' }
    ],
    advancedInputs: [
      { name: 'topic', type: 'text', label: 'Topic' },
      { name: 'highlight', type: 'text', label: 'Key Quote/Moment' }
    ],
    sceneBuilder: false,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: false,
    includeBrandContext: true
  },
  {
    id: 'voices_from_the_room_testimonial',
    name: 'Voices from the Room Testimonial',
    description: 'Multiple attendee testimonials and reactions',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '💬',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.DOCUMENTARY,
    duration: { min: 45, max: 90, default: 60 },
    aspectRatios: ['16:9', '9:16'],
    sceneStructure: ['attendee reactions montage', 'key quote highlights', 'networking moments', 'learning takeaways', 'recommendation close'],
    quickInputs: [
      { name: 'eventName', type: 'text', label: 'Event Name', required: true },
      { name: 'attendeeQuote', type: 'textarea', label: 'Key Feedback Themes' }
    ],
    advancedInputs: [
      { name: 'attendees', type: 'number', label: 'Number of Attendees' },
      { name: 'rating', type: 'text', label: 'Event Rating' }
    ],
    sceneBuilder: false,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'behind_the_curtain_documentary',
    name: 'Behind the Curtain Documentary',
    description: 'Event behind-the-scenes documentary',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '🎬',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.DOCUMENTARY,
    duration: { min: 90, max: 180, default: 120 },
    aspectRatios: ['16:9'],
    sceneStructure: ['pre-event setup', 'team preparation', ' backstage moments', 'problem solving', 'event success close'],
    quickInputs: [
      { name: 'eventName', type: 'text', label: 'Event Name', required: true },
      { name: 'organizer', type: 'text', label: 'Organizer' }
    ],
    advancedInputs: [
      { name: 'behindScenes', type: 'checkbox', label: 'Include Team' },
      { name: 'exclusivity', type: 'select', label: 'Access Level', options: ['full access', 'limited', 'highlights'] }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: false,
    includeBrandContext: true
  },
  {
    id: 'sizzle_sequence_promo',
    name: 'Sizzle Sequence Promo',
    description: 'Fast-paced event promotion with energy and excitement',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '🔥',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.BOLD_DIRECT_RESPONSE,
    duration: { min: 15, max: 30, default: 20 },
    aspectRatios: ['9:16', '16:9'],
    sceneStructure: ['energy hook', 'event highlights', 'speaker/experience teasers', 'date/time', 'register CTA'],
    quickInputs: [
      { name: 'eventName', type: 'text', label: 'Event Name', required: true },
      { name: 'eventDate', type: 'text', label: 'Event Date', required: true }
    ],
    advancedInputs: [
      { name: 'location', type: 'text', label: 'Location' },
      { name: 'registerLink', type: 'text', label: 'Registration Link' }
    ],
    sceneBuilder: false,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'moments_in_motion_reel',
    name: 'Moments in Motion Reel',
    description: 'Social-optimized event highlight reel',
    category: CINEMATIC_CATEGORIES.SOCIAL,
    icon: '📱',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.CINEMATIC_SOCIAL_SHORT,
    duration: { min: 5, max: 15, default: 10 },
    aspectRatios: ['9:16'],
    sceneStructure: ['best moment hook', 'energy burst', 'crowd vibe', 'highlight clip', 'follow for more'],
    quickInputs: [
      { name: 'eventName', type: 'text', label: 'Event Name', required: true },
      { name: 'organizer', type: 'text', label: 'Organizer/Brand' }
    ],
    advancedInputs: [
      { name: 'bestMoment', type: 'text', label: 'Hero Moment' },
      { name: 'music', type: 'text', label: 'Trending Audio' }
    ],
    sceneBuilder: false,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'venue_story_video',
    name: 'Venue Story Video',
    description: 'Event venue showcase with atmosphere and ambiance',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '🏛️',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.CINEMATIC_COMMERCIAL,
    duration: { min: 45, max: 90, default: 60 },
    aspectRatios: ['16:9', '21:9'],
    sceneStructure: ['venue exterior', 'entrance arrival', 'main space reveal', 'ambiance details', 'event-ready close'],
    quickInputs: [
      { name: 'venueName', type: 'text', label: 'Venue Name', required: true },
      { name: 'location', type: 'text', label: 'Location' }
    ],
    advancedInputs: [
      { name: 'capacity', type: 'text', label: 'Capacity' },
      { name: 'amenities', type: 'textarea', label: 'Key Amenities' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'next_one_promo',
    name: 'Next One Promo',
    description: 'Event series promotion for next upcoming event',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '📅',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.BOLD_DIRECT_RESPONSE,
    duration: { min: 15, max: 30, default: 20 },
    aspectRatios: ['9:16', '16:9'],
    sceneStructure: ['last event hook', 'what is next', 'series value', 'early bird offer', 'save the date CTA'],
    quickInputs: [
      { name: 'currentEvent', type: 'text', label: 'Last Event', placeholder: 'Or skip if new series' },
      { name: 'nextEvent', type: 'text', label: 'Next Event Name', required: true }
    ],
    advancedInputs: [
      { name: 'date', type: 'text', label: 'Date' },
      { name: 'venue', type: 'text', label: 'Venue' }
    ],
    sceneBuilder: false,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  }
];

// ============================================
// LUXURY BRAND TEMPLATES (10)
// ============================================

export const LUXURY_TEMPLATES = [
  {
    id: 'house_of_light_film',
    name: 'House of Light Film',
    description: 'Luxury brand film with emphasis on light and atmosphere',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '💎',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.LUXURY_BRAND_PROMO,
    duration: { min: 60, max: 120, default: 90 },
    aspectRatios: ['16:9', '21:9'],
    sceneStructure: ['light introduction', 'space journey', 'product in light', 'atmosphere crescendo', 'brand essence close'],
    quickInputs: [
      { name: 'brandName', type: 'text', label: 'Brand Name', required: true },
      { name: 'product', type: 'text', label: 'Featured Product/Collection' }
    ],
    advancedInputs: [
      { name: 'lightingStyle', type: 'select', label: 'Light Style', options: ['natural', 'dramatic', 'soft', 'golden'] },
      { name: 'mood', type: 'select', label: 'Mood', options: ['mysterious', 'warm', 'cold', 'ethereal'] }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'product_story_showcase',
    name: 'Product Story Showcase',
    description: 'Luxury product storytelling with heritage and craftsmanship',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '⌚',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.LUXURY_BRAND_PROMO,
    duration: { min: 45, max: 90, default: 60 },
    aspectRatios: ['16:9', '1:1'],
    sceneStructure: ['product reveal', 'craftsmanship detail', 'heritage moment', 'making process', 'timeless close'],
    quickInputs: [
      { name: 'product', type: 'text', label: 'Product', required: true },
      { name: 'brand', type: 'text', label: 'Brand', required: true }
    ],
    advancedInputs: [
      { name: 'heritage', type: 'text', label: 'Heritage Story' },
      { name: 'craftsmanship', type: 'textarea', label: 'Craftsmanship Details' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'legacy_in_frame_documentary',
    name: 'Legacy in Frame Documentary',
    description: 'Brand legacy documentary with deep heritage storytelling',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '📜',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.DOCUMENTARY,
    duration: { min: 120, max: 300, default: 180 },
    aspectRatios: ['16:9'],
    sceneStructure: ['legacy opening', 'origin story', 'generational journey', 'milestone moments', 'future vision close'],
    quickInputs: [
      { name: 'brandName', type: 'text', label: 'Brand Name', required: true },
      { name: 'founded', type: 'text', label: 'Founded', placeholder: 'e.g. 1892' }
    ],
    advancedInputs: [
      { name: 'founder', type: 'text', label: 'Founder' },
      { name: 'milestones', type: 'textarea', label: 'Key Milestones' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: true,
    includeCTA: false,
    includeBrandContext: true
  },
  {
    id: 'heritage_feature',
    name: 'Heritage Feature',
    description: 'Premium brand feature with focus on tradition and quality',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '🏆',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.LUXURY_BRAND_PROMO,
    duration: { min: 60, max: 120, default: 90 },
    aspectRatios: ['16:9'],
    sceneStructure: ['heritage introduction', 'tradition moments', 'quality standards', 'timeless elements', 'legacy close'],
    quickInputs: [
      { name: 'brandName', type: 'text', label: 'Brand Name', required: true },
      { name: 'legacy', type: 'text', label: 'Legacy Element', placeholder: 'e.g. Handcrafted since 1920' }
    ],
    advancedInputs: [
      { name: 'values', type: 'textarea', label: 'Brand Values' },
      { name: 'quality', type: 'text', label: 'Quality Promise' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'experience_video',
    name: 'Experience Video',
    description: 'Luxury experience content with immersive brand world',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '🌟',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.EMOTIONAL_BRAND_STORY,
    duration: { min: 60, max: 180, default: 90 },
    aspectRatios: ['16:9', '21:9'],
    sceneStructure: ['world entrance', 'sensory moments', 'exclusivity reveal', 'personal connection', 'experience invitation'],
    quickInputs: [
      { name: 'brandName', type: 'text', label: 'Brand Name', required: true },
      { name: 'experience', type: 'text', label: 'Experience Type', placeholder: 'e.g. Private shopping' }
    ],
    advancedInputs: [
      { name: 'sensory', type: 'checkbox', label: 'Include Sensory Details' },
      { name: 'exclusive', type: 'text', label: 'Exclusive Element' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'private_offer_promo',
    name: 'Private Offer Promo',
    description: 'Exclusive luxury promotion targeting high-end clientele',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '🎁',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.LUXURY_BRAND_PROMO,
    duration: { min: 30, max: 60, default: 45 },
    aspectRatios: ['16:9', '9:16'],
    sceneStructure: ['exclusive hook', 'private offer reveal', 'collection highlight', 'VIP treatment', 'exclusive access CTA'],
    quickInputs: [
      { name: 'brandName', type: 'text', label: 'Brand Name', required: true },
      { name: 'offer', type: 'text', label: 'Exclusive Offer', placeholder: 'e.g. Private preview' }
    ],
    advancedInputs: [
      { name: 'collection', type: 'text', label: 'Featured Collection' },
      { name: 'invitation', type: 'text', label: 'Invitation Language' }
    ],
    sceneBuilder: false,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'cinema_of_luxury_reel',
    name: 'Cinema of Luxury Reel',
    description: 'Cinematic luxury content optimized for social media',
    category: CINEMATIC_CATEGORIES.SOCIAL,
    icon: '🎥',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.CINEMATIC_SOCIAL_SHORT,
    duration: { min: 5, max: 15, default: 10 },
    aspectRatios: ['9:16'],
    sceneStructure: ['luxury hook', 'product moment', 'aspiration close-up', 'status detail', 'save/share aesthetic'],
    quickInputs: [
      { name: 'product', type: 'text', label: 'Product', required: true },
      { name: 'brand', type: 'text', label: 'Brand' }
    ],
    advancedInputs: [
      { name: 'mood', type: 'select', label: 'Aesthetic', options: ['elegant', 'bold', 'minimal', 'dramatic'] },
      { name: 'music', type: 'text', label: 'Luxury Audio' }
    ],
    sceneBuilder: false,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'detail_sequence_spotlight',
    name: 'Detail Sequence Spotlight',
    description: 'Luxury product detail sequence with macro aesthetics',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '🔎',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.LUXURY_BRAND_PROMO,
    duration: { min: 30, max: 60, default: 45 },
    aspectRatios: ['16:9', '1:1'],
    sceneStructure: ['macro intro', 'stitching/leather detail', 'hardware close-up', 'material quality', 'signature detail'],
    quickInputs: [
      { name: 'product', type: 'text', label: 'Product', required: true },
      { name: 'brand', type: 'text', label: 'Brand' }
    ],
    advancedInputs: [
      { name: 'details', type: 'textarea', label: 'Key Details' },
      { name: 'material', type: 'text', label: 'Material' }
    ],
    sceneBuilder: false,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: false,
    includeBrandContext: true
  },
  {
    id: 'aspirational_motion_ad',
    name: 'Aspirational Motion Ad',
    description: 'Lifestyle-driven luxury ad with aspirational visuals',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '✨',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.LUXURY_BRAND_PROMO,
    duration: { min: 20, max: 45, default: 30 },
    aspectRatios: ['9:16', '16:9'],
    sceneStructure: ['lifestyle hook', 'aspirational moment', 'product integration', 'dream state', 'desire close'],
    quickInputs: [
      { name: 'brandName', type: 'text', label: 'Brand Name', required: true },
      { name: 'lifestyle', type: 'text', label: 'Lifestyle Theme', placeholder: 'e.g. Mediterranean escape' }
    ],
    advancedInputs: [
      { name: 'scene', type: 'textarea', label: 'Aspirational Scene' },
      { name: 'product', type: 'text', label: 'Product Featured' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'prestige_trailer',
    name: 'Prestige Trailer',
    description: 'Prestige-level brand trailer with cinematic quality',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '🎬',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.DRAMATIC_TRAILER,
    duration: { min: 45, max: 90, default: 60 },
    aspectRatios: ['16:9', '21:9'],
    sceneStructure: ['prestige opening', 'brand world reveal', 'iconic moments', 'legacy crescendo', 'brand statement'],
    quickInputs: [
      { name: 'brandName', type: 'text', label: 'Brand Name', required: true },
      { name: 'campaign', type: 'text', label: 'Campaign/Collection' }
    ],
    advancedInputs: [
      { name: 'statement', type: 'textarea', label: 'Brand Statement' },
      { name: 'music', type: 'text', label: 'Score/Sound' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: true,
    includeCTA: true,
    includeBrandContext: true
  }
];

export default {
  AUTOMOTIVE_TEMPLATES,
  FASHION_TEMPLATES,
  EVENT_TEMPLATES,
  LUXURY_TEMPLATES
};
