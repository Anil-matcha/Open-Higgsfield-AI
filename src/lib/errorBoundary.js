/**
 * Error Boundary Component
 * Catches errors in child components and displays a fallback UI
 */

import { showToast } from './loading.js';

export class ErrorBoundary {
    constructor(fallbackUI, onError = null) {
        this.fallbackUI = fallbackUI;
        this.onError = onError;
        this.hasError = false;
    }

    wrap(componentFactory, ...args) {
        try {
            const component = componentFactory(...args);
            this.hasError = false;
            return component;
        } catch (error) {
            this.hasError = true;
            console.error('[ErrorBoundary]', error);
            
            if (this.onError) {
                this.onError(error);
            }
            
            showToast('Something went wrong. Please try again.', 'error');
            
            if (typeof this.fallbackUI === 'function') {
                return this.fallbackUI(error);
            }
            
            return this.fallbackUI;
        }
    }

    static async wrapAsync(asyncFactory, ...args) {
        try {
            const component = await asyncFactory(...args);
            return component;
        } catch (error) {
            console.error('[ErrorBoundary]', error);
            showToast('Something went wrong. Please try again.', 'error');
            
            const fallback = document.createElement('div');
            fallback.className = 'w-full h-full flex items-center justify-center';
            fallback.innerHTML = `
                <div class="text-center">
                    <div class="text-4xl mb-4">😕</div>
                    <h3 class="text-lg font-bold text-white mb-2">Something went wrong</h3>
                    <p class="text-sm text-secondary mb-4">${escapeHtml(error.message || 'Unknown error')}</p>
                    <button class="px-4 py-2 bg-primary text-black font-bold rounded-lg hover:scale-105 transition-transform" onclick="location.reload()">
                        Reload Page
                    </button>
                </div>
            `;
            return fallback;
        }
    }
}

// Higher-order component that wraps a component factory with error handling
export function withErrorBoundary(componentFactory, fallbackUI = null) {
    return (...args) => {
        const boundary = new ErrorBoundary(fallbackUI);
        return boundary.wrap(componentFactory, ...args);
    };
}

// Async version
export function withAsyncErrorBoundary(componentFactory, fallbackUI = null) {
    return async (...args) => {
        return ErrorBoundary.wrapAsync(async () => componentFactory(...args), ...args);
    };
}

// Try-catch wrapper for async operations with user feedback
export async function withUserFeedback(operation, { 
    loadingMessage = 'Loading...',
    successMessage = null,
    errorMessage = 'An error occurred',
    showLoadingToast = false,
    showSuccessToast = true
} = {}) {
    
    let loadingToast = null;
    
    try {
        if (showLoadingToast && loadingMessage) {
            loadingToast = showToast(loadingMessage, 'info', 0); // Don't auto-dismiss
        }
        
        const result = await operation();
        
        if (loadingToast) {
            dismissToast(loadingToast);
        }
        
        if (successMessage && showSuccessToast) {
            showToast(successMessage, 'success');
        }
        
        return { success: true, data: result };
        
    } catch (error) {
        if (loadingToast) {
            dismissToast(loadingToast);
        }
        
        console.error('[withUserFeedback]', error);
        showToast(errorMessage || error.message, 'error');
        
        return { success: false, error };
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
