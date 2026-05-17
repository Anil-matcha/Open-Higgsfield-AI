const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');

const {
    getComfyUiConfigFile,
    getDefaultComfyUiPath,
    resolveComfyUiPath,
} = require('../electron/lib/comfyUiConfig');
const {
    findComfyUiModelSource,
    getComfyUiSearchPaths,
} = require('../electron/lib/comfyUiCatalog');

test('getDefaultComfyUiPath uses apps/ComfyUI on linux', () => {
    const resolved = getDefaultComfyUiPath({
        platform: 'linux',
        homeDir: '/home/joes021',
    });

    assert.equal(resolved, '/home/joes021/apps/ComfyUI');
});

test('resolveComfyUiPath prefers env override, then config, then default', () => {
    const envResolved = resolveComfyUiPath({
        config: { path: '/configured/ComfyUI' },
        env: { OPEN_GENERATIVE_AI_COMFYUI_PATH: '/env/ComfyUI' },
        platform: 'linux',
        homeDir: '/home/joes021',
    });
    const configResolved = resolveComfyUiPath({
        config: { path: '/configured/ComfyUI' },
        env: {},
        platform: 'linux',
        homeDir: '/home/joes021',
    });
    const defaultResolved = resolveComfyUiPath({
        config: {},
        env: {},
        platform: 'linux',
        homeDir: '/home/joes021',
    });

    assert.equal(envResolved, '/env/ComfyUI');
    assert.equal(configResolved, '/configured/ComfyUI');
    assert.equal(defaultResolved, '/home/joes021/apps/ComfyUI');
});

test('getComfyUiConfigFile stores config under the local-ai data dir', () => {
    const configFile = getComfyUiConfigFile({
        dataDir: '/home/joes021/.config/open-generative-ai/local-ai',
        platform: 'linux',
    });

    assert.equal(configFile, '/home/joes021/.config/open-generative-ai/local-ai/comfyui.json');
});

test('getComfyUiSearchPaths includes aliases before generic fallback locations', () => {
    const searchPaths = getComfyUiSearchPaths({
        modelId: 'realistic-vision-v51',
        filename: 'realisticVisionV51_v51VAE.safetensors',
    });

    assert.deepEqual(searchPaths.slice(0, 3), [
        'models/checkpoints/Realistic_Vision_V5.1_fp16-no-ema.safetensors',
        'models/checkpoints/realisticVisionV51_v51VAE.safetensors',
        'models/diffusion_models/realisticVisionV51_v51VAE.safetensors',
    ]);
});

test('findComfyUiModelSource finds supported checkpoint aliases inside ComfyUI', () => {
    const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'comfyui-model-'));
    const comfyUiPath = path.join(tmpRoot, 'ComfyUI');
    const aliasPath = path.join(comfyUiPath, 'models', 'checkpoints', 'Realistic_Vision_V5.1_fp16-no-ema.safetensors');
    fs.mkdirSync(path.dirname(aliasPath), { recursive: true });
    fs.writeFileSync(aliasPath, 'stub');

    const sourcePath = findComfyUiModelSource({
        comfyUiPath,
        modelId: 'realistic-vision-v51',
        filename: 'realisticVisionV51_v51VAE.safetensors',
    });

    assert.equal(sourcePath, aliasPath);
});

test('findComfyUiModelSource finds VAE auxiliary files in the VAE directory', () => {
    const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'comfyui-vae-'));
    const comfyUiPath = path.join(tmpRoot, 'ComfyUI');
    const vaePath = path.join(comfyUiPath, 'models', 'vae', 'ae.safetensors');
    fs.mkdirSync(path.dirname(vaePath), { recursive: true });
    fs.writeFileSync(vaePath, 'stub');

    const sourcePath = findComfyUiModelSource({
        modelId: '__vae__',
        filename: 'ae.safetensors',
        comfyUiPath,
    });

    assert.equal(sourcePath, vaePath);
});
