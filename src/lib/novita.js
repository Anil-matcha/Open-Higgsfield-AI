import { getModelById, getVideoModelById, getI2IModelById, getI2VModelById, getV2VModelById, getLipSyncModelById } from './models.js';

export class NovitaClient {
    constructor() {
        this.baseUrl = 'https://api.novita.ai/openai';
    }

    getKey() {
        const key = localStorage.getItem('novita_api_key');
        if (!key) throw new Error('API Key missing. Please set it in Settings.');
        return key;
    }

    /**
     * Generates an image (Text-to-Image or Image-to-Image)
     * @param {Object} params
     * @param {string} params.model - Model ID (e.g., 'deepseek/deepseek-v3.2')
     * @param {string} params.prompt
     * @param {string} params.negative_prompt
     * @param {string} params.aspect_ratio
     * @param {number} params.steps
     * @param {number} params.guidance_scale
     * @param {number} params.seed
     * @param {string} [params.image_url] - If present, treats as Image-to-Image
     */
    async generateImage(params) {
        const key = this.getKey();

        // Resolve endpoint from model definition (if available)
        const modelInfo = getModelById(params.model);
        const endpoint = modelInfo?.endpoint || params.model;
        const url = `${this.baseUrl}/images/generations`;

        // Build payload matching OpenAI-compatible format
        const finalPayload = {
            model: endpoint,
            prompt: params.prompt,
            n: 1,
        };

        // Aspect ratio → width/height mapping
        if (params.aspect_ratio) {
            const [width, height] = this.getDimensionsFromAR(params.aspect_ratio);
            finalPayload.width = width;
            finalPayload.height = height;
        }

        // Resolution override
        if (params.resolution) {
            if (params.resolution === '1k') {
                finalPayload.width = 1024;
                finalPayload.height = 1024;
            } else if (params.resolution === '2k') {
                finalPayload.width = 1440;
                finalPayload.height = 1440;
            } else if (params.resolution === '4k') {
                finalPayload.width = 2048;
                finalPayload.height = 2048;
            }
        }

        // Quality (used by seedream and similar models)
        if (params.quality) {
            finalPayload.quality = params.quality;
        }

        // Image-to-Image (not directly supported by OpenAI-compatible endpoint,
        // but some providers may have extensions)
        if (params.image_url) {
            finalPayload.image_url = params.image_url;
        }

        // Optional params if supported by model
        if (params.seed && params.seed !== -1) {
            finalPayload.seed = params.seed;
        }

        console.log('[Novita] Requesting:', url);
        console.log('[Novita] Payload:', finalPayload);

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${key}`
                },
                body: JSON.stringify(finalPayload)
            });

            if (!response.ok) {
                const errText = await response.text();
                console.error('[Novita] API Error Body:', errText);
                throw new Error(`API Request Failed: ${response.status} ${response.statusText} - ${errText.slice(0, 100)}`);
            }

            const data = await response.json();
            console.log('[Novita] Response:', data);

            // Extract image URL from OpenAI-compatible response format
            const imageUrl = data.data?.[0]?.url || data.choices?.[0]?.message?.content;
            console.log('[Novita] Image URL:', imageUrl);

            return { ...data, url: imageUrl };

        } catch (error) {
            console.error("Novita Client Error:", error);
            throw error;
        }
    }

    /**
     * Polls the predictions endpoint until the result is ready.
     * @param {string} requestId - The request ID from the submit response
     * @param {string} key - The API key
     * @param {number} maxAttempts - Maximum polling attempts (default 60 = ~2 min)
     * @param {number} interval - Polling interval in ms (default 2000)
     */
    async pollForResult(requestId, key, maxAttempts = 60, interval = 2000) {
        const pollUrl = `${this.baseUrl}/images/${requestId}`;

        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            await new Promise(resolve => setTimeout(resolve, interval));

            console.log(`[Novita] Polling attempt ${attempt}/${maxAttempts}...`);

            try {
                const response = await fetch(pollUrl, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${key}`
                    }
                });

                if (!response.ok) {
                    const errText = await response.text();
                    console.warn(`[Novita] Poll error (${response.status}):`, errText);
                    // Continue polling on non-fatal errors
                    if (response.status >= 500) continue;
                    throw new Error(`Poll Failed: ${response.status} - ${errText.slice(0, 100)}`);
                }

                const data = await response.json();
                console.log('[Novita] Poll Response:', data);

                const status = data.status?.toLowerCase();

                if (status === 'completed' || status === 'succeeded' || status === 'success') {
                    return data;
                }

                if (status === 'failed' || status === 'error') {
                    throw new Error(`Generation failed: ${data.error || 'Unknown error'}`);
                }

                // Otherwise (processing, pending, etc.) keep polling
            } catch (error) {
                if (attempt === maxAttempts) throw error;
                console.warn('[Novita] Poll attempt failed, retrying...', error.message);
            }
        }

        throw new Error('Generation timed out after polling.');
    }

    async generateVideo(params) {
        const key = this.getKey();

        const modelInfo = getVideoModelById(params.model);
        const endpoint = modelInfo?.endpoint || params.model;
        const url = `${this.baseUrl}/videos/generations`;

        const finalPayload = {
            model: endpoint,
            prompt: params.prompt,
            n: 1,
        };

        if (params.aspect_ratio) {
            const [width, height] = this.getDimensionsFromAR(params.aspect_ratio);
            finalPayload.width = width;
            finalPayload.height = height;
        }

        if (params.resolution) {
            if (params.resolution === '1k') {
                finalPayload.width = 1024;
                finalPayload.height = 1024;
            } else if (params.resolution === '2k') {
                finalPayload.width = 1440;
                finalPayload.height = 1440;
            } else if (params.resolution === '4k') {
                finalPayload.width = 2048;
                finalPayload.height = 2048;
            }
        }

        if (params.duration) finalPayload.duration = params.duration;
        if (params.quality) finalPayload.quality = params.quality;

        console.log('[Novita] Video Request:', url);
        console.log('[Novita] Video Payload:', finalPayload);

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${key}`
                },
                body: JSON.stringify(finalPayload)
            });

            if (!response.ok) {
                const errText = await response.text();
                console.error('[Novita] Video API Error Body:', errText);
                throw new Error(`API Request Failed: ${response.status} ${response.statusText} - ${errText.slice(0, 100)}`);
            }

            const data = await response.json();
            console.log('[Novita] Video Response:', data);

            // Extract video URL from response
            const videoUrl = data.data?.[0]?.url || data.choices?.[0]?.message?.content;
            console.log('[Novita] Video URL:', videoUrl);

            return { ...data, url: videoUrl };

        } catch (error) {
            console.error("Novita Video Client Error:", error);
            throw error;
        }
    }

    /**
     * Generates an image using an Image-to-Image model.
     * @param {Object} params
     * @param {string} params.model - i2iModel id
     * @param {string} params.image_url - The uploaded reference image URL
     * @param {string} [params.prompt] - Optional text prompt
     * @param {string} [params.aspect_ratio]
     * @param {string} [params.resolution]
     */
    async generateI2I(params) {
        const key = this.getKey();
        const modelInfo = getI2IModelById(params.model);
        const endpoint = modelInfo?.endpoint || params.model;
        const url = `${this.baseUrl}/images/generations`;

        const finalPayload = {
            model: endpoint,
            prompt: params.prompt || '',
            image_url: params.image_url,
            n: 1,
        };

        if (params.aspect_ratio) {
            const [width, height] = this.getDimensionsFromAR(params.aspect_ratio);
            finalPayload.width = width;
            finalPayload.height = height;
        }

        if (params.resolution) {
            if (params.resolution === '1k') {
                finalPayload.width = 1024;
                finalPayload.height = 1024;
            } else if (params.resolution === '2k') {
                finalPayload.width = 1440;
                finalPayload.height = 1440;
            } else if (params.resolution === '4k') {
                finalPayload.width = 2048;
                finalPayload.height = 2048;
            }
        }

        if (params.quality) finalPayload.quality = params.quality;

        console.log('[Novita] I2I Request:', url);
        console.log('[Novita] I2I Payload:', finalPayload);

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
                body: JSON.stringify(finalPayload)
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`API Request Failed: ${response.status} ${response.statusText} - ${errText.slice(0, 100)}`);
            }

            const data = await response.json();
            console.log('[Novita] I2I Response:', data);

            const imageUrl = data.data?.[0]?.url || data.choices?.[0]?.message?.content;
            console.log('[Novita] I2I Result URL:', imageUrl);
            return { ...data, url: imageUrl };

        } catch (error) {
            console.error('Novita I2I Error:', error);
            throw error;
        }
    }

    /**
     * Generates a video using an Image-to-Video model.
     * @param {Object} params
     * @param {string} params.model - i2vModel id
     * @param {string} params.image_url - The uploaded start frame image URL
     * @param {string} [params.prompt]
     * @param {string} [params.aspect_ratio]
     * @param {string} [params.resolution]
     * @param {number} [params.duration]
     * @param {string} [params.quality]
     */
    async generateI2V(params) {
        const key = this.getKey();
        const modelInfo = getI2VModelById(params.model);
        const endpoint = modelInfo?.endpoint || params.model;
        const url = `${this.baseUrl}/videos/generations`;

        const finalPayload = {
            model: endpoint,
            prompt: params.prompt || '',
            image_url: params.image_url,
            n: 1,
        };

        if (params.aspect_ratio) {
            const [width, height] = this.getDimensionsFromAR(params.aspect_ratio);
            finalPayload.width = width;
            finalPayload.height = height;
        }

        if (params.resolution) {
            if (params.resolution === '1k') {
                finalPayload.width = 1024;
                finalPayload.height = 1024;
            } else if (params.resolution === '2k') {
                finalPayload.width = 1440;
                finalPayload.height = 1440;
            } else if (params.resolution === '4k') {
                finalPayload.width = 2048;
                finalPayload.height = 2048;
            }
        }

        if (params.duration) finalPayload.duration = params.duration;
        if (params.quality) finalPayload.quality = params.quality;

        console.log('[Novita] I2V Request:', url);
        console.log('[Novita] I2V Payload:', finalPayload);

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
                body: JSON.stringify(finalPayload)
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`API Request Failed: ${response.status} ${response.statusText} - ${errText.slice(0, 100)}`);
            }

            const data = await response.json();
            console.log('[Novita] I2V Response:', data);

            const videoUrl = data.data?.[0]?.url || data.choices?.[0]?.message?.content;
            console.log('[Novita] I2V Result URL:', videoUrl);
            return { ...data, url: videoUrl };

        } catch (error) {
            console.error('Novita I2V Error:', error);
            throw error;
        }
    }

    /**
     * Uploads a file to novita and returns the hosted URL.
     * @param {File} file - The image file to upload
     * @returns {Promise<string>} The hosted URL of the uploaded file
     */
    async uploadFile(file) {
        const key = this.getKey();
        const url = `${this.baseUrl}/files`;

        const formData = new FormData();
        formData.append('file', file);

        console.log('[Novita] Uploading file:', file.name);

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${key}` },
            body: formData
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`File upload failed: ${response.status} - ${errText.slice(0, 100)}`);
        }

        const data = await response.json();
        console.log('[Novita] Upload response:', data);

        const fileUrl = data.url || data.file_url || data.data?.url;
        if (!fileUrl) throw new Error('No URL returned from file upload');
        return fileUrl;
    }

    /**
     * Processes a video through a Video-to-Video model (e.g. watermark remover).
     * @param {Object} params
     * @param {string} params.model - v2vModel id
     * @param {string} params.video_url - The uploaded video URL
     */
    async processV2V(params) {
        const key = this.getKey();
        const modelInfo = getV2VModelById(params.model);
        const endpoint = modelInfo?.endpoint || params.model;
        const url = `${this.baseUrl}/videos/generations`;

        const finalPayload = {
            model: endpoint,
            video_url: params.video_url,
            n: 1,
        };

        console.log('[Novita] V2V Request:', url);
        console.log('[Novita] V2V Payload:', finalPayload);

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
                body: JSON.stringify(finalPayload)
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`API Request Failed: ${response.status} ${response.statusText} - ${errText.slice(0, 100)}`);
            }

            const data = await response.json();
            console.log('[Novita] V2V Response:', data);

            const videoUrl = data.data?.[0]?.url || data.choices?.[0]?.message?.content;
            console.log('[Novita] V2V Result URL:', videoUrl);
            return { ...data, url: videoUrl };
        } catch (error) {
            console.error('Novita V2V Error:', error);
            throw error;
        }
    }

    /**
     * Processes lipsync / speech-to-video generation.
     * Supports image+audio → video and video+audio → video models.
     * @param {Object} params
     * @param {string} params.model - lipsyncModel id
     * @param {string} [params.image_url] - Portrait image URL (image-based models)
     * @param {string} [params.video_url] - Source video URL (video-based models)
     * @param {string} params.audio_url - Audio file URL
     * @param {string} [params.prompt] - Optional prompt (for models that support it)
     * @param {string} [params.resolution] - Output resolution
     */
    async processLipSync(params) {
        const key = this.getKey();
        const modelInfo = getLipSyncModelById(params.model);
        const endpoint = modelInfo?.endpoint || params.model;
        const url = `${this.baseUrl}/videos/generations`;

        const finalPayload = {
            model: endpoint,
            audio_url: params.audio_url,
            n: 1,
        };

        if (params.image_url) finalPayload.image_url = params.image_url;
        if (params.video_url) finalPayload.video_url = params.video_url;
        if (params.prompt) finalPayload.prompt = params.prompt;
        if (params.resolution) finalPayload.resolution = params.resolution;

        console.log('[Novita] LipSync Request:', url);
        console.log('[Novita] LipSync Payload:', finalPayload);

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
                body: JSON.stringify(finalPayload)
            });

            if (!response.ok) {
                const errText = await response.text();
                console.error('[Novita] LipSync API Error:', errText);
                throw new Error(`API Request Failed: ${response.status} ${response.statusText} - ${errText.slice(0, 100)}`);
            }

            const data = await response.json();
            console.log('[Novita] LipSync Response:', data);

            const videoUrl = data.data?.[0]?.url || data.choices?.[0]?.message?.content;
            console.log('[Novita] LipSync Result URL:', videoUrl);
            return { ...data, url: videoUrl };
        } catch (error) {
            console.error('Novita LipSync Error:', error);
            throw error;
        }
    }

    getDimensionsFromAR(ar) {
        // Base unit 1024 (Flux standard)
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

export const novita = new NovitaClient();
