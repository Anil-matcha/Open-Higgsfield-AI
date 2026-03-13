/*
  # Seed 45 new AI Video Effects thumbnails

  Adds thumbnail metadata for AI Video Effects that need visual thumbnails.
  These follow the dark theme design style used throughout the application.

  1. Modified Tables
    - `thumbnails` - 45 new rows inserted for AI Video Effect thumbnails

  2. Design Style
    - Dark theme with moody, atmospheric backgrounds
    - Deep blacks, purples, blues as primary colors
    - Subtle glows and highlights
    - Human subjects prominently featured
    - Action/motion frozen or dynamic
    - Professional photography look with dramatic lighting
*/

INSERT INTO thumbnails (target_type, target_id, image_path, alt_text, prompt_used) VALUES
  ('template', 'balloon-flyaway', '/thumbnails/templates/balloon-flyaway.webp', 'Person floating away holding balloons', 'Person floating upward into dark sky clutching colorful balloons, dramatic upward motion, dark atmospheric background'),
  ('template', 'blow-kiss', '/thumbnails/templates/blow-kiss.webp', 'Person blowing a kiss to camera', 'Person mid-kiss gesture with fingers touching lips then extending toward camera, dramatic studio lighting, dark moody background'),
  ('template', 'body-shake', '/thumbnails/templates/body-shake.webp', 'Person shaking body vigorously', 'Person shaking body with motion blur effect, energetic movement frozen, dark background with particle effects'),
  ('template', 'break-glass', '/thumbnails/templates/break-glass.webp', 'Person breaking through glass', 'Person mid-action breaking through shattered glass pane, shards flying outward, dramatic action shot with dark background'),
  ('template', 'carry-me', '/thumbnails/templates/carry-me.webp', 'Person being carried romantically', 'Romantic scene of person being lifted in arms, cinematic lighting, dark moody background with soft glow'),
  ('template', 'cartoon-doll', '/thumbnails/templates/cartoon-doll.webp', 'Person as 3D cartoon doll', 'Person rendered as cute 3D cartoon doll character with large eyes, vibrant colors against dark gradient background'),
  ('template', 'cheek-kiss', '/thumbnails/templates/cheek-kiss.webp', 'Person kissing on cheek', 'Close-up of cheek kiss moment, soft romantic lighting, dark background with subtle glow'),
  ('template', 'child-memory', '/thumbnails/templates/child-memory.webp', 'Person as child flashback', 'Person transformed into younger version as child, nostalgic dreamy aesthetic, soft focus with dark vignette'),
  ('template', 'couple-arrival', '/thumbnails/templates/couple-arrival.webp', 'Couple arriving together dramatic', 'Couple walking toward camera in dramatic slow motion, cinematic lighting, dark atmospheric background'),
  ('template', 'fairy-me', '/thumbnails/templates/fairy-me.webp', 'Person with fairy wings', 'Person with glowing fairy wings and magical particles, ethereal lighting, dark mystical background'),
  ('template', 'fashion-stride', '/thumbnails/templates/fashion-stride.webp', 'Person walking fashion runway', 'Person striding confidently on fashion runway, dramatic catwalk lighting, dark stage background'),
  ('template', 'fisherman', '/thumbnails/templates/fisherman.webp', 'Person as fisherman casting', 'Person dressed as fisherman casting fishing line, dramatic golden hour lighting, dark moody water background'),
  ('template', 'flower-receive', '/thumbnails/templates/flower-receive.webp', 'Person receiving flowers', 'Person receiving flowers with surprised delighted expression, romantic soft lighting, dark background'),
  ('template', 'flying', '/thumbnails/templates/flying.webp', 'Person flying through air', 'Person flying through air with cape flowing, superman pose, dramatic sky background with dark clouds'),
  ('template', 'french-kiss', '/thumbnails/templates/french-kiss.webp', 'Couple french kissing', 'Couple mid-french kiss in romantic embrace, soft dramatic lighting, dark background with subtle glow'),
  ('template', 'gender-swap', '/thumbnails/templates/gender-swap.webp', 'Person gender transformed', 'Split-screen showing gender transformation of person, dramatic reveal, dark moody background'),
  ('template', 'golden-epoch', '/thumbnails/templates/golden-epoch.webp', 'Person in retro vintage style', 'Person in 1920s vintage golden era style, sepia tones, art deco aesthetic, dramatic lighting'),
  ('template', 'hair-swap', '/thumbnails/templates/hair-swap.webp', 'Person with different hair', 'Person with dramatically different hairstyle, before-after aesthetic, dramatic studio lighting'),
  ('template', 'hugging', '/thumbnails/templates/hugging.webp', 'Person hugging someone', 'Warm hugging embrace between two people, soft romantic lighting, dark background with warm glow'),
  ('template', 'jiggle-up', '/thumbnails/templates/jiggle-up.webp', 'Person jiggle jumping up', 'Person jumping with jiggle physics effect, frozen mid-air, energetic motion, dark background'),
  ('template', 'kissing-pro', '/thumbnails/templates/kissing-pro.webp', 'Professional kissing photo', 'Couple in passionate kiss pose like movie poster, dramatic cinematic lighting, dark background'),
  ('template', 'live-memory', '/thumbnails/templates/live-memory.webp', 'Person in memory flashback', 'Person appearing as living memory with ethereal glow, dreamy nostalgic aesthetic, dark vignette'),
  ('template', 'love-drop', '/thumbnails/templates/love-drop.webp', 'Person with heart drops', 'Person with heart-shaped tears or droplets falling, emotional romantic scene, dark background with pink glow'),
  ('template', 'melt', '/thumbnails/templates/melt.webp', 'Person melting effect', 'Person melting like wax with dripping effect, surreal artistic style, dark background with warm lighting'),
  ('template', 'minecraft', '/thumbnails/templates/minecraft.webp', 'Person in Minecraft world', 'Person in Minecraft blocky 3D world, voxel aesthetic, pixelated terrain, dark game-like background'),
  ('template', 'muscling', '/thumbnails/templates/muscling.webp', 'Person flexing muscles', 'Person flexing muscles showing strength, dramatic bodybuilding pose, dramatic spotlight on dark background'),
  ('template', 'nap-me-360p', '/thumbnails/templates/nap-me.webp', 'Person sleeping peacefully', 'Person sleeping peacefully in bed, soft morning light, cozy peaceful atmosphere, dark bedroom background'),
  ('template', 'paperman', '/thumbnails/templates/paperman.webp', 'Person as paper cutout', 'Person transformed into paper cutout style, 2D flat aesthetic, colorful but dark layered background'),
  ('template', 'pilot', '/thumbnails/templates/pilot.webp', 'Person as airplane pilot', 'Person in pilot uniform with headset, cockpit background, dramatic aviation lighting'),
  ('template', 'pinch', '/thumbnails/templates/pinch.webp', 'Person pinching something', 'Person pinching small object between fingers, close-up detail shot, dramatic macro lighting'),
  ('template', 'pixel-me', '/thumbnails/templates/pixel-me.webp', 'Person in pixel art style', 'Person rendered as pixel art character, retro 8-bit aesthetic, dark digital background with scanlines'),
  ('template', 'romantic-lift', '/thumbnails/templates/romantic-lift.webp', 'Person lifting partner romantically', 'Person lifting partner in romantic embrace, slow motion, cinematic lighting, dark background'),
  ('template', 'sexy-me', '/thumbnails/templates/sexy-me.webp', 'Person in glamorous pose', 'Person in glamorous sexy pose, dramatic fashion lighting, dark studio background with rim light'),
  ('template', 'slice-therapy', '/thumbnails/templates/slice-therapy.webp', 'Person sliced in half effect', 'Person with body sliced revealing interior, medical scan aesthetic, dark background with blue glow'),
  ('template', 'soul-depart', '/thumbnails/templates/soul-depart.webp', 'Soul leaving body effect', 'Person with ghostly soul separating from body, ethereal ghost effect, dark mystical background'),
  ('template', 'split-stance-human', '/thumbnails/templates/split-stance.webp', 'Person with split stance', 'Person in powerful split stance pose, martial arts action pose, dramatic lighting on dark background'),
  ('template', 'squid-game', '/thumbnails/templates/squid-game.webp', 'Person in Squid Game costume', 'Person in iconic Squid Game green tracksuit with numbered mask, ominous dark background with red light'),
  ('template', 'toy-me', '/thumbnails/templates/toy-me.webp', 'Person as toy figurine', 'Person transformed into toy figurine like action figure, plastic texture, on display stand'),
  ('template', 'walk-forward', '/thumbnails/templates/walk-forward.webp', 'Person walking toward camera', 'Person walking directly toward camera in slow motion, dramatic approach shot, dark background'),
  ('template', 'zoom-in-fast', '/thumbnails/templates/zoom-in-fast.webp', 'Fast zoom into face', 'Extreme fast zoom into person face, motion blur edges, dramatic zoom effect, dark background'),
  ('template', 'zoom-out-fast', '/thumbnails/templates/zoom-out-fast.webp', 'Fast zoom out from face', 'Fast zoom out from person face revealing surroundings, expanding motion, dark background')
ON CONFLICT (target_type, target_id) DO NOTHING;