# Open Higgsfield AI - MuAPI Integration Guide

This document provides comprehensive technical documentation for implementing new AI model integrations and studio features into the Open Higgsfield AI application.

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Router Configuration](#2-router-configuration)
3. [Sidebar Navigation](#3-sidebar-navigation)
4. [Studio Component Integration Patterns](#4-studio-component-integration-patterns)
5. [Model-Specific Implementation Requirements](#5-model-specific-implementation-requirements)
6. [UI Component Integration](#6-ui-component-integration)
7. [Type Definitions](#7-type-definitions)
8. [Error Handling and Loading States](#8-error-handling-and-loading-states)
9. [Testing Requirements](#9-testing-requirements)
10. [Configuration Examples](#10-configuration-examples)

---

## 1. Architecture Overview

### 1.1 How Models Are Registered in `src/lib/models.js`

The models are organized into category-specific arrays. Each model is an object containing metadata about the AI model, its endpoint, and input parameters.

```javascript
// File: src/lib/models.js (Lines 1-150)
// Auto-generated from models_dump.json

// Text-to-Image Models
export const t2iModels = [
  {
    "id": "nano-banana",
    "name": "Nano Banana",
    "endpoint": "nano-banana",
    "inputs": {
      "prompt": {
        "examples": ["A portrait of me in a modern living room..."],
        "description": "Text prompt describing the image...",
        "type": "string",
        "title": "Prompt",
        "name": "prompt"
      },
      "aspect_ratio": {
        "enum": ["1:1", "3:4", "4:3", "9:16", "16:9"],
        "title": "Aspect Ratio",
        "name": "aspect_ratio",
        "type": "string",
        "description": "Aspect ratio of the output image.",
        "default": "1:1"
      }
    }
  }
];
```

### 1.2 Model Categories

| Category | Export Name | Purpose |
|----------|-------------|---------|
| Text-to-Image | `t2iModels` | Generate images from text prompts |
| Image-to-Image | `i2iModels` | Transform existing images |
| Text-to-Video | `videoModels` | Generate videos from text |
| Image-to-Video | `i2vModels` | Animate images into videos |
| Video-to-Video | `v2vModels` | Process/modify videos |

### 1.3 Model Structure

```javascript
{
  "id": "model-unique-id",           // Unique identifier for the model
  "name": "Human Readable Name",     // Display name in UI
  "endpoint": "api-endpoint-name",   // MuAPI endpoint (used in URL)
  "family": "model-family",          // Grouping category
  "inputs": {                        // Input parameters
    "parameter_name": {
      "type": "string",              // string, int, number, boolean, array, object
      "title": "UI Label",
      "name": "api_parameter_name",
      "description": "Help text for user",
      "default": "default_value",
      "enum": ["opt1", "opt2"],      // Dropdown options
      "minValue": 1,                 // Numeric constraints
      "maxValue": 100,
      "step": 1,
      "examples": ["example_prompt"] // Prompt suggestions
    }
  },
  "imageField": "image_url",         // Custom field name for image input (optional)
  "videoField": "video_url"          // Custom field name for video input (optional)
}
```

### 1.4 Helper Functions

The `models.js` exports helper functions for model lookup:

```javascript
// File: src/lib/models.js

// Get a model by its ID
export function getModelById(id) {
  return t2iModels.find(m => m.id === id) || i2iModels.find(m => m.id === id);
}

// Get video model by ID
export function getVideoModelById(id) {
  return videoModels.find(m => m.id === id);
}

// Get I2I model by ID
export function getI2IModelById(id) {
  return i2iModels.find(m => m.id === id);
}

// Get I2V model by ID
export function getI2VModelById(id) {
  return i2vModels.find(m => m.id === id);
}

// Get V2V model by ID
export function getV2VModelById(id) {
  return v2vModels.find(m => m.id === id);
}

// Get aspect ratios for a specific model
export function getAspectRatiosForModel(modelId) {
  const model = getModelById(modelId);
  return model?.inputs?.aspect_ratio?.enum || ['1:1'];
}

// Get resolutions for a specific model
export function getResolutionsForModel(modelId) {
  const model = getModelById(modelId);
  return model?.inputs?.resolution?.enum || [];
}

// Get quality options for a model
export function getQualityFieldForModel(modelId) {
  const model = getModelById(modelId);
  return model?.inputs?.quality;
}
```

---

## 2. Router Configuration

### 2.1 Current Route Map

The router is configured in `src/lib/router.js`:

```javascript
// File: src/lib/router.js (Lines 1-39)

const ROUTE_MAP = {
  'Explore': 'explore',
  'Image': 'image',
  'Video': 'video',
  'Storyboard': 'storyboard',
  'Edit': 'edit',
  'Character': 'character',
  'Contests': 'explore',
  'Vibe Motion': 'effects',
  'Cinema Studio': 'cinema',
  'AI Influencer': 'influencer',
  'Apps': 'apps',
  'Templates': 'templates',
  'Assist': 'assist',
  'Community': 'community',
};

export function getRouteForItem(item) {
  return ROUTE_MAP[item] || item.toLowerCase().replace(/\s+/g, '-');
}

// Lazy-loaded page components
const pageLoaders = {
  image: () => import('../components/ImageStudio.js').then(m => m.ImageStudio()),
  video: () => import('../components/VideoStudio.js').then(m => m.VideoStudio()),
  cinema: () => import('../components/CinemaStudio.js').then(m => m.CinemaStudio()),
  apps: () => import('../components/AppsHub.js').then(m => m.AppsHub()),
  templates: () => import('../components/TemplatesPage.js').then(m => m.TemplatesPage()),
  effects: () => import('../components/EffectsStudio.js').then(m => m.EffectsStudio()),
  edit: () => import('../components/EditStudio.js').then(m => m.EditStudio()),
  upscale: () => import('../components/UpscaleStudio.js').then(m => m.UpscaleStudio()),
  library: () => import('../components/LibraryPage.js').then(m => m.LibraryPage()),
  character: () => import('../components/CharacterStudio.js').then(m => m.CharacterStudio()),
  influencer: () => import('../components/InfluencerStudio.js').then(m => m.InfluencerStudio()),
  commercial: () => import('../components/CommercialStudio.js').then(m => m.CommercialStudio()),
  explore: () => import('../components/ExplorePage.js').then(m => m.ExplorePage()),
  assist: () => import('../components/AssistPage.js').then(m => m.AssistPage()),
  community: () => import('../components/CommunityPage.js').then(m => m.CommunityPage()),
  storyboard: () => import('../components/StoryboardStudio.js').then(m => m.StoryboardStudio()),
};
```

### 2.2 Adding New Routes

To add a new route (e.g., for Audio Studio):

```javascript
// File: src/lib/router.js

// Step 1: Add to ROUTE_MAP
const ROUTE_MAP = {
  // ... existing routes
  'Audio': 'audio',  // NEW ROUTE
};

// Step 2: Add to pageLoaders
const pageLoaders = {
  // ... existing loaders
  audio: () => import('../components/AudioStudio.js').then(m => m.AudioStudio()),
};
```

### 2.3 Navigation Function

```javascript
// File: src/lib/router.js (Lines 50-93)

export async function navigate(page, params = {}) {
  if (!contentArea) return;
  currentPage = page;

  // Show loading spinner
  contentArea.innerHTML = '';
  const loading = document.createElement('div');
  loading.className = 'w-full h-full flex items-center justify-center';
  loading.innerHTML = '<div class="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>';
  contentArea.appendChild(loading);

  try {
    let element;

    // Handle template routes
    if (page.startsWith('template/')) {
      const templateId = page.replace('template/', '');
      const mod = await import('../components/TemplateStudio.js');
      element = mod.TemplateStudio(templateId);
    } 
    // Handle dynamic routes
    else if (pageLoaders[page]) {
      element = await pageLoaders[page]();
    } 
    // Fallback for unknown routes
    else {
      const mod = await import('../components/PlaceholderPage.js');
      element = mod.PlaceholderPage(page);
    }

    if (currentPage !== page) return;

    contentArea.innerHTML = '';
    contentArea.appendChild(element);
  } catch (err) {
    console.error(`[Router] Failed to load page: ${page}`, err);
    contentArea.innerHTML = '';
    const errEl = document.createElement('div');
    errEl.className = 'w-full h-full flex items-center justify-center text-red-400 text-sm';
    errEl.textContent = `Failed to load ${page}: ${err.message}`;
    contentArea.appendChild(errEl);
  }

  if (onNavigateCallback) onNavigateCallback(page);
}
```

---

## 3. Sidebar Navigation

### 3.1 Current Navigation Structure

```javascript
// File: src/components/Sidebar.js (Lines 1-92)

export function Sidebar(navigate) {
  const element = document.createElement('aside');
  element.className = 'hidden md:flex flex-col items-center py-4 z-40 border-r border-white/5 bg-panel-bg';
  element.style.width = '68px';

  // Main navigation items
  const navItems = [
    { id: 'apps', icon: '<svg>...</svg>', label: 'Apps' },
    { id: 'image', icon: '<svg>...</svg>', label: 'Image' },
    { id: 'video', icon: '<svg>...</svg>', label: 'Video' },
    { id: 'cinema', icon: '<svg>...</svg>', label: 'Cinema' },
    { id: 'character', icon: '<svg>...</svg>', label: 'Character' },
    { id: 'influencer', icon: '<svg>...</svg>', label: 'Influencer' },
    { id: 'storyboard', icon: '<svg>...</svg>', label: 'Storyboard' },
    { id: 'effects', icon: '<svg>...</svg>', label: 'Effects' },
    { id: 'edit', icon: '<svg>...</svg>', label: 'Edit' },
    { id: 'upscale', icon: '<svg>...</svg>', label: 'Upscale' },
    { id: 'commercial', icon: '<svg>...</svg>', label: 'Commercial' },
    { id: 'templates', icon: '<svg>...</svg>', label: 'Templates' },
    { id: 'explore', icon: '<svg>...</svg>', label: 'Explore' },
    { id: 'library', icon: '<svg>...</svg>', label: 'Library' },
    { id: 'community', icon: '<svg>...</svg>', label: 'Community' },
    { id: 'assist', icon: '<svg>...</svg>', label: 'Assist' },
  ];

  // Bottom items (settings, etc.)
  const bottomItems = [
    { id: 'settings', icon: '<svg>...</svg>', label: 'Settings' },
  ];

  // Create navigation button
  const createButton = (item) => {
    const container = document.createElement('div');
    container.className = 'flex flex-col items-center gap-0.5 mb-1 cursor-pointer group w-full px-2';

    const iconBtn = document.createElement('button');
    iconBtn.innerHTML = item.icon;
    iconBtn.className = 'w-10 h-10 rounded-xl flex items-center justify-center transition-all bg-transparent text-secondary group-hover:bg-white/5 group-hover:text-white';

    const label = document.createElement('span');
    label.textContent = item.label;
    label.className = 'text-[9px] font-bold uppercase tracking-wider text-secondary group-hover:text-white transition-colors';

    // Active state for image
    if (item.id === 'image') {
      iconBtn.style.color = 'var(--color-primary)';
      iconBtn.classList.add('bg-primary/10');
      label.style.color = 'var(--color-primary)';
    }

    container.onclick = () => {
      if (item.id === 'settings') {
        const event = new CustomEvent('navigate', { detail: { page: 'settings' } });
        window.dispatchEvent(event);
        return;
      }
      navigate(item.id);
    };

    container.appendChild(iconBtn);
    container.appendChild(label);
    return container;
  };
}
```

### 3.2 Adding New Navigation Items

To add new navigation items (e.g., Audio, Avatar, Chat, Training):

```javascript
// File: src/components/Sidebar.js

// Add to navItems array
const navItems = [
  // ... existing items
  { id: 'audio', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>', label: 'Audio' },
  { id: 'avatar', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>', label: 'Avatar' },
  { id: 'chat', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>', label: 'Chat' },
  { id: 'training', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 004.6 15"/></svg>', label: 'Train' },
];
```

---

## 4. Studio Component Integration Patterns

### 4.1 UpscaleStudio Pattern (Method-Based)

The `UpscaleStudio.js` demonstrates a method-based approach where multiple models are available within a single studio:

```javascript
// File: src/components/UpscaleStudio.js (Lines 1-60)

import { muapi } from '../lib/muapi.js';
import { AuthModal } from './AuthModal.js';
import { createUploadPicker } from './UploadPicker.js';
import { createInlineInstructions } from './InlineInstructions.js';
import { createHeroSection } from '../lib/thumbnails.js';

// Method definitions
const UPSCALE_METHODS = [
  { id: 'ai-image-upscaler', name: 'AI Upscaler', description: 'General-purpose AI upscaling with 2x/4x factor', factors: ['2', '4'] },
  { id: 'topaz-image-upscale', name: 'Topaz Upscale', description: 'Premium Topaz-quality enhancement', factors: [] },
  { id: 'seedvr2-image-upscale', name: 'Seed Upscale', description: 'SeedVR2 high-fidelity upscaling', factors: [] },
];

export function UpscaleStudio() {
  const container = document.createElement('div');
  container.className = 'w-full h-full flex flex-col items-center bg-app-bg overflow-y-auto p-6 md:p-10 relative';

  // State
  let selectedMethod = UPSCALE_METHODS[0];
  let selectedFactor = '2';
  let uploadedUrl = null;

  // Hero Section
  const header = document.createElement('div');
  header.className = 'mb-8 animate-fade-in-up text-center w-full max-w-xl';
  const upscaleBanner = createHeroSection('upscale', 'h-36 md:h-48 mb-4');
  if (upscaleBanner) {
    const bannerText = document.createElement('div');
    bannerText.className = 'absolute bottom-0 left-0 right-0 p-5 z-10';
    bannerText.innerHTML = '<h1 class="text-2xl md:text-4xl font-black text-white tracking-tight mb-2">Upscale Suite</h1><p class="text-white/60 text-sm">Enhance and upscale images with 3 AI methods</p>';
    upscaleBanner.appendChild(bannerText);
    header.appendChild(upscaleBanner);
  }
  container.appendChild(header);

  // Method Selection Buttons
  const methodRow = document.createElement('div');
  methodRow.className = 'flex gap-3 mb-6 flex-wrap justify-center animate-fade-in-up';

  const methodBtns = {};
  UPSCALE_METHODS.forEach(m => {
    const btn = document.createElement('button');
    btn.className = 'px-5 py-3 rounded-xl text-sm font-bold transition-all border';
    btn.textContent = m.name;
    btn.onclick = () => {
      selectedMethod = m;
      selectedFactor = m.factors[0] || '';
      updateMethodBtns();
      updateFactorBtns();
    };
    methodBtns[m.id] = btn;
    methodRow.appendChild(btn);
  });
  container.appendChild(methodRow);

  // Factor Selection (for models that support it)
  const factorRow = document.createElement('div');
  factorRow.className = 'flex gap-2 mb-6 justify-center';
  container.appendChild(factorRow);

  // Form Card
  const formCard = document.createElement('div');
  formCard.className = 'w-full max-w-md bg-[#111]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col gap-5 animate-fade-in-up';

  // Upload Picker
  const uploadRow = document.createElement('div');
  uploadRow.className = 'flex items-center gap-4';
  const picker = createUploadPicker({
    anchorContainer: container,
    onSelect: ({ url }) => { uploadedUrl = url; },
    onClear: () => { uploadedUrl = null; },
  });
  uploadRow.appendChild(picker.trigger);
  const hint = document.createElement('span');
  hint.className = 'text-sm text-muted';
  hint.textContent = 'Upload image to upscale';
  uploadRow.appendChild(hint);
  formCard.appendChild(uploadRow);
  container.appendChild(picker.panel);

  // Generate Button
  const genBtn = document.createElement('button');
  genBtn.className = 'w-full bg-primary text-black py-3.5 rounded-xl font-black text-sm hover:shadow-glow transition-all';
  genBtn.textContent = 'Upscale Image';
  formCard.appendChild(genBtn);
  container.appendChild(formCard);

  // Update button styles based on selection
  function updateMethodBtns() {
    Object.entries(methodBtns).forEach(([id, btn]) => {
      if (id === selectedMethod.id) {
        btn.className = 'px-5 py-3 rounded-xl text-sm font-bold transition-all border bg-primary text-black border-primary';
      } else {
        btn.className = 'px-5 py-3 rounded-xl text-sm font-bold transition-all border bg-white/5 text-secondary border-white/10 hover:bg-white/10';
      }
    });
  }

  function updateFactorBtns() {
    factorRow.innerHTML = '';
    if (selectedMethod.factors.length === 0) return;
    selectedMethod.factors.forEach(f => {
      const btn = document.createElement('button');
      btn.className = f === selectedFactor
        ? 'px-4 py-2 rounded-lg text-xs font-bold bg-primary text-black'
        : 'px-4 py-2 rounded-lg text-xs font-bold bg-white/5 text-secondary hover:bg-white/10';
      btn.textContent = `${f}x`;
      btn.onclick = () => { selectedFactor = f; updateFactorBtns(); };
      factorRow.appendChild(btn);
    });
  }

  // Generation Handler
  genBtn.onclick = async () => {
    if (!uploadedUrl) { alert('Upload an image first'); return; }
    const apiKey = localStorage.getItem('muapi_key');
    if (!apiKey) { AuthModal(() => genBtn.click()); return; }

    genBtn.disabled = true;
    genBtn.innerHTML = '<span class="animate-spin inline-block mr-2">&#9711;</span> Upscaling...';

    try {
      const params = { model: selectedMethod.id, image_url: uploadedUrl };
      if (selectedFactor) params.upscale_factor = parseInt(selectedFactor);
      const result = await muapi.generateI2I(params);
      if (result?.url) {
        // Display result
        resultArea.classList.remove('hidden');
        resultArea.innerHTML = `
          <div class="bg-[#111]/80 border border-white/10 rounded-2xl p-4">
            <img src="${result.url}" class="w-full rounded-xl mb-3">
            <a href="${result.url}" download class="block w-full bg-primary text-black py-2.5 rounded-xl font-bold text-sm text-center hover:shadow-glow transition-all">Download</a>
          </div>
        `;
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      genBtn.disabled = false;
      genBtn.textContent = 'Upscale Image';
    }
  };

  updateMethodBtns();
  updateFactorBtns();
  return container;
}
```

### 4.2 ImageStudio Pattern (Model-Based)

The `ImageStudio.js` demonstrates a model-based approach with dynamic model selection:

```javascript
// File: src/components/ImageStudio.js (Lines 1-80)

import { muapi } from '../lib/muapi.js';
import {
    t2iModels, getAspectRatiosForModel, getResolutionsForModel, getQualityFieldForModel,
    i2iModels, getAspectRatiosForI2IModel, getResolutionsForI2IModel, getQualityFieldForI2IModel,
    getMaxImagesForI2IModel
} from '../lib/models.js';
import { AuthModal } from './AuthModal.js';
import { createUploadPicker } from './UploadPicker.js';
import { createInlineInstructions } from './InlineInstructions.js';
import { createHeroSection } from '../lib/thumbnails.js';

export function ImageStudio() {
    const container = document.createElement('div');
    container.className = 'w-full h-full flex flex-col items-center justify-center bg-app-bg relative p-4 md:p-6 overflow-y-auto custom-scrollbar overflow-x-hidden';

    // State
    const defaultModel = t2iModels[0];
    let selectedModel = defaultModel.id;
    let selectedModelName = defaultModel.name;
    let selectedAr = defaultModel.inputs?.aspect_ratio?.default || '1:1';
    let dropdownOpen = null;
    let uploadedImageUrls = [];
    let imageMode = false; // false = t2i models, true = i2i models

    // Model accessors
    const getCurrentModels = () => imageMode ? i2iModels : t2iModels;
    const getCurrentAspectRatios = (id) => imageMode ? getAspectRatiosForI2IModel(id) : getAspectRatiosForModel(id);
    const getCurrentResolutions = (id) => imageMode ? getResolutionsForI2IModel(id) : getResolutionsForModel(id);
    const getCurrentQualityField = (id) => imageMode ? getQualityFieldForI2IModel(id) : getQualityFieldForModel(id);

    // Hero Section
    const hero = document.createElement('div');
    hero.className = 'flex flex-col items-center mb-10 md:mb-20 animate-fade-in-up transition-all duration-700 w-full max-w-4xl';
    const heroBanner = createHeroSection('image', 'h-40 md:h-56 mb-6');
    if (heroBanner) {
        const heroContent = document.createElement('div');
        heroContent.className = 'absolute bottom-0 left-0 right-0 p-6 z-10';
        heroContent.innerHTML = `
            <h1 class="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-1">Image Studio</h1>
            <p class="text-white/60 text-sm font-medium">Transform images with AI — upscale, stylize, animate and more</p>
        `;
        heroBanner.appendChild(heroContent);
        hero.appendChild(heroBanner);
    }
    container.appendChild(hero);
}
```

---

## 5. Model-Specific Implementation Requirements

### 5.1 MuAPI Client Methods

The `muapi.js` provides the following methods for interacting with different model types:

```javascript
// File: src/lib/muapi.js (Lines 1-450)

import { getModelById, getVideoModelById, getI2IModelById, getI2VModelById, getV2VModelById } from './models.js';

export class MuapiClient {
    constructor() {
        // Base URL configuration
        this.baseUrl = import.meta.env.DEV ? '' : 'https://api.muapi.ai';
    }

    getKey() {
        const key = localStorage.getItem('muapi_key');
        if (!key) throw new Error('API Key missing. Please set it in Settings.');
        return key;
    }

    // Text-to-Image and Image-to-Image generation
    async generateImage(params) {
        const key = this.getKey();
        const modelInfo = getModelById(params.model);
        const endpoint = modelInfo?.endpoint || params.model;
        const url = `${this.baseUrl}/api/v1/${endpoint}`;

        const finalPayload = { prompt: params.prompt };
        
        if (params.aspect_ratio) finalPayload.aspect_ratio = params.aspect_ratio;
        if (params.resolution) finalPayload.resolution = params.resolution;
        if (params.quality) finalPayload.quality = params.quality;
        
        // Image-to-Image
        if (params.image_url) {
            finalPayload.image_url = params.image_url;
            finalPayload.strength = params.strength || 0.6;
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': key
            },
            body: JSON.stringify(finalPayload)
        });

        const submitData = await response.json();
        const requestId = submitData.request_id || submitData.id;
        if (!requestId) return submitData;

        const result = await this.pollForResult(requestId, key);
        const imageUrl = result.outputs?.[0] || result.url || result.output?.url;
        return { ...result, url: imageUrl };
    }

    // Text-to-Video generation
    async generateVideo(params) {
        const key = this.getKey();
        const modelInfo = getVideoModelById(params.model);
        const endpoint = modelInfo?.endpoint || params.model;
        const url = `${this.baseUrl}/api/v1/${endpoint}`;

        const finalPayload = {};
        if (params.prompt) finalPayload.prompt = params.prompt;
        if (params.request_id) finalPayload.request_id = params.request_id;
        if (params.aspect_ratio) finalPayload.aspect_ratio = params.aspect_ratio;
        if (params.duration) finalPayload.duration = params.duration;
        if (params.resolution) finalPayload.resolution = params.resolution;
        if (params.quality) finalPayload.quality = params.quality;
        if (params.image_url) finalPayload.image_url = params.image_url;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-api-key': key },
            body: JSON.stringify(finalPayload)
        });

        const submitData = await response.json();
        const requestId = submitData.request_id || submitData.id;
        if (!requestId) return submitData;

        const result = await this.pollForResult(requestId, key, 120, 2000);
        const videoUrl = result.outputs?.[0] || result.url || result.output?.url;
        return { ...result, url: videoUrl };
    }

    // Image-to-Image generation
    async generateI2I(params) {
        const key = this.getKey();
        const modelInfo = getI2IModelById(params.model);
        const endpoint = modelInfo?.endpoint || params.model;
        const url = `${this.baseUrl}/api/v1/${endpoint}`;

        const finalPayload = {};
        if (params.prompt) finalPayload.prompt = params.prompt;

        const imageField = modelInfo?.imageField || 'image_url';
        if (params.image_url) {
            finalPayload[imageField] = params.image_url;
        }

        if (params.aspect_ratio) finalPayload.aspect_ratio = params.aspect_ratio;
        if (params.resolution) finalPayload.resolution = params.resolution;
        if (params.quality) finalPayload.quality = params.quality;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-api-key': key },
            body: JSON.stringify(finalPayload)
        });

        const submitData = await response.json();
        const requestId = submitData.request_id || submitData.id;
        if (!requestId) return submitData;

        const result = await this.pollForResult(requestId, key);
        const imageUrl = result.outputs?.[0] || result.url || result.output?.url;
        return { ...result, url: imageUrl };
    }

    // Image-to-Video generation
    async generateI2V(params) {
        const key = this.getKey();
        const modelInfo = getI2VModelById(params.model);
        const endpoint = modelInfo?.endpoint || params.model;
        const url = `${this.baseUrl}/api/v1/${endpoint}`;

        const finalPayload = {};
        if (params.prompt) finalPayload.prompt = params.prompt;

        const imageField = modelInfo?.imageField || 'image_url';
        if (params.image_url) {
            finalPayload[imageField] = params.image_url;
        }

        if (params.aspect_ratio) finalPayload.aspect_ratio = params.aspect_ratio;
        if (params.duration) finalPayload.duration = params.duration;
        if (params.resolution) finalPayload.resolution = params.resolution;
        if (params.quality) finalPayload.quality = params.quality;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-api-key': key },
            body: JSON.stringify(finalPayload)
        });

        const submitData = await response.json();
        const requestId = submitData.request_id || submitData.id;
        if (!requestId) return submitData;

        const result = await this.pollForResult(requestId, key, 120, 2000);
        const videoUrl = result.outputs?.[0] || result.url || result.output?.url;
        return { ...result, url: videoUrl };
    }

    // File upload
    async uploadFile(file) {
        const key = this.getKey();
        const url = `${this.baseUrl}/api/v1/upload_file`;

        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'x-api-key': key },
            body: formData
        });

        const data = await response.json();
        const fileUrl = data.url || data.file_url || data.data?.url;
        if (!fileUrl) throw new Error('No URL returned from file upload');
        return fileUrl;
    }

    // Video-to-Video processing
    async processV2V(params) {
        const key = this.getKey();
        const modelInfo = getV2VModelById(params.model);
        const endpoint = modelInfo?.endpoint || params.model;
        const url = `${this.baseUrl}/api/v1/${endpoint}`;

        const videoField = modelInfo?.videoField || 'video_url';
        const finalPayload = { [videoField]: params.video_url };

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-api-key': key },
            body: JSON.stringify(finalPayload)
        });

        const submitData = await response.json();
        const requestId = submitData.request_id || submitData.id;
        if (!requestId) return submitData;

        const result = await this.pollForResult(requestId, key, 120, 2000);
        const videoUrl = result.outputs?.[0] || result.url || result.output?.url;
        return { ...result, url: videoUrl };
    }

    // Polling for async results
    async pollForResult(requestId, key, maxAttempts = 60, interval = 2000) {
        const pollUrl = `${this.baseUrl}/api/v1/predictions/${requestId}/result`;

        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            await new Promise(resolve => setTimeout(resolve, interval));

            const response = await fetch(pollUrl, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'x-api-key': key }
            });

            const data = await response.json();
            const status = data.status?.toLowerCase();

            if (status === 'completed' || status === 'succeeded' || status === 'success') {
                return data;
            }

            if (status === 'failed' || status === 'error') {
                throw new Error(`Generation failed: ${data.error || 'Unknown error'}`);
            }
        }

        throw new Error('Generation timed out after polling.');
    }

    getDimensionsFromAR(ar) {
        switch (ar) {
            case '1:1': return [1024, 1024];
            case '16:9': return [1280, 720];
            case '9:16': return [720, 1280];
            case '4:3': return [1152, 864];
            case '3:2': return [1216, 832];
            case '21:9': return [1536, 640];
            default: return [1024, 1024];
        }
    }
}

export const muapi = new MuapiClient();
```

### 5.2 API Endpoints and Parameters

The app uses the MuAPI endpoint structure:

```
Base URL: https://api.muapi.ai/api/v1/{endpoint}
Headers:  x-api-key: {API_KEY}
```

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/{model_endpoint}` | POST | Submit generation task |
| `/api/v1/predictions/{id}/result` | GET | Poll for results |
| `/api/v1/upload_file` | POST | Upload media files |

### 5.3 Adding New API Methods

For new model categories (Audio, Avatar, etc.), add new methods to `muapi.js`:

```javascript
// Example: Adding Text-to-Audio support

async generateAudio(params) {
    const key = this.getKey();
    const modelInfo = getAudioModelById(params.model);
    const endpoint = modelInfo?.endpoint || params.model;
    const url = `${this.baseUrl}/api/v1/${endpoint}`;

    const finalPayload = {};
    
    // Text input (for TTS/Music generation)
    if (params.text) finalPayload.text = params.text;
    if (params.prompt) finalPayload.prompt = params.prompt;
    
    // Audio reference (for voice cloning)
    if (params.audio_url) finalPayload.audio_url = params.audio_url;
    
    // Style/genre
    if (params.style) finalPayload.style = params.style;
    if (params.duration) finalPayload.duration = params.duration;
    
    // Voice selection
    if (params.voice) finalPayload.voice = params.voice;

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': key },
        body: JSON.stringify(finalPayload)
    });

    const submitData = await response.json();
    const requestId = submitData.request_id || submitData.id;
    if (!requestId) return submitData;

    const result = await this.pollForResult(requestId, key, 180, 3000);
    const audioUrl = result.outputs?.[0] || result.url || result.output?.url;
    return { ...result, url: audioUrl };
}
```

---

## 6. UI Component Integration

### 6.1 Creating a Hero Section

The `thumbnails.js` provides hero section creation:

```javascript
// File: src/lib/thumbnails.js

export function createHeroSection(type, classes = '') {
    const container = document.createElement('div');
    container.className = `relative w-full ${classes} rounded-2xl overflow-hidden bg-gradient-to-br from-[#1a1a2e] to-[#16213e]`;
    
    const img = document.createElement('img');
    img.src = `/thumbnails/${type}.webp`;
    img.alt = type;
    img.className = 'w-full h-full object-cover absolute inset-0';
    img.loading = 'lazy';
    img.decoding = 'async';
    
    container.appendChild(img);
    return container;
}
```

### 6.2 Upload Picker Component

```javascript
// File: src/components/UploadPicker.js (Pattern)

export function createUploadPicker({ anchorContainer, onSelect, onClear, accept = 'image/*', maxFiles = 1 }) {
    // Creates a file upload trigger and panel
    // Returns { trigger: HTMLElement, panel: HTMLElement }
    // Calls onSelect({ url, urls }) when files are uploaded
    // Calls onClear() when files are cleared
}
```

### 6.3 Inline Instructions Component

```javascript
// File: src/components/InlineInstructions.js (Pattern)

export function createInlineInstructions(type) {
    // Returns instruction elements for specific features
    // Used to show tips and guidance
}
```

### 6.4 Adding New Models to ImageStudio

To add new T2I models (like `flux-krea-dev`, `ai-anime-generator`, `hunyuan-image-2.1`):

```javascript
// In src/lib/models.js, add to t2iModels array:

{
  "id": "flux-krea-dev",
  "name": "Flux Krea Dev",
  "inputs": {
    "prompt": {
      "type": "string",
      "title": "Prompt",
      "name": "prompt",
      "description": "Text prompt describing the image..."
    },
    "width": {
      "type": "int",
      "title": "Width",
      "name": "width",
      "default": 1024,
      "minValue": 256,
      "maxValue": 2048,
      "step": 64
    },
    "height": {
      "type": "int",
      "title": "Height", 
      "name": "height",
      "default": 1024,
      "minValue": 256,
      "maxValue": 2048,
      "step": 64
    }
  }
}
```

---

## 7. Type Definitions

### 7.1 Model Interface

```typescript
interface ModelDefinition {
  id: string;
  name: string;
  endpoint: string;
  family?: string;
  inputs: Record<string, InputParameter>;
  imageField?: string;    // Custom field for image input
  videoField?: string;    // Custom field for video input
}

interface InputParameter {
  type: 'string' | 'int' | 'number' | 'boolean' | 'array' | 'object';
  title: string;
  name: string;
  description: string;
  default?: any;
  enum?: string[];
  minValue?: number;
  maxValue?: number;
  step?: number;
  examples?: string[];
  items?: object;
  maxItems?: number;
}
```

### 7.2 API Request/Response Types

```typescript
interface GenerationParams {
  model: string;
  prompt?: string;
  negative_prompt?: string;
  aspect_ratio?: string;
  resolution?: string;
  quality?: string;
  image_url?: string;
  video_url?: string;
  audio_url?: string;
  text?: string;
  strength?: number;
  seed?: number;
  duration?: number;
  [key: string]: any;
}

interface GenerationResult {
  request_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  outputs?: string[];
  url?: string;
  output?: {
    url?: string;
  };
  error?: string;
}
```

### 7.3 Studio Component State

```typescript
interface StudioState {
  selectedModel: string;
  selectedMethod?: string;
  prompt: string;
  negativePrompt?: string;
  aspectRatio?: string;
  resolution?: string;
  quality?: string;
  uploadedFiles: string[];
  isGenerating: boolean;
  result?: GenerationResult;
}
```

---

## 8. Error Handling and Loading States

### 8.1 Loading State Implementation

```javascript
// Button loading state
genBtn.disabled = true;
genBtn.innerHTML = '<span class="animate-spin inline-block mr-2">&#9711;</span> Processing...';

// Container loading state
const loading = document.createElement('div');
loading.className = 'w-full h-full flex items-center justify-center';
loading.innerHTML = '<div class="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>';
contentArea.appendChild(loading);
```

### 8.2 Error Handling Patterns

```javascript
// Try-catch with user-friendly error messages
try {
  const result = await muapi.generateImage(params);
  if (result?.url) {
    // Display result
    displayResult(result.url);
  }
} catch (err) {
  console.error('[Muapi] Error:', err);
  
  // Handle specific error types
  if (err.message.includes('API Key missing')) {
    // Show auth modal
    AuthModal(() => retryGeneration());
  } else if (err.message.includes('timed out')) {
    // Show timeout message with retry option
    alert('Generation timed out. Please try again.');
  } else if (err.message.includes('Failed')) {
    // Show failure message
    alert(`Generation failed: ${err.message}`);
  } else {
    // Generic error
    alert(`Error: ${err.message}`);
  }
} finally {
  // Reset button state
  genBtn.disabled = false;
  genBtn.textContent = 'Generate';
}
```

### 8.3 Model-Specific Error Handling

```javascript
// For video generation (longer processing time)
const result = await muapi.generateVideo(params, {
  maxAttempts: 120,  // 4 minutes max
  interval: 2000     // Poll every 2 seconds
});

// For audio generation (may have different error codes)
const result = await muapi.generateAudio(params, {
  maxAttempts: 180,  // 6 minutes max for audio
  interval: 3000     // Poll every 3 seconds
});
```

---

## 9. Testing Requirements

### 9.1 Model Registration Testing

```javascript
// Test that model is properly registered
import { t2iModels, getModelById } from '../lib/models.js';

function testModelRegistration() {
  // Test model exists in array
  const model = t2iModels.find(m => m.id === 'flux-krea-dev');
  console.assert(model !== undefined, 'Model should exist in t2iModels');
  
  // Test model has required fields
  console.assert(model.id === 'flux-krea-dev');
  console.assert(model.name === 'Flux Krea Dev');
  console.assert(model.endpoint === 'flux-krea-dev');
  console.assert(model.inputs.prompt !== undefined);
  
  // Test helper function
  const foundModel = getModelById('flux-krea-dev');
  console.assert(foundModel.id === 'flux-krea-dev');
}
```

### 9.2 API Integration Testing

```javascript
// Test MuAPI client integration
import { muapi } from '../lib/muapi.js';

async function testImageGeneration() {
  // Set test API key
  localStorage.setItem('muapi_key', 'test-key');
  
  try {
    const result = await muapi.generateImage({
      model: 'flux-krea-dev',
      prompt: 'A test image',
      width: 1024,
      height: 1024
    });
    
    console.assert(result.url !== undefined, 'Should return URL');
    console.assert(result.request_id !== undefined, 'Should have request ID');
  } catch (err) {
    console.error('Generation failed:', err.message);
  }
}
```

### 9.3 UI Integration Testing

```javascript
// Test studio component renders correctly
function testStudioRenders() {
  // Import studio component
  import('../components/ImageStudio.js').then(module => {
    const studio = module.ImageStudio();
    
    // Check required elements exist
    const hero = studio.querySelector('h1');
    console.assert(hero !== null, 'Should have hero title');
    
    const generateBtn = studio.querySelector('button');
    console.assert(generateBtn !== null, 'Should have generate button');
  });
}
```

### 9.4 Validation Checklist

- [ ] Model registered in correct model array
- [ ] Model has unique ID
- [ ] Model has valid endpoint
- [ ] All input parameters defined with types
- [ ] Default values set for required parameters
- [ ] Helper functions work correctly
- [ ] API call succeeds with valid parameters
- [ ] Error handling catches failures
- [ ] Loading states display during generation
- [ ] Results display correctly after completion
- [ ] UI component integrates with router
- [ ] Sidebar navigation works

---

## 10. Configuration Examples

### 10.1 Image Generation Models

#### flux-krea-dev

```javascript
// File: src/lib/models.js
{
  "id": "flux-krea-dev",
  "name": "Flux Krea Dev",
  "family": "flux",
  "endpoint": "flux-krea-dev",
  "inputs": {
    "prompt": {
      "type": "string",
      "title": "Prompt",
      "name": "prompt",
      "description": "Text prompt describing the image. The length of the prompt must be between 2 and 3000 characters.",
      "examples": ["A futuristic studio bathed in radiant beams of shifting neon colors..."]
    },
    "width": {
      "type": "int",
      "title": "Width",
      "name": "width",
      "default": 1024,
      "minValue": 256,
      "maxValue": 2048,
      "step": 64
    },
    "height": {
      "type": "int", 
      "title": "Height",
      "name": "height",
      "default": 1024,
      "minValue": 256,
      "maxValue": 2048,
      "step": 64
    },
    "num_images": {
      "type": "int",
      "title": "Number of images",
      "name": "num_images",
      "default": 1,
      "minValue": 1,
      "maxValue": 4
    }
  }
}
```

#### ai-anime-generator

```javascript
// File: src/lib/models.js
{
  "id": "ai-anime-generator",
  "name": "Ai Anime Generator",
  "family": "anime",
  "endpoint": "ai-anime-generator",
  "inputs": {
    "prompt": {
      "type": "string",
      "title": "Prompt",
      "name": "prompt",
      "description": "Text prompt describing the anime-style image.",
      "examples": ["A cheerful anime girl with short pink hair and green eyes..."]
    },
    "aspect_ratio": {
      "type": "string",
      "title": "Aspect Ratio",
      "name": "aspect_ratio",
      "enum": ["1:1", "9:16", "16:9", "4:3", "3:4"],
      "default": "9:16"
    }
  }
}
```

#### hunyuan-image-2.1

```javascript
// File: src/lib/models.js
{
  "id": "hunyuan-image-2.1",
  "name": "Hunyuan Image 2.1",
  "family": "hunyuan",
  "endpoint": "hunyuan-image-2.1",
  "inputs": {
    "prompt": {
      "type": "string",
      "title": "Prompt",
      "name": "prompt",
      "description": "Text prompt describing the image."
    },
    "width": {
      "type": "int",
      "title": "Width",
      "name": "width",
      "default": 1024,
      "minValue": 256,
      "maxValue": 2048
    },
    "height": {
      "type": "int",
      "title": "Height", 
      "name": "height",
      "default": 1024,
      "minValue": 256,
      "maxValue": 2048
    }
  }
}
```

### 10.2 Video Generation Models

#### heygen-video-translate

```javascript
// File: src/lib/models.js
// Add to videoModels array
{
  "id": "heygen-video-translate",
  "name": "HeyGen Video Translate",
  "family": "heygen",
  "endpoint": "heygen-video-translate",
  "inputs": {
    "video_url": {
      "type": "string",
      "title": "Video URL",
      "name": "video_url",
      "description": "URL of the video to translate"
    },
    "target_language": {
      "type": "string",
      "title": "Target Language",
      "name": "target_language",
      "enum": ["English", "Spanish", "French", "German", "Chinese", "Japanese", "Korean", "Portuguese", "Italian", "Russian"],
      "description": "Language to translate to"
    },
    "voice": {
      "type": "string",
      "title": "Voice",
      "name": "voice",
      "description": "Voice ID for the translated audio"
    }
  }
}
```

#### luma-modify-video

```javascript
// File: src/lib/models.js
{
  "id": "luma-modify-video",
  "name": "Luma Modify Video",
  "family": "luma",
  "endpoint": "luma-modify-video",
  "inputs": {
    "video_url": {
      "type": "string",
      "title": "Video URL",
      "name": "video_url"
    },
    "prompt": {
      "type": "string",
      "title": "Modification Prompt",
      "name": "prompt",
      "description": "Describe how to transform the video"
    }
  }
}
```

### 10.3 Audio/Video Processing Models

#### suno-create-music

```javascript
// File: src/lib/models.js
// Add new audioModels array
export const audioModels = [
  {
    "id": "suno-create-music",
    "name": "Suno Create Music",
    "family": "suno",
    "endpoint": "suno-create-music",
    "inputs": {
      "prompt": {
        "type": "string",
        "title": "Prompt",
        "name": "prompt",
        "description": "Describe the music you want to create",
        "examples": ["Upbeat electronic dance track with driving basslines and euphoric synths"]
      },
      "style": {
        "type": "string",
        "title": "Style",
        "name": "style",
        "enum": ["pop", "rock", "jazz", "classical", "electronic", "hip-hop", "ambient", "custom"]
      },
      "duration": {
        "type": "int",
        "title": "Duration (seconds)",
        "name": "duration",
        "enum": [15, 30, 60, 90, 120],
        "default": 30
      },
      "instrumental": {
        "type": "boolean",
        "title": "Instrumental Only",
        "name": "instrumental",
        "default": false
      }
    }
  }
];

// Add helper function
export function getAudioModelById(id) {
  return audioModels.find(m => m.id === id);
}
```

#### minimax-speech-2.6-turbo

```javascript
// File: src/lib/models.js
// Add to audioModels
{
  "id": "minimax-speech-2.6-turbo",
  "name": "Minimax Speech Turbo",
  "family": "minimax",
  "endpoint": "minimax-speech-2.6-turbo",
  "inputs": {
    "text": {
      "type": "string",
      "title": "Text",
      "name": "text",
      "description": "The text to convert to speech"
    },
    "voice": {
      "type": "string",
      "title": "Voice",
      "name": "voice",
      "description": "Voice selection",
      "enum": ["female-1", "female-2", "male-1", "male-2", "narrator", "custom"]
    },
    "speed": {
      "type": "number",
      "title": "Speed",
      "name": "speed",
      "default": 1.0,
      "minValue": 0.5,
      "maxValue": 2.0
    }
  }
}
```

### 10.4 Training Models

#### sdxl-lora

```javascript
// File: src/lib/models.js
// Add new trainingModels array
export const trainingModels = [
  {
    "id": "sdxl-lora",
    "name": "SDXL LoRA Training",
    "family": "sdxl",
    "endpoint": "sdxl-lora",
    "isTraining": true,
    "inputs": {
      "images": {
        "type": "array",
        "title": "Training Images",
        "name": "images",
        "description": "Upload 5-20 reference images",
        "items": { "type": "string", "format": "url" },
        "minItems": 5,
        "maxItems": 20
      },
      "lora_name": {
        "type": "string",
        "title": "LoRA Name",
        "name": "lora_name",
        "description": "Name for your trained LoRA"
      },
      "trigger_word": {
        "type": "string",
        "title": "Trigger Word",
        "name": "trigger_word",
        "description": "Word to activate the LoRA"
      },
      "training_steps": {
        "type": "int",
        "title": "Training Steps",
        "name": "training_steps",
        "default": 1000,
        "enum": [500, 1000, 1500, 2000]
      },
      "rank": {
        "type": "int",
        "title": "Rank",
        "name": "rank",
        "default": 16,
        "enum": [8, 16, 32, 64]
      },
      "style": {
        "type": "string",
        "title": "Style",
        "name": "style",
        "enum": ["character", "object", "fashion", "art_style"]
      }
    }
  }
];
```

### 10.5 Video Tools Models

#### ai-clipping

```javascript
// File: src/lib/models.js
{
  "id": "ai-clipping",
  "name": "AI Video Clipping",
  "family": "tools",
  "endpoint": "ai-clipping",
  "inputs": {
    "video_url": {
      "type": "string",
      "title": "Video URL",
      "name": "video_url"
    },
    "max_clips": {
      "type": "int",
      "title": "Max Clips",
      "name": "max_clips",
      "default": 5,
      "enum": [3, 5, 10, 20]
    },
    "style": {
      "type": "string",
      "title": "Style",
      "name": "style",
      "enum": ["viral", "educational", "entertainment", "auto"]
    },
    "language": {
      "type": "string",
      "title": "Language",
      "name": "language",
      "enum": ["auto", "english", "spanish", "french", "german", "chinese", "japanese"]
    }
  }
}
```

#### seedance-2.0-watermark-remover

```javascript
// File: src/lib/models.js
{
  "id": "seedance-2.0-watermark-remover",
  "name": "Seedance Watermark Remover",
  "family": "seedance",
  "endpoint": "seedance-2.0-watermark-remover",
  "inputs": {
    "video_url": {
      "type": "string",
      "title": "Video URL",
      "name": "video_url",
      "description": "URL of the video with watermark to remove"
    },
    "watermark_type": {
      "type": "string",
      "title": "Watermark Type",
      "name": "watermark_type",
      "enum": ["seedance", "sora", "custom"],
      "default": "seedance"
    }
  }
}
```

### 10.6 WAN 2.1 LoRA Models

```javascript
// File: src/lib/models.js
{
  "id": "wan2.1-lora-t2v",
  "name": "WAN 2.1 LoRA T2V",
  "family": "wan2.1",
  "endpoint": "wan2.1-lora-t2v",
  "isTraining": true,
  "inputs": {
    "reference_videos": {
      "type": "array",
      "title": "Reference Videos",
      "name": "reference_videos",
      "items": { "type": "string" },
      "minItems": 10,
      "maxItems": 30
    },
    "lora_name": {
      "type": "string",
      "title": "LoRA Name",
      "name": "lora_name"
    },
    "trigger_word": {
      "type": "string",
      "title": "Trigger Word",
      "name": "trigger_word"
    },
    "training_steps": {
      "type": "int",
      "title": "Training Steps",
      "name": "training_steps",
      "default": 2000,
      "enum": [1000, 2000, 3000]
    }
  }
}
```

---

## Dependencies and Environment Variables

### Required Dependencies

The app uses vanilla JavaScript with Vite as the build tool. No additional npm packages are required for basic MuAPI integration.

```json
// package.json
{
  "name": "open-higgsfield-ai",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {},
  "devDependencies": {
    "vite": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

### API Key Configuration

Users must obtain an API key from [MuAPI.ai](https://muapi.ai) and enter it in the app's Settings modal. The key is stored in `localStorage`:

```javascript
// Setting the API key
localStorage.setItem('muapi_key', 'your-api-key-here');

// Retrieving the API key
const key = localStorage.getItem('muapi_key');
```

### Environment Configuration

```javascript
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://api.muapi.ai',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  }
});
```

---

## Complete Workflow: From Registration to UI Display

### Step 1: Add Model to models.js

```javascript
// 1. Add to appropriate model array (t2iModels, videoModels, etc.)
// 2. Include all input parameters with types
// 3. Set sensible defaults
// 4. Add example prompts
```

### Step 2: Update Helper Functions

```javascript
// If new model category, add helper functions:
// - getNewCategoryModelById(id)
// - getInputsForModel(id)
// - etc.
```

### Step 3: Add Router Route

```javascript
// In router.js:
// 1. Add to ROUTE_MAP
// 2. Add to pageLoaders with lazy import
```

### Step 4: Add Sidebar Navigation

```javascript
// In Sidebar.js:
// Add new nav item to navItems array
```

### Step 5: Create Studio Component

```javascript
// Create src/components/NewStudio.js:
// 1. Import muapi client
// 2. Define method/model arrays
// 3. Create hero section
// 4. Create form inputs
// 5. Handle generation with loading states
// 6. Display results
```

### Step 6: Add Hero Thumbnail

```javascript
// Create public/thumbnails/{feature}.webp
// Use createHeroSection() in studio component
```

### Step 7: Test Integration

```javascript
// 1. Verify model appears in UI
// 2. Test generation with valid inputs
// 3. Test error handling
// 4. Verify results display correctly
```

---

This documentation provides comprehensive guidance for implementing new AI model integrations into the Open Higgsfield AI application. Follow the patterns and examples to add any new model from the MuAPI documentation.

---

# APPENDIX A: Complete API Endpoint Reference

## A.1 All 125+ API Endpoints Currently Integrated

The following table lists all API endpoints currently defined in the application:

| # | Model ID | Endpoint | Family | Category |
|---|----------|----------|--------|----------|
| 1 | nano-banana | nano-banana | nano | T2I |
| 2 | flux-dev | flux-dev-image | flux | T2I |
| 3 | flux-schnell | flux-schnell-image | flux | T2I |
| 4 | nano-banana-pro | nano-banana-pro | nano | T2I |
| 5 | nano-banana-2 | nano-banana-2 | nano | T2I |
| 6 | seedream-5.0 | seedream-5.0 | seedream | T2I |
| 7 | ai-image-upscale | ai-image-upscale | tools | I2I |
| 8 | ai-image-face-swap | ai-image-face-swap | tools | I2I |
| 9 | ai-dress-change | ai-dress-change | tools | I2I |
| 10 | ai-background-remover | ai-background-remover | tools | I2I |
| 11 | ai-product-shot | ai-product-shot | tools | I2I |
| 12 | ai-skin-enhancer | ai-skin-enhancer | tools | I2I |
| 13 | ai-color-photo | ai-color-photo | tools | I2I |
| 14 | flux-kontext-dev-i2i | flux-kontext-dev-i2i | kontext | I2I |
| 15 | ai-product-photography | ai-product-photography | tools | I2I |
| 16 | ai-ghibli-style | ai-ghibli-style | tools | I2I |
| 17 | ai-image-extension | ai-image-extension | tools | I2I |
| 18 | ai-object-eraser | ai-object-eraser | tools | I2I |
| 19 | flux-kontext-pro-i2i | flux-kontext-pro-i2i | kontext | I2I |
| 20 | flux-kontext-max-i2i | flux-kontext-max-i2i | kontext | I2I |
| 21 | gpt4o-image-to-image | gpt4o-image-to-image | gpt | I2I |
| 22 | gpt4o-edit | gpt4o-edit | gpt | I2I |
| 23 | midjourney-v7-image-to-image | midjourney-v7-image-to-image | midjourney | I2I |
| 24 | bytedance-seededit-image | bytedance-seededit-image | seedream | I2I |
| 25 | midjourney-v7-style-reference | midjourney-v7-style-reference | midjourney | I2I |
| 26 | midjourney-v7-omni-reference | midjourney-v7-omni-reference | midjourney | I2I |
| 27 | minimax-01-subject-reference | minimax-01-subject-reference | minimax | I2I |
| 28 | ideogram-character | ideogram-character | ideogram | I2I |
| 29 | flux-pulid | flux-pulid | flux | I2I |
| 30 | qwen-image-edit | qwen-image-edit | qwen | I2I |
| 31 | image-effects | image-effects | effects | I2I |
| 32 | nano-banana-edit | nano-banana-edit | nano | I2I |
| 33 | ideogram-v3-reframe | ideogram-v3-reframe | ideogram | I2I |
| 34 | bytedance-seedream-edit-v4 | bytedance-seedream-edit-v4 | seedream | I2I |
| 35 | nano-banana-effects | nano-banana-effects | nano | I2I |
| 36 | flux-kontext-effects | flux-kontext-effects | kontext | I2I |
| 37 | flux-redux | flux-redux | flux | I2I |
| 38 | qwen-image-edit-plus | qwen-image-edit-plus | qwen | I2I |
| 39 | wan2.5-image-edit | wan2.5-image-edit | wan2.5 | I2I |
| 40 | higgsfield-soul-image-to-image | higgsfield-soul-image-to-image | higgsfield | I2I |
| 41 | reve-image-edit | reve-image-edit | reve | I2I |
| 42 | topaz-image-upscale | topaz-image-upscale | topaz | I2I |
| 43 | seedvr2-image-upscale | seedvr2-image-upscale | seedvr2 | I2I |
| 44 | qwen-image-edit-plus-lora | qwen-image-edit-plus-lora | qwen | I2I |
| 45 | nano-banana-pro-edit | nano-banana-pro-edit | nano | I2I |
| 46 | image-passthrough | image-passthrough | image | I2I |
| 47 | kling-o1-edit-image | kling-o1-edit-image | kling-o1 | I2I |
| 48 | flux-2-dev-edit | flux-2-dev-edit | flux-2 | I2I |
| 49 | flux-2-flex-edit | flux-2-flex-edit | flux-2 | I2I |
| 50 | flux-2-pro-edit | flux-2-pro-edit | flux-2 | I2I |
| 51 | vidu-q2-reference-to-image | vidu-q2-reference-to-image | vidu-q2 | I2I |
| 52 | bytedance-seedream-v4.5-edit | bytedance-seedream-v4.5-edit | seedream-v45 | I2I |
| 53 | qwen-image-edit-2511 | qwen-image-edit-2511 | qwen | I2I |
| 54 | wan2.6-image-edit | wan2.6-image-edit | wan2.6 | I2I |
| 55 | qwen-text-to-image-2512 | qwen-text-to-image-2512 | qwen | T2I |
| 56 | gpt-image-1.5-edit | gpt-image-1.5-edit | gpt-1.5 | I2I |
| 57 | grok-imagine-image-to-image | grok-imagine-image-to-image | grok | I2I |
| 58 | flux-2-klein-4b-edit | flux-2-klein-4b-edit | flux-2 | I2I |
| 59 | flux-2-klein-9b-edit | flux-2-klein-9b-edit | flux-2 | I2I |
| 60 | add-image-watermark | add-image-watermark | watermark | I2I |
| 61 | nano-banana-2-edit | nano-banana-2-edit | nano | I2I |
| 62 | seedream-5.0-edit | seedream-5.0-edit | seedream | I2I |
| 63 | generate_wan_ai_effects | generate_wan_ai_effects | effects | I2V |
| 64 | veo3-image-to-video | veo3-image-to-video | veo | I2V |
| 65 | veo3-fast-image-to-video | veo3-fast-image-to-video | veo | I2V |
| 66 | runway-image-to-video | runway-image-to-video | runway | I2V |
| 67 | wan2.1-image-to-video | wan2.1-image-to-video | wan2.1 | I2V |
| 68 | midjourney-v7-image-to-video | midjourney-v7-image-to-video | midjourney | I2V |
| 69 | hunyuan-image-to-video | hunyuan-image-to-video | hunyuan | I2V |
| 70 | kling-v2.1-master-i2v | kling-v2.1-master-i2v | kling-v2.1 | I2V |
| 71 | kling-v2.1-standard-i2v | kling-v2.1-standard-i2v | kling-v2.1 | I2V |
| 72 | kling-v2.1-pro-i2v | kling-v2.1-pro-i2v | kling-v2.1 | I2V |
| 73 | wan2.2-image-to-video | wan2.2-image-to-video | wan2.2 | I2V |
| 74 | runway-act-two-i2v | runway-act-two-i2v | runway | I2V |
| 75 | pixverse-v4.5-i2v | pixverse-v4.5-i2v | pixverse-v4.5 | I2V |
| 76 | vidu-v2.0-i2v | vidu-v2.0-i2v | vidu-v2 | I2V |
| 77 | vidu-q1-reference | vidu-q1-reference | vidu-q1 | I2V |
| 78 | minimax-hailuo-02-standard-i2v | minimax-hailuo-02-standard-i2v | minimax-2 | I2V |
| 79 | minimax-hailuo-02-pro-i2v | minimax-hailuo-02-pro-i2v | minimax-2 | I2V |
| 80 | video-effects | video-effects | effects | I2V |
| 81 | seedance-lite-i2v | seedance-lite-i2v | bytedance | I2V |
| 82 | seedance-pro-i2v | seedance-pro-i2v | bytedance | I2V |
| 83 | pixverse-v5-i2v | pixverse-v5-i2v | pixverse-v5 | I2V |
| 84 | seedance-lite-reference-video | seedance-lite-reference-to-video | bytedance | I2V |
| 85 | wan2.1-reference-video | wan2.1-reference-video | wan2.1 | I2V |
| 86 | kling-v2.5-turbo-pro-i2v | kling-v2.5-turbo-pro-i2v | kling-v2.5 | I2V |
| 87 | wan2.5-image-to-video | wan2.5-image-to-video | wan2.5 | I2V |
| 88 | wan2.5-image-to-video-fast | wan2.5-image-to-video-fast | wan2.5 | I2V |
| 89 | openai-sora-2-image-to-video | openai-sora-2-image-to-video | sora | I2V |
| 90 | ovi-image-to-video | ovi-image-to-video | ovi | I2V |
| 91 | openai-sora-2-pro-image-to-video | openai-sora-2-pro-image-to-video | sora | I2V |
| 92 | leonardoai-motion-2.0 | leonardoai-motion-2.0 | leonardoai | I2V |
| 93 | higgsfield-dop-image-to-video | higgsfield-dop-image-to-video | higgsfield | I2V |
| 94 | veo3.1-image-to-video | veo3.1-image-to-video | veo3.1 | I2V |
| 95 | veo3.1-fast-image-to-video | veo3.1-fast-image-to-video | veo3.1 | I2V |
| 96 | veo3.1-reference-to-video | veo3.1-reference-to-video | veo3.1 | I2V |
| 97 | seedance-pro-i2v-fast | seedance-pro-i2v-fast | bytedance | I2V |
| 98 | ltx-2-pro-image-to-video | ltx-2-pro-image-to-video | ltx | I2V |
| 99 | ltx-2-fast-image-to-video | ltx-2-fast-image-to-video | ltx | I2V |
| 100 | vidu-q2-reference | vidu-q2-reference | vidu-q2 | I2V |
| 101 | vidu-q2-turbo-start-end-video | vidu-q2-turbo-start-end-video | vidu-q2 | I2V |
| 102 | vidu-q2-pro-start-end-video | vidu-q2-pro-start-end-video | vidu-q2 | I2V |
| 103 | minimax-hailuo-2.3-pro-i2v | minimax-hailuo-2.3-pro-i2v | minimax-2.3 | I2V |
| 104 | minimax-hailuo-2.3-standard-i2v | minimax-hailuo-2.3-standard-i2v | minimax-2.3 | I2V |
| 105 | minimax-hailuo-2.3-fast | minimax-hailuo-2.3-fast | minimax-2.3 | I2V |
| 106 | kling-v2.5-turbo-std-i2v | kling-v2.5-turbo-std-i2v | kling-v2.5 | I2V |
| 107 | grok-imagine-image-to-video | grok-imagine-image-to-video | grok | I2V |
| 108 | kling-o1-image-to-video | kling-o1-image-to-video | kling-o1 | I2V |
| 109 | kling-o1-reference-to-video | kling-o1-reference-to-video | kling-o1 | I2V |
| 110 | kling-v2.6-pro-i2v | kling-v2.6-pro-i2v | kling-v2.6 | I2V |
| 111 | pixverse-v5.5-i2v | pixverse-v5.5-i2v | pixverse-v5.5 | I2V |
| 112 | wan2.2-spicy-image-to-video | wan2.2-spicy-image-to-video | wan2.2 | I2V |
| 113 | wan2.6-image-to-video | wan2.6-image-to-video | wan2.6 | I2V |
| 114 | kling-o1-standard-image-to-video | kling-o1-standard-image-to-video | kling-o1 | I2V |
| 115 | kling-o1-standard-reference-to-video | kling-o1-standard-reference-to-video | kling-o1 | I2V |
| 116 | seedance-v1.5-pro-i2v | seedance-v1.5-pro-i2v | seedance-v1.5-pro | I2V |
| 117 | seedance-v1.5-pro-i2v-fast | seedance-v1.5-pro-i2v-fast | seedance-v1.5-pro | I2V |
| 118 | ltx-2-19b-image-to-video | ltx-2-19b-image-to-video | ltx | I2V |
| 119 | kling-v3.0-pro-image-to-video | kling-v3.0-pro-image-to-video | kling-v3.0 | I2V |
| 120 | kling-v3.0-standard-image-to-video | kling-v3.0-standard-image-to-video | kling-v3.0 | I2V |
| 121 | seedance-2.0-i2v | seedance-v2.0-i2v | seedance-v2.0 | I2V |
| 122 | video-watermark-remover | video-watermark-remover | tools | V2V |

## A.2 API Endpoints by Category

### Text-to-Image (T2I) Endpoints

| Model ID | Endpoint | Description |
|----------|----------|-------------|
| nano-banana | nano-banana | Google Gemini 2.5 Flash Image |
| flux-dev | flux-dev-image | Flux Dev text-to-image |
| flux-schnell | flux-schnell-image | Flux Schnell fast generation |
| nano-banana-pro | nano-banana-pro | Nano Banana 2 Pro |
| nano-banana-2 | nano-banana-2 | Google Gemini 3.1 Flash |
| seedream-5.0 | seedream-5.0 | ByteDance Seedream 5.0 |
| qwen-text-to-image-2512 | qwen-text-to-image-2512 | Qwen 2.5 T2I |

### Image-to-Image (I2I) Endpoints

| Model ID | Endpoint | Description |
|----------|----------|-------------|
| ai-image-upscale | ai-image-upscale | AI image upscaling |
| ai-image-face-swap | ai-image-face-swap | Face swap |
| ai-dress-change | ai-dress-change | Virtual try-on |
| ai-background-remover | ai-background-remover | Background removal |
| ai-product-shot | ai-product-shot | Product photography |
| ai-skin-enhancer | ai-skin-enhancer | Skin retouching |
| ai-color-photo | ai-color-photo | Photo colorization |
| flux-kontext-dev-i2i | flux-kontext-dev-i2i | Flux Kontext Dev |
| flux-kontext-pro-i2i | flux-kontext-pro-i2i | Flux Kontext Pro |
| flux-kontext-max-i2i | flux-kontext-max-i2i | Flux Kontext Max |
| gpt4o-image-to-image | gpt4o-image-to-image | GPT-4o image editing |
| midjourney-v7-image-to-image | midjourney-v7-image-to-image | Midjourney V7 I2I |
| bytedance-seededit-image | bytedance-seededit-image | ByteDance SeedEdit |
| flux-pulid | flux-pulid | Flux PuLID face consistency |
| qwen-image-edit | qwen-image-edit | Qwen image editing |
| nano-banana-edit | nano-banana-edit | Nano Banana editing |
| bytedance-seedream-edit-v4 | bytedance-seedream-edit-v4 | Seedream V4 editing |
| qwen-image-edit-plus | qwen-image-edit-plus | Qwen multi-image editing |
| wan2.5-image-edit | wan2.5-image-edit | WAN 2.5 editing |
| topaz-image-upscale | topaz-image-upscale | Topaz super-resolution |
| seedvr2-image-upscale | seedvr2-image-upscale | SeedVR2 upscaling |
| flux-2-dev-edit | flux-2-dev-edit | Flux 2 Dev editing |
| flux-2-flex-edit | flux-2-flex-edit | Flux 2 Flex editing |
| flux-2-pro-edit | flux-2-pro-edit | Flux 2 Pro editing |
| gpt-image-1.5-edit | gpt-image-1.5-edit | GPT Image 1.5 editing |
| grok-imagine-image-to-image | grok-imagine-image-to-image | Grok image transformation |
| flux-redux | flux-redux | Flux Redux style transfer |
| image-effects | image-effects | AI image effects |
| nano-banana-effects | nano-banana-effects | Nano Banana effects |
| flux-kontext-effects | flux-kontext-effects | Flux Kontext effects |

### Image-to-Video (I2V) Endpoints

| Model ID | Endpoint | Description |
|----------|----------|-------------|
| veo3-image-to-video | veo3-image-to-video | Google Veo3 |
| veo3-fast-image-to-video | veo3-fast-image-to-video | Veo3 fast mode |
| runway-image-to-video | runway-image-to-video | RunwayML I2V |
| wan2.1-image-to-video | wan2.1-image-to-video | WAN 2.1 I2V |
| midjourney-v7-image-to-video | midjourney-v7-image-to-video | Midjourney V7 video |
| hunyuan-image-to-video | hunyuan-image-to-video | Tencent Hunyuan |
| kling-v2.1-master-i2v | kling-v2.1-master-i2v | Kling 2.1 Master |
| kling-v2.1-standard-i2v | kling-v2.1-standard-i2v | Kling 2.1 Standard |
| kling-v2.1-pro-i2v | kling-v2.1-pro-i2v | Kling 2.1 Pro |
| wan2.2-image-to-video | wan2.2-image-to-video | WAN 2.2 I2V |
| pixverse-v4.5-i2v | pixverse-v4.5-i2v | PixVerse V4.5 |
| pixverse-v5-i2v | pixverse-v5-i2v | PixVerse V5 |
| pixverse-v5.5-i2v | pixverse-v5.5-i2v | PixVerse V5.5 |
| vidu-v2.0-i2v | vidu-v2.0-i2v | Vidu V2.0 |
| vidu-q1-reference | vidu-q1-reference | Vidu Q1 reference |
| vidu-q2-reference | vidu-q2-reference | Vidu Q2 reference |
| seedance-lite-i2v | seedance-lite-i2v | ByteDance Seedance Lite |
| seedance-pro-i2v | seedance-pro-i2v | ByteDance Seedance Pro |
| seedance-pro-i2v-fast | seedance-pro-i2v-fast | Seedance Pro Fast |
| ltx-2-pro-image-to-video | ltx-2-pro-image-to-video | LTX Video Pro |
| ltx-2-fast-image-to-video | ltx-2-fast-image-to-video | LTX Video Fast |
| ltx-2-19b-image-to-video | ltx-2-19b-image-to-video | LTX Video 19B |
| openai-sora-2-image-to-video | openai-sora-2-image-to-video | OpenAI Sora 2 |
| openai-sora-2-pro-image-to-video | openai-sora-2-pro-image-to-video | Sora 2 Pro |
| veo3.1-image-to-video | veo3.1-image-to-video | Google Veo 3.1 |
| veo3.1-fast-image-to-video | veo3.1-fast-image-to-video | Veo 3.1 Fast |
| veo3.1-reference-to-video | veo3.1-reference-to-video | Veo 3.1 R2V |
| kling-v3.0-pro-image-to-video | kling-v3.0-pro-image-to-video | Kling 3.0 Pro |
| kling-v3.0-standard-image-to-video | kling-v3.0-standard-image-to-video | Kling 3.0 Standard |
| kling-v2.5-turbo-pro-i2v | kling-v2.5-turbo-pro-i2v | Kling 2.5 Turbo Pro |
| kling-v2.5-turbo-std-i2v | kling-v2.5-turbo-std-i2v | Kling 2.5 Turbo Std |
| kling-v2.6-pro-i2v | kling-v2.6-pro-i2v | Kling 2.6 Pro |
| kling-o1-image-to-video | kling-o1-image-to-video | Kling O1 I2V |
| kling-o1-reference-to-video | kling-o1-reference-to-video | Kling O1 Reference |
| kling-o1-standard-image-to-video | kling-o1-standard-image-to-video | Kling O1 Standard |
| kling-o1-standard-reference-to-video | kling-o1-standard-reference-to-video | Kling O1 Std Ref |
| leonardoai-motion-2.0 | leonardoai-motion-2.0 | Leonardo AI Motion |
| higgsfield-dop-image-to-video | higgsfield-dop-image-to-video | Higgsfield DOP |
| minimax-hailuo-02-standard-i2v | minimax-hailuo-02-standard-i2v | Minimax Hailuo Std |
| minimax-hailuo-02-pro-i2v | minimax-hailuo-02-pro-i2v | Minimax Hailuo Pro |
| minimax-hailuo-2.3-pro-i2v | minimax-hailuo-2.3-pro-i2v | Minimax Hailuo 2.3 Pro |
| minimax-hailuo-2.3-standard-i2v | minimax-hailuo-2.3-standard-i2v | Minimax Hailuo 2.3 Std |
| minimax-hailuo-2.3-fast | minimax-hailuo-2.3-fast | Minimax Hailuo 2.3 Fast |
| wan2.2-spicy-image-to-video | wan2.2-spicy-image-to-video | WAN 2.2 Spicy |
| wan2.5-image-to-video | wan2.5-image-to-video | WAN 2.5 I2V |
| wan2.5-image-to-video-fast | wan2.5-image-to-video-fast | WAN 2.5 Fast |
| wan2.6-image-to-video | wan2.6-image-to-video | WAN 2.6 I2V |
| ovi-image-to-video | ovi-image-to-video | Ovi I2V |
| generate_wan_ai_effects | generate_wan_ai_effects | AI Video Effects |
| video-effects | video-effects | Video Effects |
| seedance-lite-reference-video | seedance-lite-reference-to-video | Seedance Lite Ref |
| wan2.1-reference-video | wan2.1-reference-video | WAN 2.1 Reference |
| vidu-q2-turbo-start-end-video | vidu-q2-turbo-start-end-video | Vidu Q2 Turbo Start-End |
| vidu-q2-pro-start-end-video | vidu-q2-pro-start-end-video | Vidu Q2 Pro Start-End |
| seedance-v1.5-pro-i2v | seedance-v1.5-pro-i2v | Seedance 1.5 Pro |
| seedance-v1.5-pro-i2v-fast | seedance-v1.5-pro-i2v-fast | Seedance 1.5 Pro Fast |
| seedance-2.0-i2v | seedance-v2.0-i2v | Seedance 2.0 |
| grok-imagine-image-to-video | grok-imagine-image-to-video | Grok Imagine I2V |

### Video-to-Video (V2V) Endpoints

| Model ID | Endpoint | Description |
|----------|----------|-------------|
| video-watermark-remover | video-watermark-remover | Remove watermarks |

## A.3 MuAPI Base URL and Authentication

```
Base URL: https://api.muapi.ai/api/v1
Headers:
  Content-Type: application/json
  x-api-key: {YOUR_API_KEY}
```

## A.4 API Request Flow

```
1. POST /api/v1/{endpoint}
   → Returns { request_id, status }

2. GET /api/v1/predictions/{request_id}/result
   → Polling until status === 'completed'
   → Returns { outputs: [url], status, ... }
```

## A.5 Missing Endpoints (Not Yet Integrated)

Based on the MuAPI documentation, these endpoints are available but NOT yet in the codebase:

### Text-to-Audio
- `minimax-speech-2.6-turbo` - Text-to-speech (fast)
- `minimax-speech-2.6-hd` - Text-to-speech (HD)
- `minimax-voice-clone` - Voice cloning
- `suno-create-music` - Generate music from text
- `suno-extend-music` - Extend audio tracks
- `suno-remix-music` - Remix audio
- `mmaudio-v2-text-to-audio` - MMAudio text-to-audio

### Audio-to-Video
- `ltx-2.3-lipsync` - Lip sync from audio
- `ltx-2-19b-lipsync` - Lip sync (19B model)
- `kling-v2-avatar-pro` - Kling Avatar v2 Pro
- `kling-v2-avatar-standard` - Kling Avatar v2 Standard
- `kling-v1-avatar-pro` - Kling Avatar v1 Pro
- `kling-v1-avatar-standard` - Kling Avatar v1 Standard
- `wan2.2-speech-to-video` - Speech-to-video
- `infinitetalk-image-to-video` - Talking image
- `infinitetalk-video-to-video` - Video lip sync
- `veed-lipsync` - VEED lipsync
- `creatify-lipsync` - Creatify lipsync
- `latent-sync` - LatentSync lipsync

### Text-to-Text
- `openrouter-vision` - LLM endpoint
- `any-llm` - Any LLM endpoint
- `gpt-5-mini` - GPT-5 Mini
- `gpt-5-nano` - GPT-5 Nano

### Training
- `sdxl-lora` - SDXL LoRA training
- `wan2.1-lora-t2v` - WAN LoRA T2V
- `wan2.1-lora-i2v` - WAN LoRA I2V

### Additional Video Tools
- `ai-video-upscaler` - Video upscaling
- `ai-video-upscaler-pro` - Video upscaling Pro
- `topaz-video-upscale` - Topaz video upscale
- `seedance-2.0-watermark-remover` - Seedance watermark remover
- `heygen-video-translate` - Video translation
- `wan2.2-animate` - Character animation
- `wan2.2-edit-video` - Video editing
- `luma-flash-reframe` - Intelligent resize
- `luma-modify-video` - Style transformation
- `ai-clipping` - Auto-clip long videos
- `remix-video` - Video remix

---

This documentation provides comprehensive guidance for implementing new AI model integrations into the Open Higgsfield AI application. Follow the patterns and examples to add any new model from the MuAPI documentation.