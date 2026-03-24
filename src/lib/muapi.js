import { getModelById, getVideoModelById, getI2IModelById, getI2VModelById, getV2VModelById } from './models.js';
import { uploadFileToStorage } from './supabase.js';

export class MuapiClient {
    constructor() {
        // Validate that Supabase URL is configured before building proxy URL
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        if (!supabaseUrl) {
            console.error('[MuapiClient] VITE_SUPABASE_URL is not configured');
            this.proxyUrl = '/functions/v1/muapi-proxy'; // Fallback to relative path
        } else {
            this.proxyUrl = `${supabaseUrl}/functions/v1/muapi-proxy`;
        }
        this.activeControllers = new Map(); // For request cancellation
    }

    getKey() {
        const key = localStorage.getItem('muapi_key');
        if (!key) {
            // Set default API key if not configured
            const defaultKey = 'd370ae6ecc87e99654ed2220fba0d1511224f41623867aedc2c2a0a06f15b208';
            localStorage.setItem('muapi_key', defaultKey);
            return defaultKey;
        }
        return key;
    }

    // Cancel a specific request
    cancelRequest(requestId) {
        const controller = this.activeControllers.get(requestId);
        if (controller) {
            controller.abort();
            this.activeControllers.delete(requestId);
            console.log(`[MuapiClient] Cancelled request: ${requestId}`);
        }
    }

    // Cancel all active requests
    cancelAllRequests() {
        for (const [requestId, controller] of this.activeControllers) {
            controller.abort();
        }
        this.activeControllers.clear();
        console.log('[MuapiClient] Cancelled all requests');
    }

    // Validate API response structure
    validateResponse(data, expectedType) {
        if (!data || typeof data !== 'object') {
            throw new Error('Invalid response: expected object');
        }
        if (data.error) {
            throw new Error(`API Error: ${data.error}`);
        }
        return true;
    }

