export function Page404(page = 'unknown') {
    const container = document.createElement('div');
    container.className = 'w-full h-full flex flex-col items-center justify-center bg-app-bg relative p-4';

    container.innerHTML = `
        <div class="text-center max-w-md">
            <div class="text-8xl font-black text-white/10 mb-4">404</div>
            <h1 class="text-2xl font-bold text-white mb-2">Page Not Found</h1>
            <p class="text-secondary text-sm mb-6">
                The page "<span class="text-white">${escapeHtml(page)}</span>" doesn't exist or may have been moved.
            </p>
            <div class="flex flex-col sm:flex-row gap-3 justify-center">
                <button id="go-home" class="px-6 py-3 bg-primary text-black font-bold rounded-xl hover:scale-105 transition-transform">
                    Go to Home
                </button>
                <button id="go-back" class="px-6 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors">
                    Go Back
                </button>
            </div>
        </div>
        
        <div class="absolute bottom-8 text-center">
            <p class="text-secondary text-xs">
                If you think this is an error, try refreshing the page.
            </p>
        </div>
    `;

    const goHomeBtn = container.querySelector('#go-home');
    const goBackBtn = container.querySelector('#go-back');

    goHomeBtn.onclick = () => {
        if (window.navigate) {
            window.navigate('image');
        } else if (window.history?.length > 1) {
            window.history.back();
        } else {
            window.location.href = '/';
        }
    };

    goBackBtn.onclick = () => {
        if (window.history?.length > 1) {
            window.history.back();
        } else {
            window.location.href = '/';
        }
    };

    return container;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
