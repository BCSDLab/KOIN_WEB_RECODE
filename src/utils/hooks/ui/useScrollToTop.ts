import React from 'react';

export default function useScrollToTop() {
  React.useEffect(() => {
    document.documentElement.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }, []);
}
