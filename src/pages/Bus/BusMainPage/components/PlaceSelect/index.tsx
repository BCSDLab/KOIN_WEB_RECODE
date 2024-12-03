import styles from './PlaceSelect.module.scss';

const placeType = {
  departure: {
    title: '출발지',
    placeholder: '출발지를 입력해주세요.',
  },
  destination: {
    title: '도착지',
    placeholder: '도착지를 입력해주세요.',
  },
};

export const PLACE_TYPE_KEYS = {
  departure: 'departure',
  destination: 'destination',
} as const;

interface PlaceSelectProps {
  type: keyof typeof placeType;
}

export default function PlaceSelect({ type }: PlaceSelectProps) {
  const typeInfo = placeType[type];

  return (
    <div className={styles.box}>
      <h1 className={styles.title}>{typeInfo.title}</h1>
      <input
        type="text"
        placeholder={typeInfo.placeholder}
      />
    </div>
  );
}
