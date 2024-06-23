import useOnClickOutside from 'utils/hooks/useOnClickOutside';
import { ReactComponent as CloseIcon } from 'assets/svg/close-icon.svg';
import { Dining, DiningType } from 'interfaces/Cafeteria';
import useModalPortal from 'utils/hooks/useModalPortal';
import { Portal } from 'components/common/Modal/PortalProvider';
import { useEffect } from 'react';
import useLogger from 'utils/hooks/useLogger';
import { useDatePicker } from 'pages/Cafeteria/hooks/useDatePicker';
import useDinings from 'pages/Cafeteria/hooks/useDinings';
import MobileMealImage from 'pages/Cafeteria/MobileCafeteriaPage/components/MobileMealImage';
import { DINING_TYPE_MAP } from 'static/cafeteria';
import { filterDinings } from 'utils/ts/cafeteria';
import styles from './MobileDiningBlocks.module.scss';

interface MobileDiningBlocksProps {
  diningType: DiningType;
}

export default function MobileDiningBlocks({ diningType }: MobileDiningBlocksProps) {
  const portalManager = useModalPortal();
  const { target } = useOnClickOutside<HTMLImageElement>(portalManager.close);

  const { currentDate } = useDatePicker();
  const { dinings } = useDinings(currentDate);
  const filteredDinings = filterDinings(dinings, diningType);

  const logger = useLogger();
  const handleImageClick = (dining: Dining) => {
    if (dining.image_url) {
      logger.actionEventClick({
        actionTitle: 'CAMPUS',
        title: 'menu_image',
        value: `${DINING_TYPE_MAP[dining.type]}_${dining.place}`,
      });

      portalManager.open((portalOption: Portal) => (
        <div className={styles.photo}>
          <div className={styles.photo__close}>
            <CloseIcon onClick={portalOption.close} />
          </div>
          <img src={dining.image_url as string} alt="mealDetail" ref={target} />
        </div>
      ));
    }
  };

  useEffect(() => () => portalManager.close(), [
    portalManager,
  ]);

  return (
    <>
      {filteredDinings.map((dining) => (
        <div className={styles.category} key={dining.id}>
          <ul className={styles['category__menu-list-row']}>
            <div className={styles.category__header}>
              <div className={styles.category__type}>
                <div className={styles['category__type--title']}>
                  {dining.place}
                  <div className={styles.category__calorie}>
                    {!!dining.kcal && `${dining.kcal}Kcal •`}
                  </div>
                  <div className={styles.category__price}>
                    {!!dining.price_cash && `${dining.price_cash}원/`}
                    {!!dining.price_card && ` ${dining.price_card}원`}
                  </div>
                </div>
                {dining.soldout_at && <span className={`${styles.header__chip} ${styles['category__block--sold-out']}`}>품절</span>}
                {!dining.soldout_at && dining.changed_at && <span className={`${styles.header__chip} ${styles['category__block--changed']}`}>변경됨</span>}
              </div>
            </div>
            <li className={styles['category__menu-list']}>
              <ul>
                {dining.menu.map((menuItem) => (
                  <li
                    className={styles.category__menu}
                    key={menuItem.id}
                  >
                    {menuItem.name}
                  </li>
                ))}
              </ul>
              <MobileMealImage dining={dining} handleImageClick={handleImageClick} />
            </li>
          </ul>
        </div>
      ))}
    </>
  );
}
