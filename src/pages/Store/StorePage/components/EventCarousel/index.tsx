/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useGetAllEvents } from 'pages/Store/StorePage/components/hooks/useGetAllEvents';
import { useNavigate } from 'react-router-dom';
import useMediaQuery from 'utils/hooks/useMediaQuery';
import useDragEvent from 'pages/Store/StorePage/components/hooks/useDragEvent';
import styles from './EventCarousel.module.scss';

const SLIDE_WIDTH = 387; // width + gap

export default function EventCarousel() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery();
  const carouselList = useGetAllEvents() ?? [];
  const newCarouselList = [carouselList.at(-1), ...carouselList, carouselList.at(0)];

  const [animation, setAnimation] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [transX, setTransX] = useState(0);

  useEffect(() => {
    const slideTime = setTimeout(() => {
      setAnimation(true);
      setCurrentIndex((prevIndex) => (prevIndex === newCarouselList.length - 1
        ? 0 : prevIndex + 1));
    }, 10000);

    return () => {
      clearInterval(slideTime);
    };
  }, [currentIndex, newCarouselList]);

  const transfromValue = isMobile ? `translateX(${-100 * currentIndex}vw)` : `translateX(${-SLIDE_WIDTH * currentIndex + transX}px)`;

  const inrange = (v:number, min:number, max:number) => { // 범위 제한
    if (v < min) return min;
    if (v > max) return max;
    return v;
  };

  const {
    onTouchStart, onMouseDown, isDragging,
  } = useDragEvent({
    onDragChange: (x:number) => {
      setTransX(inrange(x, -SLIDE_WIDTH, SLIDE_WIDTH));
    },
    onDragEnd: (x:number) => {
      const maxIndex = newCarouselList.length - 1;
      if (x < (isMobile ? -10 : SLIDE_WIDTH / 2)) {
        setCurrentIndex((inrange(currentIndex + 1, 0, maxIndex)));
      }
      if (x > (isMobile ? 10 : SLIDE_WIDTH / 2)) {
        setCurrentIndex(inrange(currentIndex - 1, 0, maxIndex));
      }
      setAnimation(true);
    },
  });

  const handleClick = (shopId: number) => {
    if (!isDragging && transX === 0) {
      navigate(`/store/${shopId}`);
    }
  };

  return (
    <div className={styles.container}>
      {newCarouselList.map((item) => (
        item && (
          <button
            type="button"
            className={styles['swipe-item']}
            style={{ transform: transfromValue, transition: `transform ${animation ? 300 : 0}ms ease-in-out 0s` }}
            onTouchStart={onTouchStart}
            onMouseDown={onMouseDown}
            onClick={() => {
              handleClick(item.shop_id);
              setTransX(0);
            }}
            onTransitionEnd={() => {
              setAnimation(false);
              if (currentIndex === newCarouselList.length - 2) {
                setCurrentIndex(newCarouselList.length - 2);
              } else if (currentIndex === newCarouselList.length - 1) {
                setCurrentIndex(1);
              }
            }}
          >
            {item.thumbnail_images.length > 0 ? (
              <div className={styles['swipe-item__image']}>
                <img src={item!.thumbnail_images[0]} alt="가게 이미지" />
              </div>
            ) : (
              <div className={styles['swipe-item__empty-image']}>
                <img src="http://static.koreatech.in/assets/img/rectangle_icon.png" alt="썸네일 없음" />
              </div>
            ) }
            <div className={styles['swipe-item__text']}>
              <div>
                <span className={styles['swipe-item__name']}>
                  {item.shop_name}
                </span>
                {' 에서'}
              </div>
              <div className={styles['swipe-item__nowrap']}>할인 혜택을 받아보세요!</div>
            </div>
          </button>
        )
      ))}
    </div>
  );
}
