import { getNovitaImageModelById, getNovitaVideoModelById } from './models.js';

const SUPPORTED_NOVITA_I2V_MODELS = new Set(['SVD', 'SVD-XT']);

const dataUrlToBase64 = (dataUrl) => {
    const parts = String(dataUrl).split(',');
    return parts.length > 1 ? parts[1] : '';
};

const blobToBase64 = (blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(dataUrlToBase64(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(blob);
});

export class NovitaClient {
    constructor() {
        this.baseUrl = 'https://api.novita.ai/v3/async';
    }

    getKey() {
        const key = localStorage.getItem('novita_api_key');
        if (!key) throw new Error('Novita API Key missing. Please set it in Settings.');
        return key;
    }

    getDimensionsFromAR(ar) {
        switch (ar) {
            case '1:1': return [1024, 1024];
            case '16:9': return [1280, 720];
            case '9:16': return [720, 1280];
            case '4:3': return [1152, 864];
            case '3:4': return [864, 1152];
            case '3:2': return [1216, 832];
            case '2:3': return [832, 1216];
            case '21:9': return [1536, 640];
            default: return [1024, 1024];
        }
    }

    applyResolution(payload, resolution) {
        if (resolution === '1k') {
            payload.width = 1024;
            payload.height = 1024;
        } else if (resolution === '2k') {
            payload.width = 1440;
            payload.height = 1440;
        } else if (resolution === '4k') {
            payload.width = 2048;
            payload.height = 2048;
        }
    }

    normalizeResult(data, taskId = null) {
        const imageUrl = data?.images?.[0]?.image_url;
        const videoUrl = data?.videos?.[0]?.video_url;
        const url = imageUrl || videoUrl || data?.url || null;
        const outputs = url ? [url] : (data?.outputs || []);
        return {
            ...data,
            id: taskId || data?.task?.task_id || data?.id,
            request_id: taskId || data?.task?.task_id || data?.request_id,
            url,
            outputs
        };
    }

    async convertImageUrlToBase64(imageUrl) {
        if (!imageUrl) return null;
        if (imageUrl.startsWith('data:')) return dataUrlToBase64(imageUrl);

        const response = await fetch(imageUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch source image: ${response.status}`);
        }
        const blob = await response.blob();
        return blobToBase64(blob);
    }

    async submitTask(path, payload, key) {
        const url = `${this.baseUrl}/${path}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${key}`
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`API Request Failed: ${response.status} ${response.statusText} - ${errText.slice(0, 140)}`);
        }

        const data = await response.json();
        const taskId = data.task_id;
        if (!taskId) throw new Error('Novita async API did not return task_id.');
        return taskId;
    }

    async pollTaskResult(taskId, key, maxAttempts = 180, interval = 2000) {
        const url = `${this.baseUrl}/task-result?task_id=${encodeURIComponent(taskId)}`;

        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            await new Promise(resolve => setTimeout(resolve, interval));

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${key}`
                }
            });

            if (!response.ok) {
                const errText = await response.text();
                if (response.status >= 500) continue;
                throw new Error(`Poll Failed: ${response.status} - ${errText.slice(0, 140)}`);
            }

            const data = await response.json();
            const status = data?.task?.status;

            if (status === 'TASK_STATUS_SUCCEED') return this.normalizeResult(data, taskId);
            if (status === 'TASK_STATUS_FAILED') {
                throw new Error(`Generation failed: ${data?.task?.reason || 'Unknown error'}`);
            }
        }

        throw new Error('Generation timed out after polling.');
    }

    async generateImage(params) {
        const key = this.getKey();
        const modelInfo = getNovitaImageModelById(params.model);
        const modelName = modelInfo?.endpoint || 'seedream-5.0-lite';

        const request = {
            model_name: modelName,
            prompt: params.prompt,
            width: 1024,
            height: 1024,
            image_num: 1,
            steps: params.steps || 20,
            guidance_scale: params.guidance_scale || 7.5,
            sampler_name: params.sampler_name || 'Euler a'
        };

        if (params.aspect_ratio) {
            const [width, height] = this.getDimensionsFromAR(params.aspect_ratio);
            request.width = width;
            request.height = height;
        }
        if (params.resolution) this.applyResolution(request, params.resolution);
        if (params.negative_prompt) request.negative_prompt = params.negative_prompt;
        if (typeof params.seed === 'number') request.seed = params.seed;

        const taskId = await this.submitTask('txt2img', { request }, key);
        if (params.onRequestId) params.onRequestId(taskId);

        const result = await this.pollTaskResult(taskId, key);
        return this.normalizeResult(result, taskId);
    }

    async generateVideo(params) {
        const key = this.getKey();
        const modelInfo = getNovitaVideoModelById(params.model);
        const modelName = modelInfo?.endpoint || 'kling-v3.0-pro-t2v';

        let width = 1024;
        let height = 576;
        if (params.aspect_ratio) {
            [width, height] = this.getDimensionsFromAR(params.aspect_ratio);
        }

        const duration = Number(params.duration) || 5;
        const frames = Math.max(8, Math.min(128, duration * 16));

        const payload = {
            model_name: modelName,
            width,
            height,
            steps: params.steps || 20,
            prompts: [{ frames, prompt: params.prompt || 'Generate a high quality video.' }]
        };

        if (params.negative_prompt) payload.negative_prompt = params.negative_prompt;
        if (typeof params.seed === 'number') payload.seed = params.seed;
        if (params.resolution) this.applyResolution(payload, params.resolution);

        const taskId = await this.submitTask('txt2video', payload, key);
        if (params.onRequestId) params.onRequestId(taskId);

        const result = await this.pollTaskResult(taskId, key, 360, 2500);
        return this.normalizeResult(result, taskId);
    }

    async generateI2I(params) {
        const imageBase64 = params.image_base64 || await this.convertImageUrlToBase64(params.image_url);
        if (!imageBase64) {
            throw new Error('Novita i2i requires image_base64 or image_url.');
        }

        const key = this.getKey();
        const modelInfo = getNovitaImageModelById(params.model);
        const modelName = modelInfo?.endpoint || 'seedream-5.0-lite';

        const request = {
            model_name: modelName,
            image_base64: imageBase64,
            prompt: params.prompt || '',
            width: 1024,
            height: 1024,
            image_num: 1,
            steps: params.steps || 20,
            guidance_scale: params.guidance_scale || 7.5,
            sampler_name: params.sampler_name || 'Euler a'
        };

        if (params.aspect_ratio) {
            const [width, height] = this.getDimensionsFromAR(params.aspect_ratio);
            request.width = width;
            request.height = height;
        }
        if (params.resolution) this.applyResolution(request, params.resolution);
        if (typeof params.seed === 'number') request.seed = params.seed;

        const taskId = await this.submitTask('img2img', { request }, key);
        if (params.onRequestId) params.onRequestId(taskId);

        const result = await this.pollTaskResult(taskId, key);
        return this.normalizeResult(result, taskId);
    }

    async generateI2V(params) {
        const imageBase64 = params.image_base64 || await this.convertImageUrlToBase64(params.image_url);
        if (!imageBase64) {
            throw new Error('Novita i2v requires image_base64 or image_url.');
        }

        const key = this.getKey();
        const modelName = SUPPORTED_NOVITA_I2V_MODELS.has(params.model) ? params.model : 'SVD-XT';

        const payload = {
            model_name: modelName,
            image_file: imageBase64,
            frames_num: modelName === 'SVD' ? 14 : 25,
            frames_per_second: 6,
            image_file_resize_mode: 'CROP_TO_ASPECT_RATIO',
            steps: params.steps || 20
        };
        if (typeof params.seed === 'number') payload.seed = params.seed;

        const taskId = await this.submitTask('img2video', payload, key);
        if (params.onRequestId) params.onRequestId(taskId);

        const result = await this.pollTaskResult(taskId, key, 360, 2500);
        return this.normalizeResult(result, taskId);
    }

    async uploadFile(file) {
        if (!file || !file.type?.startsWith('image/')) {
            throw new Error('Novita upload only supports image files in this adapter.');
        }

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result));
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    async processV2V() {
        throw new Error('Novita V2V is not implemented in this project yet. Please switch provider to Muapi for V2V.');
    }

    async processLipSync() {
        throw new Error('Novita LipSync is not implemented in this project yet. Please switch provider to Muapi for LipSync.');
    }
}

export const novita = new NovitaClient();
