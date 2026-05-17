const fs = require('fs');
const path = require('path');

const COMFYUI_MODEL_HINTS = {
    '__llm__': [
        'models/text_encoders/Qwen3-4B-Instruct-2507-UD-Q4_K_XL.gguf',
    ],
    '__vae__': [
        'models/vae/ae.safetensors',
    ],
    'anything-v5': [
        'models/checkpoints/Anything-v5.0-PRT.safetensors',
    ],
    'dreamshaper-8': [
        'models/checkpoints/DreamShaper_8_pruned.safetensors',
    ],
    'realistic-vision-v51': [
        'models/checkpoints/Realistic_Vision_V5.1_fp16-no-ema.safetensors',
        'models/checkpoints/realisticVisionV51_v51VAE.safetensors',
    ],
    'stable-diffusion-xl-base': [
        'models/checkpoints/sd_xl_base_1.0.safetensors',
    ],
    'z-image-base': [
        'models/checkpoints/Z-Image-Q4_K_M.gguf',
        'models/diffusion_models/Z-Image-Q4_K_M.gguf',
    ],
    'z-image-turbo': [
        'models/checkpoints/z_image_turbo-Q4_K.gguf',
        'models/diffusion_models/z_image_turbo-Q4_K.gguf',
    ],
};

function uniq(items) {
    return [...new Set(items.filter(Boolean))];
}

function getComfyUiSearchPaths({ modelId, filename }) {
    const hints = COMFYUI_MODEL_HINTS[modelId] || [];
    const generic = filename ? [
        `models/checkpoints/${filename}`,
        `models/diffusion_models/${filename}`,
        `models/text_encoders/${filename}`,
        `models/vae/${filename}`,
    ] : [];

    return uniq([...hints, ...generic]);
}

function findComfyUiModelSource({
    comfyUiPath,
    modelId,
    filename,
    existsSync = fs.existsSync,
} = {}) {
    if (!comfyUiPath) return null;

    for (const relativePath of getComfyUiSearchPaths({ modelId, filename })) {
        const absolutePath = path.join(comfyUiPath, relativePath);
        if (existsSync(absolutePath)) {
            return absolutePath;
        }
    }

    return null;
}

module.exports = {
    COMFYUI_MODEL_HINTS,
    findComfyUiModelSource,
    getComfyUiSearchPaths,
};
