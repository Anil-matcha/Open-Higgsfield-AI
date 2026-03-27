import { navigate } from '../lib/router.js';
import { createHeroSection } from '../lib/thumbnails.js';

const IMAGE_TO_VIDEO_MODELS = [
  { name: 'Kling I2V', description: 'Kling image-to-video', category: 'Kling' },
  { name: 'Kling I2V 1.2', description: 'Kling I2V 1.2', category: 'Kling' },
  { name: 'Kling I2V 1.5', description: 'Kling I2V 1.5', category: 'Kling' },
  { name: 'Kling I2V 1.6', description: 'Kling I2V 1.6', category: 'Kling' },
  { name: 'Kling I2V 2.0', description: 'Kling I2V 2.0', category: 'Kling' },
  { name: 'Veo3 I2V', description: 'Google Veo3 image-to-video', category: 'Google' },
  { name: 'Runway I2V', description: 'Runway image-to-video', category: 'Runway' },
  { name: 'Wan I2V', description: 'Wan image-to-video', category: 'Wan' },
  { name: 'Midjourney v7 I2V', description: 'Midjourney v7 image-to-video', category: 'Midjourney' },
  { name: 'Hunyuan I2V', description: 'Tencent Hunyuan image-to-video', category: 'Hunyuan' },
  { name: 'Seedance I2V', description: 'Seedance image-to-video', category: 'Seedance' },
  { name: 'Pixverse I2V', description: 'Pixverse image-to-video', category: 'Pixverse' },
  { name: 'Vidu Q1 Reference', description: 'Vidu Q1 reference', category: 'Vidu' },
  { name: 'Vidu Q2 Reference', description: 'Vidu Q2 reference', category: 'Vidu' },
  { name: 'Hailuo I2V', description: 'Hailuo image-to-video', category: 'Hailuo' },
  { name: 'Sora 2 I2V', description: 'Sora 2 image-to-video', category: 'OpenAI' },
  { name: 'OVI I2V', description: 'OVI image-to-video', category: 'OVI' },
  { name: 'LTX 2 I2V', description: 'LTX 2 image-to-video', category: 'LTX' },
  { name: 'Leonardoai Motion 2.0', description: 'Leonardoai Motion 2.0', category: 'Leonardo' },
];

const EXAMPLE_PROMPTS = [
  { prompt: 'Animate this image with a smooth camera pan left', model: 'Kling I2V' },
  { prompt: 'Add subtle movement to the subject, gentle breathing animation', model: 'Runway I2V' },
  { prompt: 'Create a dynamic zoom out effect', model: 'Veo3 I2V' },
  { prompt: 'Add rain and reflections on surfaces', model: 'Hunyuan I2V' },
  { prompt: 'Animate with floating particles and magical glow', model: 'Seedance I2V' },
];

const FEATURES = [
  { icon: '🖼️', title: 'Image to Video', description: 'Transform static images into dynamic, animated videos' },
  { icon: '🎞️', title: '60+ Models', description: 'Access specialized image-to-video models for any use case' },
  { icon: '🎭', title: 'Motion Effects', description: 'Add camera movements, particle effects, and more' },
  { icon: '✨', title: 'Smooth Animation', description: 'Natural motion that preserves image quality' },
];

