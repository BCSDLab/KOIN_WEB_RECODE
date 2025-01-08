import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';

const useCarouselController = (isMobile: boolean) => {
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
    ]
  );
  const [canPrevClick, setCanPrevClick] = useState(false);
  const [canNextClick, setCanNextClick] = useState(false);
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
    [emblaApi]
  );

  useEffect(() => {
    if (!emblaApi) return;
    setCanPrevClick(emblaApi.canScrollPrev());
    setCanNextClick(emblaApi.canScrollNext());
    emblaApi.on('slidesInView', updateIndex);
    // eslint-disable-next-line
    return () => {
      // 클린업 함수 사용을 위해 off
      emblaApi.off('slidesInView', updateIndex);
    };
  }, [emblaApi, updateIndex]);

  return {
    emblaRef,
    canPrevClick,
    canNextClick,
    currentIndex,
    scrollTo,
  };
};

export default useCarouselController;
