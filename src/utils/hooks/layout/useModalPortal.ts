import React from 'react';
import { PortalContext } from 'components/Modal/PortalProvider';

const useModalPortal = () => {
  const context = React.useContext(PortalContext);

  if (!context) {
    throw new Error('usePortals must be used within a PortalProvider');
  }

  return context;
};

export default useModalPortal;
