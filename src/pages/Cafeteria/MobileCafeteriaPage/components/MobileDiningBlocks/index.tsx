import HeartIcon from 'assets/svg/heart.svg';
import FilledHeartIcon from 'assets/svg/heart-filled.svg';
import { Dining, DiningType } from 'interfaces/Cafeteria';
import useModalPortal from 'utils/hooks/layout/useModalPortal';
import { Portal } from 'components/common/Modal/PortalProvider';
import useLogger from 'utils/hooks/analytics/useLogger';
import { useDatePicker } from 'pages/Cafeteria/hooks/useDatePicker';
import useDinings from 'pages/Cafeteria/hooks/useDinings';
import MobileMealImage from 'pages/Cafeteria/MobileCafeteriaPage/components/MobileMealImage';
import { DINING_TYPE_MAP } from 'static/cafeteria';
import { filterDinings } from 'utils/ts/cafeteria';
import DetailImage from 'pages/Cafeteria/MobileCafeteriaPage/components/DetailImage';
import LoginPromptModal from 'components/Cafeteria/LoginPromptModal';
import { useUser } from 'utils/hooks/state/useUser';
import styles from './MobileDiningBlocks.module.scss';

interface MobileDiningBlocksProps {
  diningType: DiningType;
}

export default function MobileDiningBlocks({ diningType }: MobileDiningBlocksProps) {
  const logger = useLogger();
  const portalManager = useModalPortal();
  const { data: isAuth } = useUser();
  const { currentDate } = useDatePicker();
  const { dinings, likeDining } = useDinings(currentDate());
  const filteredDinings = filterDinings(dinings, diningType);

  const handleImageClick = (dining: Dining) => {
    if (dining.image_url) {
      logger.actionEventClick({
        actionTitle: 'CAMPUS',
        title: 'menu_image',
        value: `${DINING_TYPE_MAP[dining.type]}_${dining.place}`,
      });

      portalManager.open((portalOption: Portal) => (
        <DetailImage url={dining?.image_url} close={() => portalOption.close()} />
      ));
    }
  };

  const handleLikeClick = ({ id, is_liked }: Dining) => {
    if (!isAuth) {
      portalManager.open((portalOption: Portal) => (
        <LoginPromptModal
          onConfirm={() => likeDining(id, is_liked)}
          closeModal={portalOption.close}
        />
      ));
    } else {
      likeDining(id, is_liked);
    }
  };

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
            <button
              type="button"
              className={styles.like}
              onClick={() => handleLikeClick(dining)}
            >
              {dining.is_liked ? <FilledHeartIcon /> : <HeartIcon />}
              <span className={styles.like__count}>{dining.likes === 0 ? '좋아요' : dining.likes.toLocaleString()}</span>
            </button>
          </ul>
        </div>
      ))}
    </>
  );
}
