const ACTIVE_PROVIDER_KEY = 'active_provider';

const PROVIDERS = {
    muapi: {
        id: 'muapi',
        name: 'Muapi',
        storageKey: 'muapi_key',
        website: 'https://muapi.ai'
    },
    novita: {
        id: 'novita',
        name: 'Novita',
        storageKey: 'novita_api_key',
        website: 'https://novita.ai'
    }
};

export const DEFAULT_PROVIDER = 'muapi';

export const getProviders = () => Object.values(PROVIDERS);

export const isValidProvider = (provider) => Boolean(PROVIDERS[provider]);

export const getProviderMeta = (provider = DEFAULT_PROVIDER) => PROVIDERS[provider] || PROVIDERS[DEFAULT_PROVIDER];

export const getProviderStorageKey = (provider = DEFAULT_PROVIDER) => getProviderMeta(provider).storageKey;

export const getActiveProvider = () => {
    const provider = localStorage.getItem(ACTIVE_PROVIDER_KEY) || DEFAULT_PROVIDER;
    return isValidProvider(provider) ? provider : DEFAULT_PROVIDER;
};

export const setActiveProvider = (provider) => {
    if (!isValidProvider(provider)) throw new Error(`Unknown provider: ${provider}`);
    localStorage.setItem(ACTIVE_PROVIDER_KEY, provider);
};

export const getProviderApiKey = (provider = getActiveProvider()) => {
    const storageKey = getProviderStorageKey(provider);
    return localStorage.getItem(storageKey) || '';
};

export const hasProviderApiKey = (provider = getActiveProvider()) => Boolean(getProviderApiKey(provider));

export const hasActiveProviderKey = () => hasProviderApiKey(getActiveProvider());