export function ImageToVideoPage() {
  const container = document.createElement('div');
  container.className = 'w-full h-full flex flex-col items-center bg-app-bg relative p-4 md:p-6 overflow-y-auto custom-scrollbar overflow-x-hidden';

  // ==========================================
  // 1. HERO SECTION
  // ==========================================
  const hero = document.createElement('div');
  hero.className = 'flex flex-col items-center mb-6 md:mb-8 animate-fade-in-up transition-all duration-700 w-full max-w-5xl';
  const heroBanner = createHeroSection('video', 'h-32 md:h-44 mb-4');
  if (heroBanner) {
    const heroContent = document.createElement('div');
    heroContent.className = 'absolute bottom-0 left-0 right-0 p-6 z-10';
    heroContent.innerHTML = `
      <h1 class="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight mb-1">Image to Video</h1>
      <p class="text-white/60 text-sm font-medium">Bring your static images to life with AI-powered animation</p>
    `;
    heroBanner.appendChild(heroContent);
    hero.appendChild(heroBanner);
  }
  container.appendChild(hero);

  // Main content wrapper
  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'w-full max-w-5xl relative z-40 animate-fade-in-up';
  contentWrapper.style.animationDelay = '0.1s';

  contentWrapper.innerHTML = `
    <!-- CTA + Features Panel -->
    <div class="bg-[#111]/90 backdrop-blur-xl border border-white/10 rounded-[1.5rem] p-6 md:p-8 shadow-3xl mb-6">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div>
          <h2 class="text-xl font-black text-white">Animate Any Image</h2>
          <p class="text-sm text-muted">Transform still images into stunning animated videos</p>
        </div>
        <button class="start-btn bg-primary text-black px-6 py-2.5 rounded-xl font-black text-sm hover:shadow-glow hover:scale-105 active:scale-95 transition-all whitespace-nowrap">
          Animate Your Images
        </button>
      </div>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        ${FEATURES.map(f => `
          <div class="bg-white/[0.03] border border-white/5 rounded-xl p-4 hover:border-primary/20 transition-all">
            <div class="text-2xl mb-2">${f.icon}</div>
            <h3 class="text-sm font-bold text-white mb-1">${f.title}</h3>
            <p class="text-xs text-muted">${f.description}</p>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Models Panel -->
    <div class="bg-[#111]/90 backdrop-blur-xl border border-white/10 rounded-[1.5rem] p-6 md:p-8 shadow-3xl mb-6">
      <div class="mb-6">
        <h2 class="text-xl font-black text-white mb-1">Available Models</h2>
        <p class="text-sm text-muted">Choose from ${IMAGE_TO_VIDEO_MODELS.length}+ powerful animation models</p>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        ${IMAGE_TO_VIDEO_MODELS.map(m => `
          <button class="model-card bg-white/[0.03] border border-white/5 rounded-xl p-4 hover:border-primary/20 transition-all text-left group" data-model="${m.name}">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-semibold text-white group-hover:text-primary transition-colors">${m.name}</span>
              <span class="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">${m.category}</span>
            </div>
            <p class="text-xs text-muted">${m.description}</p>
          </button>
        `).join('')}
      </div>
    </div>

    <!-- Example Prompts Panel -->
    <div class="bg-[#111]/90 backdrop-blur-xl border border-white/10 rounded-[1.5rem] p-6 md:p-8 shadow-3xl mb-6">
      <div class="mb-6">
        <h2 class="text-xl font-black text-white mb-1">Example Animations</h2>
        <p class="text-sm text-muted">Get inspired by these animation effects</p>
      </div>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        ${EXAMPLE_PROMPTS.map((p, i) => `
          <div class="prompt-card bg-white/[0.03] border border-white/5 rounded-xl p-4 hover:border-primary/20 cursor-pointer transition-all group">
            <div class="flex items-center justify-between mb-3">
              <span class="bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full">${p.model}</span>
              <button class="text-xs text-muted hover:text-white transition-colors try-btn">Try this →</button>
            </div>
            <p class="text-sm text-gray-300 leading-relaxed">${p.prompt}</p>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- CTA Panel -->
    <div class="bg-[#111]/90 backdrop-blur-xl border border-white/10 rounded-[1.5rem] p-8 md:p-10 shadow-3xl text-center">
      <h2 class="text-2xl font-black text-white mb-2">Bring Images to Life</h2>
      <p class="text-muted mb-6 max-w-md mx-auto">Start animating your images with powerful AI models</p>
      <button class="cta-btn bg-primary text-black px-6 py-2.5 rounded-xl font-black text-sm hover:shadow-glow hover:scale-105 active:scale-95 transition-all">
        Get Started Free
      </button>
    </div>
  `;

  container.appendChild(contentWrapper);

  // Event Listeners
  container.querySelector('.start-btn').onclick = () => navigate('video');
  container.querySelector('.cta-btn').onclick = () => navigate('video');

  container.querySelectorAll('.model-card').forEach(card => {
    card.onclick = () => {
      const modelName = card.dataset.model;
      localStorage.setItem('prefill_model', modelName);
      navigate('video');
    };
  });

  container.querySelectorAll('.prompt-card').forEach((card, i) => {
    card.onclick = () => {
      const prompt = EXAMPLE_PROMPTS[i];
      localStorage.setItem('prefill_prompt', prompt.prompt);
      localStorage.setItem('prefill_model', prompt.model);
      navigate('video');
    };
  });

  container.querySelectorAll('.prompt-card .try-btn').forEach((btn, i) => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const prompt = EXAMPLE_PROMPTS[i];
      localStorage.setItem('prefill_prompt', prompt.prompt);
      localStorage.setItem('prefill_model', prompt.model);
      navigate('video');
    };
  });

  return container;
}
