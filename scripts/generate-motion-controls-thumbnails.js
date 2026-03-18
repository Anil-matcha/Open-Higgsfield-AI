// Script to generate placeholder SVG thumbnails for Motion Controls
// Run with: node scripts/generate-motion-controls-thumbnails.js

import fs from 'fs';
import path from 'path';

const motionControls = [
  { id: '01', name: '360 Orbit', color1: '#6c5ce7', color2: '#a29bfe' },
  { id: '02', name: 'Arc Shot', color1: '#00b894', color2: '#55efc4' },
  { id: '03', name: 'Car Chase', color1: '#d63031', color2: '#ff7675' },
  { id: '04', name: 'Car Mount Cam', color1: '#2d3436', color2: '#636e72' },
  { id: '05', name: 'Crash Zoom In', color1: '#e17055', color2: '#fab1a0' },
  { id: '06', name: 'Crash Zoom Out', color1: '#e17055', color2: '#fab1a0' },
  { id: '07', name: 'Crane Down', color1: '#fdcb6e', color2: '#f39c12' },
  { id: '08', name: 'Crane Overhead', color1: '#fdcb6e', color2: '#f39c12' },
  { id: '09', name: 'Crane Punch-In', color1: '#fdcb6e', color2: '#f39c12' },
  { id: '10', name: 'Crane Up', color1: '#fdcb6e', color2: '#f39c12' },
  { id: '11', name: 'Dirty Lens', color1: '#636e72', color2: '#b2bec3' },
  { id: '12', name: 'Dolly In', color1: '#0984e3', color2: '#74b9ff' },
  { id: '13', name: 'Dolly Left', color1: '#0984e3', color2: '#74b9ff' },
  { id: '14', name: 'Dolly Out', color1: '#0984e3', color2: '#74b9ff' },
  { id: '15', name: 'Dolly Right', color1: '#0984e3', color2: '#74b9ff' },
  { id: '16', name: 'Dolly Zoom In', color1: '#e84393', color2: '#fd79a8' },
  { id: '17', name: 'Dolly Zoom Out', color1: '#e84393', color2: '#fd79a8' },
  { id: '18', name: 'Dutch Angle', color1: '#e74c3c', color2: '#ff7675' },
  { id: '19', name: 'Fast Dolly Zoom In', color1: '#e84393', color2: '#fd79a8' },
  { id: '20', name: 'Fast Dolly Zoom Out', color1: '#e84393', color2: '#fd79a8' },
  { id: '21', name: 'Fisheye Lens', color1: '#00cec9', color2: '#81ecec' },
  { id: '22', name: 'Focus Shift', color1: '#f368e0', color2: '#fd79a8' },
  { id: '23', name: 'FPV Drone Cam', color1: '#27ae60', color2: '#2ecc71' },
  { id: '24', name: 'Handheld Cam', color1: '#e67e22', color2: '#f39c12' },
  { id: '25', name: 'Head Tracking', color1: '#a29bfe', color2: '#6c5ce7' },
  { id: '26', name: 'Hero Run', color1: '#d63031', color2: '#ff7675' },
  { id: '27', name: 'Human Timelapse', color1: '#74b9ff', color2: '#0984e3' },
  { id: '28', name: 'Landscape Timelapse', color1: '#00b894', color2: '#55efc4' },
  { id: '29', name: 'Lazy Susan', color1: '#fdcb6e', color2: '#f39c12' },
  { id: '30', name: 'Lens Crac', color1: '#636e72', color2: '#b2bec3' },
  { id: '31', name: 'Lens Flare', color1: '#ffeaa7', color2: '#fdcb6e' },
  { id: '32', name: 'Matrix Shot', color1: '#00cec9', color2: '#81ecec' },
  { id: '33', name: 'Motion Blur', color1: '#b2bec3', color2: '#636e72' },
  { id: '34', name: 'Object POV', color1: '#e67e22', color2: '#f39c12' },
  { id: '35', name: 'Overhead', color1: '#2d3436', color2: '#636e72' },
  { id: '36', name: 'Rap Video Cam', color1: '#e84393', color2: '#fd79a8' },
  { id: '37', name: 'Robotic Cam', color1: '#636e72', color2: '#b2bec3' },
  { id: '38', name: 'Snorricam', color1: '#0984e3', color2: '#74b9ff' },
  { id: '39', name: 'Tilt Down', color1: '#00b894', color2: '#55efc4' },
  { id: '40', name: 'Tilt Up', color1: '#00b894', color2: '#55efc4' },
  { id: '41', name: 'Whip Pan', color1: '#f39c12', color2: '#fdcb6e' },
  { id: '42', name: 'Wiggle', color1: '#e17055', color2: '#fab1a0' },
  { id: '43', name: 'Zoom In', color1: '#6c5ce7', color2: '#a29bfe' },
  { id: '44', name: 'Zoom In Through Object', color1: '#6c5ce7', color2: '#a29bfe' },
  { id: '45', name: 'Zoom Into Mouth', color1: '#6c5ce7', color2: '#a29bfe' },
  { id: '46', name: 'Zoom Out', color1: '#6c5ce7', color2: '#a29bfe' },
  { id: '47', name: 'Zoom Out Through Object', color1: '#6c5ce7', color2: '#a29bfe' },
];

const outputDir = path.join(process.cwd(), 'public', 'thumbnails', 'effects', 'motion-controls');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

motionControls.forEach(effect => {
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
  <text x="75" y="130" text-anchor="middle" fill="#fff" font-family="Arial, sans-serif" font-size="9" font-weight="bold">${effect.name}</text>
</svg>`;

  const filename = `${effect.id}-${effect.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')}.svg`;
  fs.writeFileSync(path.join(outputDir, filename), svg);
  console.log(`Created: ${filename}`);
});

console.log(`\nGenerated ${motionControls.length} placeholder SVG thumbnails in ${outputDir}`);
