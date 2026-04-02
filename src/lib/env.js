/**
 * Environment Variable Validation
 * Validates required environment variables on application startup
 */

import { logger } from './logger.js';

// Required environment variables
const REQUIRED_VARS = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY'
];

// Optional environment variables with defaults
const OPTIONAL_VARS = {
    'VITE_LOG_LEVEL': 'INFO',
    'VITE_ENABLE_ANALYTICS': 'false',
    'VITE_ENABLE_ERROR_TRACKING': 'false',
    'VITE_APP_VERSION': '1.0.0',
    'VITE_API_TIMEOUT': '30000',
    'VITE_MAX_UPLOAD_SIZE': '10485760'
};

// Validation rules for specific variables
const VALIDATION_RULES = {
    'VITE_SUPABASE_URL': {
        pattern: /^https:\/\/.+\.supabase\.co$/,
        message: 'Must be a valid Supabase URL (https://*.supabase.co)'
    },
    'VITE_SUPABASE_ANON_KEY': {
        pattern: /^eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/,
        message: 'Must be a valid JWT token'
    },
    'VITE_LOG_LEVEL': {
        values: ['DEBUG', 'INFO', 'WARN', 'ERROR'],
        message: 'Must be one of: DEBUG, INFO, WARN, ERROR'
    }
};

/**
 * Validate a single environment variable
 * @param {string} key - Variable name
 * @param {string} value - Variable value
 * @param {Object} rule - Validation rule
 * @returns {Object} - {valid: boolean, error?: string}
 */
function validateVar(key, value, rule) {
    if (!value) {
        return { valid: false, error: `${key} is not set` };
    }
    
    if (rule.pattern && !rule.pattern.test(value)) {
        return { valid: false, error: `${key}: ${rule.message}` };
    }
    
    if (rule.values && !rule.values.includes(value)) {
        return { valid: false, error: `${key}: ${rule.message}` };
    }
    
    return { valid: true };
}

/**
 * Validate all required environment variables
 * @returns {Object} - {valid: boolean, errors: string[], warnings: string[]}
 */
export function validateEnv() {
    const errors = [];
    const warnings = [];
    
    // Check required variables
    for (const varName of REQUIRED_VARS) {
        const value = import.meta.env[varName];
        
        if (!value) {
            errors.push(`Missing required environment variable: ${varName}`);
            continue;
        }
        
        // Validate against rules if they exist
        if (VALIDATION_RULES[varName]) {
            const result = validateVar(varName, value, VALIDATION_RULES[varName]);
            if (!result.valid) {
                errors.push(result.error);
            }
        }
    }
    
    // Check optional variables and apply defaults
    for (const [varName, defaultValue] of Object.entries(OPTIONAL_VARS)) {
        const value = import.meta.env[varName];
        
        if (!value) {
            warnings.push(`Optional variable ${varName} not set, using default: ${defaultValue}`);
            import.meta.env[varName] = defaultValue;
            continue;
        }
        
        // Validate against rules if they exist
        if (VALIDATION_RULES[varName]) {
            const result = validateVar(varName, value, VALIDATION_RULES[varName]);
            if (!result.valid) {
                warnings.push(`${result.error}, using default: ${defaultValue}`);
                import.meta.env[varName] = defaultValue;
            }
        }
    }
    
    return {
        valid: errors.length === 0,
        errors,
        warnings
    };
}

/**
 * Get environment variable with fallback
 * @param {string} key - Variable name
 * @param {any} fallback - Fallback value
 * @returns {any} - Variable value or fallback
 */
export function getEnv(key, fallback = null) {
    const value = import.meta.env[key];
    return value !== undefined ? value : fallback;
}

/**
 * Get boolean environment variable
 * @param {string} key - Variable name
 * @param {boolean} fallback - Fallback value
 * @returns {boolean} - Boolean value
 */
export function getEnvBool(key, fallback = false) {
    const value = getEnv(key);
    if (value === undefined) return fallback;
    return value === 'true' || value === '1';
}

/**
 * Get number environment variable
 * @param {string} key - Variable name
 * @param {number} fallback - Fallback value
 * @returns {number} - Number value
 */
export function getEnvNumber(key, fallback = 0) {
    const value = getEnv(key);
    if (value === undefined) return fallback;
    const num = Number(value);
    return isNaN(num) ? fallback : num;
}

/**
 * Initialize and validate environment
 * Call this at application startup
 * @returns {boolean} - True if environment is valid
 */
export function initEnv() {
    const result = validateEnv();
    
    // Log warnings
    for (const warning of result.warnings) {
        logger.warn(warning);
    }
    
    // Log errors
    for (const error of result.errors) {
        logger.error(error);
    }
    
    if (!result.valid) {
        logger.fatal('Environment validation failed. Application may not function correctly.');
    }
    
    return result.valid;
}

export default {
    validateEnv,
    getEnv,
    getEnvBool,
    getEnvNumber,
    initEnv
};
