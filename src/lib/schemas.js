/**
 * API Response Validation Schemas
 * Validates API responses to ensure data integrity
 */

/**
 * Validate that a value is a string
 * @param {any} value - Value to validate
 * @returns {boolean} - True if valid
 */
function isString(value) {
    return typeof value === 'string';
}

/**
 * Validate that a value is a number
 * @param {any} value - Value to validate
 * @returns {boolean} - True if valid
 */
function isNumber(value) {
    return typeof value === 'number' && !isNaN(value);
}

/**
 * Validate that a value is a boolean
 * @param {any} value - Value to validate
 * @returns {boolean} - True if valid
 */
function isBoolean(value) {
    return typeof value === 'boolean';
}

/**
 * Validate that a value is an array
 * @param {any} value - Value to validate
 * @param {Function} itemValidator - Optional validator for array items
 * @returns {boolean} - True if valid
 */
function isArray(value, itemValidator = null) {
    if (!Array.isArray(value)) return false;
    if (itemValidator) {
        return value.every(item => itemValidator(item));
    }
    return true;
}

/**
 * Validate that a value is an object
 * @param {any} value - Value to validate
 * @returns {boolean} - True if valid
 */
function isObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Validate that a value is a URL
 * @param {any} value - Value to validate
 * @returns {boolean} - True if valid
 */
function isUrl(value) {
    if (!isString(value)) return false;
    try {
        new URL(value);
        return true;
    } catch {
        return false;
    }
}

/**
 * Validate that a value matches a pattern
 * @param {any} value - Value to validate
 * @param {RegExp} pattern - Pattern to match
 * @returns {boolean} - True if valid
 */
function matchesPattern(value, pattern) {
    if (!isString(value)) return false;
    return pattern.test(value);
}

/**
 * Create a schema validator function
 * @param {Object} schema - Schema definition
 * @returns {Function} - Validator function
 */
function createValidator(schema) {
    return (data) => {
        const errors = [];
        const validated = {};
        
        for (const [key, rules] of Object.entries(schema)) {
            const value = data[key];
            
            // Check required fields
            if (rules.required && (value === undefined || value === null)) {
                errors.push(`${key} is required`);
                continue;
            }
            
            // Skip optional fields that are not present
            if (value === undefined || value === null) {
                if (rules.default !== undefined) {
                    validated[key] = rules.default;
                }
                continue;
            }
            
            // Validate type
            if (rules.type && !rules.type(value)) {
                errors.push(`${key} has invalid type`);
                continue;
            }
            
            // Validate pattern
            if (rules.pattern && !matchesPattern(value, rules.pattern)) {
                errors.push(`${key} does not match expected pattern`);
                continue;
            }
            
            // Validate enum
            if (rules.enum && !rules.enum.includes(value)) {
                errors.push(`${key} must be one of: ${rules.enum.join(', ')}`);
                continue;
            }
            
            // Validate min/max for numbers
            if (isNumber(value)) {
                if (rules.min !== undefined && value < rules.min) {
                    errors.push(`${key} must be at least ${rules.min}`);
                }
                if (rules.max !== undefined && value > rules.max) {
                    errors.push(`${key} must be at most ${rules.max}`);
                }
            }
            
            // Validate length for strings and arrays
            if (isString(value) || isArray(value)) {
                if (rules.minLength !== undefined && value.length < rules.minLength) {
                    errors.push(`${key} must have at least ${rules.minLength} items`);
                }
                if (rules.maxLength !== undefined && value.length > rules.maxLength) {
                    errors.push(`${key} must have at most ${rules.maxLength} items`);
                }
            }
            
            validated[key] = value;
        }
        
        return {
            valid: errors.length === 0,
            errors,
            data: validated
        };
    };
}

// API Response Schemas

/**
 * Image generation response schema
 */
export const imageGenerationSchema = {
    id: { type: isString, required: true },
    status: { type: isString, required: true, enum: ['pending', 'processing', 'completed', 'failed'] },
    url: { type: isUrl, required: false },
    outputs: { type: (v) => isArray(v, isUrl), required: false },
    error: { type: isString, required: false },
    created_at: { type: isString, required: false },
    completed_at: { type: isString, required: false }
};

/**
 * Video generation response schema
 */
export const videoGenerationSchema = {
    id: { type: isString, required: true },
    status: { type: isString, required: true, enum: ['pending', 'processing', 'completed', 'failed'] },
    url: { type: isUrl, required: false },
    outputs: { type: (v) => isArray(v, isUrl), required: false },
    duration: { type: isNumber, required: false, min: 0 },
    error: { type: isString, required: false },
    created_at: { type: isString, required: false },
    completed_at: { type: isString, required: false }
};

/**
 * Text generation response schema
 */
export const textGenerationSchema = {
    id: { type: isString, required: true },
    text: { type: isString, required: true },
    model: { type: isString, required: false },
    usage: {
        type: isObject,
        required: false
    }
};

/**
 * User profile schema
 */
export const userProfileSchema = {
    id: { type: isString, required: true },
    email: { type: isString, required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    name: { type: isString, required: false },
    avatar_url: { type: isUrl, required: false },
    created_at: { type: isString, required: false }
};

/**
 * Pagination schema
 */
export const paginationSchema = {
    page: { type: isNumber, required: true, min: 1 },
    per_page: { type: isNumber, required: true, min: 1, max: 100 },
    total: { type: isNumber, required: true, min: 0 },
    total_pages: { type: isNumber, required: true, min: 0 }
};

/**
 * API error response schema
 */
export const errorResponseSchema = {
    error: { type: isString, required: true },
    message: { type: isString, required: false },
    code: { type: isString, required: false },
    details: { type: isObject, required: false }
};

// Create validator functions from schemas

/**
 * Validate image generation response
 * @param {Object} data - Response data
 * @returns {Object} - Validation result
 */
export function validateImageGenerationResponse(data) {
    const validator = createValidator(imageGenerationSchema);
    return validator(data);
}

/**
 * Validate video generation response
 * @param {Object} data - Response data
 * @returns {Object} - Validation result
 */
export function validateVideoGenerationResponse(data) {
    const validator = createValidator(videoGenerationSchema);
    return validator(data);
}

/**
 * Validate text generation response
 * @param {Object} data - Response data
 * @returns {Object} - Validation result
 */
export function validateTextGenerationResponse(data) {
    const validator = createValidator(textGenerationSchema);
    return validator(data);
}

/**
 * Validate user profile response
 * @param {Object} data - Response data
 * @returns {Object} - Validation result
 */
export function validateUserProfileResponse(data) {
    const validator = createValidator(userProfileSchema);
    return validator(data);
}

/**
 * Validate API response based on schema
 * @param {Object} data - Response data
 * @param {Object} schema - Schema to validate against
 * @returns {Object} - {valid: boolean, errors: string[], data: Object}
 */
export function validateResponse(data, schema) {
    const validator = createValidator(schema);
    return validator(data);
}

/**
 * Validate response is not an error
 * @param {Object} data - Response data
 * @returns {boolean} - True if not an error response
 */
export function isNotErrorResponse(data) {
    return !data.error && data.status !== 'error';
}

export default {
    validateImageGenerationResponse,
    validateVideoGenerationResponse,
    validateTextGenerationResponse,
    validateUserProfileResponse,
    validateResponse,
    isNotErrorResponse,
    createValidator
};
