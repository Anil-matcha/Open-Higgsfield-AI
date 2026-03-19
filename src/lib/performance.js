/**
 * Performance Monitoring Utilities
 * Track metrics for user experience optimization
 */

class PerformanceMonitor {
    constructor() {
        this.metrics = {
            pageLoads: [],
            apiCalls: [],
            errors: []
        };
        this.isEnabled = import.meta.env.PROD;
    }

    // Track page load performance
    trackPageLoad(pageName, duration) {
        if (!this.isEnabled) return;
        
        this.metrics.pageLoads.push({
            page: pageName,
            duration,
            timestamp: Date.now()
        });

        // Keep last 50 records
        if (this.metrics.pageLoads.length > 50) {
            this.metrics.pageLoads.shift();
        }

        // Log in development
        if (import.meta.env.DEV) {
            console.log(`[Performance] Page "${pageName}" loaded in ${duration.toFixed(2)}ms`);
        }
    }

    // Track API call performance
    trackApiCall(endpoint, duration, status) {
        if (!this.isEnabled) return;
        
        this.metrics.apiCalls.push({
            endpoint,
            duration,
            status,
            timestamp: Date.now()
        });

        // Log slow API calls
        if (duration > 5000) {
            console.warn(`[Performance] Slow API call: ${endpoint} took ${duration.toFixed(2)}ms`);
        }
    }

    // Track errors
    trackError(type, message, context = {}) {
        if (!this.isEnabled) return;
        
        this.metrics.errors.push({
            type,
            message,
            context,
            timestamp: Date.now()
        });

        // Keep last 20 errors
        if (this.metrics.errors.length > 20) {
            this.metrics.errors.shift();
        }
    }

    // Get performance summary
    getSummary() {
        const pageLoads = this.metrics.pageLoads;
        const apiCalls = this.metrics.apiCalls;

        return {
            avgPageLoad: pageLoads.length > 0 
                ? pageLoads.reduce((a, b) => a + b.duration, 0) / pageLoads.length 
                : 0,
            avgApiCall: apiCalls.length > 0
                ? apiCalls.reduce((a, b) => a + b.duration, 0) / apiCalls.length
                : 0,
            errorCount: this.metrics.errors.length,
            recentErrors: this.metrics.errors.slice(-5)
        };
    }

    // Clear metrics
    clear() {
        this.metrics.pageLoads = [];
        this.metrics.apiCalls = [];
        this.metrics.errors = [];
    }
}

export const perfMonitor = new PerformanceMonitor();

// Automatic page load tracking
if (import.meta.env.PROD) {
    window.addEventListener('load', () => {
        const pageLoadTime = performance.now();
        perfMonitor.trackPageLoad('initial', pageLoadTime);
    });
}

// Performance observer for long tasks
if ('PerformanceObserver' in window && import.meta.env.PROD) {
    try {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.duration > 50) {
                    console.warn(`[Performance] Long task detected: ${entry.duration.toFixed(2)}ms`);
                }
            }
        });
        observer.observe({ entryTypes: ['longtask'] });
    } catch (e) {
        // Long task observer not supported
    }
}

/**
 * Debounce function to limit rate of expensive operations
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function to limit rate of expensive operations
 */
export function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Memory usage monitoring (if available)
 */
export function getMemoryUsage() {
    if ('memory' in performance && performance.memory) {
        return {
            usedJSHeapSize: performance.memory.usedJSHeapSize,
            totalJSHeapSize: performance.memory.totalJSHeapSize,
            jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
        };
    }
    return null;
}

// Export for debugging in development
if (import.meta.env.DEV) {
    window.perfMonitor = perfMonitor;
    window.getMemoryUsage = getMemoryUsage;
}
