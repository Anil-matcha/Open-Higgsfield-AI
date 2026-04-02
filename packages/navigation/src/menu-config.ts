/**
 * Menu Configuration
 * Defines navigation menu structures
 */

export interface MenuItem {
  label: string;
  route: string;
  icon?: string;
  dropdown?: MenuItem[];
  onClick?: () => void;
}

/**
 * Default navigation items for Open Higgsfield AI
 */
export const defaultNavigationItems: MenuItem[] = [
  { label: 'Explore', route: 'explore' },
  { 
    label: 'Image', 
    route: 'image',
    dropdown: [
      { label: 'Text to Image', route: 'text-to-image' },
      { label: 'Image to Image', route: 'image-to-image' },
    ]
  },
  { 
    label: 'Video', 
    route: 'video',
    dropdown: [
      { label: 'Text to Video', route: 'text-to-video' },
      { label: 'Image to Video', route: 'image-to-video' },
      { label: 'Video to Video', route: 'video-to-video' },
      { label: 'Watermark Remover', route: 'video-watermark' },
    ]
  },
  { 
    label: 'Tools', 
    route: 'tools',
    dropdown: [
      { label: 'Storyboard', route: 'storyboard-page' },
      { label: 'Character', route: 'character-page' },
      { label: 'Vibe Motion', route: 'effects-page' },
      { label: 'Cinema Studio', route: 'cinema-page' },
      { label: 'AI Influencer', route: 'influencer-page' },
      { label: 'Commercial', route: 'commercial-page' },
      { label: 'Upscale', route: 'upscale-page' },
    ]
  },
  { label: 'Storyboard', route: 'storyboard-page' },
  { label: 'Character', route: 'character-page' },
  { label: 'Vibe Motion', route: 'effects-page' },
  { label: 'Cinema Studio', route: 'cinema-page' },
  { label: 'AI Influencer', route: 'influencer-page' },
  { label: 'Apps', route: 'apps' },
  { label: 'Templates', route: 'templates' },
  { label: 'Assist', route: 'assist' },
  { label: 'Community', route: 'community' },
];

/**
 * Creates a navigation menu configuration
 */
export function createMenuConfig(items: MenuItem[] = defaultNavigationItems) {
  return {
    items,
    mobileBreakpoint: 'lg',
  };
}
