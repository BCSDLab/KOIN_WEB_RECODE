import { useState, useRef, useEffect } from 'react';

export function useEllipsisTooltip(text: string) {
  const textRef = useRef<HTMLDivElement>(null);
  const [isTooltipVisible, setTooltipVisible] = useState(false);
  const [isEllipsisApplied, setIsEllipsisApplied] = useState(false);

  useEffect(() => {
    if (textRef.current) {
      const element = textRef.current;

      const hiddenElement = document.createElement('div');
      hiddenElement.style.whiteSpace = 'nowrap';
      hiddenElement.style.maxWidth = `${element.offsetWidth}px`;
      hiddenElement.style.font = window.getComputedStyle(element).font;
      hiddenElement.textContent = text;

      document.body.appendChild(hiddenElement);
      const originalWidth = hiddenElement.scrollWidth;
      document.body.removeChild(hiddenElement);

      setIsEllipsisApplied(originalWidth > element.offsetWidth);
    }
  }, [text]);

  const handleMouseEnter = () => {
    setTooltipVisible(isEllipsisApplied);
  };

  const handleMouseLeave = () => {
    setTooltipVisible(false);
  };

  return {
    textRef,
    isTooltipVisible,
    handleMouseEnter,
    handleMouseLeave,
  };
}
