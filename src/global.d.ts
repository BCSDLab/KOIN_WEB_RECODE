/// <reference types="react-scripts" />
import '@tanstack/react-query';

declare module '@tanstack/react-query' {
  interface Register {
    defaultError: unknown
  }
}

declare module '*.scss' {
  const content: { [className: string]: string };
  export = content;
}
