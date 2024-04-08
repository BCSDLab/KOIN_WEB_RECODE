/// <reference types="react-scripts" />

declare module '*.scss' {
  const content: { [className: string]: string };
  export = content;
}

declare module '@tanstack/react-query' {
  interface Register {
    defaultError: unknwon;
  }
}
