interface TouchHandlerProps {
  scale: number;
  setScale: React.Dispatch<React.SetStateAction<number>>;
  translate: { x: number; y: number };
  setTranslate: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  startDistanceRef: React.MutableRefObject<number>;
  startTranslateRef: React.MutableRefObject<{ x: number; y: number }>;
  startTouchRef: React.MutableRefObject<{ x: number; y: number } | null>;
}

export function createTouchHandlers({
  scale,
  setScale,
  translate,
  setTranslate,
  startDistanceRef: startDistanceRefParam,
  startTranslateRef: startTranslateRefParam,
  startTouchRef: startTouchRefParam,
}: TouchHandlerProps) {
  const startDistanceRef = startDistanceRefParam;
  const startTranslateRef = startTranslateRefParam;
  const startTouchRef = startTouchRefParam;

  const handleTouchStart = (e: TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      startDistanceRef.current = Math.hypot(dx, dy);
    } else if (e.touches.length === 1 && scale > 1) {
      startTouchRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
      startTranslateRef.current = { ...translate };
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const newDistance = Math.hypot(dx, dy);
      const newScale = newDistance / startDistanceRef.current;

      setScale((prev) => {
        const clamped = Math.min(Math.max(prev * newScale, 1), 3);
        startDistanceRef.current = newDistance;
        return clamped;
      });
    } else if (e.touches.length === 1 && scale > 1 && startTouchRef.current) {
      e.preventDefault();
      const deltaX = e.touches[0].clientX - startTouchRef.current.x;
      const deltaY = e.touches[0].clientY - startTouchRef.current.y;

      setTranslate({
        x: startTranslateRef.current.x + deltaX,
        y: startTranslateRef.current.y + deltaY,
      });
    }
  };

  const handleTouchEnd = () => {
    if (scale < 1.05) {
      setScale(1);
      setTranslate({ x: 0, y: 0 });
    }
    startTouchRef.current = null;
  };

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
}
