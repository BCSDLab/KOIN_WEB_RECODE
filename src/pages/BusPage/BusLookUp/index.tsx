import { Fragment, Suspense } from 'react';
import cn from 'utils/ts/classnames';
import useBusDirection from 'pages/BusPage/hooks/useBusDirection';
import useBusLeftTIme from 'pages/BusPage/hooks/useBusLeftTime';
import { getLeftTimeString } from 'pages/BusPage/ts/busTimeModules';
import styles from './BusLookUp.module.scss';

const BUS_TYPE = ['shuttle', 'express', 'city'];

function BusLookUp() {
  const { depart, arrival } = useBusDirection(['한기대', '야우리', '천안역']);
  const { data: busData } = useBusLeftTIme({
    departList: [depart.value, depart.value, depart.value],
    arrivalList: [arrival.value, arrival.value, arrival.value],
  });

  return (
    <div className={styles.lookup}>
      <h1 className={styles.lookup__title}>버스 / 교통 운행정보</h1>
      <div className={styles.lookup__description}>
        <h2 className={styles.lookup__subtitle}>
          어디를 가시나요?
          <br />
          운행수단별로 간단히 비교해드립니다.
        </h2>
        <div>
          <select
            className={styles.lookup__select}
            onChange={depart.handleChange}
            value={depart.value}
          >
            {depart.options.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
          에서
          <select
            className={styles.lookup__select}
            onChange={arrival.handleChange}
            value={arrival.value}
          >
            {arrival.options.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
          갑니다
        </div>
      </div>
      <Suspense fallback={<div />}>
        <div className={styles.cards}>
          {BUS_TYPE.map((type, idx) => (
            <Fragment key={type}>
              <div className={cn({ [styles['cards__top-card']]: true, [styles[`cards__card--${type}`]]: true })}>
                <div className={styles.cards__content}>
                  <div>
                    <div className={styles.cards__direction}>
                      <span className={styles.cards__badge}>
                        출발
                      </span>
                      {depart.options[0]}
                    </div>
                    <div className={styles.cards__direction}>
                      <span className={styles.cards__badge}>
                        도착
                      </span>
                      {arrival.options[0]}
                    </div>
                  </div>
                  <span>400번 버스</span>
                </div>
                <div className={styles['cards__content--description']}>
                  <span>{getLeftTimeString(busData[idx].data?.now_bus?.remain_time)}</span>
                  <span>시내버스</span>
                </div>
              </div>
              <div className={cn({ [styles['cards__bottom-card']]: true, [styles[`cards__card--${type}`]]: true })}>
                하단
              </div>
            </Fragment>
          ))}
        </div>
      </Suspense>
    </div>
  );
}

export default BusLookUp;
