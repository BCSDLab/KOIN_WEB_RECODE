import React from 'react';

interface KeyboardEventProps {
  onClose: () => void
  onChangeImageIndex: (move: number) => void
}

function useModalKeyboardEvent({ onClose, onChangeImageIndex }: KeyboardEventProps) {
  React.useEffect(() => {
    function pressKey(event: KeyboardEvent) {
      if (event.code === 'Escape') {
        onClose();
      } else if (event.code === 'ArrowLeft') {
        onChangeImageIndex(-1);
      } else if (event.code === 'ArrowRight') {
        onChangeImageIndex(1);
      }
    }
    window.addEventListener('keydown', pressKey, true);
    return () => {
      window.removeEventListener('keydown', pressKey, true);
    };
  }, [onClose, onChangeImageIndex]);
}

export default useModalKeyboardEvent;
