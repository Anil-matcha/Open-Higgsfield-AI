// Script to generate placeholder SVG thumbnails for Video Effects V2 (VFX)
// Run with: node scripts/generate-vfx-thumbnails.js

import fs from 'fs';
import path from 'path';

const vfxEffects = [
  { id: '01', name: 'Building Explosion', color1: '#e74c3c', color2: '#c0392b' },
  { id: '02', name: 'Car Explosion', color1: '#e74c3c', color2: '#c0392b' },
  { id: '03', name: 'Decay Time-Lapse', color1: '#636e72', color2: '#2d3436' },
  { id: '04', name: 'Disintegration', color1: '#6c5ce7', color2: '#a29bfe' },
  { id: '05', name: 'Electricity', color1: '#00cec9', color2: '#81ecec' },
  { id: '06', name: 'Flying', color1: '#0984e3', color2: '#74b9ff' },
  { id: '07', name: 'Huge Explosion', color1: '#e74c3c', color2: '#ff7675' },
  { id: '08', name: 'Levitate', color1: '#a29bfe', color2: '#6c5ce7' },
  { id: '09', name: 'Tornado', color1: '#636e72', color2: '#b2bec3' },
];

const outputDir = path.join(process.cwd(), 'public', 'thumbnails', 'effects', 'vfx');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

vfxEffects.forEach(effect => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 150 150">
  <defs>
    <linearGradient id="grad_${effect.id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${effect.color1};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${effect.color2};stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="150" height="150" rx="12" fill="url(#grad_${effect.id})"/>
  <circle cx="75" cy="65" r="25" fill="#fff" opacity="0.9"/>
  <ellipse cx="75" cy="85" rx="30" ry="20" fill="#fff" opacity="0.7"/>
  <text x="75" y="130" text-anchor="middle" fill="#fff" font-family="Arial, sans-serif" font-size="10" font-weight="bold">${effect.name}</text>
</svg>`;

  const filename = `${effect.id}-${effect.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')}.svg`;
  fs.writeFileSync(path.join(outputDir, filename), svg);
  console.log(`Created: ${filename}`);
});

console.log(`\nGenerated ${vfxEffects.length} placeholder SVG thumbnails in ${outputDir}`);
