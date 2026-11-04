import type { MouseEvent, PointerEvent } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

import { cn } from '@bcsdlab/utils';
import type { Dining, DiningPlace, DiningType } from 'api/dinings/entity';
import BubbleTailBottom from 'assets/svg/bubble-tail-bottom.svg';
import Close from 'assets/svg/close-icon-grey.svg';
import ArrowRightIcon from 'assets/svg/common/arrow-right-icon.svg';
import NotServed from 'assets/svg/not-served.svg';
import RightArrow from 'assets/svg/right-arrow.svg';
import useDinings from 'components/cafeteria/hooks/useDinings';
import type { ServerDining } from 'components/IndexComponents/HomePage/types';
import { DINING_TYPE_MAP, PLACE_ORDER } from 'static/cafeteria';
import ROUTES from 'static/routes';
import useLogger from 'utils/hooks/analytics/useLogger';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import { isomorphicLocalStorage } from 'utils/ts/env';

import styles from './IndexCafeteria.module.scss';

interface IndexCafeteriaProps {
  serverDining: ServerDining;
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
      <span className={styles['meal-card__title']}>{place}</span>
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

/**
 * 시각 파생 값은 서버가 확정한 것을 쓴다. `useMount()` 뒤로 미루면 React 경고는 사라지지만
 * 서버가 그린 DOM이 하이드레이션 직후 매번 교체된다.
 */
function IndexCafeteria({ serverDining }: IndexCafeteriaProps) {
  const router = useRouter();
  const isMobile = useMediaQuery();
  const logger = useLogger();
  const { dinings } = useDinings(new Date(serverDining.date));

  const diningType = serverDining.type;
  const dayLabel = serverDining.dayLabel;

  const [selectedPlace, setSelectedPlace] = useState<DiningPlace>('A코너');
  const [hasPreviousCards, setHasPreviousCards] = useState(false);
  const [hasMoreCards, setHasMoreCards] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [isTooltipOpen, openTooltip, closeTooltip] = useBooleanState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const carouselDragRef = useRef<{ pointerId: number; startX: number; scrollLeft: number } | null>(null);
  const didDragRef = useRef(false);
  const isTabScrollRef = useRef(false);

  const selectedDining = dinings.find((dining) => dining.place === selectedPlace && dining.type === diningType);

  const updateCarouselState = useCallback(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const hasMore = carousel.scrollWidth - carousel.clientWidth - carousel.scrollLeft > 1;
    setHasPreviousCards(carousel.scrollLeft > 1);
    setHasMoreCards(hasMore);

    // 탭으로 이동한 경우에는 끝에서 여러 카드가 보여도 누른 코너의 선택을 유지한다.
    if (isTabScrollRef.current) return;

    const [firstCard, secondCard] = carousel.children;
    if (!firstCard) return;

    const firstCardRect = firstCard.getBoundingClientRect();
    const cardStep = secondCard ? secondCard.getBoundingClientRect().left - firstCardRect.left : firstCardRect.width;
    const activeIndex = hasMore ? Math.round(carousel.scrollLeft / cardStep) : carousel.children.length - 1;
    const activePlace = PLACE_ORDER[activeIndex];
    if (activePlace) setSelectedPlace(activePlace);
  }, []);

  const handleCarouselInteraction = () => {
    isTabScrollRef.current = false;
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
    event.currentTarget.scrollLeft = drag.scrollLeft - distance;
  };

  const handleCarouselClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    if (!didDragRef.current || event.detail === 0) return;

    event.preventDefault();
    event.stopPropagation();
    didDragRef.current = false;
  };

  const handleMoreClick = () => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'main_menu_moveDetailView',
      value: `${dayLabel} 식단`,
    });
    router.push(ROUTES.Cafeteria());
  };

  const handlePlaceClick = (place: DiningPlace) => {
    logger.actionEventClick({ team: 'CAMPUS', event_label: 'main_menu_corner', value: place });
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

  const handleTooltipContentButtonClick = () => {
    isomorphicLocalStorage.setItem('cafeteria-tooltip', 'used');
    handleMoreClick();
  };

  const handleTooltipCloseButtonClick = () => {
    isomorphicLocalStorage.setItem('cafeteria-tooltip', 'used');
    closeTooltip();
  };

  useEffect(() => {
    if (isomorphicLocalStorage.getItem('cafeteria-tooltip') === null) {
      openTooltip();
    }
  }, [openTooltip]);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const observer = new ResizeObserver(updateCarouselState);
    observer.observe(carousel);

    return () => observer.disconnect();
  }, [isMobile, updateCarouselState]);

  return (
    <section className={styles.template}>
      <h2 className={styles.header}>
        <button type="button" className={styles.header__title} onClick={handleMoreClick}>
          {isMobile ? `${dayLabel} 식단` : `${dayLabel}의 식단`}
        </button>
        <button type="button" className={styles.header__more} onClick={handleMoreClick}>
          {isMobile ? '더보기' : '전체보기'}
          {isMobile ? <RightArrow /> : <ArrowRightIcon aria-hidden />}
        </button>
        {isTooltipOpen && (
          <div className={styles.header__tooltip}>
            <button
              type="button"
              className={styles['header__tooltip-content']}
              onClick={handleTooltipContentButtonClick}
            >
              식단 사진 기능이 생겼어요!
              <br />
              오늘의 식단을 확인해보세요.
            </button>

            <button
              type="button"
              aria-label="close"
              className={styles['header__tooltip-close']}
              onClick={handleTooltipCloseButtonClick}
            >
              <Close />
            </button>
            <div className={styles['header__tooltip-asset']}>
              <BubbleTailBottom />
            </div>
          </div>
        )}
      </h2>

      <div className={styles.card}>
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
        {isMobile ? (
          <button
            type="button"
            className={cn({
              [styles.menus]: true,
              [styles['menus--not-served']]: !selectedDining,
            })}
            onClick={handleMoreClick}
          >
            <div className={styles.menus__type}>
              {diningType ? DINING_TYPE_MAP[diningType] : ''}
              {selectedDining?.soldout_at && <span className={styles.menus__chip}>품절</span>}
            </div>
            {selectedDining ? (
              <ul className={styles.menus__list}>
                {selectedDining.menu.slice(0, 10).map((menuItem) => (
                  <li className={styles.menus__name} key={menuItem.id}>
                    {menuItem.name}
                  </li>
                ))}
              </ul>
            ) : (
              <div className={styles['menus__not-served']}>
                <NotServed />
                <p>식단이 제공되지 않아</p>
                <p>표시할 수 없습니다.</p>
              </div>
            )}
          </button>
        ) : (
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
              onWheel={handleCarouselInteraction}
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
                  onClick={handleMoreClick}
                  onInteract={handleCarouselInteraction}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default IndexCafeteria;
