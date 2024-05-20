/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { MenuCategory } from 'api/store/entity';
import { cn } from '@bcsdlab/utils';
import MENU_CATEGORY from 'static/menu';
import useMediaQuery from 'utils/hooks/useMediaQuery';
import styles from './MenuTable.module.scss';

interface MenuTableProps {
  storeMenuCategories: MenuCategory[];
  onClickImage: (img: string[], index: number) => void;
}

function MenuTable({ storeMenuCategories, onClickImage }: MenuTableProps) {
  const isMobile = useMediaQuery();
  const [categoryType, setCategoryType] = useState<string>(storeMenuCategories[0].name);
  const headerOffset = isMobile ? 120 : 68; // categories 높이

  const handleScroll = () => {
    storeMenuCategories.forEach((menu) => {
      const element = document.getElementById(menu.name);
      if (element) {
        const categoryTop = element.getBoundingClientRect().top;
        const categoryBottom = element.getBoundingClientRect().bottom;
        if (categoryTop <= 0 && categoryBottom >= 0) {
          setCategoryType(menu.name);
        }
      }
    });
  };

  useEffect(() => {
    storeMenuCategories.forEach((menu) => {
      const element = document.getElementById(menu.name);
      element!.addEventListener('wheel', handleScroll);
    });

    return () => {
      storeMenuCategories.forEach((menu) => {
        const element = document.getElementById(menu.name);
        if (element) {
          element.removeEventListener('wheel', handleScroll);
        }
      });
    };
  }, [storeMenuCategories]);

  const scrollToTarget = (name: string) => {
    const element = document.getElementById(name);
    if (element) {
      const elementPosistion = element.getBoundingClientRect().top;
      const categoryPosition = elementPosistion + window.scrollY - headerOffset;

      window.scrollTo({
        top: categoryPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className={styles.table}>
      <ul className={styles.categories}>
        {MENU_CATEGORY.map((menuCategories) => (
          <li key={menuCategories.id}>
            <button
              className={cn({
                [styles.categories__tag]: true,
                [styles['categories__tag--active']]: categoryType === menuCategories.name,
                [styles['categories__tag--inactive']]: !storeMenuCategories.some((menu) => menuCategories.name === menu.name),
              })}
              type="button"
              onClick={() => {
                setCategoryType(menuCategories.name);
                scrollToTarget(menuCategories.name);
              }}
            >
              {menuCategories.name}
            </button>
          </li>
        ))}
      </ul>
      {storeMenuCategories.map((menuCategories) => (
        <div
          id={`${menuCategories.name}`}
          className={styles.menu}
          key={menuCategories.name}
        >
          {MENU_CATEGORY.map((category) => (
            category.name === menuCategories.name && (
              <div className={styles.menu__title} key={category.id}>
                <img src={category.img} alt={category.name} />
                {menuCategories.name}
              </div>
            )
          ))}
          {menuCategories.menus.map((menu) => (
            menu.option_prices === null ? (
              <div className={styles['menu-info']} key={menu.id}>
                <div className={styles['menu-info__card']}>
                  <span title={menu.name}>{menu.name}</span>
                  <span>
                    {!!menu.single_price && (
                      menu.single_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    )}
                    원
                  </span>
                </div>
                {menu.image_urls.length > 0 ? (
                  menu.image_urls.map((img, idx) => (
                    <div key={`${img}`} className={styles.image}>
                      <button
                        className={styles.image__button}
                        type="button"
                        onClick={() => onClickImage(menu.image_urls, idx)}
                      >
                        <img src={`${img}`} alt={`${menu.name}`} />
                      </button>
                    </div>
                  )))
                  : null}
              </div>
            ) : (
              menu.option_prices.map((item) => (
                <div className={styles['menu-info']} key={menu.id + item.price + item.option}>
                  <div className={styles['menu-info__card']}>
                    <span>{`${menu.name} - ${item.option}`}</span>
                    <span>
                      {item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      원
                    </span>
                  </div>
                  {menu.image_urls.length > 0 ? (
                    menu.image_urls.map((img, idx) => (
                      <div key={`${img}`} className={styles.image}>
                        <button
                          className={styles.image__button}
                          type="button"
                          onClick={() => onClickImage(menu.image_urls, idx)}
                        >
                          <img src={`${img}`} alt={`${menu.name}`} />
                        </button>
                      </div>
                    )))
                    : null}
                </div>
              ))
            )
          ))}
        </div>
      ))}
    </div>
  );
}

export default MenuTable;
