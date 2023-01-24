import { useEffect, useRef, useState } from 'react';
import useMediaQuery from 'utils/hooks/useMediaQuery';

const useMobileBusCarousel = () => {
  const isMobile = useMediaQuery();
  const sliderRef = useRef<HTMLDivElement>(null);
  const [mobileBusTypes, setMobileBusTypes] = useState([2, 0, 1]);

  useEffect(() => {
    let walk = 0;
    let startX = 0;
    let scrollValue = 0;

    const slideTouchStart = (e:TouchEvent) => {
      if (sliderRef.current) {
        startX = e.touches[0].pageX - sliderRef.current.offsetLeft;
        scrollValue = sliderRef.current.scrollLeft;
      }
    };

    const stopSlide = () => {
      if (sliderRef.current) {
        sliderRef.current.scrollLeft = window.innerWidth * 0.625;
        if (walk < -120) {
          setMobileBusTypes((state) => [state[2]].concat(state.slice(0, 2)));
        }
        if (walk > 120) {
          setMobileBusTypes((state) => state.slice(1, 3).concat(state[0]));
        }
      }
      walk = 0;
    };

    const slideTouchMove = (e:TouchEvent) => {
      e.preventDefault();
      if (sliderRef.current) {
        walk = (e.touches[0].pageX - sliderRef.current.offsetLeft - startX) * 0.9;
        sliderRef.current.scrollLeft = scrollValue - walk;
      }
    };

    if (sliderRef.current) {
      sliderRef.current.scrollLeft = window.innerWidth * 0.625;
      sliderRef.current.addEventListener('touchstart', slideTouchStart);
      sliderRef.current.addEventListener('touchend', stopSlide);
      sliderRef.current.addEventListener('touchcancel', stopSlide);
      sliderRef.current.addEventListener('touchmove', slideTouchMove);
    }
  }, []);

  const matchToMobileType = <T>(data: Array<T>) => {
    if (isMobile) return mobileBusTypes.map((index) => data[index]);
    return data;
  };

  return {
    isMobile, sliderRef, mobileBusTypes, matchToMobileType,
  };
};

export default useMobileBusCarousel;
