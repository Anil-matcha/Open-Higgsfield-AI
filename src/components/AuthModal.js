import { apiKeyManager } from '../lib/apiKeyManager.js';

export function AuthModal(onSuccess) {
    const existing = document.querySelector('[data-auth-modal]');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.setAttribute('data-auth-modal', '');
    overlay.className = 'fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-6';

    const removeModal = () => {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    };

    const modal = document.createElement('div');
    modal.className = 'w-full max-w-md bg-panel-bg border border-white/10 rounded-3xl p-8 shadow-3xl animate-fade-in-up relative';

    modal.innerHTML = `
        <button class="auth-close-btn absolute top-4 right-4 text-white/40 hover:text-white transition-colors p-1">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
        <div class="flex flex-col items-center text-center mb-8">
            <div class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 shadow-glow mb-6">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d9ff00" stroke-width="2">
                    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3m-3-3l-2.25-2.25"/>
                </svg>
            </div>
            <h2 class="text-2xl font-black text-white uppercase tracking-wider mb-2">Muapi API Key Required</h2>
            <p class="text-secondary text-sm">Please provide your Muapi.ai API key to start creating high-aesthetic images.</p>
        </div>

        <div class="space-y-6">
            <div class="space-y-2">
                <label class="text-[10px] font-bold text-muted uppercase tracking-widest ml-1">Your API Key</label>
                <input
                    type="password"
                    id="muapi-key-input"
                    placeholder="sk-..."
                    class="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-white placeholder:text-muted focus:outline-none focus:border-primary/50 transition-colors shadow-inner"
                    autocomplete="off"
                >
            </div>

            <div class="flex flex-col gap-3">
                <button id="save-key-btn" class="w-full bg-primary text-black font-black py-4 rounded-2xl hover:shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all">
                    Initialize Studio
                </button>
                <a href="https://muapi.ai" target="_blank" rel="noopener noreferrer" class="text-center text-[11px] font-bold text-muted hover:text-white transition-colors py-2 uppercase tracking-tighter">
                    Get an API Key at Muapi.ai &rarr;
                </a>
            </div>
        </div>
        
        <p class="text-[10px] text-muted/50 mt-4 text-center">
            Your API key is stored securely and never shared.
        </p>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    modal.querySelector('.auth-close-btn').onclick = removeModal;

    const input = modal.querySelector('#muapi-key-input');
    const btn = modal.querySelector('#save-key-btn');

    // Focus input on open
    setTimeout(() => input.focus(), 100);

    // Handle Enter key
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            btn.click();
        }
    });

    btn.onclick = async () => {
        const key = input.value.trim();
        if (key) {
            if (key.length < 10) {
                input.classList.add('border-red-500/50');
                setTimeout(() => input.classList.remove('border-red-500/50'), 2000);
                return;
            }
            
            try {
                btn.disabled = true;
                btn.textContent = 'Saving...';
                
                // Use the secure ApiKeyManager
                await apiKeyManager.setKey(key, true);
                
                removeModal();
                if (onSuccess) onSuccess();
                
                console.log('[AuthModal] API key saved securely');
            } catch (error) {
                console.error('[AuthModal] Failed to save key:', error);
                btn.disabled = false;
                btn.textContent = 'Initialize Studio';
                input.classList.add('border-red-500/50');
                setTimeout(() => input.classList.remove('border-red-500/50'), 2000);
            }
        } else {
            input.classList.add('border-red-500/50');
            setTimeout(() => input.classList.remove('border-red-500/50'), 2000);
        }
    };

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) removeModal();
    });

    // Handle escape key
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            removeModal();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);

    return overlay;
}
