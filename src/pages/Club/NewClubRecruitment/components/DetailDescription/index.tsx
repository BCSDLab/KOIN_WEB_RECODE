import styles from './DetailDescription.module.scss';

interface DetailDescriptionProps {
  value: string;
  onChange: (value: string) => void;
}

export default function DetailDescription({ value, onChange }: DetailDescriptionProps) {
  return (
    <div className={styles.form__item}>
      <label htmlFor="content" className={styles['form__item-title']}>
        <span className={styles.form__label}>상세 내용</span>
      </label>
      <textarea
        id="content"
        className={styles.form__textarea}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="상세 내용을 적어주세요."
      />
    </div>
  );
}
