import { useEffect } from 'react';

interface UseEscapeKeyOptions {
  onEscape: () => void;
}

export const useEscapeKey = ({ onEscape }: UseEscapeKeyOptions) => {
  useEffect(() => {
    const handleEscKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onEscape();
    };

    window.addEventListener('keydown', handleEscKeyDown);

    return () => {
      window.removeEventListener('keydown', handleEscKeyDown);
    };
  }, [onEscape]);
};
