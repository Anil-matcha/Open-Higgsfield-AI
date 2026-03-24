/**
 * Security utilities for safe DOM manipulation
 * Prevents XSS vulnerabilities by providing safe alternatives to innerHTML
 */

/**
 * Set text content safely - prevents XSS by escaping HTML entities
 * @param {HTMLElement} element - The element to set content on
 * @param {string} text - The text content (will be escaped)
 */
export function safeSetText(element, text) {
  if (!element) return;
  element.textContent = text || '';
}

/**
 * Create an element with safe text content
 * @param {string} tag - HTML tag name
 * @param {string} text - Text content (will be escaped)
 * @param {string} [className] - CSS class names
 * @returns {HTMLElement}
 */
export function createSafeElement(tag, text, className = '') {
  const element = document.createElement(tag);
  if (className) element.className = className;
  element.textContent = text || '';
  return element;
}

/**
 * Create an image element safely
 * @param {string} src - Image source URL
 * @param {string} alt - Alt text (will be escaped)
 * @param {string} [className] - CSS class names
 * @returns {HTMLImageElement}
 */
export function createSafeImage(src, alt = '', className = '') {
  const img = document.createElement('img');
  img.src = src || '';
  img.alt = alt || '';
  if (className) img.className = className;
  return img;
}

/**
 * Create a video element safely
 * @param {string} src - Video source URL
 * @param {string} [className] - CSS class names
 * @returns {HTMLVideoElement}
 */
export function createSafeVideo(src, className = '') {
  const video = document.createElement('video');
  video.src = src || '';
  video.muted = true;
  if (className) video.className = className;
  return video;
}

/**
 * Create SVG element safely
 * @param {string} svgContent - SVG inner content
 * @param {string} [className] - CSS class names
 * @returns {HTMLDivElement}
 */
export function createSafeSVG(svgContent, className = '') {
  const container = document.createElement('div');
  container.innerHTML = svgContent; // SVG content is trusted (static)
  if (className) container.className = className;
  return container.firstChild;
}

/**
 * Create a button with text content safely
 * @param {string} text - Button text (will be escaped)
 * @param {string} [className] - CSS class names
 * @returns {HTMLButtonElement}
 */
export function createSafeButton(text, className = '') {
  const btn = document.createElement('button');
  btn.type = 'button';
  if (className) btn.className = className;
  btn.textContent = text || '';
  return btn;
}

/**
 * Safely set multiple child elements, replacing all content
 * @param {HTMLElement} parent - Parent element
 * @param {HTMLElement[]} children - Array of child elements
 */
export function setChildren(parent, children = []) {
  if (!parent) return;
  parent.innerHTML = '';
  children.forEach(child => {
    if (child) parent.appendChild(child);
  });
}

/**
 * Create a card element with safe content
 * @param {Object} options - Card options
 * @param {string} options.title - Title text (escaped)
 * @param {string} options.subtitle - Subtitle text (escaped)
 * @param {string} options.imageUrl - Image URL (for thumbnail)
 * @param {string} options.className - Additional CSS classes
 * @returns {HTMLElement}
 */
export function createSafeCard({ title = '', subtitle = '', imageUrl = '', className = '' }) {
  const card = document.createElement('div');
  card.className = className;

  if (imageUrl) {
    const img = createSafeImage(imageUrl, title, 'w-full aspect-square object-cover');
    card.appendChild(img);
  }

  if (title || subtitle) {
    const info = document.createElement('div');
    info.className = 'p-3';
    
    if (title) {
      const titleEl = document.createElement('div');
      titleEl.className = 'text-xs font-bold text-white';
      titleEl.textContent = title;
      info.appendChild(titleEl);
    }
    
    if (subtitle) {
      const subEl = document.createElement('div');
      subEl.className = 'text-xs text-muted';
      subEl.textContent = subtitle;
      info.appendChild(subEl);
    }
    
    card.appendChild(info);
  }

  return card;
}

/**
 * Escape HTML special characters to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
export function escapeHtml(text) {
  if (typeof text !== 'string') return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Create HTML with escaped content - use sparingly, prefer other methods
 * Only use this when template strings are necessary
 * @param {Object} values - Object with values to escape
 * @returns {string} HTML string with escaped values
 */
export function safeHtml(template, values) {
  let result = template;
  for (const [key, value] of Object.entries(values)) {
    const escaped = escapeHtml(String(value ?? ''));
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), escaped);
  }
  return result;
}