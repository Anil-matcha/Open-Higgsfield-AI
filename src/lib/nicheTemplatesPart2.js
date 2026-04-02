/**
 * NICHE TEMPLATES PART 2
 * Additional 70 industry-specific cinematic templates
 */

import { CINEMATIC_CATEGORIES, OUTPUT_STYLES } from './cinematicTemplates.js';

// ============================================
// DENTAL OFFICE TEMPLATES (10)
// ============================================

export const DENTAL_TEMPLATES = [
  {
    id: 'smile_frame_film',
    name: 'Smile Frame Film',
    description: 'Beautiful smile showcase with confident patient visuals',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '😁',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.LUXURY_BRAND_PROMO,
    duration: { min: 30, max: 60, default: 45 },
    aspectRatios: ['16:9', '9:16'],
    sceneStructure: ['confident entrance', 'smile reveal', 'dental environment', 'care moment', 'healthy smile close'],
    quickInputs: [
      { name: 'practiceName', type: 'text', label: 'Practice Name', required: true },
      { name: 'service', type: 'text', label: 'Featured Service', placeholder: 'e.g. whitening, veneers' }
    ],
    advancedInputs: [
      { name: 'focus', type: 'select', label: 'Focus', options: ['aesthetic', 'general', 'family'] },
      { name: 'mood', type: 'select', label: 'Mood', options: ['warm', 'clinical', 'spa-like'] }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'better_smile_story',
    name: 'Better Smile Story',
    description: 'Transformation story showing smile improvement journey',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '😊',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.EMOTIONAL_BRAND_STORY,
    duration: { min: 60, max: 120, default: 90 },
    aspectRatios: ['16:9', '9:16'],
    sceneStructure: ['before smile', 'decision moment', 'treatment process', 'progressive results', 'confidence reveal'],
    quickInputs: [
      { name: 'patientName', type: 'text', label: 'Patient Name', placeholder: 'Or keep anonymous' },
      { name: 'treatment', type: 'text', label: 'Treatment', required: true }
    ],
    advancedInputs: [
      { name: 'concern', type: 'textarea', label: 'Original Concern' },
      { name: 'result', type: 'textarea', label: 'Result Achieved' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'white_light_promo',
    name: 'White Light Promo',
    description: 'Clean, bright promotional content for dental services',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '✨',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.CINEMATIC_COMMERCIAL,
    duration: { min: 15, max: 45, default: 30 },
    aspectRatios: ['9:16', '16:9'],
    sceneStructure: ['clean hook', 'service showcase', 'technology highlight', 'care atmosphere', 'book CTA'],
    quickInputs: [
      { name: 'practiceName', type: 'text', label: 'Practice Name', required: true },
      { name: 'services', type: 'textarea', label: 'Services to Feature' }
    ],
    advancedInputs: [
      { name: 'technology', type: 'text', label: 'Key Technology' },
      { name: 'offer', type: 'text', label: 'Special Offer' }
    ],
    sceneBuilder: false,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'family_visit_explainer',
    name: 'Family Visit Explainer',
    description: 'Warm, family-friendly content showing dental visit experience',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '👨‍👩‍👧‍👦',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.DOCUMENTARY,
    duration: { min: 45, max: 90, default: 60 },
    aspectRatios: ['16:9'],
    sceneStructure: ['family arrival', 'welcoming environment', 'care moment', 'kid-friendly touch', 'healthy family close'],
    quickInputs: [
      { name: 'practiceName', type: 'text', label: 'Practice Name', required: true },
      { name: 'familyFocus', type: 'text', label: 'Family Focus', placeholder: 'e.g. pediatric, family dentistry' }
    ],
    advancedInputs: [
      { name: 'comfort', type: 'checkbox', label: 'Emphasize Comfort' },
      { name: 'technology', type: 'text', label: 'Family-Friendly Tech' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'dentist_story_portrait',
    name: 'Dentist Story Portrait',
    description: 'Provider profile showcasing expertise and personal connection',
    category: CINEMATIC_CATEGORIES.PERSONAL,
    icon: '👩‍⚕️',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.DOCUMENTARY,
    duration: { min: 60, max: 120, default: 90 },
    aspectRatios: ['16:9'],
    sceneStructure: ['provider introduction', 'why dentistry story', 'patient philosophy', 'care approach', 'personal close'],
    quickInputs: [
      { name: 'dentistName', type: 'text', label: 'Dentist Name', required: true },
      { name: 'specialty', type: 'text', label: 'Specialty', placeholder: 'e.g. General, Cosmetic' }
    ],
    advancedInputs: [
      { name: 'credentials', type: 'textarea', label: 'Credentials' },
      { name: 'philosophy', type: 'textarea', label: 'Care Philosophy' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'comfort_on_camera_testimonial',
    name: 'Comfort on Camera Testimonial',
    description: 'Patient testimonial focusing on pain-free, comfortable experience',
    category: CINEMATIC_CATEGORIES.PERSONAL,
    icon: '💬',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.DOCUMENTARY,
    duration: { min: 30, max: 60, default: 45 },
    aspectRatios: ['16:9', '9:16'],
    sceneStructure: ['patient introduction', 'past fear', 'comfort found', 'procedure experience', 'recommendation close'],
    quickInputs: [
      { name: 'patientName', type: 'text', label: 'Patient Name', placeholder: 'Or keep anonymous' },
      { name: 'procedure', type: 'text', label: 'Procedure', required: true }
    ],
    advancedInputs: [
      { name: 'anxiety', type: 'text', label: 'Past Dental Anxiety' },
      { name: 'experience', type: 'textarea', label: 'Comfort Experience' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'inside_the_practice_video',
    name: 'Inside the Practice Video',
    description: 'Behind-the-scenes look at modern dental practice',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '🏥',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.DOCUMENTARY,
    duration: { min: 45, max: 90, default: 60 },
    aspectRatios: ['16:9'],
    sceneStructure: ['exterior establishing', 'front desk welcome', 'treatment room tour', 'technology showcase', 'team introduction'],
    quickInputs: [
      { name: 'practiceName', type: 'text', label: 'Practice Name', required: true },
      { name: 'vibe', type: 'text', label: 'Practice Vibe', placeholder: 'e.g. modern, spa-like, family' }
    ],
    advancedInputs: [
      { name: 'technology', type: 'textarea', label: 'Key Technology' },
      { name: 'team', type: 'checkbox', label: 'Include Team' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: false,
    includeBrandContext: true
  },
  {
    id: 'care_sequence_showcase',
    name: 'Care Sequence Showcase',
    description: 'Step-by-step visual journey of quality dental care',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '🤝',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.CINEMATIC_COMMERCIAL,
    duration: { min: 45, max: 90, default: 60 },
    aspectRatios: ['16:9'],
    sceneStructure: ['consultation moment', 'examination detail', 'treatment explanation', 'care delivery', 'follow-up care'],
    quickInputs: [
      { name: 'practiceName', type: 'text', label: 'Practice Name', required: true },
      { name: 'service', type: 'text', label: 'Featured Service', required: true }
    ],
    advancedInputs: [
      { name: 'steps', type: 'textarea', label: 'Key Steps to Highlight' },
      { name: 'technology', type: 'text', label: 'Technology Used' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'first_visit_promo',
    name: 'First Visit Promo',
    description: 'New patient acquisition with first visit offer',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '🎁',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.BOLD_DIRECT_RESPONSE,
    duration: { min: 15, max: 30, default: 20 },
    aspectRatios: ['9:16', '16:9'],
    sceneStructure: ['welcome hook', 'new patient offer', 'practice atmosphere', 'easy booking', 'call CTA'],
    quickInputs: [
      { name: 'practiceName', type: 'text', label: 'Practice Name', required: true },
      { name: 'offer', type: 'text', label: 'New Patient Offer', placeholder: 'e.g. Free exam' }
    ],
    advancedInputs: [
      { name: 'value', type: 'text', label: 'Offer Value' },
      { name: 'expires', type: 'text', label: 'Expiration' }
    ],
    sceneBuilder: false,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'trust_the_smile_documentary',
    name: 'Trust the Smile Documentary',
    description: 'Authority-building documentary about dental expertise and trust',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '🏆',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.DOCUMENTARY,
    duration: { min: 60, max: 180, default: 90 },
    aspectRatios: ['16:9'],
    sceneStructure: ['expertise establishing', 'qualifications showcase', 'patient trust moments', 'case studies', 'authority close'],
    quickInputs: [
      { name: 'practiceName', type: 'text', label: 'Practice Name', required: true },
      { name: 'expertise', type: 'text', label: 'Area of Expertise', required: true }
    ],
    advancedInputs: [
      { name: 'credentials', type: 'textarea', label: 'Credentials/Awards' },
      { name: 'cases', type: 'textarea', label: 'Notable Cases' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  }
];

// ============================================
// CHIROPRACTIC / WELLNESS CLINIC TEMPLATES (10)
// ============================================

export const CHIROPRACTIC_TEMPLATES = [
  {
    id: 'return_to_balance_film',
    name: 'Return to Balance Film',
    description: 'Wellness-focused content showing journey back to health',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '⚖️',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.EMOTIONAL_BRAND_STORY,
    duration: { min: 45, max: 90, default: 60 },
    aspectRatios: ['16:9', '9:16'],
    sceneStructure: ['pain state', 'search for help', 'first visit', 'progress journey', 'balance restored'],
    quickInputs: [
      { name: 'clinicName', type: 'text', label: 'Clinic Name', required: true },
      { name: 'focus', type: 'text', label: 'Wellness Focus', placeholder: 'e.g. spinal health' }
    ],
    advancedInputs: [
      { name: 'condition', type: 'text', label: 'Common Condition' },
      { name: 'method', type: 'text', label: 'Treatment Method' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'alignment_explainer',
    name: 'Alignment Explainer',
    description: 'Educational content explaining chiropractic alignment',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '📐',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.CINEMATIC_COMMERCIAL,
    duration: { min: 45, max: 90, default: 60 },
    aspectRatios: ['16:9'],
    sceneStructure: ['problem identification', 'anatomy moment', 'solution explanation', 'treatment demonstration', 'results close'],
    quickInputs: [
      { name: 'clinicName', type: 'text', label: 'Clinic Name', required: true },
      { name: 'focus', type: 'text', label: 'Focus Area', required: true }
    ],
    advancedInputs: [
      { name: 'technique', type: 'text', label: 'Technique' },
      { name: 'benefits', type: 'textarea', label: 'Key Benefits' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'relief_story_documentary',
    name: 'Relief Story Documentary',
    description: 'Patient story focused on finding relief through care',
    category: CINEMATIC_CATEGORIES.PERSONAL,
    icon: '💆',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.DOCUMENTARY,
    duration: { min: 60, max: 120, default: 90 },
    aspectRatios: ['16:9'],
    sceneStructure: ['chronic pain state', 'struggle journey', 'discovery moment', 'treatment progress', 'relief celebration'],
    quickInputs: [
      { name: 'patientName', type: 'text', label: 'Patient Name', placeholder: 'Or keep anonymous' },
      { name: 'condition', type: 'text', label: 'Condition', required: true }
    ],
    advancedInputs: [
      { name: 'timeline', type: 'text', label: 'Suffering Period' },
      { name: 'testimonial', type: 'textarea', label: 'Relief Quote' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'wellness_authority_portrait',
    name: 'Wellness Authority Portrait',
    description: 'Provider profile establishing chiropractic authority',
    category: CINEMATIC_CATEGORIES.PERSONAL,
    icon: '🎓',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.DOCUMENTARY,
    duration: { min: 60, max: 120, default: 90 },
    aspectRatios: ['16:9'],
    sceneStructure: ['provider introduction', 'education background', 'philosophy of care', 'patient outcomes', 'wellness mission'],
    quickInputs: [
      { name: 'doctorName', type: 'text', label: 'Doctor Name', required: true },
      { name: 'specialty', type: 'text', label: 'Specialty', required: true }
    ],
    advancedInputs: [
      { name: 'credentials', type: 'textarea', label: 'Credentials' },
      { name: 'approach', type: 'textarea', label: 'Care Approach' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'healing_room_video',
    name: 'Healing Room Video',
    description: 'Tour of therapeutic clinic environment and treatment rooms',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '🛋️',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.CINEMATIC_COMMERCIAL,
    duration: { min: 30, max: 60, default: 45 },
    aspectRatios: ['16:9'],
    sceneStructure: ['clinic exterior', 'reception warmth', 'treatment room tour', 'modality showcase', 'calm close'],
    quickInputs: [
      { name: 'clinicName', type: 'text', label: 'Clinic Name', required: true },
      { name: 'vibe', type: 'text', label: 'Clinic Vibe', placeholder: 'e.g. clinical, spa-like' }
    ],
    advancedInputs: [
      { name: 'rooms', type: 'textarea', label: 'Rooms to Highlight' },
      { name: 'modalities', type: 'textarea', label: 'Treatment Modalities' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'recovery_cut_testimonial',
    name: 'Recovery Cut Testimonial',
    description: 'Athletic recovery testimonial with sports focus',
    category: CINEMATIC_CATEGORIES.PERSONAL,
    icon: '🏃',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.DOCUMENTARY,
    duration: { min: 30, max: 60, default: 45 },
    aspectRatios: ['16:9', '9:16'],
    sceneStructure: ['athlete introduction', 'injury setback', 'recovery process', 'return to sport', 'performance close'],
    quickInputs: [
      { name: 'athleteName', type: 'text', label: 'Athlete Name', placeholder: 'Or keep anonymous' },
      { name: 'sport', type: 'text', label: 'Sport', required: true }
    ],
    advancedInputs: [
      { name: 'injury', type: 'text', label: 'Injury/Condition' },
      { name: 'recoveryTime', type: 'text', label: 'Recovery Timeline' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'calm_within_reel',
    name: 'Calm Within Reel',
    description: 'Peaceful wellness content for social media',
    category: CINEMATIC_CATEGORIES.SOCIAL,
    icon: '🧘',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.CINEMATIC_SOCIAL_SHORT,
    duration: { min: 5, max: 15, default: 10 },
    aspectRatios: ['9:16'],
    sceneStructure: ['calm hook', 'treatment moment', 'relaxation details', 'peaceful close', 'wellness share'],
    quickInputs: [
      { name: 'clinicName', type: 'text', label: 'Clinic Name', required: true },
      { name: 'treatment', type: 'text', label: 'Treatment/Service' }
    ],
    advancedInputs: [
      { name: 'music', type: 'text', label: 'Calm Audio' },
      { name: 'focus', type: 'select', label: 'Focus', options: ['relaxation', 'pain relief', 'wellness'] }
    ],
    sceneBuilder: false,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'begin_again_promo',
    name: 'Begin Again Promo',
    description: 'Fresh start wellness promotion for new patients',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '🌱',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.BOLD_DIRECT_RESPONSE,
    duration: { min: 15, max: 30, default: 20 },
    aspectRatios: ['9:16', '16:9'],
    sceneStructure: ['wellness hook', 'new beginning theme', 'clinic welcome', 'offer reveal', 'start CTA'],
    quickInputs: [
      { name: 'clinicName', type: 'text', label: 'Clinic Name', required: true },
      { name: 'offer', type: 'text', label: 'New Patient Offer', placeholder: 'e.g. Consultation' }
    ],
    advancedInputs: [
      { name: 'value', type: 'text', label: 'Offer Value' },
      { name: 'expires', type: 'text', label: 'Limited Time' }
    ],
    sceneBuilder: false,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'local_wellness_ad',
    name: 'Local Wellness Ad',
    description: 'Community-focused ad targeting local wellness patients',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '📍',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.BOLD_DIRECT_RESPONSE,
    duration: { min: 15, max: 30, default: 20 },
    aspectRatios: ['9:16', '16:9'],
    sceneStructure: ['community hook', 'local focus', 'wellness services', 'convenience', 'visit CTA'],
    quickInputs: [
      { name: 'clinicName', type: 'text', label: 'Clinic Name', required: true },
      { name: 'location', type: 'text', label: 'Location', required: true }
    ],
    advancedInputs: [
      { name: 'area', type: 'text', label: 'Serving Area' },
      { name: 'hours', type: 'text', label: 'Convenient Hours' }
    ],
    sceneBuilder: false,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'motion_to_heal_short',
    name: 'Motion to Heal Short',
    description: 'Movement and mobility focused wellness content',
    category: CINEMATIC_CATEGORIES.SOCIAL,
    icon: '🏃',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.CINEMATIC_SOCIAL_SHORT,
    duration: { min: 5, max: 15, default: 10 },
    aspectRatios: ['9:16'],
    sceneStructure: ['motion hook', 'movement moment', 'mobility showcase', 'healing close', 'save/share'],
    quickInputs: [
      { name: 'clinicName', type: 'text', label: 'Clinic Name', required: true },
      { name: 'focus', type: 'text', label: 'Movement Focus' }
    ],
    advancedInputs: [
      { name: 'exercise', type: 'text', label: 'Featured Exercise' },
      { name: 'music', type: 'text', label: 'Upbeat Audio' }
    ],
    sceneBuilder: false,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  }
];

// ============================================
// LAW FIRM TEMPLATES (10)
// ============================================

export const LEGAL_TEMPLATES = [
  {
    id: 'authority_case_film',
    name: 'Authority Case Film',
    description: 'Case result showcase with authority and credibility focus',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '⚖️',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.DOCUMENTARY,
    duration: { min: 45, max: 90, default: 60 },
    aspectRatios: ['16:9'],
    sceneStructure: ['case introduction', 'challenge faced', 'legal strategy', 'successful result', 'justice close'],
    quickInputs: [
      { name: 'firmName', type: 'text', label: 'Firm Name', required: true },
      { name: 'caseType', type: 'text', label: 'Case Type', required: true }
    ],
    advancedInputs: [
      { name: 'result', type: 'text', label: 'Result', placeholder: 'e.g. $2M settlement' },
      { name: 'details', type: 'textarea', label: 'Case Details' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'counsel_on_camera_portrait',
    name: 'Counsel on Camera Portrait',
    description: 'Attorney profile with professional authority presence',
    category: CINEMATIC_CATEGORIES.PERSONAL,
    icon: '👨‍💼',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.DOCUMENTARY,
    duration: { min: 60, max: 120, default: 90 },
    aspectRatios: ['16:9'],
    sceneStructure: ['attorney entrance', 'credentials moment', 'expertise area', 'client philosophy', 'consultation close'],
    quickInputs: [
      { name: 'attorneyName', type: 'text', label: 'Attorney Name', required: true },
      { name: 'specialty', type: 'text', label: 'Practice Area', required: true }
    ],
    advancedInputs: [
      { name: 'credentials', type: 'textarea', label: 'Credentials/Awards' },
      { name: 'approach', type: 'textarea', label: 'Legal Approach' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'practice_area_explainer',
    name: 'Practice Area Explainer',
    description: 'Educational content about specific legal practice area',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '📖',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.CINEMATIC_COMMERCIAL,
    duration: { min: 60, max: 120, default: 90 },
    aspectRatios: ['16:9'],
    sceneStructure: ['legal topic introduction', 'common questions', 'legal process', 'how we help', 'next steps'],
    quickInputs: [
      { name: 'firmName', type: 'text', label: 'Firm Name', required: true },
      { name: 'practiceArea', type: 'text', label: 'Practice Area', required: true }
    ],
    advancedInputs: [
      { name: 'questions', type: 'textarea', label: 'Common Questions' },
      { name: 'process', type: 'text', label: 'Legal Process' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'trust_in_evidence_testimonial',
    name: 'Trust in Evidence Testimonial',
    description: 'Client testimonial built on trust and results',
    category: CINEMATIC_CATEGORIES.PERSONAL,
    icon: '🤝',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.DOCUMENTARY,
    duration: { min: 45, max: 90, default: 60 },
    aspectRatios: ['16:9', '9:16'],
    sceneStructure: ['client situation', 'searching for help', 'working with firm', 'successful outcome', 'trust recommendation'],
    quickInputs: [
      { name: 'clientName', type: 'text', label: 'Client Name', placeholder: 'Or keep anonymous' },
      { name: 'caseType', type: 'text', label: 'Case Type', required: true }
    ],
    advancedInputs: [
      { name: 'challenge', type: 'textarea', label: 'Client Challenge' },
      { name: 'outcome', type: 'textarea', label: 'Outcome' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'case_story_documentary',
    name: 'Case Story Documentary',
    description: 'In-depth documentary on notable legal case',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '📋',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.DOCUMENTARY,
    duration: { min: 90, max: 300, default: 180 },
    aspectRatios: ['16:9'],
    sceneStructure: ['case overview', 'complexity revealed', 'legal team approach', 'milestones journey', 'justice achieved'],
    quickInputs: [
      { name: 'firmName', type: 'text', label: 'Firm Name', required: true },
      { name: 'caseType', type: 'text', label: 'Case Type', required: true }
    ],
    advancedInputs: [
      { name: 'duration', type: 'select', label: 'Doc Length', options: ['short', 'medium', 'feature'] },
      { name: 'sensitivity', type: 'select', label: 'Sensitivity', options: ['public', 'confidential', 'anonymized'] }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: true,
    includeCTA: false,
    includeBrandContext: true
  },
  {
    id: 'consultation_scene_promo',
    name: 'Consultation Scene Promo',
    description: 'Inviting promotional content about free consultation',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '📞',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.BOLD_DIRECT_RESPONSE,
    duration: { min: 15, max: 30, default: 20 },
    aspectRatios: ['9:16', '16:9'],
    sceneStructure: ['legal need hook', 'free consultation offer', 'what to expect', 'no obligation', 'call now CTA'],
    quickInputs: [
      { name: 'firmName', type: 'text', label: 'Firm Name', required: true },
      { name: 'offer', type: 'text', label: 'Consultation Offer', placeholder: 'e.g. Free case review' }
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
  },
  {
    id: 'founders_argument_story',
    name: 'Founder\'s Argument Story',
    description: 'Firm founder story with mission and values',
    category: CINEMATIC_CATEGORIES.PERSONAL,
    icon: '💼',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.INSPIRATIONAL_FOUNDER,
    duration: { min: 90, max: 180, default: 120 },
    aspectRatios: ['16:9'],
    sceneStructure: ['founder origin', 'why law story', 'firm mission', 'values in practice', 'legacy close'],
    quickInputs: [
      { name: 'founderName', type: 'text', label: 'Founder Name', required: true },
      { name: 'firmName', type: 'text', label: 'Firm Name', required: true }
    ],
    advancedInputs: [
      { name: 'origin', type: 'textarea', label: 'Origin Story' },
      { name: 'mission', type: 'textarea', label: 'Mission/Values' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'inside_the_firm_video',
    name: 'Inside the Firm Video',
    description: 'Professional tour of law firm environment',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '🏛️',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.DOCUMENTARY,
    duration: { min: 45, max: 90, default: 60 },
    aspectRatios: ['16:9'],
    sceneStructure: ['firm exterior', 'professional entrance', 'conference room', 'workspace', 'team presence'],
    quickInputs: [
      { name: 'firmName', type: 'text', label: 'Firm Name', required: true },
      { name: 'vibe', type: 'text', label: 'Firm Vibe', placeholder: 'e.g. boutique, full-service' }
    ],
    advancedInputs: [
      { name: 'location', type: 'text', label: 'Location' },
      { name: 'teamSize', type: 'text', label: 'Team Size' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: false,
    includeBrandContext: true
  },
  {
    id: 'built_on_trust_feature',
    name: 'Built on Trust Feature',
    description: 'Trust-building feature on firm reputation and client relationships',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '🏆',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.EMOTIONAL_BRAND_STORY,
    duration: { min: 60, max: 120, default: 90 },
    aspectRatios: ['16:9'],
    sceneStructure: ['trust hook', 'client relationship', 'years of service', 'reputation moments', 'commitment close'],
    quickInputs: [
      { name: 'firmName', type: 'text', label: 'Firm Name', required: true },
      { name: 'years', type: 'text', label: 'Years in Practice' }
    ],
    advancedInputs: [
      { name: 'achievements', type: 'textarea', label: 'Achievements' },
      { name: 'testimonials', type: 'textarea', label: 'Client Feedback' }
    ],
    sceneBuilder: true,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  },
  {
    id: 'local_verdict_ad',
    name: 'Local Verdict Ad',
    description: 'Community-focused ad with local credibility',
    category: CINEMATIC_CATEGORIES.INDUSTRY,
    icon: '📢',
    outputType: 'video',
    outputStyle: OUTPUT_STYLES.BOLD_DIRECT_RESPONSE,
    duration: { min: 15, max: 30, default: 20 },
    aspectRatios: ['9:16', '16:9'],
    sceneStructure: ['local hook', 'community connection', 'legal services', 'results in area', 'contact CTA'],
    quickInputs: [
      { name: 'firmName', type: 'text', label: 'Firm Name', required: true },
      { name: 'location', type: 'text', label: 'Location', required: true }
    ],
    advancedInputs: [
      { name: 'area', type: 'text', label: 'Serving Area' },
      { name: 'specialty', type: 'text', label: 'Local Specialty' }
    ],
    sceneBuilder: false,
    shotBuilder: true,
    storyboardBuilder: false,
    includeCTA: true,
    includeBrandContext: true
  }
];

export default {
  DENTAL_TEMPLATES,
  CHIROPRACTIC_TEMPLATES,
  LEGAL_TEMPLATES
};
