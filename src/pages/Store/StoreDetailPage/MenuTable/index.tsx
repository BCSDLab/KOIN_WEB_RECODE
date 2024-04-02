import { MenuCategory } from 'api/store/entity';
import styles from './MenuTable.module.scss';

function MenuTable({ storeMenuCategories }: { storeMenuCategories: MenuCategory[] }) {
  return (
    <div className={styles.table}>
      {storeMenuCategories.map((menuCategories) => (
        <div className={styles.menu} key={menuCategories.id}>
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
                  <span>{menu.name}</span>
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
  );
}

export default MenuTable;
