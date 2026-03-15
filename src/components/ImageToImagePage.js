import { navigate } from '../lib/router.js';

const IMAGE_TO_IMAGE_MODELS = [
  { name: 'Nano Banana Edit', description: 'Edit images with Nano Banana', category: 'Nano' },
  { name: 'Nano Banana Pro Edit', description: 'Pro-level image editing', category: 'Nano' },
  { name: 'Nano Banana 2 Edit', description: 'Next-gen image editing', category: 'Nano' },
  { name: 'Flux Kontext Dev I2I', description: 'Flux Kontext development I2I', category: 'Flux' },
  { name: 'Flux Kontext Pro I2I', description: 'Flux Kontext Pro I2I', category: 'Flux' },
  { name: 'Flux Kontext Max I2I', description: 'Flux Kontext Max I2I', category: 'Flux' },
  { name: 'Flux Redux', description: 'Flux Redux image transformation', category: 'Flux' },
  { name: 'Flux Pulid', description: 'Flux Pulid image editing', category: 'Flux' },
  { name: 'GPT-4o Edit', description: 'OpenAI GPT-4o image editing', category: 'OpenAI' },
  { name: 'GPT Image 1.5 Edit', description: 'OpenAI GPT Image 1.5 Edit', category: 'OpenAI' },
  { name: 'Midjourney v7 I2I', description: 'Midjourney v7 image-to-image', category: 'Midjourney' },
  { name: 'Seededit v3', description: 'Seededit v3 image editing', category: 'Seedream' },
  { name: 'Bytedance Seedream Edit', description: 'Bytedance Seedream editing', category: 'Seedream' },
  { name: 'Qwen Image Edit', description: 'Alibaba Qwen image editing', category: 'Qwen' },
  { name: 'Wan Image Edit', description: 'Wan image editing', category: 'Wan' },
  { name: 'Ideogram Character', description: 'Ideogram character creation', category: 'Ideogram' },
  { name: 'AI Background Remover', description: 'Remove backgrounds from images', category: 'AI Tools' },
  { name: 'AI Face Swap', description: 'Swap faces in images', category: 'AI Tools' },
  { name: 'AI Dress Change', description: 'Change clothing in images', category: 'AI Tools' },
  { name: 'AI Skin Enhancer', description: 'Enhance skin in portraits', category: 'AI Tools' },
  { name: 'AI Product Shot', description: 'Create professional product shots', category: 'AI Tools' },
];

const EXAMPLE_PROMPTS = [
  { prompt: 'Transform into a cyberpunk style with neon lights and futuristic elements', model: 'Flux Redux' },
  { prompt: 'Convert to watercolor painting style with soft colors', model: 'Nano Banana Edit' },
  { prompt: 'Make it look like a professional fashion magazine cover', model: 'GPT Image 1.5 Edit' },
  { prompt: 'Add dramatic sunset lighting and warm colors', model: 'Midjourney v7 I2I' },
  { prompt: 'Convert to black and white film noir style', model: 'Seededit v3' },
];

const FEATURES = [
  { icon: '🖼️', title: 'Smart Transformations', description: 'Transform any image with AI-powered style transfer and editing' },
  { icon: '✨', title: '55+ Models', description: 'Access specialized models for every type of image transformation' },
  { icon: '🎭', title: 'Style Transfer', description: 'Apply artistic styles, filters, and effects instantly' },
  { icon: '🔧', title: 'Professional Tools', description: 'Background removal, face swap, skin enhancement & more' },
];

const LOGOS = ['Flux', 'OpenAI', 'Midjourney', 'Stability AI', 'Runway', 'Leonardo'];

