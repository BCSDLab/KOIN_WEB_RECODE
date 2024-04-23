import { ReactComponent as NoPhoto } from 'assets/svg/no_photography.svg';
import { ReactComponent as NoMeal } from 'assets/svg/no_meals.svg';
import { ReactComponent as CloseIcon } from 'assets/svg/close-icon.svg';
import { CafeteriaMenu } from 'interfaces/Cafeteria';
import useModalPortal from 'utils/hooks/useModalPortal';
import { Portal } from 'components/common/Modal/PortalProvider';
import { useEffect } from 'react';
import { cn } from '@bcsdlab/utils';
import styles from './MobileMenuBlock.module.scss';

interface Props {
  menu: CafeteriaMenu[];
  mealTime: string;
  category: {
    id: number;
    place: string;
    isShowMain: boolean;
  }
}

export default function MobileMenuBlock({ menu, mealTime, category }:Props) {
  const portalManager = useModalPortal();
  const currentMenu = menu.find((item) => item.place === category.place && item.type === mealTime);

  const isSoldOut = currentMenu?.soldout_at !== null;
  const isChanged = !isSoldOut && currentMenu.changed_at !== null;

  const handlePhoto = (url: string) => {
    portalManager.open((portalOption: Portal) => (
      <div className={styles.photo}>
        <div className={styles.photo__close}>
          <CloseIcon onClick={portalOption.close} />
        </div>
        <img src={url} alt="mealDetail" />
      </div>
    ));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => () => portalManager.close(), []); // portalManeger dependency 불필요

  if (currentMenu === undefined || currentMenu.menu.includes('미운영')) return null;

  return (
    <div className={styles.category} key={category.id}>
      <ul className={styles['category__menu-list-row']}>
        <div className={styles.category__header}>
          <div className={styles.category__type}>
            <div className={styles['category__type--title']}>
              {category.place}
              <div className={styles.category__calorie}>
                {currentMenu?.kcal ?? 0}
                Kcal •
              </div>
              <div className={styles.category__price}>
                {`${currentMenu?.price_cash ?? 0}원/ ${currentMenu?.price_card ?? 0}원`}
              </div>
            </div>
            <div className={cn({
              [styles.category__block]: true,
              [styles['category__block--sold-out']]: isSoldOut,
              [styles['category__block--changed']]: isChanged,
            })}
            >
              {isSoldOut ? '품절' : (isChanged && '변경됨') }
            </div>
          </div>
        </div>
        <li className={styles['category__menu-list']}>
          {menu ? (
            <ul>
              {currentMenu.menu.map((menuName) => (
                <li
                  className={styles.category__menu}
                  key={menuName}
                >
                  {menuName}
                </li>
              ))}
            </ul>
          ) : undefined}
          {![4, 5].includes(category.id)
            && (
            <button
              className={styles['category__menu-photo']}
              type="button"
              onClick={() => currentMenu.image_url && handlePhoto(currentMenu.image_url)}
            >
              {isSoldOut && (
              <div className={styles['category__menu-photo--soldOut']}>
                <NoMeal />
                품절된 메뉴입니다.
              </div>
              )}
              {currentMenu?.image_url
                ? <img src={currentMenu?.image_url || ''} alt="" />
                : (
                  <div className={styles['category__menu-photo--none']}>
                    <NoPhoto />
                    사진 없음
                  </div>
                )}
            </button>
            )}
        </li>
      </ul>
    </div>
  );
}
