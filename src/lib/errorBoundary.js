/**
 * Error Boundary Utility
 * Provides graceful error handling for DOM components
 */

import { logger } from './logger.js';

/**
 * Error Boundary Class
 * Wraps components and catches errors for graceful fallback
 */
export class ErrorBoundary {
    constructor(options = {}) {
        this.fallbackUI = options.fallbackUI || this.defaultFallback;
        this.onError = options.onError || (() => {});
        this.container = null;
        this.originalContent = null;
        this.isErrorState = false;
    }
    
    /**
     * Default fallback UI when error occurs
     * @param {Error} error - The caught error
     * @param {Function} retry - Function to retry the component
     * @returns {HTMLElement} - Fallback UI element
     */
    defaultFallback(error, retry) {
        const container = document.createElement('div');
        container.className = 'error-boundary-fallback';
        container.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            text-align: center;
            min-height: 200px;
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.3);
            border-radius: 0.5rem;
            margin: 1rem;
        `;
        
        const icon = document.createElement('div');
        icon.innerHTML = `
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
        `;
        container.appendChild(icon);
        
        const title = document.createElement('h3');
        title.textContent = 'Something went wrong';
        title.style.cssText = 'color: #ef4444; margin: 1rem 0 0.5rem; font-size: 1.125rem; font-weight: 600;';
        container.appendChild(title);
        
        const message = document.createElement('p');
        message.textContent = error.message || 'An unexpected error occurred';
        message.style.cssText = 'color: #a1a1aa; margin: 0 0 1rem; font-size: 0.875rem;';
        container.appendChild(message);
        
        const retryBtn = document.createElement('button');
        retryBtn.textContent = 'Try Again';
        retryBtn.style.cssText = `
            background: #d9ff00;
            color: #000;
            border: none;
            padding: 0.5rem 1.5rem;
            border-radius: 0.375rem;
            font-weight: 600;
            cursor: pointer;
            transition: opacity 0.2s;
        `;
        retryBtn.onmouseenter = () => retryBtn.style.opacity = '0.9';
        retryBtn.onmouseleave = () => retryBtn.style.opacity = '1';
        retryBtn.onclick = retry;
        container.appendChild(retryBtn);
        
        return container;
    }
    
    /**
     * Wrap a component function with error boundary
     * @param {Function} componentFn - Component function that returns HTMLElement
     * @param {HTMLElement} container - Container to render into
     * @returns {Function} - Wrapped component function
     */
    wrap(componentFn, container) {
        this.container = container;
        
        return (...args) => {
            try {
                const element = componentFn(...args);
                this.isErrorState = false;
                this.originalContent = element;
                return element;
            } catch (error) {
                return this.handleError(error, () => {
                    const newElement = componentFn(...args);
                    this.container.innerHTML = '';
                    this.container.appendChild(newElement);
                    this.isErrorState = false;
                });
            }
        };
    }
    
    /**
     * Handle an error
     * @param {Error} error - The caught error
     * @param {Function} retry - Function to retry
     * @returns {HTMLElement} - Fallback UI element
     */
    handleError(error, retry) {
        this.isErrorState = true;
        
        // Log the error
        logger.error('Component error caught by boundary', {
            errorMessage: error.message,
            errorStack: error.stack
        }, error);
        
        // Call onError callback
        this.onError(error);
        
        // Return fallback UI
        return this.fallbackUI(error, retry);
    }
    
    /**
     * Reset the error boundary
     */
    reset() {
        this.isErrorState = false;
        if (this.container && this.originalContent) {
            this.container.innerHTML = '';
            this.container.appendChild(this.originalContent);
        }
    }
}

/**
 * Wrap an async function with error handling
 * @param {Function} asyncFn - Async function to wrap
 * @param {Object} options - Error handling options
 * @returns {Function} - Wrapped function
 */
export function withErrorHandling(asyncFn, options = {}) {
    const {
        retries = 0,
        retryDelay = 1000,
        onError = () => {},
        fallback = null
    } = options;
    
    return async (...args) => {
        let lastError;
        
        for (let attempt = 0; attempt <= retries; attempt++) {
            try {
                return await asyncFn(...args);
            } catch (error) {
                lastError = error;
                
                logger.error('Async operation failed', {
                    function: asyncFn.name,
                    attempt: attempt + 1,
                    maxRetries: retries
                }, error);
                
                if (attempt < retries) {
                    await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
                }
            }
        }
        
        onError(lastError);
        
        if (fallback) {
            return fallback(lastError);
        }
        
        throw lastError;
    };
}

/**
 * Global error handler setup
 */
export function setupGlobalErrorHandlers() {
    // Handle uncaught errors
    window.addEventListener('error', (event) => {
        logger.error('Uncaught error', {
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno
        }, event.error);
    });
    
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
        logger.error('Unhandled promise rejection', {
            reason: event.reason?.message || String(event.reason)
        }, event.reason instanceof Error ? event.reason : new Error(String(event.reason)));
    });
}

export default ErrorBoundary;
