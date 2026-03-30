/**
 * Generation Service
 * Unified abstraction layer for AI video generation
 * Combines LTX-Desktop generation logic with web-compatible API calls
 */

import { GenerationModes, GenerationProviders, createDefaultProject } from './types.js';

// ============================================================================
// CONFIGURATION
// ============================================================================

const DEFAULT_CONFIG = {
  ltx: {
    baseUrl: 'http://localhost:8000',
    timeout: 300000, // 5 minutes
  },
  fal: {
    baseUrl: 'https://queue.fal.run',
    timeout: 300000,
  },
  seedance: {
    baseUrl: 'https://api.seedance.com',
    timeout: 300000,
  },
  veo: {
    baseUrl: 'https://generativelanguage.googleapis.com',
    timeout: 300000,
  },
};

// ============================================================================
// GENERATION REQUEST/RESULT
// ============================================================================

/**
 * @typedef {Object} GenerationRequest
 * @property {'text-to-video' | 'image-to-video' | 'audio-to-video' | 'retake' | 'extend' | 'broll' | 'variation'} mode
 * @property {string} prompt
 * @property {string} [negativePrompt]
 * @property {number} [duration]
 * @property {string} [aspectRatio]
 * @property {number} [fps]
 * @property {string[]} [references]
 * @property {string} [sourceAssetId]
 * @property {string} [selectedClipId]
 * @property {Object} [selectedRange]
 * @property {number} [selectedRange.start]
 * @property {number} [selectedRange.end]
 * @property {string} [stylePreset]
 * @property {Object} [metadata]
 */

/**
 * @typedef {Object} GenerationResult
 * @property {string} generationId
 * @property {'queued' | 'processing' | 'completed' | 'failed'} status
 * @property {string[]} [assetIds]
 * @property {string} [previewUrl]
 * @property {string} [error]
 * @property {Object} [metadata]
 */

// ============================================================================
// LTX PROVIDER
// ============================================================================

/**
 * LTX Video Generation Provider
 * Implements generation using LTX-Desktop backend API
 */
class LtxProvider {
  constructor(config = {}) {
    this.config = { ...DEFAULT_CONFIG.ltx, ...config };
    this.baseUrl = this.config.baseUrl;
    this.timeout = this.config.timeout;
  }

  /**
   * Submit a generation request
   * @param {GenerationRequest} request
   * @returns {Promise<GenerationResult>}
   */
  async submit(request) {
    const generationId = `gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    try {
      let endpoint = '';
      let body = {};

      switch (request.mode) {
        case 'text-to-video':
          endpoint = '/api/generate';
          body = {
            prompt: request.prompt,
            negative_prompt: request.negativePrompt || '',
            duration: request.duration || 5,
            aspect_ratio: request.aspectRatio || '16:9',
            fps: request.fps || 24,
            style_preset: request.stylePreset || 'cinematic',
          };
          break;

        case 'image-to-video':
          endpoint = '/api/i2v';
          body = {
            prompt: request.prompt,
            negative_prompt: request.negativePrompt || '',
            image_path: request.references?.[0] || '',
            duration: request.duration || 5,
            aspect_ratio: request.aspectRatio || '16:9',
            fps: request.fps || 24,
          };
          break;

        case 'retake':
          endpoint = '/api/retake';
          body = {
            prompt: request.prompt,
            negative_prompt: request.negativePrompt || '',
            source_video_path: request.sourceAssetId || '',
            start_time: request.selectedRange?.start || 0,
            end_time: request.selectedRange?.end || 0,
            duration: request.duration || 5,
            style_preset: request.stylePreset || 'cinematic',
          };
          break;

        case 'extend':
          endpoint = '/api/extend';
          body = {
            prompt: request.prompt,
            source_video_path: request.sourceAssetId || '',
            extend_duration: request.duration || 5,
          };
          break;

        case 'broll':
          endpoint = '/api/generate';
          body = {
            prompt: request.prompt,
            negative_prompt: request.negativePrompt || '',
            duration: request.duration || 3,
            aspect_ratio: request.aspectRatio || '16:9',
            style_preset: 'broll',
          };
          break;

        default:
          throw new Error(`Unsupported generation mode: ${request.mode}`);
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Generation failed: ${error}`);
      }

      const result = await response.json();

      return {
        generationId,
        status: 'queued',
        previewUrl: result.preview_url || result.output_path || null,
        metadata: result,
      };
    } catch (error) {
      return {
        generationId,
        status: 'failed',
        error: error.message,
      };
    }
  }

  /**
   * Poll for generation status
   * @param {string} generationId
   * @returns {Promise<GenerationResult>}
   */
  async poll(generationId) {
    try {
      const response = await fetch(`${this.baseUrl}/api/status/${generationId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Status check failed: ${response.statusText}`);
      }

      const result = await response.json();

      return {
        generationId,
        status: result.status || 'processing',
        previewUrl: result.preview_url || result.output_path || null,
        assetIds: result.asset_ids || [],
        error: result.error || null,
        metadata: result,
      };
    } catch (error) {
      return {
        generationId,
        status: 'failed',
        error: error.message,
      };
    }
  }

  /**
   * Cancel a generation job
   * @param {string} generationId
   */
  async cancel(generationId) {
    await fetch(`${this.baseUrl}/api/cancel/${generationId}`, {
      method: 'POST',
    });
  }
}

