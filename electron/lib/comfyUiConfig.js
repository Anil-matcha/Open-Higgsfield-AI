const fs = require('fs');
const os = require('os');
const path = require('path');

function getPathLib(platform) {
    return platform === 'win32' ? path.win32 : path.posix;
}

function normalizeComfyUiPath(value) {
    return typeof value === 'string' ? value.trim() : '';
}

function getDefaultUserDataDir({
    platform = process.platform,
    homeDir = os.homedir(),
    appDataDir = process.env.APPDATA || '',
} = {}) {
    const pathLib = getPathLib(platform);

    if (platform === 'win32') {
        return pathLib.join(appDataDir || pathLib.join(homeDir, 'AppData', 'Roaming'), 'Open Generative AI');
    }
    if (platform === 'darwin') {
        return pathLib.join(homeDir, 'Library', 'Application Support', 'open-generative-ai');
    }
    return pathLib.join(homeDir, '.config', 'open-generative-ai');
}

function getDefaultComfyUiPath({
    platform = process.platform,
    homeDir = os.homedir(),
} = {}) {
    const pathLib = getPathLib(platform);

    if (platform === 'win32') {
        return pathLib.join(homeDir, 'ComfyUI');
    }
    return pathLib.join(homeDir, 'apps', 'ComfyUI');
}

function getComfyUiConfigFile({
    dataDir,
    platform = process.platform,
} = {}) {
    return getPathLib(platform).join(dataDir, 'comfyui.json');
}

function readComfyUiConfig({
    configFile,
    existsSync = fs.existsSync,
    readFileSync = fs.readFileSync,
} = {}) {
    if (!configFile || !existsSync(configFile)) {
        return { path: '' };
    }

    try {
        const parsed = JSON.parse(readFileSync(configFile, 'utf-8'));
        return { path: normalizeComfyUiPath(parsed.path) };
    } catch {
        return { path: '' };
    }
}

function writeComfyUiConfig({
    configFile,
    config,
    mkdirSync = fs.mkdirSync,
    writeFileSync = fs.writeFileSync,
} = {}) {
    mkdirSync(path.dirname(configFile), { recursive: true });
    writeFileSync(configFile, JSON.stringify({
        path: normalizeComfyUiPath(config?.path),
    }, null, 2));
}

function resolveComfyUiPath({
    config = {},
    env = process.env,
    platform = process.platform,
    homeDir = os.homedir(),
} = {}) {
    const envPath = normalizeComfyUiPath(env.OPEN_GENERATIVE_AI_COMFYUI_PATH);
    if (envPath) return envPath;

    const configuredPath = normalizeComfyUiPath(config.path);
    if (configuredPath) return configuredPath;

    return getDefaultComfyUiPath({ platform, homeDir });
}

module.exports = {
    getComfyUiConfigFile,
    getDefaultComfyUiPath,
    getDefaultUserDataDir,
    normalizeComfyUiPath,
    readComfyUiConfig,
    resolveComfyUiPath,
    writeComfyUiConfig,
};
