import { defaultContentAreaConfig, createContentAreaStructure } from '../core/content-area';

export function createContentArea(options = {}) {
  const config = options.config || defaultContentAreaConfig;
  const contentStructure = createContentAreaStructure(config);

  const main = document.createElement('main');
  main.className = 'content-area';
  Object.assign(main.style, contentStructure.container);

  const inner = document.createElement('div');
  inner.className = 'content-area-inner';
  Object.assign(inner.style, contentStructure.inner);

  main.appendChild(inner);

  return {
    element: main,
    innerElement: inner,
    setContent: (content) => {
      inner.innerHTML = '';
      inner.appendChild(content);
    },
  };
}
