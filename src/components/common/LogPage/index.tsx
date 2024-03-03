import React from 'react';
import * as gtag from 'lib/gtag';
import { useLocation } from 'react-router-dom';

function LogPage() {
  const location = useLocation();

  React.useEffect(() => {
    gtag.pageView(location.pathname + location.search);
  }, [location]);

  return null;
}

export default LogPage;
