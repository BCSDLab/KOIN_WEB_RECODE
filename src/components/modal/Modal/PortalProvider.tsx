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
  close: CloseFunc;
}

export const PortalContext = React.createContext<PortalManager | undefined>(
  undefined,
);

interface PortalProviderProps {
  children: ReactNode
}

const PortalProvider = function PortalProvider({ children }: PortalProviderProps) {
  const [modalPortal, setModalPortal] = React.useState<ReactNode>();
  const [mounted, setMounted] = React.useState(false);
  const [container, setContainer] = React.useState<Element | null>(null);

  const open: OpenFunc = React.useCallback((element, options = {}) => {
    const { onClose, appendTo } = options;

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
    if (appendTo) setContainer(appendTo);
  }, []);

  const portalOption = React.useMemo(() => ({
    open,
    close: () => setModalPortal(undefined),
  }), [open]);

  React.useEffect(() => {
    setMounted(true);
    if (typeof document !== 'undefined') {
      setContainer((prev) => prev ?? document.body);
    }
  }, []);

  return (
    <PortalContext.Provider value={portalOption}>
      { children }
      { mounted && modalPortal && container
        ? ReactDOM.createPortal(modalPortal, container)
        : null }
    </PortalContext.Provider>
  );
};

export default PortalProvider;
