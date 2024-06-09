import useOnClickOutside from 'utils/hooks/useOnClickOutside';
import { ReactComponent as CloseIcon } from 'assets/svg/close-icon.svg';
import { Dining, MealType } from 'interfaces/Cafeteria';
import useModalPortal from 'utils/hooks/useModalPortal';
import { Portal } from 'components/common/Modal/PortalProvider';
import { useEffect } from 'react';
import useLogger from 'utils/hooks/useLogger';
import { useDatePicker } from 'pages/Cafeteria/hooks/useDatePicker';
import useDinings from 'pages/Cafeteria/hooks/useDinings';
import MobileMealImage from 'pages/Cafeteria/MobileCafeteriaPage/components/MobileMealImage';
import { MEAL_TYPE_MAP, PLACE_ORDER } from 'static/cafeteria';
import styles from './MobileMenuBlocks.module.scss';

interface Props {
  mealType: MealType;
}

export default function MobileMenuBlocks({ mealType }: Props) {
  const portalManager = useModalPortal();
  const { target } = useOnClickOutside<HTMLImageElement>(portalManager.close);

  const { currentDate } = useDatePicker();
  const { dinings } = useDinings(currentDate);

  const filteredDinings = dinings
    .filter((meal) => meal.type === mealType && !meal.menu.some((dish) => dish.name.includes('미운영')));
  const sortedDinings = filteredDinings.sort((a, b) => {
    const indexA = PLACE_ORDER.indexOf(a.place);
    const indexB = PLACE_ORDER.indexOf(b.place);
    return indexA - indexB;
  });

  const logger = useLogger();
  const handleImageClick = (meal: Dining) => {
    if (!meal.image_url) return;

    logger.actionEventClick({
      actionTitle: 'CAMPUS',
      title: 'menu_image',
      value: `${MEAL_TYPE_MAP[meal.type]}_${meal.place}`,
    });

    if (meal.image_url) {
      portalManager.open((portalOption: Portal) => (
        <div className={styles.photo}>
          <div className={styles.photo__close}>
            <CloseIcon onClick={portalOption.close} />
          </div>
          <img src={meal.image_url as string} alt="mealDetail" ref={target} />
        </div>
      ));
    }
  };

  useEffect(() => () => portalManager.close(), [
    portalManager,
  ]);

  return (
    <>
      {sortedDinings.map((meal) => (
        <div className={styles.category} key={meal.id}>
          <ul className={styles['category__menu-list-row']}>
            <div className={styles.category__header}>
              <div className={styles.category__type}>
                <div className={styles['category__type--title']}>
                  {meal.place}
                  <div className={styles.category__calorie}>
                    {!!meal.kcal && `${meal.kcal}Kcal •`}
                  </div>
                  <div className={styles.category__price}>
                    {!!meal.price_cash && `${meal.price_cash}원/`}
                    {!!meal.price_card && ` ${meal.price_card}원`}
                  </div>
                </div>
                {meal.soldout_at && <span className={`${styles.header__chip} ${styles['category__block--sold-out']}`}>품절</span>}
                {!meal.soldout_at && meal.changed_at && <span className={`${styles.header__chip} ${styles['category__block--changed']}`}>변경됨</span>}
              </div>
            </div>
            <li className={styles['category__menu-list']}>
              <ul>
                {meal.menu.map((dish) => (
                  <li
                    className={styles.category__menu}
                    key={dish.id}
                  >
                    {dish.name}
                  </li>
                ))}
              </ul>
              <MobileMealImage meal={meal} handleImageClick={handleImageClick} />
            </li>
          </ul>
        </div>
      ))}
    </>
  );
}
