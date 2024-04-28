import { CafeteriaMenu, MealType } from 'interfaces/Cafeteria';
import { ReactComponent as NoPhoto } from 'assets/svg/no-photography-pc.svg';
import styles from './PCMenuBlocks.module.scss';

const order = ['A코너', 'B코너', 'C코너', '능수관', '2캠퍼스'];

interface Props {
  mealType: MealType;
  cafeteriaList: CafeteriaMenu[];
}

export default function PCMenuBlocks({ mealType, cafeteriaList }: Props) {
  const filteredCafeteriaList = cafeteriaList.filter((item) => item.type === mealType);
  const sortedCafeteriaList = filteredCafeteriaList.sort((a, b) => {
    const indexA = order.indexOf(a.place);
    const indexB = order.indexOf(b.place);

    return indexA - indexB;
  });

  return (
    <div className={styles.container}>
      {sortedCafeteriaList.map((item) => (
        <div className={styles.block}>
          <div className={styles.header}>
            <div className={styles.header__place}>{item.place}</div>
            <div className={styles.header__detail}>
              {!!item.kcal && `${item.kcal}kcal`}
              {!!item.kcal && !!item.price_card && !!item.price_cash && '•'}
              {!!item.price_card && !!item.price_cash && `${item.price_card}원/${item.price_cash}원`}
            </div>
            {item.soldout_at && <span className={`${styles.header__chip} ${styles['header__chip--sold-out']}`}>품절</span>}
            {!item.soldout_at && item.changed_at && <span className={`${styles.header__chip} ${styles['header__chip--changed']}`}>변경됨</span>}
          </div>
          <div className={styles.content}>
            {['A코너', 'B코너', 'C코너'].includes(item.place)
            && (item.image_url ? (
              <img
                className={styles.content__image}
                src={item.image_url}
                alt="menu"
              />
            ) : <span className={styles.content__image}><NoPhoto /></span>)}
            <div className={styles.content__menu}>
              {item.menu.map((dish) => (
                <div>{dish}</div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
