/* eslint-disable no-param-reassign */
import { CafeteriaMenu, MealType } from 'interfaces/Cafeteria';
import { ReactComponent as NoPhoto } from 'assets/svg/no-photography-pc.svg';
import { ReactComponent as NoMeals } from 'assets/svg/no-meals-pc.svg';
import { useEffect, useRef, useState } from 'react';
import { MEAL_TYPE_MAP, placeOrder } from 'static/cafeteria';
import useLogger from 'utils/hooks/useLogger';
import { useDatePicker } from 'pages/Cafeteria/hooks/useDatePicker';
import useCafeteriaList from 'pages/Cafeteria/hooks/useCafeteriaList';
import MealDetail from 'pages/Cafeteria/PCCafeteriaPage/components/MealDetail';
import { convertDateToSimpleString } from 'utils/ts/cafeteria';
import styles from './PCMenuBlocks.module.scss';

interface Props {
  mealType: MealType;
  recentDate: boolean;
}

export default function PCMenuBlocks({ mealType, recentDate }: Props) {
  const { currentDate } = useDatePicker();
  const { cafeteriaList } = useCafeteriaList(convertDateToSimpleString(currentDate));

  const filteredCafeteriaList = cafeteriaList.filter((item) => item.type === mealType);
  const sortedCafeteriaList = filteredCafeteriaList.sort((a, b) => {
    const indexA = placeOrder.indexOf(a.place);
    const indexB = placeOrder.indexOf(b.place);
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
  }, [sortedCafeteriaList]);

  const logger = useLogger();
  const [mealDetail, setMealDetail] = useState(<div />);
  const handleImageClick = (item: CafeteriaMenu) => {
    logger.actionEventClick({
      actionTitle: 'CAMPUS',
      title: 'menu_image',
      value: `${MEAL_TYPE_MAP[item.type]}_${item.place}`,
    });
    setMealDetail(<MealDetail cafeteriaMenu={item} setMealDetail={setMealDetail} />);
  };

  return (
    <div className={styles.container}>
      {mealDetail}

      <div className={styles.box} ref={boxRef}>
        {sortedCafeteriaList.map((item) => (
          <div className={styles.block} key={item.id}>
            <div className={styles.header}>
              <div className={styles.header__place}>{item.place}</div>
              <div className={styles.header__detail}>
                {!!item.kcal && `${item.kcal}kcal`}
                {!!item.kcal && !!item.price_card && !!item.price_cash && '•'}
                {!!item.price_card && !!item.price_cash && `${item.price_card}원/${item.price_cash}원`}
              </div>
              {item.soldout_at && <span className={`${styles.header__chip} ${styles['header__chip--sold-out']}`}>품절</span>}
              {!item.soldout_at && item.changed_at && <span className={`${styles.header__chip} ${styles['header__chip--changed']}`}>변경됨</span>}
            </div>

            <div className={styles.content}>
              {recentDate && ['A코너', 'B코너', 'C코너'].includes(item.place) && item.type !== 'BREAKFAST' && (
                <div className={styles['content__image-wrapper']}>
                  {item.image_url ? (
                    <button type="button" onClick={() => handleImageClick(item)}>
                      <img className={styles.content__image} src={item.image_url} alt="식단 상세" />
                    </button>
                  ) : (
                    !item.soldout_at && (<span className={styles.content__image}><NoPhoto /></span>)
                  )}
                  {item.soldout_at && (
                    <span className={styles.content__overlay}>
                      <span className={styles['content__no-meals']}>
                        <NoMeals />
                        품절된 메뉴입니다.
                      </span>
                    </span>
                  )}
                </div>
              )}
              <div className={styles.content__menu}>
                {item.menu.map((dish) => (
                  <div key={dish}>{dish}</div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
