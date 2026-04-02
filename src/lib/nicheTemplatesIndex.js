/**
 * NICHE TEMPLATES INDEX
 * Exports all 120+ niche-specific cinematic templates
 */

import { RESTAURANT_TEMPLATES } from './nicheTemplates.js';
import { MED_SPA_TEMPLATES, SALON_TEMPLATES, FITNESS_TEMPLATES, REAL_ESTATE_TEMPLATES } from './nicheTemplates.js';
import { DENTAL_TEMPLATES, CHIROPRACTIC_TEMPLATES, LEGAL_TEMPLATES } from './nicheTemplatesPart2.js';
import { AUTOMOTIVE_TEMPLATES, FASHION_TEMPLATES, EVENT_TEMPLATES, LUXURY_TEMPLATES } from './nicheTemplatesPart3.js';

// Niche mapping - adds a niche property to each template for grouping
const NICHE_LABELS = {
  RESTAURANT: 'Restaurant & Cafe',
  MED_SPA: 'Med Spa & Beauty',
  SALON: 'Salon & Barbershop',
  FITNESS: 'Gym & Fitness',
  REAL_ESTATE: 'Real Estate',
  DENTAL: 'Dental Office',
  CHIROPRACTIC: 'Chiropractic & Wellness',
  LEGAL: 'Legal & Attorney',
  AUTOMOTIVE: 'Automotive & Car',
  FASHION: 'Fashion & Style',
  EVENT: 'Events & Celebrations',
  LUXURY: 'Luxury & Premium'
};

// Helper to add niche property to templates
function addNiche(templates, nicheKey) {
  return templates.map(t => ({ ...t, niche: NICHE_LABELS[nicheKey] }));
}

export {
  RESTAURANT_TEMPLATES,
  MED_SPA_TEMPLATES,
  SALON_TEMPLATES,
  FITNESS_TEMPLATES,
  REAL_ESTATE_TEMPLATES,
  DENTAL_TEMPLATES,
  CHIROPRACTIC_TEMPLATES,
  LEGAL_TEMPLATES,
  AUTOMOTIVE_TEMPLATES,
  FASHION_TEMPLATES,
  EVENT_TEMPLATES,
  LUXURY_TEMPLATES
};

export const ALL_NICHE_TEMPLATES = [
  ...addNiche(RESTAURANT_TEMPLATES, 'RESTAURANT'),
  ...addNiche(MED_SPA_TEMPLATES, 'MED_SPA'),
  ...addNiche(SALON_TEMPLATES, 'SALON'),
  ...addNiche(FITNESS_TEMPLATES, 'FITNESS'),
  ...addNiche(REAL_ESTATE_TEMPLATES, 'REAL_ESTATE'),
  ...addNiche(DENTAL_TEMPLATES, 'DENTAL'),
  ...addNiche(CHIROPRACTIC_TEMPLATES, 'CHIROPRACTIC'),
  ...addNiche(LEGAL_TEMPLATES, 'LEGAL'),
  ...addNiche(AUTOMOTIVE_TEMPLATES, 'AUTOMOTIVE'),
  ...addNiche(FASHION_TEMPLATES, 'FASHION'),
  ...addNiche(EVENT_TEMPLATES, 'EVENT'),
  ...addNiche(LUXURY_TEMPLATES, 'LUXURY')
];

export const NICHE_LABELS_MAP = NICHE_LABELS;

export default ALL_NICHE_TEMPLATES;