// ============================================================================
// FAL PROVIDER (Alternative)
// ============================================================================

class FalProvider {
  constructor(config = {}) {
    this.config = { ...DEFAULT_CONFIG.fal, ...config };
    this.baseUrl = this.config.baseUrl;
    this.timeout = this.config.timeout;
    this.apiKey = config.apiKey || '';
  }

  async submit(request) {
    const generationId = `fal_${Date.now()}`;

    try {
      const response = await fetch(`${this.baseUrl}/ltx-production/t2v`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Key ${this.apiKey}`,
        },
        body: JSON.stringify({
          prompt: request.prompt,
          negative_prompt: request.negativePrompt,
          duration: Math.min(request.duration || 5, 10),
          aspect_ratio: request.aspectRatio || '16:9',
        }),
      });

      if (!response.ok) {
        throw new Error(`FAL API error: ${response.statusText}`);
      }

      const result = await response.json();
      return {
        generationId,
        status: 'queued',
        previewUrl: result.request_id,
        metadata: result,
      };
    } catch (error) {
      return {
        generationId,
        status: 'failed',
        error: error.message,
      };
    }
  }

  async poll(generationId) {
    try {
      const response = await fetch(`${this.baseUrl}/ltx-production/requests/${generationId}`, {
        headers: {
          'Authorization': `Key ${this.apiKey}`,
        },
      });

      const result = await response.json();

      return {
        generationId,
        status: result.status === 'COMPLETED' ? 'completed' : result.status === 'FAILED' ? 'failed' : 'processing',
        previewUrl: result.output?.video_url || null,
        error: result.error || null,
      };
    } catch (error) {
      return {
        generationId,
        status: 'failed',
        error: error.message,
      };
    }
  }
}

// ============================================================================
// GENERATION SERVICE
// ============================================================================

/**
 * Unified Generation Service
 * Manages multiple providers and handles job lifecycle
 */
class GenerationService {
  constructor() {
    this.providers = {
      ltx: new LtxProvider(),
      fal: new FalProvider(),
    };
    this.activeJobs = new Map();
    this.listeners = new Map();
  }

  /**
   * Set provider configuration
   * @param {'ltx' | 'fal'} name
   * @param {Object} config
   */
  configureProvider(name, config) {
    if (name === 'ltx') {
      this.providers.ltx = new LtxProvider(config);
    } else if (name === 'fal') {
      this.providers.fal = new FalProvider(config);
    }
  }

  /**
   * Get available providers
   * @returns {string[]}
   */
  getAvailableProviders() {
    return Object.keys(this.providers);
  }

  /**
   * Submit a generation job
   * @param {GenerationRequest} request
   * @param {'ltx' | 'fal'} [provider]
   * @returns {Promise<GenerationResult>}
   */
  async submit(request, provider = 'ltx') {
    const providerInstance = this.providers[provider];
    if (!providerInstance) {
      throw new Error(`Unknown provider: ${provider}`);
    }

    const result = await providerInstance.submit(request);

    if (result.status !== 'failed') {
      this.activeJobs.set(result.generationId, {
        request,
        provider,
        status: result.status,
        createdAt: Date.now(),
      });

      this.emit('job-created', {
        generationId: result.generationId,
        provider,
        mode: request.mode,
      });
    }

    return result;
  }

  /**
   * Poll for job status
   * @param {string} generationId
   * @returns {Promise<GenerationResult>}
   */
  async poll(generationId) {
    const job = this.activeJobs.get(generationId);
    if (!job) {
      throw new Error(`Unknown job: ${generationId}`);
    }

    const provider = this.providers[job.provider];
    const result = await provider.poll(generationId);

    this.activeJobs.set(generationId, {
      ...job,
      status: result.status,
    });

    if (result.status === 'completed' || result.status === 'failed') {
      this.emit('job-completed', {
        generationId,
        status: result.status,
        result,
      });
    } else {
      this.emit('job-progress', {
        generationId,
        status: result.status,
        result,
      });
    }

    return result;
  }

  /**
   * Start polling for a job
   * @param {string} generationId
   * @param {Function} onUpdate
   * @param {number} interval
   */
  startPolling(generationId, onUpdate, interval = 2000) {
    const poll = async () => {
      const result = await this.poll(generationId);
      onUpdate(result);

      if (result.status === 'processing' || result.status === 'queued') {
        setTimeout(poll, interval);
      }
    };

    setTimeout(poll, interval);
  }

  /**
   * Cancel a job
   * @param {string} generationId
   */
  async cancel(generationId) {
    const job = this.activeJobs.get(generationId);
    if (!job) {
      throw new Error(`Unknown job: ${generationId}`);
    }

    const provider = this.providers[job.provider];
    if (provider.cancel) {
      await provider.cancel(generationId);
    }

    this.activeJobs.delete(generationId);
    this.emit('job-cancelled', { generationId });
  }

  /**
   * Get all active jobs
   * @returns {Object[]}
   */
  getActiveJobs() {
    return Array.from(this.activeJobs.entries()).map(([id, job]) => ({
      generationId: id,
      ...job,
    }));
  }

  /**
   * Clear completed/failed jobs
   */
  clearCompletedJobs() {
    for (const [id, job] of this.activeJobs.entries()) {
      if (job.status === 'completed' || job.status === 'failed') {
        this.activeJobs.delete(id);
      }
    }
  }

  /**
   * Add event listener
   * @param {string} event
   * @param {Function} callback
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  /**
   * Remove event listener
   * @param {string} event
   * @param {Function} callback
   */
  off(event, callback) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  /**
   * Emit event
   * @param {string} event
   * @param {Object} data
   */
  emit(event, data) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((cb) => cb(data));
    }
  }
}

// ============================================================================
// CONVENIENCE METHODS
// ============================================================================

/**
 * Create a text-to-video request
 * @param {string} prompt
 * @param {Object} options
 * @returns {GenerationRequest}
 */
export function createTextToVideoRequest(prompt, options = {}) {
  return {
    mode: 'text-to-video',
    prompt,
    negativePrompt: options.negativePrompt,
    duration: options.duration,
    aspectRatio: options.aspectRatio,
    fps: options.fps,
    stylePreset: options.stylePreset,
    metadata: options.metadata,
  };
}

/**
 * Create an image-to-video request
 * @param {string} imageUrl
 * @param {string} prompt
 * @param {Object} options
 * @returns {GenerationRequest}
 */
export function createImageToVideoRequest(imageUrl, prompt, options = {}) {
  return {
    mode: 'image-to-video',
    prompt,
    negativePrompt: options.negativePrompt,
    references: [imageUrl],
    duration: options.duration,
    aspectRatio: options.aspectRatio,
    fps: options.fps,
    stylePreset: options.stylePreset,
    metadata: options.metadata,
  };
}

/**
 * Create a retake request
 * @param {string} sourceAssetId
 * @param {string} prompt
 * @param {Object} range
 * @param {Object} options
 * @returns {GenerationRequest}
 */
export function createRetakeRequest(sourceAssetId, prompt, range, options = {}) {
  return {
    mode: 'retake',
    prompt,
    negativePrompt: options.negativePrompt,
    sourceAssetId,
    selectedRange: range,
    duration: options.duration,
    stylePreset: options.stylePreset,
    metadata: options.metadata,
  };
}

/**
 * Create an extend request
 * @param {string} sourceAssetId
 * @param {string} prompt
 * @param {number} duration
 * @param {Object} options
 * @returns {GenerationRequest}
 */
export function createExtendRequest(sourceAssetId, prompt, duration, options = {}) {
  return {
    mode: 'extend',
    prompt,
    sourceAssetId,
    duration,
    metadata: options.metadata,
  };
}

/**
 * Create a B-roll request
 * @param {string} prompt
 * @param {Object} options
 * @returns {GenerationRequest}
 */
export function createBrollRequest(prompt, options = {}) {
  return {
    mode: 'broll',
    prompt,
    negativePrompt: options.negativePrompt,
    duration: options.duration || 3,
    aspectRatio: options.aspectRatio,
    metadata: options.metadata,
  };
}

// ============================================================================
// EXPORT SINGLETON
// ============================================================================

export const generationService = new GenerationService();
export { GenerationService, LtxProvider, FalProvider };
export default generationService;
