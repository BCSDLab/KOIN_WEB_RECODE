import { useCallback, useEffect, useState } from 'react';
import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';

export const useCarouselController = (isMobile: boolean) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      slidesToScroll: isMobile ? 1 : 2,
    },
    [
      Autoplay({
        stopOnInteraction: false,
        stopOnMouseEnter: true,
        delay: 4000,
      }),
    ],
  );

  const [currentIndex, setCurrentIndex] = useState(1);
  const updateIndex = useCallback(() => {
    if (emblaApi) {
      setCurrentIndex(emblaApi.selectedScrollSnap());
    }
  }, [emblaApi]);

  const scrollTo = useCallback(
    (direction: 'prev' | 'next') => {
      if (emblaApi) {
        if (direction === 'next') emblaApi.scrollNext();
        if (direction === 'prev') emblaApi.scrollPrev();
      }
    },
    [emblaApi],
  );

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('slidesInView', updateIndex);

    return () => {
      // 클린업 함수 사용을 위해 off
      emblaApi.off('slidesInView', updateIndex);
    };
  }, [emblaApi, updateIndex]);

  return {
    emblaRef,
    currentIndex,
    scrollTo,
  };
};
