// Script to generate placeholder SVG thumbnails for AI Video Effects
// Run with: node scripts/generate-effect-thumbnails.js

import fs from 'fs';
import path from 'path';

const aiVideoEffects = [
  { id: '01', name: '360 Rotation', color1: '#1a1a2e', color2: '#16213e', icon: 'rotate' },
  { id: '02', name: 'Abandoned Places', color1: '#2d3436', color2: '#636e72', icon: 'building' },
  { id: '03', name: 'Angry', color1: '#c0392b', color2: '#e74c3c', icon: 'face' },
  { id: '04', name: 'Animal Documentary', color1: '#27ae60', color2: '#2ecc71', icon: 'paw' },
  { id: '05', name: 'Assassin It', color1: '#2c3e50', color2: '#34495e', icon: 'mask' },
  { id: '06', name: 'Baby It', color1: '#ff6b6b', color2: '#ee5a24', icon: 'baby' },
  { id: '07', name: 'Boxing', color1: '#e67e22', color2: '#f39c12', icon: 'glove' },
  { id: '08', name: 'Bride It', color1: '#fd79a8', color2: '#e84393', icon: 'bride' },
  { id: '09', name: 'Cakeify', color1: '#ff9ff3', color2: '#f368e0', icon: 'cake' },
  { id: '10', name: 'Cartoon Jaw Drop', color1: '#feca57', color2: '#ff9f43', icon: 'cartoon' },
  { id: '11', name: 'Cats', color1: '#ff6348', color2: '#ff7f50', icon: 'cat' },
  { id: '12', name: 'Crush It', color1: '#6c5ce7', color2: '#a29bfe', icon: 'crush' },
  { id: '13', name: 'Crying', color1: '#74b9ff', color2: '#0984e3', icon: 'cry' },
  { id: '14', name: 'Cyberpunk 2077', color1: '#00d2d3', color2: '#01a3a4', icon: 'cyber' },
  { id: '15', name: 'Deflate It', color1: '#a4b0be', color2: '#747d8c', icon: 'deflate' },
  { id: '16', name: 'Disney Princess It', color1: '#ffeaa7', color2: '#fdcb6e', icon: 'crown' },
  { id: '17', name: 'Dogs', color1: '#d63031', color2: '#ff7675', icon: 'dog' },
  { id: '18', name: 'Eye Close-Up', color1: '#00cec9', color2: '#81ecec', icon: 'eye' },
  { id: '19', name: 'Fantasy Landscapes', color1: '#6c5ce7', color2: '#74b9ff', icon: 'landscape' },
  { id: '20', name: 'Film Noir', color1: '#2d3436', color2: '#000000', icon: 'noir' },
  { id: '21', name: 'Fire', color1: '#d63031', color2: '#ff7675', icon: 'fire' },
  { id: '22', name: 'Glamor', color1: '#fd79a8', color2: '#e84393', icon: 'star' },
  { id: '23', name: 'Goblin', color1: '#00b894', color2: '#55efc4', icon: 'goblin' },
  { id: '24', name: 'Gun Reveal', color1: '#2d3436', color2: '#636e72', icon: 'gun' },
  { id: '25', name: 'Hug Jesus', color1: '#f8e71c', color2: '#f5a623', icon: 'hug' },
  { id: '26', name: 'Hulk Transformation', color1: '#27ae60', color2: '#00b894', icon: 'muscle' },
  { id: '27', name: 'Inflate It', color1: '#e17055', color2: '#fab1a0', icon: 'inflate' },
  { id: '28', name: 'Jungle It', color1: '#00b894', color2: '#55efc4', icon: 'jungle' },
  { id: '29', name: 'Jumpscare', color1: '#d63031', color2: '#ff7675', icon: 'scare' },
  { id: '30', name: 'Kamehameha', color1: '#0984e3', color2: '#74b9ff', icon: 'blast' },
  { id: '31', name: 'Kiss Cam', color1: '#fd79a8', color2: '#e84393', icon: 'heart' },
  { id: '32', name: 'Kissing', color1: '#fd79a8', color2: '#e84393', icon: 'kiss' },
  { id: '33', name: 'Lego', color1: '#fdcb6e', color2: '#f39c12', icon: 'lego' },
  { id: '34', name: 'Laughing', color1: '#fdcb6e', color2: '#e17055', icon: 'laugh' },
  { id: '35', name: 'Little Planet', color1: '#6c5ce7', color2: '#a29bfe', icon: 'planet' },
  { id: '36', name: 'Live Wallpaper', color1: '#00cec9', color2: '#81ecec', icon: 'phone' },
  { id: '37', name: 'Looping Pixel Art', color1: '#a29bfe', color2: '#6c5ce7', icon: 'pixel' },
  { id: '38', name: 'Melt It', color1: '#e17055', color2: '#d63031', icon: 'melt' },
  { id: '39', name: 'Mona Lisa It', color1: '#d4a373', color2: '#faedcd', icon: 'art' },
  { id: '40', name: 'Museum It', color1: '#b2bec3', color2: '#636e72', icon: 'museum' },
  { id: '41', name: 'Muscle Show Off', color1: '#e67e22', color2: '#f39c12', icon: 'strong' },
  { id: '42', name: 'Orc', color1: '#27ae60', color2: '#2ecc71', icon: 'orc' },
  { id: '43', name: 'Pixar', color1: '#6c5ce7', color2: '#a29bfe', icon: 'pixar' },
  { id: '44', name: 'Pirate Captain', color1: '#2d3436', color2: '#636e72', icon: 'pirate' },
  { id: '45', name: 'POV Driving', color1: '#2d3436', color2: '#74b9ff', icon: 'car' },
  { id: '46', name: 'Princess It', color1: '#ffeaa7', color2: '#fdcb6e', icon: 'crown' },
  { id: '47', name: 'Puppy It', color1: '#d63031', color2: '#ff7675', icon: 'puppy' },
  { id: '48', name: 'Robotic Face Reveal', color1: '#636e72', color2: '#b2bec3', icon: 'robot' },
  { id: '49', name: 'Samurai It', color1: '#c0392b', color2: '#e74c3c', icon: 'sword' },
  { id: '50', name: 'Sharingan Eyes', color1: '#d63031', color2: '#ff7675', icon: 'eye' },
  { id: '51', name: 'Skyrim Fus Ro Dah', color1: '#74b9ff', color2: '#0984e3', icon: 'shout' },
  { id: '52', name: 'Snow White It', color1: '#ffffff', color2: '#dfe6e9', icon: 'snow' },
  { id: '53', name: 'Squish It', color1: '#fd79a8', color2: '#e84393', icon: 'squish' },
  { id: '54', name: 'Steamboat Willie', color1: '#2d3436', color2: '#636e72', icon: 'disney' },
  { id: '55', name: 'Super Saiyan Transformation', color1: '#f39c12', color2: '#f1c40f', icon: 'power' },
  { id: '56', name: 'Tsunami', color1: '#0984e3', color2: '#74b9ff', icon: 'wave' },
  { id: '57', name: 'Ultra Wide', color1: '#6c5ce7', color2: '#a29bfe', icon: 'wide' },
  { id: '58', name: 'VHS Footage', color1: '#2d3436', color2: '#636e72', icon: 'vhs' },
  { id: '59', name: 'VIP It', color1: '#f1c40f', color2: '#f39c12', icon: 'star' },
  { id: '60', name: 'Warrior It', color1: '#c0392b', color2: '#e74c3c', icon: 'warrior' },
  { id: '61', name: 'Wind Blast', color1: '#81ecec', color2: '#00cec9', icon: 'wind' },
  { id: '62', name: 'Younger Self Selfie', color1: '#ff9ff3', color2: '#f368e0', icon: 'young' },
  { id: '63', name: 'Zen It', color1: '#00b894', color2: '#55efc4', icon: 'zen' },
  { id: '64', name: 'Zoom Call', color1: '#0984e3', color2: '#74b9ff', icon: 'video' },
];

const outputDir = path.join(process.cwd(), 'public', 'thumbnails', 'effects', 'ai-video');

// Create directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

aiVideoEffects.forEach(effect => {
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

console.log(`\nGenerated ${aiVideoEffects.length} placeholder SVG thumbnails in ${outputDir}`);
