import { Link } from 'react-router-dom';
import useBusLeftTIme from 'pages/BusPage/hooks/useBusLeftTime';
import { BUS_DIRECTIONS, BUS_TYPES } from 'static/bus';
import cn from 'utils/ts/classnames';
import { useState } from 'react';
import { getLeftTimeString, getStartTimeString, directionToEnglish } from 'pages/BusPage/ts/busModules';
import styles from './IndexBus.module.scss';

const useIndexBusDirection = () => {
  const [toSchoolList, setToSchoolList] = useState([false, false, false]);

  const toggleDirection = (index: number) => {
    const newList = [...toSchoolList];
    newList[index] = !newList[index];
    setToSchoolList(newList);
  };

  return { toSchoolList, toggleDirection };
};

function IndexBus() {
  const { toSchoolList, toggleDirection } = useIndexBusDirection();
  const { data: busData } = useBusLeftTIme({
    departList: toSchoolList.map((depart) => directionToEnglish(BUS_DIRECTIONS[Number(depart)])),
    arrivalList: toSchoolList.map((depart) => directionToEnglish(BUS_DIRECTIONS[Number(!depart)])),
  });

  return (
    <section className={styles.template}>
      <Link to="/bus" className={styles.template__title}>버스/교통</Link>
      <div className={styles.cards}>
        {busData && BUS_TYPES.map(({ key: type, tabName }, idx) => (
          <div key={type} className={styles.cards__card}>
            <div className={cn({ [styles.cards__head]: true, [styles[`cards__head--${type}`]]: true })}>
              <img className={styles['cards__bus-icon']} src="http://static.koreatech.in/assets/img/ic-bus.png" alt="" />
              {tabName}
            </div>
            <div className={styles.cards__body}>
              <span className={styles['cards__remain-time']}>
                {getLeftTimeString(busData[idx]?.now_bus?.remain_time)}
              </span>
              <span className={styles.cards__detail}>
                {typeof busData[idx]?.now_bus?.remain_time === 'number' && (
                  `${getStartTimeString(busData[idx]?.now_bus?.remain_time, true)} 출발`
                )}
              </span>
              <div className={styles.cards__directions}>
                <span>{BUS_DIRECTIONS[Number(toSchoolList[idx])]}</span>
                <button type="button" onClick={() => toggleDirection(idx)} className={styles.cards__toggle}>
                  <img src="http://static.koreatech.in/assets/img/reverse_destination.png" alt="목적지 변경" className={styles['cards__toggle--image']} />
                </button>
                <span>{BUS_DIRECTIONS[Number(!toSchoolList[idx])]}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default IndexBus;
