/**
 * Application Constants
 * Centralized location for magic numbers, strings, and configuration
 */

// File size limits (in bytes)
export const FILE_LIMITS = {
    MAX_IMAGE_SIZE: 10 * 1024 * 1024,      // 10MB
    MAX_VIDEO_SIZE: 100 * 1024 * 1024,     // 100MB
    MAX_AUDIO_SIZE: 50 * 1024 * 1024,      // 50MB
    MAX_DOCUMENT_SIZE: 25 * 1024 * 1024,   // 25MB
    CHUNK_SIZE: 1024 * 1024                 // 1MB for uploads
};

// Allowed file types
export const ALLOWED_TYPES = {
    IMAGES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    VIDEOS: ['video/mp4', 'video/webm', 'video/quicktime'],
    AUDIO: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/webm'],
    DOCUMENTS: ['application/pdf', 'text/plain', 'application/json']
};

// API configuration
export const API_CONFIG = {
    TIMEOUT: 30000,                         // 30 seconds
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000,                      // 1 second
    POLL_INTERVAL: 2000,                    // 2 seconds
    MAX_POLL_ATTEMPTS: 120                  // 4 minutes max
};

// UI configuration
export const UI_CONFIG = {
    TOAST_DURATION: 5000,                   // 5 seconds
    DEBOUNCE_DELAY: 300,                    // 300ms
    ANIMATION_DURATION: 300,                // 300ms
    MOBILE_BREAKPOINT: 768,                 // pixels
    SIDEBAR_WIDTH: 280,                     // pixels
    HEADER_HEIGHT: 64                       // pixels
};

// Validation limits
export const VALIDATION_LIMITS = {
    PROMPT_MIN_LENGTH: 1,
    PROMPT_MAX_LENGTH: 4096,
    NAME_MIN_LENGTH: 1,
    NAME_MAX_LENGTH: 100,
    EMAIL_MAX_LENGTH: 254,
    PASSWORD_MIN_LENGTH: 8,
    PASSWORD_MAX_LENGTH: 128
};

// Storage keys
export const STORAGE_KEYS = {
    AUTH_TOKEN: 'auth_token',
    USER_PREFERENCES: 'user_preferences',
    THEME: 'app_theme',
    RECENT_PROJECTS: 'recent_projects',
    API_KEY: 'muapi_key'
};

// Route paths
export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    DASHBOARD: '/dashboard',
    PROJECTS: '/projects',
    SETTINGS: '/settings',
    EDITOR: '/editor'
};

// Error messages
export const ERROR_MESSAGES = {
    GENERIC: 'An unexpected error occurred. Please try again.',
    NETWORK: 'Network error. Please check your connection.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    NOT_FOUND: 'The requested resource was not found.',
    VALIDATION: 'Please check your input and try again.',
    FILE_TOO_LARGE: 'File size exceeds the maximum limit.',
    INVALID_FILE_TYPE: 'File type is not supported.'
};

// Success messages
export const SUCCESS_MESSAGES = {
    SAVED: 'Changes saved successfully.',
    CREATED: 'Created successfully.',
    DELETED: 'Deleted successfully.',
    UPLOADED: 'File uploaded successfully.',
    COPIED: 'Copied to clipboard.'
};

// Aspect ratios
export const ASPECT_RATIOS = [
    { label: '1:1', value: '1:1', width: 1024, height: 1024 },
    { label: '16:9', value: '16:9', width: 1280, height: 720 },
    { label: '9:16', value: '9:16', width: 720, height: 1280 },
    { label: '4:3', value: '4:3', width: 1152, height: 864 },
    { label: '3:2', value: '3:2', width: 1216, height: 832 },
    { label: '21:9', value: '21:9', width: 1536, height: 640 }
];

// Video durations (in seconds)
export const VIDEO_DURATIONS = [
    { label: '2s', value: 2 },
    { label: '4s', value: 4 },
    { label: '5s', value: 5 },
    { label: '10s', value: 10 },
    { label: '15s', value: 15 },
    { label: '30s', value: 30 },
    { label: '60s', value: 60 }
];

// Quality presets
export const QUALITY_PRESETS = {
    LOW: { label: 'Low', value: 'low' },
    MEDIUM: { label: 'Medium', value: 'medium' },
    HIGH: { label: 'High', value: 'high' },
    ULTRA: { label: 'Ultra', value: 'ultra' }
};

export default {
    FILE_LIMITS,
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
};
