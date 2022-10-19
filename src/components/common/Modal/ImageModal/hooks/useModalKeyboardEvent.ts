import React from 'react';

interface KeyboardEventProps {
  onClose: () => void
  handleClickImage: (move: number) => void
}

function useModalKeyboardEvent({ onClose, handleClickImage }: KeyboardEventProps) {
  React.useEffect(() => {
    function pressKey(event: KeyboardEvent) {
      if (event.code === 'Escape') {
        onClose();
      } else if (event.code === 'ArrowLeft') {
        handleClickImage(-1);
      } else if (event.code === 'ArrowRight') {
        handleClickImage(1);
      }
    }
    window.addEventListener('keydown', pressKey, true);
    return () => {
      window.removeEventListener('keydown', pressKey, true);
    };
  }, [onClose, handleClickImage]);
}

export default useModalKeyboardEvent;
