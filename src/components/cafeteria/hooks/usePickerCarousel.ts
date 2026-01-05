import { useEffect, useRef } from 'react';

const usePickerCarousel = (setDate: React.Dispatch<React.SetStateAction<Date>>) => {
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let movement = 0;
    let startX = 0;
    let scrollValue = 0;
    const slider = sliderRef.current;

    if (slider) {
      slider.scrollLeft = window.innerWidth;
    }

    const slideTouchStart = (e: TouchEvent) => {
      if (slider) {
        startX = e.touches[0].pageX - slider.offsetLeft;
        scrollValue = window.innerWidth;
      }
    };

    const slideTouchEnd = () => {
      if (slider) {
        slider.scrollLeft = window.innerWidth;
        if (movement < -120) {
          setDate((prev) => new Date(new Date(prev).setDate(prev.getDate() + 7)));
        }
        if (movement > 120) {
          setDate((prev) => new Date(new Date(prev).setDate(prev.getDate() - 7)));
        }
      }
      movement = 0;
    };

    const slideTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (slider) {
        movement = (e.touches[0].pageX - slider.offsetLeft - startX) * 0.9;

        slider.scrollLeft = scrollValue - movement;
      }
    };

    if (slider) {
      slider.addEventListener('touchstart', slideTouchStart);
      slider.addEventListener('touchend', slideTouchEnd);
      slider.addEventListener('touchcancel', slideTouchEnd);
      slider.addEventListener('touchmove', slideTouchMove);
    }

    return () => {
      if (slider) {
        slider.removeEventListener('touchstart', slideTouchStart);
        slider.removeEventListener('touchend', slideTouchEnd);
        slider.removeEventListener('touchcancel', slideTouchEnd);
        slider.removeEventListener('touchmove', slideTouchMove);
      }
    };
  }, [setDate]);

  return { sliderRef };
};

export default usePickerCarousel;
