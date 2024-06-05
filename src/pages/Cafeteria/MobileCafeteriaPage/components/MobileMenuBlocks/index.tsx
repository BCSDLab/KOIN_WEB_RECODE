import useOnClickOutside from 'utils/hooks/useOnClickOutside';
import { ReactComponent as CloseIcon } from 'assets/svg/close-icon.svg';
import {
  CafeteriaMenu, MealType, MEAL_TYPE_MAP, placeOrder,
} from 'interfaces/Cafeteria';
import useModalPortal from 'utils/hooks/useModalPortal';
import { Portal } from 'components/common/Modal/PortalProvider';
import { useEffect } from 'react';
import useLogger from 'utils/hooks/useLogger';
import { useDatePicker } from 'pages/Cafeteria/hooks/useDatePicker';
import useCafeteriaList from 'pages/Cafeteria/hooks/useCafeteriaList';
import { convertDateToSimpleString } from 'utils/ts/cafeteria';
import MobileMealImage from 'pages/Cafeteria/MobileCafeteriaPage/components/MobileMealImage';
import styles from './MobileMenuBlocks.module.scss';

interface Props {
  mealType: MealType;
}

export default function MobileMenuBlocks({ mealType }: Props) {
  const portalManager = useModalPortal();
  const { target } = useOnClickOutside<HTMLImageElement>(portalManager.close);

  const { currentDate } = useDatePicker();
  const { cafeteriaList } = useCafeteriaList(convertDateToSimpleString(currentDate));

  const filteredCafeteriaList = cafeteriaList
    .filter((item) => item.type === mealType)
    .filter((item) => !item.menu.includes('미운영'));
  const sortedCafeteriaList = filteredCafeteriaList.sort((a, b) => {
    const indexA = placeOrder.indexOf(a.place);
    const indexB = placeOrder.indexOf(b.place);
    return indexA - indexB;
  });

  const logger = useLogger();
  const handleImageClick = (meal: CafeteriaMenu) => {
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
      {sortedCafeteriaList.map((item) => (
        <div className={styles.category} key={item.id}>
          <ul className={styles['category__menu-list-row']}>
            <div className={styles.category__header}>
              <div className={styles.category__type}>
                <div className={styles['category__type--title']}>
                  {item.place}
                  <div className={styles.category__calorie}>
                    {!!item.kcal && `${item.kcal}Kcal •`}
                  </div>
                  <div className={styles.category__price}>
                    {!!item.price_cash && `${item.price_cash}원/`}
                    {!!item.price_card && ` ${item.price_card}원`}
                  </div>
                </div>
                {item.soldout_at && <span className={`${styles.header__chip} ${styles['category__block--sold-out']}`}>품절</span>}
                {!item.soldout_at && item.changed_at && <span className={`${styles.header__chip} ${styles['category__block--changed']}`}>변경됨</span>}
              </div>
            </div>
            <li className={styles['category__menu-list']}>
              <ul>
                {item.menu.map((menuName) => (
                  <li
                    className={styles.category__menu}
                    key={menuName}
                  >
                    {menuName}
                  </li>
                ))}
              </ul>
              <MobileMealImage meal={item} handleImageClick={handleImageClick} />
            </li>
          </ul>
        </div>
      ))}
    </>
  );
}
