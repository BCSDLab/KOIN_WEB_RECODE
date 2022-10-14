import React from 'react';

interface KeyboardEventProps {
  onClose: () => void
  handleClickImage: (move: number) => void
}

function useModalKeyboardEvent({ onClose, handleClickImage }: KeyboardEventProps) {
  React.useEffect(() => {
    const pressKey = (event: KeyboardEvent) => {
      if (event.code === 'Escape') {
        onClose();
      } else if (event.code === 'ArrowLeft') {
        handleClickImage(-1);
      } else if (event.code === 'ArrowRight') {
        handleClickImage(1);
      }
    };
    window.addEventListener('keydown', (event: KeyboardEvent) => pressKey(event));
    return window.removeEventListener('keydown', (event: KeyboardEvent) => pressKey(event));
  }, [onClose, handleClickImage]);
}

export default useModalKeyboardEvent;