export function ImageToImagePage() {
  const container = document.createElement('div');
  container.className = 'w-full min-h-full bg-black';

  container.innerHTML = `
    <!-- Hero Section -->
    <section class="relative overflow-hidden">
      <!-- Background Effects -->
      <div class="absolute inset-0 bg-gradient-to-br from-pink-900/20 via-black to-purple-900/20"></div>
      <div class="absolute inset-0" style="background-image: radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.1) 0%, transparent 50%);"></div>
      
      <!-- Animated Grid -->
      <div class="absolute inset-0 opacity-20" style="background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 50px 50px;"></div>
      
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <!-- Badge -->
        <div class="flex justify-center mb-8">
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
            <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span class="text-sm text-gray-300">Powerful AI Image Editing Tools</span>
          </div>
        </div>
        
        <!-- Main Heading -->
        <h1 class="text-5xl sm:text-6xl lg:text-7xl font-bold text-center text-white tracking-tight mb-6">
          <span class="bg-gradient-to-r from-white via-pink-200 to-purple-200 bg-clip-text text-transparent">
            Image to Image
          </span>
        </h1>
        
        <!-- Subheading -->
        <p class="text-xl sm:text-2xl text-gray-400 text-center max-w-3xl mx-auto mb-10">
          Transform, edit, and enhance your images with cutting-edge AI models
        </p>
        
        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <button class="start-btn group relative px-8 py-4 bg-white text-black font-bold rounded-full text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/25">
            <span class="relative z-10 flex items-center gap-2">
              Start Editing
              <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
            </span>
          </button>
          <button class="px-8 py-4 bg-white/5 text-white font-semibold rounded-full text-lg border border-white/10 hover:bg-white/10 transition-all backdrop-blur-sm">
            View Documentation
          </button>
        </div>
        
        <!-- Preview Image Placeholder -->
        <div class="relative max-w-4xl mx-auto">
          <div class="absolute -inset-1 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 rounded-2xl blur opacity-30"></div>
          <div class="relative bg-gray-900 rounded-2xl overflow-hidden border border-white/10" style="aspect-ratio: 16/9;">
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="text-center">
                <div class="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
                  <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                </div>
                <p class="text-gray-500 text-sm">AI Transformed Image</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Logos Section -->
    <section class="py-12 border-y border-white/5 bg-white/[0.02]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p class="text-center text-sm text-gray-500 mb-8">POWERED BY INDUSTRY-LEADING MODELS</p>
        <div class="flex flex-wrap justify-center items-center gap-8 lg:gap-16 opacity-50">
          ${LOGOS.map(logo => `<span class="text-xl font-bold text-gray-400">${logo}</span>`).join('')}
        </div>
      </div>
    </section>
    
    <!-- Features Section -->
    <section class="py-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-4xl font-bold text-white mb-4">Powerful Image Editing</h2>
          <p class="text-xl text-gray-400 max-w-2xl mx-auto">Everything you need to transform your images</p>
        </div>
        
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          ${FEATURES.map(f => `
            <div class="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-pink-500/30 transition-all duration-300 hover:bg-white/[0.07]">
              <div class="text-4xl mb-4">${f.icon}</div>
              <h3 class="text-lg font-semibold text-white mb-2">${f.title}</h3>
              <p class="text-gray-400 text-sm">${f.description}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
    
    <!-- Models Section -->
    <section class="py-24 bg-white/[0.02]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-4xl font-bold text-white mb-4">Available Models</h2>
          <p class="text-xl text-gray-400 max-w-2xl mx-auto">Choose from ${IMAGE_TO_IMAGE_MODELS.length}+ powerful editing models</p>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          ${IMAGE_TO_IMAGE_MODELS.map(m => `
            <button class="model-card group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-pink-500/50 transition-all duration-300 text-left hover:bg-white/[0.07]" data-model="${m.name}">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-semibold text-white group-hover:text-pink-400 transition-colors">${m.name}</span>
                <span class="text-xs px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300">${m.category}</span>
              </div>
              <p class="text-xs text-gray-500">${m.description}</p>
            </button>
          `).join('')}
        </div>
      </div>
    </section>
    
    <!-- Example Prompts Section -->
    <section class="py-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-4xl font-bold text-white mb-4">Example Transformations</h2>
          <p class="text-xl text-gray-400 max-w-2xl mx-auto">Get inspired by these creative transformations</p>
        </div>
        
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${EXAMPLE_PROMPTS.map((p, i) => `
            <div class="prompt-card group p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-pink-500/30 transition-all duration-300 cursor-pointer">
              <div class="flex items-center justify-between mb-4">
                <span class="text-xs font-medium px-3 py-1 rounded-full bg-pink-500/20 text-pink-300">${p.model}</span>
                <button class="text-xs text-gray-500 hover:text-white transition-colors try-btn">Try this →</button>
              </div>
              <p class="text-gray-300 leading-relaxed">${p.prompt}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
    
    <!-- CTA Section -->
    <section class="py-24">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-600 via-purple-600 to-blue-600 p-1">
          <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
          <div class="relative bg-black/40 backdrop-blur-xl rounded-3xl p-12 text-center">
            <h2 class="text-3xl lg:text-4xl font-bold text-white mb-4">Ready to Transform?</h2>
            <p class="text-xl text-white/80 mb-8 max-w-xl mx-auto">Start editing your images with powerful AI models</p>
            <button class="cta-btn px-10 py-4 bg-white text-black font-bold rounded-full text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105">
              Get Started Free
            </button>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Footer Links Placeholder -->
    <section class="py-12 border-t border-white/5">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <div class="flex items-center gap-2">
            <span class="text-gray-500 text-sm">Part of</span>
            <span class="text-white font-bold">MUAPI</span>
          </div>
          <div class="flex gap-6">
            <a href="#" class="text-gray-500 hover:text-white text-sm transition-colors">Pricing</a>
            <a href="#" class="text-gray-500 hover:text-white text-sm transition-colors">Documentation</a>
            <a href="#" class="text-gray-500 hover:text-white text-sm transition-colors">API</a>
            <a href="#" class="text-gray-500 hover:text-white text-sm transition-colors">Support</a>
          </div>
        </div>
      </div>
    </section>
  `;

  // Event Listeners
  container.querySelector('.start-btn').onclick = () => navigate('edit');
  container.querySelector('.cta-btn').onclick = () => navigate('edit');
  
  container.querySelectorAll('.model-card').forEach(card => {
    card.onclick = () => {
      const modelName = card.dataset.model;
      localStorage.setItem('prefill_model', modelName);
      navigate('edit');
    };
  });
  
  container.querySelectorAll('.prompt-card').forEach((card, i) => {
    card.onclick = () => {
      const prompt = EXAMPLE_PROMPTS[i];
      localStorage.setItem('prefill_prompt', prompt.prompt);
      localStorage.setItem('prefill_model', prompt.model);
      navigate('edit');
    };
  });
  
  container.querySelectorAll('.prompt-card .try-btn').forEach((btn, i) => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const prompt = EXAMPLE_PROMPTS[i];
      localStorage.setItem('prefill_prompt', prompt.prompt);
      localStorage.setItem('prefill_model', prompt.model);
      navigate('edit');
    };
  });

  return container;
}
