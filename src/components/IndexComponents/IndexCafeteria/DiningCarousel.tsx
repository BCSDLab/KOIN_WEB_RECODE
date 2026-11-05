import type { MouseEvent, PointerEvent } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { cn } from '@bcsdlab/utils';
import type { Dining, DiningPlace, DiningType } from 'api/dinings/entity';
import NotServed from 'assets/svg/not-served.svg';
import { DINING_TYPE_MAP, PLACE_ORDER } from 'static/cafeteria';

import styles from './DiningCarousel.module.scss';

interface DiningCarouselProps {
  dinings: Dining[];
  diningType: DiningType;
  dayLabel: string;
  onDiningClick: () => void;
  onPlaceClick: (place: DiningPlace) => void;
}

interface DiningCardProps {
  place: DiningPlace;
  dining?: Dining;
  diningType: DiningType;
  onClick: () => void;
  onInteract: () => void;
}

function DiningCard({ place, dining, diningType, onClick, onInteract }: DiningCardProps) {
  return (
    <button type="button" className={styles['meal-card']} onClick={onClick} onFocus={onInteract} onKeyDown={onInteract}>
      <div className={styles['meal-card__meta']}>
        <span>{DINING_TYPE_MAP[diningType]}</span>
        {dining && (
          <span className={styles['meal-card__details']}>
            {!!dining.price_cash && <span>{`₩${dining.price_cash.toLocaleString('ko-KR')}`}</span>}
            {!!dining.price_cash && !!dining.kcal && <span>·</span>}
            {!!dining.kcal && <strong>{`${dining.kcal}kcal`}</strong>}
          </span>
        )}
      </div>
      <div className={styles['meal-card__title-row']}>
        <span className={styles['meal-card__title']}>{place}</span>
        {dining?.soldout_at && <span className={styles['meal-card__soldout']}>품절</span>}
      </div>
      {dining ? (
        <p className={styles['meal-card__menu']}>
          {dining.menu
            .slice(0, 10)
            .map((menuItem) => menuItem.name)
            .join(' · ')}
        </p>
      ) : (
        <div className={styles['meal-card__empty']}>
          <NotServed />
          <p>식단이 제공되지 않아</p>
          <p>표시할 수 없습니다.</p>
        </div>
      )}
    </button>
  );
}

export default function DiningCarousel({
  dinings,
  diningType,
  dayLabel,
  onDiningClick,
  onPlaceClick,
}: DiningCarouselProps) {
  const [selectedPlace, setSelectedPlace] = useState<DiningPlace>('A코너');
  const [hasPreviousCards, setHasPreviousCards] = useState(false);
  const [hasMoreCards, setHasMoreCards] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const carouselDragRef = useRef<{ pointerId: number; startX: number; scrollLeft: number } | null>(null);
  const didDragRef = useRef(false);
  const isTabScrollRef = useRef(false);

  const updateCarouselState = useCallback(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const hasMore = carousel.scrollWidth - carousel.clientWidth - carousel.scrollLeft > 1;
    setHasPreviousCards(carousel.scrollLeft > 1);
    setHasMoreCards(hasMore);

    // 코너 탭이나 카드 포커스로 선택한 코너를 자동 스크롤 위치로 덮어쓰지 않는다.
    if (isTabScrollRef.current) return;

    const [firstCard, secondCard] = carousel.children;
    if (!firstCard) return;

    const firstCardRect = firstCard.getBoundingClientRect();
    const cardStep = secondCard ? secondCard.getBoundingClientRect().left - firstCardRect.left : firstCardRect.width;
    const activeIndex = hasMore ? Math.round(carousel.scrollLeft / cardStep) : carousel.children.length - 1;
    const activePlace = PLACE_ORDER[activeIndex];
    if (activePlace) setSelectedPlace(activePlace);
  }, []);

  const handleCarouselInteraction = (place?: DiningPlace) => {
    isTabScrollRef.current = place !== undefined;
    if (place) setSelectedPlace(place);
  };

  const handleCarouselPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    isTabScrollRef.current = false;
    if (event.pointerType !== 'mouse' || event.button !== 0) return;

    carouselDragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      scrollLeft: event.currentTarget.scrollLeft,
    };
    didDragRef.current = false;
    setIsDragging(true);
  };

  const handleCarouselPointerEnd = () => {
    carouselDragRef.current = null;
    setIsDragging(false);
  };

  const handleCarouselPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const drag = carouselDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (event.buttons !== 1) {
      handleCarouselPointerEnd();

      return;
    }

    const distance = event.clientX - drag.startX;
    if (!didDragRef.current && Math.abs(distance) < 5) return;

    if (!didDragRef.current) {
      event.currentTarget.setPointerCapture(event.pointerId);
      didDragRef.current = true;
    }
    event.preventDefault();
    isTabScrollRef.current = false;
    event.currentTarget.scrollLeft = drag.scrollLeft - distance;
  };

  const handleCarouselClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    if (!didDragRef.current || event.detail === 0) return;

    event.preventDefault();
    event.stopPropagation();
    didDragRef.current = false;
  };

  const handlePlaceClick = (place: DiningPlace) => {
    onPlaceClick(place);
    setSelectedPlace(place);

    const carousel = carouselRef.current;
    const card = carousel?.children[PLACE_ORDER.indexOf(place)];
    if (carousel && card) {
      isTabScrollRef.current = true;
      carousel.scrollTo({
        left: carousel.scrollLeft + card.getBoundingClientRect().left - carousel.getBoundingClientRect().left,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const observer = new ResizeObserver(updateCarouselState);
    observer.observe(carousel);

    return () => observer.disconnect();
  }, [updateCarouselState]);

  const placeTabs = (
    <div className={styles.place}>
      {PLACE_ORDER.map((placeName) => (
        <button
          type="button"
          key={placeName}
          className={cn({
            [styles.place__name]: true,
            [styles['place__name--selected']]: placeName === selectedPlace,
          })}
          onClick={() => handlePlaceClick(placeName)}
        >
          {placeName === '2캠퍼스' ? '2캠' : placeName}
        </button>
      ))}
    </div>
  );

  return (
    <div className={styles.card}>
      <div
        className={cn({
          [styles.carousel]: true,
          [styles['carousel--has-previous']]: hasPreviousCards,
          [styles['carousel--has-more']]: hasMoreCards,
        })}
      >
        <div
          ref={carouselRef}
          className={cn({
            [styles.carousel__viewport]: true,
            [styles['carousel__viewport--dragging']]: isDragging,
          })}
          role="group"
          aria-label={`${dayLabel}의 식단 목록`}
          onScroll={updateCarouselState}
          onWheel={() => handleCarouselInteraction()}
          onPointerDown={handleCarouselPointerDown}
          onPointerMove={handleCarouselPointerMove}
          onPointerUp={handleCarouselPointerEnd}
          onPointerCancel={handleCarouselPointerEnd}
          onPointerLeave={(event) => {
            if (!event.currentTarget.hasPointerCapture(event.pointerId)) handleCarouselPointerEnd();
          }}
          onLostPointerCapture={handleCarouselPointerEnd}
          onClickCapture={handleCarouselClickCapture}
        >
          {PLACE_ORDER.map((place) => (
            <DiningCard
              key={place}
              place={place}
              dining={dinings.find((dining) => dining.place === place && dining.type === diningType)}
              diningType={diningType}
              onClick={onDiningClick}
              onInteract={() => handleCarouselInteraction(place)}
            />
          ))}
        </div>
      </div>
      {placeTabs}
    </div>
  );
}
