/**
 * Secure API Key Manager
 * 
 * Provides secure storage and retrieval of API keys.
 * Uses sessionStorage for temporary storage (cleared on tab close)
 * with optional localStorage backup that is obfuscated.
 */

const API_KEY_STORAGE = 'muapi_key';
const API_KEY_HASH_STORAGE = 'muapi_key_hash';

// Simple obfuscation - NOT encryption, but adds a layer against casual reading
const OBFUSCATION_SALT = 'muapi_2024_';

function obfuscate(key) {
    return btoa(OBFUSCATION_SALT + key);
}

function deobfuscate(obfuscated) {
    try {
        const decoded = atob(obfuscated);
        if (decoded.startsWith(OBFUSCATION_SALT)) {
            return decoded.slice(OBFUSCATION_SALT.length);
        }
        return null;
    } catch {
        return null;
    }
}

// Hash the key for quick validation without exposing it
async function hashKey(key) {
    const encoder = new TextEncoder();
    const data = encoder.encode(key);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export class ApiKeyManager {
    constructor() {
        this._cachedKey = null;
        this._cachedHash = null;
        this._listeners = new Set();
    }

    /**
     * Set the API key
     * @param {string} key - The API key
     * @param {boolean} persist - Whether to persist to localStorage (default: true)
     */
    async setKey(key, persist = true) {
        if (!key || typeof key !== 'string') {
            throw new Error('Invalid API key');
        }

        const trimmedKey = key.trim();
        if (trimmedKey.length < 10) {
            throw new Error('API key too short');
        }

        this._cachedKey = trimmedKey;
        this._cachedHash = await hashKey(trimmedKey);

        // Store in sessionStorage (primary - cleared on tab close)
        sessionStorage.setItem(API_KEY_STORAGE, obfuscate(trimmedKey));
        sessionStorage.setItem(API_KEY_HASH_STORAGE, this._cachedHash);

        // Optionally persist to localStorage with obfuscation
        if (persist) {
            localStorage.setItem(API_KEY_STORAGE, obfuscate(trimmedKey));
            localStorage.setItem(API_KEY_HASH_STORAGE, this._cachedHash);
        }

        this._notifyListeners();
    }

    /**
     * Get the API key
     * @returns {string|null}
     */
    getKey() {
        if (this._cachedKey) {
            return this._cachedKey;
        }

        // Try sessionStorage first
        const sessionKey = sessionStorage.getItem(API_KEY_STORAGE);
        if (sessionKey) {
            this._cachedKey = deobfuscate(sessionKey);
            return this._cachedKey;
        }

        // Fall back to localStorage
        const localKey = localStorage.getItem(API_KEY_STORAGE);
        if (localKey) {
            this._cachedKey = deobfuscate(localKey);
            if (this._cachedKey) {
                // Restore to sessionStorage
                sessionStorage.setItem(API_KEY_STORAGE, localKey);
                return this._cachedKey;
            }
        }

        return null;
    }

    /**
     * Check if API key exists (sync, fast)
     */
    hasKey() {
        if (this._cachedKey) return true;
        
        return !!(
            sessionStorage.getItem(API_KEY_STORAGE) ||
            localStorage.getItem(API_KEY_STORAGE)
        );
    }

    /**
     * Validate a key against stored hash
     */
    async validateKey(key) {
        const hash = await hashKey(key);
        const storedHash = this._getStoredHash();
        return hash === storedHash;
    }

    _getStoredHash() {
        return sessionStorage.getItem(API_KEY_HASH_STORAGE) ||
               localStorage.getItem(API_KEY_HASH_STORAGE);
    }

    /**
     * Clear the API key
     */
    clearKey() {
        this._cachedKey = null;
        this._cachedHash = null;
        sessionStorage.removeItem(API_KEY_STORAGE);
        sessionStorage.removeItem(API_KEY_HASH_STORAGE);
        localStorage.removeItem(API_KEY_STORAGE);
        localStorage.removeItem(API_KEY_HASH_STORAGE);
        this._notifyListeners();
    }

    /**
     * Add a listener for key changes
     */
    addListener(callback) {
        this._listeners.add(callback);
        return () => this._listeners.delete(callback);
    }

    _notifyListeners() {
        for (const callback of this._listeners) {
            try {
                callback(this.hasKey());
            } catch (e) {
                console.error('[ApiKeyManager] Listener error:', e);
            }
        }
    }

    /**
     * Migrate old localStorage key to new format
     */
    migrateFromLegacy() {
        const legacyKey = localStorage.getItem('muapi_key');
        if (legacyKey && !localStorage.getItem(API_KEY_STORAGE)) {
            // Clear legacy key first
            localStorage.removeItem('muapi_key');
            // Set in new format
            this.setKey(legacyKey, true).catch(console.error);
            return true;
        }
        return false;
    }
}

export const apiKeyManager = new ApiKeyManager();

// Auto-migrate on load
apiKeyManager.migrateFromLegacy();
