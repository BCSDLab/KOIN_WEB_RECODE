import React from 'react';
import cn from 'utils/ts/classnames';
import { CAFETERIA_HEADER } from 'static/cafeteria';
import { leftPad } from 'utils/hooks/useDate';
import styles from './CafeteriaPage.module.scss';

function CafeteriaPage() {
  const [date, setDate] = React.useState<Date>(new Date());
  const onClickPrev = () => {
    setDate(new Date(date.setDate(date.getDate() - 1)));
  };
  const onClickNext = () => {
    setDate(new Date(date.setDate(date.getDate() + 1)));
  };

  console.log(date);
  return (
    <div className={styles.template}>
      <div className={styles.content}>
        <div className={styles.title}>오늘의 식단</div>
        <div className={styles.date}>
          <button className={styles.date__prev} type="button" onClick={() => onClickPrev()} aria-label="이전날" />
          <span className={styles.date__title}>
            {
            `${date.getFullYear()}년 ${leftPad(date.getMonth())}월 ${leftPad(date.getDate())}일`
          }
          </span>
          <button className={styles.date__next} type="button" onClick={() => onClickNext()} aria-label="다음날" />
        </div>
        <div className={styles.header}>
          {
          CAFETERIA_HEADER.map((menu) => (
            <div
              className={cn({
                [styles.header__list]: true,
                [styles['header__list--other']]: menu.location !== 'Student-Union',
              })}
            >
              {menu.corner}
            </div>
          ))
          }
        </div>
        <div className={styles.menu}>
          <div className={styles.menu__morning}>
            <div className={styles.menu__time}>
              아침
            </div>
          </div>
          <div className={styles.menu__lunch}>
            <div className={styles.menu__time}>
              점심
            </div>
          </div>
          <div className={styles.menu__dinner}>
            <div className={styles.menu__time}>
              저녁
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CafeteriaPage;
