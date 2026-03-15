import { navigate } from '../lib/router.js';

const TEXT_TO_VIDEO_MODELS = [
  { name: 'Kling v2.1', description: 'Kling v2.1 text-to-video', category: 'Kling' },
  { name: 'Kling v2.5', description: 'Kling v2.5 text-to-video', category: 'Kling' },
  { name: 'Kling v2.6', description: 'Kling v2.6 text-to-video', category: 'Kling' },
  { name: 'Kling v3.0', description: 'Kling v3.0 text-to-video', category: 'Kling' },
  { name: 'Sora', description: 'OpenAI Sora text-to-video', category: 'OpenAI' },
  { name: 'Sora 2', description: 'OpenAI Sora 2 text-to-video', category: 'OpenAI' },
  { name: 'Veo 3', description: 'Google Veo 3 text-to-video', category: 'Google' },
  { name: 'Veo 3.1', description: 'Google Veo 3.1 text-to-video', category: 'Google' },
  { name: 'Seedance Lite', description: 'Seedance Lite text-to-video', category: 'Seedance' },
  { name: 'Seedance Pro', description: 'Seedance Pro text-to-video', category: 'Seedance' },
  { name: 'Seedance v1.5', description: 'Seedance v1.5 text-to-video', category: 'Seedance' },
  { name: 'Seedance v2.0', description: 'Seedance v2.0 text-to-video', category: 'Seedance' },
  { name: 'Seedance 2.0 Extend', description: 'Seedance 2.0 Extend', category: 'Seedance' },
  { name: 'Wan 2.1', description: 'Wan 2.1 text-to-video', category: 'Wan' },
  { name: 'Wan 2.2', description: 'Wan 2.2 text-to-video', category: 'Wan' },
  { name: 'Wan 2.5', description: 'Wan 2.5 text-to-video', category: 'Wan' },
  { name: 'Wan 2.6', description: 'Wan 2.6 text-to-video', category: 'Wan' },
  { name: 'Hunyuan', description: 'Tencent Hunyuan text-to-video', category: 'Hunyuan' },
  { name: 'Hailuo 02', description: 'Hailuo 02 text-to-video', category: 'Hailuo' },
  { name: 'Hailuo 2.3', description: 'Hailuo 2.3 text-to-video', category: 'Hailuo' },
  { name: 'Runway Gen-3', description: 'Runway Gen-3 text-to-video', category: 'Runway' },
  { name: 'Pixverse v4.5', description: 'Pixverse v4.5 text-to-video', category: 'Pixverse' },
  { name: 'Pixverse v5', description: 'Pixverse v5 text-to-video', category: 'Pixverse' },
  { name: 'Pixverse v5.5', description: 'Pixverse v5.5 text-to-video', category: 'Pixverse' },
  { name: 'Vidu v2.0', description: 'Vidu v2.0 text-to-video', category: 'Vidu' },
  { name: 'LTX 2 Pro', description: 'LTX 2 Pro text-to-video', category: 'LTX' },
  { name: 'OVI', description: 'OVI text-to-video', category: 'OVI' },
  { name: 'Grok Imagine', description: 'Grok Imagine text-to-video', category: 'Grok' },
];

const EXAMPLE_PROMPTS = [
  { prompt: 'A drone shot flying over a futuristic city at sunset, neon lights, cinematic', model: 'Kling v2.1' },
  { prompt: 'Close-up of waves crashing on rocky coastline, dramatic ocean, 4K', model: 'Sora' },
  { prompt: 'Timelapse of a flower blooming in supernatural colors, magical lighting', model: 'Veo 3' },
  { prompt: 'Character walking through a cyberpunk street, rain reflections, epic', model: 'Runway Gen-3' },
  { prompt: 'Aerial view of mountains covered in snow, morning mist, nature documentary', model: 'Hunyuan' },
];

const FEATURES = [
  { icon: '🎬', title: 'Cinematic Quality', description: 'Generate professional-grade videos with stunning visuals' },
  { icon: '⏱️', title: '40+ Models', description: 'Access the latest video generation models from top AI labs' },
  { icon: '📹', title: 'Multiple Durations', description: 'Create videos from seconds to minutes in length' },
  { icon: '🎥', title: 'HD & 4K Support', description: 'Export videos in high definition up to 4K resolution' },
];

