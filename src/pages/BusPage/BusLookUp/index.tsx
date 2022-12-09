import useBusDirection from 'pages/BusPage/hooks/useBusDirection';
import styles from './BusLookUp.module.scss';

function BusLookUp() {
  const { depart, arrival } = useBusDirection(['한기대', '야우리', '천안역']);
  return (
    <div className={styles.lookup__container}>
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
    </div>
  );
}

export default BusLookUp;