    async generateImage(params, signal) {
        const modelInfo = getModelById(params.model);
        const endpoint = modelInfo?.endpoint || params.model;

        const finalPayload = {
            prompt: params.prompt,
        };

        if (params.aspect_ratio) {
            finalPayload.aspect_ratio = params.aspect_ratio;
        }

        if (params.resolution) {
            finalPayload.resolution = params.resolution;
        }

        if (params.quality) {
            finalPayload.quality = params.quality;
        }

        if (params.image_url) {
            finalPayload.image_url = params.image_url;
            finalPayload.strength = params.strength || 0.6;
        } else {
            finalPayload.image_url = null;
        }

        if (params.seed && params.seed !== -1) {
            finalPayload.seed = params.seed;
        }

        try {
            const response = await fetch(this.proxyUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    endpoint,
                    params: finalPayload,
                    generationType: 'image',
                    studioType: params.studioType || 'image'
                }),
                signal
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`API Request Failed: ${response.status} ${response.statusText} - ${errText.slice(0, 100)}`);
            }

            const submitData = await response.json();
            this.validateResponse(submitData, 'submit');

            const requestId = submitData.request_id || submitData.id;
            if (!requestId) {
                return submitData;
            }

            const result = await this.pollForResult(requestId, 60, 2000, signal);

            // Validate output URL exists
            const imageUrl = result.outputs?.[0] || result.url || result.output?.url;
            if (!imageUrl) {
                console.warn('[MuapiClient] No image URL in response, returning full result');
            }
            return { ...result, url: imageUrl };

        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('Request cancelled by user');
            }
            throw error;
        }
    }

    async pollForResult(requestId, maxAttempts = 60, baseInterval = 2000, signal) {
        // Use exponential backoff with jitter for polling
        const getInterval = (attempt) => {
            const exponentialDelay = Math.min(baseInterval * Math.pow(1.5, attempt - 1), 30000); // Cap at 30s
            const jitter = exponentialDelay * 0.2 * Math.random(); // 20% jitter
            return exponentialDelay + jitter;
        };

        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            // Check if request was cancelled before sleeping
            if (signal?.aborted) {
                throw new Error('Request cancelled');
            }

            await new Promise(resolve => setTimeout(resolve, getInterval(attempt)));

            // Check cancellation before making request
            if (signal?.aborted) {
                throw new Error('Request cancelled');
            }

            try {
                const response = await fetch(this.proxyUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        endpoint: `predictions/${requestId}/result`,
                        params: {},
                        generationType: 'poll'
                    }),
                    signal
                });

                if (!response.ok) {
                    if (response.status >= 500) continue;
                    if (response.status === 404) {
                        throw new Error('Request not found - may have expired');
                    }
                    const errText = await response.text();
                    throw new Error(`Poll Failed: ${response.status} - ${errText.slice(0, 100)}`);
                }

                const data = await response.json();
                this.validateResponse(data, 'poll');

                const status = data.status?.toLowerCase();

                if (status === 'completed' || status === 'succeeded' || status === 'success') {
                    return data;
                }

                if (status === 'failed' || status === 'error') {
                    throw new Error(`Generation failed: ${data.error || 'Unknown error'}`);
                }

                // Log progress for long-running tasks
                if (attempt % 10 === 0) {
                    console.log(`[MuapiClient] Still processing... attempt ${attempt}/${maxAttempts}`);
                }

            } catch (error) {
                if (error.name === 'AbortError') {
                    throw new Error('Request cancelled');
                }
                if (attempt === maxAttempts) throw error;
            }
        }

        throw new Error('Generation timed out after polling.');
    }

    async generateVideo(params, signal) {
        const modelInfo = getVideoModelById(params.model);
        const endpoint = modelInfo?.endpoint || params.model;

        const finalPayload = {};

        if (params.prompt) finalPayload.prompt = params.prompt;
        if (params.request_id) finalPayload.request_id = params.request_id;
        if (params.aspect_ratio) finalPayload.aspect_ratio = params.aspect_ratio;
        if (params.duration) finalPayload.duration = params.duration;
        if (params.resolution) finalPayload.resolution = params.resolution;
        if (params.quality) finalPayload.quality = params.quality;
        if (params.image_url) finalPayload.image_url = params.image_url;

        try {
            const response = await fetch(this.proxyUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    endpoint,
                    params: finalPayload,
                    generationType: 'video',
                    studioType: params.studioType || 'video'
                }),
                signal
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`API Request Failed: ${response.status} ${response.statusText} - ${errText.slice(0, 100)}`);
            }

            const submitData = await response.json();
            this.validateResponse(submitData, 'submit');

            const requestId = submitData.request_id || submitData.id;
            if (!requestId) return submitData;

            const result = await this.pollForResult(requestId, 120, 2000, signal);

            const videoUrl = result.outputs?.[0] || result.url || result.output?.url;
            return { ...result, url: videoUrl };

        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('Request cancelled by user');
            }
            throw error;
        }
    }

    async generateI2I(params, signal) {
        const modelInfo = getI2IModelById(params.model);
        const endpoint = modelInfo?.endpoint || params.model;

        const finalPayload = {};

        if (params.prompt) finalPayload.prompt = params.prompt;

        const imageField = modelInfo?.imageField || 'image_url';
        const imagesList = params.images_list?.length > 0 ? params.images_list : (params.image_url ? [params.image_url] : null);
        if (imagesList) {
            if (imageField === 'images_list') {
                finalPayload.images_list = imagesList;
            } else {
                finalPayload[imageField] = imagesList[0];
            }
        }

        if (params.aspect_ratio) finalPayload.aspect_ratio = params.aspect_ratio;
        if (params.resolution) finalPayload.resolution = params.resolution;
        if (params.quality) finalPayload.quality = params.quality;

        try {
            const response = await fetch(this.proxyUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    endpoint,
                    params: finalPayload,
                    generationType: 'i2i',
                    studioType: params.studioType || 'edit'
                }),
                signal
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`API Request Failed: ${response.status} ${response.statusText} - ${errText.slice(0, 100)}`);
            }

            const submitData = await response.json();
            this.validateResponse(submitData, 'submit');

            const requestId = submitData.request_id || submitData.id;
            if (!requestId) return submitData;

            const result = await this.pollForResult(requestId, 60, 2000, signal);
            const imageUrl = result.outputs?.[0] || result.url || result.output?.url;
            return { ...result, url: imageUrl };
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('Request cancelled by user');
            }
            throw error;
        }
    }

    async generateI2V(params, signal) {
        const modelInfo = getI2VModelById(params.model);
        const endpoint = modelInfo?.endpoint || params.model;

        const finalPayload = {};

        if (params.prompt) finalPayload.prompt = params.prompt;

        const imageField = modelInfo?.imageField || 'image_url';
        if (params.image_url) {
            if (imageField === 'images_list') {
                finalPayload.images_list = [params.image_url];
            } else {
                finalPayload[imageField] = params.image_url;
            }
        }

        if (params.aspect_ratio) finalPayload.aspect_ratio = params.aspect_ratio;
        if (params.duration) finalPayload.duration = params.duration;
        if (params.resolution) finalPayload.resolution = params.resolution;
        if (params.quality) finalPayload.quality = params.quality;

        try {
            const response = await fetch(this.proxyUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    endpoint,
                    params: finalPayload,
                    generationType: 'i2v',
                    studioType: params.studioType || 'video'
                }),
                signal
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`API Request Failed: ${response.status} ${response.statusText} - ${errText.slice(0, 100)}`);
            }

            const submitData = await response.json();
            this.validateResponse(submitData, 'submit');

            const requestId = submitData.request_id || submitData.id;
            if (!requestId) return submitData;

            const result = await this.pollForResult(requestId, 120, 2000, signal);
            const videoUrl = result.outputs?.[0] || result.url || result.output?.url;
            return { ...result, url: videoUrl };
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('Request cancelled by user');
            }
            throw error;
        }
    }

    async uploadFile(file) {
        return uploadFileToStorage(file);
    }

    async processV2V(params, signal) {
        const modelInfo = getV2VModelById(params.model);
        const endpoint = modelInfo?.endpoint || params.model;

        const videoField = modelInfo?.videoField || 'video_url';
        const finalPayload = { [videoField]: params.video_url };

        try {
            const response = await fetch(this.proxyUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    endpoint,
                    params: finalPayload,
                    generationType: 'v2v',
                    studioType: params.studioType || 'upscale'
                }),
                signal
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`API Request Failed: ${response.status} ${response.statusText} - ${errText.slice(0, 100)}`);
            }

            const submitData = await response.json();
            this.validateResponse(submitData, 'submit');

            const requestId = submitData.request_id || submitData.id;
            if (!requestId) return submitData;

            const result = await this.pollForResult(requestId, 120, 2000, signal);
            const videoUrl = result.outputs?.[0] || result.url || result.output?.url;
            return { ...result, url: videoUrl };
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('Request cancelled by user');
            }
            throw error;
        }
    }

    async generateAvatar(params, signal) {
        const finalPayload = {};

        if (params.model) finalPayload.model = params.model;
        if (params.video_url) finalPayload.video_url = params.video_url;
        if (params.audio_url) finalPayload.audio_url = params.audio_url;
        if (params.prompt) finalPayload.prompt = params.prompt;

        try {
            const response = await fetch(this.proxyUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    endpoint: 'avatar',
                    params: finalPayload,
                    generationType: 'avatar',
                    studioType: 'avatar'
                }),
                signal
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`API Request Failed: ${response.status} ${response.statusText} - ${errText.slice(0, 100)}`);
            }

            const submitData = await response.json();
            this.validateResponse(submitData, 'submit');

            const requestId = submitData.request_id || submitData.id;
            if (!requestId) return submitData;

            const result = await this.pollForResult(requestId, 120, 2000, signal);
            const videoUrl = result.outputs?.[0] || result.url || result.output?.url;
            return { ...result, url: videoUrl };
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('Request cancelled by user');
            }
            throw error;
        }
    }

    async generateAudio(params, signal) {
        const finalPayload = {};

        if (params.model) finalPayload.model = params.model;
        if (params.prompt) finalPayload.prompt = params.prompt;
        if (params.duration) finalPayload.duration = params.duration;
        if (params.style) finalPayload.style = params.style;

        try {
            const response = await fetch(this.proxyUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    endpoint: 'audio',
                    params: finalPayload,
                    generationType: 'audio',
                    studioType: 'audio'
                }),
                signal
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`API Request Failed: ${response.status} ${response.statusText} - ${errText.slice(0, 100)}`);
            }

            const submitData = await response.json();
            this.validateResponse(submitData, 'submit');

            const requestId = submitData.request_id || submitData.id;
            if (!requestId) return submitData;

            const result = await this.pollForResult(requestId, 120, 2000, signal);
            const audioUrl = result.outputs?.[0] || result.url || result.output?.url;
            return { ...result, url: audioUrl };
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('Request cancelled by user');
            }
            throw error;
        }
    }

    async generateText(params, signal) {
        const finalPayload = {};

        if (params.model) finalPayload.model = params.model;
        if (params.prompt) finalPayload.prompt = params.prompt;
        if (params.system_prompt) finalPayload.system_prompt = params.system_prompt;
        if (params.temperature) finalPayload.temperature = params.temperature;
        if (params.max_tokens) finalPayload.max_tokens = params.max_tokens;

        try {
            const response = await fetch(this.proxyUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    endpoint: 'text',
                    params: finalPayload,
                    generationType: 'text',
                    studioType: 'chat'
                }),
                signal
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`API Request Failed: ${response.status} ${response.statusText} - ${errText.slice(0, 100)}`);
            }

            const data = await response.json();
            this.validateResponse(data, 'text');
            return data;
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('Request cancelled by user');
            }
            throw error;
        }
    }

    async trainLora(params, signal) {
        const finalPayload = {};

        if (params.images) finalPayload.images = params.images;
        if (params.trigger_word) finalPayload.trigger_word = params.trigger_word;
        if (params.epochs) finalPayload.epochs = params.epochs;

        try {
            const response = await fetch(this.proxyUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    endpoint: 'train',
                    params: finalPayload,
                    generationType: 'train',
                    studioType: 'training'
                }),
                signal
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`API Request Failed: ${response.status} ${response.statusText} - ${errText.slice(0, 100)}`);
            }

            const submitData = await response.json();
            this.validateResponse(submitData, 'submit');

            const requestId = submitData.request_id || submitData.id;
            if (!requestId) return submitData;

            const result = await this.pollForResult(requestId, 300, 5000, signal);
            return result;
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('Request cancelled by user');
            }
            throw error;
        }
    }

    async processVideoTool(params, signal) {
        const finalPayload = {};

        if (params.model) finalPayload.model = params.model;
        if (params.video_url) finalPayload.video_url = params.video_url;
        if (params.prompt) finalPayload.prompt = params.prompt;

        try {
            const response = await fetch(this.proxyUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    endpoint: 'video-tool',
                    params: finalPayload,
                    generationType: 'video-tool',
                    studioType: 'video-tools'
                }),
                signal
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`API Request Failed: ${response.status} ${response.statusText} - ${errText.slice(0, 100)}`);
            }

            const submitData = await response.json();
            this.validateResponse(submitData, 'submit');

            const requestId = submitData.request_id || submitData.id;
            if (!requestId) return submitData;

            const result = await this.pollForResult(requestId, 120, 2000, signal);
            const videoUrl = result.outputs?.[0] || result.url || result.output?.url;
            return { ...result, url: videoUrl };
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('Request cancelled by user');
            }
            throw error;
        }
    }

    async processLipSync(params) {
        const key = this.getKey();
        const modelInfo = getLipSyncModelById(params.model);
        const endpoint = modelInfo?.endpoint || params.model;
        const url = `${this.baseUrl}/api/v1/${endpoint}`;

        const finalPayload = {};

        if (params.audio_url) finalPayload.audio_url = params.audio_url;
        if (params.image_url) finalPayload.image_url = params.image_url;
        if (params.video_url) finalPayload.video_url = params.video_url;
        if (params.prompt) finalPayload.prompt = params.prompt;
        if (params.resolution) finalPayload.resolution = params.resolution;
        if (params.seed !== undefined && params.seed !== -1) finalPayload.seed = params.seed;


        console.log('[Muapi] LipSync Request:', url);
        console.log('[Muapi] LipSync Payload:', finalPayload);

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-api-key': key },
                body: JSON.stringify(finalPayload)
            });

            if (!response.ok) {
                const errText = await response.text();
                console.error('[Muapi] LipSync API Error:', errText);
                throw new Error(`API Request Failed: ${response.status} ${response.statusText} - ${errText.slice(0, 100)}`);
            }

            const submitData = await response.json();
            console.log('[Muapi] LipSync Submit Response:', submitData);

            const requestId = submitData.request_id || submitData.id;
            if (!requestId) return submitData;

            if (params.onRequestId) params.onRequestId(requestId);

            const result = await this.pollForResult(requestId, key, 900, 2000);
            const videoUrl = result.outputs?.[0] || result.url || result.output?.url;
            console.log('[Muapi] LipSync Result URL:', videoUrl);
            return { ...result, url: videoUrl };
        } catch (error) {
            console.error('Muapi LipSync Error:', error);
            throw error;
        }
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

export default MuapiClient;

export const muapi = new MuapiClient();
