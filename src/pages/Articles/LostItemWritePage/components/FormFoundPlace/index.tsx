import WarnIcon from 'assets/svg/Articles/warn.svg';
import styles from './FormFoundPlace.module.scss';

const MAX_LENGTH = 20;

interface FormFoundPlaceProps {
  foundPlace: string;
  setFoundPlace: (foundPlace: string) => void;
  isFoundPlaceSelected: boolean;
}

export default function FormFoundPlace({
  foundPlace, setFoundPlace, isFoundPlaceSelected,
}: FormFoundPlaceProps) {
  const handleChange = (value: string) => {
    if (value.length <= MAX_LENGTH) {
      setFoundPlace(value);
    }
  };

  return (
    <div className={styles['found-place']}>
      <span className={styles.title}>습득 장소</span>
      <div className={styles['found-place__wrapper']}>
        <input
          className={styles['found-place__input']}
          defaultValue={foundPlace}
          onBlur={(e) => handleChange(e.target.value)}
          maxLength={MAX_LENGTH}
          placeholder="습득 장소를 선택해주세요."
        />
        {!isFoundPlaceSelected && (
          <span className={styles.warning}>
            <WarnIcon />
            습득 장소가 입력되지 않았습니다.
          </span>
        )}
      </div>
    </div>
  );
}
