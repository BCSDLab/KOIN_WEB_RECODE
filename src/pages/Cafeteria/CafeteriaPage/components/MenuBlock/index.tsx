import styles from 'pages/Cafeteria/CafeteriaPage/CafeteriaPage.module.scss';
import { ReactComponent as NoPhoto } from 'assets/svg/no_photography.svg';
import { ReactComponent as NoMeal } from 'assets/svg/no_meals.svg';
import { ReactComponent as CloseIcon } from 'assets/svg/close-icon.svg';
import { CafeteriaMenu } from 'interfaces/Cafeteria';
import useModalPortal from 'utils/hooks/useModalPortal';
import { Portal } from 'components/common/Modal/PortalProvider';
import { useEffect } from 'react';
import { cn } from '@bcsdlab/utils';
import useOnClickOutside from 'utils/hooks/useOnClickOutside';

interface Props {
  menu: CafeteriaMenu[];
  mealTime: string;
  category: {
    id: number;
    placeName: string;
    isShowMain: boolean;
  }
}

export default function MenuBlock({ menu, mealTime, category }: Props) {
  const portalManager = useModalPortal();
  const { target } = useOnClickOutside<HTMLImageElement>(portalManager.close);
  const currentMenu = menu.find((item) => item.place === category.placeName
    && item.type === mealTime);

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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => () => portalManager.close(), []); // portalManeger dependency 불필요

  return (
    <div className={styles.category} key={category.id}>
      {(currentMenu && !currentMenu.menu.includes('미운영'))
        && (
          <ul className={styles['category__menu-list-row']}>
            <div className={styles.category__header}>
              <div className={styles.category__type}>
                <div className={styles['category__type--title']}>
                  {category.placeName}
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
                  [styles['category__block--soldOut']]: !!currentMenu.soldout_at,
                  [styles['category__block--changed']]: !currentMenu.soldout_at && !!currentMenu.changed_at,
                })}
                >
                  {!currentMenu.soldout_at && !!currentMenu.changed_at
                    ? '변경됨' : '품절'}
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
                  {currentMenu.soldout_at && (
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
        ) }
    </div>
  );
}
