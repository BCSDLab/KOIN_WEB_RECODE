import useOnClickOutside from 'utils/hooks/useOnClickOutside';
import { ReactComponent as NoMeal } from 'assets/svg/no-meals-mobile.svg';
import { ReactComponent as CloseIcon } from 'assets/svg/close-icon.svg';
import { CafeteriaMenu } from 'interfaces/Cafeteria';
import useModalPortal from 'utils/hooks/useModalPortal';
import { ReactComponent as NoPhoto } from 'assets/svg/no-photography-mobile.svg';
import { Portal } from 'components/common/Modal/PortalProvider';
import { useEffect } from 'react';
import { cn } from '@bcsdlab/utils';
import styles from './MobileMenuBlock.module.scss';

interface Props {
  menu: CafeteriaMenu[];
  mealType: string;
  category: {
    id: number;
    place: string;
    isShowMain: boolean;
  }
}

function checkMenuStatus(menuItem: CafeteriaMenu | undefined) {
  if (!menuItem) return { isSoldOut: false, isChanged: false };

  const isSoldOut = menuItem.soldout_at !== null;
  const isChanged = !isSoldOut && menuItem.changed_at !== null;

  return { isSoldOut, isChanged };
}

export default function MobileMenuBlock({ menu, mealType, category }:Props) {
  const portalManager = useModalPortal();
  const { target } = useOnClickOutside<HTMLImageElement>(portalManager.close);
  const currentMenu = menu.find((item) => item.place === category.place && item.type === mealType);

  const { isSoldOut, isChanged } = checkMenuStatus(currentMenu);

  const handlePhoto = (url: string) => {
    portalManager.open((portalOption: Portal) => (
      <div className={styles.photo}>
        <div className={styles.photo__close}>
          <CloseIcon onClick={portalOption.close} />
        </div>
        <img src={url} alt="mealDetail" ref={target} />
      </div>
    ));
  };

  useEffect(() => () => portalManager.close(), [
    portalManager,
  ]);

  if (currentMenu === undefined || currentMenu.menu.includes('미운영')) return null;

  return (
    <div className={styles.category} key={category.id}>
      <ul className={styles['category__menu-list-row']}>
        <div className={styles.category__header}>
          <div className={styles.category__type}>
            <div className={styles['category__type--title']}>
              {category.place}
              <div className={styles.category__calorie}>
                {!!currentMenu.kcal && `${currentMenu.kcal}Kcal •`}
              </div>
              <div className={styles.category__price}>
                {!!currentMenu.price_cash && `${currentMenu.price_cash}원/`}
                {!!currentMenu.price_card && ` ${currentMenu.price_card}원`}
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
          {![4, 5].includes(category.id)
            && (
            <button
              className={styles['category__menu-photo']}
              type="button"
              onClick={() => currentMenu.image_url && handlePhoto(currentMenu.image_url)}
            >
              {isSoldOut && (
              <div className={styles['category__menu-photo--sold-out']}>
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
