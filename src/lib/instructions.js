const STUDIO_INSTRUCTIONS = {
  image: {
    title: 'Image Studio',
    steps: [
      { number: 1, heading: 'Choose a model', description: 'Select from 20+ AI models in the sidebar. Each model has different strengths for portraits, landscapes, or abstract art.' },
      { number: 2, heading: 'Write your prompt', description: 'Describe what you want to create. Be specific about style, lighting, composition, and mood for better results.' },
      { number: 3, heading: 'Set parameters', description: 'Adjust aspect ratio, resolution, and other settings. Use negative prompts to exclude unwanted elements.' },
      { number: 4, heading: 'Generate and refine', description: 'Click Generate to create your image. Use the result as a starting point and iterate on your prompt for improvements.' },
    ],
    quickTips: [
      'Add "4K, detailed, professional" to improve quality',
      'Specify camera angles like "shot from below" or "bird\'s eye view"',
      'Reference art styles: "in the style of watercolor painting"',
    ],
  },
  video: {
    title: 'Video Studio',
    steps: [
      { number: 1, heading: 'Select generation mode', description: 'Choose between text-to-video or image-to-video. Image-to-video uses your photo as the first frame.' },
      { number: 2, heading: 'Upload or describe', description: 'For image-to-video, upload a clear photo. For text-to-video, write a detailed description of the scene and motion.' },
      { number: 3, heading: 'Configure output', description: 'Set resolution (480p to 1080p), duration (3-10 seconds), and aspect ratio for your video.' },
      { number: 4, heading: 'Generate video', description: 'Video generation takes 1-3 minutes. The result will appear in your library when ready.' },
    ],
    quickTips: [
      'Start with image-to-video for more predictable results',
      'Keep prompts focused on a single action or movement',
      'Use 720p for a good balance of quality and speed',
    ],
  },
  cinema: {
    title: 'Cinema Studio',
    steps: [
      { number: 1, heading: 'Upload your scene', description: 'Start with a still image that will serve as the base for your cinematic shot.' },
      { number: 2, heading: 'Select camera movement', description: 'Choose from dolly, crane, orbit, FPV drone, and other professional camera movements.' },
      { number: 3, heading: 'Choose lens and look', description: 'Pick a camera lens profile (anamorphic, 70mm, macro) and film look to set the cinematic mood.' },
      { number: 4, heading: 'Render the shot', description: 'Generate your cinematic video. Each camera + lens combination produces a unique look.' },
    ],
    quickTips: [
      'Anamorphic lenses create the classic widescreen movie look',
      'Dolly zoom creates the famous Hitchcock vertigo effect',
      'Combine FPV drone with wide-angle for immersive shots',
    ],
  },
  storyboard: {
    title: 'Storyboard Studio',
    steps: [
      { number: 1, heading: 'Define your sequence', description: 'Describe the story you want to tell across multiple frames. Each frame represents a key moment.' },
      { number: 2, heading: 'Set frame count', description: 'Choose how many frames you need (3-12). More frames create a more detailed narrative.' },
      { number: 3, heading: 'Generate frames', description: 'The AI creates each frame with visual consistency, maintaining characters and settings across the sequence.' },
    ],
    quickTips: [
      'Start with 4-6 frames for a simple scene',
      'Describe camera angles for each shot for variety',
      'Use consistent character descriptions across frames',
    ],
  },
  effects: {
    title: 'Effects Studio',
    steps: [
      { number: 1, heading: 'Upload your photo', description: 'Start with a clear, well-lit photo. Face-forward portraits work best for most effects.' },
      { number: 2, heading: 'Browse effects', description: 'Explore 350+ effects organized by category: transformations, styles, VFX, overlays, and more.' },
      { number: 3, heading: 'Apply and preview', description: 'Select an effect to see the transformation. Most effects process in under 30 seconds.' },
    ],
    quickTips: [
      'Higher resolution input photos produce better results',
      'Try multiple effects on the same photo to compare',
      'Portrait effects work best with clear face visibility',
    ],
  },
  edit: {
    title: 'Edit Studio',
    steps: [
      { number: 1, heading: 'Upload your image', description: 'Upload the image you want to edit. Supports JPG, PNG, and WebP formats.' },
      { number: 2, heading: 'Select an edit tool', description: 'Choose from: remove objects, remove background, reframe, expand canvas, inpaint, or relight.' },
      { number: 3, heading: 'Mark the edit area', description: 'For removal tools, paint over the area you want to change. For reframe, select the new crop.' },
      { number: 4, heading: 'Apply changes', description: 'The AI processes your edit and shows the result. You can undo and retry with different settings.' },
    ],
    quickTips: [
      'Use a larger brush for object removal to include surrounding context',
      'Background removal works best with clear subject-background separation',
      'Relight can dramatically change the mood of a portrait',
    ],
  },
  upscale: {
    title: 'Upscale Suite',
    steps: [
      { number: 1, heading: 'Upload your image', description: 'Upload a low-resolution or blurry image that you want to enhance.' },
      { number: 2, heading: 'Choose upscale method', description: 'Select from standard upscale (2x-4x), creative upscale (adds detail), or face enhancement.' },
      { number: 3, heading: 'Process and download', description: 'The AI enhances your image while preserving the original content. Download the high-res result.' },
    ],
    quickTips: [
      'Creative upscale adds AI-generated detail, best for artistic images',
      'Face enhancement specifically improves facial features and skin texture',
      'Standard upscale is most faithful to the original image',
    ],
  },
  character: {
    title: 'Character Studio',
    steps: [
      { number: 1, heading: 'Upload reference photos', description: 'Upload 1-3 clear photos of the person or character you want to generate consistently.' },
      { number: 2, heading: 'Train the face model', description: 'The AI learns the facial features. This takes about a minute to process.' },
      { number: 3, heading: 'Generate new images', description: 'Write prompts to place your character in new scenes, outfits, and settings while maintaining face consistency.' },
    ],
    quickTips: [
      'Use clear, front-facing photos for the best face learning',
      'Multiple reference angles improve consistency',
      'Describe the scene but let the AI handle the face details',
    ],
  },
  commercial: {
    title: 'Commercial Studio',
    steps: [
      { number: 1, heading: 'Upload your product', description: 'Take a clean photo of your product against a simple background. Remove distractions.' },
      { number: 2, heading: 'Choose a scene', description: 'Select a commercial setting: studio, lifestyle, outdoor, or describe a custom scene.' },
      { number: 3, heading: 'Set the mood', description: 'Describe the lighting, angle, and atmosphere. Reference professional product photography styles.' },
      { number: 4, heading: 'Generate variations', description: 'Create multiple shots of your product in different settings for A/B testing or catalogs.' },
    ],
    quickTips: [
      'Clean product cutouts on white backgrounds work best',
      'Specify lighting: "soft studio light", "golden hour", "dramatic rim light"',
      'Generate multiple angles for a complete product showcase',
    ],
  },
};

let cachedInstructions = null;

export async function getInstructions(studioId) {
  if (cachedInstructions && cachedInstructions[studioId]) {
    return cachedInstructions[studioId];
  }

  try {
    const { supabase } = await import('./supabase.js');
    const { data, error } = await supabase
      .from('instructions')
      .select('*')
      .eq('studio_id', studioId)
      .maybeSingle();

    if (!error && data) {
      if (!cachedInstructions) cachedInstructions = {};
      cachedInstructions[studioId] = {
        title: data.title,
        steps: data.steps,
        quickTips: data.quick_tips,
      };
      return cachedInstructions[studioId];
    }
  } catch (e) {
    // fall through to hardcoded
  }

  return STUDIO_INSTRUCTIONS[studioId] || null;
}

export function getInstructionsSync(studioId) {
  return STUDIO_INSTRUCTIONS[studioId] || null;
}
