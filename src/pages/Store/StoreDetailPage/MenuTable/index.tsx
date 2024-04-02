import { useState } from 'react';
import { MenuCategory } from 'api/store/entity';
import cn from 'utils/ts/classnames';
import useMoveScroll from 'utils/hooks/useMoveScroll';
import styles from './MenuTable.module.scss';

function MenuTable({ storeMenuCategories }: { storeMenuCategories: MenuCategory[] }) {
  const [categoryType, setCateogoryType] = useState<string>(storeMenuCategories[0].name);
  const { elements, onMoveToElement } = useMoveScroll();

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
            ref={(element) => { elements.current[index] = element; }}
          >
            <div className={styles.menu__title}>{menuCategories.name}</div>
            {menuCategories.menus.map((menu) => (
              menu.option_prices === null ? (
                <div className={styles['menu-info']} key={menu.id}>
                  <div className={styles['menu-info__img']}>
                    <img
                      src="http://static.koreatech.in/assets/img/rectangle_icon.png"
                      alt="KOIN service logo"
                    />
                  </div>
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
                    <div className={styles['menu-info__img']}>
                      <img
                        src="http://static.koreatech.in/assets/img/rectangle_icon.png"
                        alt="KOIN service logo"
                      />
                    </div>
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
