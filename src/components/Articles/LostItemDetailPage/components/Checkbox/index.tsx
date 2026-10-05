import { useState, useRef } from 'react';
import styles from './Checkbox.module.scss';

interface CheckboxProps {
  value: string;
  label: string;
  subtitle: string;
  name: string;
  checked: boolean;
  onChange: () => void;
}

export default function Checkbox({ value, label, subtitle, name, checked, onChange }: CheckboxProps) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const id = `${name}-${value}`;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value.slice(0, 150);
    setText(newText);

    if (textareaRef.current) {
      textareaRef.current.style.height = '22px';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`; // 내용 길이에 따라 높이 조절
    }
  };

  return (
    <label className={styles.checkbox} aria-label="button" htmlFor={id}>
      {value === '5' ? (
        <div className={styles['checkbox__container-etc']}>
          <div className={styles['checkbox__labelheader-etc']}>
            <div className={styles['checkbox__content-etc']}>
              <input
                className={styles['checkbox__input-etc']}
                type="checkbox"
                name={name}
                value={value}
                checked={checked}
                onChange={onChange}
                id={id}
              />
              <div className={styles['checkbox__label-etc']}>{label}</div>
            </div>
            <div>
              {text.length}
              /150
            </div>
          </div>
          <textarea
            ref={textareaRef}
            className={styles['checkbox__textarea-etc']}
            placeholder="신고 사유를 입력해주세요."
            value={text}
            onChange={handleChange}
          />
        </div>
      ) : (
        <>
          <input
            className={styles.checkbox__input}
            type="checkbox"
            name={name}
            value={value}
            checked={checked}
            onChange={onChange}
            id={id}
          />
          <div className={styles.checkbox__content}>
            <div className={styles.checkbox__label}>{label}</div>
            <div className={styles.checkbox__subtitle}>{subtitle}</div>
          </div>
        </>
      )}
    </label>
  );
}
