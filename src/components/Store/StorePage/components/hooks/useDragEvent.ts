import { useState } from 'react';

interface DragEventProps {
  onDragChange: (x: number) => void;
  onDragEnd: (x: number) => void;
}

const useDragEvent = ({ onDragChange, onDragEnd }: DragEventProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const isTouchScreen = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

  const handleTouchStart = (touchEvent: React.TouchEvent<HTMLButtonElement>) => {
    const touchMoveHandler = (e: TouchEvent) => {
      if (e.cancelable) e.preventDefault();

      const x = e.touches[0].pageX - touchEvent.touches[0].pageX;
      onDragChange(x);
    };

    const touchEndHandler = (e: TouchEvent) => {
      const x = e.changedTouches[0].pageX - touchEvent.touches[0].pageX;
      onDragEnd(x);
      document.removeEventListener('touchmove', touchMoveHandler);
    };

    document.addEventListener('touchmove', touchMoveHandler);
    document.addEventListener('touchend', touchEndHandler);
  };

  const handleMouseDown = (mouseEvent: React.MouseEvent<HTMLButtonElement>) => {
    const mouseMoveHandler = (e: MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
      const x = e.pageX - mouseEvent.pageX;
      onDragChange(x);
    };

    const mouseUpHandler = (e: MouseEvent) => {
      const x = e.pageX - mouseEvent.pageX;
      onDragEnd(x);
      document.removeEventListener('mousemove', mouseMoveHandler);
      setIsDragging(false);
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  };

  return isTouchScreen ? { onTouchStart: handleTouchStart, isDragging } : { onMouseDown: handleMouseDown, isDragging };
};

export default useDragEvent;
