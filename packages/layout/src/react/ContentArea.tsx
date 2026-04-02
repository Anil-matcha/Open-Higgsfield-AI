import React, { ReactNode } from 'react';
import { ContentAreaConfig, defaultContentAreaConfig, createContentAreaStructure } from '../core/content-area';

interface ContentAreaProps {
  children: ReactNode;
  config?: ContentAreaConfig;
  className?: string;
}

export function ContentArea({
  children,
  config = defaultContentAreaConfig,
  className = '',
}: ContentAreaProps) {
  const contentStructure = createContentAreaStructure(config);

  return (
    <main
      className={`content-area ${className}`}
      style={contentStructure.container}
    >
      <div style={contentStructure.inner}>
        {children}
      </div>
    </main>
  );
}
