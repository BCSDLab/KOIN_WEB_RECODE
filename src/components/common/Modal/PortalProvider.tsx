import React, { ReactNode } from 'react';
import ReactDOM from 'react-dom';

export interface Portal {
  close: () => void;
}

interface PrivatePortal {
  element: React.ReactElement;
  id: string;
  appendTo: Element;
}

interface OpenOptions {
  id?: string;
  appendTo?: Element;
  onClose?: () => void;
}

export type OpenFunc = (
  element: ((portal: Portal) => React.ReactElement) | React.ReactElement,
  options?: OpenOptions
) => void;

type CloseFunc = (portalId: string) => void;

export interface PortalManager {
  open: OpenFunc;
}

export const PortalContext = React.createContext<PortalManager | undefined>(
  undefined,
);

interface ChildrenProps {
  children: ReactNode
}

export const PortalProvider = function PortalProvider({ children }: ChildrenProps) {
  const [portals, setPortals] = React.useState<PrivatePortal[]>([]);

  const open: OpenFunc = React.useCallback((element, options = {}) => {
    const {
      id: portalId = 'modal',
      appendTo = document.body,
      onClose,
    } = options;

    if (portals.find(({ id }) => id === portalId)) return;

    if (!appendTo) {
      throw new Error('not exist this Dom');
    }

    const close: CloseFunc = (ID) => {
      setPortals((oldPortals) => oldPortals.filter(({ id }) => id !== ID));
    };

    const portal: Portal = {
      close: () => {
        close(portalId);
        onClose?.();
      },
    };

    const portalElement = (
      typeof element === 'function' ? element(portal) : element);

    const privatePortal: PrivatePortal = {
      element: portalElement,
      id: portalId,
      appendTo,
    };

    setPortals((oldPortals) => [...oldPortals, privatePortal]);
  }, [portals]);

  const openMemo = React.useMemo(() => ({ open }), [open]);

  return (
    <PortalContext.Provider value={openMemo}>
      {children}
      {portals.map(({ element, appendTo, id }) => (
        <React.Fragment key={id}>
          {ReactDOM.createPortal(element, appendTo)}
        </React.Fragment>
      ))}
    </PortalContext.Provider>
  );
};
