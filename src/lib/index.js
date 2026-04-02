/**
 * Library Exports
 * Central export point for all utility libraries
 */

// Security utilities
export {
    safeSetText,
    createSafeElement,
    createSafeImage,
    createSafeVideo,
    createSafeSVG,
    createSafeButton,
    setChildren,
    createSafeCard,
    escapeHtml,
    safeHtml,
    sanitizeUrl,
    validateFileUpload,
    generateSecureId,
    sanitizeForSerialization
} from './security.js';

// Input validation
export {
    ValidationError,
    validatePrompt,
    validateUrl,
    validateNumber,
    validateFile,
    validateParams,
    FILE_LIMITS,
    PATTERNS
} from './validator.js';

// Logging
export { logger } from './logger.js';

// Error handling
export {
    ErrorBoundary,
    withErrorHandling,
    setupGlobalErrorHandlers
} from './errorBoundary.js';

// Performance utilities
export {
    debounce,
    throttle,
    rafThrottle,
    memoize,
    batch,
    lazy,
    createCache
} from './performance.js';

// Environment utilities
export {
    validateEnv,
    getEnv,
    getEnvBool,
    getEnvNumber,
    initEnv
} from './env.js';

// API client
export { ApiClient, api } from './apiClient.js';

// Response schemas
export {
    validateImageGenerationResponse,
    validateVideoGenerationResponse,
    validateTextGenerationResponse,
    validateUserProfileResponse,
    validateResponse,
    isNotErrorResponse
} from './schemas.js';

// Constants
export {
    FILE_LIMITS as FILE_SIZE_LIMITS,
    ALLOWED_TYPES,
    API_CONFIG,
    UI_CONFIG,
    VALIDATION_LIMITS,
    STORAGE_KEYS,
    ROUTES,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES,
    ASPECT_RATIOS,
    VIDEO_DURATIONS,
    QUALITY_PRESETS
} from './constants.js';
