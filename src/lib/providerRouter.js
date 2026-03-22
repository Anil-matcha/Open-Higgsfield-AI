import { muapi } from './muapi.js';
import { novita } from './novita.js';
import { getActiveProvider, getProviderApiKey } from './providerConfig.js';

const CAPABILITIES = {
    muapi: {
        generateImage: true,
        generateVideo: true,
        generateI2I: true,
        generateI2V: true,
        uploadFile: true,
        processV2V: true,
        processLipSync: true,
        pollForResult: true
    },
    novita: {
        generateImage: true,
        generateVideo: true,
        generateI2I: true,
        generateI2V: true,
        uploadFile: true,
        processV2V: false,
        processLipSync: false,
        pollForResult: true
    }
};

const getClient = () => {
    const provider = getActiveProvider();
    return provider === 'novita' ? novita : muapi;
};

const ensureCapability = (method) => {
    const provider = getActiveProvider();
    if (!CAPABILITIES[provider]?.[method]) {
        throw new Error(`${provider} provider does not support ${method} in this project yet.`);
    }
};

const normalizeResult = (res) => {
    const url = res?.url || res?.outputs?.[0] || res?.output?.url || res?.images?.[0]?.image_url || res?.videos?.[0]?.video_url || null;
    return {
        ...res,
        url,
        outputs: res?.outputs || (url ? [url] : [])
    };
};

export const api = {
    getActiveProvider,
    getCapabilities: () => CAPABILITIES[getActiveProvider()],

    async pollForResult(requestId, _apiKey, maxAttempts, interval) {
        ensureCapability('pollForResult');
        const provider = getActiveProvider();

        if (provider === 'novita') {
            const key = getProviderApiKey('novita');
            const res = await novita.pollTaskResult(requestId, key, maxAttempts, interval);
            return normalizeResult(res);
        }

        const key = getProviderApiKey('muapi');
        const res = await muapi.pollForResult(requestId, key, maxAttempts, interval);
        return normalizeResult(res);
    },

    async generateImage(params) {
        ensureCapability('generateImage');
        const res = await getClient().generateImage(params);
        return normalizeResult(res);
    },

    async generateVideo(params) {
        ensureCapability('generateVideo');
        const res = await getClient().generateVideo(params);
        return normalizeResult(res);
    },

    async generateI2I(params) {
        ensureCapability('generateI2I');
        const res = await getClient().generateI2I(params);
        return normalizeResult(res);
    },

    async generateI2V(params) {
        ensureCapability('generateI2V');
        const res = await getClient().generateI2V(params);
        return normalizeResult(res);
    },

    async uploadFile(file) {
        ensureCapability('uploadFile');
        return getClient().uploadFile(file);
    },

    async processV2V(params) {
        ensureCapability('processV2V');
        const res = await getClient().processV2V(params);
        return normalizeResult(res);
    },

    async processLipSync(params) {
        ensureCapability('processLipSync');
        const res = await getClient().processLipSync(params);
        return normalizeResult(res);
    }
};
