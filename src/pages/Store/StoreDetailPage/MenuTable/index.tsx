import { useState } from 'react';
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
  const [categoryType, setCateogoryType] = useState<string>(storeMenuCategories[0].name);

  const scrollToTarget = (name: string) => {
    const headerOffset = isMobile ? 120 : 60;
    const element = document.getElementById(name);
    if (element) {
      const elementPosistion = element.getBoundingClientRect().top;
      const offsetPosition = elementPosistion + window.scrollY - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <>
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
                setCateogoryType(menuCategories.name);
                scrollToTarget(menuCategories.name);
              }}
            >
              {menuCategories.name}
            </button>
          </li>
        ))}
      </ul>
      <div className={styles.table}>
        {storeMenuCategories.map((menuCategories) => (
          <div
            id={`${menuCategories.name}`}
            className={styles.menu}
            key={menuCategories.id}
            // ref={(element) => { elementsRef.current[index] = element; }}
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
                    ))) : (
                      <div className={styles['empty-image']}>
                        <div>
                          <img width="54px" height="50px" src="https://static.koreatech.in/assets/img/mainlogo2.png" alt="빈 이미지" />
                        </div>
                      </div>
                  )}
                  <div className={styles['menu-info__card']}>
                    <span title={menu.name}>{menu.name}</span>
                    <span>
                      {!!menu.single_price && (
                        menu.single_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      )}
                      원
                    </span>
                  </div>
                </div>
              ) : (
                menu.option_prices.map((item) => (
                  <div className={styles['menu-info']} key={menu.id + item.option}>
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
                      ))) : (
                        <div className={styles['empty-image']}>
                          <div>
                            <img width="54px" height="50px" src="https://static.koreatech.in/assets/img/mainlogo2.png" alt="빈 이미지" />
                          </div>
                        </div>
                    )}
                    <div className={styles['menu-info__card']}>
                      <span>{`${menu.name} - ${item.option}`}</span>
                      <span>
                        {item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        원
                      </span>
                    </div>
                  </div>
                ))
              )
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

export default MenuTable;
