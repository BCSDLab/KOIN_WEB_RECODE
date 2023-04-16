import React from 'react';
import cn from 'utils/ts/classnames';
import useCafeteriaMenu from 'pages/CafeteriaPage/hooks/useCafeteriaMenu';
import PCMenuList from 'components/Cafeteria/MenuList/PCMenuList';
import { CAFETERIA_HEADER } from 'static/cafeteria';
import useDate, { leftPad } from 'utils/hooks/useDate';
import styles from './CafeteriaPage.module.scss';

function CafeteriaPage() {
  const [date, setDate] = React.useState<Date>(new Date());
  const { apiDate } = useDate(date);
  console.log(apiDate);
  const cafeteriaMenu = useCafeteriaMenu(apiDate);

  const onClickPrev = () => {
    setDate(new Date(date.setDate(date.getDate() - 1)));
  };
  const onClickNext = () => {
    setDate(new Date(date.setDate(date.getDate() + 1)));
  };

  console.log(cafeteriaMenu);

  return (
    <div className={styles.template}>
      <div className={styles.content}>
        <div className={styles.title}>오늘의 식단</div>
        <div className={styles.date}>
          <button
            className={styles.date__prev}
            type="button"
            onClick={() => onClickPrev()}
            aria-label="이전날"
          />
          <span className={styles.date__title}>
            {`${date.getFullYear()}년 
              ${leftPad(date.getMonth() + 1)}월 
              ${leftPad(date.getDate())}일
            `}
          </span>
          <button
            className={styles.date__next}
            type="button"
            onClick={() => onClickNext()}
            aria-label="다음날"
          />
        </div>
        <div className={styles.header}>
          {CAFETERIA_HEADER.map((menu) => (
            <div
              key={menu.corner}
              className={cn({
                [styles.header__list]: true,
                [styles['header__list--other']]: menu.location !== 'Student-Union',
              })}
            >
              {menu.corner}
            </div>
          ))}
        </div>
        {cafeteriaMenu && cafeteriaMenu !== 'isLoading' && (
          <div className={styles.menu}>
            <div className={styles.menu__morning}>
              <div className={styles.menu__time}>아침</div>
              <PCMenuList
                cafeteriaMenus={cafeteriaMenu}
                cafeteriaList={CAFETERIA_HEADER}
                time="BREAKFAST"
              />
            </div>
            <div className={styles.menu__lunch}>
              <div className={styles.menu__time}>점심</div>
              <PCMenuList
                cafeteriaMenus={cafeteriaMenu}
                cafeteriaList={CAFETERIA_HEADER}
                time="LUNCH"
              />
            </div>
            <div className={styles.menu__dinner}>
              <div className={styles.menu__time}>저녁</div>
              <PCMenuList
                cafeteriaMenus={cafeteriaMenu}
                cafeteriaList={CAFETERIA_HEADER}
                time="DINNER"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CafeteriaPage;
