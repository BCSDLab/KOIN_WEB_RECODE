import WarnIcon from 'assets/svg/Articles/warn.svg';
import styles from './FormFoundPlace.module.scss';

const MAX_LENGTH = 20;

interface FormFoundPlaceProps {
  foundPlace: string;
  setFoundPlace: (foundPlace: string) => void;
  isFoundPlaceSelected: boolean;
  type: 'FOUND' | 'LOST';
}

export default function FormFoundPlace({
  foundPlace, setFoundPlace, isFoundPlaceSelected, type,
}: FormFoundPlaceProps) {
  const handleChange = (value: string) => {
    if (value.length <= MAX_LENGTH) {
      setFoundPlace(value);
    }
  };

  const placeLabel = type === 'FOUND' ? '습득 장소' : '분실 장소';
  const placeholderText = type === 'FOUND' ? '습득 장소를 선택해주세요.' : '예상되는 분실 장소가 있다면 입력해주세요.';
  const warningText = type === 'FOUND' ? '습득 장소가 입력되지 않았습니다.' : '분실 장소가 입력되지 않았습니다.';

  return (
    <div className={styles['found-place']}>
      <span className={styles.title}>{placeLabel}</span>
      <div className={styles['found-place__wrapper']}>
        <input
          className={styles['found-place__input']}
          defaultValue={foundPlace}
          onBlur={(e) => handleChange(e.target.value)}
          maxLength={MAX_LENGTH}
          placeholder={placeholderText}
        />
        {type === 'FOUND' && !isFoundPlaceSelected && (
          <span className={styles.warning}>
            <WarnIcon />
            {warningText}
          </span>
        )}
      </div>
    </div>
  );
}
