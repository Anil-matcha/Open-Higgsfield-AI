import { getActiveProvider, getProviders, getProviderApiKey, setActiveProvider } from '../lib/providerConfig.js';

export function SettingsModal(onClose) {
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 bg-black/80 flex items-center justify-center z-50';

    const modal = document.createElement('div');
    modal.className = 'bg-card p-6 rounded-xl border border-border-color w-96 glass';

    const title = document.createElement('h2');
    title.textContent = 'Settings';
    title.className = 'text-xl font-bold mb-4';

    const providerLabel = document.createElement('label');
    providerLabel.textContent = 'Active Provider';
    providerLabel.className = 'block text-sm text-secondary mb-2';

    const providerSelect = document.createElement('select');
    providerSelect.className = 'w-full mb-4 p-2 rounded bg-input border border-border-color';
    const activeProvider = getActiveProvider();
    getProviders().forEach((p) => {
        const option = document.createElement('option');
        option.value = p.id;
        option.textContent = p.name;
        if (p.id === activeProvider) option.selected = true;
        providerSelect.appendChild(option);
    });

    const muapiLabel = document.createElement('label');
    muapiLabel.textContent = 'Muapi API Key';
    muapiLabel.className = 'block text-sm text-secondary mb-2';

    const muapiInput = document.createElement('input');
    muapiInput.type = 'password';
    muapiInput.className = 'w-full mb-4 p-2 rounded bg-input border border-border-color';
    muapiInput.value = getProviderApiKey('muapi');
    muapiInput.placeholder = 'Enter your Muapi API key...';

    const novitaLabel = document.createElement('label');
    novitaLabel.textContent = 'Novita API Key';
    novitaLabel.className = 'block text-sm text-secondary mb-2';

    const novitaInput = document.createElement('input');
    novitaInput.type = 'password';
    novitaInput.className = 'w-full mb-4 p-2 rounded bg-input border border-border-color';
    novitaInput.value = getProviderApiKey('novita');
    novitaInput.placeholder = 'Enter your Novita API key...';

    const help = document.createElement('p');
    help.className = 'text-xs text-secondary mb-4';
    help.textContent = 'Default provider is Muapi. Switching provider keeps both keys in local storage.';

    const btnContainer = document.createElement('div');
    btnContainer.className = 'flex justify-end gap-2';

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.className = 'px-4 py-2 rounded hover:bg-white/5';
    cancelBtn.onclick = () => {
        document.body.removeChild(overlay);
        if (onClose) onClose();
    };

    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save';
    saveBtn.className = 'px-4 py-2 rounded bg-primary text-black font-medium';

    saveBtn.onclick = () => {
        const selectedProvider = providerSelect.value;
        const muapiKey = muapiInput.value.trim();
        const novitaKey = novitaInput.value.trim();

        if (muapiKey) localStorage.setItem('muapi_key', muapiKey);
        if (novitaKey) localStorage.setItem('novita_api_key', novitaKey);

        const selectedKey = selectedProvider === 'novita' ? novitaKey || localStorage.getItem('novita_api_key') : muapiKey || localStorage.getItem('muapi_key');
        if (!selectedKey) {
            alert(`Please enter a valid ${selectedProvider === 'novita' ? 'Novita' : 'Muapi'} API key.`);
            return;
        }

        setActiveProvider(selectedProvider);
        alert('Settings saved!');
        document.body.removeChild(overlay);
        if (onClose) onClose();
    };

    modal.appendChild(title);
    modal.appendChild(providerLabel);
    modal.appendChild(providerSelect);
    modal.appendChild(muapiLabel);
    modal.appendChild(muapiInput);
    modal.appendChild(novitaLabel);
    modal.appendChild(novitaInput);
    modal.appendChild(help);

    btnContainer.appendChild(cancelBtn);
    btnContainer.appendChild(saveBtn);
    modal.appendChild(btnContainer);

    overlay.appendChild(modal);

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            document.body.removeChild(overlay);
            if (onClose) onClose();
        }
    });

    return overlay;
}
