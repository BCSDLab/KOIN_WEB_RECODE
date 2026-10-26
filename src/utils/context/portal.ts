import React from 'react';

export interface Portal {
  close: () => void;
}

interface OpenOptions {
  appendTo?: Element;
  onClose?: () => void;
}

export type OpenFunc = (
  element: ((portal: Portal) => React.ReactElement) | React.ReactElement,
  options?: OpenOptions,
) => void;

export type CloseFunc = () => void;

export interface PortalManager {
  open: OpenFunc;
  close: CloseFunc;
}

export const PortalContext = React.createContext<PortalManager | undefined>(undefined);
