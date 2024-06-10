/* eslint-disable no-param-reassign */
import { Dining, MealType } from 'interfaces/Cafeteria';
import { useEffect, useRef, useState } from 'react';
import useLogger from 'utils/hooks/useLogger';
import { useDatePicker } from 'pages/Cafeteria/hooks/useDatePicker';
import useDinings from 'pages/Cafeteria/hooks/useDinings';
import MealDetail from 'pages/Cafeteria/PCCafeteriaPage/components/MealDetail';
import PCMealImage from 'pages/Cafeteria/PCCafeteriaPage/components/PCMealImage';
import { MEAL_TYPE_MAP, PLACE_ORDER } from 'static/cafeteria';
import styles from './PCMenuBlocks.module.scss';

interface Props {
  mealType: MealType;
  isRecent: boolean;
}

export default function PCMenuBlocks({ mealType, isRecent }: Props) {
  const { currentDate } = useDatePicker();
  const { dinings } = useDinings(currentDate);

  const filteredDinings = dinings
    .filter((meal) => meal.type === mealType && !meal.menu.some((dish) => dish.name.includes('미운영')));
  const sortedDinings = filteredDinings.sort((a, b) => {
    const indexA = PLACE_ORDER.indexOf(a.place);
    const indexB = PLACE_ORDER.indexOf(b.place);
    return indexA - indexB;
  });

  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (boxRef.current) {
      const blocks = boxRef.current.children;
      const columnHeights = [0, 0, 0];
      let columnIndex = 0;

      Array.from(blocks).forEach((block) => {
        const x = columnIndex * (276 + 12); // 열 인덱스에 따라 x 위치 계산
        const y = columnHeights[columnIndex]; // 현재 열의 높이에서 시작
        (block as HTMLElement).style.transform = `translate(${x}px, ${y}px)`;
        columnHeights[columnIndex] += (block as HTMLElement).clientHeight + 12; // 열 높이 업데이트
        columnIndex = (columnIndex + 1) % columnHeights.length; // 다음 열 인덱스로 업데이트
      });

      boxRef.current.style.height = `${Math.max(...columnHeights)}px`; // 컨테이너의 높이 업데이트
    }
  }, [sortedDinings]);

  const logger = useLogger();
  const [mealDetail, setMealDetail] = useState(<div />);
  const handleImageClick = (meal: Dining) => {
    if (!meal.image_url) return;

    logger.actionEventClick({
      actionTitle: 'CAMPUS',
      title: 'menu_image',
      value: `${MEAL_TYPE_MAP[meal.type]}_${meal.place}`,
    });
    setMealDetail(<MealDetail dining={meal} setMealDetail={setMealDetail} />);
  };

  return (
    <>
      {mealDetail}

      <div ref={boxRef}>
        {sortedDinings.map((meal) => (
          <div className={styles.block} key={meal.id}>
            <div className={styles.header}>
              <div className={styles.header__place}>{meal.place}</div>
              <div className={styles.header__detail}>
                {!!meal.kcal && `${meal.kcal}kcal`}
                {!!meal.kcal && !!meal.price_card && !!meal.price_cash && '•'}
                {!!meal.price_card && !!meal.price_cash && `${meal.price_card}원/${meal.price_cash}원`}
              </div>
              {meal.soldout_at && <span className={`${styles.header__chip} ${styles['header__chip--sold-out']}`}>품절</span>}
              {!meal.soldout_at && meal.changed_at && <span className={`${styles.header__chip} ${styles['header__chip--changed']}`}>변경됨</span>}
            </div>

            <div className={styles.content}>
              <PCMealImage meal={meal} isRecent={isRecent} handleImageClick={handleImageClick} />
              <div className={styles.content__menu}>
                {meal.menu.map((dish) => (
                  <div key={dish.id}>{dish.name}</div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