const LOGOS = ['Kling', 'OpenAI Sora', 'Google Veo', 'Runway', 'Meta', 'Stability AI'];

export function TextToVideoPage() {
  const container = document.createElement('div');
  container.className = 'w-full min-h-full bg-black';

  container.innerHTML = `
    <!-- Hero Section -->
    <section class="relative overflow-hidden">
      <!-- Background Effects -->
      <div class="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-black to-cyan-900/20"></div>
      <div class="absolute inset-0" style="background-image: radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.1) 0%, transparent 50%);"></div>
      
      <!-- Animated Grid -->
      <div class="absolute inset-0 opacity-20" style="background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 50px 50px;"></div>
      
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <!-- Badge -->
        <div class="flex justify-center mb-8">
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
            <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span class="text-sm text-gray-300">40+ Video Generation Models</span>
          </div>
        </div>
        
        <!-- Main Heading -->
        <h1 class="text-5xl sm:text-6xl lg:text-7xl font-bold text-center text-white tracking-tight mb-6">
          <span class="bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent">
            Text to Video
          </span>
        </h1>
        
        <!-- Subheading -->
        <p class="text-xl sm:text-2xl text-gray-400 text-center max-w-3xl mx-auto mb-10">
          Create stunning, professional-quality videos from simple text descriptions
        </p>
        
        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <button class="start-btn group relative px-8 py-4 bg-white text-black font-bold rounded-full text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/25">
            <span class="relative z-10 flex items-center gap-2">
              Start Creating Videos
              <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
            </span>
          </button>
          <button class="px-8 py-4 bg-white/5 text-white font-semibold rounded-full text-lg border border-white/10 hover:bg-white/10 transition-all backdrop-blur-sm">
            View Documentation
          </button>
        </div>
        
        <!-- Preview Video Placeholder -->
        <div class="relative max-w-4xl mx-auto">
          <div class="absolute -inset-1 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 rounded-2xl blur opacity-30"></div>
          <div class="relative bg-gray-900 rounded-2xl overflow-hidden border border-white/10" style="aspect-ratio: 16/9;">
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="text-center">
                <div class="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                  <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                </div>
                <p class="text-gray-500 text-sm">AI Generated Video</p>
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
          <h2 class="text-3xl lg:text-4xl font-bold text-white mb-4">Video Generation Reimagined</h2>
          <p class="text-xl text-gray-400 max-w-2xl mx-auto">Everything you need to create stunning videos</p>
        </div>
        
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          ${FEATURES.map(f => `
            <div class="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all duration-300 hover:bg-white/[0.07]">
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
          <p class="text-xl text-gray-400 max-w-2xl mx-auto">Choose from ${TEXT_TO_VIDEO_MODELS.length}+ powerful video generation models</p>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          ${TEXT_TO_VIDEO_MODELS.map(m => `
            <button class="model-card group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/50 transition-all duration-300 text-left hover:bg-white/[0.07]" data-model="${m.name}">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors">${m.name}</span>
                <span class="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300">${m.category}</span>
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
          <h2 class="text-3xl lg:text-4xl font-bold text-white mb-4">Example Prompts</h2>
          <p class="text-xl text-gray-400 max-w-2xl mx-auto">Get inspired by these creative video prompts</p>
        </div>
        
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${EXAMPLE_PROMPTS.map((p, i) => `
            <div class="prompt-card group p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-cyan-500/30 transition-all duration-300 cursor-pointer">
              <div class="flex items-center justify-between mb-4">
                <span class="text-xs font-medium px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300">${p.model}</span>
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
        <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-600 via-blue-600 to-purple-600 p-1">
          <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
          <div class="relative bg-black/40 backdrop-blur-xl rounded-3xl p-12 text-center">
            <h2 class="text-3xl lg:text-4xl font-bold text-white mb-4">Ready to Create Videos?</h2>
            <p class="text-xl text-white/80 mb-8 max-w-xl mx-auto">Start generating amazing videos with our AI models</p>
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
