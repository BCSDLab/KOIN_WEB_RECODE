import { Link } from 'react-router-dom';
import { CAFETERIA_CATEGORY } from 'static/cafeteria';
import { useState } from 'react';
import { ReactComponent as RightArrow } from 'assets/svg/right-arrow.svg';
import cn from 'utils/ts/classnames';
import useCafeteriaList from 'pages/Cafeteria/CafeteriaPage/hooks/useCafeteriaList';
import useLogger from 'utils/hooks/useLogger';
import { convertDateToSimpleString } from 'utils/ts/cafeteria';
import styles from './IndexCafeteria.module.scss';

function IndexCafeteria() {
  const getType = () => {
    const hour = new Date().getHours();
    if (hour < 9) {
      return ['아침', 'BREAKFAST'];
    } if (hour < 14) {
      return ['점심', 'LUNCH'];
    }
    return ['저녁', 'DINNER'];
  };
  const { data: dinings } = useCafeteriaList(convertDateToSimpleString(new Date()));

  const [selectedCafeteria, setSelectedCafeteria] = useState<'A코너' | 'B코너' | 'C코너' | '능수관' | '2캠퍼스'>('A코너');

  const 선택된_식단 = dinings?.find(
    (dining) => dining.place === selectedCafeteria && dining.type === getType()[1],
  );
  const logger = useLogger();
  return (
    <section className={styles.template}>
      <h2 className={styles.title}>
        <span>식단</span>
        <Link
          to="/cafeteria"
          className={styles.moreLink}
          onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
            e.preventDefault();
            logger.click({
              title: 'main_cafeteria_more',
              value: '식단 더보기',
            });
          }}
          aria-hidden
        >
          더보기
          <RightArrow
            aria-hidden
          />
        </Link>
      </h2>
      <div className={styles.cafeteriaCard}>
        <div className={styles.cafeteriaContainer}>
          {CAFETERIA_CATEGORY.map((category) => (
            category.isShowMain && (
            // eslint-disable-next-line
            <div
              key={category.id}
              className={cn({
                [styles.cafeteria]: true,
                [styles['cafeteria--selected']]: selectedCafeteria === category.placeName,
              })}
              onClick={() => setSelectedCafeteria(category.placeName)}
            >
              {category.placeName}
            </div>
            )
          ))}
        </div>
        <div className={styles.type}>
          {getType()[0]}
        </div>
        <div className={styles.menuContainer}>
          {선택된_식단 ? 선택된_식단.menu.slice(0, 10).map((menu) => (
            <div className={styles.menu} key={menu}>
              {menu}
            </div>
          )) : (
            <div className={styles.noMenuContent}>
              <img className={styles.noMenuImage} src="https://static.koreatech.in/assets/img/ic-none.png" alt="" />
              <div className={styles.noMenu}>
                식단이 제공되지 않아
                <br />
                표시할 수 없습니다.
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default IndexCafeteria;
