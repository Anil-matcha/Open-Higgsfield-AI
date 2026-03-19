/**
 * Loading State Utilities
 * Provides consistent loading indicators across the app
 */

export function createLoadingSpinner(size = 'medium') {
    const sizes = {
        small: 'w-4 h-4',
        medium: 'w-8 h-8',
        large: 'w-12 h-12'
    };
    
    const spinner = document.createElement('div');
    spinner.className = `${sizes[size]} border-2 border-primary border-t-transparent rounded-full animate-spin`;
    return spinner;
}

export function createLoadingOverlay(message = 'Loading...') {
    const overlay = document.createElement('div');
    overlay.className = 'absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-50';
    overlay.innerHTML = `
        <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p class="text-white font-medium">${escapeHtml(message)}</p>
    `;
    overlay.hide = () => {
        overlay.classList.add('opacity-0', 'pointer-events-none');
        overlay.classList.remove('opacity-100');
        setTimeout(() => overlay.remove(), 300);
    };
    overlay.show = () => {
        overlay.classList.remove('opacity-0', 'pointer-events-none');
        overlay.classList.add('opacity-100');
    };
    return overlay;
}

export function createInlineLoader(message = '') {
    const container = document.createElement('div');
    container.className = 'flex items-center gap-3 text-white/60 text-sm';
    container.innerHTML = `
        <div class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
        ${message ? `<span>${escapeHtml(message)}</span>` : ''}
    `;
    return container;
}

export function createProgressBar(initialProgress = 0) {
    const container = document.createElement('div');
    container.className = 'w-full max-w-xs';
    container.innerHTML = `
        <div class="h-1 bg-white/10 rounded-full overflow-hidden">
            <div class="h-full bg-primary transition-all duration-300 ease-out" style="width: ${initialProgress}%"></div>
        </div>
        <div class="flex justify-between mt-1">
            <span class="text-xs text-secondary">Generating...</span>
            <span class="text-xs text-primary font-mono progress-text">${initialProgress}%</span>
        </div>
    `;
    
    const bar = container.querySelector('.bg-primary');
    const text = container.querySelector('.progress-text');
    
    container.setProgress = (progress) => {
        const clampedProgress = Math.max(0, Math.min(100, progress));
        bar.style.width = `${clampedProgress}%`;
        text.textContent = `${Math.round(clampedProgress)}%`;
    };
    
    container.complete = () => {
        container.setProgress(100);
        setTimeout(() => {
            bar.classList.add('opacity-0');
            text.textContent = 'Done!';
        }, 500);
    };
    
    return container;
}

// Skeleton loader for content placeholders
export function createSkeletonLines(count = 3, width = '100%') {
    const container = document.createElement('div');
    container.className = 'space-y-2 w-full';
    
    for (let i = 0; i < count; i++) {
        const line = document.createElement('div');
        line.className = 'h-4 bg-white/5 rounded animate-pulse';
        line.style.width = i === count - 1 ? '60%' : width;
        container.appendChild(line);
    }
    
    return container;
}

export function createSkeletonCard() {
    const card = document.createElement('div');
    card.className = 'bg-white/5 rounded-2xl p-4 space-y-3';
    card.innerHTML = `
        <div class="aspect-square bg-white/5 rounded-xl animate-pulse"></div>
        <div class="h-4 bg-white/5 rounded animate-pulse w-3/4"></div>
        <div class="h-3 bg-white/5 rounded animate-pulse w-1/2"></div>
    `;
    return card;
}

// Toast notification system
const toastContainer = createToastContainer();

export function showToast(message, type = 'info', duration = 5000) {
    const toast = document.createElement('div');
    
    const colors = {
        info: 'bg-blue-600',
        success: 'bg-green-600',
        warning: 'bg-yellow-600',
        error: 'bg-red-600'
    };
    
    const icons = {
        info: 'ℹ️',
        success: '✅',
        warning: '⚠️',
        error: '❌'
    };
    
    toast.className = `${colors[type]} text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 transform translate-x-full transition-transform duration-300`;
    toast.innerHTML = `
        <span>${icons[type]}</span>
        <span class="text-sm font-medium">${escapeHtml(message)}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    // Trigger animation
    requestAnimationFrame(() => {
        toast.classList.remove('translate-x-full');
    });
    
    // Auto dismiss
    if (duration > 0) {
        setTimeout(() => dismissToast(toast), duration);
    }
    
    return toast;
}

export function dismissToast(toast) {
    toast.classList.add('translate-x-full');
    setTimeout(() => toast.remove(), 300);
}

function createToastContainer() {
    let container = document.querySelector('#toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none';
        document.body.appendChild(container);
    }
    return container;
}

// Make toast globally available
window.showToast = showToast;
window.dismissToast = dismissToast;

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
