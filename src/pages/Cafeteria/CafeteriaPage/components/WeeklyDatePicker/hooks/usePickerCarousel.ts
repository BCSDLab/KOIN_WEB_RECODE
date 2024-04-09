import { useEffect, useRef } from 'react';

const usePickerCarousel = () => {
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const slider = sliderRef.current;

    if (slider) {
      slider.addEventListener('touchstart', () => { });
    }

    return () => {
      if (slider) {
        slider.removeEventListener('touchstart', () => { });
      }
    };
  }, []);

  return { sliderRef };
};

export default usePickerCarousel;
