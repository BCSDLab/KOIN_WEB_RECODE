import { useEffect, useRef } from 'react';
import styles from './DetailDescription.module.scss';

interface DetailDescriptionProps {
  value: string;
  onChange: (value: string) => void;
}

export default function DetailDescription({ value, onChange }: DetailDescriptionProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      textareaRef.current.style.maxHeight = '500px';
    }
  }, [value]);

  return (
    <div className={styles.form__item}>
      <div className={styles.form__label}>상세 내용</div>
      <textarea
        id="content"
        className={styles.form__textarea}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="상세 내용을 적어주세요."
        ref={textareaRef}
        maxLength={1500}
      />
    </div>
  );
}
