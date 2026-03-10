const STUDIO_THUMBNAILS = {
  image: '/thumbnails/studios/image.webp',
  video: '/thumbnails/studios/video.webp',
  cinema: '/thumbnails/studios/cinema.webp',
  storyboard: '/thumbnails/studios/storyboard.webp',
  effects: '/thumbnails/studios/effects.webp',
  edit: '/thumbnails/studios/edit.webp',
  upscale: '/thumbnails/studios/upscale.webp',
  character: '/thumbnails/studios/character.webp',
  commercial: '/thumbnails/studios/commercial.webp',
};

export function getStudioThumbnail(studioId) {
  return STUDIO_THUMBNAILS[studioId] || null;
}

export function getTemplateThumbnail(templateId) {
  return `/thumbnails/templates/${templateId}.webp`;
}

export function createThumbnailImg(src, alt, className = '') {
  const img = document.createElement('img');
  img.src = src;
  img.alt = alt;
  img.loading = 'lazy';
  img.className = className;
  img.onerror = () => {
    img.style.display = 'none';
    const parent = img.parentElement;
    if (parent) parent.classList.add('thumb-fallback');
  };
  img.onload = () => {
    const skeleton = img.parentElement?.querySelector('.thumb-skeleton');
    if (skeleton) skeleton.remove();
  };
  return img;
}
