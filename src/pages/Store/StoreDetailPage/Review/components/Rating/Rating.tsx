import styles from './Rating.module.scss';

interface Props {
  point: '5' | '4' | '3' | '2' | '1';
  rate: number;
  count: number;
}

export default function Rating({ point, rate, count }: Props) {
  return (
    <div className={styles.container}>
      <div>
        {point}
        점
      </div>
      <div className={styles['rate-container']}>
        <div className={styles['bar--empty']} />
        <div className={styles['bar--fill']} style={{ width: `${rate}%` }} />
      </div>
      <div>
        {count}
      </div>
    </div>
  );
}
