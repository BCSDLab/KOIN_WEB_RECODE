import { PortalContext } from 'components/common/Modal/PortalProvider';
import React from 'react';

const useModalPortal = () => {
  const context = React.useContext(PortalContext);

  if (!context) {
    throw new Error('usePortals must be used within a PortalProvider');
  }

  return context;
};

export default useModalPortal;
