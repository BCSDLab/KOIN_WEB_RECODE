import WarnIcon from 'assets/svg/Articles/warn.svg';
import styles from './FormFoundPlace.module.scss';

interface FormFoundPlaceProps {
  foundPlace: string;
  setFoundPlace: (foundPlace: string) => void;
  isLocationSelected: boolean;
}

export default function FormFoundPlace({
  foundPlace, setFoundPlace, isLocationSelected,
}: FormFoundPlaceProps) {
  return (
    <div className={styles['found-place']}>
      <span className={styles.title}>습득 장소</span>
      <div className={styles['found-place__wrapper']}>
        <input
          className={styles['found-place__input']}
          defaultValue={foundPlace}
          onBlur={(e) => setFoundPlace(e.target.value)}
          placeholder="습득 장소를 선택해주세요."
        />
        {!isLocationSelected && (
          <span className={styles.warning}>
            <WarnIcon />
            습득 장소가 입력되지 않았습니다.
          </span>
        )}
      </div>
    </div>
  );
}
