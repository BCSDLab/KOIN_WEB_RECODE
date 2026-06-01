import { useRef, useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { coopshopQueries } from 'api/coopshop/queries';
import useDinings from 'components/cafeteria/hooks/useDinings';
import { filterDinings } from 'components/cafeteria/utils/filter';
import { DiningTime } from 'components/cafeteria/utils/time';
import { DINING_TYPE_MAP } from 'static/cafeteria';
import type { CoopShopDetailResponse } from 'api/coopshop/entity';
import type { Dining, DiningPlace } from 'api/dinings/entity';
import styles from './IndexMobileCafeteria.module.scss';

const mealTabs: DiningPlace[] = ['A코너', 'B코너', 'C코너', '능수관'];

const getDiningTimeLabel = (cafeteriaInfo: CoopShopDetailResponse, diningDate: Date, diningType: Dining['type']) => {
  const diningTypeLabel = DINING_TYPE_MAP[diningType];
  const dayOfWeek = diningDate.getDay();
  const dayLabel = dayOfWeek === 6 ? '토요일' : '평일';
  const schedule = cafeteriaInfo.opens.find((open) => open.day_of_week === dayLabel && open.type === diningTypeLabel);

  if (!schedule) return '';

  return `${schedule.open_time} - ${schedule.close_time}`;
};

function MealCard({ dining, diningLabel }: { dining: Dining; diningLabel: string }) {
  const menu = dining.menu.map((menuItem) => menuItem.name).join(' · ');

  return (
    <article className={styles['meal-card']}>
      <div className={styles['meal-card__meta']}>
        <span>{diningLabel}</span>
        <span>
          {dining.price_cash && `₩${dining.price_cash.toLocaleString()} · `}
          <strong>{dining.kcal}kcal</strong>
        </span>
      </div>
      <h3 className={styles['meal-card__title']}>{dining.place}</h3>
      <p className={styles['meal-card__menu']}>{menu}</p>
    </article>
  );
}

function IndexMobileCafeteria() {
  const diningTime = new DiningTime();
  const diningDate = diningTime.generateDiningDate();

  const carouselRef = useRef<HTMLDivElement>(null);
  const [selectedPlace, setSelectedPlace] = useState<DiningPlace>('A코너');

  const { dinings } = useDinings(diningDate);
  const { data: cafeteriaInfo } = useSuspenseQuery(coopshopQueries.cafeteriaInfo());

  const filteredDinings = filterDinings(dinings, diningTime.getType());
  const availableDinings = mealTabs
    .map((place) => filteredDinings.find((dining) => dining.place === place && dining.menu.length > 0))
    .filter((dining): dining is Dining => Boolean(dining));
  const diningLabel = getDiningTimeLabel(cafeteriaInfo, diningDate, diningTime.getType());
  const activePlace = availableDinings.some((dining) => dining.place === selectedPlace)
    ? selectedPlace
    : availableDinings[0]?.place;

  const handleTabClick = (place: DiningPlace) => {
    const diningIndex = availableDinings.findIndex((dining) => dining.place === place);

    setSelectedPlace(place);
    carouselRef.current?.children[diningIndex]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  };

  const handleCarouselScroll = () => {
    const carousel = carouselRef.current;
    const firstCard = carousel?.children[0] as HTMLElement | undefined;

    if (!carousel || !firstCard) return;

    const cardWidth = firstCard.offsetWidth;
    const cardGap = 12;
    const activeIndex = Math.round(carousel.scrollLeft / (cardWidth + cardGap));
    const activeDining = availableDinings[activeIndex];

    if (activeDining && activeDining.place !== activePlace) {
      setSelectedPlace(activeDining.place);
    }
  };

  return (
    <>
      <div
        ref={carouselRef}
        className={styles['meal-carousel']}
        aria-label="오늘의 식단 목록"
        onScroll={handleCarouselScroll}
      >
        {availableDinings.length > 0 ? (
          availableDinings.map((dining) => <MealCard dining={dining} diningLabel={diningLabel} key={dining.id} />)
        ) : (
          <article className={styles['meal-card']}>
            <div className={styles['meal-card__meta']}>
              <span>{diningLabel}</span>
            </div>
            <h3 className={styles['meal-card__title']}>오늘의 식단</h3>
            <p className={styles['meal-card__menu']}>식단이 제공되지 않아 표시할 수 없습니다.</p>
          </article>
        )}
      </div>

      {availableDinings.length > 0 && (
        <div className={styles['meal-tabs']} aria-label="식당 코너 선택">
          {availableDinings.map((dining) => (
            <button
              type="button"
              className={`${styles['meal-tabs__button']} ${
                dining.place === activePlace ? styles['meal-tabs__button--active'] : ''
              }`}
              key={dining.place}
              onClick={() => handleTabClick(dining.place)}
            >
              {dining.place}
            </button>
          ))}
        </div>
      )}
    </>
  );
}

export default IndexMobileCafeteria;
