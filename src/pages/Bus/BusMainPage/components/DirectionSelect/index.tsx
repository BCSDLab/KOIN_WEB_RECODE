import ChangeIcon from 'assets/svg/Bus/change-icon.svg';
import PlaceSelect, { PLACE_TYPE_KEYS } from 'pages/Bus/BusMainPage/components/PlaceSelect';
import styles from './DirectionSelect.module.scss';

export default function DirectionSelect() {
  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <div className={styles.direction}>
          <div className={styles.direction_select}>
            <PlaceSelect type={PLACE_TYPE_KEYS.departure} />
          </div>
          <ChangeIcon />
          <div className={styles.direction_select}>
            <PlaceSelect type={PLACE_TYPE_KEYS.destination} />
          </div>
        </div>
        <button
          className={styles['submit-button']}
          type="button"
        >
          조회하기
        </button>
      </div>
    </div>
  );
}
