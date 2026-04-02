/**
 * Secure API Client
 * Provides rate limiting, retry logic, and secure request handling
 */

import { logger } from './logger.js';
import { getEnvNumber } from './env.js';

// Rate limiter state
const rateLimiter = {
    requests: [],
    maxRequests: 60,
    windowMs: 60000
};

/**
 * Check if request is within rate limits
 * @returns {boolean} - True if request is allowed
 */
function checkRateLimit() {
    const now = Date.now();
    const windowStart = now - rateLimiter.windowMs;
    
    // Remove old requests outside the window
    rateLimiter.requests = rateLimiter.requests.filter(time => time > windowStart);
    
    if (rateLimiter.requests.length >= rateLimiter.maxRequests) {
        return false;
    }
    
    rateLimiter.requests.push(now);
    return true;
}

/**
 * Wait for rate limit window
 * @returns {Promise} - Resolves when request is allowed
 */
async function waitForRateLimit() {
    while (!checkRateLimit()) {
        const oldestRequest = rateLimiter.requests[0];
        const waitTime = oldestRequest + rateLimiter.windowMs - Date.now() + 100;
        await new Promise(resolve => setTimeout(resolve, waitTime));
    }
}

/**
 * Create an AbortController with timeout
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Object} - {controller, signal, timeoutId}
 */
function createTimeoutController(timeout) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
        controller.abort();
    }, timeout);
    
    return {
        controller,
        signal: controller.signal,
        timeoutId
    };
}

/**
 * Make a secure fetch request with retry logic
 * @param {string} url - Request URL
 * @param {Object} options - Fetch options
 * @returns {Promise} - Response promise
 */
async function secureFetch(url, options = {}) {
    const {
        method = 'GET',
        headers = {},
        body = null,
        timeout = getEnvNumber('VITE_API_TIMEOUT', 30000),
        retries = 2,
        retryDelay = 1000,
        requireAuth = true
    } = options;
    
    // Rate limiting
    if (!checkRateLimit()) {
        logger.warn('Rate limit reached, waiting...');
        await waitForRateLimit();
    }
    
    // Prepare headers
    const requestHeaders = {
        'Content-Type': 'application/json',
        ...headers
    };
    
    // Add auth token if required
    if (requireAuth) {
        const token = localStorage.getItem('auth_token');
        if (token) {
            requestHeaders['Authorization'] = `Bearer ${token}`;
        }
    }
    
    let lastError;
    
    for (let attempt = 0; attempt <= retries; attempt++) {
        const { controller, signal, timeoutId } = createTimeoutController(timeout);
        
        try {
            logger.debug(`API Request: ${method} ${url}`, { attempt: attempt + 1 });
            
            const response = await fetch(url, {
                method,
                headers: requestHeaders,
                body: body ? JSON.stringify(body) : null,
                signal
            });
            
            clearTimeout(timeoutId);
            
            // Handle HTTP errors
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const error = new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
                error.status = response.status;
                error.data = errorData;
                throw error;
            }
            
            const data = await response.json();
            
            logger.debug(`API Response: ${method} ${url}`, { status: response.status });
            
            return { data, status: response.status };
            
        } catch (error) {
            clearTimeout(timeoutId);
            lastError = error;
            
            logger.error(`API Request failed: ${method} ${url}`, {
                attempt: attempt + 1,
                error: error.message
            }, error);
            
            // Don't retry on client errors (4xx) except 429
            if (error.status && error.status >= 400 && error.status < 500 && error.status !== 429) {
                throw error;
            }
            
            // Wait before retry
            if (attempt < retries) {
                const delay = retryDelay * Math.pow(2, attempt);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
    
    throw lastError;
}

/**
 * API Client class
 */
export class ApiClient {
    constructor(baseUrl = '') {
        this.baseUrl = baseUrl;
    }
    
    /**
     * Make a GET request
     * @param {string} endpoint - API endpoint
     * @param {Object} options - Request options
     * @returns {Promise} - Response promise
     */
    async get(endpoint, options = {}) {
        return secureFetch(`${this.baseUrl}${endpoint}`, {
            ...options,
            method: 'GET'
        });
    }
    
    /**
     * Make a POST request
     * @param {string} endpoint - API endpoint
     * @param {Object} data - Request body
     * @param {Object} options - Request options
     * @returns {Promise} - Response promise
     */
    async post(endpoint, data, options = {}) {
        return secureFetch(`${this.baseUrl}${endpoint}`, {
            ...options,
            method: 'POST',
            body: data
        });
    }
    
    /**
     * Make a PUT request
     * @param {string} endpoint - API endpoint
     * @param {Object} data - Request body
     * @param {Object} options - Request options
     * @returns {Promise} - Response promise
     */
    async put(endpoint, data, options = {}) {
        return secureFetch(`${this.baseUrl}${endpoint}`, {
            ...options,
            method: 'PUT',
            body: data
        });
    }
    
    /**
     * Make a DELETE request
     * @param {string} endpoint - API endpoint
     * @param {Object} options - Request options
     * @returns {Promise} - Response promise
     */
    async delete(endpoint, options = {}) {
        return secureFetch(`${this.baseUrl}${endpoint}`, {
            ...options,
            method: 'DELETE'
        });
    }
}

// Create default client instance
export const api = new ApiClient();

export default ApiClient;
