import { useEffect, useRef, useState } from 'react';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';

const useMobileBusCarousel = () => {
  const isMobile = useMediaQuery();
  const sliderRef = useRef<HTMLDivElement>(null);
  const [mobileBusTypes, setMobileBusTypes] = useState([2, 0, 1]);

  useEffect(() => {
    let walk = 0;
    let startX = 0;
    let scrollValue = 0;
    const slider = sliderRef.current;
    if (slider?.scrollLeft) {
      slider.scrollLeft =
        window.innerWidth * 0.75 - (window.innerWidth - window.innerWidth * 0.75) / 2;
    }

    const slideTouchStart = (e: TouchEvent) => {
      if (slider) {
        startX = e.touches[0].pageX - slider.offsetLeft;
        scrollValue = slider.scrollLeft;
      }
    };

    const stopSlide = () => {
      if (slider) {
        slider.scrollLeft = window.innerWidth * 0.625;
        if (walk < -120) {
          setMobileBusTypes((state) => state.slice(1, 3).concat(state[0]));
        }
        if (walk > 120) {
          setMobileBusTypes((state) => [state[2]].concat(state.slice(0, 2)));
        }
      }
      walk = 0;
    };

    const slideTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (slider) {
        walk = (e.touches[0].pageX - slider.offsetLeft - startX) * 0.9;
        slider.scrollLeft = scrollValue - walk;
      }
    };

    if (slider) {
      slider.scrollLeft = window.innerWidth * 0.625;
      slider.addEventListener('touchstart', slideTouchStart);
      slider.addEventListener('touchend', stopSlide);
      slider.addEventListener('touchcancel', stopSlide);
      slider.addEventListener('touchmove', slideTouchMove);
    }

    return () => {
      if (slider) {
        slider.removeEventListener('touchstart', slideTouchStart);
        slider.removeEventListener('touchend', stopSlide);
        slider.removeEventListener('touchcancel', stopSlide);
        slider.removeEventListener('touchmove', slideTouchMove);
      }
    };
  }, []);

  const matchToMobileType = <T>(data: Array<T>) => {
    if (isMobile) return mobileBusTypes.map((index) => data[index]);
    return data;
  };

  return {
    isMobile,
    sliderRef,
    mobileBusTypes,
    matchToMobileType,
  };
};

export default useMobileBusCarousel;
