import React, { ReactNode } from 'react';
import ReactDOM from 'react-dom';

export interface Portal {
  close: () => void;
}

interface OpenOptions {
  appendTo?: Element;
  onClose?: () => void;
}

type OpenFunc = (
  element: ((portal: Portal) => React.ReactElement) | React.ReactElement,
  options?: OpenOptions
) => void;

type CloseFunc = () => void;

export interface PortalManager {
  open: OpenFunc;
}

export const PortalContext = React.createContext<PortalManager | undefined>(
  undefined,
);

interface ProviderProps {
  children: ReactNode
}

export const PortalProvider = function PortalProvider({ children }: ProviderProps) {
  const [modalPortal, setModalPortal] = React.useState<ReactNode>();
  const el = document.getElementById('modal') as HTMLElement;

  const open: OpenFunc = React.useCallback((element, options = {}) => {
    const {
      onClose,
    } = options;

    const close: CloseFunc = () => setModalPortal(undefined);

    const portal: Portal = {
      close: () => {
        close();
        onClose?.();
      },
    };

    const portalElement = (
      typeof element === 'function' ? element(portal) : element);

    const privatePortal: ReactNode = portalElement;

    setModalPortal(privatePortal);
  }, []);

  const openMemo = React.useMemo(() => ({ open }), [open]);

  return (
    <PortalContext.Provider value={openMemo}>
      { children }
      <>
        { ReactDOM.createPortal(modalPortal, el) }
      </>
    </PortalContext.Provider>
  );
};

export default PortalProvider;
