import { useState } from 'react';
import { MenuCategory } from 'api/store/entity';
import { cn } from '@bcsdlab/utils';
import useMoveScroll from 'utils/hooks/useMoveScroll';
import MENU_CATEGORY from 'static/menu';
import styles from './MenuTable.module.scss';

interface MenuTableProps {
  storeMenuCategories: MenuCategory[];
  onClickImage: (img: string[], index: number) => void;
}

function MenuTable({ storeMenuCategories, onClickImage }: MenuTableProps) {
  const [categoryType, setCateogoryType] = useState<string>(storeMenuCategories[0].name);
  const { elementsRef, onMoveToElement } = useMoveScroll();

  return (
    <>
      <ul className={styles.categories}>
        {storeMenuCategories.map((menuCategories, index) => (
          <li key={menuCategories.id}>
            <button
              className={cn({
                [styles.categories__tag]: true,
                [styles['categories__tag--active']]: categoryType === menuCategories.name,
              })}
              type="button"
              onClick={() => {
                setCateogoryType(menuCategories.name);
                onMoveToElement(index);
              }}
            >
              {menuCategories.name}
            </button>
          </li>
        ))}
      </ul>
      <div className={styles.table}>
        {storeMenuCategories.map((menuCategories, index) => (
          <div
            className={styles.menu}
            key={menuCategories.id}
            ref={(element) => { elementsRef.current[index] = element; }}
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
                        <img
                          src="https://static.koreatech.in/assets/img/empty-thumbnail.png"
                          alt="KOIN service logo"
                        />
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
                          <img
                            src="https://static.koreatech.in/assets/img/empty-thumbnail.png"
                            alt="KOIN service logo"
                          />
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
