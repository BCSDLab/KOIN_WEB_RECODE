import { useState, useRef } from 'react';
import styles from './Radio.module.scss';

interface RadioProps {
  value: string;
  label: string;
  subtitle:string;
  name:string;
  checked: boolean;
  onChange: () => void;
}

export default function Radio({
  value, label, subtitle, name, checked, onChange,
}: RadioProps) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const id = `${name}-${value}`;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value.slice(0, 150);
    setText(newText);

    if (textareaRef.current) {
      textareaRef.current.style.height = '22px';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // 내용 길이에 따라 높이 조절
    }
  };

  return (
    <label
      className={styles.radio}
      aria-label="button"
      htmlFor={id}
    >
      {value === '5' ? (
        <div className={styles['radio__container-etc']}>
          <div className={styles['radio__labelheader-etc']}>
            <div className={styles['radio__content-etc']}>
              <input
                className={styles['radio__input-etc']}
                type="checkbox"
                name={name}
                value={value}
                checked={checked}
                onChange={onChange}
                id={id}
              />
              <div className={styles['radio__label-etc']}>{label}</div>
            </div>
            <div>
              {text.length}
              /150
            </div>
          </div>
          <textarea
            ref={textareaRef}
            className={styles['radio__textarea-etc']}
            placeholder="신고 사유를 입력해주세요."
            value={text}
            onChange={handleChange}
          />
        </div>
      ) : (
        <>
          <input
            className={styles.radio__input}
            type="checkbox"
            name={name}
            value={value}
            checked={checked}
            onChange={onChange}
            id={id}
          />
          <div className={styles.radio__content}>
            <div className={styles.radio__label}>{label}</div>
            <div className={styles.radio__subtitle}>{subtitle}</div>
          </div>
        </>
      )}
    </label>
  );
}
