/**
 * Video Effects v2 Thumbnail Generation Script
 * 
 * This script generates AI thumbnails for the 41 Video FX v2 effects using MuAPI.
 * Run with: MUAPI_KEY=your_key node scripts/generate-video-effects-thumbnails.js
 * 
 * Output: .webp.png files in public/thumbnails/effects/video-effects/
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// List of 41 Video Effects v2 effects that need thumbnails
const EFFECTS = [
  { slug: 'balloon-flyaway', name: 'Balloon Flyaway', prompt: 'Person floating up into the sky with colorful balloons, dreamy magical atmosphere, upward motion blur, cinematic lighting' },
  { slug: 'blow-kiss', name: 'Blow Kiss', prompt: 'Person blowing a kiss to camera, romantic gesture, soft lighting, close-up portrait, warm colors' },
  { slug: 'body-shake', name: 'Body Shake', prompt: 'Character shaking body vigorously, comedic effect, energetic motion blur, funny expression' },
  { slug: 'break-glass', name: 'Break Glass', prompt: 'Person smashing through glass window, shattered glass particles flying, action scene, dramatic lighting' },
  { slug: 'carry-me', name: 'Carry Me', prompt: 'Person being carried in romantic dip, romantic scene, cinematic lighting, warm tones' },
  { slug: 'cartoon-doll', name: 'Cartoon Doll', prompt: 'Cartoonish doll-like character, exaggerated features, colorful animated style, big eyes' },
  { slug: 'cheek-kiss', name: 'Cheek Kiss', prompt: 'Person receiving kiss on cheek, tender moment, soft focus background, romantic atmosphere' },
  { slug: 'child-memory', name: 'Child Memory', prompt: 'Nostalgic childhood memory aesthetic, vintage filter, dreamy soft lighting, warm sepia tones' },
  { slug: 'couple-arrival', name: 'Couple Arrival', prompt: 'Couple walking toward camera together, romantic entrance, cinematic composition, golden hour' },
  { slug: 'fairy-me', name: 'Fairy Me', prompt: 'Person with fairy wings, magical sparkles, ethereal glowing lighting, fantasy style' },
  { slug: 'fashion-stride', name: 'Fashion Stride', prompt: 'Fashion model walking confidently in slow motion, high fashion photography, dramatic pose' },
  { slug: 'fisherman', name: 'Fisherman', prompt: 'Person fishing with rod, calm lake scene, peaceful nature setting, sunset lighting' },
  { slug: 'flower-receive', name: 'Flower Receive', prompt: 'Person receiving flowers, gift giving moment, romantic gesture, surprised happy expression' },
  { slug: 'flying', name: 'Flying', prompt: 'Person flying through air Superman style, cape flowing, powerful dynamic pose, clouds background' },
  { slug: 'french-kiss', name: 'French Kiss', prompt: 'Couple in deep kiss, romantic cinema moment, soft bokeh lighting, intimate atmosphere' },
  { slug: 'gender-swap', name: 'Gender Swap', prompt: 'Face transformation showing gender swap, before and after, smooth transition effect' },
  { slug: 'golden-epoch', name: 'Golden Epoch', prompt: 'Vintage golden age Hollywood style, classic glamour, warm sepia tones, black and white with grain' },
  { slug: 'hair-swap', name: 'Hair Swap', prompt: 'Dramatic hairstyle transformation, hair flipping, trendy new look, vibrant colors' },
  { slug: 'hugging', name: 'Hugging', prompt: 'Warm embrace between two people, emotional hug, comforting scene, soft lighting' },
  { slug: 'jiggle-up', name: 'Jiggle Up', prompt: 'Bouncy elastic effect character, jelly-like physics, fun energetic motion' },
  { slug: 'kissing-pro', name: 'Kissing Pro', prompt: 'Professional movie kissing scene, dramatic romantic moment, cinema quality' },
  { slug: 'live-memory', name: 'Live Memory', prompt: 'Personal memory being relived, nostalgic scene, sentimental atmosphere' },
  { slug: 'love-drop', name: 'Love Drop', prompt: 'Heart falling from above, romantic visual, floating hearts, pink purple gradient' },
  { slug: 'melt', name: 'Melt', prompt: 'Character melting like ice cream, surreal dissolve effect, dripping transformation' },
  { slug: 'minecraft', name: 'Minecraft', prompt: 'Minecraft blocky pixel art style, retro game aesthetic, cube world, pixel character' },
  { slug: 'muscling', name: 'Muscling', prompt: 'Flexing muscles, strong power pose, bodybuilding competition style' },
  { slug: 'nap-me-360p', name: 'Nap Me 360p', prompt: 'Person sleeping peacefully, cozy nap scene, comfortable bed, soft lighting' },
  { slug: 'paperman', name: 'Paperman', prompt: 'Paper cutout animation style, 2D paper character, stop motion aesthetic, white background' },
  { slug: 'pilot', name: 'Pilot', prompt: 'Pilot in airplane cockpit, aviation adventure, controls and windows, adventure style' },
  { slug: 'pinch', name: 'Pinch', prompt: 'Face being pinched cartoon effect, comedic expression, funny visual, exaggerated features' },
  { slug: 'pixel-me', name: 'Pixel Me', prompt: 'Pixel art transformation, 8-bit retro game character, digital pixelation, arcade style' },
  { slug: 'romantic-lift', name: 'Romantic Lift', prompt: 'Person lifting partner in romantic dip, wedding dance style, elegant dramatic pose' },
  { slug: 'sexy-me', name: 'Sexy Me', prompt: 'Glamorous portrait, attractive styling, magazine cover look, professional lighting' },
  { slug: 'slice-therapy', name: 'Slice Therapy', prompt: 'Body slice effect visualization, anatomical cross-section, medical art style' },
  { slug: 'soul-depart', name: 'Soul Depart', prompt: 'Soul leaving body, spiritual ascension, ethereal ghost effect, mystical lighting' },
  { slug: 'split-stance-human', name: 'Split Stance Human', prompt: 'Human with dramatic split leg stance, martial arts pose, dynamic spread' },
  { slug: 'squid-game', name: 'Squid Game', prompt: 'Squid Game mask and costume, Korean drama style, red light green light game' },
  { slug: 'toy-me', name: 'Toy Me', prompt: 'Person as toy figurine, plastic doll aesthetic, miniature world, collectible style' },
  { slug: 'walk-forward', name: 'Walk Forward', prompt: 'Person walking toward camera continuously, POV approach shot, motion blur' },
  { slug: 'zoom-in-fast', name: 'Zoom In Fast', prompt: 'Rapid zoom into face, zoom blur effect, intense focus transition, dramatic' },
  { slug: 'zoom-out', name: 'Zoom Out', prompt: 'Zooming out from person to reveal environment, pulling back cinematic shot' },
];

const OUTPUT_DIR = path.join(__dirname, '../public/thumbnails/effects/video-effects');
const BASE_URL = 'https://api.muapi.ai';

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Get API key from environment
const API_KEY = process.env.MUAPI_KEY;

if (!API_KEY) {
  console.error('❌ Error: MUAPI_KEY environment variable is required');
  console.log('');
  console.log('Usage:');
  console.log('  MUAPI_KEY=your_key node scripts/generate-video-effects-thumbnails.js');
  console.log('');
  console.log('Get your API key at: https://muapi.ai');
  process.exit(1);
}

console.log('🎬 Video Effects v2 Thumbnail Generator');
console.log('====================================');
console.log(`Total effects: ${EFFECTS.length}`);
console.log(`Output directory: ${OUTPUT_DIR}`);
console.log('');

// Poll for results
async function pollForResult(requestId, apiKey) {
  const maxAttempts = 60;
  const delay = 2000;
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    await new Promise(resolve => setTimeout(resolve, delay));
    
    try {
      const response = await fetch(`${BASE_URL}/api/v1/requests/${requestId}`, {
        headers: { 'x-api-key': apiKey }
      });
      
      if (!response.ok) continue;
      
      const data = await response.json();
      
      if (data.status === 'completed') {
        return data;
      } else if (data.status === 'failed') {
        throw new Error(`Generation failed: ${data.error || 'Unknown error'}`);
      }
      
      console.log(`  ⏳ Status: ${data.status} (attempt ${attempt + 1}/${maxAttempts})`);
    } catch (e) {
      console.log(`  ⏳ Waiting... (attempt ${attempt + 1})`);
    }
  }
  
  throw new Error('Timeout waiting for generation');
}

// Generate thumbnail using MuAPI
async function generateThumbnail(effect, index) {
  console.log(`[${index + 1}/${EFFECTS.length}] Generating: ${effect.name} (${effect.slug})`);
  
  try {
    // Submit the task
    const submitResponse = await fetch(`${BASE_URL}/api/v1/flux-schnell-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      },
      body: JSON.stringify({
        prompt: effect.prompt,
        aspect_ratio: '1:1'
      })
    });
    
    if (!submitResponse.ok) {
      const errorText = await submitResponse.text();
      throw new Error(`API Error: ${submitResponse.status} - ${errorText}`);
    }
    
    const submitData = await submitResponse.json();
    console.log(`  📤 Submitted, request_id: ${submitData.request_id || submitData.id}`);
    
    // Poll for results
    const result = await pollForResult(submitData.request_id || submitData.id, API_KEY);
    
    if (!result.url) {
      throw new Error('No URL in response');
    }
    
    console.log(`  ✅ Generated, downloading...`);
    
    // Download the image
    const imageResponse = await fetch(result.url);
    if (!imageResponse.ok) {
      throw new Error(`Failed to download image: ${imageResponse.status}`);
    }
    
    const imageBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(imageBuffer);
    
    // Save as .webp.png (keeping the extension the app expects)
    const outputPath = path.join(OUTPUT_DIR, `${effect.slug}.webp.png`);
    fs.writeFileSync(outputPath, buffer);
    
    console.log(`  💾 Saved: ${outputPath}`);
    console.log(`  📏 Size: ${(buffer.length / 1024 / 1024).toFixed(2)} MB`);
    console.log('');
    
    return { success: true, slug: effect.slug, path: outputPath };
  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`);
    console.log('');
    return { success: false, slug: effect.slug, error: error.message };
  }
}

// Main execution
async function main() {
  const results = [];
  const failed = [];
  
  for (let i = 0; i < EFFECTS.length; i++) {
    const effect = EFFECTS[i];
    const result = await generateThumbnail(effect, i);
    results.push(result);
    
    if (!result.success) {
      failed.push(result);
    }
    
    // Small delay between requests to avoid rate limiting
    if (i < EFFECTS.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  console.log('====================================');
  console.log('Generation complete!');
  console.log(`✅ Success: ${results.filter(r => r.success).length}/${EFFECTS.length}`);
  console.log(`❌ Failed: ${failed.length}/${EFFECTS.length}`);
  
  if (failed.length > 0) {
    console.log('');
    console.log('Failed effects:');
    failed.forEach(f => console.log(`  - ${f.slug}: ${f.error}`));
  }
  
  // Save metadata
  const metadataPath = path.join(OUTPUT_DIR, 'generation-metadata.json');
  const metadata = {
    generated: new Date().toString(),
    total: EFFECTS.length,
    success: results.filter(r => r.success).length,
    failed: failed.length,
    results: results
  };
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
  console.log(`📄 Metadata saved to: ${metadataPath}`);
}

main().catch(console.error);
