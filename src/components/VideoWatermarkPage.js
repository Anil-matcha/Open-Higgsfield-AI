import { navigate } from '../lib/router.js';

const WATERMARK_TOOLS = [
  { name: 'AI Video Watermark Remover', description: 'Remove watermarks from videos using AI', category: 'Watermark' },
  { name: 'AI Video Object Remover', description: 'Remove unwanted objects from videos', category: 'Removal' },
  { name: 'AI Video Logo Remover', description: 'Remove logos and branding from videos', category: 'Removal' },
];

const FEATURES = [
  { icon: '🧹', title: 'Smart Removal', description: 'AI-powered watermark and object removal with seamless results' },
  { icon: '🎯', title: 'Precise Editing', description: 'Remove unwanted elements while preserving video quality' },
  { icon: '⚡', title: 'Fast Processing', description: 'Quick and efficient video processing with AI' },
  { icon: '🎬', title: 'Professional Results', description: 'Clean, broadcast-quality output every time' },
];

const LOGOS = ['Topaz Labs', 'Adobe', 'DaVinci', 'HitFilm', 'Wondershare', 'CapCut'];

const STEPS = [
  { number: '01', title: 'Upload Video', description: 'Simply upload your video with watermark or unwanted content' },
  { number: '02', title: 'AI Processing', description: 'Our AI analyzes and intelligently removes the watermark' },
  { number: '03', title: 'Download', description: 'Download your clean, watermark-free video instantly' },
];

export function VideoWatermarkPage() {
  const container = document.createElement('div');
  container.className = 'w-full min-h-full bg-black';

  container.innerHTML = `
    <!-- Hero Section -->
    <section class="relative overflow-hidden">
      <!-- Background Effects -->
      <div class="absolute inset-0 bg-gradient-to-br from-red-900/20 via-black to-rose-900/20"></div>
      <div class="absolute inset-0" style="background-image: radial-gradient(circle at 50% 50%, rgba(244, 63, 94, 0.1) 0%, transparent 50%);"></div>
      
      <!-- Animated Grid -->
      <div class="absolute inset-0 opacity-20" style="background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 50px 50px;"></div>
      
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <!-- Badge -->
        <div class="flex justify-center mb-8">
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
            <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span class="text-sm text-gray-300">Professional Video Cleaning</span>
          </div>
        </div>
        
        <!-- Main Heading -->
        <h1 class="text-5xl sm:text-6xl lg:text-7xl font-bold text-center text-white tracking-tight mb-6">
          <span class="bg-gradient-to-r from-white via-red-200 to-rose-200 bg-clip-text text-transparent">
            Video Watermark Remover
          </span>
        </h1>
        
        <!-- Subheading -->
        <p class="text-xl sm:text-2xl text-gray-400 text-center max-w-3xl mx-auto mb-10">
          Remove watermarks, logos, and unwanted elements from your videos with AI
        </p>
        
        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <button class="start-btn group relative px-8 py-4 bg-white text-black font-bold rounded-full text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/25">
            <span class="relative z-10 flex items-center gap-2">
              Remove Watermarks Free
              <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
            </span>
          </button>
          <button class="px-8 py-4 bg-white/5 text-white font-semibold rounded-full text-lg border border-white/10 hover:bg-white/10 transition-all backdrop-blur-sm">
            View Documentation
          </button>
        </div>
        
        <!-- Preview Video Placeholder -->
        <div class="relative max-w-4xl mx-auto">
          <div class="absolute -inset-1 bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 rounded-2xl blur opacity-30"></div>
          <div class="relative bg-gray-900 rounded-2xl overflow-hidden border border-white/10" style="aspect-ratio: 16/9;">
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="text-center">
                <div class="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center">
                  <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <p class="text-gray-500 text-sm">Clean Video Output</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- How It Works Section -->
    <section class="py-24 bg-white/[0.02]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-4xl font-bold text-white mb-4">How It Works</h2>
          <p class="text-xl text-gray-400 max-w-2xl mx-auto">Remove watermarks in three simple steps</p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-8">
          ${STEPS.map(s => `
            <div class="relative p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-red-500/30 transition-all duration-300">
              <div class="text-5xl font-bold text-red-500/30 mb-4">${s.number}</div>
              <h3 class="text-xl font-semibold text-white mb-2">${s.title}</h3>
              <p class="text-gray-400">${s.description}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
    
    <!-- Features Section -->
    <section class="py-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-4xl font-bold text-white mb-4">Powerful Removal Tools</h2>
          <p class="text-xl text-gray-400 max-w-2xl mx-auto">Everything you need to clean up your videos</p>
        </div>
        
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          ${FEATURES.map(f => `
            <div class="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-red-500/30 transition-all duration-300 hover:bg-white/[0.07]">
              <div class="text-4xl mb-4">${f.icon}</div>
              <h3 class="text-lg font-semibold text-white mb-2">${f.title}</h3>
              <p class="text-gray-400 text-sm">${f.description}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
    
    <!-- Tools Section -->
    <section class="py-24 bg-white/[0.02]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-4xl font-bold text-white mb-4">Available Tools</h2>
          <p class="text-xl text-gray-400 max-w-2xl mx-auto">Professional video cleaning tools</p>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          ${WATERMARK_TOOLS.map(m => `
            <button class="model-card group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-red-500/50 transition-all duration-300 text-left hover:bg-white/[0.07]" data-model="${m.name}">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-semibold text-white group-hover:text-red-400 transition-colors">${m.name}</span>
                <span class="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-300">${m.category}</span>
              </div>
              <p class="text-xs text-gray-500">${m.description}</p>
            </button>
          `).join('')}
        </div>
      </div>
    </section>
    
    <!-- Logos Section -->
    <section class="py-12 border-y border-white/5">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p class="text-center text-sm text-gray-500 mb-8">TRUSTED BY PROFESSIONALS</p>
        <div class="flex flex-wrap justify-center items-center gap-8 lg:gap-16 opacity-50">
          ${LOGOS.map(logo => `<span class="text-xl font-bold text-gray-400">${logo}</span>`).join('')}
        </div>
      </div>
    </section>
    
    <!-- CTA Section -->
    <section class="py-24">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-600 via-rose-600 to-pink-600 p-1">
          <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
          <div class="relative bg-black/40 backdrop-blur-xl rounded-3xl p-12 text-center">
            <h2 class="text-3xl lg:text-4xl font-bold text-white mb-4">Clean Your Videos Today</h2>
            <p class="text-xl text-white/80 mb-8 max-w-xl mx-auto">Remove watermarks and unwanted content with powerful AI</p>
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

  return container;
}
