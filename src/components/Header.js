export function Header(navigate) {
    const header = document.createElement('header');
    header.className = 'w-full flex flex-col z-50 sticky top-0';


    // 2. Main Navigation Bar
    const navBar = document.createElement('div');
    navBar.className = 'w-full h-16 bg-black flex items-center justify-between px-4 md:px-6 border-b border-white/5 backdrop-blur-md bg-opacity-95';

    const leftPart = document.createElement('div');
    leftPart.className = 'flex items-center gap-8';

    // Logo
    const logoContainer = document.createElement('div');
    logoContainer.className = 'cursor-pointer hover:scale-110 transition-transform';
    logoContainer.innerHTML = `
        <div class="w-8 h-8 bg-white rounded-lg flex items-center justify-center p-1.5 shadow-lg">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="black"/>
                <path d="M2 17L12 22L22 17" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </div>
    `;

    const menu = document.createElement('nav');
    menu.className = 'hidden lg:flex items-center gap-6 text-[13px] font-bold text-secondary';
    const items = ['Explore', 'Image', 'Video', 'Edit', 'Character', 'Contests', 'Vibe Motion', 'Cinema Studio', 'AI Influencer', 'Apps', 'Assist', 'Community'];

    items.forEach(item => {
        const link = document.createElement('a');
        link.textContent = item;
        link.className = `hover:text-white transition-all cursor-pointer relative group ${item === 'Image' ? 'text-white' : ''}`;

        // Active Indicator or Dot
        if (item === 'Image') {
            const dot = document.createElement('div');
            dot.className = 'absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full';
            link.appendChild(dot);
        }

        if (item === 'Contests') {
            link.innerHTML += ' <span class="bg-primary/10 text-primary text-[8px] px-1.5 py-0.5 rounded-full ml-1 border border-primary/20">New</span>';
        }

        link.onclick = () => {
            // Remove active state from all
            Array.from(menu.children).forEach(child => child.classList.remove('text-white'));
            // Add to current
            link.classList.add('text-white');

            if (item === 'Image') navigate('image');
            else if (item === 'Video') navigate('video');
            else if (item === 'Cinema Studio') navigate('cinema');
        };

        menu.appendChild(link);
    });

    leftPart.appendChild(logoContainer);
    leftPart.appendChild(menu);

    const rightPart = document.createElement('div');
    rightPart.className = 'flex items-center gap-4';

    const keyBtn = document.createElement('button');
    keyBtn.className = 'p-2 text-secondary hover:text-white transition-colors';
    keyBtn.title = 'Update API Key';
    keyBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3m-3-3l-2.25-2.25"/>
        </svg>
    `;
    keyBtn.onclick = () => {
        localStorage.removeItem('muapi_key');
        window.location.reload();
    };

    rightPart.appendChild(keyBtn);

    navBar.appendChild(leftPart);
    navBar.appendChild(rightPart);

    header.appendChild(navBar);

    return header;
}
