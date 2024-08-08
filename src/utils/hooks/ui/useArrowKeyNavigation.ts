import { useEffect } from 'react';

interface KeyboardEventProps {
  navigateImage: (move: number) => void;
}

function useArrowKeyNavigation({ navigateImage }: KeyboardEventProps): void {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'ArrowLeft') {
        navigateImage(-1);
      } else if (event.code === 'ArrowRight') {
        navigateImage(1);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [navigateImage]);
}

export default useArrowKeyNavigation;
